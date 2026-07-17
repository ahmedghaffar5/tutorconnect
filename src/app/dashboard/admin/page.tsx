import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Users, GraduationCap, Calendar, DollarSign, CheckCircle,
  XCircle, Mail, MessageSquare, FileText, Clock, Shield,
  UserCheck, AlertCircle, Eye, Search, UserPlus
} from "lucide-react";
import LogoutButton from "@/components/ui/LogoutButton";

const statusBadge: Record<string, { label: string; color: string }> = {
  submitted: { label: "Submitted", color: "bg-yellow-100 text-yellow-700" },
  under_review: { label: "Under Review", color: "bg-blue-100 text-blue-700" },
  more_info_requested: { label: "More Info Needed", color: "bg-orange-100 text-orange-700" },
  interview_scheduled: { label: "Interview Scheduled", color: "bg-purple-100 text-purple-700" },
  approved: { label: "Approved", color: "bg-green-100 text-green-700" },
  rejected: { label: "Rejected", color: "bg-red-100 text-red-700" },
};

const roleBadge: Record<string, { label: string; color: string }> = {
  student: { label: "Student", color: "bg-blue-100 text-blue-700" },
  parent: { label: "Parent", color: "bg-purple-100 text-purple-700" },
  tutor: { label: "Tutor", color: "bg-green-100 text-green-700" },
  admin: { label: "Admin", color: "bg-red-100 text-red-700" },
};

const adminRoleBadge: Record<string, { label: string; color: string }> = {
  super_admin: { label: "Super Admin", color: "bg-red-100 text-red-700" },
  reviewer: { label: "Reviewer", color: "bg-yellow-100 text-yellow-700" },
  support: { label: "Support", color: "bg-blue-100 text-blue-700" },
  finance: { label: "Finance", color: "bg-green-100 text-green-700" },
  content: { label: "Content", color: "bg-purple-100 text-purple-700" },
  ops: { label: "Ops", color: "bg-gray-100 text-gray-700" },
};

