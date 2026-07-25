"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";
import { Check, Upload, X, ArrowLeft, ArrowRight, Send, Info } from "lucide-react";

const steps = ["Personal", "Expertise", "Credentials", "Profile", "Review"];
const subjectOptions = ["Mathematics", "English", "Science", "Computer Science", "Coding", "Quran", "Urdu", "Physics", "Chemistry", "Biology"];

const emptyForm = {
  full_name: "", email: "", phone: "", address: "", city: "", country: "", date_of_birth: "", gender: "",
  qualification: "", institution: "", graduation_year: 0, specialization: "", years_experience: 0,
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
    supabase.auth.getUser().then((res: any) => {
      if (!res?.data?.user) { router.push("/login?redirect=/apply"); return; }
      loadDraft(res.data.user.id);
    });
  }, []);

  const loadDraft = async (userId: string) => {
    const { data } = await supabase.from("teacher_applications").select("*").eq("user_id", userId).maybeSingle();
    if (data) {
      setExistingId(data.id);
      setStatus(data.status);
      if (data.status === "draft") {
        const { subjects_taught, ...rest } = data;
        setForm({ ...emptyForm, ...rest, subjects_taught: subjects_taught || [] });
      }
    }
    // Pre-fill email from auth
    const { data: { user } } = await supabase.auth.getUser();
    if (user?.email && !form.email) {
      setForm(prev => ({ ...prev, email: user.email || "", full_name: user.user_metadata?.full_name || prev.full_name }));
    }
  };

  const update = async (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const saveDraft = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const res = await fetch("/api/applications", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, user_id: user.id }),
    });
    const data = await res.json();
    if (data.id) setExistingId(data.id);
    return data;
  };

  const handleSubmit = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { toast.error("Please login"); setLoading(false); return; }
    const saved = await saveDraft();
    if (saved?.error) { toast.error(saved.error); setLoading(false); return; }
    const submitRes = await fetch("/api/applications/submit", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ applicationId: saved?.id || existingId }),
    });
    const submitData = await submitRes.json();
    if (submitData.error) { toast.error(submitData.error); setLoading(false); return; }
    toast.success("Application submitted successfully!");
    router.push("/dashboard/teacher");
  };

  const toggleSubject = (s: string) => {
    setForm(prev => ({
      ...prev,
      subjects_taught: prev.subjects_taught.includes(s)
        ? prev.subjects_taught.filter(x => x !== s)
        : [...prev.subjects_taught, s],
    }));
  };

  const progressPct = ((step + 1) / steps.length) * 100;

  return (
    <div className="bg-[#f8f9ff] min-h-screen">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="flex justify-between items-center w-full max-w-5xl mx-auto px-6 h-16">
          <span className="font-bold text-xl text-indigo-600">TutorConnect</span>
          <div className="hidden md:flex items-center gap-4">
            <span className="text-sm text-gray-400">Step {step + 1} of {steps.length}</span>
            <div className="h-1.5 w-32 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-600 transition-all duration-500" style={{ width: `${progressPct}%` }}></div>
            </div>
          </div>
          <button onClick={() => router.push("/dashboard")} className="text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1 text-sm">
            <X className="h-4 w-4" /><span className="hidden sm:inline">Save & Exit</span>
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto py-8 px-6">
        <div className="flex justify-between items-center mb-10 relative">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-100 -z-10 -translate-y-1/2"></div>
          {steps.map((s, i) => (
            <div key={s} className="flex flex-col items-center gap-1 bg-[#f8f9ff] px-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ring-4 ${i < step ? "bg-indigo-600 text-white ring-indigo-100" : i === step ? "bg-indigo-600 text-white ring-indigo-200" : "bg-gray-200 text-gray-500 ring-transparent"}`}>
                {i < step ? <Check className="h-5 w-5" /> : i + 1}
              </div>
              <span className={`hidden md:block text-xs font-medium ${i <= step ? "text-indigo-600" : "text-gray-400"}`}>{s}</span>
            </div>
          ))}
        </div>

        <form className="space-y-8" onSubmit={e => { e.preventDefault(); handleSubmit(); }}>
          {step === 0 && (
            <section className="space-y-6">
              <div className="space-y-2"><h1 className="text-2xl font-bold text-gray-900">Let&apos;s get to know you</h1><p className="text-sm text-gray-500">Please provide your basic contact details. This information helps us verify your identity.</p></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                {[
                  { label: "Full Legal Name", key: "full_name", type: "text", placeholder: "John Doe" },
                  { label: "Email Address", key: "email", type: "email", placeholder: "john@example.com" },
                  { label: "Phone Number", key: "phone", type: "tel", placeholder: "+1 (555) 000-0000" },
                  { label: "Location (City, Country)", key: "address", type: "text", placeholder: "New York, USA" },
                ].map(f => (
                  <div key={f.key} className="space-y-1">
                    <label className="text-sm text-gray-500 font-medium">{f.label}</label>
                    <input className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-600 transition-all"
                      type={f.type} placeholder={f.placeholder} value={(form as any)[f.key] || ""}
                      onChange={e => update(f.key, e.target.value)} />
                  </div>
                ))}
              </div>
            </section>
          )}

          {step === 1 && (
            <section className="space-y-6">
              <div className="space-y-2"><h1 className="text-2xl font-bold text-gray-900">Your Academic Strengths</h1><p className="text-sm text-gray-500">Select the subjects you are most passionate and qualified to teach.</p></div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {subjectOptions.map(s => (
                  <button key={s} type="button" onClick={() => toggleSubject(s)}
                    className={`flex flex-col items-center gap-2 p-4 border rounded-xl transition-all text-center text-sm font-medium ${
                      form.subjects_taught.includes(s) ? "bg-indigo-50 border-indigo-600 text-indigo-600" : "bg-white border-gray-200 text-gray-500 hover:border-indigo-400"
                    }`}>
                    <span>{s}</span>
                  </button>
                ))}
              </div>
              <div className="bg-indigo-50/50 p-4 rounded-lg flex items-start gap-3">
                <Info className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
                <p className="text-sm text-indigo-800">Pro-tip: Tutors who specialize in 2-3 niche subjects often receive higher booking rates than generalists.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <div className="space-y-1">
                  <label className="text-sm text-gray-500 font-medium">Highest Degree</label>
                  <select className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm outline-none focus:ring-2 focus:ring-indigo-400"
                    value={form.qualification} onChange={e => update("qualification", e.target.value)}>
                    <option value="">Select</option><option>Bachelor&apos;s</option><option>Master&apos;s</option><option>PhD</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-sm text-gray-500 font-medium">Years of Experience</label>
                  <input type="number" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm outline-none focus:ring-2 focus:ring-indigo-400"
                    value={form.years_experience} onChange={e => update("years_experience", parseInt(e.target.value) || 0)} />
                </div>
              </div>
            </section>
          )}

          {step === 2 && (
            <section className="space-y-6">
              <div className="space-y-2"><h1 className="text-2xl font-bold text-gray-900">Educational Background</h1><p className="text-sm text-gray-500">Verification is key to building trust with potential students.</p></div>
              <div className="p-8 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center gap-4 bg-white hover:bg-gray-50 transition-colors cursor-pointer">
                <Upload className="h-10 w-10 text-gray-300" />
                <div className="text-center"><p className="text-sm font-medium text-gray-700">Upload Diploma or Teaching Certificate</p><p className="text-xs text-gray-400">PDF, JPG, or PNG (Max 5MB)</p></div>
                <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg text-sm font-medium" type="button">Select File</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <div className="space-y-1"><label className="text-sm text-gray-500 font-medium">Institution</label>
                  <input className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm outline-none focus:ring-2 focus:ring-indigo-400"
                    value={form.institution} onChange={e => update("institution", e.target.value)} /></div>
                <div className="space-y-1"><label className="text-sm text-gray-500 font-medium">Graduation Year</label>
                  <input type="number" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm outline-none focus:ring-2 focus:ring-indigo-400"
                    value={form.graduation_year || ""} onChange={e => update("graduation_year", parseInt(e.target.value) || 0)} /></div>
                <div className="space-y-1"><label className="text-sm text-gray-500 font-medium">Hourly Rate ($)</label>
                  <input type="number" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm outline-none focus:ring-2 focus:ring-indigo-400"
                    value={form.hourly_rate || ""} onChange={e => update("hourly_rate", parseFloat(e.target.value) || 0)} /></div>
                <div className="space-y-1"><label className="text-sm text-gray-500 font-medium">Languages</label>
                  <input className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm outline-none focus:ring-2 focus:ring-indigo-400"
                    value={form.languages} onChange={e => update("languages", e.target.value)} /></div>
              </div>
            </section>
          )}

          {step === 3 && (
            <section className="space-y-6">
              <div className="space-y-2"><h1 className="text-2xl font-bold text-gray-900">Personalize Your Profile</h1><p className="text-sm text-gray-500">This is what students will see when they browse for tutors.</p></div>
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="w-full md:w-48 space-y-3">
                  <div className="aspect-square w-full rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-4 border-white shadow-md relative group">
                    <Upload className="h-8 w-8 text-gray-400" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-full">
                      <span className="text-white text-sm font-bold">Upload</span>
                    </div>
                  </div>
                  <p className="text-center text-xs text-gray-400">Professional photo recommended</p>
                </div>
                <div className="flex-1 space-y-4 w-full">
                  <div className="space-y-1"><label className="text-sm text-gray-500 font-medium">Bio / About Me</label>
                    <textarea className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm outline-none focus:ring-2 focus:ring-indigo-400" rows={5}
                      value={form.bio} onChange={e => update("bio", e.target.value)} placeholder="Share your teaching philosophy..." /></div>
                  <div className="space-y-1"><label className="text-sm text-gray-500 font-medium">Availability</label>
                    <input className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm outline-none focus:ring-2 focus:ring-indigo-400"
                      value={form.availability} onChange={e => update("availability", e.target.value)} placeholder="e.g. Weekdays 5-9 PM EST" /></div>
                </div>
              </div>
            </section>
          )}

          {step === 4 && (
            <section className="space-y-6">
              <div className="space-y-2"><h1 className="text-2xl font-bold text-gray-900">Final Review</h1><p className="text-sm text-gray-500">Almost there! Please verify your information before submitting.</p></div>
              <div className="bg-white border border-gray-100 rounded-xl divide-y divide-gray-100 shadow-sm">
                {[
                  { label: "Identity", value: `${form.full_name || "N/A"} • ${form.email}`, editStep: 0 },
                  { label: "Expertise", value: form.subjects_taught.join(", ") || "None selected", editStep: 1 },
                  { label: "Background", value: `${form.qualification || "N/A"} • ${form.institution || "N/A"}`, editStep: 2 },
                  { label: "Profile", value: form.bio ? "Bio provided" : "No bio yet", editStep: 3 },
                ].map((item, i) => (
                  <div key={i} className="p-5 flex justify-between items-center">
                    <div><p className="text-xs text-gray-400 uppercase font-semibold">{item.label}</p><p className="text-sm text-gray-900 mt-0.5">{item.value}</p></div>
                    <button type="button" onClick={() => setStep(item.editStep)} className="text-indigo-600 text-sm font-medium hover:underline">Edit</button>
                  </div>
                ))}
              </div>
              <div className="bg-emerald-50/50 p-6 rounded-xl border border-emerald-100 flex flex-col items-center gap-3 text-center">
                <h3 className="text-lg font-bold text-emerald-700">What happens next?</h3>
                <p className="text-sm text-emerald-600">Our team will review your application within 2-3 business days. Once approved, you&apos;ll be able to set your schedule and start accepting students!</p>
              </div>
            </section>
          )}

          <div className="flex justify-between items-center pt-6 border-t border-gray-100">
            <button type="button" onClick={() => { if (step > 0) setStep(step - 1); else router.push("/dashboard"); saveDraft(); }}
              className={`px-6 py-2.5 rounded-lg text-sm font-medium border border-gray-200 hover:bg-gray-50 transition-colors flex items-center gap-2 ${step === 0 ? "invisible" : ""}`}>
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
            {step < steps.length - 1 ? (
              <button type="button" onClick={() => { if (step === 0 && !form.full_name) { toast.error("Please enter your name"); return; } saveDraft(); setStep(step + 1); }}
                className="bg-indigo-600 text-white px-8 py-2.5 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-md active:scale-95">
                Next Step <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button type="submit" disabled={loading}
                className="bg-emerald-500 text-white px-8 py-2.5 rounded-lg text-sm font-semibold hover:bg-emerald-600 transition-all flex items-center gap-2 shadow-md active:scale-95 disabled:opacity-50">
                {loading ? "Submitting..." : "Submit Application"} <Send className="h-4 w-4" />
              </button>
            )}
          </div>
        </form>
      </main>
    </div>
  );
}
