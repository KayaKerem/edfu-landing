import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const locales = ["tr", "en"] as const;

function getLocale(request: NextRequest): string {
  const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value;
  if (cookieLocale && locales.includes(cookieLocale as (typeof locales)[number])) {
    return cookieLocale;
  }

  const acceptLang = request.headers.get("accept-language") ?? "";
  if (acceptLang.includes("tr")) return "tr";

  return "en";
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // /tr → redirect to prefix-less (canonical for Turkish)
  if (pathname === "/tr" || pathname.startsWith("/tr/")) {
    const newPath = pathname.replace(/^\/tr/, "") || "/";
    return NextResponse.redirect(new URL(newPath, request.url), 301);
  }

  // /en already has locale prefix — let it through
  if (pathname === "/en" || pathname.startsWith("/en/")) {
    return NextResponse.rewrite(new URL(pathname, request.url));
  }

  // No locale prefix — detect and route
  const locale = getLocale(request);

  if (locale === "en") {
    return NextResponse.redirect(new URL(`/en${pathname}`, request.url), 307);
  }

  // Turkish: rewrite internally to /tr (URL stays as /)
  return NextResponse.rewrite(new URL(`/tr${pathname}`, request.url));
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|ico|webp)$).*)",
  ],
};
