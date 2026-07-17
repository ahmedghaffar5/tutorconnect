"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";
import { ChevronRight, ChevronLeft, Check, Star, BookOpen, Users, GraduationCap } from "lucide-react";

const departments = [
  {
    name: "Quran & Islamic Studies",
    subjects: ["Quran", "Arabic", "Islamic Studies"],
    color: "bg-emerald-50 border-emerald-200 text-emerald-700",
    icon: "📖",
  },
  {
    name: "Languages",
    subjects: ["English", "Urdu", "Arabic"],
    color: "bg-blue-50 border-blue-200 text-blue-700",
    icon: "🌐",
  },
  {
    name: "STEM",
    subjects: ["Mathematics", "Physics", "Chemistry", "Biology", "Science", "Computer Science"],
    color: "bg-purple-50 border-purple-200 text-purple-700",
    icon: "🔬",
  },
  {
    name: "Coding & Tech",
    subjects: ["Coding", "Computer Science", "Web Development", "Python", "JavaScript"],
    color: "bg-indigo-50 border-indigo-200 text-indigo-700",
    icon: "💻",
  },
  {
    name: "Humanities",
    subjects: ["Urdu", "English", "History", "Geography"],
    color: "bg-amber-50 border-amber-200 text-amber-700",
    icon: "📚",
  },
];

const subjectsList = [
  "Mathematics", "English", "Science", "Computer Science", "Coding",
  "Quran", "Urdu", "Physics", "Chemistry", "Biology", "Arabic",
  "Islamic Studies", "Web Development", "Python", "JavaScript",
  "History", "Geography",
];

const tutors = [
  { id: "1", name: "Dr. Sarah Ahmed", subjects: ["Quran", "Arabic"], rate: 30, rating: 5, reviews: 24, bio: "PhD in Islamic Studies. Expert in Quran recitation, Tajweed & memorization." },
  { id: "2", name: "Prof. John Smith", subjects: ["Mathematics"], rate: 35, rating: 5, reviews: 18, bio: "Professor making math easy. Algebra, Calculus & Statistics." },
  { id: "3", name: "Ms. Aisha Khan", subjects: ["English", "Urdu"], rate: 25, rating: 4, reviews: 15, bio: "MA English Lit. Expert in writing, grammar & exam prep." },
  { id: "4", name: "Dr. Ahmed Raza", subjects: ["Physics", "Chemistry"], rate: 35, rating: 5, reviews: 20, bio: "PhD Physics. Making science crystal clear." },
  { id: "5", name: "Mr. David Chen", subjects: ["Coding", "Computer Science", "Python", "JavaScript"], rate: 40, rating: 5, reviews: 22, bio: "Full-stack dev teaching Python, JS & Web Dev since 2016." },
  { id: "6", name: "Hafiz Abdullah", subjects: ["Quran", "Arabic"], rate: 25, rating: 5, reviews: 30, bio: "Hafiz-e-Quran with Ijazah. Expert in Tajweed & Hifz." },
  { id: "7", name: "Dr. Fatima Alvi", subjects: ["Biology", "Science"], rate: 30, rating: 4, reviews: 16, bio: "PhD Molecular Biology. Making biology fascinating." },
  { id: "8", name: "Mr. Usman Malik", subjects: ["Urdu", "English"], rate: 20, rating: 4, reviews: 12, bio: "MA Urdu Literature. Poetry, prose & creative writing." },
  { id: "9", name: "Dr. Maria Khan", subjects: ["Chemistry"], rate: 35, rating: 5, reviews: 19, bio: "PhD Organic Chemistry. Making chemistry easy." },
  { id: "10", name: "Prof. Ali Hassan", subjects: ["Mathematics", "Physics"], rate: 38, rating: 5, reviews: 25, bio: "Professor with dual expertise. Conceptual teaching." },
  { id: "11", name: "Ms. Sara John", subjects: ["Computer Science", "Coding", "Web Development"], rate: 35, rating: 4, reviews: 14, bio: "Software engineer teaching DSA, Web Dev & more." },
  { id: "12", name: "Mr. Raza Haider", subjects: ["Science", "Biology"], rate: 22, rating: 4, reviews: 11, bio: "MSc Environmental Science. Fun experiments & learning." },
  { id: "13", name: "Dr. Noor Ali", subjects: ["Islamic Studies", "Arabic"], rate: 28, rating: 5, reviews: 17, bio: "PhD Islamic Studies. Deep knowledge of Quran & Hadith." },
  { id: "14", name: "Prof. Emma Wilson", subjects: ["English", "History"], rate: 30, rating: 4, reviews: 13, bio: "Professor of English & History. Essay writing expert." },
];

