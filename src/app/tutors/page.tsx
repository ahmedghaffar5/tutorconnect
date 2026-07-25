"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Star, Search, SlidersHorizontal, X, ChevronLeft, ChevronRight } from "lucide-react";

interface Tutor {
  id: string; name: string; subjects: string[]; bio: string; rate: number;
  experience: number; rating?: number; reviews?: number; students?: number;
}

const allSubjects = ["Computer Science", "Mathematics", "English Literature", "Physics & Astronomy", "Digital Marketing"];
const tutorImages = ["/images/stitch/tutor_search_discovery-0.jpg","/images/stitch/tutor_search_discovery-1.jpg","/images/stitch/tutor_search_discovery-2.jpg","/images/stitch/tutor_search_discovery-3.jpg","/images/stitch/tutor_search_discovery-4.jpg","/images/stitch/tutor_search_discovery-5.jpg"];

function TutorsContent() {
  const params = useSearchParams();
  const [search, setSearch] = useState("");
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(true);
  const [subjects, setSubjects] = useState<string[]>(params.get("subject") ? [params.get("subject")!] : []);
  const [priceRange, setPriceRange] = useState(200);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sort, setSort] = useState("recommended");

  useEffect(() => {
    fetch("/api/tutors").then(r => r.json()).then(data => {
      setTutors(Array.isArray(data) ? data.map((t: Tutor) => ({ ...t, rating: 4.5 + Math.random() * 0.5, reviews: Math.floor(Math.random() * 200) + 20, students: Math.floor(Math.random() * 100) + 10 })) : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const toggleSubject = (s: string) => setSubjects(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s]);

  const filtered = tutors.filter(t => {
    const ms = !search || t.name.toLowerCase().includes(search.toLowerCase()) || t.subjects.some(s => s.toLowerCase().includes(search.toLowerCase()));
    const msub = subjects.length === 0 || t.subjects.some(s => subjects.includes(s));
    return ms && msub && (t.rate || 0) <= priceRange;
  }).sort((a, b) => sort === "price-low" ? (a.rate||0) - (b.rate||0) : sort === "price-high" ? (b.rate||0) - (a.rate||0) : sort === "rating" ? (b.rating||0) - (a.rating||0) : 0);

  const FilterSidebar = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
        <div className="md:hidden mb-4 relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tutors or subjects..." className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:ring-2 focus:ring-indigo-400" />
        </div>
        <div className="mb-6"><label className="text-xs text-gray-400 uppercase tracking-wider font-semibold block mb-2">Subject</label>
          <div className="flex flex-col gap-2">{allSubjects.map(s => (
            <label key={s} className="flex items-center gap-2 cursor-pointer group"><input checked={subjects.includes(s)} onChange={() => toggleSubject(s)} type="checkbox" className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-400" /><span className="text-sm text-gray-600 group-hover:text-indigo-600 transition-colors">{s}</span></label>
          ))}</div>
        </div>
        <div className="mb-6"><label className="text-xs text-gray-400 uppercase tracking-wider font-semibold block mb-2">Price Range (Hourly)</label>
          <input type="range" min={10} max={200} step={5} value={priceRange} onChange={e => setPriceRange(parseInt(e.target.value))} className="w-full accent-indigo-600" />
          <div className="flex justify-between text-sm text-gray-400 mt-1"><span>$10</span><span>${priceRange}+</span></div>
        </div>
        <div className="mb-6"><label className="text-xs text-gray-400 uppercase tracking-wider font-semibold block mb-2">Minimum Rating</label>
          <div className="flex flex-col gap-2">
            {[4, 3].map(r => (<label key={r} className="flex items-center gap-2 cursor-pointer"><input type="radio" name="rating" className="text-indigo-600 focus:ring-indigo-400" /><span className="flex items-center gap-0.5">{Array.from({length:5}).map((_,i) => (<Star key={i} className={`h-3.5 w-3.5 ${i < r ? "text-amber-400 fill-amber-400" : "text-gray-200"}`} />))}<span className="ml-1 text-sm text-gray-600">{r}.0 & Up</span></span></label>))}
          </div>
        </div>
        <div className="mb-6"><label className="text-xs text-gray-400 uppercase tracking-wider font-semibold block mb-2">Availability</label>
          <select className="w-full bg-white border border-gray-200 rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400"><option>Anytime</option><option>Weekends</option><option>Weekdays (Evening)</option><option>Morning (Before 12pm)</option></select>
        </div>
      </div>
      <button onClick={() => {setSubjects([]); setPriceRange(200)}} className="w-full py-3 bg-indigo-50 text-indigo-600 rounded-xl font-bold text-sm hover:bg-indigo-100 transition-all">Clear All Filters</button>
    </div>
  );

  return (
    <div className="bg-[#f8f9ff] min-h-screen">
      <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row min-h-[calc(100vh-64px)]">
        <aside className="hidden md:block w-80 bg-[#eff4ff] p-6 border-r border-[#c7c4d8] flex-shrink-0"><FilterSidebar /></aside>
        <main className="flex-1 p-6 md:p-8 bg-[#f8f9ff] overflow-y-auto">
          <div className="mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div><h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Discover Expert Tutors</h1><p className="text-base text-gray-500 max-w-2xl">Connect with the top educators in your field.</p></div>
            </div>
            <div className="hidden md:flex items-center gap-3 bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100/50">
              <div className="flex-1 flex items-center px-4 border-r border-gray-200"><Search className="h-5 w-5 text-indigo-600 mr-2" /><input value={search} onChange={e => setSearch(e.target.value)} className="w-full py-2.5 bg-transparent border-none outline-none text-sm" placeholder="What do you want to learn today?" /></div>
              <button className="bg-indigo-600 text-white px-8 py-2.5 rounded-xl font-bold shadow-lg hover:scale-105 transition-all text-sm">Search Now</button>
            </div>
          </div>

          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <div className="flex items-center gap-2"><button onClick={() => setSidebarOpen(true)} className="md:hidden flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-lg text-sm"><SlidersHorizontal className="h-4 w-4" /> Filters</button><p className="text-sm text-gray-500">{loading ? "Loading..." : `Showing ${filtered.length} results`}</p></div>
            <div className="flex items-center gap-2"><span className="text-sm text-gray-400">Sort by:</span><select value={sort} onChange={e => setSort(e.target.value)} className="bg-transparent border-none text-gray-900 font-bold text-sm focus:ring-0 cursor-pointer"><option value="recommended">Most Recommended</option><option value="price-low">Price: Low to High</option><option value="price-high">Price: High to Low</option><option value="rating">Rating: High to Low</option></select></div>
          </div>

          {loading ? <div className="text-center py-20"><div className="animate-spin h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto"></div><p className="text-gray-400 mt-4">Loading tutors...</p></div> :
          filtered.length === 0 ? <div className="text-center py-20"><p className="text-gray-400 text-lg">No tutors found</p><button onClick={() => {setSubjects([]); setSearch(""); setPriceRange(200)}} className="mt-4 text-indigo-600 font-medium hover:underline text-sm">Clear filters</button></div> :
          <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
            {filtered.map((tutor, idx) => (
              <div key={tutor.id} className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 flex flex-col hover:shadow-lg transition-all border border-gray-100/50" style={{animationDelay: `${idx * 0.1}s`}}>
                <div className="flex gap-4 mb-4">
                  <div className="relative flex-shrink-0">
                    <img src={tutorImages[idx % 6]} alt={tutor.name} className="w-20 h-20 rounded-full object-cover border-2 border-white shadow-sm" />
                    <div className="absolute bottom-0 right-0 w-5 h-5 bg-emerald-500 border-2 border-white rounded-full"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start"><h3 className="text-lg font-semibold text-gray-900 truncate">{tutor.name}</h3><span className="text-indigo-600 font-bold text-lg">${tutor.rate}<span className="text-gray-400 font-normal text-sm">/hr</span></span></div>
                    <p className="text-emerald-600 text-sm font-medium mb-1">{tutor.subjects.slice(0, 2).join(", ")}</p>
                    <div className="flex items-center gap-1"><Star className="h-4 w-4 text-amber-400 fill-amber-400" /><span className="font-bold text-sm">{tutor.rating?.toFixed(1)}</span><span className="text-xs text-gray-400">({tutor.reviews} reviews)</span></div>
                  </div>
                </div>
                <p className="text-sm text-gray-500 line-clamp-3 mb-4 flex-1">{tutor.bio || "Experienced tutor ready to help you achieve your academic goals."}</p>
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex gap-4"><div className="flex flex-col"><span className="text-[10px] uppercase text-gray-400 tracking-widest font-medium">Students</span><span className="font-bold text-sm">{tutor.students}+</span></div><div className="flex flex-col"><span className="text-[10px] uppercase text-gray-400 tracking-widest font-medium">Experience</span><span className="font-bold text-sm">{tutor.experience} yrs</span></div></div>
                  <Link href={`/tutors/${tutor.id}`} className="bg-indigo-50 text-indigo-600 px-5 py-2 rounded-lg font-bold text-sm hover:bg-indigo-600 hover:text-white transition-all">View Profile</Link>
                </div>
              </div>
            ))}
            {filtered.length === 0 && <div className="text-center py-20 col-span-full"><p className="text-gray-400 text-lg">No tutors found</p></div>}
          </div>}

          {filtered.length > 6 && <div className="mt-8 flex justify-center items-center gap-3"><button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-100"><ChevronLeft className="h-4 w-4" /></button><div className="flex gap-2"><button className="w-10 h-10 rounded-full bg-indigo-600 text-white font-bold text-sm">1</button><button className="w-10 h-10 rounded-full border border-gray-200 hover:bg-gray-100 text-sm">2</button><button className="w-10 h-10 rounded-full border border-gray-200 hover:bg-gray-100 text-sm">3</button></div><button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-100"><ChevronRight className="h-4 w-4" /></button></div>}
        </main>
      </div>
      {sidebarOpen && <div className="fixed inset-0 z-50 md:hidden"><div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} /><div className="absolute left-0 top-0 bottom-0 w-80 bg-[#eff4ff] p-6 overflow-y-auto"><div className="flex justify-between items-center mb-4"><h3 className="text-lg font-semibold">Filters</h3><button onClick={() => setSidebarOpen(false)}><X className="h-5 w-5" /></button></div><FilterSidebar /></div></div>}
    </div>
  );
}

export default function TutorsPage() {
  return <Suspense fallback={<div className="py-20 text-center text-gray-400 text-sm">Loading...</div>}><TutorsContent /></Suspense>;
}
