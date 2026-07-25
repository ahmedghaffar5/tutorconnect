import Link from "next/link";
import { Star, ArrowRight } from "lucide-react";

const tutors = [
  { name: "Dr. Sarah Chen", subject: "Mathematics Specialist", rating: 4.9, reviews: 128, badges: ["Calculus", "SAT Prep"], img: "/images/stitch/landing_page-6.jpg" },
  { name: "James Wilson", subject: "Full-Stack Developer", rating: 5.0, reviews: 95, badges: ["React", "Node.js"], img: "/images/stitch/landing_page-7.jpg" },
  { name: "Elena Rodriguez", subject: "Spanish & Linguistics", rating: 4.8, reviews: 210, badges: ["Native Speaker", "Business Spanish"], img: "/images/stitch/landing_page-8.jpg" },
  { name: "Prof. Michael Hart", subject: "History & Literature", rating: 4.9, reviews: 156, badges: ["World History", "Essay Writing"], img: "/images/stitch/landing_page-9.jpg" },
];

export default function TutorsSection() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Top-Rated Tutors</h2>
          <p className="text-base text-gray-500 max-w-xl mx-auto">Vetted professionals with years of teaching experience from top global institutions.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {tutors.map((tutor) => (
            <div key={tutor.name} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center">
              <img src={tutor.img} alt={tutor.name} className="w-24 h-24 rounded-full object-cover mb-4 border-4 border-gray-50 shadow-sm" />
              <h3 className="text-xl font-semibold text-gray-900">{tutor.name}</h3>
              <span className="text-sm text-indigo-600 font-medium mb-3">{tutor.subject}</span>
              <div className="flex items-center gap-1 mb-4">
                <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                <span className="text-sm font-bold">{tutor.rating}</span>
                <span className="text-xs text-gray-400">({tutor.reviews} reviews)</span>
              </div>
              <div className="flex flex-wrap justify-center gap-1 mb-6">
                {tutor.badges.map((b) => (<span key={b} className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-bold">{b}</span>))}
              </div>
              <Link href="/book-trial" className="mt-auto w-full py-2.5 border border-indigo-600 text-indigo-600 rounded-lg text-sm font-semibold hover:bg-indigo-50 transition-colors">Book a Session</Link>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link href="/tutors" className="text-indigo-600 font-medium flex items-center gap-1 justify-center hover:underline">View All Tutors <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </div>
    </section>
  );
}
