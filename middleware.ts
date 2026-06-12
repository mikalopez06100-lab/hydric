import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { GRANT_COOKIE, applyGrantToUser } from "@/lib/access";

function isPublicPath(pathname: string): boolean {
  if (pathname === "/") return true;
  return (
    pathname.startsWith("/login") ||
    pathname.startsWith("/auth/callback") ||
    pathname.startsWith("/onboarding") ||
    pathname.startsWith("/acces") ||
    pathname.startsWith("/success") ||
    pathname.startsWith("/api/checkout") ||
    pathname.startsWith("/api/redeem-code") ||
    pathname.startsWith("/api/auth/dev-login") ||
    (pathname.startsWith("/api/scales/") && pathname.endsWith("/callback")) ||
    pathname.startsWith("/api/cron/")
  );
}

function withCookies(from: NextResponse, to: NextResponse) {
  from.cookies.getAll().forEach(({ name, value, ...options }) => {
    to.cookies.set(name, value, options);
  });
  return to;
}

export async function middleware(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.next();
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => {
          supabaseResponse.cookies.set(name, value, options);
        });
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const isPublic = isPublicPath(pathname);
  const isWebhook = pathname.startsWith("/api/webhooks");

  if (!user && !isPublic && !isWebhook) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    return withCookies(supabaseResponse, NextResponse.redirect(loginUrl));
  }

  if (user && pathname.startsWith("/login")) {
    const dashUrl = request.nextUrl.clone();
    dashUrl.pathname = "/dashboard";
    return withCookies(supabaseResponse, NextResponse.redirect(dashUrl));
  }

  if (user) {
    const grantToken = request.cookies.get(GRANT_COOKIE)?.value;
    if (grantToken) {
      await applyGrantToUser(user.id, grantToken);
      supabaseResponse.cookies.set(GRANT_COOKIE, "", { maxAge: 0, path: "/" });
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icons/|sw.js|manifest.json).*)",
  ],
};
