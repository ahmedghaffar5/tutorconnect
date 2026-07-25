"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Calendar, TrendingUp, DollarSign, ArrowUpRight, Download, Plus, HelpCircle, LogOut } from "lucide-react";
import Link from "next/link";

const students = [
  { name: "Maya Rivers", age: "Year 9", subjects: "Calculus & Physics", color: "bg-primary", online: true },
  { name: "Leo Rivers", age: "Year 5", subjects: "English & Creative Writing", color: "bg-secondary", online: false },
];

const navItems = [
  { label: "Dashboard", icon: "grid", active: true },
  { label: "My Lessons", icon: "calendar", active: false },
  { label: "Messages", icon: "message-square", active: false },
  { label: "Analytics", icon: "trending-up", active: false },
  { label: "Settings", icon: "settings", active: false },
];

export default function ParentDashboard() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then((res: any) => {
      if (!res?.data?.user) router.push("/login?redirect=/parent-dashboard");
      else setUser(res.data.user);
    });
  }, []);

  if (!user) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div></div>;

  return (
    <div className="bg-surface text-on-surface min-h-screen">
      <main className="p-lg md:p-xl max-w-container-max mx-auto">
        <header className="mb-xl flex flex-col md:flex-row justify-between items-start md:items-end gap-md">
          <div>
            <nav className="flex items-center gap-2 text-on-surface-variant mb-1"><span className="font-label-sm">Home</span><span className="opacity-50">/</span><span className="font-label-sm text-primary">Parental Dashboard</span></nav>
            <h2 className="font-headline-md">Family Learning Overview</h2>
          </div>
          <div className="flex gap-md">
            <button className="px-lg py-sm border border-outline-variant rounded-lg font-label-md hover:bg-surface-container-high transition-colors flex items-center gap-2"><Download className="h-4 w-4" /> Export Report</button>
            <button className="px-lg py-sm bg-secondary text-on-secondary rounded-lg font-label-md shadow-sm hover:opacity-90">Add Student Profile</button>
          </div>
        </header>

        <div className="grid grid-cols-12 gap-lg">
          <div className="col-span-12 lg:col-span-8 grid grid-cols-3 gap-md">
            {[
              { label: "Total Hours", value: "184.5", icon: Calendar, color: "bg-primary-container/20 text-primary", badge: "+12%" },
              { label: "Grade Average", value: "A-", icon: TrendingUp, color: "bg-secondary-container/20 text-secondary", badge: "Top 5%" },
              { label: "Monthly Billing", value: "$420", icon: DollarSign, color: "bg-tertiary-container/20 text-tertiary", badge: "Due in 4d" },
            ].map((s) => (<div key={s.label} className="glass-card p-xl rounded-2xl flex flex-col justify-between"><div className="flex justify-between items-start"><s.icon className={`h-8 w-8 ${s.color} p-1.5 rounded-lg`} /><span className="text-secondary font-label-sm bg-secondary-container/20 px-2 py-0.5 rounded-full">{s.badge}</span></div><div className="mt-xl"><p className="text-on-surface-variant font-label-md">{s.label}</p><h3 className="font-display-lg-mobile mt-xs">{s.value}</h3></div></div>))}
          </div>

          <div className="col-span-12 lg:col-span-4 glass-card rounded-2xl p-xl relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-xl"><h3 className="font-headline-sm">Active Students</h3><button className="text-primary font-label-sm hover:underline">View All</button></div>
              <div className="space-y-lg">
                {students.map((s) => (
                  <div key={s.name} className="flex items-center gap-md group cursor-pointer">
                    <div className="relative">
                      <div className={`w-14 h-14 rounded-full ${s.color === "bg-primary" ? "bg-primary-fixed" : "bg-secondary-container"} flex items-center justify-center text-lg font-bold ${s.color === "bg-primary" ? "text-on-primary-fixed" : "text-on-secondary-container"}`}>{s.name.split(" ").map(n => n[0]).join("")}</div>
                      {s.online && <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-secondary border-2 border-white rounded-full"></div>}
                    </div>
                    <div className="flex-1"><h4 className="font-label-md font-bold">{s.name}</h4><p className="text-body-sm text-on-surface-variant">{s.age} • {s.subjects}</p></div>
                    <span className="text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-8 glass-card rounded-2xl p-xl">
            <div className="flex justify-between items-center mb-xl">
              <div><h3 className="font-headline-sm">Progress Analysis</h3><p className="text-body-sm text-on-surface-variant">Learning velocity across all curriculums</p></div>
              <div className="flex gap-3"><span className="flex items-center gap-1 font-label-sm text-xs"><div className="w-3 h-3 rounded-full bg-primary"></div> Maya</span><span className="flex items-center gap-1 font-label-sm text-xs"><div className="w-3 h-3 rounded-full bg-secondary"></div> Leo</span></div>
            </div>
            <div className="h-64 flex items-end justify-between gap-4">
              {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((day, i) => (
                <div key={day} className="flex flex-col items-center flex-1 h-full justify-end">
                  <div className="flex gap-1 items-end w-full">
                    <div className="bg-primary/20 w-full rounded-t-lg hover:bg-primary transition-all" style={{ height: `${[60, 85, 45, 70, 95, 20, 30][i]}%` }}></div>
                    <div className="bg-secondary/20 w-full rounded-t-lg hover:bg-secondary transition-all" style={{ height: `${[40, 30, 90, 55, 45, 15, 20][i]}%` }}></div>
                  </div>
                  <span className="text-[10px] mt-2 text-on-surface-variant font-label-sm">{day}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="col-span-12 lg:col-span-4 space-y-lg">
            <div className="glass-card rounded-2xl p-xl"><h3 className="font-label-md font-bold mb-lg flex items-center gap-2">Next Up</h3>
              <div className="bg-surface p-md rounded-xl border border-outline-variant/30">
                <div className="flex justify-between items-start mb-2"><p className="font-label-sm text-primary font-bold">TODAY, 16:00</p><span className="text-[10px] px-2 py-0.5 bg-primary-container text-on-primary-container rounded uppercase">Maya</span></div>
                <h4 className="font-label-md">Physics: Quantum Mechanics</h4>
                <p className="text-body-sm text-on-surface-variant mt-1">with Dr. Sarah Miller</p>
                <div className="flex mt-md gap-2"><button className="flex-1 py-2 bg-primary text-on-primary rounded-lg font-label-sm hover:opacity-90">Join Room</button></div>
              </div>
            </div>
            <div className="glass-card rounded-2xl p-xl bg-primary text-on-primary-container overflow-hidden relative">
              <div className="relative z-10"><h3 className="font-label-md font-bold mb-md text-on-primary">Billing & Wallet</h3>
                <div className="mb-lg"><p className="text-on-primary/70 font-label-sm">Current Balance</p><h4 className="font-headline-sm font-bold text-on-primary">$1,240.00</h4></div>
                <div className="space-y-md">{[["Maya - 12 Lessons", "$840.00"], ["Leo - 6 Lessons", "$400.00"]].map(([name, amt]) => (
                  <div key={name} className="flex justify-between font-label-sm text-on-primary/80 border-b border-on-primary/10 pb-2"><span>{name}</span><span>{amt}</span></div>
                ))}</div>
                <button className="w-full mt-xl bg-on-primary text-primary py-2.5 rounded-lg font-bold font-label-md shadow-lg hover:bg-surface transition-colors">Manage Payment Methods</button>
              </div>
            </div>
          </div>

          <div className="col-span-12 glass-card rounded-2xl overflow-hidden">
            <div className="px-xl py-lg border-b border-outline-variant/30 bg-surface-container-low flex justify-between items-center">
              <h3 className="font-headline-sm">Curriculum Performance</h3>
              <div className="flex gap-lg"><select className="bg-transparent border-none font-label-md text-on-surface-variant focus:ring-0 text-sm"><option>All Students</option></select><select className="bg-transparent border-none font-label-md text-on-surface-variant focus:ring-0 text-sm"><option>Term 3, 2024</option></select></div>
            </div>
            <table className="w-full text-left"><thead><tr className="bg-surface-container-highest/50 text-on-surface-variant font-label-sm uppercase tracking-wider"><th className="px-xl py-md font-bold">Subject</th><th className="px-xl py-md font-bold">Student</th><th className="px-xl py-md font-bold">Status</th><th className="px-xl py-md font-bold">Improvement</th><th className="px-xl py-md font-bold">Next Milestone</th></tr></thead>
              <tbody className="divide-y divide-outline-variant/20">
                {[{ subject: "Advanced Calculus", student: "Maya Rivers", status: "On Track", statusColor: "bg-secondary-container/30 text-secondary", improvement: "+14%", milestone: "Final Exam (Nov 15)" },
                  { subject: "Creative Writing", student: "Leo Rivers", status: "Steady", statusColor: "bg-primary-fixed text-primary", improvement: "+3%", milestone: "Short Story Draft (Oct 22)" },
                  { subject: "Astrophysics", student: "Maya Rivers", status: "Attention", statusColor: "bg-error-container text-error", improvement: "-5%", milestone: "Quiz Remediation (Oct 30)" },
                ].map((row) => (<tr key={row.subject} className="hover:bg-surface-container-low/50 transition-colors"><td className="px-xl py-lg"><div className="flex items-center gap-md"><div><p className="font-label-md font-bold text-on-surface">{row.subject}</p></div></div></td><td className="px-xl py-lg font-label-md">{row.student}</td><td className="px-xl py-lg"><span className={`${row.statusColor} px-3 py-1 rounded-full font-label-sm font-bold`}>{row.status}</span></td><td className="px-xl py-lg"><div className="flex items-center gap-1 font-bold text-sm">{row.improvement}</div></td><td className="px-xl py-lg text-body-sm">{row.milestone}</td></tr>))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
