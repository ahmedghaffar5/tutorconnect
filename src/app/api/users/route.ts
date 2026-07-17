import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { logAudit } from "@/lib/audit";

export async function GET(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase.from("users").select("role, admin_role").eq("id", user.id).single();
  const userRole = profile?.role || (user.user_metadata as any)?.role;
  if (userRole !== "admin" && !profile?.admin_role) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const url = new URL(request.url);
  const role = url.searchParams.get("role");
  const admin = createAdminClient();

  let query = admin.from("users").select("*").order("created_at", { ascending: false });
  if (role) query = query.eq("role", role);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function PATCH(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase.from("users").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { userId, role, adminRole } = await request.json();
  const admin = createAdminClient();

  const { error } = await admin.from("users").update({ role, admin_role: adminRole || null }).eq("id", userId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await logAudit({ userId: user.id, action: "user_role_updated", entityType: "user", entityId: userId, details: { role, adminRole } });
  return NextResponse.json({ success: true });
}
