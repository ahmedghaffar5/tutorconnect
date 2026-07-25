import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Calendar, BookOpen, Clock, ArrowRight, Star, TrendingUp } from "lucide-react";

export default async function StudentLearningDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: bookings } = await supabase
    .from("bookings")
    .select("*, subjects(name)")
    .eq("student_id", user.id)
    .order("created_at", { ascending: false });

  const upcoming = bookings?.filter((b) => b.status === "confirmed" || b.status === "pending") || [];

  return (
    <div className="bg-background min-h-screen p-lg md:p-2xl">
      <div className="max-w-container-max mx-auto space-y-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-headline-md mb-1">My Learning Dashboard</h1>
            <p className="font-body-md text-on-surface-variant">Track your progress and upcoming lessons.</p>
          </div>
          <div className="flex items-center gap-2 px-md py-2 bg-primary-fixed rounded-xl text-sm font-bold text-on-primary-fixed">
            <Star className="h-4 w-4 fill-current" /> Level 7
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-xl">
          <div className="lg:col-span-8 space-y-xl">
            <div>
              <h2 className="font-headline-sm mb-lg">Upcoming Lessons</h2>
              <div className="space-y-md">
                {upcoming.length > 0 ? upcoming.slice(0, 3).map((b, i) => (
                  <div key={b.id} className={`bg-surface rounded-xl border ${i === 0 ? "border-primary border-l-4" : "border-outline-variant"} p-lg flex items-center justify-between`}>
                    <div className="flex items-center gap-md">
                      <div className="w-12 h-12 rounded-full bg-primary-fixed flex items-center justify-center font-bold text-on-primary-fixed">{["SC", "JM", "AH"][i]}</div>
                      <div>
                        <p className="font-label-md font-bold">{b.subjects?.name || "Class"}</p>
                        <p className="font-body-sm text-on-surface-variant">{b.scheduled_at ? new Date(b.scheduled_at).toLocaleString() : "Date TBD"}</p>
                      </div>
                    </div>
                    {i === 0 && <button className="px-lg py-md bg-primary text-on-primary rounded-xl font-bold text-sm shadow-md hover:opacity-90">Join Lesson Now</button>}
                  </div>
                )) : (
                  <div className="bg-surface border border-dashed border-outline-variant rounded-xl p-xl text-center">
                    <Calendar className="h-10 w-10 text-on-surface-variant mx-auto mb-3" />
                    <p className="text-on-surface-variant">No upcoming lessons</p>
                    <Link href="/book-trial" className="mt-3 inline-block text-primary font-bold hover:underline">Book a Lesson →</Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-lg">
            <div className="bg-surface-container-high rounded-xl p-xl shadow-sm">
              <h3 className="font-label-md text-on-surface-variant uppercase tracking-wider mb-md">Learning Progress</h3>
              <div className="space-y-md">
                <div><div className="flex justify-between font-body-sm mb-1"><span>Hours Studied</span><span className="font-bold">24.5h</span></div><div className="h-2 bg-surface-container-highest rounded-full"><div className="h-full w-3/5 bg-primary rounded-full"></div></div></div>
                <div><div className="flex justify-between font-body-sm mb-1"><span>Avg Score</span><span className="font-bold">87%</span></div><div className="h-2 bg-surface-container-highest rounded-full"><div className="h-full w-[87%] bg-secondary rounded-full"></div></div></div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-primary to-primary-container rounded-xl p-xl text-on-primary shadow-lg">
              <h4 className="font-headline-sm mb-2">Find your next tutor</h4>
              <p className="font-body-sm opacity-90 mb-lg">Browse expert tutors in your field.</p>
              <Link href="/tutors" className="inline-flex items-center gap-1 px-lg py-md bg-on-primary text-primary rounded-lg font-bold text-sm hover:opacity-90 transition-all">
                Browse Tutors <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
