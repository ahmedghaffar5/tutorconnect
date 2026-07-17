"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Star, Users, BookOpen, ArrowLeft } from "lucide-react";

interface Tutor {
  id: string;
  name: string;
  subjects: string[];
  subjectSlugs: string[];
  bio: string;
  rating: number;
  reviews: number;
  rate: number;
  experience: number;
  color: string;
}

const tutors: Tutor[] = [
  { id: "1", name: "Dr. Sarah Ahmed", subjects: ["Quran & Arabic"], subjectSlugs: ["quran"], bio: "PhD in Islamic Studies with 10+ years of experience. Specializing in Quran recitation, Tajweed, and memorization.", rating: 5, reviews: 24, rate: 30, experience: 10, color: "bg-emerald-100 text-emerald-600" },
  { id: "2", name: "Prof. John Smith", subjects: ["Mathematics"], subjectSlugs: ["mathematics"], bio: "Professor of Mathematics with expertise in Algebra, Calculus, and Statistics.", rating: 5, reviews: 18, rate: 35, experience: 15, color: "bg-red-100 text-red-600" },
  { id: "3", name: "Ms. Aisha Khan", subjects: ["English", "Urdu"], subjectSlugs: ["english", "urdu"], bio: "Masters in English Literature. Expert in writing, grammar, and exam preparation.", rating: 4, reviews: 15, rate: 25, experience: 8, color: "bg-purple-100 text-purple-600" },
  { id: "4", name: "Dr. Ahmed Raza", subjects: ["Physics", "Chemistry"], subjectSlugs: ["physics", "chemistry"], bio: "PhD in Physics. Making science concepts crystal clear with practical examples.", rating: 5, reviews: 20, rate: 35, experience: 12, color: "bg-cyan-100 text-cyan-600" },
  { id: "5", name: "Mr. David Chen", subjects: ["Coding", "Computer Science"], subjectSlugs: ["coding", "computer-science"], bio: "Full-stack developer teaching Python, JavaScript, and Web Development since 2016.", rating: 5, reviews: 22, rate: 40, experience: 9, color: "bg-indigo-100 text-indigo-600" },
  { id: "6", name: "Hafiz Abdullah", subjects: ["Quran"], subjectSlugs: ["quran"], bio: "Hafiz-e-Quran with Ijazah in Hafs. Expert in Tajweed rules and Quran memorization techniques.", rating: 5, reviews: 30, rate: 25, experience: 7, color: "bg-green-100 text-green-600" },
  { id: "7", name: "Dr. Fatima Alvi", subjects: ["Biology", "Science"], subjectSlugs: ["biology", "science"], bio: "PhD in Molecular Biology. Making biology fascinating with real-world examples and visual aids.", rating: 4, reviews: 16, rate: 30, experience: 11, color: "bg-lime-100 text-lime-600" },
  { id: "8", name: "Mr. Usman Malik", subjects: ["Urdu", "English"], subjectSlugs: ["urdu", "english"], bio: "MA Urdu Literature. Specializing in Urdu poetry, prose, and creative writing techniques.", rating: 4, reviews: 12, rate: 20, experience: 6, color: "bg-amber-100 text-amber-600" },
  { id: "9", name: "Dr. Maria Khan", subjects: ["Chemistry"], subjectSlugs: ["chemistry"], bio: "PhD in Organic Chemistry. Expert in making complex chemical reactions easy to understand.", rating: 5, reviews: 19, rate: 35, experience: 13, color: "bg-rose-100 text-rose-600" },
  { id: "10", name: "Prof. Ali Hassan", subjects: ["Mathematics", "Physics"], subjectSlugs: ["mathematics", "physics"], bio: "Professor with dual expertise in Mathematics and Physics. Known for conceptual teaching.", rating: 5, reviews: 25, rate: 38, experience: 16, color: "bg-blue-100 text-blue-600" },
  { id: "11", name: "Ms. Sara John", subjects: ["Computer Science", "Coding"], subjectSlugs: ["computer-science", "coding"], bio: "Software engineer turned teacher. Expert in Data Structures, Algorithms, and Web Dev.", rating: 4, reviews: 14, rate: 35, experience: 8, color: "bg-violet-100 text-violet-600" },
  { id: "12", name: "Mr. Raza Haider", subjects: ["Science", "Biology"], subjectSlugs: ["science", "biology"], bio: "MSc in Environmental Science. Making science fun with experiments and practical learning.", rating: 4, reviews: 11, rate: 22, experience: 5, color: "bg-teal-100 text-teal-600" },
];

