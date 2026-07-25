import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Calendar, BookOpen, CheckCircle, Star, Zap, ArrowRight, Clock, GraduationCap } from "lucide-react";

export default async function StudentDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("users").select("*").eq("id", user.id).single();
  const { data: bookings } = await supabase.from("bookings").select("*, subjects(name)").eq("student_id", user.id).order("created_at", { ascending: false });

  const upcoming = bookings?.filter((b) => b.status === "confirmed" || b.status === "pending") || [];
  const completed = bookings?.filter((b) => b.status === "completed") || [];
  const firstName = profile?.full_name?.split(" ")[0] || "Student";

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
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 shadow-sm">
              <div className="flex justify-between items-start mb-3"><Zap className="h-5 w-5 text-emerald-300" /><span className="text-xs bg-white/20 text-white/90 px-2 py-0.5 rounded-full">Level 12</span></div>
              <div><div className="flex justify-between items-end mb-1"><p className="text-sm font-medium text-white">Skill XP</p><p className="text-xs text-white/80">840 / 1000</p></div><div className="w-full h-2 bg-white/20 rounded-full overflow-hidden"><div className="h-full bg-emerald-400 w-[84%] rounded-full"></div></div></div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 shadow-sm">
              <div className="flex justify-between items-start mb-3"><Calendar className="h-5 w-5 text-emerald-300" /><span className="text-xs text-white/80">7 Day Streak</span></div>
              <div className="flex gap-1 items-end h-10 mt-2">{["M","T","W","T","F","S","S"].map((d, i) => (<div key={d} className="flex-1 flex flex-col items-center"><div className="w-full bg-emerald-300/60 rounded-t-sm" style={{ height: `${[40,60,55,80,70,90,100][i]}%` }}></div></div>))}</div>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-20 -mt-8 px-6 max-w-[1280px] mx-auto space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Upcoming", value: upcoming.length, icon: Calendar, color: "bg-indigo-50 text-indigo-600" },
            { label: "Completed", value: completed.length, icon: CheckCircle, color: "bg-emerald-50 text-emerald-600" },
            { label: "Total", value: bookings?.length || 0, icon: BookOpen, color: "bg-amber-50 text-amber-600" },
            { label: "Book New", value: "", icon: GraduationCap, color: "bg-indigo-600 text-white isLink", href: "/book-trial" },
          ].map((s) => {
            const I = s.icon;
            const content = (<div className={`bg-white rounded-xl p-5 shadow-sm border border-gray-100 ${s.href ? "hover:bg-indigo-700 transition-colors" : ""}`}>
              <div className={`p-3 ${s.color} rounded-lg inline-flex mb-3`}><I className="h-5 w-5" /></div>
              {s.value !== "" && <p className="text-2xl font-bold text-gray-900">{s.value}</p>}
              <p className="text-xs text-gray-400 mt-1">{s.label}</p>
            </div>);
            return s.href ? <Link key={s.label} href={s.href}>{content}</Link> : <div key={s.label}>{content}</div>;
          })}
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100"><h2 className="text-xl font-bold text-gray-900">Upcoming Sessions</h2></div>
          {upcoming.length > 0 ? (
            <div className="divide-y divide-gray-50">
              {upcoming.slice(0, 3).map((b, i) => (
                <div key={b.id} className={`p-6 flex items-center gap-4 ${i === 0 ? "bg-white border-l-4 border-indigo-600" : ""}`}>
                  <img src={`/images/stitch/student_dashboard_mobile-${i % 2}.jpg`} alt="" className="w-14 h-14 rounded-full object-cover shadow-sm" />
                  <div className="flex-1"><p className="font-semibold text-gray-900">{b.subjects?.name || "Class"}</p><p className="text-sm text-gray-400">{b.scheduled_at ? new Date(b.scheduled_at).toLocaleString() : "Date TBD"}</p></div>
                  {i === 0 && <button className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold text-sm shadow-md hover:bg-indigo-700">Join Classroom</button>}
                  {i > 0 && <span className="text-gray-300">→</span>}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center"><BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-3" /><p className="text-gray-400">No classes yet</p><Link href="/book-trial" className="mt-4 inline-block bg-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-indigo-700">Book Your First Class</Link></div>
          )}
        </div>

        <div className="pb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Current Courses</h2>
          <div className="space-y-4">
            {[{ name: "Fullstack Development Bootcamp", progress: 70, completed: 12, total: 18, active: true },
              { name: "Business Communication", progress: 25, completed: 4, total: 16, active: false },
            ].map((c) => (
              <div key={c.name} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
                <div className="relative w-16 h-16 flex-shrink-0"><svg className="w-full h-full" viewBox="0 0 64 64"><circle cx="32" cy="32" r="28" fill="none" stroke="#e5e7eb" strokeWidth="4" /><circle cx="32" cy="32" r="28" fill="none" stroke="#4f46e5" strokeWidth="4" strokeDasharray={`${c.progress * 1.76} ${(100 - c.progress) * 1.76}`} strokeLinecap="round" transform="rotate(-90 32 32)" /></svg><div className="absolute inset-0 flex items-center justify-center"><span className="text-sm font-bold">{c.progress}%</span></div></div>
                <div className="flex-1"><h4 className="font-semibold text-gray-900">{c.name}</h4><p className="text-sm text-gray-400">{c.completed} of {c.total} lessons completed</p><div className="flex gap-2 mt-2"><span className={`text-xs px-2 py-0.5 rounded-full ${c.active ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>{c.active ? "Active" : "Started 2d ago"}</span></div></div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
