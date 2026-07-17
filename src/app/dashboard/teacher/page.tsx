import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import { Calendar, Users, Star, Clock, CheckCircle, XCircle, AlertTriangle, FileText, ArrowRight } from "lucide-react";
import Link from "next/link";
import LogoutButton from "@/components/ui/LogoutButton";

export default async function TeacherDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const role = user.user_metadata?.role as string | undefined;
  const { data: dbUser } = await supabase.from("users").select("role").eq("id", user.id).single();
  const userRole = dbUser?.role || role;

  if (userRole !== "tutor" && userRole !== "admin") redirect("/dashboard/student");

  const admin = await createAdminClient();

  const { data: application } = await admin
    .from("teacher_applications")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  const { data: tutor } = await admin
    .from("tutors")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  const { data: bookings } = await admin
    .from("bookings")
    .select("*")
    .eq("tutor_id", tutor?.id)
    .order("created_at", { ascending: false });

  const name = tutor?.full_name || user.user_metadata?.full_name || user.email || "Teacher";

  const upcoming = bookings?.filter((b: any) => b.status === "confirmed" || b.status === "pending") || [];
  const completed = bookings?.filter((b: any) => b.status === "completed") || [];

  const studentIds = new Set(bookings?.map((b: any) => b.student_id) || []);
  const totalStudents = studentIds.size;

  const showApplicationCard = !application || application.status !== "approved";
  const showProfileSetup = application?.status === "approved" && !tutor;
  const showDashboard = application?.status === "approved" && tutor;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Teacher Dashboard</h1>
            <p className="text-gray-500">Welcome back, {name}</p>
          </div>
          <LogoutButton />
        </div>

        {showApplicationCard && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-full ${
                !application ? "bg-gray-100" :
                application.status === "pending" ? "bg-yellow-100" :
                application.status === "rejected" ? "bg-red-100" : "bg-emerald-100"
              }`}>
                {!application ? (
                  <FileText className="h-6 w-6 text-gray-600" />
                ) : application.status === "pending" ? (
                  <AlertTriangle className="h-6 w-6 text-yellow-600" />
                ) : application.status === "rejected" ? (
                  <XCircle className="h-6 w-6 text-red-600" />
                ) : (
                  <CheckCircle className="h-6 w-6 text-emerald-600" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">
                  {!application ? "Application Not Submitted" :
                   application.status === "pending" ? "Application Under Review" :
                   application.status === "rejected" ? "Application Not Approved" :
                   "Application Approved"}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {!application ? (
                    "You haven't submitted your teacher application yet. Complete it to start teaching."
                  ) : application.status === "pending" ? (
                    "Your application is being reviewed by our team. We'll notify you once it's approved."
                  ) : application.status === "rejected" ? (
                    <>Your application was not approved. <span className="font-medium">Reason:</span> {application.rejection_reason || "Not specified"}</>
                  ) : (
                    "Your application has been approved! Set up your teacher profile to get started."
                  )}
                </p>
                {!application && (
                  <Link href="/apply" className="inline-flex items-center gap-1.5 mt-3 text-sm font-medium text-blue-600 hover:text-blue-700">
                    Complete Application <ArrowRight className="h-4 w-4" />
                  </Link>
                )}
              </div>
              {application && (
                <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                  application.status === "submitted" || application.status === "under_review" ? "bg-yellow-100 text-yellow-700" :
                  application.status === "rejected" ? "bg-red-100 text-red-700" :
                  "bg-emerald-100 text-emerald-700"
                }`}>
                  {application.status.replace(/_/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase())}
                </span>
              )}
            </div>
          </div>
        )}

        {showProfileSetup && (
          <div className="bg-gradient-to-r from-blue-50 to-emerald-50 rounded-2xl border border-blue-100 p-6 mb-8">
            <div className="flex items-center gap-3 mb-3">
              <CheckCircle className="h-6 w-6 text-emerald-600" />
              <h3 className="text-lg font-semibold text-gray-900">Application Approved!</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Your teacher application has been approved. Set up your teacher profile to start receiving bookings.
            </p>
            <Link href="/dashboard/profile/edit?tab=tutor" className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
              Set Up Your Profile <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}

        {showDashboard && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <Calendar className="h-6 w-6 text-emerald-600 mb-2" />
                <p className="text-2xl font-bold text-gray-900">{upcoming.length}</p>
                <p className="text-sm text-gray-500">Upcoming Classes</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <Users className="h-6 w-6 text-emerald-600 mb-2" />
                <p className="text-2xl font-bold text-gray-900">{totalStudents}</p>
                <p className="text-sm text-gray-500">Total Students</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <Star className="h-6 w-6 text-emerald-600 mb-2" />
                <p className="text-2xl font-bold text-gray-900">{completed.length}</p>
                <p className="text-sm text-gray-500">Completed</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <Clock className="h-6 w-6 text-emerald-600 mb-2" />
                <p className="text-2xl font-bold text-gray-900">{tutor?.rating ? `${tutor.rating.toFixed(1)}` : "-"}</p>
                <p className="text-sm text-gray-500">Rating</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">Upcoming Bookings</h2>
              </div>

              {bookings && bookings.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {bookings.map((booking: any) => (
                    <div key={booking.id} className="p-6">
                      <div className="flex items-center justify-between">
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
                            booking.status === "completed" ? "bg-blue-100 text-blue-700" : "bg-red-100 text-red-700"
                          }`}>
                            {booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1)}
                          </span>
                        </div>
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${
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
                  <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No bookings yet</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
