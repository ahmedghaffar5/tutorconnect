import Link from "next/link";
import { ArrowRight } from "lucide-react";

const subjects = [
  { name: "Mathematics", emoji: "📐", href: "/subjects/mathematics", desc: "Algebra, Calculus, Statistics, and Geometry." },
  { name: "Coding", emoji: "💻", href: "/subjects/coding", desc: "Python, JavaScript, Data Science, and AI." },
  { name: "Languages", emoji: "🌍", href: "/subjects/english", desc: "Spanish, French, Mandarin, and ESL." },
  { name: "Science", emoji: "🔬", href: "/subjects/science", desc: "Physics, Chemistry, Biology, and more." },
  { name: "Quran", emoji: "📖", href: "/subjects/quran", desc: "Quran reading, Tajweed, and memorization." },
  { name: "Computer Science", emoji: "🖥️", href: "/subjects/computer-science", desc: "Algorithms, DSA, and computing theory." },
];

export default function SubjectsSection() {
  return (
    <section className="py-3xl bg-surface-container-lowest">
      <div className="max-w-container-max mx-auto px-lg">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-lg mb-2xl">
          <div>
            <h2 className="font-headline-md text-on-surface mb-sm">Explore Popular Subjects</h2>
            <p className="font-body-md text-on-surface-variant">Whatever you want to learn, we have an expert for you.</p>
          </div>
          <Link href="/subjects" className="text-primary font-label-md flex items-center gap-xs hover:underline">
            View all subjects <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
          {subjects.map((s) => (
            <Link key={s.name} href={s.href} className="group cursor-pointer">
              <div className="h-48 rounded-2xl overflow-hidden mb-md relative bg-gradient-to-br from-primary-container/10 to-secondary-container/10 border border-outline-variant flex items-center justify-center">
                <span className="text-6xl transition-transform duration-500 group-hover:scale-110">{s.emoji}</span>
                <div className="absolute inset-0 bg-gradient-to-t from-on-surface/60 to-transparent flex items-end p-md">
                  <span className="text-on-primary font-headline-sm">{s.name}</span>
                </div>
              </div>
              <p className="font-body-sm text-on-surface-variant">{s.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
