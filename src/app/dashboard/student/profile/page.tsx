import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Camera, Settings, HelpCircle, LogOut, Plus, Star, BookOpen, Clock, CheckCircle, ArrowRight } from "lucide-react";

const learningStyles = [
  { name: "Visual", icon: "👁️", desc: "Diagrams, maps, and color-coded notes." },
  { name: "Auditory", icon: "👂", desc: "Discussions, lectures, and verbal repeats." },
  { name: "Read/Write", icon: "📝", desc: "Heavy textual focus and detailed summaries." },
  { name: "Kinesthetic", icon: "💪", desc: "Hands-on practice and physical application." },
];

const goals = [
  { label: "Ace SAT Math", target: "Target Score: 780+ | Deadline: May 15", progress: 85, color: "bg-primary" },
  { label: "AP Calculus Mastery", target: "Complete Unit 4 & 5 | Deadline: Jun 20", progress: 40, color: "bg-primary" },
  { label: "College Essay Draft", target: "First Draft Review | Completed Apr 2", progress: 100, color: "bg-secondary" },
];

const trustedTutors = [
  { name: "Dr. Marcus Chen", subject: "Advanced Mathematics", rating: 5.0, reviews: 112, initials: "MC" },
  { name: "Sarah Jenkins", subject: "English & Writing", rating: 4.9, reviews: 84, initials: "SJ" },
  { name: "Robert Vance", subject: "Physics & Engineering", rating: 4.8, reviews: 62, initials: "RV" },
];

