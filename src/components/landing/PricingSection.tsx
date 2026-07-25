"use client";

import { useRouter } from "next/navigation";

const plans = [
  { id: "trial", name: "Trial Class", price: "Free", type: "trial", features: ["30-minute session", "Choose any subject", "Meet your tutor", "No commitment"] },
  { id: "single", name: "Single Session", price: "$25", period: "/session", type: "paid", features: ["60-minute session", "One-on-one tutoring", "Choose any tutor", "Flexible scheduling"] },
  { id: "monthly", name: "Monthly", price: "$199", period: "/month", type: "paid", features: ["8 sessions/month", "Same tutor assigned", "Progress tracking", "Homework support"] },
  { id: "premium", name: "Premium Monthly", price: "$349", period: "/month", type: "paid", features: ["16 sessions/month", "Priority scheduling", "Parent reports", "Homework support"] },
];

export default function PricingSection() {
  const router = useRouter();

  return (
    <section className="py-3xl">
      <div className="max-w-container-max mx-auto px-lg">
        <div className="text-center mb-3xl">
          <h2 className="font-headline-md text-on-surface mb-sm">Simple & Transparent Pricing</h2>
          <p className="font-body-md text-on-surface-variant">Choose a plan to get started</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-lg">
          {plans.map((plan) => (
            <div key={plan.id} className={`bg-surface rounded-2xl p-xl border ${plan.id === "monthly" ? "border-primary shadow-lg relative" : "border-outline-variant"} flex flex-col`}>
              {plan.id === "monthly" && (
                <div className="absolute top-0 right-10 -translate-y-1/2 bg-secondary text-on-secondary px-md py-xs rounded-full font-label-sm shadow-md">
                  Most Popular
                </div>
              )}
              <h3 className="font-headline-sm text-on-surface mb-sm">{plan.name}</h3>
              <div className="mb-lg">
                <span className="font-display-lg text-on-surface">{plan.price}</span>
                {plan.period && <span className="font-body-md text-on-surface-variant">{plan.period}</span>}
              </div>
              <ul className="space-y-sm mb-xl flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-sm font-body-sm text-on-surface-variant">
                    <span className="w-4 h-4 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center text-[10px] font-bold">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => router.push(`/book-trial?plan=${plan.id}`)}
                className={`w-full py-md rounded-lg font-label-md transition-all ${
                  plan.id === "monthly"
                    ? "bg-primary text-on-primary shadow-md hover:opacity-90"
                    : "border border-primary text-primary hover:bg-primary-fixed"
                }`}
              >
                {plan.id === "trial" ? "Book Free Trial" : "Get Started"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
