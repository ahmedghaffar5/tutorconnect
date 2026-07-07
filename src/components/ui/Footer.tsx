import Link from "next/link";
import { GraduationCap, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <GraduationCap className="h-8 w-8 text-emerald-400" />
              <span className="text-xl font-bold text-white">TutorConnect</span>
            </div>
            <p className="text-sm">
              Connecting students with qualified tutors for personalized online
              learning.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <div className="space-y-2 text-sm">
              <Link
                href="/subjects"
                className="block hover:text-emerald-400 transition-colors"
              >
                Subjects
              </Link>
              <Link
                href="/tutors"
                className="block hover:text-emerald-400 transition-colors"
              >
                Tutors
              </Link>
              <Link
                href="/pricing"
                className="block hover:text-emerald-400 transition-colors"
              >
                Pricing
              </Link>
              <Link
                href="/book-trial"
                className="block hover:text-emerald-400 transition-colors"
              >
                Book a Trial
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Subjects</h3>
            <div className="space-y-2 text-sm">
              <Link
                href="/subjects/mathematics"
                className="block hover:text-emerald-400 transition-colors"
              >
                Mathematics
              </Link>
              <Link
                href="/subjects/english"
                className="block hover:text-emerald-400 transition-colors"
              >
                English
              </Link>
              <Link
                href="/subjects/quran"
                className="block hover:text-emerald-400 transition-colors"
              >
                Quran
              </Link>
              <Link
                href="/subjects/coding"
                className="block hover:text-emerald-400 transition-colors"
              >
                Coding
              </Link>
              <Link
                href="/subjects"
                className="block hover:text-emerald-400 transition-colors"
              >
                View All
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-emerald-400" />
                <span>info@tutorconnect.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-emerald-400" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-emerald-400" />
                <span>Online - Anywhere</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} TutorConnect. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
