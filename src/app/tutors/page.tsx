"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Star, Users, Search, Filter } from "lucide-react";

const departments = [
  { id: "all", name: "All Departments", icon: "🏫" },
  { id: "quran", name: "Quran & Islamic", icon: "📖" },
  { id: "languages", name: "Languages", icon: "🌐" },
  { id: "stem", name: "STEM", icon: "🔬" },
  { id: "coding", name: "Coding & Tech", icon: "💻" },
  { id: "humanities", name: "Humanities", icon: "📚" },
];

const deptSubjects: Record<string, string[]> = {
  quran: ["Quran", "Arabic", "Islamic Studies"],
  languages: ["English", "Urdu", "Arabic"],
  stem: ["Mathematics", "Physics", "Chemistry", "Biology", "Science", "Computer Science"],
  coding: ["Coding", "Computer Science", "Web Development", "Python", "JavaScript"],
  humanities: ["Urdu", "English", "History", "Geography"],
};

const tutors = [
  { id: "1", name: "Dr. Sarah Ahmed", subjects: ["Quran", "Arabic"], rate: 30, rating: 5, reviews: 24, bio: "PhD Islamic Studies. Quran recitation, Tajweed & memorization.", exp: 10, color: "bg-emerald-100 text-emerald-600" },
  { id: "2", name: "Prof. John Smith", subjects: ["Mathematics"], rate: 35, rating: 5, reviews: 18, bio: "Professor making math easy. Algebra, Calculus & Statistics.", exp: 15, color: "bg-red-100 text-red-600" },
  { id: "3", name: "Ms. Aisha Khan", subjects: ["English", "Urdu"], rate: 25, rating: 4, reviews: 15, bio: "MA English Lit. Writing, grammar & exam prep.", exp: 8, color: "bg-purple-100 text-purple-600" },
  { id: "4", name: "Dr. Ahmed Raza", subjects: ["Physics", "Chemistry"], rate: 35, rating: 5, reviews: 20, bio: "PhD Physics. Making science crystal clear.", exp: 12, color: "bg-cyan-100 text-cyan-600" },
  { id: "5", name: "Mr. David Chen", subjects: ["Coding", "Computer Science", "Python", "JavaScript"], rate: 40, rating: 5, reviews: 22, bio: "Full-stack dev. Python, JS & Web Dev since 2016.", exp: 9, color: "bg-indigo-100 text-indigo-600" },
  { id: "6", name: "Hafiz Abdullah", subjects: ["Quran", "Arabic"], rate: 25, rating: 5, reviews: 30, bio: "Hafiz-e-Quran. Tajweed & Hifz expert.", exp: 7, color: "bg-green-100 text-green-600" },
  { id: "7", name: "Dr. Fatima Alvi", subjects: ["Biology", "Science"], rate: 30, rating: 4, reviews: 16, bio: "PhD Molecular Biology. Making biology fascinating.", exp: 11, color: "bg-lime-100 text-lime-600" },
  { id: "8", name: "Mr. Usman Malik", subjects: ["Urdu", "English"], rate: 20, rating: 4, reviews: 12, bio: "MA Urdu Literature. Poetry & creative writing.", exp: 6, color: "bg-amber-100 text-amber-600" },
  { id: "9", name: "Dr. Maria Khan", subjects: ["Chemistry"], rate: 35, rating: 5, reviews: 19, bio: "PhD Organic Chemistry. Making chemistry easy.", exp: 13, color: "bg-rose-100 text-rose-600" },
  { id: "10", name: "Prof. Ali Hassan", subjects: ["Mathematics", "Physics"], rate: 38, rating: 5, reviews: 25, bio: "Professor. Dual expertise. Conceptual teaching.", exp: 16, color: "bg-blue-100 text-blue-600" },
  { id: "11", name: "Ms. Sara John", subjects: ["Computer Science", "Coding", "Web Development"], rate: 35, rating: 4, reviews: 14, bio: "Software engineer. DSA, Web Dev & more.", exp: 8, color: "bg-violet-100 text-violet-600" },
  { id: "12", name: "Mr. Raza Haider", subjects: ["Science", "Biology"], rate: 22, rating: 4, reviews: 11, bio: "MSc Environmental Science. Fun experiments.", exp: 5, color: "bg-teal-100 text-teal-600" },
  { id: "13", name: "Dr. Noor Ali", subjects: ["Islamic Studies", "Arabic"], rate: 28, rating: 5, reviews: 17, bio: "PhD Islamic Studies. Quran & Hadith.", exp: 14, color: "bg-orange-100 text-orange-600" },
  { id: "14", name: "Prof. Emma Wilson", subjects: ["English", "History"], rate: 30, rating: 4, reviews: 13, bio: "Professor of English & History. Essay writing.", exp: 12, color: "bg-pink-100 text-pink-600" },
];

