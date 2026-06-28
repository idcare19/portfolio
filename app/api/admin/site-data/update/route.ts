import { NextResponse } from "next/server";
import { syncGitHubStats } from "@/lib/github-stats";
import { requireAdminSession } from "@/lib/admin/server";
import { DEFAULT_REVALIDATE_PATHS, saveSiteData } from "@/lib/site-data-store";
import { normalizeSiteData } from "@/lib/site-data-transform";

export const runtime = "nodejs";

function previewSavedFields(body: Record<string, unknown>, savedData: Record<string, unknown>) {
  const keys = ["owner", "websiteSettings", "githubConfig", "sections", "socials", "shell"] as const;
  return keys.reduce<Record<string, unknown>>((acc, key) => {
    if (body[key] !== undefined || savedData[key] !== undefined) {
      acc[key] = savedData[key] ?? body[key];
    }
    return acc;
  }, {});
}

export async function POST(request: Request) {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;

  try {
    const body = await request.json();
    const incomingSiteData = normalizeSiteData((body?.data ?? body) as Parameters<typeof normalizeSiteData>[0]);
    console.log("[SAVE RECEIVED about.items]", incomingSiteData?.sections?.about?.items);
    console.log("[UPDATE ROUTE incoming about.items]", incomingSiteData?.sections?.about?.items);

    const nextData = {
      ...incomingSiteData,
      githubConfig: incomingSiteData.githubConfig
        ? {
            ...incomingSiteData.githubConfig,
            token: "",
          }
        : incomingSiteData.githubConfig,
      updatedAt: new Date().toISOString(),
    };

    const saved = await saveSiteData(nextData);
    let githubSync: { success: boolean; error?: string } | null = null;

    if (saved.data.githubConfig?.enabled && saved.data.githubConfig.username) {
      githubSync = await syncGitHubStats(saved.data.githubConfig.username);
    }

    console.log("[admin save] returning json", {
      success: true,
      updatedAt: saved.data.updatedAt,
    });
    console.log("[AFTER SAVE READBACK about.items]", saved.data?.sections?.about?.items);

    return NextResponse.json({
      success: true,
      ok: true,
      data: saved.data,
      activeSource: saved.activeSource,
      source: saved.activeSource,
      requestedSource: saved.requestedSource,
      fallbackActivated: saved.fallbackActivated,
      savedFieldPreview: previewSavedFields(body || {}, saved.data),
      revalidatedPaths: DEFAULT_REVALIDATE_PATHS,
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
