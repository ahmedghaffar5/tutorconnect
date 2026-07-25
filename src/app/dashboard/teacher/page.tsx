import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Calendar, Clock, GraduationCap, CheckCircle, XCircle, AlertTriangle, FileText, ArrowRight, HelpCircle, Bell } from "lucide-react";

export default async function TeacherDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: dbUser } = await supabase.from("users").select("role, full_name").eq("id", user.id).single();
  const userRole = dbUser?.role || user.user_metadata?.role;
  if (userRole !== "tutor" && userRole !== "admin") redirect("/dashboard/student");

  const admin = await createAdminClient();
  const { data: app } = await admin.from("teacher_applications").select("*").eq("user_id", user.id).maybeSingle();
  const { data: tutor } = await admin.from("tutors").select("*").eq("user_id", user.id).maybeSingle();
  const { data: bookings } = await admin.from("bookings").select("*").eq("tutor_id", tutor?.id).order("created_at", { ascending: false });

  const name = dbUser?.full_name || user.user_metadata?.full_name || user.email || "Teacher";
  const upcoming = bookings?.filter((b: any) => b.status === "confirmed" || b.status === "pending") || [];
  const showAppCard = !app || app.status !== "approved";
  const showProfileSetup = app?.status === "approved" && !tutor;
  const showDash = app?.status === "approved" && tutor;

  return (
    <div className="bg-[#f8f9ff] min-h-screen flex flex-col md:flex-row overflow-x-hidden">
      <aside className="hidden md:flex flex-col h-screen w-64 bg-[#eff4ff] p-4 gap-2 sticky top-0 border-r border-[#c7c4d8] shadow-sm">
        <div className="mb-4 px-2"><h1 className="font-bold text-xl text-indigo-600">TutorConnect</h1>
          <div className="mt-4 flex items-center gap-3 p-2 bg-gray-200/50 rounded-lg"><img src="/images/stitch/tutor_dashboard-0.jpg" alt="" className="w-10 h-10 rounded-full border-2 border-white shadow-sm object-cover" /><div><p className="text-sm font-bold text-gray-900">Tutor Workspace</p><p className="text-xs text-gray-400">Manage your students</p></div></div>
        </div>
        <nav className="flex-1 space-y-1">
          {[
            { icon: "📊", label: "Dashboard", active: true, badge: false },
            { icon: "📅", label: "Schedule" },
            { icon: "💰", label: "Earnings" },
            { icon: "💬", label: "Messages", badge: true },
            { icon: "⚙️", label: "Settings" },
          ].map((item) => (
            <button key={item.label} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all ${item.active ? "bg-indigo-100 text-indigo-600 font-bold scale-95 active:scale-90" : "text-gray-500 hover:bg-gray-200/50"}`}>
              <span>{item.icon}</span><span>{item.label}</span>{item.badge && <span className="ml-auto w-2 h-2 bg-red-500 rounded-full"></span>}
            </button>
          ))}
        </nav>
        <div className="mt-auto border-t border-gray-200 pt-4 space-y-2">
          <button className="w-full flex items-center justify-between px-4 py-3 bg-emerald-100 text-emerald-700 rounded-lg font-bold text-sm">
            <span>Go Online</span><div className="w-8 h-4 bg-emerald-500 rounded-full relative"><div className="absolute right-1 top-1 w-2 h-2 bg-white rounded-full"></div></div>
          </button>
          <button className="flex items-center gap-3 px-4 py-2 text-xs text-gray-500 hover:bg-gray-200/50 rounded-lg w-full"><HelpCircle className="h-4 w-4" /> Help Center</button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-h-screen pb-20 md:pb-0">
        <header className="flex justify-between items-center w-full max-w-[1280px] mx-auto px-6 h-16 bg-white shadow-sm sticky top-0 z-40">
          <h2 className="text-lg font-bold text-gray-900 hidden md:block">Welcome back, {name.split(" ")[0]}!</h2>
          <h2 className="text-lg font-bold text-indigo-600 md:hidden">TutorConnect</h2>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center bg-gray-50 px-4 py-1.5 rounded-full border border-gray-100"><span className="text-gray-400 mr-2">🔍</span><input className="bg-transparent border-none text-sm w-48 outline-none" placeholder="Search students, classes..." /></div>
            <button className="p-2 text-gray-400 relative"><Bell className="h-5 w-5" /><span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span></button>
            <img src="/images/stitch/tutor_dashboard-1.jpg" alt="" className="w-8 h-8 rounded-full object-cover" />
          </div>
        </header>

        <div className="max-w-[1280px] mx-auto p-6 space-y-8 w-full">
          {showAppCard && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <div className="flex items-start gap-4"><div className={`p-3 rounded-full ${!app ? "bg-gray-100" : app.status === "rejected" ? "bg-red-100" : "bg-yellow-100"}`}>{!app ? <FileText className="h-6 w-6 text-gray-500" /> : app.status === "rejected" ? <XCircle className="h-6 w-6 text-red-500" /> : <AlertTriangle className="h-6 w-6 text-yellow-600" />}</div>
                <div className="flex-1"><h3 className="text-lg font-bold text-gray-900">{!app ? "Application Not Submitted" : app.status === "rejected" ? "Application Not Approved" : "Application Under Review"}</h3><p className="text-sm text-gray-500 mt-1">{!app ? "You haven't submitted your teacher application yet." : app.status === "rejected" ? `Reason: ${app.rejection_reason || "Not specified"}` : "Your application is being reviewed."}</p>{!app && <Link href="/apply" className="inline-flex items-center gap-1.5 mt-3 text-sm font-medium text-indigo-600 hover:underline">Complete Application <ArrowRight className="h-4 w-4" /></Link>}</div></div>
            </div>
          )}
          {showProfileSetup && <div className="bg-gradient-to-r from-indigo-50 to-emerald-50 rounded-2xl p-6 border border-indigo-100"><div className="flex items-center gap-3 mb-3"><CheckCircle className="h-6 w-6 text-emerald-600" /><h3 className="text-lg font-bold text-gray-900">Application Approved!</h3></div><p className="text-sm text-gray-500 mb-4">Set up your teacher profile to start receiving bookings.</p><Link href="/dashboard/teacher/setup" className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700">Set Up Your Profile <ArrowRight className="h-4 w-4" /></Link></div>}

          {showDash && (<>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: "Upcoming Classes", value: upcoming.length, icon: Calendar, iconBg: "bg-indigo-100 text-indigo-600", trend: "+2 this week" },
                { label: "Pending Requests", value: (bookings?.filter((b:any) => b.status === "pending")||[]).length, icon: Clock, iconBg: "bg-emerald-100 text-emerald-600", alert: "Requires action" },
                { label: "Monthly Earnings", value: "$2,450.00", icon: GraduationCap, iconBg: "bg-amber-100 text-amber-600", trend: "14% growth" },
              ].map((s) => {
                const I = s.icon;
                return (<div key={s.label} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-start justify-between"><div><p className="text-sm text-gray-400 mb-1">{s.label}</p><h3 className="text-3xl font-bold text-gray-900">{s.value}</h3>{s.trend&&<p className="text-sm text-emerald-600 font-medium mt-2 flex items-center gap-1">↑ {s.trend}</p>}{s.alert&&<p className="text-sm text-red-500 font-medium mt-2">{s.alert}</p>}</div><div className={`p-3 ${s.iconBg} rounded-xl`}><I className="h-6 w-6" /></div></div>);
              })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8 bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                <div className="flex justify-between items-center mb-6"><h4 className="text-lg font-bold text-gray-900">This Week&apos;s Schedule</h4><div className="flex items-center gap-2"><button className="p-1 hover:bg-gray-100 rounded transition-colors">←</button><span className="text-sm font-medium text-gray-500">Oct 21 - Oct 27</span><button className="p-1 hover:bg-gray-100 rounded transition-colors">→</button></div></div>
                {upcoming.length > 0 ? upcoming.slice(0,3).map((b:any,i:number) => (
                  <div key={b.id} className="flex gap-4 border-b border-gray-100 pb-4 mb-4">
                    <div className="w-16 text-center"><p className="text-xs text-gray-400 uppercase">{["Mon","Tue","Wed"][i]||"N/A"}</p><p className="text-xl font-bold">{new Date(b.scheduled_at||Date.now()).getDate()}</p></div>
                    <div className="flex-1 p-4 bg-indigo-50/50 border-l-4 border-indigo-600 rounded-lg flex justify-between items-center"><div><p className="font-semibold text-indigo-600 text-sm">{b.subjects?.name||"Class"}</p><p className="text-xs text-gray-400 flex items-center gap-1">{b.scheduled_at?new Date(b.scheduled_at).toLocaleString():"TBD"}</p></div><button className="text-indigo-600 font-semibold text-xs hover:underline">Join Link</button></div>
                  </div>
                )) : <div className="py-12 text-center"><Calendar className="h-10 w-10 text-gray-300 mx-auto mb-3"/><p className="text-gray-400 text-sm">No upcoming classes</p></div>}
                <button className="w-full mt-4 py-3 text-indigo-600 font-bold text-sm hover:bg-indigo-50 rounded-lg transition-colors">View Full Calendar</button>
              </div>

              <div className="lg:col-span-4 space-y-6">
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                  <h4 className="text-lg font-bold mb-4">Recent Messages</h4>
                  <div className="space-y-4">
                    {[{name:"Leo Martinez",msg:"Could we move our session by 30 mins?",time:"12m",img:"/images/stitch/tutor_dashboard-2.jpg"},{name:"Elena Vance",msg:"Thanks for the resources! The calculus notes were...",time:"2h",img:"/images/stitch/tutor_dashboard-3.jpg"}].map((m)=>(
                      <div key={m.name} className="flex gap-3 group cursor-pointer"><img src={m.img} alt="" className="w-12 h-12 rounded-full object-cover" /><div className="flex-1 border-b border-gray-100 pb-3"><div className="flex justify-between"><p className="text-sm font-bold text-gray-900">{m.name}</p><span className="text-xs text-gray-400">{m.time} ago</span></div><p className="text-xs text-gray-400 truncate">{m.msg}</p></div></div>
                    ))}
                  </div>
                  <button className="w-full mt-4 py-3 bg-gray-50 text-gray-500 font-bold text-sm hover:bg-gray-100 rounded-lg">Open Inbox</button>
                </div>
                <div className="bg-indigo-600 p-6 rounded-xl text-white shadow-lg relative overflow-hidden group">
                  <div className="absolute -right-8 -bottom-8 opacity-10 text-8xl transition-transform duration-500 group-hover:scale-110">🎯</div>
                  <h4 className="text-lg font-bold mb-2">Grow your reach</h4>
                  <p className="text-sm text-indigo-200 mb-4">Complete your profile to appear more in student search results.</p>
                  <Link href="/dashboard/profile" className="inline-block px-5 py-2.5 bg-white text-indigo-600 rounded-lg font-bold text-sm">Complete Profile</Link>
                </div>
              </div>
            </div>
          </>)}
        </div>
      </main>
    </div>
  );
}
