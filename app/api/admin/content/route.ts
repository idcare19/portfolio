import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin/server";
<<<<<<< HEAD
import { syncGitHubStats } from "@/lib/github-stats";
=======
>>>>>>> c974e6d18f7e4d84cefd23b3ad822ac4cf9981fc
import { getSiteContentState, saveSiteData } from "@/lib/site-data-store";
import { normalizeSiteData } from "@/lib/site-data-transform";
import { siteDataSchema } from "@/schemas/site-data";

export const runtime = "nodejs";

function sanitizeCommitMessage(input: string) {
  return input.replace(/[\r\n]+/g, " ").slice(0, 140).trim() || "chore: update website content";
}

function response(success: boolean, message: string, data?: unknown, error?: string, status = 200) {
  return NextResponse.json({ success, ok: success, message, data: data ?? null, error: error ?? null }, { status });
}

export async function GET() {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;

  try {
    const state = await getSiteContentState();
    return response(true, "Content loaded", {
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
    return response(false, "Failed to load content", null, error instanceof Error ? error.message : "Failed to load content", 500);
  }
}

export async function PUT(request: Request) {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;

  try {
    const body = await request.json();
    const payload = body?.data;
    sanitizeCommitMessage(String(body?.commitMessage || "chore: update website content via admin"));

    if (!payload || typeof payload !== "object") {
      return response(false, "Invalid payload", null, "Expected data object", 400);
    }

    const parsed = siteDataSchema.safeParse(payload);
    if (!parsed.success) {
      return response(false, "Validation failed", null, parsed.error.issues[0]?.message || "Invalid site data", 400);
    }

    const dataToSave = normalizeSiteData({
      ...parsed.data,
      updatedAt: new Date().toISOString(),
    } as any);

    const saved = await saveSiteData(dataToSave);
<<<<<<< HEAD
    let githubSync: { success: boolean; error?: string } | null = null;

    if (saved.data.githubConfig?.enabled && saved.data.githubConfig.username) {
      githubSync = await syncGitHubStats(saved.data.githubConfig.username);
    }
=======
>>>>>>> c974e6d18f7e4d84cefd23b3ad822ac4cf9981fc

    return response(true, "Content saved", {
      updatedAt: saved.data.updatedAt,
      data: saved.data,
      source: saved.activeSource,
      requestedSource: saved.requestedSource,
      fallbackActivated: saved.fallbackActivated,
      meta: {
        lastMongoUpdateAt: saved.lastMongoUpdateAt,
        lastGitHubSyncAt: saved.lastGitHubSyncAt,
      },
<<<<<<< HEAD
      githubSync,
=======
>>>>>>> c974e6d18f7e4d84cefd23b3ad822ac4cf9981fc
    });
  } catch (error) {
    return response(false, "Failed to save content", null, error instanceof Error ? error.message : "Failed to save", 500);
  }
}
