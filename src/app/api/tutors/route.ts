import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { logAudit } from "@/lib/audit";

export async function GET(request: Request) {
  try {
    const supabase = createAdminClient();
    const url = new URL(request.url);
    const subject = url.searchParams.get("subject");

    // First get all approved tutors
    let query = supabase
      .from("tutors")
      .select("*, users!inner(full_name, email)")
      .eq("is_approved", true);

    const { data: tutorsData, error: tutorsError } = await query;

    if (tutorsError) {
      console.error("Tutors query error:", tutorsError);
      return NextResponse.json({ error: tutorsError.message }, { status: 500 });
    }

    // Get subjects for each tutor
    const tutorIds = (tutorsData || []).map((t: any) => t.id);
    let subjectsMap: Record<string, any[]> = {};

    if (tutorIds.length > 0) {
      const { data: tsData } = await supabase
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
        name: t.users?.full_name || "Unknown",
        email: t.users?.email,
        subjects: tutorSubjects.map((s: any) => s.name).filter(Boolean),
        subjectIds: tutorSubjects.map((s: any) => s.id).filter(Boolean),
        bio: t.bio || "Experienced tutor ready to help you achieve your goals.",
        rate: t.hourly_rate || 0,
        experience: t.experience_years || 0,
        qualification: t.qualification || "",
        languages: t.languages || "English",
        image: t.profile_image_url,
        is_approved: t.is_approved,
      };
    });

    // Filter by subject if needed
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
