import Link from "next/link";
import { Star, ArrowRight } from "lucide-react";

const tutors = [
  {
    name: "Dr. Sarah Ahmed",
    subject: "Quran & Arabic",
    rating: 5,
    students: 120,
    bio: "PhD in Islamic Studies with 10+ years of experience",
    color: "bg-blue-100 text-blue-600",
  },
  {
    name: "Prof. John Smith",
    subject: "Mathematics",
    rating: 5,
    students: 95,
    bio: "Professor making math easy and enjoyable",
    color: "bg-green-100 text-green-600",
  },
  {
    name: "Ms. Aisha Khan",
    subject: "English & Urdu",
    rating: 4,
    students: 78,
    bio: "MA English Literature, 8 years teaching",
    color: "bg-purple-100 text-purple-600",
  },
  {
    name: "Dr. Ahmed Raza",
    subject: "Physics & Chemistry",
    rating: 5,
    students: 102,
    bio: "PhD in Physics, 12 years experience",
    color: "bg-amber-100 text-amber-600",
  },
];

export default function TutorsSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="text-blue-600 font-semibold text-sm tracking-wide uppercase">Our Tutors</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
              Learn From The Best
            </h2>
            <p className="mt-3 text-gray-500 text-lg max-w-xl">
              Experienced and passionate educators ready to help you succeed
            </p>
          </div>
          <Link href="/tutors" className="hidden md:flex items-center gap-2 text-blue-600 font-medium hover:text-blue-700">
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {tutors.map((tutor) => (
            <div key={tutor.name} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-blue-100 transition-all duration-200 p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-14 h-14 rounded-full ${tutor.color} flex items-center justify-center flex-shrink-0`}>
                  <span className="text-lg font-bold">{tutor.name.split(" ").map((n) => n[0]).join("")}</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{tutor.name}</h3>
                  <p className="text-sm text-blue-600 font-medium">{tutor.subject}</p>
                </div>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">{tutor.bio}</p>
              <div className="mt-4 flex items-center justify-between text-sm">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < tutor.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200"}`} />
                  ))}
                  <span className="text-gray-500 ml-1">{tutor.students}+</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Link href="/tutors" className="inline-flex items-center gap-2 text-blue-600 font-medium">
            View All Tutors <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
