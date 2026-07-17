"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";

// Icons
import {
  LayoutDashboard, Users, GraduationCap, Calendar, DollarSign, BookOpen,
  MessageSquare, Settings, Shield, LogOut, Search, CheckCircle, XCircle,
  Clock, Star, Mail, Phone, MapPin, ChevronRight, Menu, X, Upload,
  Download, Plus, Trash2, Edit, Eye, Filter, ArrowUpDown, ChevronDown,
  UserCheck, UserX, AlertTriangle, FileText, Flag
} from "lucide-react";

const tabs = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "applications", label: "Applications", icon: FileText },
  { id: "users", label: "Users", icon: Users },
  { id: "tutors", label: "Tutors", icon: GraduationCap },
  { id: "bookings", label: "Bookings", icon: Calendar },
  { id: "payments", label: "Payments", icon: DollarSign },
  { id: "subjects", label: "Subjects", icon: BookOpen },
  { id: "messages", label: "Messages", icon: MessageSquare },
  { id: "settings", label: "Settings", icon: Settings },
  { id: "audit", label: "Audit Log", icon: Shield },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const { data: { user: u } } = await supabase.auth.getUser();
    if (!u) { router.push("/login"); return; }
    setUser(u);
    const meta = u.user_metadata as Record<string, string> | undefined;
    const { data: p } = await supabase.from("users").select("*").eq("id", u.id).maybeSingle();
    setProfile(p);
    const role = p?.role || meta?.role;
    if (role !== "admin") { router.push("/dashboard"); return; }

    try {
      const admin = (await import("@/lib/supabase/admin")).createAdminClient();

      const [students, tutors, bookings, flags, messages, apps, subjects, payments, logs] = await Promise.all([
        admin.from("users").select("*", { count: "exact", head: true }).eq("role", "student"),
        admin.from("tutors").select("*"),
        admin.from("bookings").select("*").order("created_at", { ascending: false }).limit(50),
        admin.from("feature_flags").select("*"),
        admin.from("contact_messages").select("*").order("created_at", { ascending: false }).limit(20),
        admin.from("teacher_applications").select("*").order("created_at", { ascending: false }).limit(50),
        admin.from("subjects").select("*").order("name"),
        admin.from("payments").select("*").order("created_at", { ascending: false }).limit(50),
        admin.from("audit_logs").select("*, users(full_name, email)").order("created_at", { ascending: false }).limit(30),
      ]);

      setData({
        totalStudents: students.count || 0,
        totalTutors: tutors.data?.length || 0,
        totalBookings: bookings.data?.length || 0,
        tutors: tutors.data || [],
        bookings: bookings.data || [],
        flags: flags.data || [],
        messages: messages.data || [],
        applications: apps.data || [],
        subjects: subjects.data || [],
        payments: payments.data || [],
        auditLogs: logs.data || [],
        pendingTutors: tutors.data?.filter((t: any) => !t.is_approved) || [],
        totalRevenue: payments.data?.reduce((sum: number, p: any) => sum + (p.amount || 0), 0) || 0,
      });
    } catch (e) {
      console.error(e);
      toast.error("Failed to load dashboard data");
    }
    setLoading(false);
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const ActiveIcon = tabs.find((t) => t.id === activeTab)?.icon || LayoutDashboard;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? "w-64" : "w-16"} bg-white border-r border-gray-200 transition-all duration-200 flex flex-col flex-shrink-0`}>
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100">
          {sidebarOpen && <span className="font-bold text-gray-900">Admin Panel</span>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500">
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto py-2 px-2 space-y-0.5">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {sidebarOpen && <span className="truncate">{tab.label}</span>}
                {sidebarOpen && isActive && <ChevronRight className="h-4 w-4 ml-auto" />}
              </button>
            );
          })}
        </nav>
        <div className="p-3 border-t border-gray-100">
          <button onClick={async () => { await supabase.auth.signOut(); router.push("/login"); }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-600 hover:bg-red-50 transition-all"
          >
            <LogOut className="h-5 w-5" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <ActiveIcon className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 capitalize">{activeTab.replace("_", " ")}</h1>
                <p className="text-sm text-gray-500">Welcome back, {profile?.full_name || user?.email}</p>
              </div>
            </div>
            <button onClick={loadData} className="flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
              Refresh
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === "overview" && <OverviewSection data={data} />}
          {activeTab === "applications" && <ApplicationsSection data={data} onRefresh={loadData} />}
          {activeTab === "users" && <UsersSection />}
          {activeTab === "tutors" && <TutorsSection data={data} onRefresh={loadData} />}
          {activeTab === "bookings" && <BookingsSection data={data} />}
          {activeTab === "payments" && <PaymentsSection data={data} />}
          {activeTab === "subjects" && <SubjectsSection data={data} onRefresh={loadData} />}
          {activeTab === "messages" && <MessagesSection data={data} />}
          {activeTab === "settings" && <SettingsSection data={data} onRefresh={loadData} />}
          {activeTab === "audit" && <AuditSection data={data} />}
        </div>
      </main>
    </div>
  );
}

// ============= OVERVIEW =============
function OverviewSection({ data }: { data: any }) {
  const stats = [
    { label: "Total Students", value: data.totalStudents, icon: Users, color: "bg-blue-50 text-blue-600" },
    { label: "Total Tutors", value: data.totalTutors, icon: GraduationCap, color: "bg-green-50 text-green-600" },
    { label: "Total Bookings", value: data.totalBookings, icon: Calendar, color: "bg-purple-50 text-purple-600" },
    { label: "Revenue", value: `$${data.totalRevenue.toFixed(0)}`, icon: DollarSign, color: "bg-amber-50 text-amber-600" },
    { label: "Pending Tutors", value: data.pendingTutors.length, icon: UserCheck, color: "bg-orange-50 text-orange-600" },
    { label: "Messages", value: data.messages.length, icon: MessageSquare, color: "bg-rose-50 text-rose-600" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-shadow">
              <div className={`w-10 h-10 rounded-xl ${s.color} flex items-center justify-center mb-3`}>
                <Icon className="h-5 w-5" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-500 mt-1">{s.label}</p>
            </div>
          );
        })}
      </div>

      {data.pendingTutors.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            <div>
              <p className="font-semibold text-amber-800">{data.pendingTutors.length} Tutor{data.pendingTutors.length > 1 ? "s" : ""} Pending Approval</p>
              <p className="text-sm text-amber-600">Go to the Tutors tab to review and approve them.</p>
            </div>
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Recent Bookings</h3>
          <span className="text-xs text-gray-400">{data.bookings.length} total</span>
        </div>
        <div className="divide-y divide-gray-50 max-h-80 overflow-y-auto">
          {data.bookings.slice(0, 10).map((b: any) => (
            <div key={b.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
              <div>
                <p className="text-sm font-medium text-gray-900">{b.subject || "Class"}</p>
                <p className="text-xs text-gray-400">{b.scheduled_at ? new Date(b.scheduled_at).toLocaleDateString() : "TBD"}</p>
              </div>
              <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                b.status === "confirmed" ? "bg-green-100 text-green-700" :
                b.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                b.status === "completed" ? "bg-blue-100 text-blue-700" : "bg-red-100 text-red-700"
              }`}>{b.status}</span>
            </div>
          ))}
          {data.bookings.length === 0 && <p className="p-8 text-center text-gray-400 text-sm">No bookings yet</p>}
        </div>
      </div>
    </div>
  );
}

