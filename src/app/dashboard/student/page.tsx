import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Calendar, BookOpen, CheckCircle, Star, Zap } from "lucide-react";

export default async function StudentDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: profile } = await supabase.from("users").select("*").eq("id", user.id).single();
  const { data: bookings } = await supabase.from("bookings").select("*, subjects(name)").eq("student_id", user.id).order("created_at", { ascending: false });
  const upcoming = bookings?.filter((b) => b.status === "confirmed" || b.status === "pending") || [];
  const firstName = profile?.full_name?.split(" ")[0] || "Student";

  return (
    <div className="bg-[#f8f9ff] min-h-screen pb-24 overflow-x-hidden">
      <header className="relative px-6 pt-10 pb-16 overflow-hidden bg-indigo-600">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full blur-3xl opacity-20 -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-400 rounded-full blur-3xl opacity-20 -ml-20 -mb-10"></div>
        <div className="relative z-10 max-w-[1280px] mx-auto">
          <div className="flex justify-between items-start">
            <div><h1 className="text-3xl font-bold text-white">Hi, {firstName}!</h1><p className="text-sm text-indigo-200 mt-1">Ready for your next breakthrough?</p></div>
            <div className="flex items-center gap-3"><img src="/images/stitch/student_dashboard_mobile-0.jpg" alt="" className="w-12 h-12 rounded-full border-2 border-white object-cover" /><span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-indigo-600 rounded-full"></span></div>
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Upcoming", value: upcoming.length, icon: Calendar, color: "bg-indigo-100 text-indigo-600" },
            { label: "Completed", value: bookings?.filter(b=>b.status==="completed").length||0, icon: CheckCircle, color: "bg-emerald-100 text-emerald-600" },
            { label: "Total", value: bookings?.length||0, icon: BookOpen, color: "bg-amber-100 text-amber-600" },
            { label: "Book New", value: "", icon: Star, color: "bg-indigo-600 text-white isLink", href: "/book-trial" },
          ].map((s) => {
            const I = s.icon;
            const content = (<div className={`bg-white rounded-xl p-5 shadow-sm border border-gray-100 ${s.href ? "hover:bg-indigo-700 transition-colors cursor-pointer" : ""}`}><div className={`p-3 ${s.color} rounded-lg inline-flex mb-3`}><I className="h-5 w-5" /></div>{s.value !== "" && <p className="text-2xl font-bold text-gray-900">{s.value}</p>}<p className="text-xs text-gray-400 mt-1">{s.label}</p></div>);
            return s.href ? <Link key={s.label} href={s.href}>{content}</Link> : <div key={s.label}>{content}</div>;
          })}
        </div>

        <section>
          <div className="flex justify-between items-center mb-4"><h2 className="text-xl font-bold text-gray-900">Upcoming Sessions</h2><button className="text-indigo-600 text-sm font-medium">See all</button></div>
          <div className="space-y-4">
            {upcoming.length > 0 ? upcoming.slice(0,2).map((b,i) => (
              <div key={b.id} className={`bg-white/70 backdrop-blur-sm p-4 rounded-xl shadow-sm border border-gray-100 ${i===0 ? "shadow-lg border-l-4 border-indigo-600" : ""}`} style={{background:"rgba(255,255,255,0.7)",backdropFilter:"blur(12px)"}}>
                <div className="flex items-center gap-4 mb-3">
                  <img src={`/images/stitch/student_dashboard_mobile-${i}.jpg`} alt="" className="w-14 h-14 rounded-full object-cover shadow-sm" />
                  <div className="flex-1"><h3 className="font-semibold text-gray-900 text-sm">{b.subjects?.name || "Class"}</h3><p className="text-xs text-gray-400">{b.scheduled_at ? new Date(b.scheduled_at).toLocaleString() : "Date TBD"}</p></div>
                  {i===0 && <span className="text-xs text-indigo-600 font-bold uppercase tracking-wider">In 15 Mins</span>}
                </div>
                {i===0 && <button className="w-full py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-semibold flex items-center justify-center gap-2">Join Classroom</button>}
              </div>
            )) : <div className="bg-white border border-dashed border-gray-200 rounded-xl p-8 text-center"><Calendar className="h-10 w-10 text-gray-300 mx-auto mb-3" /><p className="text-gray-400 text-sm">No upcoming sessions</p><Link href="/book-trial" className="mt-3 inline-block text-indigo-600 font-bold text-sm hover:underline">Book a Lesson →</Link></div>}
          </div>
        </section>

        <section className="pb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Current Courses</h2>
          <div className="space-y-4">
            {[{name:"Fullstack Development Bootcamp",progress:70,completed:12,total:18},{name:"Business Communication",progress:25,completed:4,total:16}].map((c)=>(
              <div key={c.name} className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-gray-100 shadow-sm flex items-center gap-4" style={{background:"rgba(255,255,255,0.7)",backdropFilter:"blur(12px)"}}>
                <div className="relative w-16 h-16 flex-shrink-0"><svg className="w-full h-full progress-ring" viewBox="0 0 64 64"><circle cx="32" cy="32" r="28" fill="none" stroke="#e5e7eb" strokeWidth="4"/><circle cx="32" cy="32" r="28" fill="none" stroke="#4f46e5" strokeWidth="4" strokeDasharray={`${c.progress*1.76} ${(100-c.progress)*1.76}`} strokeLinecap="round" transform="rotate(-90 32 32)"/></svg><div className="absolute inset-0 flex items-center justify-center"><span className="text-sm font-bold">{c.progress}%</span></div></div>
                <div className="flex-1 overflow-hidden"><h4 className="text-sm font-semibold text-gray-900 truncate">{c.name}</h4><p className="text-xs text-gray-400">{c.completed} of {c.total} lessons completed</p><div className="flex gap-2 mt-2"><span className={`text-xs px-2 py-0.5 rounded-full ${c.progress > 50 ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>{c.progress > 50 ? "Active" : "Started"}</span><span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full">{c.total - c.completed}h left</span></div></div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
