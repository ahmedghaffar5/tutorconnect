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
} from "lucide-react";

const subjects = [
  { name: "Mathematics", icon: Calculator, href: "/subjects/mathematics" },
  { name: "English", icon: BookOpen, href: "/subjects/english" },
  { name: "Science", icon: Flask, href: "/subjects/science" },
  { name: "Computer Science", icon: Monitor, href: "/subjects/computer-science" },
  { name: "Coding", icon: Code, href: "/subjects/coding" },
  { name: "Quran", icon: BookHeart, href: "/subjects/quran" },
  { name: "Urdu", icon: Globe, href: "/subjects/urdu" },
  { name: "Physics", icon: Zap, href: "/subjects/physics" },
  { name: "Chemistry", icon: Atom, href: "/subjects/chemistry" },
  { name: "Biology", icon: Leaf, href: "/subjects/biology" },
];

export default function SubjectsSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Explore Subjects
          </h2>
          <p className="mt-4 text-gray-600 text-lg">
            Find expert tutors across a wide range of subjects
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {subjects.map((subject) => {
            const Icon = subject.icon;
            return (
              <Link
                key={subject.name}
                href={subject.href}
                className="flex flex-col items-center p-6 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition-colors group"
              >
                <Icon className="h-8 w-8 text-emerald-600 mb-3 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium text-gray-700 text-center">
                  {subject.name}
                </span>
              </Link>
            );
          })}
        </div>

        <div className="text-center mt-8">
          <Link
            href="/subjects"
            className="text-emerald-600 font-medium hover:text-emerald-700"
          >
            View All Subjects &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}
