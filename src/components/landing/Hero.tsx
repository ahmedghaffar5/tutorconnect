import Link from "next/link";
import { GraduationCap, BookOpen, Users, PlayCircle } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-white/90 text-sm mb-6">
              <PlayCircle className="h-4 w-4" />
              Trusted by 500+ Students
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Find Your Perfect
              <span className="text-yellow-400"> Online Tutor</span>
              <br />
              & Start Learning
            </h1>
            <p className="mt-6 text-lg text-blue-100 leading-relaxed max-w-xl">
              Connect with qualified tutors for personalized online learning.
              Book a free trial class and start your journey toward academic success.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link
                href="/book-trial"
                className="bg-yellow-400 text-gray-900 px-8 py-3.5 rounded-xl text-lg font-bold hover:bg-yellow-300 transition-all shadow-xl shadow-blue-900/20 text-center"
              >
                Book Free Trial
              </Link>
              <Link
                href="/tutors"
                className="bg-white/10 backdrop-blur-sm text-white px-8 py-3.5 rounded-xl text-lg font-semibold hover:bg-white/20 transition-all border border-white/20 text-center"
              >
                View Tutors
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-6 text-sm text-blue-200">
              <span className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                  <GraduationCap className="h-4 w-4" />
                </div>
                50+ Qualified Tutors
              </span>
              <span className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                  <BookOpen className="h-4 w-4" />
                </div>
                10+ Subjects
              </span>
              <span className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                  <Users className="h-4 w-4" />
                </div>
                500+ Students
              </span>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="relative">
              <div className="w-full aspect-square max-w-lg mx-auto bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm p-8">
                <div className="grid grid-cols-2 gap-4 h-full">
                  <div className="bg-white/10 rounded-2xl p-4 flex flex-col justify-between">
                    <BookOpen className="h-8 w-8 text-yellow-400" />
                    <div>
                      <p className="text-2xl font-bold text-white">10+</p>
                      <p className="text-xs text-blue-200">Subjects</p>
                    </div>
                  </div>
                  <div className="bg-white/10 rounded-2xl p-4 flex flex-col justify-between mt-8">
                    <Users className="h-8 w-8 text-yellow-400" />
                    <div>
                      <p className="text-2xl font-bold text-white">50+</p>
                      <p className="text-xs text-blue-200">Tutors</p>
                    </div>
                  </div>
                  <div className="bg-white/10 rounded-2xl p-4 flex flex-col justify-between -mt-4">
                    <GraduationCap className="h-8 w-8 text-yellow-400" />
                    <div>
                      <p className="text-2xl font-bold text-white">500+</p>
                      <p className="text-xs text-blue-200">Students</p>
                    </div>
                  </div>
                  <div className="bg-white/10 rounded-2xl p-4 flex flex-col justify-between mt-4">
                    <div className="text-yellow-400 text-2xl">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
                    <div>
                      <p className="text-2xl font-bold text-white">4.9</p>
                      <p className="text-xs text-blue-200">Rating</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}
