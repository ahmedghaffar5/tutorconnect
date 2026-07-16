import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Calendar, CreditCard, BookOpen, GraduationCap, CheckCircle, Clock } from "lucide-react";
import LogoutButton from "@/components/ui/LogoutButton";

const planLabels: Record<string, { label: string; color: string }> = {
  trial: { label: "Free Trial", color: "bg-purple-100 text-purple-700" },
  single: { label: "Single Session", color: "bg-blue-100 text-blue-700" },
  monthly: { label: "Monthly Package", color: "bg-green-100 text-green-700" },
  premium: { label: "Premium Monthly", color: "bg-amber-100 text-amber-700" },
};

export default async function StudentDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("users").select("*").eq("id", user.id).single();

  const { data: bookings } = await supabase
    .from("bookings")
    .select("*")
    .eq("student_id", user.id)
    .order("created_at", { ascending: false });

  const upcoming = bookings?.filter((b) => b.status === "confirmed" || b.status === "pending") || [];
  const completed = bookings?.filter((b) => b.status === "completed") || [];
  const currentPlan = bookings?.find((b) => b.plan && b.plan !== "trial" && b.status !== "cancelled");
  const planInfo = currentPlan ? planLabels[currentPlan.plan] || planLabels.single : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Student Dashboard</h1>
            <p className="text-gray-500">Welcome back, {profile?.full_name || "Student"}</p>
          </div>
          <LogoutButton />
        </div>

        {planInfo && (
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 mb-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm font-medium uppercase tracking-wide">Current Plan</p>
                <p className="text-2xl font-bold mt-1">{planInfo.label}</p>
                <div className="flex items-center gap-4 mt-3 text-sm text-blue-100">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle className="h-4 w-4" /> {completed.length} completed
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" /> {upcoming.length} upcoming
                  </span>
                </div>
              </div>
              <Link
                href="/book-trial"
                className="bg-white text-blue-600 px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-blue-50 transition-colors"
              >
                Book Another
              </Link>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <Calendar className="h-6 w-6 text-blue-600 mb-2" />
            <p className="text-2xl font-bold text-gray-900">{upcoming.length}</p>
            <p className="text-sm text-gray-500">Upcoming Classes</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <BookOpen className="h-6 w-6 text-blue-600 mb-2" />
            <p className="text-2xl font-bold text-gray-900">{completed.length}</p>
            <p className="text-sm text-gray-500">Completed</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <CreditCard className="h-6 w-6 text-blue-600 mb-2" />
            <p className="text-2xl font-bold text-gray-900">{bookings?.length || 0}</p>
            <p className="text-sm text-gray-500">Total Bookings</p>
          </div>
          <Link href="/book-trial" className="bg-blue-600 rounded-xl p-4 shadow-sm hover:bg-blue-700 transition-colors">
            <GraduationCap className="h-6 w-6 text-white mb-2" />
            <p className="text-white font-semibold">Book New</p>
            <p className="text-blue-100 text-sm">Class</p>
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">My Classes</h2>
          </div>

          {bookings && bookings.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {bookings.map((booking) => {
                const bp = booking.plan ? planLabels[booking.plan] : null;
                return (
                  <div key={booking.id} className="p-6 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">{booking.subject || "Class"}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {booking.scheduled_at ? new Date(booking.scheduled_at).toLocaleDateString("en-US", {
                          weekday: "long", year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit"
                        }) : "Date TBD"}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                          booking.status === "confirmed" ? "bg-green-100 text-green-700" :
                          booking.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                          booking.status === "completed" ? "bg-blue-100 text-blue-700" :
                          "bg-red-100 text-red-700"
                        }`}>
                          {booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1)}
                        </span>
                        {bp && (
                          <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${bp.color}`}>
                            {bp.label}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-12 text-center">
              <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No classes yet</p>
              <Link href="/book-trial" className="mt-4 inline-block bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors">
                Book Your First Class
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
