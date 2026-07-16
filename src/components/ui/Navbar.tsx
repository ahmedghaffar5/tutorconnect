"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, GraduationCap, User, Settings, LogOut, ChevronDown } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter, usePathname } from "next/navigation";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<{ full_name: string; role: string; phone?: string } | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then((result: any) => {
      const u = result.data?.user;
      if (u) {
        setUser(u);
        supabase
          .from("users")
          .select("*")
          .eq("id", u.id)
          .single()
          .then((res: any) => {
            if (res.data) setProfile(res.data);
          });
      }
    });
  }, [pathname]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setDropdownOpen(false);
    router.push("/");
    router.refresh();
  };

  const initials = profile?.full_name
    ? profile.full_name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : user?.email?.charAt(0).toUpperCase() || "?";

  const getDashboardLink = () => {
    const r = profile?.role;
    if (r === "admin") return "/dashboard/admin";
    if (r === "tutor") return "/dashboard/tutor";
    return "/dashboard/student";
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-emerald-600" />
            <span className="text-xl font-bold text-gray-900">TutorConnect</span>
          </Link>

          <div className="hidden md:flex items-center gap-4">
            <Link href="/subjects" className="text-gray-600 hover:text-emerald-600 transition-colors font-medium">
              Subjects
            </Link>
            <Link href="/tutors" className="text-gray-600 hover:text-emerald-600 transition-colors font-medium">
              Tutors
            </Link>
            <Link href="/pricing" className="text-gray-600 hover:text-emerald-600 transition-colors font-medium">
              Pricing
            </Link>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-emerald-600">{initials}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-700">{profile?.full_name || "User"}</span>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </button>

                {dropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 z-20 py-2">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{profile?.full_name || "User"}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                      <Link
                        href={getDashboardLink()}
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <User className="h-4 w-4" /> Dashboard
                      </Link>
                      <Link
                        href="/dashboard/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <Settings className="h-4 w-4" /> Profile Settings
                      </Link>
                      <hr className="my-1 border-gray-100" />
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="h-4 w-4" /> Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/book-trial"
                  className="bg-emerald-600 text-white px-5 py-2 rounded-lg hover:bg-emerald-700 transition-colors font-medium text-sm"
                >
                  Book Trial
                </Link>
                <Link href="/login" className="text-gray-600 hover:text-emerald-600 transition-colors font-medium text-sm">
                  Login
                </Link>
              </div>
            )}
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
            <Link href="/subjects" className="block px-3 py-2 text-gray-600 hover:bg-emerald-50 rounded-lg" onClick={() => setMenuOpen(false)}>Subjects</Link>
            <Link href="/tutors" className="block px-3 py-2 text-gray-600 hover:bg-emerald-50 rounded-lg" onClick={() => setMenuOpen(false)}>Tutors</Link>
            <Link href="/pricing" className="block px-3 py-2 text-gray-600 hover:bg-emerald-50 rounded-lg" onClick={() => setMenuOpen(false)}>Pricing</Link>

            {user ? (
              <>
                <div className="px-3 py-2 border-t border-gray-100 mt-2 pt-3">
                  <p className="text-sm font-medium text-gray-900">{profile?.full_name || "User"}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
                <Link href={getDashboardLink()} className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg" onClick={() => setMenuOpen(false)}>
                  Dashboard
                </Link>
                <Link href="/dashboard/profile" className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg" onClick={() => setMenuOpen(false)}>
                  Profile Settings
                </Link>
                <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="block w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg">
                  Logout
                </button>
              </>
            ) : (
              <div className="pt-2 space-y-2">
                <Link href="/book-trial" className="block px-3 py-2 bg-emerald-600 text-white rounded-lg text-center" onClick={() => setMenuOpen(false)}>Book Trial</Link>
                <Link href="/login" className="block px-3 py-2 text-center text-gray-600 hover:bg-emerald-50 rounded-lg" onClick={() => setMenuOpen(false)}>Login</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
