import { createAdminClient } from "./supabase/admin";

export async function logAudit(params: {
  userId?: string;
  action: string;
  entityType: string;
  entityId?: string;
  details?: Record<string, unknown>;
}) {
  try {
    const supabase = createAdminClient();
    await supabase.from("audit_logs").insert({
      user_id: params.userId,
      action: params.action,
      entity_type: params.entityType,
      entity_id: params.entityId,
      details: params.details || {},
    });
  } catch (e) {
    console.error("Audit log error:", e);
  }
}