const subjectNames: Record<string, string> = {
  mathematics: "Mathematics",
  english: "English",
  science: "Science",
  "computer-science": "Computer Science",
  coding: "Coding",
  quran: "Quran",
  urdu: "Urdu",
  physics: "Physics",
  chemistry: "Chemistry",
  biology: "Biology",
};

function TutorsContent() {
  const searchParams = useSearchParams();
  const subjectFilter = searchParams.get("subject");

  const filtered = subjectFilter
    ? tutors.filter((t) => t.subjectSlugs.includes(subjectFilter))
    : tutors;

  const subjectName = subjectFilter ? subjectNames[subjectFilter] : null;

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          {subjectFilter && (
            <Link href="/subjects" className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-700 text-sm font-medium mb-4">
              <ArrowLeft className="h-4 w-4" /> All Subjects
            </Link>
          )}
          <div className="flex items-end justify-between">
            <div>
              <span className="text-blue-600 font-semibold text-sm tracking-wide uppercase">
                {subjectName ? `${subjectName} Tutors` : "Our Tutors"}
              </span>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
                {subjectName ? `${subjectName} Specialists` : "All Tutors"}
              </h1>
              <p className="mt-2 text-gray-500">
                {filtered.length} tutor{filtered.length !== 1 ? "s" : ""} found
                {subjectName ? ` for ${subjectName}` : ""}
              </p>
            </div>
            {!subjectFilter && (
              <Link href="/subjects" className="hidden md:flex items-center gap-2 text-blue-600 font-medium hover:text-blue-700 text-sm">
                <BookOpen className="h-4 w-4" /> Browse by Subject
              </Link>
            )}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No tutors found for this subject</p>
            <Link href="/tutors" className="mt-4 inline-flex items-center gap-1 text-blue-600 font-medium hover:underline">
              View all tutors
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((tutor) => (
              <div key={tutor.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-blue-100 transition-all overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-full ${tutor.color} flex items-center justify-center flex-shrink-0`}>
                      <span className="text-lg font-bold">{tutor.name.split(" ").map((n) => n[0]).join("")}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{tutor.name}</h3>
                      <p className="text-sm text-blue-600 font-medium">{tutor.subjects.join(", ")}</p>
                    </div>
                  </div>
                  <p className="mt-4 text-gray-500 text-sm leading-relaxed line-clamp-2">{tutor.bio}</p>
                  <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                      <span className="font-medium text-gray-700">{tutor.rating}.0</span>
                      <span>({tutor.reviews})</span>
                    </div>
                    <span>{tutor.experience} yrs exp</span>
                  </div>
                  <div className="mt-3 text-lg font-bold text-gray-900">
                    ${tutor.rate}<span className="text-sm font-normal text-gray-500">/hr</span>
                  </div>
                </div>
                <div className="px-6 pb-6 flex gap-3">
                  <Link href={`/tutors/${tutor.id}`} className="flex-1 text-center py-2.5 border-2 border-gray-200 rounded-xl font-medium text-gray-700 hover:border-blue-600 hover:text-blue-600 transition-colors text-sm">
                    View Profile
                  </Link>
                  <Link href={`/book-trial?tutor=${tutor.id}${subjectFilter ? `&subject=${subjectFilter}` : ""}`} className="flex-1 text-center py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors text-sm">
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
    <Suspense fallback={<div className="py-20 text-center text-gray-500">Loading tutors...</div>}>
      <TutorsContent />
    </Suspense>
  );
}
