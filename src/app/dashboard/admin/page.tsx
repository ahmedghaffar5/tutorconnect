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
    try {
      const res = await fetch("/api/admin/dashboard");
      if (!res.ok) return;
      setD(await res.json());
    } catch {}
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  if (!d) return <div className="min-h-screen bg-background flex items-center justify-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" /></div>;

  const Icon = tabs.find((t) => t.id === tab)?.icon || LayoutDashboard;

  return (
    <div className="bg-background min-h-screen flex">
      <aside className={`${sidebar ? "w-64" : "w-16"} bg-surface-container-low border-r border-outline-variant transition-all duration-200 flex flex-col flex-shrink-0`}>
        <div className="h-16 flex items-center justify-between px-4 border-b border-outline-variant">
          {sidebar && <span className="font-headline-sm text-sm font-bold text-primary">Admin Panel</span>}
          <button onClick={() => setSidebar(!sidebar)} className="p-1.5 rounded-lg hover:bg-surface-container text-on-surface-variant">{sidebar ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</button>
        </div>
        <nav className="flex-1 overflow-y-auto py-2 px-2 space-y-0.5">
          {tabs.map((t) => {
            const I = t.icon;
            return (<button key={t.id} onClick={() => setTab(t.id)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${tab === t.id ? "bg-primary-container text-on-primary-container" : "text-on-surface-variant hover:bg-surface-container-high"}`}>
              <I className="h-5 w-5 flex-shrink-0" />{sidebar && <span className="truncate">{t.label}</span>}{sidebar && tab === t.id && <ChevronRight className="h-4 w-4 ml-auto" />}
            </button>);
          })}
        </nav>
        <div className="p-3 border-t border-outline-variant">
          <button onClick={async () => { await supabase.auth.signOut(); router.push("/login"); }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-error hover:bg-error-container">
            <X className="h-5 w-5" />{sidebar && <span>Logout</span>}
          </button>
        </div>
      </aside>
      <main className="flex-1 min-w-0 overflow-y-auto">
        <div className="max-w-container-max mx-auto p-lg md:p-3xl space-y-3xl">
          <section>
            <h2 className="font-display-lg text-display-lg-mobile md:text-display-lg mb-sm">Platform Audit & Controls</h2>
            <p className="font-body-lg text-on-surface-variant max-w-3xl">Enterprise management suite for overseeing global tutor activities, application workflows, and real-time revenue performance.</p>
          </section>

          {tab === "overview" && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
                {[
                  { label: "Total Active Tutors", value: d.tutors?.length || 0, icon: Users, color: "bg-primary-container text-primary", trend: "+12%", trendColor: "text-secondary" },
                  { label: "Pending Applications", value: d.pendingTutors?.length || 0, icon: FileText, color: "bg-tertiary-fixed text-tertiary", badge: "Priority" },
                  { label: "Platform Revenue", value: `$${(d.totalRevenue || 0).toFixed(2)}`, icon: DollarSign, color: "bg-secondary-container text-secondary", sub: "Last 30 Days" },
                ].map((s) => {
                  const I = s.icon;
                  return (<div key={s.label} className="glass-card p-xl rounded-xl shadow-sm group hover:border-primary transition-all">
                    <div className="flex justify-between items-start mb-lg"><div className={`p-md ${s.color} rounded-lg`}><I className="h-6 w-6" /></div>
                      {s.trend && <span className={`${s.trendColor} font-bold flex items-center text-sm`}>{s.trend} ↑</span>}
                      {s.badge && <span className="bg-tertiary text-on-tertiary px-sm py-1 rounded-full text-xs font-bold">{s.badge}</span>}
                      {s.sub && <span className="text-on-surface-variant text-xs">{s.sub}</span>}
                    </div>
                    <p className="font-label-md text-on-surface-variant mb-xs">{s.label}</p>
                    <h3 className="font-headline-md">{s.value}</h3>
                  </div>);
                })}
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg items-start">
                <section className="lg:col-span-8 bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden">
                  <div className="p-lg border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
                    <h4 className="font-headline-sm">Pending Tutor Verification</h4>
                    <button className="text-primary font-bold text-sm hover:underline">View All</button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-surface-container-high"><tr>{["Tutor Name", "Subject", "Date Applied", "Actions"].map((h) => (<th key={h} className="px-lg py-md font-label-md text-on-surface-variant">{h}</th>))}</tr></thead>
                      <tbody className="divide-y divide-outline-variant">
                        {(d.pendingTutors || []).length > 0 ? (d.pendingTutors as any[]).slice(0, 5).map((t: any, i: number) => (
                          <tr key={t.id || i} className="hover:bg-surface-container-low transition-colors">
                            <td className="px-lg py-md"><div className="flex items-center gap-md"><div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-sm font-bold text-on-primary-fixed">{(t.full_name || "?").charAt(0)}</div><div><p className="font-bold text-on-surface">{t.full_name || "Unknown"}</p><p className="text-xs text-on-surface-variant">{t.email}</p></div></div></td>
                            <td className="px-lg py-md"><span className="bg-primary-container text-on-primary-container px-sm py-1 rounded-md text-xs font-medium">Pending</span></td>
                            <td className="px-lg py-md text-sm text-on-surface-variant">{t.created_at ? new Date(t.created_at).toLocaleDateString() : "-"}</td>
                            <td className="px-lg py-md text-right"><div className="flex justify-end gap-sm"><button className="p-xs text-secondary hover:bg-secondary-container rounded-md transition-colors"><span className="text-lg">✓</span></button><button className="p-xs text-error hover:bg-error-container rounded-md transition-colors"><span className="text-lg">✕</span></button></div></td>
                          </tr>
                        )) : <tr><td colSpan={4} className="p-8 text-center text-on-surface-variant text-sm">No pending applications</td></tr>}
                      </tbody>
                    </table>
                  </div>
                </section>
                <section className="lg:col-span-4 bg-surface-container-highest rounded-xl shadow-sm flex flex-col h-[500px]">
                  <div className="p-lg border-b border-outline-variant flex items-center justify-between"><h4 className="font-headline-sm">Audit Log</h4><Shield className="h-5 w-5 text-on-surface-variant" /></div>
                  <div className="p-lg space-y-md overflow-y-auto flex-1">
                    {(d.logs || []).slice(0, 6).map((l: any, i: number) => (
                      <div key={l.id || i} className="flex gap-md border-l-2 border-primary pl-md py-1">
                        <div className="flex-1"><p className="text-sm font-bold text-on-surface">{l.action?.replace(/_/g, " ") || "Event"}</p><p className="text-xs text-on-surface-variant">{l.details ? JSON.stringify(l.details).slice(0, 50) : ""}</p><span className="text-[10px] text-outline font-medium uppercase tracking-wider">{l.created_at ? new Date(l.created_at).toLocaleString() : ""}</span></div>
                      </div>
                    ))}
                    {(!d.logs || d.logs.length === 0) && <p className="text-center text-on-surface-variant py-8">No audit logs</p>}
                  </div>
                </section>
              </div>
              <section className="glass-card p-xl rounded-2xl relative overflow-hidden h-64 flex items-center justify-center group">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(#4f46e5 1px, transparent 1px)", backgroundSize: "20px 20px" }}></div>
                <div className="relative z-10 text-center"><h5 className="font-headline-sm mb-xs">Revenue Insights Engine</h5><p className="text-on-surface-variant mb-lg">Machine learning analysis of platform growth and seasonal trends.</p><button className="bg-primary text-on-primary px-xl py-md rounded-full font-bold flex items-center gap-md mx-auto group-hover:scale-105 transition-transform">Generate Detailed Forecast</button></div>
              </section>
            </>
          )}
          {tab === "applications" && <Applications d={d} onUpdate={loadData} />}
          {tab === "users" && <UsersTable d={d} onUpdate={loadData} />}
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

const api = { post: async (url: string, body?: any) => { const r = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: body ? JSON.stringify(body) : undefined }); return r.json(); }, patch: async (url: string, body: any) => { const r = await fetch(url, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }); return r.json(); }, del: async (url: string) => { const r = await fetch(url, { method: "DELETE" }); return r.json(); } };

function Applications({ d, onUpdate }: { d: any; onUpdate: () => void }) {
  const [filter, setFilter] = useState("");
  const apps = d.applications?.filter((a: any) => a.status !== "draft" && (!filter || a.status === filter)) || [];
  const colors: Record<string, string> = { submitted: "bg-yellow-100 text-yellow-700", under_review: "bg-blue-100 text-blue-700", approved: "bg-green-100 text-green-700", rejected: "bg-red-100 text-red-700" };
  return (<div className="space-y-4">
    <div className="flex flex-wrap gap-2">{["", "submitted", "under_review", "approved", "rejected"].map((s) => (<button key={s} onClick={() => setFilter(s)} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${filter === s ? "bg-primary text-on-primary" : "bg-white text-gray-600 border border-gray-200"}`}>{s ? s.replace(/_/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase()) : "All"}</button>))}</div>
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">{apps.length === 0 ? <div className="p-12 text-center"><FileText className="h-10 w-10 text-gray-300 mx-auto mb-3" /><p className="text-gray-500 text-sm">No applications</p></div> :
    <div className="divide-y divide-gray-50">{apps.map((app: any) => (<div key={app.id} className="p-4 flex items-center justify-between hover:bg-gray-50"><div className="flex items-center gap-3 flex-1 min-w-0"><div className="w-9 h-9 bg-primary-fixed rounded-full flex items-center justify-center"><span className="text-xs font-bold text-on-primary-fixed">{(app.full_name || "?").charAt(0)}</span></div><div><p className="text-sm font-medium text-gray-900 truncate">{app.full_name || "Unknown"}</p><p className="text-xs text-gray-400">{app.email}</p></div></div><a href={`/dashboard/admin/applications/${app.id}`} className="text-xs text-primary hover:underline font-medium">Review →</a></div>))}</div>}</div>
  </div>);
}
function UsersTable({ d, onUpdate }: { d: any; onUpdate: () => void }) {
  const [search, setSearch] = useState("");
  const users = d.users?.filter((u: any) => !search || u.full_name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase())) || [];
  return (<div className="space-y-4"><div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" /><input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search users..." className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 outline-none text-sm" /></div>
    <div className="bg-white rounded-2xl border border-gray-100 overflow-x-auto"><table className="w-full text-sm"><thead className="bg-gray-50"><tr><th className="text-left px-4 py-3 font-medium text-gray-500">Name</th><th className="text-left px-4 py-3 font-medium text-gray-500">Email</th><th className="text-left px-4 py-3 font-medium text-gray-500">Role</th></tr></thead><tbody className="divide-y divide-gray-50">{users.map((u: any) => (<tr key={u.id} className="hover:bg-gray-50"><td className="px-4 py-3 font-medium text-gray-900">{u.full_name || "-"}</td><td className="px-4 py-3 text-gray-500">{u.email}</td><td className="px-4 py-3"><span className={`px-2.5 py-1 text-xs font-medium rounded-full ${u.role === "admin" ? "bg-red-100 text-red-700" : u.role === "tutor" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}>{u.role}</span></td></tr>))}</tbody></table></div>
  </div>);
}
function TutorsList({ d, onUpdate }: { d: any; onUpdate: () => void }) {
  const toggle = async (tutorId: string, approved: boolean) => { const res = await api.patch("/api/tutors", { tutorId, isApproved: !approved }); if (res.error) { toast.error(res.error); return; } toast.success(!approved ? "Approved" : "Revoked"); onUpdate(); };
  return (<div className="bg-white rounded-2xl border border-gray-100 overflow-x-auto"><table className="w-full text-sm"><thead className="bg-gray-50"><tr><th className="text-left px-4 py-3 font-medium text-gray-500">Tutor</th><th className="text-left px-4 py-3 font-medium text-gray-500">Rate</th><th className="text-left px-4 py-3 font-medium text-gray-500">Status</th><th className="text-left px-4 py-3 font-medium text-gray-500">Action</th></tr></thead><tbody className="divide-y divide-gray-50">{(d.tutors || []).map((t: any) => (<tr key={t.id} className="hover:bg-gray-50"><td className="px-4 py-3 font-medium text-gray-900">Tutor {t.id.slice(0, 6)}</td><td className="px-4 py-3">${t.hourly_rate || 0}/hr</td><td className="px-4 py-3"><span className={`px-2.5 py-1 text-xs font-medium rounded-full ${t.is_approved ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>{t.is_approved ? "Approved" : "Pending"}</span></td><td className="px-4 py-3"><button onClick={() => toggle(t.id, t.is_approved)} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${t.is_approved ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"}`}>{t.is_approved ? "Revoke" : "Approve"}</button></td></tr>))}</tbody></table></div>);
}
function BookingsList({ d }: { d: any }) {
  return (<div className="bg-white rounded-2xl border border-gray-100 overflow-x-auto"><table className="w-full text-sm"><thead className="bg-gray-50"><tr><th className="text-left px-4 py-3 font-medium text-gray-500">Subject</th><th className="text-left px-4 py-3 font-medium text-gray-500">Date</th><th className="text-left px-4 py-3 font-medium text-gray-500">Status</th></tr></thead><tbody className="divide-y divide-gray-50">{(d.bookings || []).map((b: any) => (<tr key={b.id} className="hover:bg-gray-50"><td className="px-4 py-3 font-medium text-gray-900">{b.subjects?.name || "Class"}</td><td className="px-4 py-3 text-gray-500 text-xs">{b.scheduled_at ? new Date(b.scheduled_at).toLocaleDateString() : "TBD"}</td><td className="px-4 py-3"><span className={`px-2 py-1 text-xs font-medium rounded-full ${b.status === "confirmed" ? "bg-green-100 text-green-700" : b.status === "pending" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>{b.status}</span></td></tr>))}</tbody></table></div>);
}
function PaymentsList({ d }: { d: any }) {
  return (<div className="space-y-4"><div className="grid grid-cols-3 gap-4"><div className="bg-white rounded-xl border border-gray-100 p-4"><p className="text-xs text-gray-400">Revenue</p><p className="text-2xl font-bold text-gray-900">${(d.totalRevenue || 0).toFixed(2)}</p></div><div className="bg-white rounded-xl border border-gray-100 p-4"><p className="text-xs text-gray-400">Transactions</p><p className="text-2xl font-bold text-gray-900">{d.payments?.length || 0}</p></div></div>
    <div className="bg-white rounded-2xl border border-gray-100 overflow-x-auto"><table className="w-full text-sm"><thead className="bg-gray-50"><tr><th className="text-left px-4 py-3 font-medium text-gray-500">Amount</th><th className="text-left px-4 py-3 font-medium text-gray-500">Status</th><th className="text-left px-4 py-3 font-medium text-gray-500">Date</th></tr></thead><tbody className="divide-y divide-gray-50">{(d.payments || []).map((p: any) => (<tr key={p.id} className="hover:bg-gray-50"><td className="px-4 py-3 font-medium text-gray-900">${(p.amount || 0).toFixed(2)}</td><td className="px-4 py-3"><span className={`px-2 py-1 text-xs font-medium rounded-full ${p.status === "paid" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>{p.status}</span></td><td className="px-4 py-3 text-gray-400 text-xs">{new Date(p.created_at).toLocaleDateString()}</td></tr>))}</tbody></table></div>
  </div>);
}
function MessagesList({ d }: { d: any }) {
  return (<div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">{(d.messages || []).length === 0 ? <div className="p-12 text-center"><MessageSquare className="h-10 w-10 text-gray-300 mx-auto mb-3" /><p className="text-gray-500 text-sm">No messages</p></div> :
    <div className="divide-y divide-gray-50">{(d.messages || []).map((m: any) => (<div key={m.id} className="p-5 hover:bg-gray-50"><div className="flex items-start justify-between"><div><p className="font-semibold text-gray-900">{m.name}</p><p className="text-sm text-blue-600">{m.email}</p></div><span className="text-xs text-gray-400">{new Date(m.created_at).toLocaleDateString()}</span></div><p className="mt-2 text-sm text-gray-600 bg-gray-50 rounded-xl p-3">{m.message}</p></div>))}</div>}</div>);
}
function SettingsList({ d, onUpdate }: { d: any; onUpdate: () => void }) {
  const toggle = async (key: string, val: string) => { await api.patch("/api/feature-flags", { key, value: val === "enabled" ? "disabled" : "enabled" }); toast.success("Toggled"); onUpdate(); };
  return (<div className="bg-white rounded-2xl border border-gray-100 p-5"><h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><Flag className="h-4 w-4 text-blue-600" /> Feature Flags</h3>
    <div className="space-y-3">{(d.flags || []).map((f: any) => (<div key={f.key} className="flex items-center justify-between py-2 border-b border-gray-50"><div><p className="text-sm font-medium text-gray-900">{f.key.replace(/_/g, " ")}</p><p className="text-xs text-gray-400">{f.description}</p></div>
      <button onClick={() => toggle(f.key, f.value)} className={`relative w-12 h-6 rounded-full transition-colors ${f.value === "enabled" ? "bg-green-500" : "bg-gray-300"}`}><span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${f.value === "enabled" ? "translate-x-6" : ""}`} /></button>
    </div>))}</div>
  </div>);
}
function AuditList({ d }: { d: any }) {
  const [q, setQ] = useState("");
  const logs = (d.logs || []).filter((l: any) => !q || l.action?.toLowerCase().includes(q.toLowerCase()) || l.users?.full_name?.toLowerCase().includes(q.toLowerCase()));
  return (<div className="space-y-4"><div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" /><input type="text" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search..." className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 outline-none text-sm" /></div>
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden max-h-96 overflow-y-auto">{logs.length === 0 ? <p className="p-8 text-center text-gray-400 text-sm">No logs</p> :
    <div className="divide-y divide-gray-50">{logs.map((l: any) => (<div key={l.id} className="p-4 hover:bg-gray-50"><div className="flex items-center justify-between text-sm"><span className="font-medium text-gray-900">{l.users?.full_name || "System"} <span className="text-blue-600">/ {l.action.replace(/_/g, " ")}</span></span><span className="text-xs text-gray-400">{new Date(l.created_at).toLocaleString()}</span></div></div>))}</div>}</div>
  </div>);
}
