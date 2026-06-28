import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function isExcludedPath(pathname: string) {
  return (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/maintenance") ||
    pathname.startsWith("/uploads") ||
    pathname === "/favicon.ico"
  );
}

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (pathname.startsWith("/admin")) {
    const isLoginPage = pathname === "/admin/login";
    const hasSessionCookie = Boolean(request.cookies.get("admin_session")?.value);

    if (!isLoginPage && !hasSessionCookie) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/admin/login";
      return NextResponse.redirect(loginUrl);
    }

    if (isLoginPage && hasSessionCookie) {
      const dashboardUrl = request.nextUrl.clone();
      dashboardUrl.pathname = "/admin";
      return NextResponse.redirect(dashboardUrl);
    }

    return NextResponse.next();
  }

  if (isExcludedPath(pathname)) {
    return NextResponse.next();
  }

  let maintenance:
    | {
        enabled?: boolean;
        whitelistAdmin?: boolean;
        allowedRoutes?: string[];
      }
    | undefined;

  try {
    const url = request.nextUrl.clone();
    url.pathname = "/api/site-data";
    url.searchParams.set("_ts", Date.now().toString());

    const response = await fetch(url, {
      headers: {
        "x-internal-proxy": "1",
      },
      cache: "no-store",
    });
    const payload = (await response.json().catch(() => null)) as
      | { data?: { websiteControl?: { maintenanceMode?: typeof maintenance } } }
      | null;

    maintenance = payload?.data?.websiteControl?.maintenanceMode;
  } catch {
    maintenance = undefined;
  }

  if (!maintenance?.enabled) {
    return NextResponse.next();
  }

  if (maintenance.whitelistAdmin && request.cookies.get("admin_session")?.value) {
    return NextResponse.next();
  }

  const allowedRoutes = Array.isArray(maintenance.allowedRoutes) ? maintenance.allowedRoutes : [];
  if (allowedRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = "/maintenance";
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)"],
};
