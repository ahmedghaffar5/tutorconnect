"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";
import { Check, ChevronLeft, ChevronRight, Upload, Save, Send } from "lucide-react";

const steps = ["Personal Info", "Qualifications", "Subjects & Rates", "Bio & Media", "References"];

const subjectOptions = ["Mathematics", "English", "Science", "Computer Science", "Coding", "Quran", "Urdu", "Physics", "Chemistry", "Biology"];

const emptyForm = {
  full_name: "", email: "", phone: "", address: "", city: "", country: "", date_of_birth: "", gender: "",
  qualification: "", institution: "", graduation_year: "", specialization: "", years_experience: 0,
  teaching_certificates: "", other_certifications: "",
  subjects_taught: [] as string[], hourly_rate: 0, monthly_rate: 0, currency: "USD", languages: "English",
  bio: "", profile_image_url: "", intro_video_url: "", availability: "",
  reference_name: "", reference_contact: "", reference_relationship: "",
};

export default function ApplyPage() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [existingId, setExistingId] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then((result: any) => {
      const user = result.data?.user;
      if (!user) { router.push("/login?redirect=/apply"); return; }
      supabase.from("teacher_applications").select("*").eq("user_id", user.id).single().then((res: any) => {
        const data = res.data;
        if (data) {
          setExistingId(data.id);
          setStatus(data.status);
          setForm({
            full_name: data.full_name || "", email: data.email || user.email || "", phone: data.phone || "",
            address: data.address || "", city: data.city || "", country: data.country || "",
            date_of_birth: data.date_of_birth || "", gender: data.gender || "",
            qualification: data.qualification || "", institution: data.institution || "",
            graduation_year: data.graduation_year?.toString() || "", specialization: data.specialization || "",
            years_experience: data.years_experience || 0, teaching_certificates: data.teaching_certificates || "",
            other_certifications: data.other_certifications || "",
            subjects_taught: data.subjects_taught || [], hourly_rate: data.hourly_rate || 0,
            monthly_rate: data.monthly_rate || 0, currency: data.currency || "USD", languages: data.languages || "English",
            bio: data.bio || "", profile_image_url: data.profile_image_url || "", intro_video_url: data.intro_video_url || "",
            availability: data.availability || "",
            reference_name: data.reference_name || "", reference_contact: data.reference_contact || "",
            reference_relationship: data.reference_relationship || "",
          });
        }
      });
    });
  }, []);

  const update = (fields: Partial<typeof form>) => setForm({ ...form, ...fields });

  const saveDraft = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const res = await fetch("/api/applications", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, email: form.email || user.email }),
    });
    const data = await res.json();
    if (data.id) setExistingId(data.id);
    toast.success("Draft saved");
    setLoading(false);
  };

  const submitApp = async () => {
    setLoading(true);
    const res = await fetch("/api/applications/submit", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (data.error) { toast.error(data.error); setLoading(false); return; }
    toast.success("Application submitted!");
    router.push("/dashboard");
  };

  if (status && status !== "draft") {
    const statusColors: Record<string, string> = {
      submitted: "bg-yellow-100 text-yellow-700", under_review: "bg-blue-100 text-blue-700",
      more_info_requested: "bg-orange-100 text-orange-700", interview_scheduled: "bg-purple-100 text-purple-700",
      approved: "bg-green-100 text-green-700", rejected: "bg-red-100 text-red-700",
    };
    return (
      <div className="py-20">
        <div className="max-w-lg mx-auto px-4 text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center bg-blue-100">
            <Check className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Application {status.replace("_", " ")}</h1>
          <span className={`inline-block mt-3 px-4 py-2 rounded-full text-sm font-medium ${statusColors[status] || "bg-gray-100"}`}>
            {status.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
          </span>
          <p className="mt-4 text-gray-500">We&apos;ll notify you when there&apos;s an update.</p>
          <button onClick={() => router.push("/dashboard")} className="mt-6 text-blue-600 font-medium hover:underline">Go to Dashboard</button>
        </div>
      </div>
    );
  }

  const canNext = () => {
    if (step === 0) return form.full_name && form.email;
    if (step === 1) return form.qualification;
    if (step === 2) return form.subjects_taught.length > 0 && form.hourly_rate > 0;
    if (step === 3) return form.bio;
    return true;
  };

  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Become a Tutor</h1>
          <p className="mt-2 text-gray-500">Complete your application to join TutorConnect</p>
        </div>

        {/* Steps indicator */}
        <div className="flex items-center justify-between mb-8 bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                i < step ? "bg-green-500 text-white" : i === step ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-400"
              }`}>
                {i < step ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              <span className={`text-xs hidden md:block ${i === step ? "text-blue-600 font-medium" : "text-gray-400"}`}>{s}</span>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
          {/* Step 1: Personal Info */}
          {step === 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className="text-sm font-medium text-gray-700">Full Name *</label><input type="text" value={form.full_name} onChange={(e) => update({ full_name: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none mt-1" /></div>
                <div><label className="text-sm font-medium text-gray-700">Email *</label><input type="email" value={form.email} onChange={(e) => update({ email: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none mt-1" /></div>
                <div><label className="text-sm font-medium text-gray-700">Phone</label><input type="tel" value={form.phone} onChange={(e) => update({ phone: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none mt-1" /></div>
                <div><label className="text-sm font-medium text-gray-700">Date of Birth</label><input type="date" value={form.date_of_birth} onChange={(e) => update({ date_of_birth: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none mt-1" /></div>
                <div><label className="text-sm font-medium text-gray-700">Gender</label><select value={form.gender} onChange={(e) => update({ gender: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none mt-1 bg-white"><option value="">Select</option><option value="male">Male</option><option value="female">Female</option><option value="other">Other</option></select></div>
                <div><label className="text-sm font-medium text-gray-700">Country</label><input type="text" value={form.country} onChange={(e) => update({ country: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none mt-1" /></div>
                <div className="md:col-span-2"><label className="text-sm font-medium text-gray-700">Address</label><input type="text" value={form.address} onChange={(e) => update({ address: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none mt-1" /></div>
              </div>
            </div>
          )}

          {/* Step 2: Qualifications */}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Qualifications</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2"><label className="text-sm font-medium text-gray-700">Highest Qualification *</label><input type="text" value={form.qualification} onChange={(e) => update({ qualification: e.target.value })} placeholder="e.g. Masters in Mathematics" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none mt-1" /></div>
                <div className="md:col-span-2"><label className="text-sm font-medium text-gray-700">Institution</label><input type="text" value={form.institution} onChange={(e) => update({ institution: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none mt-1" /></div>
                <div><label className="text-sm font-medium text-gray-700">Graduation Year</label><input type="number" value={form.graduation_year} onChange={(e) => update({ graduation_year: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none mt-1" /></div>
                <div><label className="text-sm font-medium text-gray-700">Specialization</label><input type="text" value={form.specialization} onChange={(e) => update({ specialization: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none mt-1" /></div>
                <div><label className="text-sm font-medium text-gray-700">Years of Experience</label><input type="number" value={form.years_experience} onChange={(e) => update({ years_experience: parseInt(e.target.value) || 0 })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none mt-1" /></div>
                <div><label className="text-sm font-medium text-gray-700">Teaching Certificates</label><input type="text" value={form.teaching_certificates} onChange={(e) => update({ teaching_certificates: e.target.value })} placeholder="e.g. Teaching License, TESOL" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none mt-1" /></div>
                <div className="md:col-span-2"><label className="text-sm font-medium text-gray-700">Other Certifications</label><textarea value={form.other_certifications} onChange={(e) => update({ other_certifications: e.target.value })} rows={2} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none mt-1 resize-none" /></div>
              </div>
            </div>
          )}

          {/* Step 3: Subjects & Rates */}
          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Subjects & Rates</h2>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Subjects You Teach *</label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                  {subjectOptions.map((s) => (
                    <button key={s} type="button" onClick={() => {
                      const arr = form.subjects_taught.includes(s)
                        ? form.subjects_taught.filter((x) => x !== s)
                        : [...form.subjects_taught, s];
                      update({ subjects_taught: arr });
                    }} className={`px-3 py-2 rounded-lg text-sm font-medium border transition-all ${
                      form.subjects_taught.includes(s) ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-600 border-gray-200 hover:border-blue-300"
                    }`}>{s}</button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div><label className="text-sm font-medium text-gray-700">Hourly Rate ($) *</label><input type="number" value={form.hourly_rate} onChange={(e) => update({ hourly_rate: parseFloat(e.target.value) || 0 })} min={1} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none mt-1" /></div>
                <div><label className="text-sm font-medium text-gray-700">Monthly Rate ($)</label><input type="number" value={form.monthly_rate} onChange={(e) => update({ monthly_rate: parseFloat(e.target.value) || 0 })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none mt-1" /></div>
                <div><label className="text-sm font-medium text-gray-700">Languages</label><input type="text" value={form.languages} onChange={(e) => update({ languages: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none mt-1" /></div>
              </div>
            </div>
          )}

          {/* Step 4: Bio & Media */}
          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Bio & Media</h2>
              <div><label className="text-sm font-medium text-gray-700">Bio *</label><textarea value={form.bio} onChange={(e) => update({ bio: e.target.value })} rows={4} placeholder="Tell students about yourself, your teaching style, and experience" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none mt-1 resize-none" /></div>
              <div><label className="text-sm font-medium text-gray-700">Availability</label><textarea value={form.availability} onChange={(e) => update({ availability: e.target.value })} rows={2} placeholder="e.g. Weekdays 4-8 PM EST, Weekends 9 AM-5 PM" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none mt-1 resize-none" /></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className="text-sm font-medium text-gray-700">Profile Image URL</label><input type="text" value={form.profile_image_url} onChange={(e) => update({ profile_image_url: e.target.value })} placeholder="Link to your photo" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none mt-1" /></div>
                <div><label className="text-sm font-medium text-gray-700">Intro Video URL (optional)</label><input type="text" value={form.intro_video_url} onChange={(e) => update({ intro_video_url: e.target.value })} placeholder="YouTube or Vimeo link" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none mt-1" /></div>
              </div>
            </div>
          )}

          {/* Step 5: References */}
          {step === 4 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">References</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2"><label className="text-sm font-medium text-gray-700">Reference Name</label><input type="text" value={form.reference_name} onChange={(e) => update({ reference_name: e.target.value })} placeholder="Name of a professional or academic reference" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none mt-1" /></div>
                <div><label className="text-sm font-medium text-gray-700">Reference Contact</label><input type="text" value={form.reference_contact} onChange={(e) => update({ reference_contact: e.target.value })} placeholder="Email or phone" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none mt-1" /></div>
                <div><label className="text-sm font-medium text-gray-700">Relationship</label><input type="text" value={form.reference_relationship} onChange={(e) => update({ reference_relationship: e.target.value })} placeholder="e.g. Former employer, professor" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none mt-1" /></div>
              </div>
              <div className="bg-blue-50 rounded-xl p-4 mt-4">
                <p className="text-sm text-blue-700">You&apos;ll be able to upload supporting documents (certificates, ID) after submitting your application.</p>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
            <div>
              {step > 0 ? (
                <button onClick={() => setStep(step - 1)} className="flex items-center gap-1.5 px-4 py-2.5 text-gray-600 hover:bg-gray-50 rounded-xl transition-colors">
                  <ChevronLeft className="h-4 w-4" /> Back
                </button>
              ) : (
                <div />
              )}
            </div>
            <div className="flex items-center gap-3">
              <button onClick={saveDraft} disabled={loading} className="flex items-center gap-1.5 px-4 py-2.5 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors text-sm">
                <Save className="h-4 w-4" /> Save Draft
              </button>
              {step < 4 ? (
                <button onClick={() => canNext() && setStep(step + 1)} disabled={!canNext()} className="flex items-center gap-1.5 px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 text-sm">
                  Next <ChevronRight className="h-4 w-4" />
                </button>
              ) : (
                <button onClick={submitApp} disabled={loading} className="flex items-center gap-1.5 px-6 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50">
                  <Send className="h-4 w-4" /> {loading ? "Submitting..." : "Submit Application"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
