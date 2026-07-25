"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";
import { Check, ChevronLeft, ChevronRight, Upload, Save, Send, X, ArrowLeft, ArrowRight, Info } from "lucide-react";

const steps = ["Personal", "Expertise", "Credentials", "Profile", "Review"];
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
    supabase.auth.getUser().then((res: any) => {
      if (!res?.data?.user) { router.push("/login?redirect=/apply"); return; }
      loadApplication(res.data.user.id);
    });
  }, []);

  const loadApplication = async (userId: string) => {
    const { data } = await supabase.from("teacher_applications").select("*").eq("user_id", userId).maybeSingle();
    if (data) {
      setExistingId(data.id);
      setStatus(data.status);
      if (data.status === "draft") {
        const { subjects_taught, ...rest } = data;
        setForm({ ...emptyForm, ...rest, subjects_taught: data.subjects_taught || [] });
      }
    }
  };

  const update = async (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (existingId) {
      await fetch("/api/applications", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, [field]: value }) });
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { toast.error("Please login"); setLoading(false); return; }
    const res = await fetch("/api/applications", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, user_id: user.id }) });
    const data = await res.json();
    if (data.error) { toast.error(data.error); setLoading(false); return; }
    await fetch("/api/applications/submit", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ applicationId: data.id || existingId }) });
    toast.success("Application submitted!");
    router.push("/dashboard/teacher");
  };

  const toggleSubject = (s: string) => {
    setForm((prev) => ({ ...prev, subjects_taught: prev.subjects_taught.includes(s) ? prev.subjects_taught.filter((x) => x !== s) : [...prev.subjects_taught, s] }));
  };

  const progressPct = ((step + 1) / steps.length) * 100;

  return (
    <div className="bg-background min-h-screen">
      <header className="bg-surface shadow-sm sticky top-0 z-50">
        <div className="flex justify-between items-center w-full px-lg md:px-xl max-w-container-max mx-auto h-16">
          <span className="font-headline-sm font-bold text-primary">TutorConnect</span>
          <div className="hidden md:flex gap-md items-center">
            <span className="text-on-surface-variant font-label-md">Step {step + 1} of {steps.length}</span>
            <div className="h-1 w-32 bg-surface-container rounded-full overflow-hidden"><div className="h-full bg-primary transition-all duration-500" style={{ width: `${progressPct}%` }}></div></div>
          </div>
          <button onClick={() => router.push("/dashboard")} className="text-on-surface-variant hover:text-error transition-colors flex items-center gap-1">
            <X className="h-4 w-4" /><span className="font-label-md hidden sm:inline">Save & Exit</span>
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto py-2xl px-md">
        <div className="flex justify-between items-center mb-3xl relative">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-surface-container -z-10 -translate-y-1/2"></div>
          {steps.map((s, i) => (
            <div key={s} className="flex flex-col items-center gap-sm bg-background px-xs">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${i < step ? "bg-primary text-on-primary" : i === step ? "bg-primary text-on-primary ring-4 ring-primary-fixed" : "bg-surface-container text-on-surface-variant"}`}>
                {i < step ? <Check className="h-5 w-5" /> : i + 1}
              </div>
              <span className={`hidden md:block font-label-sm ${i <= step ? "text-primary" : "text-on-surface-variant"}`}>{s}</span>
            </div>
          ))}
        </div>

        <form className="space-y-xl" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
          {step === 0 && (
            <section className="space-y-lg">
              <div className="space-y-sm"><h1 className="font-headline-md text-on-surface">Let&apos;s get to know you</h1><p className="text-on-surface-variant font-body-md">Please provide your basic contact details. This information helps us verify your identity.</p></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-lg bg-surface-container-lowest p-xl rounded-xl border border-outline-variant shadow-sm">
                {[{ label: "Full Legal Name", key: "full_name", type: "text", placeholder: "John Doe" }, { label: "Email Address", key: "email", type: "email", placeholder: "john@example.com" }, { label: "Phone Number", key: "phone", type: "tel", placeholder: "+1 (555) 000-0000" }, { label: "Location (City, Country)", key: "address", type: "text", placeholder: "New York, USA" }].map((f) => (
                  <div key={f.key} className="space-y-1"><label className="font-label-md text-on-surface-variant">{f.label}</label><input className="w-full bg-surface border border-outline-variant rounded-lg p-md focus:ring-2 focus:ring-primary-container focus:border-primary outline-none transition-all" type={f.type} placeholder={f.placeholder} value={(form as any)[f.key]} onChange={(e) => update(f.key, e.target.value)} /></div>
                ))}
              </div>
            </section>
          )}

          {step === 1 && (
            <section className="space-y-lg">
              <div className="space-y-sm"><h1 className="font-headline-md text-on-surface">Your Academic Strengths</h1><p className="text-on-surface-variant font-body-md">Select the subjects you are most passionate and qualified to teach.</p></div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-md">
                {subjectOptions.map((s) => (
                  <button key={s} type="button" onClick={() => toggleSubject(s)} className={`flex flex-col items-center gap-sm p-xl border rounded-xl transition-all text-center ${form.subjects_taught.includes(s) ? "bg-primary-container border-primary text-on-primary-container" : "bg-surface border-outline-variant text-on-surface-variant hover:border-primary"}`}>
                    <span className="font-label-md">{s}</span>
                  </button>
                ))}
              </div>
              <div className="bg-primary-fixed/30 p-md rounded-lg flex gap-md items-start"><Info className="h-5 w-5 text-primary shrink-0 mt-0.5" /><p className="text-on-primary-fixed-variant font-body-sm">Pro-tip: Tutors who specialize in 2-3 niche subjects often receive higher booking rates than generalists.</p></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-lg bg-surface-container-lowest p-xl rounded-xl border border-outline-variant shadow-sm">
                <div className="space-y-1"><label className="font-label-md text-on-surface-variant">Highest Degree</label><select className="w-full bg-surface border border-outline-variant rounded-lg p-md focus:ring-2 focus:ring-primary-container outline-none" value={form.qualification} onChange={(e) => update("qualification", e.target.value)}><option value="">Select</option><option>Bachelor&apos;s</option><option>Master&apos;s</option><option>PhD</option></select></div>
                <div className="space-y-1"><label className="font-label-md text-on-surface-variant">Years of Experience</label><input type="number" className="w-full bg-surface border border-outline-variant rounded-lg p-md focus:ring-2 focus:ring-primary-container outline-none" value={form.years_experience} onChange={(e) => update("years_experience", parseInt(e.target.value) || 0)} /></div>
              </div>
            </section>
          )}

          {step === 2 && (
            <section className="space-y-lg">
              <div className="space-y-sm"><h1 className="font-headline-md text-on-surface">Educational Background</h1><p className="text-on-surface-variant font-body-md">Verification is key to building trust with potential students.</p></div>
              <div className="p-xl border-2 border-dashed border-outline-variant rounded-xl flex flex-col items-center justify-center gap-md bg-surface-container-lowest hover:bg-surface-container transition-colors cursor-pointer">
                <Upload className="h-8 w-8 text-outline" />
                <div className="text-center"><p className="font-label-md">Upload Diploma or Teaching Certificate</p><p className="text-body-sm text-on-surface-variant">PDF, JPG, or PNG (Max 5MB)</p></div>
                <button className="bg-primary text-on-primary px-lg py-sm rounded-lg font-label-md" type="button">Select File</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-lg bg-surface-container-lowest p-xl rounded-xl border border-outline-variant shadow-sm">
                <div className="space-y-1"><label className="font-label-md text-on-surface-variant">Institution</label><input className="w-full bg-surface border border-outline-variant rounded-lg p-md focus:ring-2 focus:ring-primary-container outline-none" value={form.institution} onChange={(e) => update("institution", e.target.value)} /></div>
                <div className="space-y-1"><label className="font-label-md text-on-surface-variant">Graduation Year</label><input type="number" className="w-full bg-surface border border-outline-variant rounded-lg p-md focus:ring-2 focus:ring-primary-container outline-none" value={form.graduation_year} onChange={(e) => update("graduation_year", parseInt(e.target.value) || 0)} /></div>
                <div className="space-y-1"><label className="font-label-md text-on-surface-variant">Hourly Rate ($)</label><input type="number" className="w-full bg-surface border border-outline-variant rounded-lg p-md focus:ring-2 focus:ring-primary-container outline-none" value={form.hourly_rate} onChange={(e) => update("hourly_rate", parseFloat(e.target.value) || 0)} /></div>
                <div className="space-y-1"><label className="font-label-md text-on-surface-variant">Languages</label><input className="w-full bg-surface border border-outline-variant rounded-lg p-md focus:ring-2 focus:ring-primary-container outline-none" value={form.languages} onChange={(e) => update("languages", e.target.value)} /></div>
              </div>
            </section>
          )}

          {step === 3 && (
            <section className="space-y-lg">
              <div className="space-y-sm"><h1 className="font-headline-md text-on-surface">Personalize Your Profile</h1><p className="text-on-surface-variant font-body-md">This is what students will see when they browse for tutors.</p></div>
              <div className="flex flex-col md:flex-row gap-xl items-start">
                <div className="w-full md:w-48 space-y-md">
                  <div className="aspect-square w-full rounded-full bg-surface-container-high flex items-center justify-center overflow-hidden border-4 border-surface shadow-md relative group">
                    <Upload className="h-8 w-8 text-on-surface-variant" />
                    <div className="absolute inset-0 bg-on-surface/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-full"><span className="text-white text-sm font-bold">Upload</span></div>
                  </div>
                  <p className="text-center font-label-sm text-on-surface-variant">Professional photo recommended</p>
                </div>
                <div className="flex-1 space-y-md w-full">
                  <div className="space-y-1"><label className="font-label-md text-on-surface-variant">Bio / About Me</label><textarea className="w-full bg-surface border border-outline-variant rounded-lg p-md focus:ring-2 focus:ring-primary-container outline-none" rows={5} value={form.bio} onChange={(e) => update("bio", e.target.value)} placeholder="Share your teaching philosophy..." /></div>
                  <div className="space-y-1"><label className="font-label-md text-on-surface-variant">Availability</label><input className="w-full bg-surface border border-outline-variant rounded-lg p-md focus:ring-2 focus:ring-primary-container outline-none" value={form.availability} onChange={(e) => update("availability", e.target.value)} placeholder="e.g. Weekdays 5-9 PM EST" /></div>
                </div>
              </div>
            </section>
          )}

          {step === 4 && (
            <section className="space-y-lg">
              <div className="space-y-sm"><h1 className="font-headline-md text-on-surface">Final Review</h1><p className="text-on-surface-variant font-body-md">Almost there! Please verify your information before submitting.</p></div>
              <div className="bg-surface border border-outline-variant rounded-xl divide-y divide-outline-variant">
                <div className="p-lg flex justify-between items-center"><div><p className="font-label-sm text-on-surface-variant uppercase">Identity</p><p className="font-body-md">{form.full_name || "N/A"} • {form.email}</p></div><button type="button" onClick={() => setStep(0)} className="text-primary font-label-md">Edit</button></div>
                <div className="p-lg flex justify-between items-center"><div><p className="font-label-sm text-on-surface-variant uppercase">Expertise</p><p className="font-body-md">{form.subjects_taught.join(", ") || "None selected"}</p></div><button type="button" onClick={() => setStep(1)} className="text-primary font-label-md">Edit</button></div>
                <div className="p-lg flex justify-between items-center"><div><p className="font-label-sm text-on-surface-variant uppercase">Background</p><p className="font-body-md">{form.qualification || "N/A"} • {form.institution}</p></div><button type="button" onClick={() => setStep(2)} className="text-primary font-label-md">Edit</button></div>
              </div>
              <div className="bg-secondary-container/20 p-xl rounded-xl border border-secondary/20 flex flex-col items-center gap-md text-center">
                <h3 className="font-headline-sm text-secondary">What happens next?</h3>
                <p className="text-body-md text-on-secondary-container">Our team will review your application within 2-3 business days. Once approved, you&apos;ll be able to set your schedule and start accepting students!</p>
              </div>
            </section>
          )}

          <div className="flex justify-between items-center pt-xl border-t border-outline-variant">
            <button type="button" onClick={() => step > 0 ? setStep(step - 1) : router.push("/dashboard")} className={`px-xl py-md rounded-lg font-label-md border border-outline-variant hover:bg-surface-container transition-colors flex items-center gap-sm ${step === 0 ? "invisible" : ""}`}>
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
            {step < steps.length - 1 ? (
              <button type="button" onClick={() => { if (step === 0 && !form.full_name) { toast.error("Please enter your name"); return; } setStep(step + 1); }} className="bg-primary text-on-primary px-2xl py-md rounded-lg font-label-md hover:bg-primary-container transition-all flex items-center gap-sm shadow-md active:scale-95">
                Next Step <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button type="submit" disabled={loading} className="bg-secondary text-on-secondary px-2xl py-md rounded-lg font-label-md hover:opacity-90 transition-all flex items-center gap-sm shadow-md active:scale-95">
                {loading ? "Submitting..." : "Submit Application"} <Send className="h-4 w-4" />
              </button>
            )}
          </div>
        </form>
      </main>
    </div>
  );
}
