import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Users, GraduationCap, Calendar, DollarSign, CheckCircle, XCircle, Mail, MessageSquare } from "lucide-react";
import LogoutButton from "@/components/ui/LogoutButton";

export default async function AdminDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Check role - try DB first, then metadata, then app_metadata
  const { data: profile } = await supabase
    .from("users").select("role").eq("id", user.id).maybeSingle();

  const meta = user.user_metadata as Record<string, string> | undefined;
  const userRole = profile?.role || meta?.role || "student";

  if (userRole !== "admin") redirect("/dashboard");

  const { count: totalStudents } = await supabase
    .from("users").select("*", { count: "exact", head: true }).eq("role", "student") || { count: 0 };

  const { count: totalTutors } = await supabase
    .from("users").select("*", { count: "exact", head: true }).eq("role", "tutor") || { count: 0 };

  const { data: tutors } = await supabase.from("tutors").select("*");

  const { count: totalBookings } = await supabase
    .from("bookings").select("*", { count: "exact", head: true }) || { count: 0 };

  const { data: allBookings } = await supabase
    .from("bookings").select("*").order("created_at", { ascending: false }).limit(20);

  // Try to fetch contact messages (table may not exist yet)
  let contactMessages: any[] = [];
  try {
    const { data } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20);
    if (data) contactMessages = data;
  } catch {}

  const pendingTutors = tutors?.filter((t) => !t.is_approved) || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-500">Full control over the platform</p>
          </div>
          <LogoutButton />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <Users className="h-6 w-6 text-blue-600 mb-2" />
            <p className="text-2xl font-bold text-gray-900">{totalStudents || 0}</p>
            <p className="text-sm text-gray-500">Students</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <GraduationCap className="h-6 w-6 text-blue-600 mb-2" />
            <p className="text-2xl font-bold text-gray-900">{totalTutors || 0}</p>
            <p className="text-sm text-gray-500">Tutors</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <Calendar className="h-6 w-6 text-blue-600 mb-2" />
            <p className="text-2xl font-bold text-gray-900">{totalBookings || 0}</p>
            <p className="text-sm text-gray-500">Bookings</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <DollarSign className="h-6 w-6 text-blue-600 mb-2" />
            <p className="text-2xl font-bold text-gray-900">-</p>
            <p className="text-sm text-gray-500">Revenue</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <CheckCircle className="h-6 w-6 text-blue-600 mb-2" />
            <p className="text-2xl font-bold text-gray-900">{pendingTutors.length}</p>
            <p className="text-sm text-gray-500">Pending Tutors</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <Mail className="h-6 w-6 text-blue-600 mb-2" />
            <p className="text-2xl font-bold text-gray-900">{contactMessages.length}</p>
            <p className="text-sm text-gray-500">Messages</p>
          </div>
        </div>

        {pendingTutors.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-8">
            <h2 className="font-semibold text-amber-800 flex items-center gap-2">
              <XCircle className="h-5 w-5" />
              Pending Tutor Approvals ({pendingTutors.length})
            </h2>
            <p className="text-amber-700 text-sm mt-1">Tutors awaiting your approval before they appear publicly.</p>
          </div>
        )}

        {contactMessages.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-blue-600" /> Messages
              </h2>
              <span className="text-sm text-gray-400">{contactMessages.length} total</span>
            </div>
            <div className="divide-y divide-gray-100">
              {contactMessages.map((msg) => (
                <div key={msg.id} className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">{msg.name}</p>
                      <p className="text-sm text-blue-600">{msg.email}</p>
                    </div>
                    <span className="text-xs text-gray-400">
                      {new Date(msg.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="mt-2 text-gray-600 text-sm bg-gray-50 rounded-lg p-3">{msg.message}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Recent Bookings</h2>
          </div>
          {allBookings && allBookings.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {allBookings.map((booking) => (
                <div key={booking.id} className="p-6 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">{booking.subject || "Class"}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {booking.scheduled_at ? new Date(booking.scheduled_at).toLocaleDateString() : "Date TBD"}
                    </p>
                    <span className={`inline-block mt-2 px-3 py-1 text-xs font-medium rounded-full ${
                      booking.status === "confirmed" ? "bg-green-100 text-green-700" :
                      booking.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                      booking.status === "completed" ? "bg-blue-100 text-blue-700" : "bg-red-100 text-red-700"
                    }`}>
                      {booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1)}
                    </span>
                  </div>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                    booking.booking_type === "trial" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"
                  }`}>
                    {booking.booking_type === "trial" ? "Trial" : "Paid"}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center">
              <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No bookings yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
