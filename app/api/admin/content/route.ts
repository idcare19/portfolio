import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin/server";
import { syncGitHubStats } from "@/lib/github-stats";
import { DEFAULT_REVALIDATE_PATHS, getSiteContentState, saveSiteData } from "@/lib/site-data-store";
import { normalizeSiteData } from "@/lib/site-data-transform";
import { siteDataSchema } from "@/schemas/site-data";

export const runtime = "nodejs";

function sanitizeCommitMessage(input: string) {
  return input.replace(/[\r\n]+/g, " ").slice(0, 140).trim() || "chore: update website content";
}

function response(success: boolean, message: string, data?: unknown, error?: string, status = 200) {
  return NextResponse.json({ success, ok: success, message, data: data ?? null, error: error ?? null }, { status });
}

function previewSavedFields(body: Record<string, unknown>, savedData: Record<string, unknown>) {
  const keys = ["owner", "websiteSettings", "githubConfig", "sections", "socials", "shell"] as const;
  return keys.reduce<Record<string, unknown>>((acc, key) => {
    if (body[key] !== undefined || savedData[key] !== undefined) {
      acc[key] = savedData[key] ?? body[key];
    }
    return acc;
  }, {});
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
    let githubSync: { success: boolean; error?: string } | null = null;

    if (saved.data.githubConfig?.enabled && saved.data.githubConfig.username) {
      githubSync = await syncGitHubStats(saved.data.githubConfig.username);
    }

    return response(true, "Content saved", {
      updatedAt: saved.data.updatedAt,
      data: saved.data,
      activeSource: saved.activeSource,
      source: saved.activeSource,
      requestedSource: saved.requestedSource,
      fallbackActivated: saved.fallbackActivated,
      savedFieldPreview: previewSavedFields(body?.data || {}, saved.data),
      revalidatedPaths: DEFAULT_REVALIDATE_PATHS,
      meta: {
        lastMongoUpdateAt: saved.lastMongoUpdateAt,
        lastGitHubSyncAt: saved.lastGitHubSyncAt,
      },
      githubSync,
    });
  } catch (error) {
    return response(false, "Failed to save content", null, error instanceof Error ? error.message : "Failed to save", 500);
  }
}
