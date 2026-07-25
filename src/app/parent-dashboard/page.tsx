"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Calendar, TrendingUp, DollarSign, Download } from "lucide-react";
import Link from "next/link";

const students = [
  { name: "Maya Rivers", age: "Year 9", subjects: "Calculus & Physics", img: "/images/stitch/parental_oversight_dashboard-0.jpg", online: true },
  { name: "Leo Rivers", age: "Year 5", subjects: "English & Creative Writing", img: "/images/stitch/parental_oversight_dashboard-2.jpg", online: false },
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

  if (!user) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full"></div></div>;

  return (
    <div className="bg-[#f8f9ff] min-h-screen">
      <div className="max-w-[1280px] mx-auto p-6">
        <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <nav className="flex items-center gap-2 text-sm text-gray-400 mb-1"><span>Home</span><span className="opacity-50">/</span><span className="text-indigo-600 font-medium">Parental Dashboard</span></nav>
            <h2 className="text-3xl font-bold text-gray-900">Family Learning Overview</h2>
          </div>
          <div className="flex gap-3">
            <button className="px-5 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-50 flex items-center gap-2"><Download className="h-4 w-4" /> Export Report</button>
            <button className="px-5 py-2.5 bg-emerald-500 text-white rounded-lg text-sm font-medium shadow-sm hover:bg-emerald-600">Add Student Profile</button>
          </div>
        </header>

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-8 grid grid-cols-3 gap-4">
            {[
              { label: "Total Hours", value: "184.5", icon: Calendar, color: "bg-indigo-50 text-indigo-600", badge: "+12%" },
              { label: "Grade Average", value: "A-", icon: TrendingUp, color: "bg-emerald-50 text-emerald-600", badge: "Top 5%" },
              { label: "Monthly Billing", value: "$420", icon: DollarSign, color: "bg-amber-50 text-amber-600", badge: "Due in 4d" },
            ].map((s) => {
              const I = s.icon;
              return (<div key={s.label} className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-100 flex flex-col justify-between hover:shadow-md transition-all">
                <div className="flex justify-between items-start"><div className={`p-2 ${s.color} rounded-lg`}><I className="h-5 w-5" /></div><span className="text-emerald-600 text-xs font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">{s.badge}</span></div>
                <div className="mt-6"><p className="text-sm text-gray-400">{s.label}</p><h3 className="text-3xl font-bold mt-1 text-gray-900">{s.value}</h3></div>
              </div>);
            })}
          </div>

          <div className="col-span-12 lg:col-span-4 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-6"><h3 className="text-xl font-bold">Active Students</h3><button className="text-indigo-600 text-sm font-medium hover:underline">View All</button></div>
              <div className="space-y-6">
                {students.map((s) => (
                  <div key={s.name} className="flex items-center gap-4 group cursor-pointer">
                    <div className="relative"><img src={s.img} alt="" className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm" />{s.online && <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></div>}</div>
                    <div className="flex-1"><h4 className="text-sm font-bold">{s.name}</h4><p className="text-xs text-gray-400">{s.age} • {s.subjects}</p></div>
                    <span className="text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-8 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div><h3 className="text-xl font-bold">Progress Analysis</h3><p className="text-sm text-gray-400">Learning velocity across all curriculums</p></div>
              <div className="flex gap-3 text-xs"><span className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-indigo-600"></div> Maya</span><span className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-emerald-500"></div> Leo</span></div>
            </div>
            <div className="h-64 flex items-end justify-between gap-4">
              {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((day, i) => (
                <div key={day} className="flex flex-col items-center flex-1 h-full justify-end">
                  <div className="flex gap-1 items-end w-full">
                    <div className="bg-indigo-200 w-full rounded-t-lg hover:bg-indigo-500 transition-all" style={{ height: `${[60, 85, 45, 70, 95, 20, 30][i]}%` }}></div>
                    <div className="bg-emerald-200 w-full rounded-t-lg hover:bg-emerald-500 transition-all" style={{ height: `${[40, 30, 90, 55, 45, 15, 20][i]}%` }}></div>
                  </div>
                  <span className="text-[10px] mt-2 text-gray-400 font-medium">{day}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="col-span-12 lg:col-span-4 space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h3 className="text-sm font-bold mb-4 flex items-center gap-2">Next Up</h3>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div className="flex justify-between items-start mb-2"><p className="text-xs font-bold text-indigo-600">TODAY, 16:00</p><span className="text-[10px] px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded uppercase font-semibold">Maya</span></div>
                <h4 className="text-sm font-bold">Physics: Quantum Mechanics</h4>
                <p className="text-xs text-gray-400 mt-1">with Dr. Sarah Miller</p>
                <button className="w-full mt-3 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700">Join Room</button>
              </div>
            </div>
            <div className="bg-indigo-600 rounded-2xl p-6 text-white overflow-hidden relative shadow-sm">
              <div className="relative z-10"><h3 className="text-sm font-bold mb-4 text-indigo-200">Billing & Wallet</h3>
                <div className="mb-4"><p className="text-xs text-indigo-200">Current Balance</p><h4 className="text-2xl font-bold">$1,240.00</h4></div>
                <div className="space-y-3">{[["Maya - 12 Lessons", "$840.00"], ["Leo - 6 Lessons", "$400.00"]].map(([name, amt]) => (<div key={name} className="flex justify-between text-xs text-indigo-200 border-b border-indigo-500 pb-2"><span>{name}</span><span>{amt}</span></div>))}</div>
                <button className="w-full mt-6 bg-white text-indigo-600 py-2.5 rounded-lg font-bold text-sm shadow-lg hover:bg-gray-100 transition-colors">Manage Payment Methods</button>
              </div>
            </div>
          </div>

          <div className="col-span-12 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
              <h3 className="text-xl font-bold">Curriculum Performance</h3>
              <div className="flex gap-4"><select className="bg-transparent border-none text-sm text-gray-400"><option>All Students</option></select><select className="bg-transparent border-none text-sm text-gray-400"><option>Term 3, 2024</option></select></div>
            </div>
            <table className="w-full text-left"><thead><tr className="bg-gray-50 text-xs text-gray-400 uppercase tracking-wider"><th className="px-6 py-3 font-semibold">Subject</th><th className="px-6 py-3 font-semibold">Student</th><th className="px-6 py-3 font-semibold">Status</th><th className="px-6 py-3 font-semibold">Improvement</th><th className="px-6 py-3 font-semibold">Next Milestone</th></tr></thead>
              <tbody className="divide-y divide-gray-50">
                {[{ subject: "Advanced Calculus", student: "Maya Rivers", status: "On Track", color: "bg-emerald-100 text-emerald-700", imp: "+14%", impColor: "text-emerald-600", mile: "Final Exam (Nov 15)" },
                  { subject: "Creative Writing", student: "Leo Rivers", status: "Steady", color: "bg-blue-100 text-blue-700", imp: "+3%", impColor: "text-blue-600", mile: "Short Story Draft (Oct 22)" },
                  { subject: "Astrophysics", student: "Maya Rivers", status: "Attention", color: "bg-red-100 text-red-700", imp: "-5%", impColor: "text-red-600", mile: "Quiz Remediation (Oct 30)" },
                ].map((row) => (<tr key={row.subject} className="hover:bg-gray-50 transition-colors"><td className="px-6 py-4"><p className="font-semibold text-gray-900 text-sm">{row.subject}</p></td><td className="px-6 py-4 text-sm">{row.student}</td><td className="px-6 py-4"><span className={`${row.color} px-3 py-1 rounded-full text-xs font-bold`}>{row.status}</span></td><td className={`px-6 py-4 text-sm font-bold ${row.impColor}`}>{row.imp}</td><td className="px-6 py-4 text-sm text-gray-400">{row.mile}</td></tr>))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
