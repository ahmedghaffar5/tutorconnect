import Link from "next/link";
import { Search, Star, Download, Lock, ArrowRight } from "lucide-react";

const resources = [
  { title: "Calculus Cheat Sheet", category: "Mathematics", rating: 4.8, downloads: 1240, badge: "STEM" },
  { title: "Python for Beginners", category: "Coding", rating: 4.9, downloads: 2100, badge: "STEM" },
  { title: "Essay Writing Guide", category: "English", rating: 4.7, downloads: 890, badge: "Humanities" },
  { title: "Quran Tajweed Rules", category: "Quran", rating: 5.0, downloads: 560, badge: "Quran" },
  { title: "Physics Formula Sheet", category: "Physics", rating: 4.6, downloads: 1500, badge: "STEM" },
  { title: "SAT Prep Pack", category: "Exam Prep", rating: 4.8, downloads: 3200, badge: "Exam Prep" },
];

const topTutors = [
  { name: "Dr. Sarah Chen", subject: "Mathematics", students: 128, color: "bg-primary-fixed text-on-primary-fixed" },
  { name: "James Wilson", subject: "Computer Science", students: 95, color: "bg-secondary-container text-on-secondary-container" },
  { name: "Elena Rodriguez", subject: "Languages", students: 210, color: "bg-tertiary-fixed text-on-tertiary-fixed" },
];

export default function ResourcesPage() {
  return (
    <div className="bg-background min-h-screen">
      <div className="bg-primary-container/10 py-3xl">
        <div className="max-w-container-max mx-auto px-lg text-center">
          <h1 className="font-display-lg mb-md">Study Resources Hub</h1>
          <p className="font-body-lg text-on-surface-variant max-w-2xl mx-auto mb-xl">Access thousands of study materials curated by expert tutors.</p>
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-on-surface-variant" />
            <input className="w-full pl-12 pr-4 py-4 rounded-2xl border border-outline-variant bg-surface text-sm outline-none focus:ring-2 focus:ring-primary shadow-lg" placeholder="Search for study materials, cheat sheets, guides..." />
          </div>
        </div>
      </div>
      <div className="max-w-container-max mx-auto px-lg py-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-xl">
          <div className="lg:col-span-3">
            <div className="bg-surface rounded-2xl border border-outline-variant p-xl sticky top-24">
              <h3 className="font-headline-sm mb-lg">Top Contributors</h3>
              <div className="space-y-md">
                {topTutors.map((t, i) => (
                  <div key={t.name} className="flex items-center gap-md">
                    <span className="font-label-md text-on-surface-variant w-5">{i + 1}</span>
                    <div className={`w-10 h-10 rounded-full ${t.color} flex items-center justify-center text-sm font-bold`}>{t.name.split(" ").map((n) => n[0]).join("")}</div>
                    <div className="flex-1"><p className="font-label-md font-bold text-sm">{t.name}</p><p className="font-label-sm text-on-surface-variant">{t.subject} • {t.students} students</p></div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-lg py-md text-primary border border-primary rounded-lg font-label-md hover:bg-primary-fixed transition-colors">Become a Contributor</button>
            </div>
          </div>
          <div className="lg:col-span-9">
            <div className="flex flex-wrap gap-sm mb-xl">
              {["All Resources", "STEM", "Humanities", "Exam Prep", "Graduate Level"].map((c) => (
                <button key={c} className={`px-lg py-sm rounded-full font-label-sm border transition-colors ${c === "All Resources" ? "bg-primary text-on-primary border-primary" : "border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary"}`}>{c}</button>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
              {resources.map((r) => (
                <div key={r.title} className="glass-card rounded-2xl overflow-hidden group hover:shadow-lg transition-all">
                  <div className="h-32 bg-gradient-to-br from-primary-container/20 to-secondary-container/20 flex items-center justify-center relative">
                    <span className="text-4xl">📚</span>
                    <div className="absolute top-3 right-3"><span className="px-2 py-1 bg-surface/80 rounded-full text-[10px] font-bold">{r.badge}</span></div>
                  </div>
                  <div className="p-md">
                    <h3 className="font-label-md font-bold mb-1">{r.title}</h3>
                    <p className="font-label-sm text-on-surface-variant mb-md">{r.category}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1"><Star className="h-3.5 w-3.5 text-tertiary fill-tertiary" /><span className="font-label-sm">{r.rating}</span><span className="font-label-sm text-on-surface-variant">({r.downloads})</span></div>
                      <button className="p-2 rounded-lg hover:bg-surface-container-low text-on-surface-variant hover:text-primary"><Download className="h-4 w-4" /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
