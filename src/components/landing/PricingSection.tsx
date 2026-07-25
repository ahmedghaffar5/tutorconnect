"use client";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";

const plans = [
  { id: "trial", name: "Trial Class", price: "Free", type: "trial", features: ["30-minute session", "Choose any subject", "Meet your tutor", "No commitment"] },
  { id: "single", name: "Single Session", price: "$25", period: "/session", type: "paid", features: ["60-minute session", "One-on-one tutoring", "Choose any tutor", "Flexible scheduling"] },
  { id: "monthly", name: "Monthly", price: "$199", period: "/month", type: "paid", popular: true, features: ["8 sessions/month", "Same tutor assigned", "Progress tracking", "Homework support"] },
  { id: "premium", name: "Premium Monthly", price: "$349", period: "/month", type: "paid", features: ["16 sessions/month", "Priority scheduling", "Parent reports", "Homework support"] },
];

export default function PricingSection() {
  const router = useRouter();
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Simple & Transparent Pricing</h2>
          <p className="text-base text-gray-500">Choose a plan to get started</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => (
            <div key={plan.id} className={`bg-white rounded-2xl p-8 border ${plan.popular ? "border-indigo-600 shadow-lg relative" : "border-gray-100"} flex flex-col`}>
              {plan.popular && <div className="absolute -top-3 right-6 bg-emerald-500 text-white px-4 py-1 rounded-full text-xs font-semibold shadow-md">Most Popular</div>}
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{plan.name}</h3>
              <div className="mb-6"><span className="text-4xl font-bold text-gray-900">{plan.price}</span>{plan.period && <span className="text-gray-400 text-sm">{plan.period}</span>}</div>
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-500"><Check className="h-4 w-4 text-emerald-500 flex-shrink-0" />{f}</li>
                ))}
              </ul>
              <button onClick={() => router.push(`/book-trial?plan=${plan.id}`)}
                className={`w-full py-3 rounded-lg font-semibold text-sm transition-all ${plan.popular ? "bg-indigo-600 text-white shadow-md hover:bg-indigo-700" : "border border-indigo-600 text-indigo-600 hover:bg-indigo-50"}`}>
                {plan.id === "trial" ? "Book Free Trial" : "Get Started"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
