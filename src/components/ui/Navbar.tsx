"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, GraduationCap, User, Settings, LogOut, ChevronDown, BookOpen, Users, CreditCard, Phone } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter, usePathname } from "next/navigation";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  const fetchProfile = async () => {
    const { data: authData } = await supabase.auth.getUser();
    const u = authData?.user;
    if (!u) { setUser(null); setProfile(null); return; }
    setUser(u);
    const meta = u.user_metadata as Record<string, string> | undefined;
    const { data: dbProfile } = await supabase.from("users").select("*").eq("id", u.id).single();
    if (dbProfile) {
      setProfile(dbProfile);
    } else if (meta) {
      setProfile({ full_name: meta.full_name || u.email || "User", role: meta.role || "student" });
    } else {
      setProfile({ full_name: u.email || "User", role: "student" });
    }
  };

  useEffect(() => {
    fetchProfile();
    window.addEventListener("profile-updated", fetchProfile);
    return () => window.removeEventListener("profile-updated", fetchProfile);
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
            <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">TutorConnect</span>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            <Link href="/subjects" className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
              <BookOpen className="h-4 w-4" /> Subjects
            </Link>
            <Link href="/tutors" className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
              <Users className="h-4 w-4" /> Tutors
            </Link>
            <Link href="/pricing" className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
              <CreditCard className="h-4 w-4" /> Pricing
            </Link>
            <Link href="/contact" className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
              <Phone className="h-4 w-4" /> Contact
            </Link>
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <Link href="/book-trial" className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm shadow-sm">
              Book Free Trial
            </Link>
            {user ? (
              <div className="relative">
                <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center gap-2 pl-3 pr-2 py-2 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200">
                  <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-blue-600">{initials}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-700 max-w-[100px] truncate">{profile?.full_name || "User"}</span>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </button>
                {dropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 z-20 py-2">
                      <div className="px-4 py-2.5 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900 truncate">{profile?.full_name || "User"}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                      <Link href={getDashboardLink()} onClick={() => setDropdownOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                        <User className="h-4 w-4" /> Dashboard
                      </Link>
                      {profile?.role !== "tutor" && profile?.role !== "admin" && (
                        <Link href="/apply" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-emerald-600 hover:bg-emerald-50">
                          <GraduationCap className="h-4 w-4" /> Become a Tutor
                        </Link>
                      )}
                      <Link href="/dashboard/profile" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                        <Settings className="h-4 w-4" /> Profile Settings
                      </Link>
                      <hr className="my-1 border-gray-100" />
                      <button onClick={handleLogout} className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50">
                        <LogOut className="h-4 w-4" /> Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-blue-600 px-4 py-2 hover:bg-blue-50 rounded-lg transition-colors">
                Login
              </Link>
            )}
          </div>

          <button onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden p-2.5 rounded-lg hover:bg-gray-100 text-gray-600">
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200 pb-4 max-h-[80vh] overflow-y-auto">
          <div className="px-4 pt-2 space-y-1">
            <Link href="/subjects" className="flex items-center gap-3 px-3 py-2.5 text-gray-700 hover:bg-blue-50 rounded-lg" onClick={() => setMenuOpen(false)}>
              <BookOpen className="h-4 w-4 text-blue-600" /> Subjects
            </Link>
            <Link href="/tutors" className="flex items-center gap-3 px-3 py-2.5 text-gray-700 hover:bg-blue-50 rounded-lg" onClick={() => setMenuOpen(false)}>
              <Users className="h-4 w-4 text-blue-600" /> Tutors
            </Link>
            <Link href="/pricing" className="flex items-center gap-3 px-3 py-2.5 text-gray-700 hover:bg-blue-50 rounded-lg" onClick={() => setMenuOpen(false)}>
              <CreditCard className="h-4 w-4 text-blue-600" /> Pricing
            </Link>
            <Link href="/contact" className="flex items-center gap-3 px-3 py-2.5 text-gray-700 hover:bg-blue-50 rounded-lg" onClick={() => setMenuOpen(false)}>
              <Phone className="h-4 w-4 text-blue-600" /> Contact
            </Link>
            {user ? (
              <>
                <hr className="my-2 border-gray-100" />
                <div className="px-3 py-2">
                  <p className="text-sm font-medium text-gray-900 truncate">{profile?.full_name || "User"}</p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
                <Link href={getDashboardLink()} className="flex items-center gap-3 px-3 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg" onClick={() => setMenuOpen(false)}>
                  <User className="h-4 w-4" /> Dashboard
                </Link>
                {profile?.role !== "tutor" && profile?.role !== "admin" && (
                  <Link href="/apply" className="flex items-center gap-3 px-3 py-2.5 text-emerald-600 hover:bg-emerald-50 rounded-lg" onClick={() => setMenuOpen(false)}>
                    <GraduationCap className="h-4 w-4" /> Become a Tutor
                  </Link>
                )}
                <Link href="/dashboard/profile" className="flex items-center gap-3 px-3 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg" onClick={() => setMenuOpen(false)}>
                  <Settings className="h-4 w-4" /> Profile Settings
                </Link>
                <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="flex items-center gap-3 w-full px-3 py-2.5 text-red-600 hover:bg-red-50 rounded-lg">
                  <LogOut className="h-4 w-4" /> Logout
                </button>
              </>
            ) : (
              <div className="pt-2 space-y-2">
                <Link href="/login" className="block px-3 py-2.5 text-center text-gray-700 border border-gray-200 rounded-lg font-medium" onClick={() => setMenuOpen(false)}>Login</Link>
                <Link href="/book-trial" className="block px-3 py-2.5 text-center bg-blue-600 text-white rounded-lg font-medium" onClick={() => setMenuOpen(false)}>Book Free Trial</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
