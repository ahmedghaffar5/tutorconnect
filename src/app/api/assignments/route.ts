import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase.from("users").select("role").eq("id", user.id).single();
  const role = profile?.role || (user.user_metadata as any)?.role;

  let query;
  if (role === "tutor") {
    const { data: tutor } = await supabase.from("tutors").select("id").eq("user_id", user.id).single();
    if (!tutor) return NextResponse.json({ error: "Tutor profile not found" }, { status: 404 });
    query = supabase.from("assignments").select("*, users!student_id(full_name)").eq("tutor_id", tutor.id).order("created_at", { ascending: false });
  } else {
    query = supabase.from("assignments").select("*").eq("student_id", user.id).order("created_at", { ascending: false });
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data || []);
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase.from("users").select("role").eq("id", user.id).single();
  if (profile?.role !== "tutor") return NextResponse.json({ error: "Only tutors can create assignments" }, { status: 403 });

  const { data: tutor } = await supabase.from("tutors").select("id").eq("user_id", user.id).single();
  if (!tutor) return NextResponse.json({ error: "Tutor profile not found" }, { status: 404 });

  const body = await request.json();
  const { data, error } = await supabase.from("assignments").insert({
    tutor_id: tutor.id, student_id: body.student_id, title: body.title,
    description: body.description || "", due_at: body.due_at, status: "assigned",
  }).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
