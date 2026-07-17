"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { createAdminClient } from "@/lib/supabase/admin";
import toast from "react-hot-toast";
import {
  LayoutDashboard, Users, GraduationCap, Calendar, DollarSign, BookOpen,
  MessageSquare, Settings, Shield, LogOut, Search, ChevronRight, Menu, X,
  Plus, Trash2, AlertTriangle, FileText, Flag, Star
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
  const [tab, setTab] = useState("overview");
  const [sidebar, setSidebar] = useState(true);
  const [d, setD] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [ready, setReady] = useState(false);
  const router = useRouter();
  const supabase = createClient();
  const admin = createAdminClient();

  useEffect(() => {
    supabase.auth.getUser().then(async (result: any) => {
      const user = result.data?.user;
      if (!user) { router.push("/login"); return; }
      const meta = user.user_metadata as Record<string, string> | undefined;
      const { data: p } = await supabase.from("users").select("role").eq("id", user.id).maybeSingle();
      if ((p?.role || meta?.role) !== "admin") { router.push("/dashboard"); return; }
      try {
        const data: any = {};
        const [sRes] = await Promise.all([
          admin.from("users").select("*", { count: "exact", head: true }).eq("role", "student"),
        ]);
        data.totalStudents = sRes.count || 0;
        const [tRes] = await Promise.all([admin.from("tutors").select("*")]);
        data.tutors = tRes.data || [];
        data.pendingTutors = data.tutors.filter((t: any) => !t.is_approved);
        const [bRes] = await Promise.all([admin.from("bookings").select("*").order("created_at", { ascending: false }).limit(50)]);
        data.bookings = bRes.data || [];
        const [fRes] = await Promise.all([admin.from("feature_flags").select("*")]);
        data.flags = fRes.data || [];
        const [mRes] = await Promise.all([admin.from("contact_messages").select("*").order("created_at", { ascending: false }).limit(20)]);
        data.messages = mRes.data || [];
        const [aRes] = await Promise.all([admin.from("teacher_applications").select("*").order("created_at", { ascending: false }).limit(50)]);
        data.applications = aRes.data || [];
        const [subRes] = await Promise.all([admin.from("subjects").select("*").order("name")]);
        data.subjects = subRes.data || [];
        const [pRes] = await Promise.all([admin.from("payments").select("*").order("created_at", { ascending: false }).limit(50)]);
        data.payments = pRes.data || [];
        data.totalRevenue = data.payments.reduce((s: number, p: any) => s + (p.amount || 0), 0);
        const [lRes] = await Promise.all([admin.from("audit_logs").select("*, users(full_name, email)").order("created_at", { ascending: false }).limit(30)]);
        data.logs = lRes.data || [];
        const [uRes] = await Promise.all([admin.from("users").select("*").order("created_at", { ascending: false })]);
        data.users = uRes.data || [];
        setD(data);
      } catch (e: any) {
        toast.error("Failed to load data: " + (e.message || "Unknown error"));
      }
      setLoading(false);
      setReady(true);
    });
  }, []);

  const refresh = () => { setLoading(true); setReady(false); window.location.reload(); };

  if (!ready) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" /><p className="mt-3 text-gray-400 text-sm">{loading ? "Loading dashboard..." : "Redirecting..."}</p></div>
    </div>
  );

  const Icon = tabs.find((t) => t.id === tab)?.icon || LayoutDashboard;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className={`${sidebar ? "w-64" : "w-16"} bg-white border-r border-gray-200 transition-all duration-200 flex flex-col flex-shrink-0`}>
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100">
          {sidebar && <span className="font-bold text-gray-900">Admin Panel</span>}
          <button onClick={() => setSidebar(!sidebar)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500">{sidebar ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</button>
        </div>
        <nav className="flex-1 overflow-y-auto py-2 px-2 space-y-0.5">
          {tabs.map((t) => {
            const I = t.icon;
            return (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${tab === t.id ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50"}`}>
                <I className="h-5 w-5 flex-shrink-0" />{sidebar && <span className="truncate">{t.label}</span>}
                {sidebar && tab === t.id && <ChevronRight className="h-4 w-4 ml-auto" />}
              </button>
            );
          })}
        </nav>
        <div className="p-3 border-t border-gray-100">
          <button onClick={async () => { await supabase.auth.signOut(); router.push("/login"); }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-600 hover:bg-red-50">
            <LogOut className="h-5 w-5" />{sidebar && <span>Logout</span>}
          </button>
        </div>
      </aside>

      <main className="flex-1 min-w-0 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center"><Icon className="h-5 w-5 text-blue-600" /></div>
              <div><h1 className="text-xl font-bold text-gray-900 capitalize">{tab.replace("_", " ")}</h1><p className="text-sm text-gray-500">Admin Dashboard</p></div>
            </div>
            <button onClick={refresh} className="flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>Refresh
            </button>
          </div>

          {tab === "overview" && <Overview data={d} />}
          {tab === "applications" && <Applications data={d} />}
          {tab === "users" && <UsersTable data={d} admin={admin} refresh={refresh} />}
          {tab === "tutors" && <Tutors data={d} admin={admin} refresh={refresh} />}
          {tab === "bookings" && <Bookings data={d} />}
          {tab === "payments" && <Payments data={d} />}
          {tab === "subjects" && <Subjects data={d} admin={admin} refresh={refresh} />}
          {tab === "messages" && <Messages data={d} />}
          {tab === "settings" && <SettingsPanel data={d} admin={admin} refresh={refresh} />}
          {tab === "audit" && <Audit data={d} />}
        </div>
      </main>
    </div>
  );
}

function Overview({ data }: { data: any }) {
  const stats = [
    { label: "Students", value: data.totalStudents, icon: Users, color: "bg-blue-50 text-blue-600" },
    { label: "Tutors", value: data.tutors?.length || 0, icon: GraduationCap, color: "bg-green-50 text-green-600" },
    { label: "Bookings", value: data.bookings?.length || 0, icon: Calendar, color: "bg-purple-50 text-purple-600" },
    { label: "Revenue", value: `$${(data.totalRevenue || 0).toFixed(0)}`, icon: DollarSign, color: "bg-amber-50 text-amber-600" },
    { label: "Pending", value: data.pendingTutors?.length || 0, icon: AlertTriangle, color: "bg-orange-50 text-orange-600" },
    { label: "Messages", value: data.messages?.length || 0, icon: MessageSquare, color: "bg-rose-50 text-rose-600" },
  ];
  return (<div className="space-y-6">
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {stats.map((s) => { const I = s.icon; return (<div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md"><div className={`w-10 h-10 rounded-xl ${s.color} flex items-center justify-center mb-3`}><I className="h-5 w-5" /></div><p className="text-2xl font-bold text-gray-900">{s.value}</p><p className="text-xs text-gray-500 mt-1">{s.label}</p></div>); })}
    </div>
    {data.pendingTutors?.length > 0 && (<div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-center gap-3"><AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0" /><div><p className="font-semibold text-amber-800">{data.pendingTutors.length} Tutor(s) Pending Approval</p><p className="text-sm text-amber-600">Go to the Tutors tab to review.</p></div></div>)}
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <div className="p-5 border-b border-gray-100 flex items-center justify-between"><h3 className="font-semibold text-gray-900">Recent Bookings</h3></div>
      <div className="divide-y divide-gray-50 max-h-80 overflow-y-auto">
        {data.bookings?.slice(0, 10).map((b: any) => (
          <div key={b.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
            <div><p className="text-sm font-medium text-gray-900">{b.subject || "Class"}</p><p className="text-xs text-gray-400">{b.scheduled_at ? new Date(b.scheduled_at).toLocaleDateString() : "TBD"}</p></div>
            <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${b.status === "confirmed" ? "bg-green-100 text-green-700" : b.status === "pending" ? "bg-yellow-100 text-yellow-700" : b.status === "completed" ? "bg-blue-100 text-blue-700" : "bg-red-100 text-red-700"}`}>{b.status}</span>
          </div>
        ))}
        {data.bookings?.length === 0 && <p className="p-8 text-center text-gray-400 text-sm">No bookings</p>}
      </div>
    </div>
  </div>);
}

function Applications({ data }: { data: any }) {
  const [filter, setFilter] = useState("");
  const apps = data.applications?.filter((a: any) => a.status !== "draft" && (!filter || a.status === filter)) || [];
  const colors: Record<string, string> = { submitted: "bg-yellow-100 text-yellow-700", under_review: "bg-blue-100 text-blue-700", approved: "bg-green-100 text-green-700", rejected: "bg-red-100 text-red-700", more_info_requested: "bg-orange-100 text-orange-700", interview_scheduled: "bg-purple-100 text-purple-700" };
  return (<div className="space-y-4">
    <div className="flex flex-wrap gap-2">{["", "submitted", "under_review", "approved", "rejected"].map((s) => (<button key={s} onClick={() => setFilter(s)} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${filter === s ? "bg-blue-600 text-white" : "bg-white text-gray-600 border border-gray-200"}`}>{s ? s.replace(/_/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase()) : "All"}</button>))}</div>
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      {apps.length === 0 ? <div className="p-12 text-center"><FileText className="h-10 w-10 text-gray-300 mx-auto mb-3" /><p className="text-gray-500 text-sm">No applications</p></div> :
        <div className="divide-y divide-gray-50">{apps.map((app: any) => (<div key={app.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center"><span className="text-xs font-bold text-blue-600">{(app.full_name || "?").charAt(0)}</span></div>
            <div><p className="text-sm font-medium text-gray-900 truncate">{app.full_name || "Unknown"}</p><p className="text-xs text-gray-400">{app.email}</p><span className={`inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded-full ${colors[app.status] || "bg-gray-100"}`}>{app.status?.replace(/_/g, " ")}</span></div>
          </div>
          <a href={`/dashboard/admin/applications/${app.id}`} className="text-xs text-blue-600 hover:underline font-medium flex-shrink-0">Review →</a>
        </div>))}</div>}
    </div>
  </div>);
}

function UsersTable({ data, admin, refresh }: { data: any; admin: any; refresh: () => void }) {
  const [search, setSearch] = useState("");
  const users = data.users?.filter((u: any) => !search || u.full_name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase())) || [];
  const roleColors: Record<string, string> = { student: "bg-blue-100 text-blue-700", parent: "bg-purple-100 text-purple-700", tutor: "bg-green-100 text-green-700", admin: "bg-red-100 text-red-700" };
  const adminColors: Record<string, string> = { super_admin: "bg-red-100 text-red-700", reviewer: "bg-yellow-100 text-yellow-700", support: "bg-blue-100 text-blue-700", finance: "bg-green-100 text-green-700", content: "bg-purple-100 text-purple-700", ops: "bg-gray-100 text-gray-700" };
  const updateRole = async (id: string, r: string, ar?: string) => { await admin.from("users").update({ role: r, admin_role: ar || null }).eq("id", id); toast.success("Updated"); refresh(); };
  return (<div className="space-y-4">
    <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" /><input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search users..." className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 outline-none text-sm" /></div>
    <div className="bg-white rounded-2xl border border-gray-100 overflow-x-auto">
      <table className="w-full text-sm"><thead className="bg-gray-50"><tr><th className="text-left px-4 py-3 font-medium text-gray-500">Name</th><th className="text-left px-4 py-3 font-medium text-gray-500">Email</th><th className="text-left px-4 py-3 font-medium text-gray-500">Role</th><th className="text-left px-4 py-3 font-medium text-gray-500">Admin Role</th><th className="text-left px-4 py-3 font-medium text-gray-500">Actions</th></tr></thead>
        <tbody className="divide-y divide-gray-50">{users.map((u: any) => (<tr key={u.id} className="hover:bg-gray-50"><td className="px-4 py-3 font-medium text-gray-900">{u.full_name || "-"}</td><td className="px-4 py-3 text-gray-500">{u.email}</td><td className="px-4 py-3"><span className={`px-2.5 py-1 text-xs font-medium rounded-full ${roleColors[u.role] || "bg-gray-100"}`}>{u.role}</span></td><td className="px-4 py-3">{u.admin_role ? <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${adminColors[u.admin_role] || "bg-gray-100"}`}>{u.admin_role}</span> : <span className="text-gray-300">-</span>}</td>
          <td className="px-4 py-3"><select value={u.admin_role || ""} onChange={(e) => updateRole(u.id, u.role, e.target.value || undefined)} className="px-2 py-1 rounded-lg border border-gray-200 text-xs bg-white"><option value="">No role</option><option value="super_admin">Super Admin</option><option value="reviewer">Reviewer</option><option value="support">Support</option><option value="finance">Finance</option><option value="content">Content</option><option value="ops">Ops</option></select></td></tr>))}</tbody></table>
      {users.length === 0 && <p className="p-8 text-center text-gray-400 text-sm">No users found</p>}
    </div>
  </div>);
}

function Tutors({ data, admin, refresh }: { data: any; admin: any; refresh: () => void }) {
  const toggle = async (id: string, approved: boolean) => { await admin.from("tutors").update({ is_approved: approved }).eq("id", id); toast.success(approved ? "Approved" : "Revoked"); refresh(); };
  return (<div className="bg-white rounded-2xl border border-gray-100 overflow-x-auto">
    <table className="w-full text-sm"><thead className="bg-gray-50"><tr><th className="text-left px-4 py-3 font-medium text-gray-500">Tutor</th><th className="text-left px-4 py-3 font-medium text-gray-500">Rate</th><th className="text-left px-4 py-3 font-medium text-gray-500">Status</th><th className="text-left px-4 py-3 font-medium text-gray-500">Action</th></tr></thead>
      <tbody className="divide-y divide-gray-50">{(data.tutors || []).map((t: any) => (<tr key={t.id} className="hover:bg-gray-50"><td className="px-4 py-3 font-medium text-gray-900">Tutor {t.id.slice(0, 6)}</td><td className="px-4 py-3">${t.hourly_rate || 0}/hr</td><td className="px-4 py-3"><span className={`px-2.5 py-1 text-xs font-medium rounded-full ${t.is_approved ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>{t.is_approved ? "Approved" : "Pending"}</span></td>
        <td className="px-4 py-3"><button onClick={() => toggle(t.id, !t.is_approved)} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${t.is_approved ? "bg-red-50 text-red-600 hover:bg-red-100" : "bg-green-50 text-green-600 hover:bg-green-100"}`}>{t.is_approved ? "Revoke" : "Approve"}</button></td></tr>))}</tbody></table>
    {data.tutors?.length === 0 && <p className="p-8 text-center text-gray-400">No tutors</p>}
  </div>);
}

function Bookings({ data }: { data: any }) {
  return (<div className="bg-white rounded-2xl border border-gray-100 overflow-x-auto">
    <table className="w-full text-sm"><thead className="bg-gray-50"><tr><th className="text-left px-4 py-3 font-medium text-gray-500">Subject</th><th className="text-left px-4 py-3 font-medium text-gray-500">Date</th><th className="text-left px-4 py-3 font-medium text-gray-500">Status</th><th className="text-left px-4 py-3 font-medium text-gray-500">Type</th></tr></thead>
      <tbody className="divide-y divide-gray-50">{(data.bookings || []).map((b: any) => (<tr key={b.id} className="hover:bg-gray-50"><td className="px-4 py-3 font-medium text-gray-900">{b.subject || "Class"}</td><td className="px-4 py-3 text-gray-500 text-xs">{b.scheduled_at ? new Date(b.scheduled_at).toLocaleDateString() : "TBD"}</td><td className="px-4 py-3"><span className={`px-2 py-1 text-xs font-medium rounded-full ${b.status === "confirmed" ? "bg-green-100 text-green-700" : b.status === "pending" ? "bg-yellow-100 text-yellow-700" : b.status === "completed" ? "bg-blue-100 text-blue-700" : "bg-red-100 text-red-700"}`}>{b.status}</span></td><td className="px-4 py-3"><span className={`px-2 py-1 text-xs font-medium rounded-full ${b.booking_type === "trial" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}>{b.booking_type}</span></td></tr>))}</tbody></table>
    {data.bookings?.length === 0 && <p className="p-8 text-center text-gray-400">No bookings</p>}
  </div>);
}

function Payments({ data }: { data: any }) {
  return (<div className="space-y-4">
    <div className="grid grid-cols-3 gap-4">
      <div className="bg-white rounded-xl border border-gray-100 p-4"><p className="text-xs text-gray-400">Revenue</p><p className="text-2xl font-bold text-gray-900">${(data.totalRevenue || 0).toFixed(2)}</p></div>
      <div className="bg-white rounded-xl border border-gray-100 p-4"><p className="text-xs text-gray-400">Transactions</p><p className="text-2xl font-bold text-gray-900">{data.payments?.length || 0}</p></div>
      <div className="bg-white rounded-xl border border-gray-100 p-4"><p className="text-xs text-gray-400">Avg</p><p className="text-2xl font-bold text-gray-900">${data.payments?.length > 0 ? (data.totalRevenue / data.payments.length).toFixed(2) : "0"}</p></div>
    </div>
    <div className="bg-white rounded-2xl border border-gray-100 overflow-x-auto">
      <table className="w-full text-sm"><thead className="bg-gray-50"><tr><th className="text-left px-4 py-3 font-medium text-gray-500">Amount</th><th className="text-left px-4 py-3 font-medium text-gray-500">Status</th><th className="text-left px-4 py-3 font-medium text-gray-500">Date</th></tr></thead>
        <tbody className="divide-y divide-gray-50">{(data.payments || []).map((p: any) => (<tr key={p.id} className="hover:bg-gray-50"><td className="px-4 py-3 font-medium text-gray-900">${(p.amount || 0).toFixed(2)}</td><td className="px-4 py-3"><span className={`px-2 py-1 text-xs font-medium rounded-full ${p.status === "paid" ? "bg-green-100 text-green-700" : p.status === "pending" ? "bg-yellow-100 text-yellow-700" : p.status === "refunded" ? "bg-purple-100 text-purple-700" : "bg-red-100 text-red-700"}`}>{p.status}</span></td><td className="px-4 py-3 text-gray-400 text-xs">{new Date(p.created_at).toLocaleDateString()}</td></tr>))}</tbody></table>
      {data.payments?.length === 0 && <p className="p-8 text-center text-gray-400">No payments</p>}
    </div>
  </div>);
}

function Subjects({ data, admin, refresh }: { data: any; admin: any; refresh: () => void }) {
  const [name, setName] = useState("");
  const add = async () => { if (!name) return; const { error } = await admin.from("subjects").insert({ name, description: "" }); if (error) { toast.error(error.message); return; } toast.success("Added"); setName(""); refresh(); };
  const del = async (id: string) => { await admin.from("subjects").delete().eq("id", id); toast.success("Removed"); refresh(); };
  return (<div className="space-y-4">
    <div className="bg-white rounded-2xl border border-gray-100 p-5"><h3 className="font-semibold text-gray-900 mb-3">Add Subject</h3><div className="flex gap-2"><input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 outline-none text-sm" /><button onClick={add} className="flex items-center gap-1.5 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm hover:bg-blue-700"><Plus className="h-4 w-4" /> Add</button></div></div>
    <div className="flex flex-wrap gap-2">{(data.subjects || []).map((s: any) => (<div key={s.id} className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-gray-100 shadow-sm"><span className="text-sm font-medium text-gray-900">{s.name}</span><button onClick={() => del(s.id)} className="p-1 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500"><Trash2 className="h-3.5 w-3.5" /></button></div>))}</div>
  </div>);
}

function Messages({ data }: { data: any }) {
  return (<div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
    {(data.messages || []).length === 0 ? <div className="p-12 text-center"><MessageSquare className="h-10 w-10 text-gray-300 mx-auto mb-3" /><p className="text-gray-500 text-sm">No messages</p></div> :
      <div className="divide-y divide-gray-50">{(data.messages || []).map((m: any) => (<div key={m.id} className="p-5 hover:bg-gray-50"><div className="flex items-start justify-between"><div><p className="font-semibold text-gray-900">{m.name}</p><p className="text-sm text-blue-600">{m.email}</p></div><span className="text-xs text-gray-400">{new Date(m.created_at).toLocaleDateString()}</span></div><p className="mt-2 text-sm text-gray-600 bg-gray-50 rounded-xl p-3">{m.message}</p></div>))}</div>}
  </div>);
}

function SettingsPanel({ data, admin, refresh }: { data: any; admin: any; refresh: () => void }) {
  const toggle = async (key: string, val: string) => { await admin.from("feature_flags").update({ value: val === "enabled" ? "disabled" : "enabled" }).eq("key", key); toast.success("Toggled"); refresh(); };
  return (<div className="bg-white rounded-2xl border border-gray-100 p-5"><h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><Flag className="h-4 w-4 text-blue-600" /> Feature Flags</h3>
    <div className="space-y-3">{(data.flags || []).map((f: any) => (<div key={f.key} className="flex items-center justify-between py-2 border-b border-gray-50"><div><p className="text-sm font-medium text-gray-900">{f.key.replace(/_/g, " ")}</p><p className="text-xs text-gray-400">{f.description}</p></div>
      <button onClick={() => toggle(f.key, f.value)} className={`relative w-12 h-6 rounded-full transition-colors ${f.value === "enabled" ? "bg-green-500" : "bg-gray-300"}`}><span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${f.value === "enabled" ? "translate-x-6" : ""}`} /></button>
    </div>))}</div>
  </div>);
}

function Audit({ data }: { data: any }) {
  const [q, setQ] = useState("");
  const logs = (data.logs || []).filter((l: any) => !q || l.action?.toLowerCase().includes(q.toLowerCase()) || l.users?.full_name?.toLowerCase().includes(q.toLowerCase()));
  return (<div className="space-y-4">
    <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" /><input type="text" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search..." className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 outline-none text-sm" /></div>
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden max-h-96 overflow-y-auto">
      {logs.length === 0 ? <p className="p-8 text-center text-gray-400 text-sm">No logs</p> :
        <div className="divide-y divide-gray-50">{logs.map((l: any) => (<div key={l.id} className="p-4 hover:bg-gray-50"><div className="flex items-center justify-between text-sm"><span className="font-medium text-gray-900">{l.users?.full_name || "System"} <span className="text-blue-600">/ {l.action.replace(/_/g, " ")}</span></span><span className="text-xs text-gray-400">{new Date(l.created_at).toLocaleString()}</span></div></div>))}</div>}
    </div>
  </div>);
}
