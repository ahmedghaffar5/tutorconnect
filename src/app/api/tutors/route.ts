import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { logAudit } from "@/lib/audit";

// Use anon key client for public reads (works with RLS policies)
const anonClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const subject = url.searchParams.get("subject");

    // Get approved tutors with user info using admin client if available, else anon
    let tutorsData: any[] = [];
    let tutorsError: any = null;

    // Try admin client first (bypasses RLS), fall back to anon (respects RLS)
    try {
      const admin = createAdminClient();
      const { data, error } = await admin
        .from("tutors")
        .select("*, users(full_name, email), tutor_subjects(subjects(id, name))")
        .eq("is_approved", true);
      if (error) throw error;
      tutorsData = data || [];
    } catch {
      // Fall back to anonymous client with simpler query
      const { data, error } = await anonClient
        .from("tutors")
        .select("*, users!inner(full_name, email)")
        .eq("is_approved", true);
      if (error) throw error;
      tutorsData = data || [];

      // Get subjects separately
      if (tutorsData.length > 0) {
        const ids = tutorsData.map((t: any) => t.id);
        const { data: tsData } = await anonClient
          .from("tutor_subjects")
          .select("tutor_id, subjects(id, name)")
          .in("tutor_id", ids);
        if (tsData) {
          const subjectsMap: Record<string, any[]> = {};
          (tsData as any[]).forEach((item: any) => {
            if (!subjectsMap[item.tutor_id]) subjectsMap[item.tutor_id] = [];
            if (item.subjects) subjectsMap[item.tutor_id].push(item.subjects);
          });
          tutorsData = tutorsData.map((t: any) => ({
            ...t,
            tutor_subjects: (subjectsMap[t.id] || []).map((s: any) => ({ subjects: s })),
          }));
        }
      }
    }

    const tutors = (tutorsData || []).map((t: any) => ({
      id: t.id,
      name: t.users?.full_name || "Unknown",
      email: t.users?.email,
      subjects: (t.tutor_subjects || []).map((ts: any) => ts.subjects?.name).filter(Boolean),
      subjectIds: (t.tutor_subjects || []).map((ts: any) => ts.subjects?.id).filter(Boolean),
      bio: t.bio || "Experienced tutor ready to help.",
      rate: t.hourly_rate || 0,
      experience: t.experience_years || 0,
      qualification: t.qualification || "",
      languages: t.languages || "English",
      image: t.profile_image_url,
    }));

    const filtered = subject
      ? tutors.filter((t: any) =>
          t.subjects.some((s: string) => s.toLowerCase().includes(subject.toLowerCase()))
        )
      : tutors;

    return NextResponse.json(filtered);
  } catch (e: any) {
    console.error("Tutors API error:", e);
    return NextResponse.json({ error: e.message || "Internal error" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const supabase = await createServerClient();
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
