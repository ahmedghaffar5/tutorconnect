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
  { name: "Mathematics", icon: Calculator, desc: "Algebra, calculus, geometry, and more", slug: "mathematics" },
  { name: "English", icon: BookOpen, desc: "Grammar, literature, writing, and speaking", slug: "english" },
  { name: "Science", icon: Flask, desc: "General science and scientific methods", slug: "science" },
  { name: "Computer Science", icon: Monitor, desc: "Programming, algorithms, and computing", slug: "computer-science" },
  { name: "Coding", icon: Code, desc: "Web development, Python, JavaScript, and more", slug: "coding" },
  { name: "Quran", icon: BookHeart, desc: "Quran reading, memorization, and Tajweed", slug: "quran" },
  { name: "Urdu", icon: Globe, desc: "Urdu language and literature", slug: "urdu" },
  { name: "Physics", icon: Zap, desc: "Mechanics, thermodynamics, and electromagnetism", slug: "physics" },
  { name: "Chemistry", icon: Atom, desc: "Organic, inorganic, and physical chemistry", slug: "chemistry" },
  { name: "Biology", icon: Leaf, desc: "Human biology, genetics, and ecology", slug: "biology" },
];

export default function SubjectsPage() {
  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900">All Subjects</h1>
          <p className="mt-4 text-gray-600 text-lg">
            Browse subjects and find the perfect tutor for you
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {subjects.map((subject) => {
            const Icon = subject.icon;
            return (
              <Link
                key={subject.name}
                href={`/subjects/${subject.slug}`}
                className="flex flex-col items-center p-8 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all group"
              >
                <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-emerald-100 transition-colors">
                  <Icon className="h-8 w-8 text-emerald-600" />
                </div>
                <h3 className="font-semibold text-gray-900 text-center">{subject.name}</h3>
                <p className="text-sm text-gray-500 text-center mt-1">{subject.desc}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
