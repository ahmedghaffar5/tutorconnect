import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const admin = createAdminClient();

  const { data: existing } = await admin.from("teacher_applications").select("id").eq("user_id", user.id).single();

  if (existing) {
    await admin.from("teacher_applications").update({ ...body, status: "submitted", submitted_at: new Date().toISOString() }).eq("id", existing.id);
  } else {
    await admin.from("teacher_applications").insert({ user_id: user.id, ...body, status: "submitted", submitted_at: new Date().toISOString() });
  }

  return NextResponse.json({ success: true });
}
