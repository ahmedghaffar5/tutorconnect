import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Calendar, BookOpen, Clock, ArrowRight, Star, TrendingUp } from "lucide-react";

export default async function StudentLearningDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("users").select("full_name").eq("id", user.id).single();
  const { data: bookings } = await supabase.from("bookings").select("*, subjects(name)").eq("student_id", user.id).order("created_at", { ascending: false });
  const upcoming = bookings?.filter((b) => b.status === "confirmed" || b.status === "pending") || [];

  return (
    <div className="bg-[#f8f9ff] min-h-screen p-6">
      <div className="max-w-[1280px] mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div><h1 className="text-3xl font-bold text-gray-900 mb-1">My Learning Dashboard</h1><p className="text-base text-gray-500">Track your progress and upcoming lessons.</p></div>
          <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-xl text-sm font-bold text-indigo-600"><Star className="h-4 w-4 fill-current" /> Level 7</div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            <div><h2 className="text-xl font-bold text-gray-900 mb-6">Upcoming Lessons</h2>
              <div className="space-y-4">
                {upcoming.length > 0 ? upcoming.slice(0, 3).map((b, i) => (
                  <div key={b.id} className={`bg-white rounded-xl border ${i === 0 ? "border-indigo-600 border-l-4 shadow-md" : "border-gray-100"} p-5 flex items-center justify-between`}>
                    <div className="flex items-center gap-4">
                      <img src={`/images/stitch/student_learning_dashboard-${i % 3}.jpg`} alt="" className="w-14 h-14 rounded-full object-cover shadow-sm" />
                      <div><p className="font-semibold text-gray-900">{b.subjects?.name || "Class"}</p><p className="text-sm text-gray-400">{b.scheduled_at ? new Date(b.scheduled_at).toLocaleString() : "Date TBD"}</p></div>
                    </div>
                    {i === 0 && <button className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold text-sm shadow-md hover:bg-indigo-700">Join Lesson Now</button>}
                  </div>
                )) : (
                  <div className="bg-white border border-dashed border-gray-200 rounded-xl p-8 text-center">
                    <Calendar className="h-10 w-10 text-gray-300 mx-auto mb-3" /><p className="text-gray-400">No upcoming lessons</p>
                    <Link href="/book-trial" className="mt-3 inline-block text-indigo-600 font-bold hover:underline">Book a Lesson →</Link>
                  </div>
                )}
              </div>
            </div>

            <div><h2 className="text-xl font-bold text-gray-900 mb-6">Recent Assignments</h2>
              <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-50">
                {[{ subject: "Advanced Calculus", grade: "A+", status: "Graded" }, { subject: "Physics Lab Report", grade: "", status: "Pending" }, { subject: "Essay Draft", grade: "", status: "Under Review" }].map((a) => (
                  <div key={a.subject} className="p-5 flex items-center justify-between hover:bg-gray-50">
                    <span className="font-medium text-gray-900">{a.subject}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${a.status === "Graded" ? "bg-green-100 text-green-700" : a.status === "Pending" ? "bg-yellow-100 text-yellow-700" : "bg-blue-100 text-blue-700"}`}>{a.grade || a.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
              <h3 className="text-xs text-gray-400 uppercase tracking-wider mb-4 font-semibold">Learning Progress</h3>
              <div className="space-y-4">
                <div><div className="flex justify-between text-sm mb-1"><span>Hours Studied</span><span className="font-bold">24.5h</span></div><div className="h-2 bg-gray-100 rounded-full"><div className="h-full w-3/5 bg-indigo-600 rounded-full"></div></div></div>
                <div><div className="flex justify-between text-sm mb-1"><span>Avg Score</span><span className="font-bold">87%</span></div><div className="h-2 bg-gray-100 rounded-full"><div className="h-full w-[87%] bg-emerald-500 rounded-full"></div></div></div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-xl p-6 text-white shadow-lg">
              <h4 className="text-xl font-bold mb-2">Find your next tutor</h4>
              <p className="text-sm text-indigo-200 mb-6">Browse expert tutors in your field.</p>
              <Link href="/tutors" className="inline-flex items-center gap-1 px-5 py-2.5 bg-white text-indigo-600 rounded-lg font-bold text-sm hover:opacity-90 transition-all">
                Browse Tutors <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
              <h3 className="text-xl font-bold mb-4">Recommended</h3>
              <div className="space-y-3">
                {[{ name: "Advanced Physics", img: "/images/stitch/student_learning_dashboard-0.jpg" }, { name: "Data Science 101", img: "/images/stitch/student_learning_dashboard-1.jpg" }].map((r) => (
                  <div key={r.name} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                    <img src={r.img} alt="" className="w-12 h-12 rounded-lg object-cover" /><span className="text-sm font-medium text-gray-900">{r.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
