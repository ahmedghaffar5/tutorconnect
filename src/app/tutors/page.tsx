"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Star, Search, Users, SlidersHorizontal, X } from "lucide-react";

interface Tutor {
  id: string;
  name: string;
  subjects: string[];
  bio: string;
  rate: number;
  experience: number;
  qualification: string;
  languages: string;
  image: string | null;
  rating?: number;
  reviews?: number;
  students?: number;
}

const colorPalette = [
  "bg-primary-fixed text-on-primary-fixed",
  "bg-secondary-container text-on-secondary-container",
  "bg-tertiary-fixed text-on-tertiary-fixed",
  "bg-surface-container-high text-on-surface",
  "bg-primary-fixed-dim text-on-primary-fixed",
];

const allSubjects = [
  "Computer Science", "Mathematics", "English", "Physics", "Chemistry",
  "Biology", "Coding", "Quran", "Urdu", "Arabic", "History", "Science",
];

function TutorsContent() {
  const searchParams = useSearchParams();
  const subjectFilter = searchParams.get("subject");
  const [search, setSearch] = useState("");
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(subjectFilter ? [subjectFilter] : []);
  const [minRating, setMinRating] = useState(0);
  const [priceRange, setPriceRange] = useState(200);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sort, setSort] = useState("recommended");

  useEffect(() => {
    fetch("/api/tutors")
      .then((res) => res.json())
      .then((data) => {
        setTutors(Array.isArray(data) ? data.map((t: Tutor) => ({ ...t, rating: 4.5 + Math.random() * 0.5, reviews: Math.floor(Math.random() * 200) + 20, students: Math.floor(Math.random() * 100) + 10 })) : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const toggleSubject = (s: string) => {
    setSelectedSubjects((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]);
  };

  const getColor = (index: number) => colorPalette[index % colorPalette.length];

  const filtered = tutors.filter((t) => {
    const matchesSearch = !search || t.name.toLowerCase().includes(search.toLowerCase()) || t.subjects.some((s) => s.toLowerCase().includes(search.toLowerCase()));
    const matchesSubject = selectedSubjects.length === 0 || t.subjects.some((s) => selectedSubjects.includes(s));
    const matchesPrice = (t.rate || 0) <= priceRange;
    return matchesSearch && matchesSubject && matchesPrice;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sort === "price-low") return (a.rate || 0) - (b.rate || 0);
    if (sort === "price-high") return (b.rate || 0) - (a.rate || 0);
    if (sort === "rating") return (b.rating || 0) - (a.rating || 0);
    return 0;
  });

  const FilterSidebar = () => (
    <div className="space-y-xl">
      <div>
        <h3 className="font-headline-sm text-[18px] mb-md text-on-surface">Filters</h3>
        <div className="md:hidden mb-lg relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant h-4 w-4" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search tutors or subjects..." className="w-full pl-10 pr-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm" />
        </div>
        <div className="mb-lg">
          <label className="font-label-md block mb-sm text-on-surface-variant uppercase tracking-wider">Subject</label>
          <div className="flex flex-col gap-xs max-h-48 overflow-y-auto">
            {allSubjects.map((s) => (
              <label key={s} className="flex items-center gap-sm cursor-pointer group">
                <input checked={selectedSubjects.includes(s)} onChange={() => toggleSubject(s)} type="checkbox" className="rounded border-outline-variant text-primary focus:ring-primary" />
                <span className="font-body-sm text-on-surface group-hover:text-primary transition-colors">{s}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="mb-lg">
          <label className="font-label-md block mb-sm text-on-surface-variant uppercase tracking-wider">Price Range (Hourly)</label>
          <input type="range" min={10} max={200} step={5} value={priceRange} onChange={(e) => setPriceRange(parseInt(e.target.value))} className="w-full accent-primary" />
          <div className="flex justify-between font-body-sm text-on-surface-variant mt-sm">
            <span>$10</span>
            <span>${priceRange}+</span>
          </div>
        </div>
        <div className="mb-lg">
          <label className="font-label-md block mb-sm text-on-surface-variant uppercase tracking-wider">Minimum Rating</label>
          <div className="flex flex-col gap-xs">
            {[4, 3].map((r) => (
              <label key={r} className="flex items-center gap-sm cursor-pointer group">
                <input checked={minRating === r} onChange={() => setMinRating(minRating === r ? 0 : r)} type="radio" name="rating" className="text-primary focus:ring-primary" />
                <span className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`h-3.5 w-3.5 ${i < r ? "text-tertiary fill-tertiary" : "text-gray-200"}`} />
                  ))}
                  <span className="ml-1 text-on-surface font-body-sm">{r}.0 & Up</span>
                </span>
              </label>
            ))}
          </div>
        </div>
        <div className="mb-lg">
          <label className="font-label-md block mb-sm text-on-surface-variant uppercase tracking-wider">Availability</label>
          <select className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg p-sm font-body-sm outline-none focus:ring-2 focus:ring-primary">
            <option>Anytime</option>
            <option>Weekends</option>
            <option>Weekdays (Evening)</option>
            <option>Morning (Before 12pm)</option>
          </select>
        </div>
      </div>
      <button onClick={() => { setSelectedSubjects([]); setPriceRange(200); setMinRating(0); }} className="w-full py-md bg-primary-container text-on-primary-container rounded-xl font-bold hover:brightness-95 transition-all">
        Clear All Filters
      </button>
    </div>
  );

  return (
    <div className="bg-background text-on-surface min-h-screen">
      <div className="max-w-container-max mx-auto flex flex-col md:flex-row min-h-[calc(100vh-64px)]">
        <aside className="hidden md:block w-80 bg-surface-container-low p-lg border-r border-outline-variant flex-shrink-0">
          <FilterSidebar />
        </aside>

        <main className="flex-1 p-lg md:p-2xl bg-background overflow-y-auto">
          <div className="mb-2xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-lg mb-xl">
              <div>
                <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface mb-2">Discover Expert Tutors</h1>
                <p className="font-body-lg text-on-surface-variant max-w-2xl">Connect with the top educators in your field.</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-md bg-surface-container-lowest p-sm rounded-2xl shadow-sm border border-outline-variant/30">
              <div className="flex-1 flex items-center px-md border-r border-outline-variant">
                <Search className="h-5 w-5 text-primary mr-sm" />
                <input value={search} onChange={(e) => setSearch(e.target.value)} className="w-full py-2 bg-transparent border-none focus:ring-0 outline-none font-body-md" placeholder="What do you want to learn today?" />
              </div>
              <button className="bg-primary text-on-primary px-xl py-md rounded-xl font-bold shadow-lg hover:scale-105 transition-all">Search Now</button>
            </div>
          </div>

          <div className="flex items-center justify-between mb-lg flex-wrap gap-sm">
            <div className="flex items-center gap-sm">
              <button onClick={() => setSidebarOpen(true)} className="md:hidden flex items-center gap-1.5 px-3 py-2 border border-outline-variant rounded-lg font-label-sm">
                <SlidersHorizontal className="h-4 w-4" /> Filters
              </button>
              <p className="font-label-md text-on-surface-variant">
                {loading ? "Loading..." : `Showing ${sorted.length} result${sorted.length !== 1 ? "s" : ""}`}
              </p>
            </div>
            <div className="flex items-center gap-sm">
              <span className="font-body-sm text-on-surface-variant">Sort by:</span>
              <select value={sort} onChange={(e) => setSort(e.target.value)} className="bg-transparent border-none text-on-surface font-bold focus:ring-0 cursor-pointer text-sm">
                <option value="recommended">Most Recommended</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Rating: High to Low</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
              <p className="text-on-surface-variant mt-4">Loading tutors...</p>
            </div>
          ) : sorted.length === 0 ? (
            <div className="text-center py-20">
              <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-on-surface-variant text-lg">No tutors found</p>
              <button onClick={() => { setSelectedSubjects([]); setSearch(""); setPriceRange(200); }} className="mt-4 text-primary font-medium hover:underline">Clear filters</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-lg">
              {sorted.map((tutor, idx) => (
                <div key={tutor.id} className="glass-card rounded-2xl p-md flex flex-col hover:shadow-lg transition-all group" style={{ animationDelay: `${idx * 0.1}s` }}>
                  <div className="flex gap-md mb-md">
                    <div className="relative flex-shrink-0">
                      <img src={`/images/stitch/tutor_search_discovery-${idx % 6}.jpg`} alt={tutor.name}
                        className="w-20 h-20 rounded-full border-2 border-white shadow-sm object-cover"
                        onError={(e) => { (e.target as HTMLElement).style.display = 'none'; (e.target as HTMLElement).nextElementSibling?.classList.remove('hidden') }} />
                      <div className={`hidden w-20 h-20 rounded-full ${getColor(idx)} items-center justify-center border-2 border-white shadow-sm text-lg font-bold absolute inset-0`}>
                        {tutor.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                      </div>
                      <div className="absolute bottom-0 right-0 w-5 h-5 bg-secondary border-2 border-white rounded-full"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h3 className="font-headline-sm text-[20px] text-on-surface truncate">{tutor.name}</h3>
                        <span className="text-primary font-bold text-lg">${tutor.rate}<span className="text-on-surface-variant font-normal text-sm">/hr</span></span>
                      </div>
                      <p className="text-secondary font-label-md mb-1">{tutor.subjects.join(", ")}</p>
                      <div className="flex items-center gap-xs">
                        <Star className="h-4 w-4 text-tertiary fill-tertiary" />
                        <span className="text-on-surface font-bold text-sm">{tutor.rating?.toFixed(1)}</span>
                        <span className="text-on-surface-variant text-xs">({tutor.reviews} reviews)</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-on-surface-variant font-body-sm line-clamp-3 mb-lg flex-1">{tutor.bio}</p>
                  <div className="flex items-center justify-between mt-auto pt-md border-t border-outline-variant/30">
                    <div className="flex gap-md">
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase text-on-surface-variant tracking-widest">Students</span>
                        <span className="font-bold text-sm">{tutor.students}+</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase text-on-surface-variant tracking-widest">Experience</span>
                        <span className="font-bold text-sm">{tutor.experience} yrs</span>
                      </div>
                    </div>
                    <Link href={`/tutors/${tutor.id}`} className="bg-primary-container text-on-primary-container px-lg py-sm rounded-lg font-bold group-hover:bg-primary group-hover:text-on-primary transition-all">
                      View Profile
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {sorted.length > 6 && (
            <div className="mt-2xl flex justify-center items-center gap-md">
              <button className="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center hover:bg-surface-container transition-colors">
                <span>←</span>
              </button>
              <div className="flex gap-sm">
                <button className="w-10 h-10 rounded-full bg-primary text-on-primary font-bold">1</button>
                <button className="w-10 h-10 rounded-full border border-outline-variant hover:bg-surface-container transition-colors">2</button>
                <button className="w-10 h-10 rounded-full border border-outline-variant hover:bg-surface-container transition-colors">3</button>
              </div>
              <button className="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center hover:bg-surface-container transition-colors">
                <span>→</span>
              </button>
            </div>
          )}
        </main>
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-80 bg-surface-container-low p-lg overflow-y-auto">
            <div className="flex justify-between items-center mb-lg">
              <h3 className="font-headline-sm">Filters</h3>
              <button onClick={() => setSidebarOpen(false)}><X className="h-5 w-5" /></button>
            </div>
            <FilterSidebar />
          </div>
        </div>
      )}
    </div>
  );
}

export default function TutorsPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-gray-500">Loading...</div>}>
      <TutorsContent />
    </Suspense>
  );
}
