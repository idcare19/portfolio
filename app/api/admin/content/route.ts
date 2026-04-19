import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin/server";
import { siteData } from "@/src/lib/site-data";

export async function GET() {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;

  return NextResponse.json({ ok: true, data: siteData });
}
