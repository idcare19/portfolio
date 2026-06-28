import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin/server";
import { getPortfolioSiteData } from "@/lib/portfolio/repository";
import { normalizeSiteData } from "@/lib/site-data-transform";

export const runtime = "nodejs";

export async function GET() {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;

  try {
    const data = await getPortfolioSiteData();
    const normalized = normalizeSiteData(data);
    return NextResponse.json({
      success: true,
      ok: true,
      data: normalized,
      source: "mongodb",
      requestedSource: "mongodb",
      fallbackActivated: false,
      meta: {
        lastMongoUpdateAt: data.updatedAt || null,
        lastGitHubSyncAt: data.websiteControl?.syncStatus?.lastGitHubSync || null,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        ok: false,
        reason: error instanceof Error ? error.message : "Failed to load site data",
      },
      { status: 500 }
    );
  }
}