// ============= APPLICATIONS =============
function ApplicationsSection({ data, onRefresh }: { data: any; onRefresh: () => void }) {
  const [statusFilter, setStatusFilter] = useState("");
  const apps = statusFilter ? data.applications.filter((a: any) => a.status === statusFilter && a.status !== "draft") : data.applications.filter((a: any) => a.status !== "draft");

  const statusColors: Record<string, string> = {
    submitted: "bg-yellow-100 text-yellow-700", under_review: "bg-blue-100 text-blue-700",
    more_info_requested: "bg-orange-100 text-orange-700", interview_scheduled: "bg-purple-100 text-purple-700",
    approved: "bg-green-100 text-green-700", rejected: "bg-red-100 text-red-700",
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {["", "submitted", "under_review", "approved", "rejected"].map((s) => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              statusFilter === s ? "bg-blue-600 text-white" : "bg-white text-gray-600 border border-gray-200 hover:border-blue-300"
            }`}
          >{s ? s.replace(/_/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase()) : "All"}</button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {apps.length === 0 ? (
          <div className="p-12 text-center"><FileText className="h-10 w-10 text-gray-300 mx-auto mb-3" /><p className="text-gray-500 text-sm">No applications</p></div>
        ) : (
          <div className="divide-y divide-gray-50">
            {apps.map((app: any) => (
              <div key={app.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-blue-600">{(app.full_name || "?").charAt(0)}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{app.full_name || "Unknown"}</p>
                    <p className="text-xs text-gray-400">{app.email}</p>
                    <span className={`inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded-full ${statusColors[app.status] || "bg-gray-100"}`}>
                      {app.status?.replace(/_/g, " ")}
                    </span>
                  </div>
                </div>
                <div className="text-right text-xs text-gray-400 flex-shrink-0 ml-4">
                  <p>{app.submitted_at ? new Date(app.submitted_at).toLocaleDateString() : "-"}</p>
                  <button onClick={() => window.location.href = `/dashboard/admin/applications/${app.id}`}
                    className="mt-1 text-blue-600 hover:underline font-medium">Review</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ============= USERS =============
function UsersSection() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const supabase = (await import("@/lib/supabase/admin")).createAdminClient();
    const { data } = await supabase.from("users").select("*").order("created_at", { ascending: false });
    setUsers(data || []);
    setLoading(false);
  };

  const updateRole = async (userId: string, role: string, adminRole?: string) => {
    const supabase = (await import("@/lib/supabase/admin")).createAdminClient();
    await supabase.from("users").update({ role, admin_role: adminRole || null }).eq("id", userId);
    toast.success("User updated");
    fetchUsers();
  };

  const filtered = users.filter((u) => {
    if (roleFilter && u.role !== roleFilter) return false;
    if (search && !u.full_name?.toLowerCase().includes(search.toLowerCase()) && !u.email?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  if (loading) return <div className="text-center py-8 text-gray-400">Loading users...</div>;

  const roleColors: Record<string, string> = { student: "bg-blue-100 text-blue-700", parent: "bg-purple-100 text-purple-700", tutor: "bg-green-100 text-green-700", admin: "bg-red-100 text-red-700" };
  const adminRoleColors: Record<string, string> = { super_admin: "bg-red-100 text-red-700", reviewer: "bg-yellow-100 text-yellow-700", support: "bg-blue-100 text-blue-700", finance: "bg-green-100 text-green-700", content: "bg-purple-100 text-purple-700", ops: "bg-gray-100 text-gray-700" };

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search users..." className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 outline-none text-sm" />
        </div>
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm bg-white">
          <option value="">All Roles</option>
          <option value="student">Student</option>
          <option value="parent">Parent</option>
          <option value="tutor">Tutor</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Name</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Email</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Role</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Admin Role</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Joined</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((u: any) => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{u.full_name || "-"}</td>
                  <td className="px-4 py-3 text-gray-500">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${roleColors[u.role] || "bg-gray-100"}`}>{u.role}</span>
                  </td>
                  <td className="px-4 py-3">
                    {u.admin_role ? <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${adminRoleColors[u.admin_role] || "bg-gray-100"}`}>{u.admin_role}</span> : <span className="text-gray-300">-</span>}
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{new Date(u.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <select value={u.admin_role || ""} onChange={(e) => updateRole(u.id, u.role, e.target.value || undefined)}
                      className="px-2 py-1 rounded-lg border border-gray-200 text-xs bg-white">
                      <option value="">No admin role</option>
                      <option value="super_admin">Super Admin</option>
                      <option value="reviewer">Reviewer</option>
                      <option value="support">Support</option>
                      <option value="finance">Finance</option>
                      <option value="content">Content</option>
                      <option value="ops">Ops</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <p className="p-8 text-center text-gray-400 text-sm">No users found</p>}
      </div>
    </div>
  );
}

// ============= TUTORS =============
function TutorsSection({ data, onRefresh }: { data: any; onRefresh: () => void }) {
  const toggleApproval = async (tutorId: string, approved: boolean) => {
    const admin = (await import("@/lib/supabase/admin")).createAdminClient();
    await admin.from("tutors").update({ is_approved: approved }).eq("id", tutorId);
    toast.success(approved ? "Tutor approved" : "Tutor unapproved");
    onRefresh();
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr><th className="text-left px-4 py-3 font-medium text-gray-500">Name</th><th className="text-left px-4 py-3 font-medium text-gray-500">Subjects</th><th className="text-left px-4 py-3 font-medium text-gray-500">Rate</th><th className="text-left px-4 py-3 font-medium text-gray-500">Status</th><th className="text-left px-4 py-3 font-medium text-gray-500">Actions</th></tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {data.tutors.map((t: any) => (
              <tr key={t.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">{t.full_name || `Tutor ${t.id.slice(0, 6)}`}</td>
                <td className="px-4 py-3 text-gray-500">{t.bio?.slice(0, 50) || "-"}</td>
                <td className="px-4 py-3">${t.hourly_rate || 0}/hr</td>
                <td className="px-4 py-3">
                  <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${t.is_approved ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                    {t.is_approved ? "Approved" : "Pending"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button onClick={() => toggleApproval(t.id, !t.is_approved)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium ${t.is_approved ? "bg-red-50 text-red-600 hover:bg-red-100" : "bg-green-50 text-green-600 hover:bg-green-100"}`}>
                    {t.is_approved ? "Revoke" : "Approve"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {data.tutors.length === 0 && <p className="p-8 text-center text-gray-400">No tutors found</p>}
      </div>
    </div>
  );
}

// ============= BOOKINGS =============
function BookingsSection({ data }: { data: any }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b border-gray-100">
          <tr><th className="text-left px-4 py-3 font-medium text-gray-500">Subject</th><th className="text-left px-4 py-3 font-medium text-gray-500">Date</th><th className="text-left px-4 py-3 font-medium text-gray-500">Type</th><th className="text-left px-4 py-3 font-medium text-gray-500">Status</th><th className="text-left px-4 py-3 font-medium text-gray-500">Plan</th></tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {data.bookings.map((b: any) => (
            <tr key={b.id} className="hover:bg-gray-50">
              <td className="px-4 py-3 font-medium text-gray-900">{b.subject || "Class"}</td>
              <td className="px-4 py-3 text-gray-500 text-xs">{b.scheduled_at ? new Date(b.scheduled_at).toLocaleDateString() : "TBD"}</td>
              <td className="px-4 py-3"><span className={`px-2 py-1 text-xs font-medium rounded-full ${b.booking_type === "trial" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}>{b.booking_type}</span></td>
              <td className="px-4 py-3"><span className={`px-2 py-1 text-xs font-medium rounded-full ${b.status === "confirmed" ? "bg-green-100 text-green-700" : b.status === "pending" ? "bg-yellow-100 text-yellow-700" : b.status === "completed" ? "bg-blue-100 text-blue-700" : "bg-red-100 text-red-700"}`}>{b.status}</span></td>
              <td className="px-4 py-3 text-gray-500 text-xs">{b.plan || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {data.bookings.length === 0 && <p className="p-8 text-center text-gray-400">No bookings</p>}
    </div>
  );
}

// ============= PAYMENTS =============
function PaymentsSection({ data }: { data: any }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-xs text-gray-400">Total Revenue</p>
          <p className="text-2xl font-bold text-gray-900">${data.totalRevenue.toFixed(2)}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-xs text-gray-400">Transactions</p>
          <p className="text-2xl font-bold text-gray-900">{data.payments.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-xs text-gray-400">Avg Per Transaction</p>
          <p className="text-2xl font-bold text-gray-900">${data.payments.length > 0 ? (data.totalRevenue / data.payments.length).toFixed(2) : "0"}</p>
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr><th className="text-left px-4 py-3 font-medium text-gray-500">Amount</th><th className="text-left px-4 py-3 font-medium text-gray-500">Status</th><th className="text-left px-4 py-3 font-medium text-gray-500">Date</th><th className="text-left px-4 py-3 font-medium text-gray-500">Stripe ID</th></tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {data.payments.map((p: any) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">${p.amount?.toFixed(2) || "0.00"}</td>
                <td className="px-4 py-3"><span className={`px-2 py-1 text-xs font-medium rounded-full ${p.status === "paid" ? "bg-green-100 text-green-700" : p.status === "pending" ? "bg-yellow-100 text-yellow-700" : p.status === "refunded" ? "bg-purple-100 text-purple-700" : "bg-red-100 text-red-700"}`}>{p.status}</span></td>
                <td className="px-4 py-3 text-gray-400 text-xs">{new Date(p.created_at).toLocaleDateString()}</td>
                <td className="px-4 py-3 text-gray-400 text-xs">{p.stripe_payment_id?.slice(0, 16) || "-"}...</td>
              </tr>
            ))}
          </tbody>
        </table>
        {data.payments.length === 0 && <p className="p-8 text-center text-gray-400">No payments</p>}
      </div>
    </div>
  );
}

// ============= SUBJECTS =============
function SubjectsSection({ data, onRefresh }: { data: any; onRefresh: () => void }) {
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");

  const addSubject = async () => {
    if (!newName) return;
    const admin = (await import("@/lib/supabase/admin")).createAdminClient();
    const { error } = await admin.from("subjects").insert({ name: newName, description: newDesc || "" });
    if (error) { toast.error(error.message); return; }
    toast.success("Subject added");
    setNewName(""); setNewDesc("");
    onRefresh();
  };

  const deleteSubject = async (id: string) => {
    const admin = (await import("@/lib/supabase/admin")).createAdminClient();
    await admin.from("subjects").delete().eq("id", id);
    toast.success("Subject removed");
    onRefresh();
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <h3 className="font-semibold text-gray-900 mb-3">Add New Subject</h3>
        <div className="flex gap-2">
          <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Subject name" className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 outline-none text-sm" />
          <input value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="Description" className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 outline-none text-sm" />
          <button onClick={addSubject} className="flex items-center gap-1.5 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm hover:bg-blue-700"><Plus className="h-4 w-4" /> Add</button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {data.subjects.map((s: any) => (
          <div key={s.id} className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-gray-100 shadow-sm">
            <span className="text-sm font-medium text-gray-900">{s.name}</span>
            <button onClick={() => deleteSubject(s.id)} className="p-1 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500"><Trash2 className="h-3.5 w-3.5" /></button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============= MESSAGES =============
function MessagesSection({ data }: { data: any }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      {data.messages.length === 0 ? (
        <div className="p-12 text-center"><MessageSquare className="h-10 w-10 text-gray-300 mx-auto mb-3" /><p className="text-gray-500 text-sm">No messages</p></div>
      ) : (
        <div className="divide-y divide-gray-50">
          {data.messages.map((m: any) => (
            <div key={m.id} className="p-5 hover:bg-gray-50">
              <div className="flex items-start justify-between">
                <div><p className="font-semibold text-gray-900">{m.name}</p><p className="text-sm text-blue-600">{m.email}</p></div>
                <span className="text-xs text-gray-400">{new Date(m.created_at).toLocaleDateString()}</span>
              </div>
              <p className="mt-2 text-sm text-gray-600 bg-gray-50 rounded-xl p-3">{m.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============= SETTINGS =============
function SettingsSection({ data, onRefresh }: { data: any; onRefresh: () => void }) {
  const toggleFlag = async (key: string, current: string) => {
    const newVal = current === "enabled" ? "disabled" : "enabled";
    const supabase = (await import("@/lib/supabase/admin")).createAdminClient();
    await supabase.from("feature_flags").update({ value: newVal }).eq("key", key);
    toast.success(`${key} ${newVal}`);
    onRefresh();
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><Flag className="h-4 w-4 text-blue-600" /> Feature Flags</h3>
        <div className="space-y-3">
          {data.flags.map((f: any) => (
            <div key={f.key} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
              <div><p className="text-sm font-medium text-gray-900">{f.key.replace(/_/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase())}</p><p className="text-xs text-gray-400">{f.description}</p></div>
              <button onClick={() => toggleFlag(f.key, f.value)}
                className={`relative w-12 h-6 rounded-full transition-colors ${f.value === "enabled" ? "bg-green-500" : "bg-gray-300"}`}>
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${f.value === "enabled" ? "translate-x-6" : ""}`} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============= AUDIT =============
function AuditSection({ data }: { data: any }) {
  const [search, setSearch] = useState("");
  const filtered = data.auditLogs.filter((l: any) =>
    l.action?.toLowerCase().includes(search.toLowerCase()) ||
    l.entity_type?.toLowerCase().includes(search.toLowerCase()) ||
    l.users?.full_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search audit logs..." className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 outline-none text-sm" />
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="divide-y divide-gray-50 max-h-96 overflow-y-auto">
          {filtered.map((log: any) => (
            <div key={log.id} className="p-4 hover:bg-gray-50">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900">{log.users?.full_name || "System"}</span>
                  <span className="text-gray-300">/</span>
                  <span className="text-blue-600 font-medium">{log.action.replace(/_/g, " ")}</span>
                </div>
                <span className="text-xs text-gray-400">{new Date(log.created_at).toLocaleString()}</span>
              </div>
              {log.details && Object.keys(log.details).length > 0 && (
                <pre className="mt-1 text-xs text-gray-400 bg-gray-50 rounded-lg p-2 overflow-x-auto">{JSON.stringify(log.details, null, 2)}</pre>
              )}
            </div>
          ))}
          {filtered.length === 0 && <p className="p-8 text-center text-gray-400 text-sm">No audit logs</p>}
        </div>
      </div>
    </div>
  );
}
