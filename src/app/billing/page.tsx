"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { DollarSign, CreditCard, ArrowUpRight, Search, Download } from "lucide-react";

export default function BillingPage() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then((res: any) => {
      if (!res?.data?.user) router.push("/login?redirect=/billing");
      else setUser(res.data.user);
    });
  }, []);

  if (!user) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full"></div></div>;

  return (
    <div className="bg-[#f8f9ff] min-h-screen p-6 md:p-10">
      <div className="max-w-[1280px] mx-auto space-y-8">
        <section><h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Billing & Financial Overview</h2><p className="text-lg text-gray-500 max-w-3xl">Manage your payments, track spending, and view transaction history.</p></section>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: "Wallet Balance", value: "12 Credits", icon: CreditCard, color: "bg-indigo-50 text-indigo-600" },
            { label: "Total Spent", value: "$2,450.00", icon: DollarSign, color: "bg-emerald-50 text-emerald-600", trend: "+8%" },
            { label: "Upcoming Payments", value: "$180.00", icon: DollarSign, color: "bg-amber-50 text-amber-600" },
          ].map((s) => {
            const I = s.icon;
            return (<div key={s.label} className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-sm border border-gray-100 hover:border-indigo-200 transition-all">
              <div className="flex justify-between items-start mb-4"><div className={`p-3 ${s.color} rounded-lg`}><I className="h-6 w-6" /></div>{s.trend && <span className="text-emerald-600 font-bold flex items-center text-sm">{s.trend} <ArrowUpRight className="h-4 w-4" /></span>}</div>
              <p className="text-sm text-gray-400 mb-1">{s.label}</p><h3 className="text-3xl font-bold text-gray-900">{s.value}</h3>
            </div>);
          })}
        </div>

        <div className="bg-indigo-600 rounded-2xl p-8 text-white shadow-lg">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div><h3 className="text-xl font-bold mb-1">Wallet Auto-Reload</h3><p className="text-sm text-indigo-200">Automatically add 10 credits when your balance falls below 3.</p></div>
            <button className="px-6 py-3 bg-white text-indigo-600 rounded-xl font-bold shadow-md hover:opacity-90 transition-all">Enable Auto-Reload</button>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gray-50">
            <h4 className="text-xl font-bold text-gray-900">Transaction History</h4>
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="relative flex-1 md:w-48"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" /><input className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 bg-white text-sm outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Search transactions..." /></div>
              <button className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50"><Download className="h-4 w-4" /> Export</button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left"><thead className="bg-gray-50"><tr>{["Date", "Description", "Amount", "Status", "Invoice"].map((h) => (<th key={h} className="px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">{h}</th>))}</tr></thead>
              <tbody className="divide-y divide-gray-50">
                {[{ date: "Oct 24, 2024", desc: "Mastery Bundle - Mathematics", amount: "-$180.00", status: "Paid" },
                  { date: "Oct 18, 2024", desc: "Single Sprint - Physics", amount: "-$45.00", status: "Paid" },
                  { date: "Oct 10, 2024", desc: "Wallet Top-Up", amount: "+$100.00", status: "Completed" },
                ].map((t, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-400">{t.date}</td>
                    <td className="px-6 py-4"><p className="font-semibold text-gray-900 text-sm">{t.desc}</p></td>
                    <td className="px-6 py-4 text-sm font-medium">{t.amount}</td>
                    <td className="px-6 py-4"><span className={`px-2.5 py-1 rounded-md text-xs font-medium ${t.status === "Paid" ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>{t.status}</span></td>
                    <td className="px-6 py-4"><button className="text-indigo-600 font-semibold text-sm hover:underline">Download</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
