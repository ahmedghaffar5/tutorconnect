import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { logAudit } from "@/lib/audit";

export async function PATCH(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase.from("users").select("role").eq("id", user.id).maybeSingle();
  const meta = user.user_metadata as Record<string, string> | undefined;
  if ((profile?.role || meta?.role) !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { tutorId, isApproved } = await request.json();
  const admin = createAdminClient();

  const { error } = await admin.from("tutors").update({ is_approved: isApproved }).eq("id", tutorId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await logAudit({ userId: user.id, action: isApproved ? "tutor_approved" : "tutor_suspended", entityType: "tutor", entityId: tutorId });
  return NextResponse.json({ success: true });
}
