"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, ArrowRight, Sparkles } from "lucide-react";

const plans = [
  {
    id: "trial",
    name: "Trial Class",
    price: "Free",
    period: "",
    desc: "Perfect for first-time students",
    features: ["30-minute session", "Choose any subject", "Meet your tutor", "No commitment required"],
    cta: "Book Free Trial",
    popular: false,
  },
  {
    id: "single",
    name: "Single Session",
    price: "$25",
    period: "/session",
    desc: "Best for flexible learning",
    features: ["60-minute session", "One-on-one tutoring", "Choose any tutor", "Flexible scheduling"],
    cta: "Book Now",
    popular: true,
  },
  {
    id: "monthly",
    name: "Monthly Package",
    price: "$199",
    period: "/month",
    desc: "Great for regular learners",
    features: ["8 sessions per month", "One-on-one tutoring", "Same tutor assigned", "Progress tracking", "Homework support"],
    cta: "Get Started",
    popular: false,
  },
  {
    id: "premium",
    name: "Premium Monthly",
    price: "$349",
    period: "/month",
    desc: "For serious students",
    features: ["16 sessions per month", "One-on-one tutoring", "Same tutor assigned", "Priority scheduling", "Progress tracking", "Homework support", "Parent progress reports"],
    cta: "Get Premium",
    popular: false,
  },
];

export default function PricingPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const router = useRouter();

  const handleContinue = () => {
    if (selected) {
      router.push(`/book-trial?plan=${selected}`);
    }
  };

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-blue-600 font-semibold text-sm tracking-wide uppercase">Pricing</span>
          <h1 className="text-4xl font-bold text-gray-900 mt-2">Choose Your Plan</h1>
          <p className="mt-3 text-gray-500 text-lg max-w-xl mx-auto">
            Pick a plan, then continue to book your class with a tutor
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {plans.map((plan) => {
            const isSelected = selected === plan.id;
            const isPopular = plan.popular;

            return (
              <button
                key={plan.id}
                type="button"
                onClick={() => setSelected(plan.id)}
                className={`relative rounded-2xl p-6 flex flex-col text-left transition-all duration-200 cursor-pointer ${
                  isPopular && !isSelected
                    ? "bg-blue-600 text-white ring-4 ring-blue-100 scale-105 shadow-xl"
                    : isSelected
                    ? "bg-blue-600 text-white ring-4 ring-blue-100 scale-105 shadow-xl"
                    : "bg-white border-2 border-gray-200 hover:border-blue-300 hover:shadow-lg"
                }`}
              >
                {isPopular && !isSelected && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-gray-900 text-xs font-bold px-4 py-1 rounded-full flex items-center gap-1">
                    <Sparkles className="h-3 w-3" /> MOST POPULAR
                  </div>
                )}
                {isSelected && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white text-blue-600 text-xs font-bold px-4 py-1 rounded-full flex items-center gap-1">
                    <Check className="h-3 w-3" /> SELECTED
                  </div>
                )}

                <h3 className="text-lg font-bold">{plan.name}</h3>
                <p className={`text-sm mt-1 ${isPopular || isSelected ? "text-blue-200" : "text-gray-400"}`}>
                  {plan.desc}
                </p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  {plan.period && (
                    <span className={`text-sm ${isPopular || isSelected ? "text-blue-200" : "text-gray-500"}`}>
                      {plan.period}
                    </span>
                  )}
                </div>
                <ul className="mt-6 space-y-3 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                        isPopular || isSelected ? "bg-blue-500" : "bg-blue-100"
                      }`}>
                        <Check className={`h-3 w-3 ${isPopular || isSelected ? "text-white" : "text-blue-600"}`} />
                      </div>
                      {f}
                    </li>
                  ))}
                </ul>
              </button>
            );
          })}
        </div>

        {selected && (
          <div className="mt-10 text-center animate-[fadeIn_0.3s_ease-in]">
            <button
              onClick={handleContinue}
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-10 py-4 rounded-xl text-lg font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-200"
            >
              Continue with {plans.find((p) => p.id === selected)?.name}
              <ArrowRight className="h-5 w-5" />
            </button>
            <p className="mt-3 text-sm text-gray-400">You can choose a tutor and schedule after this</p>
          </div>
        )}

        <div className="mt-16 bg-gray-50 rounded-2xl p-8 text-center">
          <h2 className="text-xl font-semibold text-gray-900">Need a Custom Plan?</h2>
          <p className="mt-2 text-gray-500">Contact us for group discounts or customized packages.</p>
          <button onClick={() => router.push("/contact")} className="mt-4 inline-flex items-center gap-1 text-blue-600 font-medium hover:underline">
            Contact Us &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}
