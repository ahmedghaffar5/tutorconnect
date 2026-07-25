"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { DollarSign, TrendingUp, Download } from "lucide-react";

export default function TutorEarnings() {
  const router = useRouter();
  const supabase = createClient();
  useEffect(() => {
    supabase.auth.getUser().then((res: any) => {
      if (!res?.data?.user) router.push("/login?redirect=/tutor/earnings");
    });
  }, []);

  return (
    <div className="bg-[#f8f9ff] min-h-screen p-6">
      <div className="max-w-[1280px] mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-gray-900">Earnings</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: "This Month", value: "$2,450.00", icon: DollarSign, color: "bg-indigo-50 text-indigo-600", trend: "+14%" },
            { label: "Pending", value: "$840.00", icon: DollarSign, color: "bg-amber-50 text-amber-600" },
            { label: "Available for Payout", value: "$1,200.00", icon: DollarSign, color: "bg-emerald-50 text-emerald-600" },
          ].map((s) => {
            const I = s.icon;
            return (<div key={s.label} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm"><div className="flex justify-between items-start mb-4"><div className={`p-3 ${s.color} rounded-lg`}><I className="h-6 w-6" /></div>{s.trend && <span className="text-emerald-600 font-semibold text-sm flex items-center gap-1"><TrendingUp className="h-4 w-4" />{s.trend}</span>}</div><p className="text-sm text-gray-400 mb-1">{s.label}</p><h3 className="text-3xl font-bold text-gray-900">{s.value}</h3></div>);
          })}
        </div>
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center"><h3 className="text-lg font-bold">Payout History</h3><button className="flex items-center gap-1.5 text-sm text-gray-500 border border-gray-200 px-3 py-2 rounded-lg hover:bg-gray-50"><Download className="h-4 w-4" /> Export</button></div>
          <table className="w-full text-sm"><thead className="bg-gray-50"><tr>{["Date", "Amount", "Status"].map(h => (<th key={h} className="px-6 py-3 text-left font-semibold text-gray-400 text-xs uppercase">{h}</th>))}</tr></thead>
            <tbody className="divide-y divide-gray-50">{[
              { date: "Oct 15, 2024", amount: "$1,200.00", status: "Completed" },
              { date: "Oct 1, 2024", amount: "$980.00", status: "Completed" },
              { date: "Sep 15, 2024", amount: "$1,450.00", status: "Completed" },
            ].map((p: any, i) => (<tr key={i} className="hover:bg-gray-50"><td className="px-6 py-4 text-gray-400">{p.date}</td><td className="px-6 py-4 font-medium">{p.amount}</td><td className="px-6 py-4"><span className="bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full text-xs font-medium">{p.status}</span></td></tr>))}</tbody></table>
        </div>
      </div>
    </div>
  );
}
