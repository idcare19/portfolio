import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin/server";
import { getAssistantRuntimeStatus } from "@/lib/assistant";
import { getFullSiteData } from "@/src/lib/site-data";

export const runtime = "nodejs";

export async function GET() {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;

  const siteData = await getFullSiteData();
  const status = getAssistantRuntimeStatus();

  return NextResponse.json({
    ok: true,
    data: {
      config: siteData.aiConfig,
      geminiConfigured: status.geminiConfigured,
      cacheEntries: status.cacheEntries,
      logs: status.logs,
    },
  });
}
