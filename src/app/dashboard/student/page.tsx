import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Calendar, CreditCard, Star, BookOpen, LogOut, User, GraduationCap } from "lucide-react";
import LogoutButton from "@/components/ui/LogoutButton";

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
  const past = bookings?.filter((b) => b.status === "completed" || b.status === "cancelled") || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Student Dashboard</h1>
            <p className="text-gray-600">Welcome back, {profile?.full_name || "Student"}</p>
          </div>
          <LogoutButton />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <Calendar className="h-6 w-6 text-emerald-600 mb-2" />
            <p className="text-2xl font-bold text-gray-900">{upcoming.length}</p>
            <p className="text-sm text-gray-500">Upcoming</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <BookOpen className="h-6 w-6 text-emerald-600 mb-2" />
            <p className="text-2xl font-bold text-gray-900">{past.length}</p>
            <p className="text-sm text-gray-500">Completed</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <CreditCard className="h-6 w-6 text-emerald-600 mb-2" />
            <p className="text-2xl font-bold text-gray-900">-</p>
            <p className="text-sm text-gray-500">Payments</p>
          </div>
          <Link href="/book-trial" className="bg-emerald-600 rounded-xl p-4 shadow-sm hover:bg-emerald-700 transition-colors">
            <GraduationCap className="h-6 w-6 text-white mb-2" />
            <p className="text-white font-semibold">Book New</p>
            <p className="text-emerald-100 text-sm">Class</p>
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">My Classes</h2>
          </div>

          {bookings && bookings.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {bookings.map((booking) => (
                <div key={booking.id} className="p-6 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">{booking.subject || "Class"}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {booking.scheduled_at ? new Date(booking.scheduled_at).toLocaleDateString("en-US", {
                        weekday: "long", year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit"
                      }) : "Date TBD"}
                    </p>
                    <span className={`inline-block mt-2 px-3 py-1 text-xs font-medium rounded-full ${
                      booking.status === "confirmed" ? "bg-emerald-100 text-emerald-700" :
                      booking.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                      booking.status === "completed" ? "bg-blue-100 text-blue-700" :
                      "bg-red-100 text-red-700"
                    }`}>
                      {booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1)}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                      booking.booking_type === "trial" ? "bg-purple-100 text-purple-700" : "bg-emerald-100 text-emerald-700"
                    }`}>
                      {booking.booking_type === "trial" ? "Trial" : "Paid"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center">
              <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No classes yet</p>
              <Link href="/book-trial" className="mt-4 inline-block bg-emerald-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-emerald-700 transition-colors">
                Book Your First Class
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
