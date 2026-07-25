import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";

const avatars = [
  { initials: "SC", color: "bg-indigo-100 text-indigo-600" },
  { initials: "JM", color: "bg-emerald-100 text-emerald-600" },
  { initials: "AH", color: "bg-amber-100 text-amber-600" },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-16 pb-24 md:pt-24 md:pb-32">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-16">
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight tracking-tight">
            Master Any Subject with <span className="text-indigo-600">Expert Tutors</span>
          </h1>
          <p className="text-lg text-gray-500 mb-10 max-w-2xl mx-auto md:mx-0 leading-relaxed">
            Join over 50,000 learners achieving their academic goals through personalized 1-on-1 mentorship. Real experts, real results.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Link
              href="/tutors"
              className="bg-indigo-600 text-white px-12 py-4 rounded-lg font-semibold shadow-lg flex items-center justify-center gap-2 hover:bg-indigo-700 transition-colors group"
            >
              Find a Tutor
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/pricing"
              className="bg-gray-100 text-indigo-600 border border-gray-200 px-12 py-4 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
            >
              How it works
            </Link>
          </div>
          <div className="mt-10 flex items-center justify-center md:justify-start gap-4">
            <div className="flex -space-x-3">
              {avatars.map((a, i) => (
                <div key={i} className={`w-10 h-10 rounded-full border-2 border-white ${a.color} flex items-center justify-center text-xs font-bold shadow-sm`}>
                  {a.initials}
                </div>
              ))}
            </div>
            <span className="text-sm text-gray-500">
              <Star className="h-3 w-3 inline text-amber-400 fill-amber-400 -mt-0.5 mr-1" /> Rated 4.9/5 by 10k+ active students
            </span>
          </div>
        </div>
        <div className="flex-1 relative hidden lg:block">
          <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-gradient-to-br from-indigo-50 to-emerald-50 aspect-[4/3] flex items-center justify-center">
            <div className="text-center p-8">
              <div className="w-20 h-20 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-4xl">🎓</span>
              </div>
              <p className="text-xl font-semibold text-gray-900">Learn 1-on-1 with Experts</p>
              <p className="text-sm text-gray-500 mt-2">Personalized learning, real results</p>
            </div>
          </div>
          <div className="absolute -top-12 -right-12 w-64 h-64 bg-indigo-100/50 blur-3xl rounded-full -z-10"></div>
          <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-emerald-100/50 blur-3xl rounded-full -z-10"></div>
        </div>
      </div>
    </section>
  );
}
