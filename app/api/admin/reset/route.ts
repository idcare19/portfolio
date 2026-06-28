import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin/server";
import { saveSiteData } from "@/lib/site-data-store";
import { normalizeSiteData } from "@/lib/site-data-transform";
import seedData from "@/src/data/siteData.json";

export const runtime = "nodejs";

export async function POST() {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;

  const saved = await saveSiteData(normalizeSiteData(structuredClone(seedData as any)));
  return NextResponse.json({ ok: true, data: saved.data });
}
