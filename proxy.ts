import { NextResponse, type NextRequest } from "next/server";

import { locales } from "@/i18n/config";
import {
  LOCALE_COOKIE_NAME,
  resolvePreferredLocale,
} from "@/lib/locale-routing";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/design" || pathname.startsWith("/design/")) {
    return NextResponse.next();
  }

  const hasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );

  if (hasLocale) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  const preferredLocale = resolvePreferredLocale(
    request.cookies.get(LOCALE_COOKIE_NAME)?.value,
  );
  url.pathname = `/${preferredLocale}${pathname}`;

  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
