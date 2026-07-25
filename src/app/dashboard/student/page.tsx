import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Calendar, CreditCard, BookOpen, GraduationCap, CheckCircle, Clock, Star, Zap, ArrowRight } from "lucide-react";

export default async function StudentDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("users").select("*").eq("id", user.id).single();
  const { data: bookings } = await supabase.from("bookings").select("*, subjects(name)").eq("student_id", user.id).order("created_at", { ascending: false });

  const upcoming = bookings?.filter((b) => b.status === "confirmed" || b.status === "pending") || [];
  const completed = bookings?.filter((b) => b.status === "completed") || [];

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-container-max mx-auto space-y-xl p-lg md:p-xl">
        <div className="bg-primary rounded-2xl p-xl md:p-2xl text-on-primary overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-container rounded-full blur-3xl opacity-20 -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary-container rounded-full blur-3xl opacity-20 -ml-20 -mb-10"></div>
          <div className="relative z-10">
            <div className="flex justify-between items-start">
              <div><h1 className="font-headline-md">Hi, {profile?.full_name?.split(" ")[0] || "Student"}!</h1><p className="font-body-sm text-on-primary-container opacity-90 mt-1">Ready for your next breakthrough?</p></div>
              <div className="flex items-center gap-2 px-md py-2 bg-primary-fixed rounded-xl text-sm font-bold text-on-primary-fixed"><Star className="h-4 w-4 fill-current" /> Level 7</div>
            </div>
            <div className="mt-xl grid grid-cols-2 gap-md">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-md shadow-sm">
                <div className="flex justify-between items-start mb-2"><Zap className="h-5 w-5 text-secondary-container" /><span className="font-label-sm bg-primary-fixed/30 text-on-primary px-2 py-0.5 rounded-full">Level 12</span></div>
                <div><div className="flex justify-between items-end mb-1"><p className="font-label-md">Skill XP</p><p className="font-label-sm opacity-80">840 / 1000</p></div><div className="w-full h-2 bg-white/20 rounded-full overflow-hidden"><div className="h-full bg-secondary w-[84%] rounded-full"></div></div></div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-md shadow-sm">
                <div className="flex justify-between items-start mb-2"><Calendar className="h-5 w-5 text-secondary-container" /><span className="font-label-sm opacity-80">7 Day Streak</span></div>
                <div className="flex gap-1 items-end h-12 mt-3">
                  {[40, 60, 55, 80, 70, 90, 100].map((h, i) => (<div key={i} className="flex-1 bg-secondary-container/60 rounded-t-sm" style={{ height: `${h}%` }}></div>))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-lg -mt-8 relative z-20">
          {[
            { label: "Upcoming", value: upcoming.length, icon: Calendar, color: "bg-primary-fixed text-primary" },
            { label: "Completed", value: completed.length, icon: CheckCircle, color: "bg-secondary-container text-secondary" },
            { label: "Total", value: bookings?.length || 0, icon: BookOpen, color: "bg-tertiary-fixed text-tertiary" },
            { label: "Book New", value: "", icon: GraduationCap, color: "bg-primary text-on-primary isLink", href: "/book-trial" },
          ].map((s) => {
            const I = s.icon;
            const content = (<div className="bg-surface-container-lowest rounded-xl p-lg shadow-sm border border-outline-variant flex items-start justify-between h-full">
              <div><p className="font-label-md text-on-surface-variant mb-1">{s.label}</p>{s.value !== "" && <h3 className="font-headline-md">{s.value}</h3>}</div>
              <div className={`p-md ${s.color} rounded-xl`}><I className="h-5 w-5" /></div>
            </div>);
            return s.href ? <Link key={s.label} href={s.href} className="hover:opacity-90 transition-opacity">{content}</Link> : <div key={s.label}>{content}</div>;
          })}
        </div>

        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-sm overflow-hidden">
          <div className="p-lg border-b border-outline-variant"><h2 className="font-headline-sm">My Sessions</h2></div>
          {bookings && bookings.length > 0 ? (
            <div className="divide-y divide-outline-variant">
              {bookings.map((booking) => (
                <div key={booking.id} className="p-lg flex items-center justify-between">
                  <div>
                    <p className="font-label-md font-bold">{booking.subjects?.name || "Class"}</p>
                    <p className="font-body-sm text-on-surface-variant mt-1">{booking.scheduled_at ? new Date(booking.scheduled_at).toLocaleString() : "Date TBD"}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${booking.status === "confirmed" ? "bg-secondary-container text-on-secondary-container" : booking.status === "pending" ? "bg-surface-container-high text-on-surface" : booking.status === "completed" ? "bg-primary-fixed text-primary" : "bg-error-container text-error"}`}>
                        {booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1)}
                      </span>
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${booking.booking_type === "trial" ? "bg-tertiary-fixed text-tertiary" : "bg-secondary-container text-on-secondary-container"}`}>
                        {booking.booking_type === "trial" ? "Trial" : "Paid"}
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-on-surface-variant" />
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center">
              <BookOpen className="h-12 w-12 text-on-surface-variant mx-auto mb-3" />
              <p className="text-on-surface-variant">No classes yet</p>
              <Link href="/book-trial" className="mt-4 inline-block bg-primary text-on-primary px-xl py-md rounded-xl font-label-md hover:opacity-90">Book Your First Class</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
