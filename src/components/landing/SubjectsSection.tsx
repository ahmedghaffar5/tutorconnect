import Link from "next/link";
import {
  Calculator,
  BookOpen,
  FlaskRoundIcon as Flask,
  Monitor,
  Code,
  BookHeart,
  Globe,
  Zap,
  Atom,
  Leaf,
  ArrowRight,
} from "lucide-react";

const subjects = [
  { name: "Mathematics", icon: Calculator, href: "/subjects/mathematics", color: "bg-red-50 text-red-600" },
  { name: "English", icon: BookOpen, href: "/subjects/english", color: "bg-blue-50 text-blue-600" },
  { name: "Science", icon: Flask, href: "/subjects/science", color: "bg-green-50 text-green-600" },
  { name: "Computer Science", icon: Monitor, href: "/subjects/computer-science", color: "bg-purple-50 text-purple-600" },
  { name: "Coding", icon: Code, href: "/subjects/coding", color: "bg-indigo-50 text-indigo-600" },
  { name: "Quran", icon: BookHeart, href: "/subjects/quran", color: "bg-emerald-50 text-emerald-600" },
  { name: "Urdu", icon: Globe, href: "/subjects/urdu", color: "bg-amber-50 text-amber-600" },
  { name: "Physics", icon: Zap, href: "/subjects/physics", color: "bg-cyan-50 text-cyan-600" },
  { name: "Chemistry", icon: Atom, href: "/subjects/chemistry", color: "bg-rose-50 text-rose-600" },
  { name: "Biology", icon: Leaf, href: "/subjects/biology", color: "bg-lime-50 text-lime-600" },
];

export default function SubjectsSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="text-blue-600 font-semibold text-sm tracking-wide uppercase">Subjects</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
              Explore Our Subjects
            </h2>
            <p className="mt-3 text-gray-500 text-lg max-w-xl">
              Find expert tutors across a wide range of subjects taught online
            </p>
          </div>
          <Link href="/subjects" className="hidden md:flex items-center gap-2 text-blue-600 font-medium hover:text-blue-700">
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {subjects.map((subject) => {
            const Icon = subject.icon;
            return (
              <Link
                key={subject.name}
                href={subject.href}
                className="group bg-white rounded-2xl p-6 border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all duration-200"
              >
                <div className={`w-12 h-12 rounded-xl ${subject.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-gray-900 text-sm">{subject.name}</h3>
                <p className="text-xs text-gray-400 mt-1">Find tutors &rarr;</p>
              </Link>
            );
          })}
        </div>

        <div className="mt-6 text-center md:hidden">
          <Link href="/subjects" className="inline-flex items-center gap-2 text-blue-600 font-medium">
            View All Subjects <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
