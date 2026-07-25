import Link from "next/link";
import { Star, ArrowRight } from "lucide-react";

const tutors = [
  {
    name: "Dr. Sarah Chen",
    subject: "Mathematics Specialist",
    rating: 4.9,
    reviews: 128,
    badges: ["Calculus", "SAT Prep"],
    initials: "SC",
    color: "bg-indigo-100 text-indigo-600",
    badgeColor: "bg-emerald-100 text-emerald-700",
  },
  {
    name: "James Wilson",
    subject: "Full-Stack Developer",
    rating: 5.0,
    reviews: 95,
    badges: ["React", "Node.js"],
    initials: "JW",
    color: "bg-emerald-100 text-emerald-600",
    badgeColor: "bg-emerald-100 text-emerald-700",
  },
  {
    name: "Elena Rodriguez",
    subject: "Spanish & Linguistics",
    rating: 4.8,
    reviews: 210,
    badges: ["Native Speaker", "Business Spanish"],
    initials: "ER",
    color: "bg-amber-100 text-amber-600",
    badgeColor: "bg-emerald-100 text-emerald-700",
  },
  {
    name: "Prof. Michael Hart",
    subject: "History & Literature",
    rating: 4.9,
    reviews: 156,
    badges: ["World History", "Essay Writing"],
    initials: "MH",
    color: "bg-gray-100 text-gray-600",
    badgeColor: "bg-emerald-100 text-emerald-700",
  },
];

export default function TutorsSection() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Top-Rated Tutors</h2>
          <p className="text-base text-gray-500 max-w-xl mx-auto">
            Vetted professionals with years of teaching experience from top global institutions.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {tutors.map((tutor) => (
            <div key={tutor.name} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center">
              <div className={`w-24 h-24 rounded-full ${tutor.color} flex items-center justify-center mb-4 border-4 border-gray-50 text-2xl font-bold shadow-sm`}>
                {tutor.initials}
              </div>
              <h3 className="text-xl font-semibold text-gray-900">{tutor.name}</h3>
              <span className="text-sm text-indigo-600 font-medium mb-3">{tutor.subject}</span>
              <div className="flex items-center gap-1 mb-4">
                <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                <span className="text-sm font-bold">{tutor.rating}</span>
                <span className="text-xs text-gray-400">({tutor.reviews} reviews)</span>
              </div>
              <div className="flex flex-wrap justify-center gap-1 mb-6">
                {tutor.badges.map((b) => (
                  <span key={b} className={`px-2 py-0.5 ${tutor.badgeColor} rounded-full text-[10px] font-bold`}>{b}</span>
                ))}
              </div>
              <Link href="/book-trial" className="mt-auto w-full py-2.5 border border-indigo-600 text-indigo-600 rounded-lg text-sm font-semibold hover:bg-indigo-50 transition-colors">
                Book a Session
              </Link>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link href="/tutors" className="text-indigo-600 font-medium flex items-center gap-1 justify-center hover:underline">
            View All Tutors <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
