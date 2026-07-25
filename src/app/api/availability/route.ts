import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(request.url);
  const tutorId = url.searchParams.get("tutor_id");

  if (tutorId) {
    const { data: tutor } = await supabase.from("tutors").select("id").eq("id", tutorId).single();
    if (!tutor) return NextResponse.json({ error: "Tutor not found" }, { status: 404 });
    const { data, error } = await supabase.from("availability_rules").select("*").eq("tutor_id", tutor.id).order("day_of_week").order("start_time");
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data || []);
  }

  // Get own availability
  const { data: tutor } = await supabase.from("tutors").select("id").eq("user_id", user.id).single();
  if (!tutor) return NextResponse.json({ error: "Tutor profile not found" }, { status: 404 });
  const { data, error } = await supabase.from("availability_rules").select("*").eq("tutor_id", tutor.id).order("day_of_week").order("start_time");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data || []);
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: tutor } = await supabase.from("tutors").select("id").eq("user_id", user.id).single();
  if (!tutor) return NextResponse.json({ error: "Tutor profile not found" }, { status: 404 });

  const body = await request.json();
  const { day_of_week, start_time, end_time } = body;

  if (day_of_week === undefined || !start_time || !end_time) {
    return NextResponse.json({ error: "Missing required fields: day_of_week, start_time, end_time" }, { status: 400 });
  }

  const { data, error } = await supabase.from("availability_rules").insert({
    tutor_id: tutor.id, day_of_week, start_time, end_time,
  }).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(request.url);
  const ruleId = url.searchParams.get("id");
  if (!ruleId) return NextResponse.json({ error: "Missing rule id" }, { status: 400 });

  const { error } = await supabase.from("availability_rules").delete().eq("id", ruleId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
