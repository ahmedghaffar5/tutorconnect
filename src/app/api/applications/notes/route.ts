import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { applicationId, note, noteType } = await request.json();
  const admin = createAdminClient();

  const { data, error } = await admin.from("admin_notes").insert({
    application_id: applicationId,
    admin_id: user.id,
    note,
    note_type: noteType || "general",
  }).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function GET(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(request.url);
  const applicationId = url.searchParams.get("applicationId");
  const admin = createAdminClient();

  let query = admin.from("admin_notes").select("*, users(full_name)").order("created_at", { ascending: false });
  if (applicationId) query = query.eq("application_id", applicationId);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
