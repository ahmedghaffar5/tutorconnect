import Link from "next/link";
import { GraduationCap, Mail, Phone, MapPin, Globe, Camera, Video, MessageCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white">TutorConnect</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              Connecting students with qualified tutors for personalized online learning since 2024.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors">
                <Globe className="h-4 w-4" />
              </a>
              <a href="#" className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors">
                <Camera className="h-4 w-4" />
              </a>
              <a href="#" className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors">
                <Video className="h-4 w-4" />
              </a>
              <a href="#" className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors">
                <MessageCircle className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">Quick Links</h3>
            <div className="space-y-2.5 text-sm">
              <Link href="/subjects" className="block hover:text-blue-400 transition-colors">Subjects</Link>
              <Link href="/tutors" className="block hover:text-blue-400 transition-colors">Tutors</Link>
              <Link href="/pricing" className="block hover:text-blue-400 transition-colors">Pricing</Link>
              <Link href="/book-trial" className="block hover:text-blue-400 transition-colors">Book a Trial</Link>
              <Link href="/contact" className="block hover:text-blue-400 transition-colors">Contact</Link>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">Subjects</h3>
            <div className="space-y-2.5 text-sm">
              <Link href="/subjects/mathematics" className="block hover:text-blue-400 transition-colors">Mathematics</Link>
              <Link href="/subjects/english" className="block hover:text-blue-400 transition-colors">English</Link>
              <Link href="/subjects/quran" className="block hover:text-blue-400 transition-colors">Quran</Link>
              <Link href="/subjects/coding" className="block hover:text-blue-400 transition-colors">Coding</Link>
              <Link href="/subjects/science" className="block hover:text-blue-400 transition-colors">Science</Link>
              <Link href="/subjects" className="block text-blue-400 hover:text-blue-300 transition-colors font-medium">View All</Link>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">For Tutors</h3>
            <div className="space-y-2.5 text-sm">
              <Link href="/signup" className="block hover:text-blue-400 transition-colors">Become a Tutor</Link>
              <Link href="/dashboard/tutor" className="block hover:text-blue-400 transition-colors">Tutor Dashboard</Link>
              <Link href="/pricing" className="block hover:text-blue-400 transition-colors">Set Your Rate</Link>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">Contact</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-blue-400 flex-shrink-0" />
                <span className="text-gray-400">info@tutorconnect.com</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-blue-400 flex-shrink-0" />
                <span className="text-gray-400">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2.5">
                <MapPin className="h-4 w-4 text-blue-400 flex-shrink-0" />
                <span className="text-gray-400">Online - Anywhere</span>
              </div>
              <a href="mailto:info@tutorconnect.com" className="inline-block mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                Email Us
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} TutorConnect. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="#" className="hover:text-gray-300 transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-gray-300 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
