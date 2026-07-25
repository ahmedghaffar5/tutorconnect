"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Calendar, TrendingUp, DollarSign, Star } from "lucide-react";

const mockChildren = [
  { name: "Maya Rivers", age: "Year 9", subjects: "Calculus & Physics", progress: 85, img: "/images/stitch/parental_oversight_dashboard-0.jpg" },
  { name: "Leo Rivers", age: "Year 5", subjects: "English & Creative Writing", progress: 60, img: "/images/stitch/parental_oversight_dashboard-2.jpg" },
];

export default function ParentDashboard() {
  const router = useRouter();
  const [activeChild, setActiveChild] = useState(0);
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then((res: any) => {
      if (!res?.data?.user) { router.push("/login?redirect=/parent/dashboard"); return; }
      setUser(res.data.user);
    });
  }, []);

  if (!user) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full" /></div>;

  const child = mockChildren[activeChild];

  return (
    <div className="bg-[#f8f9ff] min-h-screen">
      <div className="max-w-[1280px] mx-auto p-6">
        <header className="mb-8">
          <nav className="flex items-center gap-2 text-sm text-gray-400 mb-1"><span>Home</span><span className="opacity-50">/</span><span className="text-indigo-600 font-medium">Parent Dashboard</span></nav>
          <h1 className="text-3xl font-bold text-gray-900">Family Learning Overview</h1>
        </header>

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-8 grid grid-cols-3 gap-4">
            {[
              { label: "Total Hours", value: "184.5", icon: Calendar, color: "bg-indigo-50 text-indigo-600", badge: "+12%" },
              { label: "Grade Average", value: "A-", icon: TrendingUp, color: "bg-emerald-50 text-emerald-600", badge: "Top 5%" },
              { label: "Monthly Billing", value: "$420", icon: DollarSign, color: "bg-amber-50 text-amber-600", badge: "Due in 4d" },
            ].map(s => (
              <div key={s.label} className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-100 flex flex-col justify-between hover:shadow-md transition-all">
                <div className="flex justify-between items-start"><div className={`p-2 ${s.color} rounded-lg`}><s.icon className="h-5 w-5" /></div><span className="text-emerald-600 text-xs font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">{s.badge}</span></div>
                <div className="mt-6"><p className="text-sm text-gray-400">{s.label}</p><h3 className="text-3xl font-bold mt-1 text-gray-900">{s.value}</h3></div>
              </div>
            ))}
          </div>

          <div className="col-span-12 lg:col-span-4 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold mb-6">Active Students</h3>
            <div className="space-y-4">
              {mockChildren.map((c, i) => (
                <button key={c.name} onClick={() => setActiveChild(i)} className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all ${i === activeChild ? "bg-indigo-50" : "hover:bg-gray-50"}`}>
                  <img src={c.img} alt="" className="w-12 h-12 rounded-full object-cover" />
                  <div className="flex-1 text-left"><p className="text-sm font-bold text-gray-900">{c.name}</p><p className="text-xs text-gray-400">{c.age} • {c.subjects}</p></div>
                  {i === activeChild && <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>}
                </button>
              ))}
            </div>
          </div>

          <div className="col-span-12 lg:col-span-8 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold mb-4">{child.name}'s Progress</h3>
            <div className="h-64 flex items-end justify-between gap-4">
              {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((day, i) => (
                <div key={day} className="flex flex-col items-center flex-1 h-full justify-end">
                  <div className="flex gap-1 items-end w-full">
                    <div className="bg-indigo-200 w-full rounded-t-lg hover:bg-indigo-500 transition-all" style={{ height: `${[60,85,45,70,95,20,30][i]}%` }}></div>
                    <div className="bg-emerald-200 w-full rounded-t-lg hover:bg-emerald-500 transition-all" style={{ height: `${[40,30,90,55,45,15,20][i]}%` }}></div>
                  </div>
                  <span className="text-[10px] mt-2 text-gray-400 font-medium">{day}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="col-span-12 lg:col-span-4 bg-indigo-600 rounded-2xl p-6 text-white shadow-sm">
            <h3 className="text-sm font-bold mb-4 text-indigo-200">Billing Summary</h3>
            <p className="text-xs text-indigo-200">Current Balance</p>
            <h4 className="text-2xl font-bold mb-4">$1,240.00</h4>
            <div className="space-y-2 text-sm">{[["Maya - 12 Lessons", "$840.00"], ["Leo - 6 Lessons", "$400.00"]].map(([n,a]) => (<div key={n} className="flex justify-between text-indigo-200 border-b border-indigo-500 pb-1"><span>{n}</span><span>{a}</span></div>))}</div>
            <Link href="/parent/billing" className="block w-full mt-6 bg-white text-indigo-600 py-2.5 rounded-lg font-bold text-sm text-center hover:bg-gray-100">Manage Payments</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
