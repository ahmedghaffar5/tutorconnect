import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase.from("users").select("role").eq("id", user.id).single();
  const role = profile?.role || (user.user_metadata as any)?.role;
  const url = new URL(request.url);
  const status = url.searchParams.get("status");
  const limit = parseInt(url.searchParams.get("limit") || "20");

  let query;
  if (role === "admin") {
    query = createAdminClient().from("bookings").select("*, subjects(name), tutors!inner(user_id)").order("created_at", { ascending: false }).limit(limit);
  } else if (role === "tutor") {
    const { data: tutor } = await supabase.from("tutors").select("id").eq("user_id", user.id).single();
    if (!tutor) return NextResponse.json({ error: "Tutor profile not found" }, { status: 404 });
    query = supabase.from("bookings").select("*, subjects(name)").eq("tutor_id", tutor.id).order("created_at", { ascending: false }).limit(limit);
  } else {
    query = supabase.from("bookings").select("*, subjects(name)").eq("student_id", user.id).order("created_at", { ascending: false }).limit(limit);
  }

  if (status) query = query.eq("status", status);
  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data || []);
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { tutor_id, subject_id, scheduled_at, booking_type, student_name, notes, booking_mode } = body;

  if (!tutor_id || !subject_id || !scheduled_at) {
    return NextResponse.json({ error: "Missing required fields: tutor_id, subject_id, scheduled_at" }, { status: 400 });
  }

  const { data, error } = await supabase.from("bookings").insert({
    student_id: user.id, tutor_id, subject_id, booking_type: booking_type || "paid",
    scheduled_at, status: "pending", student_name: student_name || user.user_metadata?.full_name,
    notes, booking_mode: booking_mode || "instant",
  }).select("*, subjects(name)").single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Create booking participants
  const admin = createAdminClient();
  await admin.from("booking_participants").insert([
    { booking_id: data.id, user_id: user.id, role: "student" },
  ]);
  const { data: tutor } = await supabase.from("tutors").select("user_id").eq("id", tutor_id).single();
  if (tutor) {
    await admin.from("booking_participants").insert({ booking_id: data.id, user_id: tutor.user_id, role: "tutor" });
  }

  return NextResponse.json(data);
}
