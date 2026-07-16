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
    features: ["30-minute session", "Choose any subject", "Meet your tutor", "No commitment"],
    popular: false,
  },
  {
    id: "single",
    name: "Single Session",
    price: "$25",
    period: "/session",
    features: ["60-minute session", "One-on-one tutoring", "Choose any tutor", "Flexible scheduling"],
    popular: true,
  },
  {
    id: "monthly",
    name: "Monthly",
    price: "$199",
    period: "/month",
    features: ["8 sessions/month", "Same tutor assigned", "Progress tracking", "Homework support"],
    popular: false,
  },
  {
    id: "premium",
    name: "Premium",
    price: "$349",
    period: "/month",
    features: ["16 sessions/month", "Priority scheduling", "Parent reports", "Homework support"],
    popular: false,
  },
];

export default function PricingSection() {
  const [selected, setSelected] = useState<string | null>(null);
  const router = useRouter();

  const handleContinue = () => {
    if (selected) {
      router.push(`/book-trial?plan=${selected}`);
    }
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-blue-600 font-semibold text-sm tracking-wide uppercase">Pricing</span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
            Simple & Transparent Pricing
          </h2>
          <p className="mt-3 text-gray-500 text-lg">Choose a plan to get started</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {plans.map((plan) => {
            const isSelected = selected === plan.id;
            const isPopular = plan.popular;

            return (
              <button
                key={plan.id}
                type="button"
                onClick={() => setSelected(plan.id)}
                className={`relative rounded-2xl p-6 flex flex-col text-left transition-all duration-200 cursor-pointer ${
                  isSelected || isPopular
                    ? "bg-blue-600 text-white ring-4 ring-blue-100 scale-105 shadow-xl"
                    : "bg-white border-2 border-gray-200 hover:border-blue-300 hover:shadow-lg"
                }`}
              >
                {isPopular && !isSelected && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-gray-900 text-xs font-bold px-4 py-1 rounded-full whitespace-nowrap">
                    <Sparkles className="h-3 w-3 inline mr-1" /> MOST POPULAR
                  </div>
                )}
                {isSelected && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white text-blue-600 text-xs font-bold px-4 py-1 rounded-full whitespace-nowrap">
                    <Check className="h-3 w-3 inline mr-1" /> SELECTED
                  </div>
                )}
                <h3 className="text-lg font-bold">{plan.name}</h3>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  {plan.period && (
                    <span className={`text-sm ${isSelected || isPopular ? "text-blue-200" : "text-gray-500"}`}>
                      {plan.period}
                    </span>
                  )}
                </div>
                <ul className="mt-6 space-y-3 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                        isSelected || isPopular ? "bg-blue-500" : "bg-blue-100"
                      }`}>
                        <Check className={`h-3 w-3 ${isSelected || isPopular ? "text-white" : "text-blue-600"}`} />
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
          <div className="mt-10 text-center">
            <button
              onClick={handleContinue}
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-3.5 rounded-xl text-base font-bold hover:bg-blue-700 transition-all shadow-lg"
            >
              Continue with {plans.find((p) => p.id === selected)?.name}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
