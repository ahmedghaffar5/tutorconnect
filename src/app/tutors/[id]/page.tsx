import Link from "next/link";
import { BookOpen, Clock, DollarSign, Award, Globe, Star, ArrowLeft } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

interface TutorDetail {
  id: string;
  name: string;
  subjects: string[];
  bio: string;
  rate: number;
  experience: number;
  qualification: string;
  languages: string;
  image: string | null;
  students?: number;
  rating?: number;
  reviews?: number;
}

async function getTutor(id: string): Promise<TutorDetail | null> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("tutors")
    .select("*, users(full_name), tutor_subjects(subjects(name))")
    .eq("id", id)
    .eq("is_approved", true)
    .maybeSingle();

  if (!data) return null;

  return {
    id: data.id,
    name: data.users?.full_name || "Unknown",
    subjects: (data.tutor_subjects || []).map((ts: any) => ts.subjects?.name).filter(Boolean),
    bio: data.bio || "",
    rate: data.hourly_rate || 0,
    experience: data.experience_years || 0,
    qualification: data.qualification || "",
    languages: data.languages || "English",
    image: data.profile_image_url,
  };
}

export default async function TutorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const tutor = await getTutor(id);

  if (!tutor) {
    notFound();
  }

  return (
    <div className="bg-background min-h-screen py-2xl">
      <div className="max-w-4xl mx-auto px-lg">
        <Link href="/tutors" className="inline-flex items-center gap-1.5 text-primary hover:underline font-body-md mb-lg">
          <ArrowLeft className="h-4 w-4" /> Back to Tutors
        </Link>

        <div className="bg-surface rounded-2xl border border-outline-variant shadow-sm overflow-hidden">
          <div className="p-xl md:p-2xl">
            <div className="flex flex-col md:flex-row gap-xl">
              <div className="w-28 h-28 bg-primary-fixed rounded-full flex items-center justify-center flex-shrink-0 mx-auto md:mx-0 border-4 border-surface-container shadow-sm">
                <span className="text-4xl font-bold text-on-primary-fixed">
                  {tutor.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </span>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h1 className="font-headline-md text-on-surface">{tutor.name}</h1>
                <p className="text-primary font-label-md mt-1">{tutor.subjects.join(", ")}</p>
                <div className="flex items-center justify-center md:justify-start gap-1 mt-2">
                  <Star className="h-4 w-4 text-tertiary fill-tertiary" />
                  <span className="font-label-md font-bold">4.9</span>
                  <span className="font-label-sm text-on-surface-variant">(128 reviews)</span>
                </div>
              </div>
            </div>

            <p className="mt-xl text-on-surface-variant font-body-md leading-relaxed">{tutor.bio}</p>

            <div className="mt-xl grid grid-cols-2 md:grid-cols-4 gap-lg">
              <div className="flex items-center gap-md">
                <div className="w-12 h-12 bg-primary-fixed rounded-xl flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-label-sm text-on-surface-variant">Hourly Rate</p>
                  <p className="font-label-md font-bold text-on-surface">${tutor.rate}/hr</p>
                </div>
              </div>
              <div className="flex items-center gap-md">
                <div className="w-12 h-12 bg-secondary-container rounded-xl flex items-center justify-center">
                  <Award className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <p className="font-label-sm text-on-surface-variant">Experience</p>
                  <p className="font-label-md font-bold text-on-surface">{tutor.experience} years</p>
                </div>
              </div>
              <div className="flex items-center gap-md">
                <div className="w-12 h-12 bg-tertiary-fixed rounded-xl flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-tertiary" />
                </div>
                <div>
                  <p className="font-label-sm text-on-surface-variant">Qualification</p>
                  <p className="font-label-md font-bold text-on-surface text-sm">{tutor.qualification}</p>
                </div>
              </div>
              <div className="flex items-center gap-md">
                <div className="w-12 h-12 bg-surface-container-high rounded-xl flex items-center justify-center">
                  <Globe className="h-5 w-5 text-on-surface" />
                </div>
                <div>
                  <p className="font-label-sm text-on-surface-variant">Languages</p>
                  <p className="font-label-md font-bold text-on-surface text-sm">{tutor.languages}</p>
                </div>
              </div>
            </div>

            <div className="mt-xl flex flex-col sm:flex-row gap-md">
              <Link
                href={`/book-trial?tutor=${id}`}
                className="flex-1 text-center bg-primary text-on-primary py-md rounded-xl font-label-md shadow-lg hover:opacity-90 transition-all"
              >
                Book a Free Trial
              </Link>
              <Link
                href={`/book-trial?tutor=${id}&plan=single`}
                className="flex-1 text-center bg-surface text-on-surface py-md rounded-xl font-label-md border-2 border-outline-variant hover:border-primary hover:text-primary transition-all"
              >
                Book Paid Class
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