const plans: Record<string, { name: string; type: string; amount?: number }> = {
  trial: { name: "Free Trial", type: "trial" },
  single: { name: "Single Session ($25)", type: "paid", amount: 25 },
  monthly: { name: "Monthly Package ($199)", type: "paid", amount: 199 },
  premium: { name: "Premium Monthly ($349)", type: "paid", amount: 349 },
};

function BookingForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const preselectedSubject = searchParams.get("subject") || "";
  const preselectedTutor = searchParams.get("tutor") || "";
  const preselectedPlan = searchParams.get("plan") || "trial";

  const [step, setStep] = useState(preselectedSubject ? 1 : 0);
  const [form, setForm] = useState({
    subject: preselectedSubject,
    tutorId: preselectedTutor,
    plan: preselectedPlan,
    date: "",
    time: "",
    studentName: "",
    studentAge: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);

  const selectedPlan = plans[form.plan] || plans.trial;
  const subjectTutors = tutors.filter((t) => t.subjects.includes(form.subject));
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
    const { error } = await supabase.from("bookings").insert({
      student_id: user.id, tutor_id: form.tutorId, subject: form.subject,
      booking_type: selectedPlan.type, plan: form.plan,
      scheduled_at: `${form.date}T${form.time}`, status: "pending",
      student_name: form.studentName, student_age: form.studentAge ? parseInt(form.studentAge) : null, notes: form.notes,
    });
    if (error) { toast.error("Booking failed"); setLoading(false); return; }
    toast.success("Booking submitted!");
    router.push("/dashboard");
  };

  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-4">
        {/* Steps indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {["Subject", "Tutor", "Plan", "Details"].map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                i < step ? "bg-green-500 text-white" : i === step ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-400"
              }`}>{i < step ? <Check className="h-4 w-4" /> : i + 1}</div>
              <span className={`text-xs hidden md:block ${i === step ? "text-blue-600 font-medium" : "text-gray-400"}`}>{s}</span>
              {i < 3 && <ChevronRight className="h-4 w-4 text-gray-300" />}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
          {/* Step 0: Select Subject */}
          {step === 0 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Choose a Subject</h2>
              <p className="text-gray-500 mb-6">Select the subject you want to learn</p>
              <div className="space-y-4">
                {departments.map((dept) => (
                  <div key={dept.name}>
                    <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <span>{dept.icon}</span> {dept.name}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {dept.subjects.map((subj) => (
                        <button
                          key={subj}
                          onClick={() => { setForm({ ...form, subject: subj, tutorId: "" }); setStep(1); }}
                          className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                            form.subject === subj ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                          }`}
                        >
                          {subj}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-400">Can't find your subject? <button onClick={() => router.push("/contact")} className="text-blue-600 hover:underline">Contact us</button></p>
              </div>
            </div>
          )}

          {/* Step 1: Select Tutor */}
          {step === 1 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Choose a Tutor</h2>
                  <p className="text-gray-500 text-sm mt-1">
                    {subjectTutors.length} tutor{subjectTutors.length !== 1 ? "s" : ""} available for <span className="font-semibold text-blue-600">{form.subject}</span>
                  </p>
                </div>
                <button onClick={() => setStep(0)} className="text-sm text-blue-600 hover:underline">Change Subject</button>
              </div>

              {subjectTutors.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No tutors available for this subject yet</p>
                  <button onClick={() => setStep(0)} className="mt-4 text-blue-600 font-medium hover:underline">Choose another subject</button>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                  {subjectTutors.map((tutor) => (
                    <button
                      key={tutor.id}
                      onClick={() => setForm({ ...form, tutorId: tutor.id })}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                        form.tutorId === tutor.id ? "border-blue-500 bg-blue-50" : "border-gray-100 hover:border-blue-200 bg-white"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-bold text-blue-600">{tutor.name.split(" ").map((n) => n[0]).join("")}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="font-semibold text-gray-900">{tutor.name}</p>
                            <span className="text-sm font-bold text-blue-600">${tutor.rate}/hr</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{tutor.bio}</p>
                          <div className="flex items-center gap-3 mt-1">
                            <div className="flex items-center gap-0.5">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star key={i} className={`h-3 w-3 ${i < tutor.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200"}`} />
                              ))}
                            </div>
                            <span className="text-xs text-gray-400">({tutor.reviews})</span>
                            <span className="text-xs text-gray-400">{tutor.subjects.join(", ")}</span>
                          </div>
                        </div>
                        {form.tutorId === tutor.id && (
                          <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                            <Check className="h-4 w-4 text-white" />
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 2: Select Plan */}
          {step === 2 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Choose a Plan</h2>
              <p className="text-gray-500 mb-6">Select how you'd like to book</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.entries(plans).map(([id, p]) => (
                  <button
                    key={id}
                    onClick={() => setForm({ ...form, plan: id })}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      form.plan === id ? "border-blue-500 bg-blue-50" : "border-gray-100 hover:border-blue-200 bg-white"
                    }`}
                  >
                    <p className="font-semibold text-gray-900">{p.name}</p>
                    {p.amount && <p className="text-lg font-bold text-blue-600 mt-1">${p.amount}<span className="text-sm font-normal text-gray-400">/{id === "single" ? "session" : "month"}</span></p>}
                    {p.type === "trial" && <p className="text-lg font-bold text-green-600 mt-1">Free</p>}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Details */}
          {step === 3 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Booking Details</h2>
              <p className="text-gray-500 mb-6">Confirm your session details</p>

              {/* Summary */}
              <div className="bg-blue-50 rounded-xl p-4 mb-6 space-y-1 text-sm">
                <p><span className="text-gray-500">Subject:</span> <span className="font-medium">{form.subject}</span></p>
                <p><span className="text-gray-500">Tutor:</span> <span className="font-medium">{selectedTutor?.name}</span></p>
                <p><span className="text-gray-500">Plan:</span> <span className="font-medium">{selectedPlan.name}</span></p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Date *</label>
                  <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Time *</label>
                  <input type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Student Name *</label>
                  <input type="text" value={form.studentName} onChange={(e) => setForm({ ...form, studentName: e.target.value })} placeholder="Full name" required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Student Age</label>
                  <input type="number" value={form.studentAge} onChange={(e) => setForm({ ...form, studentAge: e.target.value })} placeholder="Age" min={1} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none mt-1" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-700">Notes</label>
                  <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2} placeholder="Any specific requirements" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none mt-1 resize-none" />
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
            <button
              onClick={() => step > 0 ? setStep(step - 1) : router.push("/")}
              className="flex items-center gap-1.5 px-4 py-2.5 text-gray-600 hover:bg-gray-50 rounded-xl transition-colors text-sm"
            >
              <ChevronLeft className="h-4 w-4" /> {step > 0 ? "Back" : "Cancel"}
            </button>

            {step < 3 ? (
              <button
                onClick={() => {
                  if (step === 0 && !form.subject) { toast.error("Please select a subject"); return; }
                  if (step === 1 && !form.tutorId) { toast.error("Please select a tutor"); return; }
                  setStep(step + 1);
                }}
                className="flex items-center gap-1.5 px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 text-sm disabled:opacity-50"
              >
                Next <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading || !form.date || !form.time || !form.studentName}
                className="px-6 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:opacity-50 text-sm"
              >
                {loading ? "Booking..." : selectedPlan.type === "trial" ? "Confirm Free Trial" : `Confirm & Pay $${selectedPlan.amount}`}
              </button>
            )}
          </div>
        </div>
      </div>
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
