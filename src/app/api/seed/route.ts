import { NextResponse } from "next/server";
import { getSafeClient } from "@/lib/supabase/safe-admin";

export async function GET() {
  try {
    const db = getSafeClient();

    // Check if already seeded
    const { count } = await db.from("tutors").select("*", { count: "exact", head: true });
    if (count && count > 0) {
      return NextResponse.json({ message: `Data already exists: ${count} tutors`, seeded: true });
    }

    const results: string[] = [];

    // 1. Create admin users
    const { data: admins } = await db.from("users").insert([
      { full_name: "Admin User", email: "admin@tutorconnect.com", role: "admin", account_status: "active", timezone: "America/New_York" },
      { full_name: "Sarah Review", email: "sarah.review@tutorconnect.com", role: "admin", account_status: "active", timezone: "America/New_York" },
    ]).select();
    if (admins?.length) results.push(`Created ${admins.length} admins`);
    if (admins?.[0]) {
      await db.from("admin_permissions").insert({ user_id: admins[0].id, admin_role: "super_admin" });
      await db.from("admin_permissions").insert({ user_id: admins[1]?.id, admin_role: "tutor_reviewer" });
    }

    // 2. Get subject IDs
    const { data: subjects } = await db.from("subjects").select("id, name");
    const subMap = Object.fromEntries((subjects || []).map((s: any) => [s.name, s.id]));

    // 3. Create tutors
    const tutorUsers = await db.from("users").insert([
      { full_name: "Dr. Sarah Chen", email: "sarah.chen@tutorconnect.com", role: "tutor", account_status: "active", timezone: "America/New_York" },
      { full_name: "Prof. James Wilson", email: "james.wilson@tutorconnect.com", role: "tutor", account_status: "active", timezone: "America/Los_Angeles" },
      { full_name: "Ms. Elena Rodriguez", email: "elena.r@tutorconnect.com", role: "tutor", account_status: "active", timezone: "America/Chicago" },
      { full_name: "Dr. Michael Hart", email: "michael.hart@tutorconnect.com", role: "tutor", account_status: "active", timezone: "America/New_York" },
      { full_name: "Prof. Alex Rivera", email: "alex.rivera@tutorconnect.com", role: "tutor", account_status: "active", timezone: "America/Denver" },
    ]).select();

    if (!tutorUsers.data?.length) return NextResponse.json({ error: "Failed to create tutor users", results }, { status: 500 });
    const tutorUserIds = tutorUsers.data.map((u: any) => u.id);
    results.push(`Created ${tutorUserIds.length} tutor users`);

    // Create tutor profiles
    const tutorProfiles = [
      { user_id: tutorUserIds[0], bio: "PhD in Mathematics from MIT. 15+ years experience.", experience_years: 15, qualification: "PhD Mathematics, MIT", hourly_rate: 65, is_approved: true, languages: "English, Mandarin" },
      { user_id: tutorUserIds[1], bio: "Full-stack developer. Expert in React, Node.js, Python.", experience_years: 10, qualification: "MSc Computer Science, Stanford", hourly_rate: 55, is_approved: true, languages: "English" },
      { user_id: tutorUserIds[2], bio: "Native Spanish speaker. Teaching languages for 8 years.", experience_years: 8, qualification: "MA Linguistics, Barcelona", hourly_rate: 45, is_approved: true, languages: "Spanish, English, French" },
      { user_id: tutorUserIds[3], bio: "PhD in Physics, published researcher. Making science accessible.", experience_years: 12, qualification: "PhD Physics, Caltech", hourly_rate: 60, is_approved: true, languages: "English" },
      { user_id: tutorUserIds[4], bio: "Software engineer teaching coding to beginners and advanced students.", experience_years: 7, qualification: "BSc Computer Science, MIT", hourly_rate: 50, is_approved: true, languages: "English, Hindi" },
    ];

    const { data: tutors } = await db.from("tutors").insert(tutorProfiles).select();
    if (!tutors?.length) return NextResponse.json({ error: "Failed to create tutors", results }, { status: 500 });
    results.push(`Created ${tutors.length} tutor profiles`);

    // Link subjects to tutors
    const subjectLinks = [
      { tutor_idx: 0, subjects: ["Mathematics", "Physics"] },
      { tutor_idx: 1, subjects: ["Computer Science", "Coding"] },
      { tutor_idx: 2, subjects: ["English", "Urdu"] },
      { tutor_idx: 3, subjects: ["Physics", "Chemistry", "Mathematics"] },
      { tutor_idx: 4, subjects: ["Computer Science", "Coding"] },
    ];

    for (const link of subjectLinks) {
      for (const subj of link.subjects) {
        if (subMap[subj]) {
          await db.from("tutor_subjects").insert({ tutor_id: tutors[link.tutor_idx].id, subject_id: subMap[subj] });
        }
      }
    }
    results.push("Linked subjects to tutors");

    // 4. Create students
    const students = await db.from("users").insert([
      { full_name: "Alex Johnson", email: "alex.j@example.com", role: "student", account_status: "active" },
      { full_name: "Maya Rivers", email: "maya.r@example.com", role: "student", account_status: "active" },
      { full_name: "Leo Rivers", email: "leo.r@example.com", role: "student", account_status: "active" },
    ]).select();
    const studentIds = students.data?.map((u: any) => u.id) || [];
    results.push(`Created ${studentIds.length} students`);

    // 5. Create parent + household
    const parent = await db.from("users").insert([
      { full_name: "David Rivers", email: "david.r@example.com", role: "parent", account_status: "active" },
    ]).select();
    const parentId = parent.data?.[0]?.id;
    if (parentId) {
      results.push("Created parent");
      const { data: hh } = await db.from("households").insert({ name: "Rivers Family", primary_billing_guardian_id: parentId }).select();
      if (hh?.[0]) {
        await db.from("household_members").insert([
          { household_id: hh[0].id, user_id: parentId, role_in_household: "guardian" },
          { household_id: hh[0].id, user_id: studentIds[1], role_in_household: "student" },
          { household_id: hh[0].id, user_id: studentIds[2], role_in_household: "student" },
        ]);
        await db.from("guardian_student_links").insert([
          { guardian_id: parentId, student_id: studentIds[1], relationship: "Father", is_billing_responsible: true },
          { guardian_id: parentId, student_id: studentIds[2], relationship: "Father", is_billing_responsible: true },
        ]);
        results.push("Created household + links");
      }
    }

    // 6. Create bookings
    const { data: mathSubj } = await db.from("subjects").select("id").eq("name", "Mathematics").single();
    const { data: physSubj } = await db.from("subjects").select("id").eq("name", "Physics").single();
    const { data: engSubj } = await db.from("subjects").select("id").eq("name", "English").single();

    if (tutors[0] && mathSubj && studentIds[0]) {
      await db.from("bookings").insert({
        student_id: studentIds[0], tutor_id: tutors[0].id, subject_id: mathSubj.id,
        booking_type: "trial", scheduled_at: new Date(Date.now() + 2*86400000).toISOString(),
        status: "confirmed", student_name: "Alex Johnson", booking_mode: "instant",
      });
    }
    if (tutors[3] && physSubj && studentIds[1]) {
      await db.from("bookings").insert({
        student_id: studentIds[1], tutor_id: tutors[3].id, subject_id: physSubj.id,
        booking_type: "paid", scheduled_at: new Date(Date.now() + 5*86400000).toISOString(),
        status: "confirmed", student_name: "Maya Rivers", booking_mode: "instant",
      });
    }
    if (tutors[2] && engSubj && studentIds[2]) {
      await db.from("bookings").insert({
        student_id: studentIds[2], tutor_id: tutors[2].id, subject_id: engSubj.id,
        booking_type: "paid", scheduled_at: new Date(Date.now() + 7*86400000).toISOString(),
        status: "pending", student_name: "Leo Rivers", booking_mode: "tutor_approval",
      });
    }
    results.push("Created bookings");

    // 7. Learning goals
    if (studentIds[0]) {
      await db.from("learning_goals").insert([
        { student_id: studentIds[0], title: "Ace SAT Math", target_date: "2026-12-15", status: "active", progress_pct: 65 },
        { student_id: studentIds[0], title: "Complete AP Calculus", target_date: "2027-03-01", status: "active", progress_pct: 30 },
      ]);
    }
    if (studentIds[1]) {
      await db.from("learning_goals").insert([
        { student_id: studentIds[1], title: "Master Quantum Physics", target_date: "2026-11-01", status: "active", progress_pct: 45 },
      ]);
    }
    if (studentIds[2]) {
      await db.from("learning_goals").insert([
        { student_id: studentIds[2], title: "Improve Creative Writing", target_date: "2026-12-01", status: "active", progress_pct: 70 },
      ]);
    }
    results.push("Created learning goals");

    // 8. Progress records
    if (studentIds[0]) {
      await db.from("progress_records").insert([
        { student_id: studentIds[0], metric_type: "hours_studied", metric_value: 24.5, notes: "This month" },
        { student_id: studentIds[0], metric_type: "avg_score", metric_value: 87, notes: "Average assessment score" },
      ]);
    }
    if (studentIds[1]) {
      await db.from("progress_records").insert([
        { student_id: studentIds[1], metric_type: "hours_studied", metric_value: 18.5, notes: "This month" },
        { student_id: studentIds[1], metric_type: "avg_score", metric_value: 92, notes: "Average assessment score" },
      ]);
    }
    results.push("Created progress records");

    // 9. Reviews
    if (tutors[0] && studentIds[0]) {
      await db.from("reviews").insert({ student_id: studentIds[0], tutor_id: tutors[0].id, rating: 5, comment: "Dr. Chen is an amazing tutor!", is_approved: true });
    }
    if (tutors[3] && studentIds[1]) {
      await db.from("reviews").insert({ student_id: studentIds[1], tutor_id: tutors[3].id, rating: 4, comment: "Great tutor! Helped me understand physics.", is_approved: true });
    }
    results.push("Created reviews");

    // 10. Notifications
    if (studentIds[0]) {
      await db.from("notifications").insert({ user_id: studentIds[0], type: "booking_confirmed", title: "Lesson Confirmed!", body: "Your trial session is confirmed." });
    }
    if (tutorUserIds[0]) {
      await db.from("notifications").insert({ user_id: tutorUserIds[0], type: "new_booking", title: "New Booking", body: "A student booked a session with you." });
    }
    if (parentId) {
      await db.from("notifications").insert({ user_id: parentId, type: "booking_confirmed", title: "Lesson Booked for Maya", body: "Maya has a Physics lesson confirmed." });
    }
    if (studentIds[1]) {
      await db.from("notifications").insert({ user_id: studentIds[1], type: "assignment_due", title: "Assignment Due Soon", body: "Your Physics Lab Report is due in 7 days." });
    }
    results.push("Created notifications");

    // 11. Audit logs
    if (admins?.[0]) {
      await db.from("audit_logs").insert({ user_id: admins[0].id, action: "admin_session_started", entity_type: "session", entity_id: "sess_001", details: { ip: "192.168.1.1" } });
    }
    results.push("Created audit logs");

    return NextResponse.json({
      message: "Seed complete! Refresh the site to see data.",
      results,
      counts: { tutors: tutors.length, students: studentIds.length, bookings: 3, goals: 4, reviews: 2 }
    });

  } catch (e: any) {
    console.error("Seed error:", e);
    return NextResponse.json({ error: e.message || "Seed failed", hint: "Check if schema-v3.sql was run first" }, { status: 500 });
  }
}
