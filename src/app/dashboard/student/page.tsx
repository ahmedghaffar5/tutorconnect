import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Calendar, BookOpen, CheckCircle, Star, Zap, ArrowRight } from "lucide-react";

export default async function StudentDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: profile } = await supabase.from("users").select("*").eq("id", user.id).single();
  const { data: bookings } = await supabase.from("bookings").select("*, subjects(name)").eq("student_id", user.id).order("created_at", { ascending: false });
  const { data: goals } = await supabase.from("learning_goals").select("*").eq("student_id", user.id).eq("status", "active").limit(3);
  const { data: assignments } = await supabase.from("assignments").select("*").eq("student_id", user.id).in("status", ["assigned", "in_progress"]).limit(3);
  const { data: notifications } = await supabase.from("notifications").select("*").eq("user_id", user.id).eq("is_read", false).limit(5);

  const upcoming = bookings?.filter((b) => b.status === "confirmed" || b.status === "pending") || [];
  const completed = bookings?.filter((b) => b.status === "completed") || [];
  const firstName = profile?.full_name?.split(" ")[0] || "Student";
  const nextLesson = upcoming[0];

  return (
    <div className="bg-[#f8f9ff] min-h-screen pb-24 overflow-x-hidden">
      <header className="relative px-6 pt-10 pb-16 overflow-hidden bg-indigo-600">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full blur-3xl opacity-20 -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-400 rounded-full blur-3xl opacity-20 -ml-20 -mb-10"></div>
        <div className="relative z-10 max-w-[1280px] mx-auto">
          <div className="flex justify-between items-start">
            <div><h1 className="text-3xl font-bold text-white">Hi, {firstName}!</h1><p className="text-sm text-indigo-200 mt-1">Ready for your next breakthrough?</p></div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-xl text-sm font-bold text-white"><Star className="h-4 w-4 fill-current" /> Level 7</div>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 shadow-sm flex flex-col justify-between" style={{height:"128px"}}>
              <div className="flex justify-between items-start"><Zap className="h-5 w-5 text-emerald-300" /><span className="text-xs bg-white/20 text-white/90 px-2 py-0.5 rounded-full">Level 12</span></div>
              <div><div className="flex justify-between items-end mb-1"><p className="text-sm font-medium text-white">Skill XP</p><p className="text-xs text-white/80">840 / 1000</p></div><div className="w-full h-2 bg-white/20 rounded-full overflow-hidden"><div className="h-full bg-indigo-400 w-[84%] rounded-full"></div></div></div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 shadow-sm flex flex-col justify-between" style={{height:"128px"}}>
              <div className="flex justify-between items-start"><Calendar className="h-5 w-5 text-emerald-300" /><span className="text-xs text-white/80">7 Day Streak</span></div>
              <div className="flex gap-1 items-end h-full pt-2">{["M","T","W","T","F","S","S"].map((d,i)=><div key={d} className="flex-1 bg-emerald-300/60 rounded-t-sm" style={{height:`${[40,60,55,80,70,90,100][i]}%`}}></div>)}</div>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-20 -mt-8 px-6 max-w-[1280px] mx-auto space-y-6">
        {nextLesson && (
          <div className="bg-white/70 backdrop-blur-sm p-4 rounded-xl shadow-lg border-l-4 border-indigo-600" style={{background:"rgba(255,255,255,0.7)",backdropFilter:"blur(12px)"}}>
            <div className="flex items-center gap-3 mb-1"><span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Next Lesson</span><span className="text-xs text-gray-400">{nextLesson.scheduled_at ? new Date(nextLesson.scheduled_at).toLocaleDateString() : ""}</span></div>
            <div className="flex items-center justify-between"><div className="flex items-center gap-3"><img src="/images/stitch/student_dashboard_mobile-0.jpg" alt="" className="w-10 h-10 rounded-full object-cover" /><div><p className="font-semibold text-sm text-gray-900">{nextLesson.subjects?.name || "Class"}</p><p className="text-xs text-gray-400">{nextLesson.scheduled_at ? new Date(nextLesson.scheduled_at).toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"}) : ""}</p></div></div><button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-indigo-700">Join</button></div>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Upcoming", value: upcoming.length, icon: Calendar, color: "bg-indigo-100 text-indigo-600" },
            { label: "Completed", value: completed.length, icon: CheckCircle, color: "bg-emerald-100 text-emerald-600" },
            { label: "Goals", value: goals?.length || 0, icon: Star, color: "bg-amber-100 text-amber-600" },
            { label: "Book New", value: "", icon: BookOpen, color: "bg-indigo-600 text-white isLink", href: "/book-trial" },
          ].map((s) => {
            const I = s.icon;
            const content = (<div className={`bg-white rounded-xl p-5 shadow-sm border border-gray-100 ${s.href ? "hover:bg-indigo-700 transition-colors cursor-pointer" : ""}`}><div className={`p-3 ${s.color} rounded-lg inline-flex mb-3`}><I className="h-5 w-5" /></div>{s.value !== "" && <p className="text-2xl font-bold text-gray-900">{s.value}</p>}<p className="text-xs text-gray-400 mt-1">{s.label}</p></div>);
            return s.href ? <Link key={s.label} href={s.href}>{content}</Link> : <div key={s.label}>{content}</div>;
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <section>
            <div className="flex justify-between items-center mb-4"><h2 className="text-lg font-bold text-gray-900">Upcoming Sessions</h2><Link href="/student/bookings" className="text-indigo-600 text-sm font-medium">See all</Link></div>
            <div className="space-y-3">
              {upcoming.length > 0 ? upcoming.slice(0,3).map((b,i) => (
                <div key={b.id} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex items-center gap-3">
                  <img src={`/images/stitch/student_dashboard_mobile-${i%2}.jpg`} alt="" className="w-12 h-12 rounded-full object-cover" />
                  <div className="flex-1"><p className="font-semibold text-sm text-gray-900">{b.subjects?.name || "Class"}</p><p className="text-xs text-gray-400">{b.scheduled_at ? new Date(b.scheduled_at).toLocaleString() : "Date TBD"}</p><span className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block ${b.status === "confirmed" ? "bg-emerald-100 text-emerald-700" : "bg-yellow-100 text-yellow-700"}`}>{b.status}</span></div>
                  <ArrowRight className="h-4 w-4 text-gray-300" />
                </div>
              )) : <div className="bg-white border border-dashed border-gray-200 rounded-xl p-6 text-center"><p className="text-gray-400 text-sm">No upcoming sessions</p><Link href="/book-trial" className="mt-2 inline-block text-indigo-600 font-bold text-sm hover:underline">Book a Lesson →</Link></div>}
            </div>
          </section>
          <section>
            <div className="flex justify-between items-center mb-4"><h2 className="text-lg font-bold text-gray-900">Active Goals</h2><Link href="/dashboard/student/profile" className="text-indigo-600 text-sm font-medium">Manage</Link></div>
            <div className="space-y-3">
              {goals && goals.length > 0 ? goals.map((g:any) => (
                <div key={g.id} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm"><div className="flex justify-between items-center mb-2"><p className="text-sm font-semibold text-gray-900">{g.title}</p><span className="text-xs font-bold text-indigo-600">{g.progress_pct}%</span></div><div className="w-full h-2 bg-gray-100 rounded-full"><div className="h-full bg-indigo-600 rounded-full" style={{width:`${g.progress_pct}%`}}></div></div></div>
              )) : <div className="bg-white border border-dashed border-gray-200 rounded-xl p-6 text-center"><p className="text-gray-400 text-sm">No active goals</p></div>}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