export default async function AdminDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("users").select("role").eq("id", user.id).maybeSingle();

  const meta = user.user_metadata as Record<string, string> | undefined;
  const userRole = profile?.role || meta?.role || "student";

  if (userRole !== "admin") redirect("/dashboard");

  const adminClient = createAdminClient();

  const { count: totalStudents } = (await adminClient
    .from("users").select("*", { count: "exact", head: true }).eq("role", "student")) || { count: 0 };

  const { count: totalTutors } = (await adminClient
    .from("users").select("*", { count: "exact", head: true }).eq("role", "tutor")) || { count: 0 };

  const { count: totalBookings } = (await adminClient
    .from("bookings").select("*", { count: "exact", head: true })) || { count: 0 };

  const { data: revenueData } = await adminClient
    .from("bookings").select("amount").not("amount", "is", null);

  const totalRevenue = (revenueData as any[] || []).reduce((sum: number, b: any) => sum + (Number(b.amount) || 0), 0);

  const { data: tutors } = await adminClient.from("tutors").select("*");
  const pendingTutors = (tutors as any[] || []).filter((t: any) => !t.is_approved);

  const { data: allBookings } = await adminClient
    .from("bookings").select("*").order("created_at", { ascending: false }).limit(20);

  const { data: applications } = await adminClient
    .from("teacher_applications")
    .select("*")
    .not("status", "eq", "draft")
    .order("created_at", { ascending: false });

  const { data: allUsers } = await adminClient
    .from("users")
    .select("*")
    .order("created_at", { ascending: false });

  let contactMessages: any[] = [];
  try {
    const { data, error } = await adminClient
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20);
    if (error) console.error("contact_messages error:", error.message);
    if (data) contactMessages = data;
  } catch (e) {
    console.error("contact_messages exception:", e);
  }

  const appList = (applications as any[]) || [];
  const usersList = (allUsers as any[]) || [];

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
            <p className="text-sm text-gray-500">Total Students</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <GraduationCap className="h-6 w-6 text-blue-600 mb-2" />
            <p className="text-2xl font-bold text-gray-900">{totalTutors || 0}</p>
            <p className="text-sm text-gray-500">Total Tutors</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <Calendar className="h-6 w-6 text-blue-600 mb-2" />
            <p className="text-2xl font-bold text-gray-900">{totalBookings || 0}</p>
            <p className="text-sm text-gray-500">Total Bookings</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <DollarSign className="h-6 w-6 text-blue-600 mb-2" />
            <p className="text-2xl font-bold text-gray-900">${totalRevenue.toFixed(2)}</p>
            <p className="text-sm text-gray-500">Revenue</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <UserCheck className="h-6 w-6 text-blue-600 mb-2" />
            <p className="text-2xl font-bold text-gray-900">{pendingTutors.length}</p>
            <p className="text-sm text-gray-500">Pending Tutors</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <Mail className="h-6 w-6 text-blue-600 mb-2" />
            <p className="text-2xl font-bold text-gray-900">{contactMessages.length}</p>
            <p className="text-sm text-gray-500">Unread Messages</p>
          </div>
        </div>

        {pendingTutors.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-8">
            <h2 className="font-semibold text-amber-800 flex items-center gap-2">
              <XCircle className="h-5 w-5" />
              Pending Tutor Approvals ({pendingTutors.length})
            </h2>
            <p className="text-amber-700 text-sm mt-1">Tutors awaiting approval before they appear publicly.</p>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-100 flex items-center gap-2">
            <div className="w-1 h-6 bg-blue-600 rounded-full" />
            <h2 className="text-lg font-semibold text-gray-900">Applications Queue</h2>
          </div>
          {appList.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {appList.map((app: any) => {
                const sb = statusBadge[app.status] || { label: app.status, color: "bg-gray-100 text-gray-700" };
                return (
                  <div key={app.id} className="p-5 flex items-center justify-between hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                        <FileText className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{app.full_name || app.name || "Unnamed"}</p>
                        <p className="text-sm text-gray-500">{app.email || "No email"}</p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          Submitted {app.created_at ? new Date(app.created_at).toLocaleDateString() : "—"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${sb.color}`}>{sb.label}</span>
                      <Link
                        href={`/dashboard/admin/applications/${app.id}`}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                      >
                        <Eye className="h-3.5 w-3.5" /> Review
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-12 text-center">
              <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No applications submitted yet</p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-100 flex items-center gap-2">
            <div className="w-1 h-6 bg-purple-600 rounded-full" />
            <h2 className="text-lg font-semibold text-gray-900">Users Management</h2>
            <span className="text-sm text-gray-400 ml-auto">{usersList.length} total</span>
          </div>
          {usersList.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <th className="px-6 py-3">Name</th>
                    <th className="px-6 py-3">Email</th>
                    <th className="px-6 py-3">Role</th>
                    <th className="px-6 py-3">Admin Role</th>
                    <th className="px-6 py-3">Created</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {usersList.map((u: any) => {
                    const rb = roleBadge[u.role] || { label: u.role || "Unknown", color: "bg-gray-100 text-gray-700" };
                    const arb = u.admin_role ? (adminRoleBadge[u.admin_role] || { label: u.admin_role, color: "bg-gray-100 text-gray-700" }) : null;
                    return (
                      <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{u.full_name || u.name || "—"}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{u.email || "—"}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 text-xs font-medium rounded-full ${rb.color}`}>{rb.label}</span>
                        </td>
                        <td className="px-6 py-4">
                          {arb ? (
                            <span className={`px-3 py-1 text-xs font-medium rounded-full ${arb.color}`}>{arb.label}</span>
                          ) : (
                            <span className="text-gray-400 text-sm">—</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {u.created_at ? new Date(u.created_at).toLocaleDateString() : "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center">
              <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No users found</p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-100 flex items-center gap-2">
            <div className="w-1 h-6 bg-emerald-600 rounded-full" />
            <h2 className="text-lg font-semibold text-gray-900">Recent Bookings</h2>
          </div>
          {allBookings && allBookings.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {allBookings.map((booking: any) => (
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

        {contactMessages.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center gap-2">
              <div className="w-1 h-6 bg-rose-600 rounded-full" />
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-rose-600" /> Messages
              </h2>
              <span className="text-sm text-gray-400 ml-auto">{contactMessages.length} total</span>
            </div>
            <div className="divide-y divide-gray-100">
              {contactMessages.map((msg: any) => (
                <div key={msg.id} className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">{msg.name}</p>
                      <p className="text-sm text-blue-600">{msg.email}</p>
                    </div>
                    <span className="text-xs text-gray-400">
                      {msg.created_at ? new Date(msg.created_at).toLocaleDateString() : ""}
                    </span>
                  </div>
                  <p className="mt-2 text-gray-600 text-sm bg-gray-50 rounded-lg p-3">{msg.message}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
