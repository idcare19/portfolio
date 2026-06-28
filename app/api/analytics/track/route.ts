import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { trackAnalyticsEvent, trackUniqueView } from "@/lib/analytics";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const visitorId = String(body.visitorId || "");
    const sessionId = String(body.sessionId || "");
    const eventType = String(body.eventType || "").trim();
    const path = String(body.path || "/");
    const targetType = body.targetType ? String(body.targetType) : undefined;
    const targetSlug = body.targetSlug ? String(body.targetSlug) : undefined;

    if (!visitorId || !sessionId || !eventType) {
      return NextResponse.json({ ok: false, error: "Missing tracking payload" }, { status: 400 });
    }

    const cookieStore = await cookies();
    cookieStore.set("portfolio_visitor_id", visitorId, { httpOnly: false, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 24 * 365 });
    cookieStore.set("portfolio_session_id", sessionId, { httpOnly: false, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 24 * 7 });

    await trackAnalyticsEvent({
      eventType,
      path,
      targetType,
      targetSlug,
      visitorId,
      sessionId,
      metadata: typeof body.metadata === "object" && body.metadata ? body.metadata : {},
      referrer: request.headers.get("referer") || "",
      userAgent: request.headers.get("user-agent") || "",
    });

    if ((targetType === "project" || targetType === "blog") && targetSlug && eventType === `${targetType}-view`) {
      await trackUniqueView({ targetType, targetSlug, path, visitorId, sessionId });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : "Tracking failed" }, { status: 500 });
  }
}
