import Link from "next/link";

export default function CTASection() {
  return (
    <section className="py-3xl">
      <div className="max-w-container-max mx-auto px-lg">
        <div className="bg-primary-container rounded-[2rem] p-2xl md:p-3xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-xl">
          <div className="relative z-10 text-center md:text-left">
            <h2 className="font-display-lg-mobile md:font-headline-md text-on-primary-container mb-md">
              Ready to accelerate your learning?
            </h2>
            <p className="font-body-lg text-primary-fixed mb-xl max-w-lg">
              Get matched with your perfect tutor today and start your journey towards academic excellence.
            </p>
            <Link
              href="/book-trial"
              className="inline-block bg-surface-container-lowest text-primary px-3xl py-md rounded-lg font-headline-sm shadow-xl hover:scale-105 transition-transform"
            >
              Get Started Now
            </Link>
          </div>
          <div className="hidden lg:block relative z-10 w-1/3 text-center">
            <div className="text-8xl">🚀</div>
          </div>
        </div>
      </div>
    </section>
  );
}
