import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-emerald-50 via-white to-emerald-50 py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
            Find Your Perfect
            <span className="text-emerald-600"> Online Tutor </span>
            Today
          </h1>
          <p className="mt-6 text-lg md:text-xl text-gray-600 leading-relaxed">
            Connect with qualified tutors for personalized online learning.
            Book a free trial class and start your learning journey.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/book-trial"
              className="bg-emerald-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200"
            >
              Book a Free Trial
            </Link>
            <Link
              href="/tutors"
              className="bg-white text-gray-700 px-8 py-4 rounded-xl text-lg font-semibold border-2 border-gray-200 hover:border-emerald-600 hover:text-emerald-600 transition-colors"
            >
              View Tutors
            </Link>
          </div>
          <div className="mt-12 flex items-center justify-center gap-8 text-sm text-gray-500">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full" />
              50+ Qualified Tutors
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full" />
              10+ Subjects
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full" />
              Free Trial
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
