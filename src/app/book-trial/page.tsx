"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";
import { ChevronRight, ChevronLeft, Check, Star, Users } from "lucide-react";

interface Tutor {
  id: string;
  name: string;
  subjects: string[];
  bio: string;
  rate: number;
  experience: number;
}

const subjects = [
  "Mathematics", "Data Science", "Engineering", "Languages",
  "Computer Science", "Physics", "Chemistry", "Biology",
  "Coding", "Quran", "English", "Urdu",
];

const levels = ["High School", "Undergraduate", "Postgraduate", "Professional"];

const plans = [
  { id: "single", name: "Single Sprint", price: "$45", period: "per session", type: "paid", desc: "Ideal for exam preparation or solving specific conceptual blocks.", features: ["60-min Focused Session", "Recorded Video Recap"] },
  { id: "monthly", name: "Mastery Bundle", price: "$180", period: "$36 / session", type: "paid", desc: "Save 20% with a 5-lesson pack designed for consistent growth.", features: ["5x 60-min Sessions", "Personalized Study Plan", "Priority Messaging Support"], popular: true },
  { id: "trial", name: "Free Trial", price: "Free", period: "", type: "trial", desc: "30-minute session to meet your tutor and get started.", features: ["30-min Session", "No commitment"] },
];

const timeSlots = ["09:00 AM - 10:00 AM", "11:30 AM - 12:30 PM", "02:00 PM - 03:00 PM", "04:30 PM - 05:30 PM"];

function BookingForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const preselectedTutor = searchParams.get("tutor") || "";
  const preselectedPlan = searchParams.get("plan") || "";

  const [step, setStep] = useState(preselectedTutor || preselectedPlan ? 1 : 0);
  const [form, setForm] = useState({
    subject: "",
    level: "",
    tutorId: preselectedTutor,
    plan: preselectedPlan || "trial",
    date: "",
    time: "",
    studentName: "",
    studentAge: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [subjectMap, setSubjectMap] = useState<Record<string, string>>({});
  const [tutors, setTutors] = useState<Tutor[]>([]);

  useEffect(() => {
    fetch("/api/subjects").then((r) => r.json()).then((data) => {
      if (Array.isArray(data)) {
        const map: Record<string, string> = {};
        data.forEach((s: any) => { map[s.name.toLowerCase()] = s.id; });
        setSubjectMap(map);
      }
    });
    fetch("/api/tutors").then((r) => r.json()).then((data) => {
      if (Array.isArray(data)) setTutors(data);
    });
  }, []);

  const selectedPlan = plans.find((p) => p.id === form.plan) || plans[0];
  const selectedTutor = tutors.find((t) => t.id === form.tutorId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("Please login first");
      router.push(`/login?redirect=/book-trial`);
      setLoading(false);
      return;
    }
    const subjectId = subjectMap[form.subject.toLowerCase()];
    if (!subjectId) { toast.error("Please select a valid subject"); setLoading(false); return; }
    const { error } = await supabase.from("bookings").insert({
      student_id: user.id,
      tutor_id: form.tutorId,
      subject_id: subjectId,
      booking_type: selectedPlan.type,
      scheduled_at: `${form.date}T${form.time}`,
      status: "pending",
      student_name: form.studentName || user.user_metadata?.full_name,
      notes: form.notes,
    });
    if (error) { toast.error("Booking failed"); setLoading(false); return; }
    toast.success("Booking confirmed!");
    router.push("/dashboard");
  };

  const progressPct = ((step) / 3) * 100;

  return (
    <div className="bg-background min-h-screen flex flex-col">
      <main className="flex-grow w-full max-w-container-max mx-auto px-md md:px-lg py-xl">
        <div className="mb-3xl max-w-2xl mx-auto">
          <div className="flex justify-between items-center relative">
            <div className="absolute top-1/2 left-0 w-full h-1 bg-surface-container-highest -translate-y-1/2 z-0 rounded-full"></div>
            <div className="absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2 z-0 rounded-full transition-all duration-500" style={{ width: `${progressPct}%` }}></div>
            {["Subject", "Plan", "Schedule", "Review"].map((s, i) => (
              <div key={s} className="relative z-10 flex flex-col items-center gap-sm">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-md transition-colors duration-300 ${
                  i <= step ? "bg-primary text-on-primary" : "bg-surface-container-highest text-on-surface-variant"
                }`}>{i < step ? <Check className="h-5 w-5" /> : i + 1}</div>
                <span className={`font-label-sm ${i <= step ? "text-on-surface" : "text-on-surface-variant"}`}>{s}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          {step === 0 && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-lg">
              <div className="md:col-span-4">
                <h1 className="font-headline-md mb-md text-on-surface">Choose Your Path</h1>
                <p className="font-body-md text-on-surface-variant">Select the area you want to master and your current proficiency level.</p>
              </div>
              <div className="md:col-span-8 flex flex-col gap-lg">
                <div className="glass-card p-xl rounded-2xl shadow-sm">
                  <label className="block font-label-md mb-sm text-primary">Subject Category</label>
                  <div className="grid grid-cols-2 gap-sm">
                    {subjects.slice(0, 4).map((s) => (
                      <button key={s} onClick={() => { setForm({ ...form, subject: s }); }}
                        className={`flex items-center gap-md p-md border-2 rounded-xl transition-all ${form.subject === s ? "border-primary bg-primary-container/10" : "border-outline-variant hover:border-primary"}`}>
                        <span className="font-label-md">{s}</span>
                      </button>
                    ))}
                  </div>
                  {form.subject && (
                    <div className="mt-md">
                      <label className="font-label-sm text-on-surface-variant">All subjects selected:</label>
                      <span className="ml-2 font-label-md text-primary">{form.subject}</span>
                    </div>
                  )}
                </div>
                <div className="glass-card p-xl rounded-2xl shadow-sm">
                  <label className="block font-label-md mb-sm text-primary">Academic Level</label>
                  <div className="flex flex-wrap gap-sm">
                    {levels.map((l) => (
                      <button key={l} onClick={() => setForm({ ...form, level: l })}
                        className={`px-lg py-sm rounded-full border font-label-md transition-colors ${form.level === l ? "border-2 border-primary bg-primary-container/10 text-primary" : "border border-outline-variant hover:bg-surface-container-high"}`}>
                        {l}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <div className="text-center mb-xl">
                <h1 className="font-headline-md text-on-surface">Select a Learning Plan</h1>
                <p className="font-body-md text-on-surface-variant">Whether you need a quick review or a deep dive, we have a plan for you.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-xl max-w-4xl mx-auto">
                {plans.map((p) => (
                  <button key={p.id} onClick={() => setForm({ ...form, plan: p.id })}
                    className={`glass-card p-2xl rounded-3xl text-left transition-all relative overflow-hidden ${form.plan === p.id ? "shadow-md border-2 border-primary bg-primary-container/5" : "shadow-sm border border-outline-variant hover:border-primary"}`}>
                    {p.popular && <div className="absolute top-0 right-10 -translate-y-1/2 bg-secondary text-on-secondary px-md py-xs rounded-full font-label-sm shadow-md">Best Value</div>}
                    <div className="flex justify-between items-start mb-lg">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${form.plan === p.id ? "bg-primary text-on-primary" : "bg-surface-container-highest text-primary"}`}>
                        <span className="font-bold">{p.id === "trial" ? "🎁" : p.id === "single" ? "👤" : "⭐"}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-headline-sm">{p.price}</span>
                        {p.period && <p className="font-label-sm text-on-surface-variant">{p.period}</p>}
                      </div>
                    </div>
                    <h3 className="font-headline-sm mb-sm">{p.name}</h3>
                    <p className="font-body-sm text-on-surface-variant mb-xl">{p.desc}</p>
                    <ul className="space-y-sm">
                      {p.features.map((f) => (
                        <li key={f} className="flex items-center gap-sm font-body-sm text-on-surface-variant">
                          <Check className="h-4 w-4 text-secondary" /> {f}
                        </li>
                      ))}
                    </ul>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-xl">
              <div className="md:col-span-8">
                <div className="glass-card p-xl rounded-3xl shadow-sm">
                  <div className="flex justify-between items-center mb-xl">
                    <h2 className="font-headline-sm">Select Date & Time</h2>
                  </div>
                  <div className="mb-lg">
                    <label className="font-label-md block mb-sm">Date</label>
                    <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-outline-variant focus:border-primary outline-none bg-surface-container-lowest text-sm" />
                  </div>
                  <div>
                    <label className="font-label-md block mb-sm text-on-surface-variant uppercase tracking-wider">Available Times</label>
                    <div className="space-y-sm">
                      {timeSlots.map((t) => (
                        <button key={t} onClick={() => setForm({ ...form, time: t })}
                          className={`w-full p-md text-left rounded-xl font-label-md transition-all flex justify-between items-center ${form.time === t ? "border-2 border-primary bg-primary-container/10 text-primary" : "border border-outline-variant hover:border-primary"}`}>
                          {t}
                          {form.time === t && <Check className="h-5 w-5 text-primary" />}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="md:col-span-4">
                <div className="glass-card p-xl rounded-3xl shadow-sm">
                  <h3 className="font-label-md text-primary mb-lg">Student Details</h3>
                  <div className="space-y-md">
                    <div>
                      <label className="font-label-sm text-on-surface-variant">Name</label>
                      <input type="text" value={form.studentName} onChange={(e) => setForm({ ...form, studentName: e.target.value })} placeholder="Full name" className="w-full px-4 py-2.5 rounded-xl border border-outline-variant focus:border-primary outline-none text-sm mt-1" />
                    </div>
                    <div>
                      <label className="font-label-sm text-on-surface-variant">Age (optional)</label>
                      <input type="number" value={form.studentAge} onChange={(e) => setForm({ ...form, studentAge: e.target.value })} placeholder="Age" className="w-full px-4 py-2.5 rounded-xl border border-outline-variant focus:border-primary outline-none text-sm mt-1" />
                    </div>
                    <div>
                      <label className="font-label-sm text-on-surface-variant">Notes</label>
                      <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2} placeholder="Any requirements" className="w-full px-4 py-2.5 rounded-xl border border-outline-variant focus:border-primary outline-none text-sm mt-1 resize-none"></textarea>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-xl">
              <div className="md:col-span-7 flex flex-col gap-lg">
                <div className="glass-card p-xl rounded-3xl shadow-sm">
                  <h2 className="font-headline-sm mb-lg">Lesson Summary</h2>
                  <div className="space-y-md">
                    {selectedTutor && (
                      <div className="flex items-center gap-md">
                        <div className="w-14 h-14 bg-primary-fixed rounded-full flex items-center justify-center text-lg font-bold text-on-primary-fixed">
                          {selectedTutor.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                        </div>
                        <div>
                          <h4 className="font-label-md">Tutor: {selectedTutor.name}</h4>
                          <p className="font-body-sm text-on-surface-variant">{form.subject}</p>
                        </div>
                      </div>
                    )}
                    <hr className="border-outline-variant" />
                    <div className="flex justify-between font-body-md">
                      <span className="text-on-surface-variant">Plan</span>
                      <span className="font-bold">{selectedPlan?.name}</span>
                    </div>
                    {form.date && form.time && (
                      <div className="flex justify-between font-body-md">
                        <span className="text-on-surface-variant">Session</span>
                        <span className="font-bold">{form.date} at {form.time}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="glass-card p-xl rounded-3xl shadow-sm">
                  <h3 className="font-label-md text-primary mb-md">Payment Method</h3>
                  <div className="p-md border-2 border-primary bg-primary-container/5 rounded-xl">
                    <p className="font-label-md">{selectedPlan?.type === "trial" ? "Free Trial - No payment required" : "Pay after session"}</p>
                  </div>
                </div>
              </div>
              <div className="md:col-span-5">
                <div className="bg-surface-container-high p-xl rounded-3xl shadow-md sticky top-24">
                  <h3 className="font-headline-sm mb-lg">Order Total</h3>
                  <div className="space-y-sm mb-xl">
                    <div className="flex justify-between font-body-md text-on-surface-variant">
                      <span>Session Fee</span>
                      <span>{selectedPlan?.type === "trial" ? "$0.00" : selectedPlan?.price}</span>
                    </div>
                    <hr className="border-outline-variant my-md" />
                    <div className="flex justify-between font-headline-sm">
                      <span>Total</span>
                      <span className={selectedPlan?.type === "trial" ? "text-secondary" : ""}>
                        {selectedPlan?.type === "trial" ? "Free" : selectedPlan?.price}
                      </span>
                    </div>
                  </div>
                  <button onClick={handleSubmit} disabled={loading}
                    className="w-full py-md bg-primary text-on-primary rounded-xl font-bold hover:scale-[1.02] active:scale-95 transition-all shadow-lg flex items-center justify-center gap-sm disabled:opacity-50">
                    {loading ? "Booking..." : selectedPlan?.type === "trial" ? "Confirm Free Trial" : "Complete Booking"}
                  </button>
                  <p className="text-center font-label-sm text-on-surface-variant mt-md">You won't be charged until the session starts.</p>
                </div>
              </div>
            </div>
          )}

          <div className="mt-2xl flex justify-between items-center py-lg border-t border-outline-variant">
            <button onClick={() => step > 0 ? setStep(step - 1) : router.push("/")}
              className={`px-xl py-md border border-outline-variant text-on-surface-variant rounded-xl font-label-md hover:bg-surface-container-low transition-all flex items-center gap-sm ${step === 0 ? "invisible" : ""}`}>
              <ChevronLeft className="h-4 w-4" /> Back
            </button>
            <div className="flex-grow"></div>
            {step < 3 ? (
              <button onClick={() => {
                if (step === 0 && !form.subject) { toast.error("Please select a subject"); return; }
                if (step === 1 && !form.plan) { toast.error("Please select a plan"); return; }
                setStep(step + 1);
              }} className="px-xl py-md bg-primary text-on-primary rounded-xl font-label-md hover:shadow-lg hover:translate-y-[-2px] active:translate-y-0 transition-all flex items-center gap-sm">
                Continue <ChevronRight className="h-4 w-4" />
              </button>
            ) : null}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function BookTrialPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-gray-500">Loading...</div>}>
      <BookingForm />
    </Suspense>
  );
}
