import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";

const avatars = [
  "/images/stitch/landing_page-0.jpg",
  "/images/stitch/landing_page-1.jpg",
  "/images/stitch/landing_page-2.jpg",
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
            <Link href="/tutors" className="bg-indigo-600 text-white px-12 py-4 rounded-lg font-semibold shadow-lg flex items-center justify-center gap-2 hover:bg-indigo-700 transition-colors group">
              Find a Tutor <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/pricing" className="bg-gray-100 text-indigo-600 border border-gray-200 px-12 py-4 rounded-lg font-semibold hover:bg-gray-200 transition-colors">How it works</Link>
          </div>
          <div className="mt-10 flex items-center justify-center md:justify-start gap-4">
            <div className="flex -space-x-3">
              {avatars.map((src, i) => (
                <img key={i} src={src} alt="" className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-sm" />
              ))}
            </div>
            <span className="text-sm text-gray-500">
              <Star className="h-3 w-3 inline text-amber-400 fill-amber-400 -mt-0.5 mr-1" /> Rated 4.9/5 by 10k+ active students
            </span>
          </div>
        </div>
        <div className="flex-1 relative hidden lg:block">
          <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-[4/3]">
            <img src="/images/stitch/landing_page-3.jpg" alt="Online tutoring session" className="w-full h-full object-cover" />
          </div>
          <div className="absolute -top-12 -right-12 w-64 h-64 bg-indigo-100/50 blur-3xl rounded-full -z-10"></div>
          <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-emerald-100/50 blur-3xl rounded-full -z-10"></div>
        </div>
      </div>
    </section>
  );
}
