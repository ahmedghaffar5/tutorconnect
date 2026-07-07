import Link from "next/link";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Trial Class",
    price: "Free",
    period: "",
    features: ["30-minute session", "Choose any subject", "Meet your tutor", "No commitment required"],
    cta: "Book Free Trial",
    featured: false,
  },
  {
    name: "Single Session",
    price: "$25",
    period: "/session",
    features: ["60-minute session", "One-on-one tutoring", "Choose any tutor", "Flexible scheduling"],
    cta: "Book Now",
    featured: true,
  },
  {
    name: "Monthly Package",
    price: "$199",
    period: "/month",
    features: ["8 sessions per month", "One-on-one tutoring", "Same tutor assigned", "Progress tracking", "Homework support"],
    cta: "Get Started",
    featured: false,
  },
  {
    name: "Premium Monthly",
    price: "$349",
    period: "/month",
    features: ["16 sessions per month", "One-on-one tutoring", "Same tutor assigned", "Priority scheduling", "Progress tracking", "Homework support", "Parent progress reports"],
    cta: "Get Premium",
    featured: false,
  },
];

export default function PricingPage() {
  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900">Pricing Plans</h1>
          <p className="mt-4 text-gray-600 text-lg">Affordable plans for every budget. Start with a free trial.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl p-8 ${plan.featured ? "bg-emerald-600 text-white ring-4 ring-emerald-100 scale-105" : "bg-white border border-gray-200"}`}
            >
              <h3 className="text-xl font-bold">{plan.name}</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-bold">{plan.price}</span>
                {plan.period && <span className={`text-lg ${plan.featured ? "text-emerald-100" : "text-gray-500"}`}>{plan.period}</span>}
              </div>
              <ul className="mt-6 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${plan.featured ? "bg-emerald-500" : "bg-emerald-100 text-emerald-600"}`}>
                      <Check className="h-3 w-3" />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/book-trial"
                className={`mt-8 block text-center py-3 rounded-xl font-semibold transition-colors ${plan.featured ? "bg-white text-emerald-600 hover:bg-gray-100" : "bg-emerald-600 text-white hover:bg-emerald-700"}`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-gray-50 rounded-2xl p-8 text-center">
          <h2 className="text-xl font-semibold text-gray-900">Need a Custom Plan?</h2>
          <p className="mt-2 text-gray-600">Contact us for group discounts or customized packages.</p>
          <Link href="/contact" className="mt-4 inline-block text-emerald-600 font-medium hover:underline">
            Contact Us &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
