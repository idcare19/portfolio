import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin/server";
import { syncMongoToGitHub } from "@/lib/site-data-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST() {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;

  try {
    const state = await syncMongoToGitHub();
    return NextResponse.json({
      ok: true,
      message: "MongoDB content synced to GitHub",
      data: state.data,
      source: state.activeSource,
      meta: {
        lastMongoUpdateAt: state.lastMongoUpdateAt,
        lastGitHubSyncAt: state.lastGitHubSyncAt,
      },
      github: state.github
        ? {
            commitSha: state.github.commit.sha,
            fileSha: state.github.content.sha,
            branch: state.github.branch,
            path: state.github.path,
          }
        : null,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "MongoDB to GitHub sync failed",
      },
      { status: 500 }
    );
  }
}
