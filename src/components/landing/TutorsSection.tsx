import Link from "next/link";
import { Star, ArrowRight } from "lucide-react";

const tutors = [
  {
    name: "Dr. Sarah Chen",
    subject: "Mathematics Specialist",
    rating: 4.9,
    reviews: 128,
    badges: ["Calculus", "SAT Prep"],
    color: "bg-primary-fixed text-on-primary-fixed",
  },
  {
    name: "James Wilson",
    subject: "Full-Stack Developer",
    rating: 5.0,
    reviews: 95,
    badges: ["React", "Node.js"],
    color: "bg-secondary-container text-on-secondary-container",
  },
  {
    name: "Elena Rodriguez",
    subject: "Spanish & Linguistics",
    rating: 4.8,
    reviews: 210,
    badges: ["Native Speaker", "Business Spanish"],
    color: "bg-tertiary-fixed text-on-tertiary-fixed",
  },
  {
    name: "Prof. Michael Hart",
    subject: "History & Literature",
    rating: 4.9,
    reviews: 156,
    badges: ["World History", "Essay Writing"],
    color: "bg-surface-container-high text-on-surface",
  },
];

export default function TutorsSection() {
  return (
    <section className="py-3xl">
      <div className="max-w-container-max mx-auto px-lg">
        <div className="text-center mb-3xl">
          <h2 className="font-headline-md text-on-surface mb-sm">Top-Rated Tutors</h2>
          <p className="font-body-md text-on-surface-variant max-w-xl mx-auto">
            Vetted professionals with years of teaching experience from top global institutions.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-lg">
          {tutors.map((tutor) => (
            <div key={tutor.name} className="bg-surface rounded-2xl p-md border border-outline-variant tutor-card-shadow flex flex-col items-center text-center">
              <div className={`w-24 h-24 rounded-full ${tutor.color} flex items-center justify-center mb-md border-4 border-surface-container text-2xl font-bold`}>
                {tutor.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <h3 className="font-headline-sm text-on-surface">{tutor.name}</h3>
              <span className="font-label-sm text-primary mb-sm">{tutor.subject}</span>
              <div className="flex items-center gap-xs mb-md">
                <Star className="h-4 w-4 text-tertiary fill-tertiary" />
                <span className="font-label-md font-bold">{tutor.rating}</span>
                <span className="font-label-sm text-on-surface-variant">({tutor.reviews} reviews)</span>
              </div>
              <div className="flex flex-wrap justify-center gap-xs mb-lg">
                {tutor.badges.map((b) => (
                  <span key={b} className="px-sm py-xs bg-secondary-container text-on-secondary-container rounded-full text-[10px] font-bold">{b}</span>
                ))}
              </div>
              <Link href="/book-trial" className="mt-auto w-full py-sm border border-primary text-primary rounded-lg font-label-md hover:bg-primary-fixed transition-colors">
                Book a Session
              </Link>
            </div>
          ))}
        </div>
        <div className="text-center mt-xl">
          <Link href="/tutors" className="text-primary font-label-md flex items-center gap-xs justify-center hover:underline">
            View All Tutors <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
