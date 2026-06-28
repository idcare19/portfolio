import { NextResponse } from "next/server";
import { getLikeSummary, getVisitorIdentity } from "@/lib/analytics";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const targetType = searchParams.get("targetType") === "blog" ? "blog" : "project";
  const targetSlug = searchParams.get("targetSlug") || "";
  if (!targetSlug) return NextResponse.json({ ok: false, error: "Missing targetSlug" }, { status: 400 });

  const identity = await getVisitorIdentity();
  const summary = await getLikeSummary(targetType, targetSlug, identity.visitorId);
  return NextResponse.json({ ok: true, ...summary });
}
