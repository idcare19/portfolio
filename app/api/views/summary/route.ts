import { NextResponse } from "next/server";
import { getViewSummary } from "@/lib/analytics";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const targetType = searchParams.get("targetType") === "blog" ? "blog" : "project";
  const targetSlug = searchParams.get("targetSlug") || "";
  if (!targetSlug) return NextResponse.json({ ok: false, error: "Missing targetSlug" }, { status: 400 });

  const summary = await getViewSummary(targetType, targetSlug);
  return NextResponse.json({ ok: true, ...summary });
}
