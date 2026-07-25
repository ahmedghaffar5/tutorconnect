import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Camera, Star, ArrowRight, Plus } from "lucide-react";

const learningStyles = [
  { name: "Visual", icon: "👁️", desc: "Diagrams, maps, and color-coded notes." },
  { name: "Auditory", icon: "👂", desc: "Discussions, lectures, and verbal repeats." },
  { name: "Read/Write", icon: "📝", desc: "Heavy textual focus and detailed summaries." },
  { name: "Kinesthetic", icon: "💪", desc: "Hands-on practice and physical application." },
];

const goals = [
  { label: "Ace SAT Math", target: "Target Score: 780+", progress: 85 },
  { label: "AP Calculus Mastery", target: "Complete Unit 4 & 5", progress: 40 },
  { label: "College Essay Draft", target: "First Draft Review", progress: 100 },
];

const trustedTutors = [
  { name: "Dr. Marcus Chen", subject: "Advanced Mathematics", rating: 5.0, reviews: 112, img: "/images/stitch/student_profile_learning_goals-1.jpg" },
  { name: "Sarah Jenkins", subject: "English & Writing", rating: 4.9, reviews: 84, img: "/images/stitch/student_profile_learning_goals-2.jpg" },
  { name: "Robert Vance", subject: "Physics & Engineering", rating: 4.8, reviews: 62, img: "/images/stitch/student_profile_learning_goals-3.jpg" },
];

export default async function StudentProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: profile } = await supabase.from("users").select("*").eq("id", user.id).single();

  return (
    <div className="bg-[#f8f9ff] min-h-screen p-6">
      <div className="max-w-[1280px] mx-auto">
        <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div><h1 className="text-4xl font-bold text-gray-900">Settings & Preferences</h1><p className="text-base text-gray-400 mt-1">Manage your academic identity and personalization settings.</p></div>
          <div className="flex gap-3"><button className="px-5 py-2.5 rounded-lg border border-gray-200 text-gray-500 text-sm font-medium hover:bg-gray-50">Discard Changes</button><button className="px-5 py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-medium shadow-sm hover:bg-indigo-700">Save All Updates</button></div>
        </header>

        <div className="grid grid-cols-12 gap-6">
          <section className="col-span-12 lg:col-span-8 bg-white rounded-2xl p-8 flex flex-col md:flex-row gap-8 items-center md:items-start shadow-sm border border-gray-100">
            <div className="relative">
              <img src="/images/stitch/student_profile_learning_goals-0.jpg" alt="Profile" className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md" />
              <button className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full shadow-lg hover:scale-110 transition-transform"><Camera className="h-4 w-4" /></button>
            </div>
            <div className="flex-1 text-center md:text-left">
              <div className="flex justify-between items-start flex-wrap gap-2"><div><h2 className="text-2xl font-bold text-gray-900">{profile?.full_name || "Student"}</h2><p className="text-gray-400">Premium Learner • Since Sep 2023</p></div><span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold">Active Subscription</span></div>
              <div className="grid grid-cols-3 gap-4 mt-6">
                {[{ label: "Sessions", value: "42" }, { label: "Hours", value: "128" }, { label: "Rating", value: "4.9" }].map((s) => (
                  <div key={s.label} className="bg-gray-50 rounded-xl p-4 text-center"><span className="block text-2xl font-bold text-indigo-600">{s.value}</span><span className="block text-xs text-gray-400">{s.label}</span></div>
                ))}
              </div>
            </div>
          </section>

          <section className="col-span-12 lg:col-span-4 bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold mb-4">General</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between"><div className="flex items-center gap-3"><span>🌐</span><span className="text-sm font-medium">Default Language</span></div><span className="text-sm text-indigo-600 font-medium">English (US)</span></div>
              <div className="flex items-center justify-between"><div className="flex items-center gap-3"><span>🕐</span><span className="text-sm font-medium">Time Zone</span></div><span className="text-sm text-indigo-600 font-medium">EST (GMT-5)</span></div>
              <div className="flex items-center justify-between"><div className="flex items-center gap-3"><span>🔔</span><span className="text-sm font-medium">Smart Notifications</span></div><div className="w-11 h-6 bg-indigo-600 rounded-full relative"><div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow"></div></div></div>
            </div>
          </section>

          <section className="col-span-12 lg:col-span-5 bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2">🧠 Learning Style</h3>
            <p className="text-sm text-gray-400 mb-6">Your tutors will use this to tailor their teaching methods.</p>
            <div className="grid grid-cols-2 gap-3">
              {learningStyles.map((ls) => (
                <div key={ls.name} className="p-4 rounded-xl border border-gray-100 hover:border-indigo-300 transition-colors cursor-pointer">
                  <span className="text-2xl block mb-2">{ls.icon}</span><span className="text-sm font-bold block mb-1">{ls.name}</span><span className="text-xs text-gray-400">{ls.desc}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="col-span-12 lg:col-span-7 bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6"><h3 className="text-xl font-bold flex items-center gap-2">🏆 Learning Goals</h3><button className="text-indigo-600 text-sm font-medium flex items-center gap-1 hover:underline"><Plus className="h-4 w-4" /> Add Goal</button></div>
            <div className="space-y-6">
              {goals.map((g) => (
                <div key={g.label}><div className="flex justify-between items-end mb-2"><div><span className="text-sm font-bold block text-gray-900">{g.label}</span><span className="text-xs text-gray-400">{g.target}</span></div><span className="text-sm font-bold text-indigo-600">{g.progress}%</span></div>
                  <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden"><div className={`${g.progress === 100 ? "bg-emerald-500" : "bg-indigo-600"} h-full rounded-full transition-all`} style={{ width: `${g.progress}%` }}></div></div>
                </div>
              ))}
            </div>
          </section>

          <section className="col-span-12 bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6"><h3 className="text-xl font-bold flex items-center gap-2">✅ Trusted Tutors</h3><Link href="/tutors" className="text-indigo-600 text-sm font-medium flex items-center gap-1 group">Browse all tutors <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" /></Link></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {trustedTutors.map((t) => (
                <div key={t.name} className="border border-gray-100 rounded-2xl p-5 flex flex-col items-center text-center hover:shadow-md transition-all group">
                  <img src={t.img} alt={t.name} className="w-20 h-20 rounded-full object-cover border-2 border-white shadow-sm mb-4" />
                  <h4 className="text-sm font-bold">{t.name}</h4>
                  <p className="text-xs text-gray-400 mb-3">{t.subject}</p>
                  <div className="flex items-center gap-1 mb-4"><Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" /><span className="text-xs font-bold">{t.rating}</span><span className="text-xs text-gray-400">({t.reviews})</span></div>
                  <Link href="/book-trial" className="w-full py-2 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-semibold group-hover:bg-indigo-600 group-hover:text-white transition-colors text-center">Book Again</Link>
                </div>
              ))}
              <Link href="/tutors" className="border-2 border-dashed border-gray-200 rounded-2xl p-5 flex flex-col items-center justify-center text-center hover:border-indigo-400 transition-all group">
                <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-3 group-hover:bg-indigo-50 transition-colors"><Plus className="h-6 w-6 text-gray-300 group-hover:text-indigo-600" /></div>
                <h4 className="text-sm font-bold text-gray-400 group-hover:text-indigo-600">Find New Tutors</h4>
                <p className="text-xs text-gray-400 mt-1">Explore 500+ experts</p>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
