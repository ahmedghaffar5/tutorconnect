import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data } = await supabase.from("favorites").select("tutor_id").eq("user_id", user.id);
  return NextResponse.json(data?.map((f) => f.tutor_id) || []);
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { tutorId } = await request.json();
  const { error } = await supabase.from("favorites").insert({ user_id: user.id, tutor_id: tutorId });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(request.url);
  const tutorId = url.searchParams.get("tutorId");
  if (!tutorId) return NextResponse.json({ error: "Missing tutorId" }, { status: 400 });

  await supabase.from("favorites").delete().eq("user_id", user.id).eq("tutor_id", tutorId);
  return NextResponse.json({ success: true });
}
