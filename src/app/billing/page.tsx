"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { DollarSign, CreditCard, ArrowUpRight, Search, Download, ChevronDown } from "lucide-react";

export default function BillingPage() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then((res: any) => {
      const u = res?.data?.user;
      if (!u) router.push("/login?redirect=/billing");
      else setUser(u);
    });
  }, []);

  if (!user) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div></div>;

  return (
    <div className="bg-background min-h-screen p-lg md:p-2xl">
      <div className="max-w-container-max mx-auto space-y-3xl">
        <section>
          <h2 className="font-display-lg text-display-lg-mobile md:text-display-lg mb-sm">Billing & Financial Overview</h2>
          <p className="font-body-lg text-on-surface-variant max-w-3xl">Manage your payments, track spending, and view transaction history.</p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
          <div className="glass-card p-xl rounded-xl shadow-sm group hover:border-primary transition-all">
            <div className="flex justify-between items-start mb-lg">
              <div className="p-md bg-primary-container rounded-lg"><CreditCard className="h-6 w-6 text-primary" /></div>
            </div>
            <p className="font-label-md text-on-surface-variant mb-xs">Wallet Balance</p>
            <h3 className="font-headline-md">12 Credits</h3>
          </div>
          <div className="glass-card p-xl rounded-xl shadow-sm group hover:border-secondary transition-all">
            <div className="flex justify-between items-start mb-lg">
              <div className="p-md bg-secondary-container rounded-lg"><DollarSign className="h-6 w-6 text-secondary" /></div>
              <span className="text-secondary font-bold flex items-center text-sm">+8% <ArrowUpRight className="h-4 w-4" /></span>
            </div>
            <p className="font-label-md text-on-surface-variant mb-xs">Total Spent</p>
            <h3 className="font-headline-md">$2,450.00</h3>
          </div>
          <div className="glass-card p-xl rounded-xl shadow-sm group hover:border-tertiary transition-all">
            <div className="flex justify-between items-start mb-lg">
              <div className="p-md bg-tertiary-fixed rounded-lg"><DollarSign className="h-6 w-6 text-tertiary" /></div>
            </div>
            <p className="font-label-md text-on-surface-variant mb-xs">Upcoming Payments</p>
            <h3 className="font-headline-md">$180.00</h3>
          </div>
        </div>

        <div className="bg-primary rounded-2xl p-xl text-on-primary shadow-lg">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-lg">
            <div>
              <h3 className="font-headline-sm mb-xs">Wallet Auto-Reload</h3>
              <p className="font-body-sm opacity-90">Automatically add 10 credits when your balance falls below 3.</p>
            </div>
            <button className="px-lg py-md bg-on-primary text-primary rounded-xl font-bold shadow-md hover:opacity-90 transition-all">Enable Auto-Reload</button>
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden">
          <div className="p-lg border-b border-outline-variant flex flex-col md:flex-row justify-between items-start md:items-center gap-md bg-surface-container-low">
            <h4 className="font-headline-sm">Transaction History</h4>
            <div className="flex items-center gap-md w-full md:w-auto">
              <div className="relative flex-1 md:w-48"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-on-surface-variant" /><input className="w-full pl-10 pr-4 py-2 rounded-lg border border-outline-variant bg-surface text-sm outline-none focus:ring-2 focus:ring-primary" placeholder="Search transactions..." /></div>
              <button className="flex items-center gap-1 px-3 py-2 text-sm text-on-surface-variant border border-outline-variant rounded-lg hover:bg-surface-container-low"><Download className="h-4 w-4" /> Export</button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-surface-container-high"><tr>{["Date", "Description", "Amount", "Status", "Invoice"].map((h) => (<th key={h} className="px-lg py-md font-label-md text-on-surface-variant">{h}</th>))}</tr></thead>
              <tbody className="divide-y divide-outline-variant">
                {[{ date: "Oct 24, 2024", desc: "Mastery Bundle - Mathematics", amount: "-$180.00", status: "Paid" },
                  { date: "Oct 18, 2024", desc: "Single Sprint - Physics", amount: "-$45.00", status: "Paid" },
                  { date: "Oct 10, 2024", desc: "Wallet Top-Up", amount: "+$100.00", status: "Completed" },
                  { date: "Oct 5, 2024", desc: "Monthly Subscription", amount: "-$199.00", status: "Paid" },
                ].map((t, i) => (
                  <tr key={i} className="hover:bg-surface-container-low transition-colors">
                    <td className="px-lg py-md text-sm text-on-surface-variant">{t.date}</td>
                    <td className="px-lg py-md"><div className="flex items-center gap-md"><p className="font-bold text-on-surface">{t.desc}</p></div></td>
                    <td className="px-lg py-md font-label-md">{t.amount}</td>
                    <td className="px-lg py-md"><span className={`px-sm py-1 rounded-md text-xs font-medium ${t.status === "Paid" ? "bg-secondary-container text-on-secondary-container" : "bg-surface-container-high text-on-surface"}`}>{t.status}</span></td>
                    <td className="px-lg py-md"><button className="text-primary font-bold text-sm hover:underline">Download</button></td>
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
