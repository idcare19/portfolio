import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin/server";
import { syncGitHubToMongo } from "@/lib/site-data-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST() {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;

  try {
    const state = await syncGitHubToMongo();
    return NextResponse.json({
      ok: true,
      message: "GitHub content synced to MongoDB",
      data: state.data,
      source: state.activeSource,
      meta: {
        lastMongoUpdateAt: state.lastMongoUpdateAt,
        lastGitHubSyncAt: state.lastGitHubSyncAt,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "GitHub to MongoDB sync failed",
      },
      { status: 500 }
    );
  }
}
