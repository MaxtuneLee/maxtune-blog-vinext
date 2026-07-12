import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { defaultLocale } from "@/lib/i18n";

// Next 16 renamed the middleware file convention to "proxy" — this is not
// middleware.ts. See MIGRATION_NOTES.md / node_modules/next/dist/docs.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // /en/... is already locale-prefixed, serve as-is.
  if (pathname === "/en" || pathname.startsWith("/en/")) {
    return NextResponse.next();
  }

  // zh is the default locale and is served unprefixed; redirect anyone who
  // types /zh/... explicitly to the canonical unprefixed URL.
  if (pathname === "/zh" || pathname.startsWith("/zh/")) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(3) || "/";
    return NextResponse.redirect(url);
  }

  // Everything else is an unprefixed zh URL — rewrite internally to
  // /zh/... so it resolves under app/[lang]/, keeping the visible URL as-is.
  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!_next|api|opengraph-image|.*\\..*).*)"],
};
