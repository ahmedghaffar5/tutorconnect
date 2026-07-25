import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
  const logs: string[] = [];
  const add = (msg: string) => logs.push(msg);

  try {
    add("Starting seed...");

    // Create a direct admin client
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

    add(`SUPABASE_SERVICE_ROLE_KEY set: ${serviceKey ? serviceKey.substring(0, 15) + "..." : "NO"}`);
    add(`NEXT_PUBLIC_SUPABASE_URL set: ${supabaseUrl ? "YES" : "NO"}`);

    if (!serviceKey || !supabaseUrl) {
      return NextResponse.json({ error: "Missing env vars", logs });
    }

    const db = createClient(supabaseUrl, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // Test connection - simple query
    try {
      const { error: testError } = await db.from("subjects").select("id").limit(1);
      if (testError) {
        add(`Connection test: FAIL - ${testError.message || "Unknown error"}`);
        return NextResponse.json({ error: "Cannot connect to database. Run schema-v3.sql first in Supabase SQL editor.", logs });
      }
      add("Connection test: OK (subjects accessible)");
    } catch (e: any) {
      add(`Connection test: EXCEPTION - ${e.message}`);
      return NextResponse.json({ error: "Database connection error: " + e.message, logs });
    }

    // Check if tutors already exist
    const { count: existingCount } = await db.from("tutors").select("*", { count: "exact", head: true });
    add(`Existing tutors: ${existingCount || 0}`);
    if (existingCount && existingCount > 0) {
      return NextResponse.json({ message: "Data already seeded!", tutors: existingCount, logs });
    }

    add("Deleting existing data...");
    // Delete in reverse dependency order
    const tables = ["notifications", "audit_logs", "reviews", "submissions", "grades", "assignment_attachments", "assignments", "progress_records", "learning_goals", "booking_participants", "booking_status_history", "slot_holds", "attendance_records", "session_notes", "tutor_product_prices", "availability_rules", "tutor_subjects", "tutors", "guardian_student_links", "household_members", "households", "admin_permissions", "user_sessions", "consents", "teacher_applications", "favorites"];
    for (const table of tables) {
      try { await db.from(table).delete().neq("id", "00000000-0000-0000-0000-000000000000"); } catch {}
    }
    try { await db.from("users").delete().neq("id", "00000000-0000-0000-0000-000000000000"); } catch (e: any) { add(`Delete users warning: ${e.message}`); }
    add("Cleared old data");

    // 1. Create admin users
    add("Creating admin users...");
    const { data: admins, error: adminsErr } = await db.from("users").insert([
      { full_name: "Admin User", email: "admin@tutorconnect.com", role: "admin", account_status: "active", timezone: "America/New_York" },
    ]).select();
    if (adminsErr) return NextResponse.json({ error: "Admin insert failed: " + adminsErr.message, logs });
    add(`Created admin: ${admins?.[0]?.id}`);

    // Admin permissions
    if (admins?.[0]) {
      const { error: permErr } = await db.from("admin_permissions").insert([
        { user_id: admins[0].id, admin_role: "super_admin" },
      ]);
      add(permErr ? "Admin perm warning: " + permErr.message : "Admin permissions set");
    }

    // 2. Get subjects
    const { data: subjects } = await db.from("subjects").select("id, name");
    const subMap = Object.fromEntries((subjects || []).map((s: any) => [s.name, s.id]));
    add(`Subjects loaded: ${Object.keys(subMap).length}`);

    if (Object.keys(subMap).length === 0) {
      return NextResponse.json({ error: "No subjects found. Run schema-v3.sql first.", logs });
    }

    // 3. Create tutor user accounts
    add("Creating tutor user accounts...");
    const tutorEmails = [
      ["Dr. Sarah Chen", "sarah.chen@tutorconnect.com"],
      ["Prof. James Wilson", "james.wilson@tutorconnect.com"],
      ["Ms. Elena Rodriguez", "elena.r@tutorconnect.com"],
      ["Dr. Michael Hart", "michael.hart@tutorconnect.com"],
      ["Prof. Alex Rivera", "alex.rivera@tutorconnect.com"],
    ];

    const tutorUserIds: string[] = [];
    for (const [name, email] of tutorEmails) {
      const { data: u, error: uErr } = await db.from("users").insert({
        full_name: name, email, role: "tutor", account_status: "active", timezone: "America/New_York",
      }).select();
      if (uErr) {
        add(`Failed to create ${name}: ${uErr.message}`);
        // Try fetching existing
        const { data: existing } = await db.from("users").select("id").eq("email", email).maybeSingle();
        if (existing?.id) { tutorUserIds.push(existing.id); add(`   Found existing: ${existing.id}`); }
      } else if (u?.[0]?.id) {
        tutorUserIds.push(u[0].id);
        add(`Created ${name}: ${u[0].id.substring(0, 8)}...`);
      }
    }

    if (tutorUserIds.length === 0) {
      return NextResponse.json({ error: "Could not create any tutor users. Check database permissions.", logs });
    }
    add(`Total tutor users: ${tutorUserIds.length}`);

    // 4. Create tutor profiles
    add("Creating tutor profiles...");
    const tutorData = [
      { user_id: tutorUserIds[0], bio: "PhD in Mathematics from MIT. 15+ years experience.", hourly_rate: 65, qualification: "PhD Mathematics, MIT", experience_years: 15, languages: "English, Mandarin" },
      { user_id: tutorUserIds[1] || tutorUserIds[0], bio: "Full-stack developer. Expert in React, Node.js.", hourly_rate: 55, qualification: "MSc Computer Science, Stanford", experience_years: 10, languages: "English" },
      { user_id: tutorUserIds[2] || tutorUserIds[0], bio: "Native Spanish speaker. Teaching languages for 8 years.", hourly_rate: 45, qualification: "MA Linguistics, Barcelona", experience_years: 8, languages: "Spanish, English, French" },
      { user_id: tutorUserIds[3] || tutorUserIds[0], bio: "PhD in Physics, published researcher.", hourly_rate: 60, qualification: "PhD Physics, Caltech", experience_years: 12, languages: "English" },
      { user_id: tutorUserIds[4] || tutorUserIds[0], bio: "Software engineer teaching coding.", hourly_rate: 50, qualification: "BSc Computer Science, MIT", experience_years: 7, languages: "English, Hindi" },
    ];

    const tutorProfiles: any[] = [];
    for (const t of tutorData) {
      const { data: tp, error: tpErr } = await db.from("tutors").insert({
        ...t, is_approved: true,
      }).select();
      if (tpErr) add(`Tutor profile error: ${tpErr.message}`);
      else if (tp?.[0]) tutorProfiles.push(tp[0]);
    }
    add(`Tutor profiles created: ${tutorProfiles.length}`);

    // 5. Link subjects
    add("Linking subjects to tutors...");
    const subjectLinks = [
      { idx: 0, subs: ["Mathematics", "Physics"] },
      { idx: 1, subs: ["Computer Science", "Coding"] },
      { idx: 2, subs: ["English", "Urdu"] },
      { idx: 3, subs: ["Physics", "Chemistry", "Mathematics"] },
      { idx: 4, subs: ["Computer Science", "Coding"] },
    ];
    for (const link of subjectLinks) {
      const tutor = tutorProfiles[link.idx];
      if (!tutor) continue;
      for (const subj of link.subs) {
        if (subMap[subj]) {
          const { error: tsErr } = await db.from("tutor_subjects").insert({ tutor_id: tutor.id, subject_id: subMap[subj] });
          if (tsErr) add(`  Link error (${subj}): ${tsErr.message}`);
        }
      }
    }
    add("Subjects linked");

    // 6. Create students
    add("Creating students...");
    const studentEmails = [
      ["Alex Johnson", "alex.j@example.com"],
      ["Maya Rivers", "maya.r@example.com"],
      ["Leo Rivers", "leo.r@example.com"],
    ];
    const studentIds: string[] = [];
    for (const [name, email] of studentEmails) {
      const { data: s, error: sErr } = await db.from("users").insert({
        full_name: name, email, role: "student", account_status: "active",
      }).select();
      if (sErr) add(`Student error ${name}: ${sErr.message}`);
      else if (s?.[0]?.id) studentIds.push(s[0].id);
    }
    add(`Students created: ${studentIds.length}`);

    // 7. Parent + household
    add("Creating parent...");
    const { data: parentData, error: parentErr } = await db.from("users").insert({
      full_name: "David Rivers", email: "david.r@example.com", role: "parent", account_status: "active",
    }).select();
    const parentId = parentData?.[0]?.id;
    add(parentErr ? `Parent error: ${parentErr.message}` : `Parent: ${parentId}`);

    if (parentId && studentIds.length >= 2) {
      const { data: hh } = await db.from("households").insert({
        name: "Rivers Family", primary_billing_guardian_id: parentId,
      }).select();
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
        add("Household + links created");
      }
    }

    // 8. Bookings
    if (tutorProfiles[0] && subMap["Mathematics"] && studentIds[0]) {
      await db.from("bookings").insert({
        student_id: studentIds[0], tutor_id: tutorProfiles[0].id, subject_id: subMap["Mathematics"],
        booking_type: "trial", scheduled_at: new Date(Date.now() + 2*86400000).toISOString(),
        status: "confirmed", student_name: "Alex Johnson",
      });
      add("Booking 1 (trial) created");
    }
    if (tutorProfiles[3] && subMap["Physics"] && studentIds[1]) {
      await db.from("bookings").insert({
        student_id: studentIds[1], tutor_id: tutorProfiles[3].id, subject_id: subMap["Physics"],
        booking_type: "paid", scheduled_at: new Date(Date.now() + 5*86400000).toISOString(),
        status: "confirmed", student_name: "Maya Rivers",
      });
      add("Booking 2 (paid) created");
    }

    // 9. Learning goals
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
    add("Learning goals created");

    // 10. Progress records
    if (studentIds[0]) {
      await db.from("progress_records").insert([
        { student_id: studentIds[0], metric_type: "hours_studied", metric_value: 24.5, notes: "This month" },
        { student_id: studentIds[0], metric_type: "avg_score", metric_value: 87, notes: "Average score" },
      ]);
    }
    add("Progress records created");

    // 11. Reviews
    if (tutorProfiles[0] && studentIds[0]) {
      await db.from("reviews").insert({
        student_id: studentIds[0], tutor_id: tutorProfiles[0].id, rating: 5,
        comment: "Dr. Chen is an amazing tutor!", is_approved: true,
      });
    }
    if (tutorProfiles[3] && studentIds[1]) {
      await db.from("reviews").insert({
        student_id: studentIds[1], tutor_id: tutorProfiles[3].id, rating: 4,
        comment: "Great tutor! Helped me understand physics.", is_approved: true,
      });
    }
    add("Reviews created");

    // 12. Notifications
    const notifs: any[] = [];
    if (studentIds[0]) notifs.push({ user_id: studentIds[0], type: "booking_confirmed", title: "Lesson Confirmed!", body: "Your trial session is confirmed." });
    if (tutorUserIds[0]) notifs.push({ user_id: tutorUserIds[0], type: "new_booking", title: "New Booking", body: "A student booked a session with you." });
    if (parentId) notifs.push({ user_id: parentId, type: "booking_confirmed", title: "Lesson Booked for Maya", body: "Maya has a Physics lesson confirmed." });
    if (studentIds[1]) notifs.push({ user_id: studentIds[1], type: "assignment_due", title: "Assignment Due", body: "Your Physics Lab Report is due soon." });
    if (notifs.length > 0) await db.from("notifications").insert(notifs);
    add("Notifications created");

    return NextResponse.json({
      success: true,
      message: "Database seeded successfully! Refresh the site to see all data.",
      summary: {
        tutors: tutorProfiles.length,
        students: studentIds.length,
        bookings: 2,
        goals: 4,
        reviews: 2,
        notifications: notifs.length,
      },
      logs,
    });

  } catch (e: any) {
    return NextResponse.json({
      error: e.message || "Unknown error",
      stack: e.stack?.split("\n").slice(0, 5).join("\n"),
      hint: "Make sure schema-v3.sql was run in Supabase SQL editor first (with RLS enabled)",
      logs,
    }, { status: 500 });
  }
}