function TutorsContent() {
  const searchParams = useSearchParams();
  const subjectFilter = searchParams.get("subject");
  const [dept, setDept] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = tutors.filter((t) => {
    const matchesSearch = !search || t.name.toLowerCase().includes(search.toLowerCase()) || t.subjects.some((s) => s.toLowerCase().includes(search.toLowerCase()));
    const matchesDept = dept === "all" || t.subjects.some((s) => (deptSubjects[dept] || []).includes(s));
    const matchesSubject = !subjectFilter || t.subjects.some((s) => s.toLowerCase().includes(subjectFilter.toLowerCase()));
    return matchesSearch && matchesDept && matchesSubject;
  });

  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <span className="text-blue-600 font-semibold text-sm tracking-wide uppercase">Our Teachers</span>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">Find Your Perfect Teacher</h1>
          <p className="mt-2 text-gray-500">{filtered.length} teacher{filtered.length !== 1 ? "s" : ""} available</p>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or subject..." className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none bg-white" />
          </div>
        </div>

        {/* Department Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {departments.map((d) => (
            <button key={d.id} onClick={() => setDept(d.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                dept === d.id ? "bg-blue-600 text-white shadow-md" : "bg-white text-gray-600 border border-gray-200 hover:border-blue-300 hover:text-blue-600"
              }`}
            >
              <span>{d.icon}</span> {d.name}
            </button>
          ))}
        </div>

        {/* Tutors Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No teachers found</p>
            <button onClick={() => { setDept("all"); setSearch(""); }} className="mt-4 text-blue-600 font-medium hover:underline">Clear filters</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((tutor) => (
              <div key={tutor.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-blue-100 transition-all overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-full ${tutor.color} flex items-center justify-center flex-shrink-0`}>
                      <span className="text-lg font-bold">{tutor.name.split(" ").map((n) => n[0]).join("")}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-gray-900 truncate">{tutor.name}</h3>
                      <p className="text-sm text-blue-600 font-medium truncate">{tutor.subjects.join(", ")}</p>
                    </div>
                  </div>
                  <p className="mt-3 text-gray-500 text-sm leading-relaxed line-clamp-2">{tutor.bio}</p>
                  <div className="mt-4 flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`h-4 w-4 ${i < tutor.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200"}`} />
                        ))}
                      </div>
                      <span className="text-gray-400">({tutor.reviews})</span>
                    </div>
                    <span className="text-gray-400">{tutor.exp} yrs</span>
                  </div>
                  <div className="mt-3 text-lg font-bold text-gray-900">
                    ${tutor.rate}<span className="text-sm font-normal text-gray-400">/hr</span>
                  </div>
                </div>
                <div className="px-6 pb-6 flex gap-3">
                  <Link href={`/tutors/${tutor.id}`} className="flex-1 text-center py-2.5 border-2 border-gray-200 rounded-xl font-medium text-gray-700 hover:border-blue-600 hover:text-blue-600 transition-colors text-sm">
                    View Profile
                  </Link>
                  <Link href={`/book-trial?tutor=${tutor.id}&subject=${tutor.subjects[0].toLowerCase()}`} className="flex-1 text-center py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors text-sm">
                    Book Trial
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
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
