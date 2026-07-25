"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";
import { ChevronRight, ChevronLeft, Check } from "lucide-react";

interface Tutor {
  id: string; name: string; subjects: string[]; bio: string; rate: number;
}

const subjectCategories = [
  { name: "Mathematics", icon: "📐" },
  { name: "Data Science", icon: "📊" },
  { name: "Engineering", icon: "⚙️" },
  { name: "Languages", icon: "🌍" },
];
const levels = ["High School", "Undergraduate", "Postgraduate", "Professional"];

const plans = [
  { id: "single", name: "Single Sprint", price: "$45", period: "per session", type: "paid", desc: "Ideal for exam preparation or solving specific conceptual blocks in one hour.", features: ["60-min Focused Session", "Recorded Video Recap"] },
  { id: "monthly", name: "Mastery Bundle", price: "$180", period: "$36 / session", type: "paid", popular: true, desc: "Save 20% with a 5-lesson pack designed for consistent growth and retention.", features: ["5x 60-min Sessions", "Personalized Study Plan", "Priority Messaging Support"] },
  { id: "trial", name: "Free Trial", price: "Free", period: "", type: "trial", desc: "30-minute session to meet your tutor and get started.", features: ["30-min Session", "No commitment"] },
];

const timeSlots = ["09:00 AM - 10:00 AM", "11:30 AM - 12:30 PM", "02:00 PM - 03:00 PM", "04:30 PM - 05:30 PM"];
const tutorImages = ["/images/stitch/booking_wizard-0.jpg", "/images/stitch/booking_wizard-1.jpg"];

