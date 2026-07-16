import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ProfileForm from "./ProfileForm";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  const meta = user.user_metadata as Record<string, string> | undefined;

  const fullName = profile?.full_name || meta?.full_name || user.email?.split("@")[0] || "";
  const phone = profile?.phone || "";
  const role = profile?.role || meta?.role || "student";

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Profile Settings</h1>
        <ProfileForm
          fullName={fullName}
          email={user.email || ""}
          phone={phone}
          role={role}
        />
      </div>
    </div>
  );
}
