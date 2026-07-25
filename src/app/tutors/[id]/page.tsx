import Link from "next/link";
import { Star, Calendar, DollarSign, Award, Globe, BookOpen, ArrowLeft, CheckCircle, MessageCircle } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

async function getTutor(id: string) {
  const supabase = createAdminClient();
  const { data } = await supabase.from("tutors").select("*, users(full_name, email), tutor_subjects(subjects(name))").eq("id", id).eq("is_approved", true).maybeSingle();
  if (!data) return null;
  return {
    id: data.id, name: data.users?.full_name || "Unknown", email: data.users?.email,
    subjects: (data.tutor_subjects || []).map((ts: any) => ts.subjects?.name).filter(Boolean),
    bio: data.bio || "", rate: data.hourly_rate || 0, experience: data.experience_years || 0,
    qualification: data.qualification || "", languages: data.languages || "English",
    image: data.profile_image_url,
  };
}

const tutorImages = [
  "/images/stitch/tutor_profile_details-0.jpg",
  "/images/stitch/tutor_profile_details-1.jpg",
  "/images/stitch/tutor_profile_details-2.jpg",
  "/images/stitch/tutor_profile_details-3.jpg",
  "/images/stitch/tutor_profile_details-4.jpg",
];

export default async function TutorDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const tutor = await getTutor(id);
  if (!tutor) notFound();

  const imgIndex = parseInt(id) % 5;
  const imgSrc = tutorImages[imgIndex];

  return (
    <div className="bg-[#f8f9ff] min-h-screen">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <Link href="/tutors" className="inline-flex items-center gap-1.5 text-indigo-600 hover:underline text-sm font-medium mb-8"><ArrowLeft className="h-4 w-4" /> Back to Tutors</Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-8">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="relative">
                    <img src={imgSrc} alt={tutor.name} className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-md" />
                    <div className="absolute -bottom-1 -right-1 bg-emerald-500 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center"><CheckCircle className="h-3 w-3 text-white" /></div>
                  </div>
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold text-gray-900">{tutor.name}</h1>
                    <p className="text-indigo-600 font-medium mt-1">{tutor.subjects.join(", ")}</p>
                    <div className="flex items-center gap-4 mt-3">
                      <div className="flex items-center gap-1"><Star className="h-4 w-4 text-amber-400 fill-amber-400" /><span className="font-bold text-sm">4.9</span><span className="text-xs text-gray-400">(128 reviews)</span></div>
                      <div className="flex items-center gap-1 text-sm text-gray-400"><span>🎓</span> {tutor.experience}+ years</div>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-4">
                      {tutor.subjects.map((s: string) => (
                        <span key={s} className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-medium">{s}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">About Me</h2>
              <p className="text-gray-500 leading-relaxed">{tutor.bio}</p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Education & Certifications</h2>
              <div className="space-y-4">
                <div className="flex gap-4"><div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm">🎓</div><div><p className="font-semibold text-gray-900">{tutor.qualification || "Advanced Degree"}</p><p className="text-sm text-gray-400">Verified Credential</p></div></div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Student Reviews</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[{ name: "Emily R.", rating: 5, text: "Excellent tutor! Very patient and explains concepts clearly." },
                  { name: "James K.", rating: 4, text: "Great session. Helped me understand complex topics easily." },
                ].map((r) => (
                  <div key={r.name} className="bg-gray-50 rounded-xl p-5"><div className="flex items-center gap-3 mb-3"><div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold text-gray-600">{r.name.charAt(0)}</div><div><p className="font-semibold text-sm text-gray-900">{r.name}</p><div className="flex gap-0.5">{Array.from({ length: r.rating }).map((_, i) => (<Star key={i} className="h-3 w-3 text-amber-400 fill-amber-400" />))}</div></div></div><p className="text-sm text-gray-500">{r.text}</p></div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-24">
              <div className="text-center mb-6">
                <span className="text-3xl font-bold text-gray-900">${tutor.rate}</span><span className="text-gray-400 text-sm">/hr</span>
              </div>
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-500"><Globe className="h-4 w-4" /> Speaks {tutor.languages}</div>
                <div className="flex items-center gap-2 text-sm text-gray-500"><Calendar className="h-4 w-4" /> Available Today</div>
                <div className="flex items-center gap-2 text-sm text-gray-500"><Award className="h-4 w-4" /> {tutor.experience} years exp.</div>
              </div>
              <Link href={`/book-trial?tutor=${id}`} className="block w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold text-center mb-3 hover:bg-indigo-700 transition-colors">Book Free Trial</Link>
              <Link href={`/book-trial?tutor=${id}&plan=single`} className="block w-full py-3 border border-indigo-600 text-indigo-600 rounded-xl font-semibold text-center hover:bg-indigo-50 transition-colors">Send Message</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
