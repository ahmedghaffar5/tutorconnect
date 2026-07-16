import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  const role = profile?.role || (user.user_metadata?.role as string) || "student";

  if (role === "tutor") redirect("/dashboard/tutor");
  if (role === "admin") redirect("/dashboard/admin");
  redirect("/dashboard/student");
}
