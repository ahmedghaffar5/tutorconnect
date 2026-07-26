import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { logAudit } from "@/lib/audit";

const anonClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const subject = url.searchParams.get("subject");

    // Query tutors - uses display_name from the tutors table (no users join needed)
    const { data: tutorsData, error: tutorsError } = await anonClient
      .from("tutors")
      .select("id, display_name, bio, experience_years, qualification, hourly_rate, is_approved, languages, profile_image_url")
      .eq("is_approved", true);

    if (tutorsError) {
      return NextResponse.json({ error: tutorsError.message }, { status: 500 });
    }

    // Get subjects for tutors
    const tutorIds = (tutorsData || []).map((t: any) => t.id);
    let subjectsMap: Record<string, any[]> = {};
    if (tutorIds.length > 0) {
      const { data: tsData } = await anonClient
        .from("tutor_subjects")
        .select("tutor_id, subjects(id, name)")
        .in("tutor_id", tutorIds);
      if (tsData) {
        subjectsMap = (tsData as any[]).reduce((acc: any, item: any) => {
          if (!acc[item.tutor_id]) acc[item.tutor_id] = [];
          if (item.subjects) acc[item.tutor_id].push(item.subjects);
          return acc;
        }, {});
      }
    }

    const tutors = (tutorsData || []).map((t: any) => {
      const tutorSubjects = subjectsMap[t.id] || [];
      return {
        id: t.id,
        name: t.display_name || "Tutor",
        subjects: tutorSubjects.map((s: any) => s.name).filter(Boolean),
        subjectIds: tutorSubjects.map((s: any) => s.id).filter(Boolean),
        bio: t.bio || "Experienced tutor ready to help.",
        rate: t.hourly_rate || 0,
        experience: t.experience_years || 0,
        qualification: t.qualification || "",
        languages: t.languages || "English",
        image: t.profile_image_url,
      };
    });

    const filtered = subject
      ? tutors.filter((t: any) =>
          t.subjects.some((s: string) => s.toLowerCase().includes(subject.toLowerCase()))
        )
      : tutors;

    return NextResponse.json(filtered);
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Internal error" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase.from("users").select("role").eq("id", user.id).maybeSingle();
  if (profile?.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { tutorId, isApproved } = await request.json();
  const admin = createAdminClient();

  const { error } = await admin.from("tutors").update({ is_approved: isApproved }).eq("id", tutorId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await logAudit({ userId: user.id, action: isApproved ? "tutor_approved" : "tutor_suspended", entityType: "tutor", entityId: tutorId });
  return NextResponse.json({ success: true });
}
