import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-2xl pb-3xl md:pt-3xl md:pb-[120px]">
      <div className="max-w-container-max mx-auto px-lg flex flex-col md:flex-row items-center gap-3xl">
        <div className="flex-1 text-center md:text-left">
          <h1 className="font-display-lg-mobile md:font-display-lg text-on-surface mb-md">
            Master Any Subject with <span className="text-primary">Expert Tutors</span>
          </h1>
          <p className="font-body-lg text-on-surface-variant mb-2xl max-w-2xl mx-auto md:mx-0">
            Join over 50,000 learners achieving their academic goals through personalized 1-on-1 mentorship. Real experts, real results.
          </p>
          <div className="flex flex-col sm:flex-row gap-md justify-center md:justify-start">
            <Link
              href="/tutors"
              className="bg-primary text-on-primary px-3xl py-md rounded-lg font-label-md shadow-lg flex items-center justify-center gap-sm group"
            >
              Find a Tutor
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/pricing"
              className="bg-surface-container-low text-primary border border-outline-variant px-3xl py-md rounded-lg font-label-md hover:bg-surface-container transition-colors"
            >
              How it works
            </Link>
          </div>
          <div className="mt-2xl flex items-center justify-center md:justify-start gap-md">
            <div className="flex -space-x-3">
              {["bg-primary-fixed", "bg-secondary-container", "bg-tertiary-fixed"].map((c, i) => (
                <div key={i} className={`w-10 h-10 rounded-full border-2 border-surface ${c} flex items-center justify-center text-xs font-bold`}>
                  {["SC", "JM", "AH"][i]}
                </div>
              ))}
            </div>
            <span className="font-label-sm text-on-surface-variant">
              <Star className="h-3 w-3 inline text-tertiary fill-tertiary -mt-0.5" /> Rated 4.9/5 by 10k+ active students
            </span>
          </div>
        </div>
        <div className="flex-1 relative hidden lg:block">
          <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border-4 border-surface bg-gradient-to-br from-primary-container/20 to-secondary-container/20 aspect-[4/3] flex items-center justify-center">
            <div className="text-center p-8">
              <div className="w-20 h-20 bg-primary-container rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-4xl">🎓</span>
              </div>
              <p className="font-headline-sm text-on-surface">Learn 1-on-1 with Experts</p>
              <p className="font-body-sm text-on-surface-variant mt-2">Personalized learning, real results</p>
            </div>
          </div>
          <div className="absolute -top-12 -right-12 w-64 h-64 bg-primary-container/20 blur-3xl rounded-full -z-10"></div>
          <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-secondary-container/20 blur-3xl rounded-full -z-10"></div>
        </div>
      </div>
    </section>
  );
}
