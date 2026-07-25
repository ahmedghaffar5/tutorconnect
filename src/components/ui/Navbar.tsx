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
    <nav className="bg-surface shadow-sm sticky top-0 z-50">
      <div className="flex justify-between items-center w-full px-lg md:px-xl max-w-container-max mx-auto h-16">
        <div className="flex items-center gap-xl">
          <Link href="/" className="font-headline-sm font-bold text-primary flex items-center gap-2">
            <GraduationCap className="h-6 w-6" />
            TutorConnect
          </Link>
          <div className="hidden md:flex items-center gap-lg">
            <Link href="/tutors" className={`font-body-md transition-colors ${pathname === "/tutors" || pathname.startsWith("/tutors") ? "text-primary font-bold border-b-2 border-primary pb-1" : "text-on-surface-variant hover:text-primary"}`}>
              Find Tutors
            </Link>
            <Link href="/subjects" className={`font-body-md transition-colors ${pathname.startsWith("/subjects") ? "text-primary font-bold border-b-2 border-primary pb-1" : "text-on-surface-variant hover:text-primary"}`}>
              Subjects
            </Link>
            <Link href="/pricing" className={`font-body-md transition-colors ${pathname === "/pricing" ? "text-primary font-bold border-b-2 border-primary pb-1" : "text-on-surface-variant hover:text-primary"}`}>
              Pricing
            </Link>
            <Link href="/apply" className="font-body-md text-on-surface-variant hover:text-primary transition-colors">
              Become a Tutor
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-md">
          <button className="hidden sm:block text-primary hover:bg-surface-container transition-colors px-md py-sm rounded-lg font-label-md">
            <Link href="/book-trial" className="bg-primary text-on-primary px-lg py-sm rounded-lg font-label-md shadow-sm hover:opacity-90 transition-opacity">
              Book Free Trial
            </Link>
          </button>
          {user ? (
            <div className="relative">
              <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center gap-2 pl-3 pr-2 py-2 rounded-lg hover:bg-surface-container-low transition-colors border border-outline-variant">
                <div className="w-7 h-7 bg-primary-fixed rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-on-primary-fixed">{initials}</span>
                </div>
                <span className="text-sm font-medium text-on-surface max-w-[100px] truncate hidden md:block">{profile?.full_name || "User"}</span>
                <ChevronDown className="h-4 w-4 text-on-surface-variant" />
              </button>
              {dropdownOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
                  <div className="absolute right-0 mt-2 w-56 bg-surface-container-lowest rounded-xl shadow-lg border border-outline-variant z-20 py-2">
                    <div className="px-4 py-2.5 border-b border-outline-variant">
                      <p className="text-sm font-medium text-on-surface truncate">{profile?.full_name || "User"}</p>
                      <p className="text-xs text-on-surface-variant truncate">{user.email}</p>
                    </div>
                    <Link href={getDashboardLink()} onClick={() => setDropdownOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-on-surface hover:bg-surface-container-low">
                      <User className="h-4 w-4" /> Dashboard
                    </Link>
                    {profile?.role !== "tutor" && profile?.role !== "admin" && (
                      <Link href="/apply" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-secondary hover:bg-secondary-container/20">
                        <GraduationCap className="h-4 w-4" /> Become a Tutor
                      </Link>
                    )}
                    <Link href="/dashboard/profile" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-on-surface hover:bg-surface-container-low">
                      <Settings className="h-4 w-4" /> Profile Settings
                    </Link>
                    <hr className="my-1 border-outline-variant" />
                    <button onClick={handleLogout} className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-error hover:bg-error-container">
                      <LogOut className="h-4 w-4" /> Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-md">
              <Link href="/login" className="text-primary hover:bg-surface-container transition-colors px-md py-sm rounded-lg font-label-md">
                Sign In
              </Link>
              <Link href="/signup" className="bg-primary text-on-primary px-lg py-sm rounded-lg font-label-md shadow-sm hover:opacity-90 transition-opacity">
                Sign Up
              </Link>
            </div>
          )}
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2.5 rounded-lg hover:bg-surface-container-low text-on-surface-variant">
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-surface border-t border-outline-variant pb-4 max-h-[80vh] overflow-y-auto">
          <div className="px-4 pt-2 space-y-1">
            <Link href="/tutors" className="flex items-center gap-3 px-3 py-2.5 text-on-surface hover:bg-surface-container-low rounded-lg" onClick={() => setMenuOpen(false)}>
              <Users className="h-4 w-4 text-primary" /> Find Tutors
            </Link>
            <Link href="/subjects" className="flex items-center gap-3 px-3 py-2.5 text-on-surface hover:bg-surface-container-low rounded-lg" onClick={() => setMenuOpen(false)}>
              <BookOpen className="h-4 w-4 text-primary" /> Subjects
            </Link>
            <Link href="/pricing" className="flex items-center gap-3 px-3 py-2.5 text-on-surface hover:bg-surface-container-low rounded-lg" onClick={() => setMenuOpen(false)}>
              <CreditCard className="h-4 w-4 text-primary" /> Pricing
            </Link>
            <Link href="/contact" className="flex items-center gap-3 px-3 py-2.5 text-on-surface hover:bg-surface-container-low rounded-lg" onClick={() => setMenuOpen(false)}>
              <Phone className="h-4 w-4 text-primary" /> Contact
            </Link>
            <Link href="/apply" className="flex items-center gap-3 px-3 py-2.5 text-secondary hover:bg-secondary-container/20 rounded-lg" onClick={() => setMenuOpen(false)}>
              <GraduationCap className="h-4 w-4" /> Become a Tutor
            </Link>
            {user ? (
              <>
                <hr className="my-2 border-outline-variant" />
                <div className="px-3 py-2">
                  <p className="text-sm font-medium text-on-surface truncate">{profile?.full_name || "User"}</p>
                  <p className="text-xs text-on-surface-variant truncate">{user.email}</p>
                </div>
                <Link href={getDashboardLink()} className="flex items-center gap-3 px-3 py-2.5 text-on-surface hover:bg-surface-container-low rounded-lg" onClick={() => setMenuOpen(false)}>
                  <User className="h-4 w-4" /> Dashboard
                </Link>
                <Link href="/dashboard/profile" className="flex items-center gap-3 px-3 py-2.5 text-on-surface hover:bg-surface-container-low rounded-lg" onClick={() => setMenuOpen(false)}>
                  <Settings className="h-4 w-4" /> Profile Settings
                </Link>
                <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="flex items-center gap-3 w-full px-3 py-2.5 text-error hover:bg-error-container rounded-lg">
                  <LogOut className="h-4 w-4" /> Logout
                </button>
              </>
            ) : (
              <div className="pt-2 space-y-2">
                <Link href="/login" className="block px-3 py-2.5 text-center text-on-surface border border-outline-variant rounded-lg font-label-md" onClick={() => setMenuOpen(false)}>Sign In</Link>
                <Link href="/signup" className="block px-3 py-2.5 text-center bg-primary text-on-primary rounded-lg font-label-md" onClick={() => setMenuOpen(false)}>Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
