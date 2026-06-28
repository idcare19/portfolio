import { NextResponse } from "next/server";
import { getAnalyticsSummary } from "@/lib/analytics";
import { requireAdminSession } from "@/lib/admin/server";

export const runtime = "nodejs";

export async function GET() {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;

  const summary = await getAnalyticsSummary();
  return NextResponse.json({ ok: true, ...summary });
}
