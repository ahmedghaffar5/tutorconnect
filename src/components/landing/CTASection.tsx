import Link from "next/link";

export default function CTASection() {
  return (
    <section className="py-20 bg-emerald-600">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white">
          Ready to Start Learning?
        </h2>
        <p className="mt-4 text-lg text-emerald-100">
          Book a free trial class today and take the first step toward academic
          success.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/book-trial"
            className="bg-white text-emerald-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Book Free Trial
          </Link>
          <Link
            href="/contact"
            className="bg-emerald-700 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-emerald-800 transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  );
}
