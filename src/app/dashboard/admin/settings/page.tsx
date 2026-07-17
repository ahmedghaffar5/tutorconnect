import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import { Settings, Flag, Activity, BookOpen } from "lucide-react";
import LogoutButton from "@/components/ui/LogoutButton";
import FeatureFlagToggle from "./FeatureFlagToggle";
import AuditLogView from "./AuditLogView";
import SubjectManager from "./SubjectManager";

export default async function AdminSettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("users").select("role").eq("id", user.id).maybeSingle();
  const meta = user.user_metadata as Record<string, string> | undefined;
  if ((profile?.role || meta?.role) !== "admin") redirect("/dashboard");

  const admin = createAdminClient();
  const { data: flags } = await admin.from("feature_flags").select("*");
  const { data: auditLogs } = await admin.from("audit_logs").select("*, users(full_name, email)").order("created_at", { ascending: false }).limit(50);
  const { data: subjects } = await admin.from("subjects").select("*").order("name");

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Settings</h1>
            <p className="text-gray-500">Manage platform configuration</p>
          </div>
          <LogoutButton />
        </div>

        {/* Feature Flags */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-100 flex items-center gap-2">
            <Flag className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Feature Flags</h2>
          </div>
          <div className="p-6">
            <FeatureFlagToggle flags={flags || []} />
          </div>
        </div>

        {/* Subjects Manager */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-100 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Subjects</h2>
          </div>
          <div className="p-6">
            <SubjectManager subjects={subjects || []} />
          </div>
        </div>

        {/* Audit Logs */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-100 flex items-center gap-2">
            <Activity className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Audit Logs</h2>
          </div>
          <div className="p-6">
            <AuditLogView logs={auditLogs || []} />
          </div>
        </div>
      </div>
    </div>
  );
}
