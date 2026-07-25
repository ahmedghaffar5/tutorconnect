import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Calendar, Users, Star, Clock, CheckCircle, XCircle, AlertTriangle, FileText, ArrowRight, GraduationCap, MessageSquare, Settings, HelpCircle } from "lucide-react";

export default async function TeacherDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: dbUser } = await supabase.from("users").select("role, full_name").eq("id", user.id).single();
  const userRole = dbUser?.role || user.user_metadata?.role;
  if (userRole !== "tutor" && userRole !== "admin") redirect("/dashboard/student");

  const admin = await createAdminClient();
  const { data: application } = await admin.from("teacher_applications").select("*").eq("user_id", user.id).maybeSingle();
  const { data: tutor } = await admin.from("tutors").select("*").eq("user_id", user.id).maybeSingle();
  const { data: bookings } = await admin.from("bookings").select("*").eq("tutor_id", tutor?.id).order("created_at", { ascending: false });

  const name = dbUser?.full_name || user.user_metadata?.full_name || user.email || "Teacher";
  const upcoming = bookings?.filter((b: any) => b.status === "confirmed" || b.status === "pending") || [];
  const completed = bookings?.filter((b: any) => b.status === "completed") || [];
  const totalStudents = new Set(bookings?.map((b: any) => b.student_id)).size;
  const showApplicationCard = !application || application.status !== "approved";
  const showProfileSetup = application?.status === "approved" && !tutor;
  const showDashboard = application?.status === "approved" && tutor;

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-container-max mx-auto p-lg md:p-xl space-y-xl">
        <div className="flex items-center justify-between">
          <div><h1 className="font-headline-md">Tutor Workspace</h1><p className="font-body-md text-on-surface-variant">Welcome back, {name}</p></div>
          <div className="flex items-center gap-md">
            <button className="p-2 text-on-surface-variant relative"><span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full"></span></button>
          </div>
        </div>

        {showApplicationCard && (
          <div className="bg-surface rounded-2xl border border-outline-variant p-xl">
            <div className="flex items-start gap-lg">
              <div className={`p-3 rounded-full ${!application ? "bg-surface-container" : application.status === "rejected" ? "bg-error-container" : "bg-surface-container-high"}`}>
                {!application ? <FileText className="h-6 w-6 text-on-surface-variant" /> : application.status === "rejected" ? <XCircle className="h-6 w-6 text-error" /> : <AlertTriangle className="h-6 w-6 text-tertiary" />}
              </div>
              <div className="flex-1">
                <h3 className="font-headline-sm">{!application ? "Application Not Submitted" : application.status === "rejected" ? "Application Not Approved" : "Application Under Review"}</h3>
                <p className="font-body-sm text-on-surface-variant mt-1">
                  {!application ? "You haven't submitted your teacher application yet." : application.status === "rejected" ? <>Reason: {application.rejection_reason || "Not specified"}</> : "Your application is being reviewed."}
                </p>
                {!application && <Link href="/apply" className="inline-flex items-center gap-1.5 mt-3 text-sm font-medium text-primary hover:underline">Complete Application <ArrowRight className="h-4 w-4" /></Link>}
              </div>
            </div>
          </div>
        )}

        {showProfileSetup && (
          <div className="bg-gradient-to-r from-primary-fixed to-secondary-container/30 rounded-2xl p-xl">
            <div className="flex items-center gap-3 mb-3"><CheckCircle className="h-6 w-6 text-secondary" /><h3 className="font-headline-sm">Application Approved!</h3></div>
            <p className="font-body-sm text-on-surface-variant mb-4">Set up your teacher profile to start receiving bookings.</p>
            <Link href="/dashboard/teacher/setup" className="inline-flex items-center gap-1.5 px-lg py-md bg-primary text-on-primary rounded-lg font-label-md hover:opacity-90">Set Up Your Profile <ArrowRight className="h-4 w-4" /></Link>
          </div>
        )}

        {showDashboard && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
              {[
                { label: "Upcoming Classes", value: upcoming.length, icon: Calendar, color: "bg-primary-container text-primary", trend: "+2 this week" },
                { label: "Pending Requests", value: (bookings?.filter((b: any) => b.status === "pending") || []).length, icon: Clock, color: "bg-secondary-container text-on-secondary-container", alert: "Requires action" },
                { label: "Monthly Earnings", value: `$2,450.00`, icon: GraduationCap, color: "bg-tertiary-container text-on-tertiary", trend: "14% growth" },
              ].map((s) => {
                const I = s.icon;
                return (<div key={s.label} className="bg-surface-container-lowest p-xl rounded-xl border border-outline-variant shadow-sm flex items-start justify-between">
                  <div><p className="font-label-md text-on-surface-variant mb-1">{s.label}</p><h3 className="font-headline-md text-on-surface">{s.value}</h3>
                    {s.trend && <p className="font-body-sm text-secondary font-medium mt-2 flex items-center gap-1">↑ {s.trend}</p>}
                    {s.alert && <p className="font-body-sm text-error font-medium mt-2">{s.alert}</p>}
                  </div>
                  <div className={`p-md ${s.color} rounded-xl`}><I className="h-6 w-6" /></div>
                </div>);
              })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg">
              <div className="lg:col-span-8 bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm p-lg">
                <div className="flex justify-between items-center mb-xl"><h4 className="font-headline-sm">This Week&apos;s Schedule</h4></div>
                {upcoming.length > 0 ? upcoming.slice(0, 5).map((b: any, i: number) => (
                  <div key={b.id} className="flex gap-lg border-b border-outline-variant pb-md mb-md">
                    <div className="w-16 text-center"><p className="font-label-sm text-on-surface-variant uppercase">{["Mon", "Tue", "Wed", "Thu", "Fri"][i] || "N/A"}</p></div>
                    <div className="flex-1 p-md bg-primary-container/10 border-l-4 border-primary rounded-lg flex justify-between items-center">
                      <div><p className="font-label-md text-primary font-bold">{b.subjects?.name || "Class"}</p><p className="font-body-sm text-on-surface-variant flex items-center gap-1">{b.scheduled_at ? new Date(b.scheduled_at).toLocaleString() : "TBD"}</p></div>
                      <button className="text-primary font-bold font-label-md hover:underline">Join Link</button>
                    </div>
                  </div>
                )) : <div className="py-12 text-center"><Calendar className="h-10 w-10 text-on-surface-variant mx-auto mb-3" /><p className="text-on-surface-variant">No upcoming classes</p></div>}
                <button className="w-full mt-xl py-3 text-primary font-bold font-label-md hover:bg-primary-fixed/20 transition-colors rounded-lg">View Full Calendar</button>
              </div>
              <div className="lg:col-span-4 space-y-lg">
                <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm p-lg">
                  <h4 className="font-headline-sm mb-xl">Recent Messages</h4>
                  <div className="space-y-lg">
                    {[{ name: "Leo Martinez", msg: "Could we move our session by 30 mins?", time: "12m", initials: "LM" },
                      { name: "Elena Vance", msg: "Thanks for the resources!", time: "2h", initials: "EV" },
                    ].map((m) => (
                      <div key={m.name} className="flex gap-md group cursor-pointer">
                        <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-sm font-bold text-on-primary-fixed">{m.initials}</div>
                        <div className="flex-1 border-b border-outline-variant pb-md"><div className="flex justify-between"><p className="font-label-md font-bold">{m.name}</p><span className="font-label-sm text-on-surface-variant">{m.time} ago</span></div><p className="font-body-sm text-on-surface-variant truncate">{m.msg}</p></div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-primary p-lg rounded-xl text-on-primary shadow-lg relative overflow-hidden group">
                  <div className="absolute -right-8 -bottom-8 opacity-10 text-8xl">🎯</div>
                  <h4 className="font-headline-sm mb-2">Grow your reach</h4>
                  <p className="font-body-sm opacity-90 mb-lg">Complete your profile to appear more in student search results.</p>
                  <Link href="/dashboard/profile" className="inline-block px-md py-2 bg-on-primary text-primary rounded-lg font-bold font-label-md active:scale-95 transition-transform">Complete Profile</Link>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
