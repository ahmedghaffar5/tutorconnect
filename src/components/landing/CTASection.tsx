import Link from "next/link";

export default function CTASection() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="bg-indigo-600 rounded-[2rem] p-12 md:p-16 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="relative z-10 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to accelerate your learning?</h2>
            <p className="text-lg text-indigo-200 mb-8 max-w-lg">Get matched with your perfect tutor today and start your journey towards academic excellence.</p>
            <Link href="/book-trial" className="inline-block bg-white text-indigo-600 px-12 py-4 rounded-lg font-bold shadow-xl hover:scale-105 transition-transform">Get Started Now</Link>
          </div>
          <div className="hidden lg:block relative z-10 w-1/3 text-center"><span className="text-8xl">🚀</span></div>
        </div>
      </div>
    </section>
  );
}
