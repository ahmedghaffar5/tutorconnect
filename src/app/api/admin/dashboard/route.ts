import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getSafeClient } from "@/lib/supabase/safe-admin";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase.from("users").select("role").eq("id", user.id).single();
  const userRole = profile?.role || (user.user_metadata as any)?.role;
  if (userRole !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const db = getSafeClient();

    const [students, tutors, bookings, flags, messages, apps, subjects, payments, logs, users] = await Promise.all([
      db.from("users").select("*", { count: "exact", head: true }).eq("role", "student"),
      db.from("tutors").select("*"),
      db.from("bookings").select("*, subjects(name)").order("created_at", { ascending: false }).limit(50),
      db.from("feature_flags").select("*"),
      db.from("contact_messages").select("*").order("created_at", { ascending: false }).limit(20),
      db.from("teacher_applications").select("*").order("created_at", { ascending: false }).limit(50),
      db.from("subjects").select("*").order("name"),
      db.from("payments").select("*").order("created_at", { ascending: false }).limit(50),
      db.from("audit_logs").select("*, users(full_name, email)").order("created_at", { ascending: false }).limit(30),
      db.from("users").select("*").order("created_at", { ascending: false }),
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
