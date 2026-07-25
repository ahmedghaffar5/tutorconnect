import Link from "next/link";
import { GraduationCap } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col items-center md:items-start gap-1">
          <div className="flex items-center gap-2"><GraduationCap className="h-5 w-5 text-indigo-600" /><span className="font-bold text-lg text-gray-900">TutorConnect</span></div>
          <p className="text-sm text-gray-400">&copy; {new Date().getFullYear()} TutorConnect. Empowering learners worldwide.</p>
        </div>
        <nav className="flex gap-6 flex-wrap justify-center">
          <Link href="/tutors" className="text-sm text-gray-400 hover:text-indigo-600 transition-colors">Find Tutors</Link>
          <Link href="/subjects" className="text-sm text-gray-400 hover:text-indigo-600 transition-colors">Subjects</Link>
          <Link href="/pricing" className="text-sm text-gray-400 hover:text-indigo-600 transition-colors">Pricing</Link>
          <Link href="/contact" className="text-sm text-gray-400 hover:text-indigo-600 transition-colors">Contact</Link>
          <Link href="/apply" className="text-sm text-gray-400 hover:text-indigo-600 transition-colors">Become a Tutor</Link>
        </nav>
      </div>
    </footer>
  );
}
