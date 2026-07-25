import Link from "next/link";
import { GraduationCap, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-surface-container-lowest border-t border-outline-variant">
      <div className="w-full py-xl px-lg max-w-container-max mx-auto flex flex-col md:flex-row justify-between items-center gap-md">
        <div className="flex flex-col items-center md:items-start gap-xs">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-primary" />
            <span className="font-headline-sm font-bold text-on-surface">TutorConnect</span>
          </div>
          <p className="font-body-sm text-on-surface-variant opacity-80">
            &copy; {new Date().getFullYear()} TutorConnect. Empowering learners worldwide.
          </p>
        </div>
        <nav className="flex gap-lg flex-wrap justify-center">
          <Link href="/tutors" className="font-body-sm text-on-surface-variant hover:text-primary transition-colors">Find Tutors</Link>
          <Link href="/subjects" className="font-body-sm text-on-surface-variant hover:text-primary transition-colors">Subjects</Link>
          <Link href="/pricing" className="font-body-sm text-on-surface-variant hover:text-primary transition-colors">Pricing</Link>
          <Link href="/contact" className="font-body-sm text-on-surface-variant hover:text-primary transition-colors">Contact</Link>
          <Link href="/apply" className="font-body-sm text-on-surface-variant hover:text-primary transition-colors">Become a Tutor</Link>
        </nav>
      </div>
    </footer>
  );
}
