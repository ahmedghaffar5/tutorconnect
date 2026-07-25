"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";
import { Users, GraduationCap, Calendar, DollarSign, FileText, Search, Plus, Trash2, AlertTriangle, Flag, Settings, ChevronRight, Menu, X, MessageSquare, Shield, LayoutDashboard, BookOpen } from "lucide-react";

const tabs = [
  { id: "overview", label: "Dashboard", icon: LayoutDashboard },
  { id: "applications", label: "Applications", icon: FileText },
  { id: "users", label: "Users", icon: Users },
  { id: "tutors", label: "Tutors", icon: GraduationCap },
  { id: "bookings", label: "Bookings", icon: Calendar },
  { id: "payments", label: "Payments", icon: DollarSign },
  { id: "messages", label: "Messages", icon: MessageSquare },
  { id: "settings", label: "Settings", icon: Settings },
  { id: "audit", label: "Audit Log", icon: Shield },
];

const adminImages = [
  "/images/stitch/admin_management-0.jpg",
  "/images/stitch/admin_management-1.jpg",
  "/images/stitch/admin_management-2.jpg",
];

export default function AdminDashboard() {
  const [tab, setTab] = useState("overview");
  const [sidebar, setSidebar] = useState(true);
  const [d, setD] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  const loadData = async () => {
    const { data: { user: u } } = await supabase.auth.getUser();
    if (!u) { router.push("/login"); return; }
    const meta = u.user_metadata as Record<string, string> | undefined;
    const { data: p } = await supabase.from("users").select("role").eq("id", u.id).maybeSingle();
    if ((p?.role || meta?.role) !== "admin") { router.push("/dashboard"); return; }
    try { const res = await fetch("/api/admin/dashboard"); if (!res.ok) return; setD(await res.json()); } catch {}
    setLoading(false);
  };
  useEffect(() => { loadData(); }, []);

  if (!d) return <div className="min-h-screen bg-[#f8f9ff] flex items-center justify-center"><div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" /></div>;

  const pendingTutors = d.pendingTutors || [];
  const auditLogs = d.logs || [];

  return (
    <div className="bg-[#f8f9ff] min-h-screen flex">
      <aside className={`${sidebar ? "w-64" : "w-16"} bg-white border-r border-gray-200 transition-all duration-200 flex flex-col flex-shrink-0 shadow-sm`}>
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100">
          {sidebar && <span className="font-bold text-indigo-600 text-lg">Tutor Workspace</span>}
          <button onClick={() => setSidebar(!sidebar)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400">{sidebar ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</button>
        </div>
        <div className="px-4 py-4"><div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"><div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-sm font-bold text-indigo-600">AD</div><div><p className="text-sm font-bold text-gray-900">Admin User</p><p className="text-xs text-gray-400">Super Admin</p></div></div></div>
        <nav className="flex-1 px-2 space-y-0.5">
          {tabs.map((t) => {
            const I = t.icon;
            return (<button key={t.id} onClick={() => setTab(t.id)} className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all ${tab === t.id ? "bg-indigo-50 text-indigo-600 font-bold" : "text-gray-500 hover:bg-gray-50"}`}>
              <I className="h-5 w-5 flex-shrink-0" />{sidebar && <span className="truncate">{t.label}</span>}{sidebar && tab === t.id && <ChevronRight className="h-4 w-4 ml-auto" />}
            </button>);
          })}
        </nav>
        <div className="mt-auto px-4 py-4 border-t border-gray-100 space-y-1">
          <button className="w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold shadow-md hover:bg-indigo-700 transition-all text-sm flex items-center justify-center gap-2">Go Online</button>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 text-gray-500 hover:bg-gray-50 rounded-xl text-sm"><span>❓</span> Help Center</button>
          <button onClick={async () => { await supabase.auth.signOut(); router.push("/login"); }} className="w-full flex items-center gap-3 px-3 py-2.5 text-red-500 hover:bg-red-50 rounded-xl text-sm"><span>🚪</span> Logout</button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-[1280px] mx-auto px-6 py-8 space-y-8">
          <section>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Platform Audit & Controls</h2>
            <p className="text-lg text-gray-500 max-w-3xl">Enterprise management suite for overseeing global tutor activities, application workflows, and real-time revenue performance.</p>
          </section>

          {tab === "overview" && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { label: "Total Active Tutors", value: d.tutors?.length || 0, icon: Users, color: "bg-indigo-50 text-indigo-600", trend: "+12%", trendColor: "text-emerald-600" },
                  { label: "Pending Applications", value: pendingTutors.length || 0, icon: FileText, color: "bg-amber-50 text-amber-600", badge: "Priority" },
                  { label: "Platform Revenue", value: `$${(d.totalRevenue || 0).toFixed(2)}`, icon: DollarSign, color: "bg-emerald-50 text-emerald-600", sub: "Last 30 Days" },
                ].map((s) => {
                  const I = s.icon;
                  return (<div key={s.label} className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-sm border border-gray-100 hover:border-indigo-200 transition-all">
                    <div className="flex justify-between items-start mb-4"><div className={`p-3 ${s.color} rounded-lg`}><I className="h-6 w-6" /></div>
                      {s.trend && <span className={`${s.trendColor} font-bold flex items-center text-sm`}>{s.trend} ↑</span>}
                      {s.badge && <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded-full text-xs font-bold">{s.badge}</span>}
                      {s.sub && <span className="text-gray-400 text-xs">{s.sub}</span>}
                    </div>
                    <p className="text-sm text-gray-400 mb-1">{s.label}</p>
                    <h3 className="text-3xl font-bold text-gray-900">{typeof s.value === 'number' ? s.value.toLocaleString() : s.value}</h3>
                  </div>);
                })}
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <section className="lg:col-span-8 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50"><h4 className="text-xl font-bold text-gray-900">Pending Tutor Verification</h4><button className="text-indigo-600 font-semibold text-sm hover:underline">View All</button></div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-gray-50"><tr>{["Tutor Name", "Subject", "Date Applied", "Actions"].map((h) => (<th key={h} className="px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">{h}</th>))}</tr></thead>
                      <tbody className="divide-y divide-gray-50">
                        {pendingTutors.length > 0 ? pendingTutors.slice(0, 5).map((t: any, i: number) => (
                          <tr key={t.id || i} className="hover:bg-gray-50 transition-colors">
                            <td className="px-5 py-4"><div className="flex items-center gap-3">
                              <img src={adminImages[i % 3]} alt="" className="w-10 h-10 rounded-full object-cover border-2 border-white" />
                              <div><p className="font-semibold text-gray-900 text-sm">{t.full_name || "Unknown"}</p><p className="text-xs text-gray-400">{t.email}</p></div>
                            </div></td>
                            <td className="px-5 py-4"><span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-md text-xs font-medium">{t.subjects_taught?.[0] || "Pending"}</span></td>
                            <td className="px-5 py-4 text-sm text-gray-400">{t.created_at ? new Date(t.created_at).toLocaleDateString() : "-"}</td>
                            <td className="px-5 py-4"><div className="flex gap-2"><button className="p-1 text-emerald-500 hover:bg-emerald-50 rounded-md"><span className="text-lg">✓</span></button><button className="p-1 text-red-500 hover:bg-red-50 rounded-md"><span className="text-lg">✕</span></button></div></td>
                          </tr>
                        )) : <tr><td colSpan={4} className="p-8 text-center text-gray-400 text-sm">No pending applications</td></tr>}
                      </tbody>
                    </table>
                  </div>
                </section>
                <section className="lg:col-span-4 bg-gray-50 rounded-xl shadow-sm flex flex-col h-[500px] border border-gray-100">
                  <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-white rounded-t-xl"><h4 className="text-xl font-bold text-gray-900">Audit Log</h4><Shield className="h-5 w-5 text-gray-400" /></div>
                  <div className="p-5 space-y-4 overflow-y-auto flex-1">
                    {auditLogs.slice(0, 6).map((l: any, i: number) => (
                      <div key={l.id || i} className="flex gap-3 border-l-2 border-indigo-600 pl-4 py-1">
                        <div><p className="text-sm font-bold text-gray-900">{l.action?.replace(/_/g, " ") || "Event"}</p><p className="text-xs text-gray-400">{l.details ? JSON.stringify(l.details).slice(0, 50) : ""}</p><span className="text-[10px] text-gray-400 uppercase tracking-wider">{l.created_at ? new Date(l.created_at).toLocaleString() : ""}</span></div>
                      </div>
                    ))}
                    {auditLogs.length === 0 && <p className="text-center text-gray-400 py-8 text-sm">No audit logs</p>}
                  </div>
                </section>
              </div>
              <section className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl relative overflow-hidden h-64 flex items-center justify-center border border-gray-100">
                <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(#4f46e5 1px, transparent 1px)", backgroundSize: "20px 20px" }}></div>
                <div className="relative z-10 text-center"><h5 className="text-2xl font-bold text-gray-900 mb-2">Revenue Insights Engine</h5><p className="text-gray-500 mb-6">Machine learning analysis of platform growth and seasonal trends.</p><button className="bg-indigo-600 text-white px-8 py-3 rounded-full font-bold flex items-center gap-3 mx-auto hover:scale-105 transition-transform">Generate Detailed Forecast</button></div>
              </section>
            </>
          )}
          {tab === "applications" && <Applications d={d} />}
          {tab === "users" && <UsersTable d={d} />}
          {tab === "tutors" && <TutorsList d={d} onUpdate={loadData} />}
          {tab === "bookings" && <BookingsList d={d} />}
          {tab === "payments" && <PaymentsList d={d} />}
          {tab === "messages" && <MessagesList d={d} />}
          {tab === "settings" && <SettingsList d={d} onUpdate={loadData} />}
          {tab === "audit" && <AuditList d={d} />}
        </div>
      </main>
    </div>
  );
}

const api = { patch: async (url: string, body: any) => { const r = await fetch(url, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }); return r.json(); } };

function Applications({ d }: { d: any }) {
  const colors: Record<string, string> = { submitted: "bg-yellow-100 text-yellow-700", under_review: "bg-blue-100 text-blue-700", approved: "bg-green-100 text-green-700", rejected: "bg-red-100 text-red-700" };
  const apps = (d.applications || []).filter((a: any) => a.status !== "draft");
  return (<div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">{apps.length === 0 ? <div className="p-12 text-center"><FileText className="h-10 w-10 text-gray-300 mx-auto mb-3" /><p className="text-gray-400 text-sm">No applications</p></div> :
    <div className="divide-y divide-gray-50">{apps.map((app: any) => (<div key={app.id} className="p-5 flex items-center justify-between hover:bg-gray-50"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-sm font-bold text-indigo-600">{(app.full_name || "?").charAt(0)}</div><div><p className="font-semibold text-gray-900 text-sm">{app.full_name || "Unknown"}</p><p className="text-xs text-gray-400">{app.email}</p><span className={`inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded-full ${colors[app.status] || "bg-gray-100 text-gray-600"}`}>{app.status?.replace(/_/g, " ")}</span></div></div><a href={`/dashboard/admin/applications/${app.id}`} className="text-xs text-indigo-600 hover:underline font-semibold">Review →</a></div>))}</div>}</div>);
}
function UsersTable({ d }: { d: any }) { const [s, setS] = useState(""); const users = (d.users || []).filter((u: any) => !s || u.full_name?.toLowerCase().includes(s.toLowerCase()) || u.email?.toLowerCase().includes(s.toLowerCase())); return (<div className="space-y-4"><div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" /><input value={s} onChange={(e) => setS(e.target.value)} placeholder="Search users..." className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-500 outline-none text-sm bg-white" /></div><div className="bg-white rounded-2xl border border-gray-100 overflow-hidden"><table className="w-full text-sm"><thead className="bg-gray-50"><tr><th className="px-5 py-3 text-left font-semibold text-gray-400 text-xs uppercase">Name</th><th className="px-5 py-3 text-left font-semibold text-gray-400 text-xs uppercase">Email</th><th className="px-5 py-3 text-left font-semibold text-gray-400 text-xs uppercase">Role</th></tr></thead><tbody className="divide-y divide-gray-50">{users.map((u: any) => (<tr key={u.id} className="hover:bg-gray-50"><td className="px-5 py-3 font-medium text-gray-900">{u.full_name || "-"}</td><td className="px-5 py-3 text-gray-500 text-sm">{u.email}</td><td className="px-5 py-3"><span className={`px-2.5 py-1 text-xs font-medium rounded-full ${u.role === "admin" ? "bg-red-100 text-red-700" : u.role === "tutor" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}>{u.role}</span></td></tr>))}</tbody></table></div></div>); }
function TutorsList({ d, onUpdate }: { d: any; onUpdate: () => void }) {
  const toggle = async (tutorId: string, approved: boolean) => { const res = await api.patch("/api/tutors", { tutorId, isApproved: !approved }); if (res.error) { toast.error(res.error); return; } toast.success(!approved ? "Approved" : "Revoked"); onUpdate(); };
  return (<div className="bg-white rounded-2xl border border-gray-100 overflow-hidden"><table className="w-full text-sm"><thead className="bg-gray-50"><tr><th className="px-5 py-3 text-left font-semibold text-gray-400 text-xs uppercase">Tutor</th><th className="px-5 py-3 text-left font-semibold text-gray-400 text-xs uppercase">Rate</th><th className="px-5 py-3 text-left font-semibold text-gray-400 text-xs uppercase">Status</th><th className="px-5 py-3 text-left font-semibold text-gray-400 text-xs uppercase">Action</th></tr></thead><tbody className="divide-y divide-gray-50">{(d.tutors || []).map((t: any) => (<tr key={t.id} className="hover:bg-gray-50"><td className="px-5 py-3 font-medium text-gray-900">Tutor {t.id.slice(0, 6)}</td><td className="px-5 py-3 text-sm">${t.hourly_rate || 0}/hr</td><td className="px-5 py-3"><span className={`px-2.5 py-1 text-xs font-medium rounded-full ${t.is_approved ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>{t.is_approved ? "Approved" : "Pending"}</span></td><td className="px-5 py-3"><button onClick={() => toggle(t.id, t.is_approved)} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${t.is_approved ? "bg-red-50 text-red-600 hover:bg-red-100" : "bg-green-50 text-green-600 hover:bg-green-100"}`}>{t.is_approved ? "Revoke" : "Approve"}</button></td></tr>))}</tbody></table></div>); }
function BookingsList({ d }: { d: any }) { return (<div className="bg-white rounded-2xl border border-gray-100 overflow-hidden"><table className="w-full text-sm"><thead className="bg-gray-50"><tr><th className="px-5 py-3 text-left font-semibold text-gray-400 text-xs uppercase">Subject</th><th className="px-5 py-3 text-left font-semibold text-gray-400 text-xs uppercase">Status</th><th className="px-5 py-3 text-left font-semibold text-gray-400 text-xs uppercase">Type</th></tr></thead><tbody className="divide-y divide-gray-50">{(d.bookings || []).map((b: any) => (<tr key={b.id} className="hover:bg-gray-50"><td className="px-5 py-3 font-medium text-gray-900">{b.subjects?.name || "Class"}</td><td className="px-5 py-3"><span className={`px-2 py-1 text-xs font-medium rounded-full ${b.status === "confirmed" ? "bg-green-100 text-green-700" : b.status === "pending" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>{b.status}</span></td><td className="px-5 py-3"><span className={`px-2 py-1 text-xs font-medium rounded-full ${b.booking_type === "trial" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}>{b.booking_type}</span></td></tr>))}</tbody></table></div>); }
function PaymentsList({ d }: { d: any }) { return (<div className="space-y-4"><div className="grid grid-cols-3 gap-4"><div className="bg-white rounded-xl border border-gray-100 p-5"><p className="text-xs text-gray-400">Revenue</p><p className="text-2xl font-bold text-gray-900">${(d.totalRevenue || 0).toFixed(2)}</p></div><div className="bg-white rounded-xl border border-gray-100 p-5"><p className="text-xs text-gray-400">Transactions</p><p className="text-2xl font-bold text-gray-900">{d.payments?.length || 0}</p></div></div><div className="bg-white rounded-2xl border border-gray-100 overflow-hidden"><table className="w-full text-sm"><thead className="bg-gray-50"><tr><th className="px-5 py-3 text-left font-semibold text-gray-400 text-xs uppercase">Amount</th><th className="px-5 py-3 text-left font-semibold text-gray-400 text-xs uppercase">Status</th><th className="px-5 py-3 text-left font-semibold text-gray-400 text-xs uppercase">Date</th></tr></thead><tbody className="divide-y divide-gray-50">{(d.payments || []).map((p: any) => (<tr key={p.id} className="hover:bg-gray-50"><td className="px-5 py-3 font-medium text-gray-900">${(p.amount || 0).toFixed(2)}</td><td className="px-5 py-3"><span className={`px-2 py-1 text-xs font-medium rounded-full ${p.status === "paid" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>{p.status}</span></td><td className="px-5 py-3 text-xs text-gray-400">{new Date(p.created_at).toLocaleDateString()}</td></tr>))}</tbody></table></div></div>); }
function MessagesList({ d }: { d: any }) { return (<div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">{(d.messages || []).length === 0 ? <div className="p-12 text-center"><MessageSquare className="h-10 w-10 text-gray-300 mx-auto mb-3" /><p className="text-gray-400 text-sm">No messages</p></div> : <div className="divide-y divide-gray-50">{(d.messages || []).map((m: any) => (<div key={m.id} className="p-5 hover:bg-gray-50"><div className="flex items-start justify-between"><div><p className="font-semibold text-gray-900">{m.name}</p><p className="text-sm text-indigo-600">{m.email}</p></div><span className="text-xs text-gray-400">{new Date(m.created_at).toLocaleDateString()}</span></div><p className="mt-2 text-sm text-gray-500 bg-gray-50 rounded-xl p-3">{m.message}</p></div>))}</div>}</div>); }
function SettingsList({ d, onUpdate }: { d: any; onUpdate: () => void }) {
  const toggle = async (key: string, val: string) => { await api.patch("/api/feature-flags", { key, value: val === "enabled" ? "disabled" : "enabled" }); toast.success("Toggled"); onUpdate(); };
  return (<div className="bg-white rounded-2xl border border-gray-100 p-6"><h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><Flag className="h-4 w-4 text-indigo-600" /> Feature Flags</h3><div className="space-y-3">{(d.flags || []).map((f: any) => (<div key={f.key} className="flex items-center justify-between py-2 border-b border-gray-50"><div><p className="text-sm font-medium text-gray-900">{f.key.replace(/_/g, " ")}</p><p className="text-xs text-gray-400">{f.description}</p></div><button onClick={() => toggle(f.key, f.value)} className={`relative w-12 h-6 rounded-full transition-colors ${f.value === "enabled" ? "bg-green-500" : "bg-gray-300"}`}><span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${f.value === "enabled" ? "translate-x-6" : ""}`} /></button></div>))}</div></div>); }
function AuditList({ d }: { d: any }) {
  const [q, setQ] = useState("");
  const logs = (d.logs || []).filter((l: any) => !q || l.action?.toLowerCase().includes(q.toLowerCase()));
  return (<div className="space-y-4">
    <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search audit logs..." className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-500 outline-none text-sm bg-white" />
    </div>
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden overflow-y-auto max-h-96">
      {logs.length === 0 ? <p className="p-8 text-center text-gray-400 text-sm">No logs</p> :
      <div className="divide-y divide-gray-50">{logs.map((l: any) => (
        <div key={l.id} className="p-4 hover:bg-gray-50">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-gray-900">{l.users?.full_name || "System"}</span>
            <span className="text-indigo-600">/ {l.action.replace(/_/g, " ")}</span>
            <span className="text-xs text-gray-400">{new Date(l.created_at).toLocaleString()}</span>
          </div>
        </div>
      ))}</div>}
    </div>
  </div>);
}
