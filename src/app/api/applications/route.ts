import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { logAudit } from "@/lib/audit";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase.from("users").select("role, admin_role").eq("id", user.id).single();
  const userRole = profile?.role || (user.user_metadata as any)?.role || "student";

  const admin = createAdminClient();

  if (userRole === "admin" || profile?.admin_role) {
    const { data, error } = await admin.from("teacher_applications").select("*, users(full_name, email)").order("created_at", { ascending: false });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  }

  const { data, error } = await supabase.from("teacher_applications").select("*").eq("user_id", user.id).single();
  if (error && error.code !== "PGRST116") return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data || null);
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { data: existing } = await supabase.from("teacher_applications").select("id").eq("user_id", user.id).single();

  let result;
  if (existing) {
    result = await supabase.from("teacher_applications").update(body).eq("id", existing.id).select().single();
  } else {
    result = await supabase.from("teacher_applications").insert({ user_id: user.id, ...body }).select().single();
  }

  if (result.error) return NextResponse.json({ error: result.error.message }, { status: 500 });
  return NextResponse.json(result.data);
}
