import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin/server";
import { getSiteContentState } from "@/lib/site-data-store";
import { getPortfolioSiteData } from "@/lib/portfolio/repository";
import { toPublicSiteData } from "@/lib/public-site-data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;

  try {
    const activeState = await getSiteContentState();
    const mongoData = await getPortfolioSiteData();
    const publicData = toPublicSiteData(activeState.data);

    return NextResponse.json({
      mongoAboutItems: mongoData.sections?.about?.items || [],
      normalizedAboutItems: activeState.data.sections?.about?.items || [],
      publicAboutItems: publicData.sections?.about?.items || [],
      activeSource: activeState.activeSource,
      updatedAt: activeState.data.updatedAt || null,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Failed to load about debug data",
      },
      { status: 500 }
    );
  }
}
