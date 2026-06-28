import { NextResponse } from "next/server";
import { getLikeSummary, getVisitorIdentity, toggleAnonymousLike, trackAnalyticsEvent } from "@/lib/analytics";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json();
  const targetType = body.targetType === "blog" ? "blog" : "project";
  const targetSlug = String(body.targetSlug || "");
  if (!targetSlug) return NextResponse.json({ ok: false, error: "Missing targetSlug" }, { status: 400 });

  const identity = await getVisitorIdentity();
  const result = await toggleAnonymousLike({ targetType, targetSlug, ...identity });
  await trackAnalyticsEvent({
    eventType: `${targetType}-like`,
    path: `/${targetType}s/${targetSlug}`,
    targetType,
    targetSlug,
    visitorId: identity.visitorId,
    sessionId: identity.sessionId,
    metadata: { liked: result.liked },
  });
  const summary = await getLikeSummary(targetType, targetSlug, identity.visitorId);
  return NextResponse.json({ ok: true, ...summary });
}
