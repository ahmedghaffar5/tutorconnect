import Link from "next/link";
import { Search, Star, Download } from "lucide-react";

const resources = [
  { title: "Calculus Cheat Sheet", category: "Mathematics", rating: 4.8, downloads: 1240, badge: "STEM", img: "/images/stitch/resources_study_hub-0.jpg" },
  { title: "Python for Beginners", category: "Coding", rating: 4.9, downloads: 2100, badge: "STEM", img: "/images/stitch/resources_study_hub-1.jpg" },
  { title: "Essay Writing Guide", category: "English", rating: 4.7, downloads: 890, badge: "Humanities", img: "/images/stitch/resources_study_hub-2.jpg" },
  { title: "Physics Formula Sheet", category: "Physics", rating: 4.6, downloads: 1500, badge: "STEM" },
  { title: "SAT Prep Pack", category: "Exam Prep", rating: 4.8, downloads: 3200, badge: "Exam Prep" },
  { title: "Quran Tajweed Rules", category: "Quran", rating: 5.0, downloads: 560, badge: "Quran" },
];

const topTutors = [
  { name: "Dr. Sarah Chen", subject: "Mathematics", students: 128, img: "/images/stitch/tutor_search_discovery-0.jpg" },
  { name: "James Wilson", subject: "Computer Science", students: 95, img: "/images/stitch/tutor_search_discovery-1.jpg" },
  { name: "Elena Rodriguez", subject: "Languages", students: 210, img: "/images/stitch/tutor_search_discovery-2.jpg" },
];

export default function ResourcesPage() {
  return (
    <div className="bg-[#f8f9ff] min-h-screen">
      <div className="bg-indigo-50 py-16">
        <div className="max-w-[1280px] mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Study Resources Hub</h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-8">Access thousands of study materials curated by expert tutors.</p>
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 bg-white text-sm outline-none focus:ring-2 focus:ring-indigo-400 shadow-lg" placeholder="Search for study materials, cheat sheets, guides..." />
          </div>
        </div>
      </div>
      <div className="max-w-[1280px] mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-24 shadow-sm">
              <h3 className="text-xl font-bold mb-6">Top Contributors</h3>
              <div className="space-y-4">
                {topTutors.map((t, i) => (
                  <div key={t.name} className="flex items-center gap-3">
                    <span className="text-sm text-gray-400 w-5 font-bold">{i + 1}</span>
                    <img src={t.img} alt="" className="w-10 h-10 rounded-full object-cover" />
                    <div className="flex-1"><p className="text-sm font-bold text-gray-900">{t.name}</p><p className="text-xs text-gray-400">{t.subject} • {t.students} students</p></div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-6 py-3 text-indigo-600 border border-indigo-600 rounded-lg font-semibold text-sm hover:bg-indigo-50 transition-colors">Become a Contributor</button>
            </div>
          </div>
          <div className="lg:col-span-9">
            <div className="flex flex-wrap gap-2 mb-6">
              {["All Resources", "STEM", "Humanities", "Exam Prep", "Graduate Level"].map((c) => (
                <button key={c} className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${c === "All Resources" ? "bg-indigo-600 text-white border-indigo-600" : "border-gray-200 text-gray-500 hover:border-indigo-400 hover:text-indigo-600"}`}>{c}</button>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resources.map((r) => (
                <div key={r.title} className="bg-white rounded-2xl overflow-hidden hover:shadow-lg transition-all border border-gray-100">
                  <div className="h-32 bg-gradient-to-br from-indigo-50 to-emerald-50 flex items-center justify-center relative">
                    {r.img ? <img src={r.img} alt="" className="w-full h-full object-cover" /> : <span className="text-4xl">📚</span>}
                    <div className="absolute top-3 right-3"><span className="px-2 py-1 bg-white/90 text-xs font-semibold rounded-full">{r.badge}</span></div>
                  </div>
                  <div className="p-5"><h3 className="text-sm font-bold mb-1 text-gray-900">{r.title}</h3><p className="text-xs text-gray-400 mb-4">{r.category}</p>
                    <div className="flex items-center justify-between"><div className="flex items-center gap-1"><Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" /><span className="text-xs font-medium">{r.rating}</span><span className="text-xs text-gray-400">({r.downloads})</span></div><button className="p-2 rounded-lg hover:bg-gray-50 text-gray-400 hover:text-indigo-600"><Download className="h-4 w-4" /></button></div>
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
