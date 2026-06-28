import { NextResponse } from "next/server";
import { syncGitHubStats } from "@/lib/github-stats";
import { requireAdminSession } from "@/lib/admin/server";
import { getSiteContentState, saveSiteData } from "@/lib/site-data-store";
import { normalizeSiteData } from "@/lib/site-data-transform";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;

  try {
    const body = await request.json();
    const state = await getSiteContentState("mongodb");
    const incomingGithubConfig = body?.githubConfig
      ? {
          ...body.githubConfig,
        }
      : null;
    if (incomingGithubConfig) {
      delete incomingGithubConfig.token;
    }
    const nextData = normalizeSiteData({
      ...state.data,
      ...body,
      githubConfig: incomingGithubConfig
        ? {
            ...state.data.githubConfig,
            ...incomingGithubConfig,
          }
        : state.data.githubConfig,
      updatedAt: new Date().toISOString(),
    });

    const saved = await saveSiteData(nextData);
    let githubSync: { success: boolean; error?: string } | null = null;

    if (saved.data.githubConfig?.enabled && saved.data.githubConfig.username) {
      githubSync = await syncGitHubStats(saved.data.githubConfig.username);
    }

    return NextResponse.json({
      success: true,
      ok: true,
      data: saved.data,
      source: saved.activeSource,
      requestedSource: saved.requestedSource,
      fallbackActivated: saved.fallbackActivated,
      meta: {
        lastMongoUpdateAt: saved.lastMongoUpdateAt,
        lastGitHubSyncAt: saved.lastGitHubSyncAt,
      },
      githubSync,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        ok: false,
        reason: error instanceof Error ? error.message : "Failed to update site data",
      },
      { status: 500 }
    );
  }
}
