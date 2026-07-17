import { NextResponse } from "next/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { logAudit } from "@/lib/audit";

export async function GET() {
  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const { data } = await supabase.from("feature_flags").select("*");
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
  const admin = createAdminClient();
  const { error } = await admin.from("feature_flags").update({ value }).eq("key", key);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await logAudit({ userId: user.id, action: "feature_flag_updated", entityType: "feature_flag", entityId: key, details: { key, value } });
  return NextResponse.json({ success: true });
}
