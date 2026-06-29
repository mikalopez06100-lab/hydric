import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { GRANT_COOKIE, applyGrantToUser } from "@/lib/access";
import {
  appUrl,
  isAppHost,
  isDomainSplit,
  isMarketingHost,
  isMarketingOnlyPath,
  marketingUrl,
} from "@/lib/domains";

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
    pathname.startsWith("/api/status") ||
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

function redirectExternal(url: string, supabaseResponse: NextResponse) {
  return withCookies(supabaseResponse, NextResponse.redirect(url));
}

export async function middleware(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const hostname = request.headers.get("host") ?? "";
  const pathname = request.nextUrl.pathname;
  const search = request.nextUrl.search;

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

  let user = null;
  try {
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();
    user = authUser;
  } catch {
    // Supabase injoignable — routes publiques restent accessibles
  }

  if (isDomainSplit()) {
    if (isMarketingHost(hostname)) {
      const isApi = pathname.startsWith("/api/");
      if (!isMarketingOnlyPath(pathname) && !isApi) {
        return redirectExternal(
          appUrl(`${pathname}${search}`),
          supabaseResponse
        );
      }
      return supabaseResponse;
    }

    if (isAppHost(hostname) && pathname === "/") {
      const target = user ? "/dashboard" : marketingUrl("/");
      if (target.startsWith("http")) {
        return redirectExternal(target, supabaseResponse);
      }
      const local = request.nextUrl.clone();
      local.pathname = target;
      return withCookies(supabaseResponse, NextResponse.redirect(local));
    }
  }

  const isPublic = isPublicPath(pathname);
  const isWebhook = pathname.startsWith("/api/webhooks");

  if (!user && !isPublic && !isWebhook) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    if (pathname.startsWith("/admin")) {
      loginUrl.searchParams.set("next", `${pathname}${search}`);
    }
    return withCookies(supabaseResponse, NextResponse.redirect(loginUrl));
  }

  if (user && pathname.startsWith("/login")) {
    const dashUrl = request.nextUrl.clone();
    const next = request.nextUrl.searchParams.get("next");
    dashUrl.pathname = next?.startsWith("/") ? next : "/dashboard";
    dashUrl.search = "";
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
    "/((?!_next/static|_next/image|favicon.ico|icons/|brand/|sw.js|manifest.json).*)",
  ],
};
