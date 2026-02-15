import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // Protected routes: redirect to login if not authenticated
  const protectedPaths = ["/dashboard", "/project", "/teacher", "/parent", "/admin"];
  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));

  if (isProtected && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Redirect authenticated users away from auth pages with role-based routing
  const authPaths = ["/login", "/register"];
  const isAuthPage = authPaths.some((path) => pathname.startsWith(path));

  if (isAuthPage && user) {
    const role = user.user_metadata?.role || "student";
    const url = request.nextUrl.clone();
    url.pathname = getRoleHomePath(role);
    return NextResponse.redirect(url);
  }

  // Role-based access control: prevent accessing wrong portal
  // Admin can access everything
  if (user && isProtected) {
    const role = user.user_metadata?.role || "student";

    if (role === "admin") {
      // Admin has full access — no redirects
    } else if (role === "student") {
      // Student trying to access teacher/parent/admin portal
      if (pathname.startsWith("/teacher") || pathname.startsWith("/parent/dashboard") || pathname.startsWith("/admin")) {
        const url = request.nextUrl.clone();
        url.pathname = "/dashboard";
        return NextResponse.redirect(url);
      }
    } else if (role === "teacher") {
      // Teacher trying to access student dashboard or admin portal
      if (pathname.startsWith("/dashboard") || pathname.startsWith("/admin")) {
        const url = request.nextUrl.clone();
        url.pathname = "/teacher/dashboard";
        return NextResponse.redirect(url);
      }
    } else if (role === "parent") {
      // Parent trying to access student dashboard, teacher or admin portal
      if (pathname.startsWith("/dashboard") || pathname.startsWith("/teacher") || pathname.startsWith("/admin")) {
        const url = request.nextUrl.clone();
        url.pathname = "/parent/dashboard";
        return NextResponse.redirect(url);
      }
    }
  }

  return supabaseResponse;
}

function getRoleHomePath(role: string): string {
  switch (role) {
    case "admin": return "/admin/dashboard";
    case "teacher": return "/teacher/dashboard";
    case "parent": return "/parent/dashboard";
    default: return "/dashboard";
  }
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
