import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  try {
    const admin = createAdminClient();

    const [students, tutors, bookings, flags, messages, apps, subjects, payments, logs, users] = await Promise.all([
      admin.from("users").select("*", { count: "exact", head: true }).eq("role", "student"),
      admin.from("tutors").select("*"),
      admin.from("bookings").select("*").order("created_at", { ascending: false }).limit(50),
      admin.from("feature_flags").select("*"),
      admin.from("contact_messages").select("*").order("created_at", { ascending: false }).limit(20),
      admin.from("teacher_applications").select("*").order("created_at", { ascending: false }).limit(50),
      admin.from("subjects").select("*").order("name"),
      admin.from("payments").select("*").order("created_at", { ascending: false }).limit(50),
      admin.from("audit_logs").select("*, users(full_name, email)").order("created_at", { ascending: false }).limit(30),
      admin.from("users").select("*").order("created_at", { ascending: false }),
    ]);

    return NextResponse.json({
      totalStudents: students.count || 0,
      totalTutors: tutors.data?.length || 0,
      totalBookings: bookings.data?.length || 0,
      totalRevenue: (payments.data || []).reduce((s: number, p: any) => s + (p.amount || 0), 0),
      tutors: tutors.data || [],
      bookings: bookings.data || [],
      flags: flags.data || [],
      messages: messages.data || [],
      applications: apps.data || [],
      subjects: subjects.data || [],
      payments: payments.data || [],
      logs: logs.data || [],
      users: users.data || [],
      pendingTutors: (tutors.data || []).filter((t: any) => !t.is_approved),
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Failed to load dashboard data" }, { status: 500 });
  }
}
