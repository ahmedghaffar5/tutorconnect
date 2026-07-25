import { NextResponse } from "next/server";
import { getSafeClient } from "@/lib/supabase/safe-admin";
import { createClient } from "@/lib/supabase/server";
import { logAudit } from "@/lib/audit";

export async function GET() {
  const db = getSafeClient();
  const { data } = await db.from("feature_flags").select("*");
  return NextResponse.json(data || []);
}

export async function PATCH(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase.from("users").select("role").eq("id", user.id).single();
  const meta = user.user_metadata as Record<string, string> | undefined;
  const userRole = profile?.role || meta?.role;
  if (userRole !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { key, value } = await request.json();
  const db = getSafeClient();
  const { error } = await db.from("feature_flags").update({ value }).eq("key", key);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await logAudit({ userId: user.id, action: "feature_flag_updated", entityType: "feature_flag", entityId: key, details: { key, value } });
  return NextResponse.json({ success: true });
}
