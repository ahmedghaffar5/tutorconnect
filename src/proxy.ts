import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export const config = {
  matcher: [
    "/dashboard/:path*", "/login", "/signup",
    "/student/:path*", "/parent/:path*", "/tutor/:path*", "/admin/:path*",
    "/billing/:path*", "/messages/:path*", "/booking-confirmation/:path*",
  ],
};

async function getUserRole(request: NextRequest): Promise<string | null> {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        },
      },
    }
  );
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  return user.user_metadata?.role as string || null;
}

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });
  const pathname = request.nextUrl.pathname;
  const role = await getUserRole(request);

  // Public routes - always accessible
  const publicPaths = ["/login", "/signup", "/", "/tutors", "/subjects", "/pricing", "/contact", "/how-it-works", "/for-students", "/for-parents", "/become-a-tutor", "/safety", "/about", "/faq", "/privacy", "/terms"];
  const isPublic = publicPaths.some(p => pathname === p || pathname.startsWith("/subjects/") || pathname.startsWith("/tutors/") || pathname.startsWith("/api/"));
  if (isPublic) return supabaseResponse;

  // Auth check
  if (!role) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  // Role-based route protection
  const rolePrefixes: Record<string, string[]> = {
    student: ["/student", "/dashboard/student"],
    parent: ["/parent", "/dashboard/student"],
    tutor: ["/tutor", "/dashboard/teacher", "/dashboard/tutor"],
    admin: ["/admin", "/dashboard/admin"],
  };

  // Check if path matches any role prefix
  for (const [allowedRole, prefixes] of Object.entries(rolePrefixes)) {
    if (prefixes.some(p => pathname.startsWith(p))) {
      if (role !== allowedRole && !(allowedRole === "parent" && pathname.startsWith("/dashboard/student"))) {
        // Redirect to appropriate dashboard
        const dashboardMap: Record<string, string> = {
          student: "/student/dashboard", parent: "/parent/dashboard",
          tutor: "/tutor/dashboard", admin: "/admin/dashboard",
        };
        const url = request.nextUrl.clone();
        url.pathname = dashboardMap[role] || "/";
        return NextResponse.redirect(url);
      }
    }
  }

  return supabaseResponse;
}
