import Link from "next/link";
import { ArrowRight } from "lucide-react";

const subjects = [
  { name: "Mathematics", desc: "Algebra, Calculus, Statistics, and Geometry.", img: "/images/stitch/landing_page-4.jpg", href: "/subjects/mathematics" },
  { name: "Coding", desc: "Python, JavaScript, Data Science, and AI.", img: "/images/stitch/landing_page-5.jpg", href: "/subjects/coding" },
  { name: "Languages", desc: "Spanish, French, Mandarin, and ESL.", img: "/images/stitch/landing_page-10.jpg", href: "/subjects/english" },
];

export default function SubjectsSection() {
  return (
    <section className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Explore Popular Subjects</h2>
            <p className="text-base text-gray-500">Whatever you want to learn, we have an expert for you.</p>
          </div>
          <Link href="/subjects" className="text-indigo-600 font-medium flex items-center gap-1 hover:underline text-sm">
            View all subjects <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {subjects.map((s) => (
            <Link key={s.name} href={s.href} className="group cursor-pointer">
              <div className="h-48 rounded-2xl overflow-hidden mb-4 relative">
                <img src={s.img} alt={s.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                  <span className="text-white text-xl font-semibold">{s.name}</span>
                </div>
              </div>
              <p className="text-sm text-gray-500">{s.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