export default async function StudentProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("users").select("*").eq("id", user.id).single();

  return (
    <div className="bg-background min-h-screen p-lg md:p-xl">
      <div className="max-w-container-max mx-auto">
        <header className="mb-xl flex flex-col md:flex-row justify-between items-start md:items-end gap-md">
          <div><h1 className="font-display-lg">Settings & Preferences</h1><p className="font-body-md text-on-surface-variant mt-1">Manage your academic identity and personalization settings.</p></div>
          <div className="flex gap-md"><button className="px-lg py-sm rounded-lg border border-outline text-on-surface-variant font-label-md hover:bg-surface-container transition-colors">Discard Changes</button><button className="px-lg py-sm rounded-lg bg-primary text-on-primary font-label-md shadow-sm hover:opacity-90">Save All Updates</button></div>
        </header>

        <div className="grid grid-cols-12 gap-lg">
          <section className="col-span-12 lg:col-span-8 glass-card rounded-2xl p-xl flex flex-col md:flex-row gap-xl items-center md:items-start">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-primary-fixed flex items-center justify-center text-4xl font-bold text-on-primary-fixed border-4 border-white shadow-md">
                {(profile?.full_name || "U").split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
              </div>
              <button className="absolute bottom-0 right-0 bg-primary text-on-primary p-2 rounded-full shadow-lg hover:scale-110 transition-transform"><Camera className="h-4 w-4" /></button>
            </div>
            <div className="flex-1 text-center md:text-left">
              <div className="flex justify-between items-start flex-wrap gap-2"><div><h2 className="font-headline-md text-on-surface">{profile?.full_name || "Student"}</h2><p className="font-body-md text-on-surface-variant">Premium Learner • Since {new Date().getFullYear()}</p></div><span className="px-3 py-1 bg-secondary-container text-on-secondary-container rounded-full font-label-sm">Active</span></div>
              <div className="grid grid-cols-3 gap-md mt-lg">
                {[{ label: "Sessions", value: "42" }, { label: "Hours", value: "128" }, { label: "Rating", value: "4.9" }].map((s) => (
                  <div key={s.label} className="bg-surface-container rounded-xl p-md text-center"><span className="block font-headline-sm text-primary">{s.value}</span><span className="block font-label-sm text-on-surface-variant">{s.label}</span></div>
                ))}
              </div>
            </div>
          </section>

          <section className="col-span-12 lg:col-span-4 glass-card rounded-2xl p-xl">
            <h3 className="font-headline-sm mb-md">General</h3>
            <div className="space-y-lg">
              {[{ icon: "🌐", label: "Default Language", value: "English (US)" }, { icon: "🕐", label: "Time Zone", value: "EST (GMT-5)" }].map((s) => (
                <div key={s.label} className="flex items-center justify-between"><div className="flex items-center gap-3"><span>{s.icon}</span><span className="font-label-md">{s.label}</span></div><span className="font-body-sm text-primary font-medium">{s.value}</span></div>
              ))}
              <div className="flex items-center justify-between"><div className="flex items-center gap-3"><span>🔔</span><span className="font-label-md">Smart Notifications</span></div><div className="w-11 h-6 bg-primary rounded-full relative"><div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow"></div></div></div>
            </div>
          </section>

          <section className="col-span-12 lg:col-span-5 glass-card rounded-2xl p-xl">
            <h3 className="font-headline-sm mb-md flex items-center gap-2">🧠 Learning Style</h3>
            <p className="font-body-sm text-on-surface-variant mb-xl">Your tutors will use this to tailor their teaching methods.</p>
            <div className="grid grid-cols-2 gap-md">
              {learningStyles.map((ls) => (
                <label key={ls.name} className="relative group cursor-pointer">
                  <div className="p-md rounded-xl border border-outline-variant hover:border-primary transition-colors peer-checked:border-primary peer-checked:bg-primary-fixed/30 h-full">
                    <span className="text-2xl block mb-2">{ls.icon}</span>
                    <span className="font-label-md font-bold block mb-1">{ls.name}</span>
                    <span className="font-body-sm text-on-surface-variant">{ls.desc}</span>
                  </div>
                </label>
              ))}
            </div>
          </section>

          <section className="col-span-12 lg:col-span-7 glass-card rounded-2xl p-xl">
            <div className="flex items-center justify-between mb-lg"><h3 className="font-headline-sm flex items-center gap-2">🏆 Learning Goals</h3><button className="text-primary font-label-md flex items-center gap-1 hover:underline"><Plus className="h-4 w-4" /> Add Goal</button></div>
            <div className="space-y-xl">
              {goals.map((g) => (
                <div key={g.label}>
                  <div className="flex justify-between items-end mb-sm"><div><span className="font-label-md font-bold block">{g.label}</span><span className="font-body-sm text-on-surface-variant">{g.target}</span></div><span className="font-label-md text-primary font-bold">{g.progress}%</span></div>
                  <div className="w-full bg-surface-container rounded-full h-3 overflow-hidden"><div className={`${g.color} h-full rounded-full transition-all`} style={{ width: `${g.progress}%` }}></div></div>
                </div>
              ))}
            </div>
          </section>

          <section className="col-span-12 glass-card rounded-2xl p-xl">
            <div className="flex items-center justify-between mb-xl"><h3 className="font-headline-sm flex items-center gap-2">✅ Trusted Tutors</h3><Link href="/tutors" className="font-label-md text-primary flex items-center gap-1 group">Browse all tutors <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" /></Link></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-lg">
              {trustedTutors.map((t) => (
                <div key={t.name} className="bg-white/50 border border-outline-variant/30 rounded-2xl p-lg flex flex-col items-center text-center hover:shadow-md transition-all group">
                  <div className="w-20 h-20 rounded-full bg-primary-fixed flex items-center justify-center text-2xl font-bold text-on-primary-fixed border-2 border-white shadow-sm mb-md">{t.initials}</div>
                  <h4 className="font-label-md font-bold">{t.name}</h4>
                  <p className="font-body-sm text-on-surface-variant mb-md">{t.subject}</p>
                  <div className="flex items-center gap-1 mb-lg"><Star className="h-4 w-4 text-tertiary fill-tertiary" /><span className="font-label-sm font-bold">{t.rating}</span><span className="font-label-sm text-on-surface-variant">({t.reviews})</span></div>
                  <Link href="/book-trial" className="w-full py-2 bg-primary-container text-on-primary-container rounded-lg font-label-sm group-hover:bg-primary group-hover:text-on-primary transition-colors text-center">Book Again</Link>
                </div>
              ))}
              <Link href="/tutors" className="border-2 border-dashed border-outline-variant/50 rounded-2xl p-lg flex flex-col items-center justify-center text-center hover:border-primary transition-all group">
                <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center mb-md group-hover:bg-primary-fixed transition-colors"><Plus className="h-6 w-6 text-outline group-hover:text-primary" /></div>
                <h4 className="font-label-md font-bold text-on-surface-variant group-hover:text-primary">Find New Tutors</h4>
                <p className="font-body-sm text-on-surface-variant mt-2">Explore 500+ verified experts</p>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
