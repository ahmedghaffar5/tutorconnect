"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, GraduationCap } from "lucide-react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-emerald-600" />
            <span className="text-xl font-bold text-gray-900">
              TutorConnect
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/subjects"
              className="text-gray-600 hover:text-emerald-600 transition-colors font-medium"
            >
              Subjects
            </Link>
            <Link
              href="/tutors"
              className="text-gray-600 hover:text-emerald-600 transition-colors font-medium"
            >
              Tutors
            </Link>
            <Link
              href="/pricing"
              className="text-gray-600 hover:text-emerald-600 transition-colors font-medium"
            >
              Pricing
            </Link>
            <Link
              href="/book-trial"
              className="bg-emerald-600 text-white px-5 py-2 rounded-lg hover:bg-emerald-700 transition-colors font-medium"
            >
              Book Trial
            </Link>
            <Link
              href="/login"
              className="text-gray-600 hover:text-emerald-600 transition-colors font-medium"
            >
              Login
            </Link>
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 text-gray-600"
          >
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 pb-4">
          <div className="px-4 space-y-2 pt-2">
            <Link
              href="/subjects"
              className="block px-3 py-2 text-gray-600 hover:bg-emerald-50 rounded-lg"
              onClick={() => setMenuOpen(false)}
            >
              Subjects
            </Link>
            <Link
              href="/tutors"
              className="block px-3 py-2 text-gray-600 hover:bg-emerald-50 rounded-lg"
              onClick={() => setMenuOpen(false)}
            >
              Tutors
            </Link>
            <Link
              href="/pricing"
              className="block px-3 py-2 text-gray-600 hover:bg-emerald-50 rounded-lg"
              onClick={() => setMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link
              href="/book-trial"
              className="block px-3 py-2 bg-emerald-600 text-white rounded-lg text-center"
              onClick={() => setMenuOpen(false)}
            >
              Book Trial
            </Link>
            <Link
              href="/login"
              className="block px-3 py-2 text-gray-600 hover:bg-emerald-50 rounded-lg"
              onClick={() => setMenuOpen(false)}
            >
              Login
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
