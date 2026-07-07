import Hero from "@/components/landing/Hero";
import SubjectsSection from "@/components/landing/SubjectsSection";
import TutorsSection from "@/components/landing/TutorsSection";
import PricingSection from "@/components/landing/PricingSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import CTASection from "@/components/landing/CTASection";

export default function Home() {
  return (
    <>
      <Hero />
      <SubjectsSection />
      <TutorsSection />
      <PricingSection />
      <TestimonialsSection />
      <CTASection />
    </>
  );
}
