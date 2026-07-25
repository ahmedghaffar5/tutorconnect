import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Get households where user is a member
  const { data: memberships } = await supabase.from("household_members").select("household_id").eq("user_id", user.id);
  if (!memberships || memberships.length === 0) return NextResponse.json({ households: [], children: [] });

  const householdIds = memberships.map(m => m.household_id);
  const { data: households } = await supabase.from("households").select("*").in("id", householdIds);
  const { data: members } = await supabase.from("household_members").select("*, users(full_name, email, role)").in("household_id", householdIds);

  // Get children (students linked to this guardian)
  const { data: children } = await supabase.from("guardian_student_links").select("*, users!student_id(full_name, email)").eq("guardian_id", user.id);

  return NextResponse.json({ households: households || [], members: members || [], children: children || [] });
}
