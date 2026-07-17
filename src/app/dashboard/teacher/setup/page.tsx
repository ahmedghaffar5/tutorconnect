"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";
import { CheckCircle, ArrowRight } from "lucide-react";

const subjectOptions = ["Mathematics", "English", "Science", "Computer Science", "Coding", "Quran", "Urdu", "Physics", "Chemistry", "Biology"];

export default function TeacherSetupPage() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [app, setApp] = useState<any>(null);
  const [form, setForm] = useState({ subjects: [] as string[], hourlyRate: 0, monthlyRate: 0, bio: "", languages: "English" });
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(async (result: any) => {
      const user = result.data?.user;
      if (!user) { router.push("/login"); return; }
      const { data } = await supabase.from("teacher_applications").select("*").eq("user_id", user.id).single();
      if (data) {
        setApp(data);
        setForm({ subjects: data.subjects_taught || [], hourlyRate: data.hourly_rate || 0, monthlyRate: data.monthly_rate || 0, bio: data.bio || "", languages: data.languages || "English" });
      }
    });
  }, []);

  const handleComplete = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Create tutor profile
    const res = await fetch("/api/applications/setup-profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        subjects: form.subjects,
        hourlyRate: form.hourlyRate,
        monthlyRate: form.monthlyRate,
        bio: form.bio,
        languages: form.languages,
      }),
    });

    const data = await res.json();
    if (data.error) { toast.error(data.error); setLoading(false); return; }

    toast.success("Profile set up! You're now live.");
    router.push("/dashboard/teacher");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Complete Your Profile</h1>
          <p className="text-gray-500 mt-1">Set up your teaching profile to start receiving bookings</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {step === 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-gray-900">Subjects You Teach</h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                {subjectOptions.map((s) => (
                  <button key={s} type="button" onClick={() => {
                    const arr = form.subjects.includes(s) ? form.subjects.filter((x) => x !== s) : [...form.subjects, s];
                    setForm({ ...form, subjects: arr });
                  }} className={`px-3 py-2 rounded-lg text-sm font-medium border transition-all ${form.subjects.includes(s) ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-600 border-gray-200 hover:border-blue-300"}`}>{s}</button>
                ))}
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-gray-900">Rates</h2>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-sm font-medium text-gray-700">Hourly Rate ($)</label><input type="number" value={form.hourlyRate} onChange={(e) => setForm({ ...form, hourlyRate: parseFloat(e.target.value) || 0 })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none mt-1" /></div>
                <div><label className="text-sm font-medium text-gray-700">Monthly Rate ($)</label><input type="number" value={form.monthlyRate} onChange={(e) => setForm({ ...form, monthlyRate: parseFloat(e.target.value) || 0 })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none mt-1" /></div>
                <div><label className="text-sm font-medium text-gray-700">Languages</label><input type="text" value={form.languages} onChange={(e) => setForm({ ...form, languages: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none mt-1" /></div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-gray-900">Bio & Intro</h2>
              <div><label className="text-sm font-medium text-gray-700">Bio</label><textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={5} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none mt-1 resize-none" /></div>
            </div>
          )}

          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
            <button onClick={() => step > 0 ? setStep(step - 1) : router.push("/dashboard/teacher")} className="px-4 py-2.5 text-gray-600 hover:bg-gray-50 rounded-xl transition-colors text-sm">
              {step > 0 ? "← Back" : "Cancel"}
            </button>
            {step < 2 ? (
              <button onClick={() => setStep(step + 1)} className="flex items-center gap-1.5 px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 text-sm">
                Next <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button onClick={handleComplete} disabled={loading} className="px-6 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:opacity-50 text-sm">
                {loading ? "Publishing..." : "Publish Profile"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