function BookingForm() {
  const params = useSearchParams();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ subject: "", level: "", tutorId: params.get("tutor") || "", plan: params.get("plan") || "trial", date: "", time: "", studentName: "", studentAge: "", notes: "" });
  const [loading, setLoading] = useState(false);
  const [subjectMap, setSubjectMap] = useState<Record<string,string>>({});
  const [tutors, setTutors] = useState<Tutor[]>([]);

  useEffect(() => {
    fetch("/api/subjects").then(r=>r.json()).then(data => { if(Array.isArray(data)) { const m:Record<string,string>={}; data.forEach((s:any)=>m[s.name.toLowerCase()]=s.id); setSubjectMap(m); }});
    fetch("/api/tutors").then(r=>r.json()).then(data => { if(Array.isArray(data)) setTutors(data); });
  }, []);

  const selectedPlan = plans.find(p => p.id === form.plan) || plans[0];
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { toast.error("Please login first"); router.push("/login?redirect=/book-trial"); setLoading(false); return; }
    const subjectId = subjectMap[form.subject.toLowerCase()];
    if (!subjectId) { toast.error("Please select a valid subject"); setLoading(false); return; }
    const { error } = await supabase.from("bookings").insert({
      student_id: user.id, tutor_id: form.tutorId, subject_id: subjectId,
      booking_type: selectedPlan.type, scheduled_at: `${form.date}T${form.time}`,
      status: "pending", student_name: form.studentName || user.user_metadata?.full_name,
      notes: form.notes,
    });
    if (error) { toast.error("Booking failed"); setLoading(false); return; }
    toast.success("Booking confirmed!"); router.push("/booking-confirmation");
  };

  const progressPct = (step / 3) * 100;

  return (
    <div className="bg-[#f8f9ff] min-h-screen flex flex-col">
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-8 w-full">
        <div className="mb-12 max-w-2xl mx-auto">
          <div className="flex justify-between items-center relative">
            <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2 z-0 rounded-full"></div>
            <div className="absolute top-1/2 left-0 h-1 bg-indigo-600 -translate-y-1/2 z-0 rounded-full transition-all duration-500" style={{width:`${progressPct}%`}}></div>
            {["Subject", "Plan", "Schedule", "Review"].map((s, i) => (
              <div key={s} className="relative z-10 flex flex-col items-center gap-1 bg-[#f8f9ff] px-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-md transition-colors duration-300 ${i <= step ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-500"}`}>
                  {i < step ? <Check className="h-5 w-5" /> : i + 1}
                </div>
                <span className={`text-xs font-medium ${i <= step ? "text-gray-900" : "text-gray-400"}`}>{s}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          {step === 0 && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <div className="md:col-span-4">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Path</h1>
                <p className="text-sm text-gray-500">Select the area you want to master and your current proficiency level to find the best curriculum match.</p>
                <div className="mt-8 hidden md:block rounded-xl overflow-hidden shadow-lg">
                  <img src={tutorImages[0]} alt="" className="w-full h-48 object-cover" />
                </div>
              </div>
              <div className="md:col-span-8 flex flex-col gap-6">
                <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-gray-100" style={{background:"rgba(255,255,255,0.7)",backdropFilter:"blur(12px)"}}>
                  <label className="block text-sm font-medium text-indigo-600 mb-3">Subject Category</label>
                  <div className="grid grid-cols-2 gap-2">
                    {subjectCategories.map((s) => (
                      <button key={s.name} onClick={() => setForm({...form, subject: s.name})}
                        className={`flex items-center gap-3 p-4 border-2 rounded-xl transition-all text-sm font-medium ${form.subject === s.name ? "border-indigo-600 bg-indigo-50/50 text-indigo-600" : "border-gray-200 hover:border-indigo-400 text-gray-600"}`}>
                        <span>{s.icon}</span> {s.name}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-gray-100" style={{background:"rgba(255,255,255,0.7)",backdropFilter:"blur(12px)"}}>
                  <label className="block text-sm font-medium text-indigo-600 mb-3">Academic Level</label>
                  <div className="flex flex-wrap gap-2">
                    {levels.map((l) => (
                      <button key={l} onClick={() => setForm({...form, level: l})}
                        className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors ${form.level === l ? "border-2 border-indigo-600 bg-indigo-50/50 text-indigo-600" : "border border-gray-200 hover:bg-gray-50 text-gray-500"}`}>{l}</button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <div className="text-center mb-8"><h1 className="text-2xl font-bold text-gray-900">Select a Learning Intensity</h1><p className="text-sm text-gray-500 mt-1">Whether you need a quick review or a deep dive, we have a plan for you.</p></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {plans.map((p) => (
                  <button key={p.id} onClick={() => setForm({...form, plan: p.id})}
                    className={`bg-white/70 backdrop-blur-sm p-8 rounded-3xl text-left transition-all relative overflow-hidden border ${form.plan === p.id ? "shadow-md border-2 border-indigo-600" : "shadow-sm border border-gray-100 hover:border-indigo-400"}`} style={{background:"rgba(255,255,255,0.7)",backdropFilter:"blur(12px)"}}>
                    {p.popular && <div className="absolute top-0 right-10 -translate-y-1/2 bg-emerald-500 text-white px-4 py-1 rounded-full text-xs font-semibold shadow-md">Best Value</div>}
                    <div className="flex justify-between items-start mb-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${form.plan === p.id ? "bg-indigo-600 text-white" : "bg-gray-100 text-indigo-600"}`}>
                        <span className="font-bold text-lg">{p.id === "trial" ? "🎁" : p.id === "single" ? "👤" : "⭐"}</span>
                      </div>
                      <div className="text-right"><span className="text-xl font-bold text-gray-900">{p.price}</span>{p.period && <p className="text-xs text-gray-400">{p.period}</p>}</div>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{p.name}</h3>
                    <p className="text-sm text-gray-500 mb-6">{p.desc}</p>
                    <ul className="space-y-2">{p.features.map((f) => (<li key={f} className="flex items-center gap-2 text-sm text-gray-500"><Check className="h-4 w-4 text-emerald-500 flex-shrink-0" /> {f}</li>))}</ul>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <div className="md:col-span-8">
                <div className="bg-white/70 backdrop-blur-sm p-6 rounded-3xl shadow-sm border border-gray-100" style={{background:"rgba(255,255,255,0.7)",backdropFilter:"blur(12px)"}}>
                  <div className="flex justify-between items-center mb-6"><h2 className="text-xl font-bold text-gray-900">Select Date & Time</h2></div>
                  <div className="mb-6"><label className="text-sm font-medium text-gray-600 block mb-2">Date</label><input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-600 outline-none bg-white text-sm" /></div>
                  <div><label className="text-xs text-gray-400 uppercase tracking-wider font-semibold block mb-3">Available Times</label>
                    <div className="space-y-2">{timeSlots.map((t) => (
                      <button key={t} onClick={() => setForm({...form, time: t})}
                        className={`w-full p-4 text-left rounded-xl text-sm font-medium transition-all flex justify-between items-center ${form.time === t ? "border-2 border-indigo-600 bg-indigo-50/50 text-indigo-600" : "border border-gray-200 hover:border-indigo-400 text-gray-500"}`}>
                        {t}{form.time === t && <Check className="h-5 w-5 text-indigo-600" />}
                      </button>
                    ))}</div>
                  </div>
                </div>
              </div>
              <div className="md:col-span-4">
                <div className="bg-white/70 backdrop-blur-sm p-6 rounded-3xl shadow-sm border border-gray-100" style={{background:"rgba(255,255,255,0.7)",backdropFilter:"blur(12px)"}}>
                  <h3 className="text-sm font-medium text-indigo-600 mb-4">Student Details</h3>
                  <div className="space-y-4">
                    <div><label className="text-xs text-gray-400">Name</label><input type="text" value={form.studentName} onChange={e => setForm({...form, studentName: e.target.value})} placeholder="Full name" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-600 outline-none text-sm mt-1" /></div>
                    <div><label className="text-xs text-gray-400">Age (optional)</label><input type="number" value={form.studentAge} onChange={e => setForm({...form, studentAge: e.target.value})} placeholder="Age" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-600 outline-none text-sm mt-1" /></div>
                    <div><label className="text-xs text-gray-400">Notes</label><textarea value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} rows={3} placeholder="Any requirements" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-600 outline-none text-sm mt-1 resize-none"></textarea></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <div className="md:col-span-7 flex flex-col gap-6">
                <div className="bg-white/70 backdrop-blur-sm p-6 rounded-3xl shadow-sm border border-gray-100" style={{background:"rgba(255,255,255,0.7)",backdropFilter:"blur(12px)"}}>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Lesson Summary</h2>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4"><img src={tutorImages[1]} alt="" className="w-14 h-14 rounded-full object-cover" /><div><h4 className="text-sm font-semibold text-gray-900">Tutor: {tutors.find(t=>t.id===form.tutorId)?.name || "Your Tutor"}</h4><p className="text-xs text-gray-400">{form.subject}</p></div></div>
                    <hr className="border-gray-100" />
                    <div className="flex justify-between text-sm"><span className="text-gray-400">Plan</span><span className="font-bold text-gray-900">{selectedPlan?.name}</span></div>
                    {form.date && form.time && <div className="flex justify-between text-sm"><span className="text-gray-400">First Session</span><span className="font-bold text-gray-900">{form.date} at {form.time}</span></div>}
                  </div>
                </div>
                <div className="bg-white/70 backdrop-blur-sm p-6 rounded-3xl shadow-sm border border-gray-100" style={{background:"rgba(255,255,255,0.7)",backdropFilter:"blur(12px)"}}>
                  <h3 className="text-sm font-medium text-indigo-600 mb-3">Payment Method</h3>
                  <div className="p-4 border-2 border-indigo-600 bg-indigo-50/30 rounded-xl flex items-center justify-between"><span className="text-sm font-medium text-gray-900"><span className="w-8 h-5 bg-gray-900 text-white rounded inline-flex items-center justify-center text-[8px] font-bold mr-2">VISA</span> •••• 4242</span><button className="text-indigo-600 text-sm font-medium">Change</button></div>
                </div>
              </div>
              <div className="md:col-span-5">
                <div className="bg-gray-100 p-6 rounded-3xl shadow-md sticky top-24">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Order Total</h3>
                  <div className="space-y-2 mb-6">
                    <div className="flex justify-between text-sm text-gray-400"><span>Subtotal</span><span>{selectedPlan?.type === "trial" ? "$0.00" : selectedPlan?.price}</span></div>
                    <div className="flex justify-between text-sm text-gray-400"><span>Service Fee</span><span>$4.50</span></div>
                    <div className="flex justify-between text-sm text-emerald-600"><span>Discount (LEARN24)</span><span>-$10.00</span></div>
                    <hr className="border-gray-200 my-2" />
                    <div className="flex justify-between text-xl font-bold text-gray-900"><span>Total</span><span className={selectedPlan?.type === "trial" ? "text-emerald-600" : ""}>{selectedPlan?.type === "trial" ? "Free" : `$${parseInt(selectedPlan?.price?.replace("$","") || "0") - 5.50}`}</span></div>
                  </div>
                  <button onClick={handleSubmit} disabled={loading}
                    className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:scale-[1.02] active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50">
                    <span>🔒</span> {loading ? "Booking..." : "Complete Booking"}
                  </button>
                  <p className="text-center text-xs text-gray-400 mt-3">You won't be charged until the session starts.</p>
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 flex justify-between items-center py-4 border-t border-gray-100">
            <button onClick={() => step > 0 ? setStep(step - 1) : router.push("/")} className={`px-6 py-2.5 border border-gray-200 text-gray-500 rounded-xl text-sm font-medium hover:bg-gray-50 transition-all flex items-center gap-2 ${step === 0 ? "invisible" : ""}`}>
              <ChevronLeft className="h-4 w-4" /> Back
            </button>
            {step < 3 ? (
              <button onClick={() => { if (step === 0 && !form.subject) { toast.error("Please select a subject"); return; } setStep(step + 1); }}
                className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-2">
                Continue <ChevronRight className="h-4 w-4" />
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BookTrialPage() {
  return <Suspense fallback={<div className="py-20 text-center text-gray-400">Loading...</div>}><BookingForm /></Suspense>;
}
