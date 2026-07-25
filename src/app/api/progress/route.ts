import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase.from("progress_records").select("*").eq("student_id", user.id).order("recorded_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data || []);
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { metric_type, metric_value, notes } = await request.json();
  if (!metric_type || metric_value === undefined) return NextResponse.json({ error: "metric_type and metric_value required" }, { status: 400 });

  const { data, error } = await supabase.from("progress_records").insert({
    student_id: user.id, metric_type, metric_value, recorded_by: user.id, notes,
  }).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
