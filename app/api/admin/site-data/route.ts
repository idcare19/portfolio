import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin/server";
import { getSiteContentState } from "@/lib/site-data-store";

export const runtime = "nodejs";

export async function GET() {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;

  try {
    const state = await getSiteContentState();
    return NextResponse.json({
      success: true,
      ok: true,
      data: state.data,
      source: state.activeSource,
      requestedSource: state.requestedSource,
      fallbackActivated: state.fallbackActivated,
      meta: {
        lastMongoUpdateAt: state.lastMongoUpdateAt,
        lastGitHubSyncAt: state.lastGitHubSyncAt,
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
