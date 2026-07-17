import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { logAudit } from "@/lib/audit";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { subjects, hourlyRate, monthlyRate, bio, languages } = await request.json();
    const admin = createAdminClient();

    // Get the approved application
    const { data: app } = await admin.from("teacher_applications")
      .select("*").eq("user_id", user.id).eq("status", "approved").single();

    if (!app) return NextResponse.json({ error: "No approved application found" }, { status: 400 });

    // Check if tutor profile already exists
    const { data: existingTutor } = await admin.from("tutors")
      .select("id").eq("user_id", user.id).maybeSingle();

    if (existingTutor) return NextResponse.json({ error: "Profile already exists" }, { status: 400 });

    // Create the tutor profile
    const { data: tutor, error: tutorError } = await admin.from("tutors").insert({
      user_id: user.id,
      bio: bio || app.bio,
      experience_years: app.years_experience || 0,
      qualification: app.qualification,
      hourly_rate: hourlyRate || app.hourly_rate,
      monthly_rate: monthlyRate || app.monthly_rate,
      languages: languages || app.languages,
      is_approved: true,
    }).select().single();

    if (tutorError) return NextResponse.json({ error: tutorError.message }, { status: 500 });

    // Update user role to tutor
    await admin.from("users").update({ role: "tutor" }).eq("id", user.id);

    // Update auth metadata
    await supabase.auth.updateUser({ data: { role: "tutor" } });

    // Insert tutor_subjects
    if (subjects && subjects.length > 0) {
      const { data: allSubjects } = await admin.from("subjects").select("id, name");
      for (const subjName of subjects) {
        const match = allSubjects?.find((s: any) => s.name.toLowerCase() === subjName.toLowerCase());
        if (match) {
          await admin.from("tutor_subjects").insert({ tutor_id: tutor.id, subject_id: match.id }).maybeSingle();
        }
      }
    }

    await logAudit({ userId: user.id, action: "tutor_profile_created", entityType: "tutor", entityId: tutor.id });

    return NextResponse.json({ success: true, tutor });
  } catch {
    return NextResponse.json({ error: "Setup failed" }, { status: 500 });
  }
}
