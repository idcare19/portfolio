import { NextResponse } from "next/server";
import { syncGitHubStats } from "@/lib/github-stats";
import { requireAdminSession } from "@/lib/admin/server";
import { DEFAULT_REVALIDATE_PATHS, saveSiteData } from "@/lib/site-data-store";
import { getPortfolioSiteData } from "@/lib/portfolio/repository";
import { normalizeSiteData } from "@/lib/site-data-transform";
import type { SiteData } from "@/src/types/site-data";

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

function normalizeGitHubConfig(existing: NonNullable<SiteData["githubConfig"]>, incoming: Record<string, unknown>): NonNullable<SiteData["githubConfig"]> {
  const nextConfig: NonNullable<SiteData["githubConfig"]> = {
    ...existing,
    ...incoming,
    username: typeof incoming.username === "string" ? incoming.username : existing.username || "",
    enabled: typeof incoming.enabled === "boolean" ? incoming.enabled : Boolean(incoming.enabled ?? existing.enabled),
    refreshInterval:
      typeof incoming.refreshInterval === "number"
        ? incoming.refreshInterval
        : Number.isFinite(Number(incoming.refreshInterval))
          ? Number(incoming.refreshInterval)
          : existing.refreshInterval ?? 30,
    includePrivateRepos:
      typeof incoming.includePrivateRepos === "boolean" ? incoming.includePrivateRepos : Boolean(existing.includePrivateRepos),
    includePrivateCommits:
      typeof incoming.includePrivateCommits === "boolean" ? incoming.includePrivateCommits : Boolean(existing.includePrivateCommits),
    showLifetimeCommits:
      typeof incoming.showLifetimeCommits === "boolean" ? incoming.showLifetimeCommits : Boolean(existing.showLifetimeCommits),
    showPrivateReposPublicly:
      typeof incoming.showPrivateReposPublicly === "boolean" ? incoming.showPrivateReposPublicly : Boolean(existing.showPrivateReposPublicly),
    showPrivateCommitsPublicly:
      typeof incoming.showPrivateCommitsPublicly === "boolean"
        ? incoming.showPrivateCommitsPublicly
        : Boolean(existing.showPrivateCommitsPublicly),
    publicDisplayMode:
      typeof incoming.publicDisplayMode === "string"
        ? (incoming.publicDisplayMode as NonNullable<SiteData["githubConfig"]>["publicDisplayMode"])
        : existing.publicDisplayMode || "publicOnly",
    commitCountMode:
      typeof incoming.commitCountMode === "string"
        ? (incoming.commitCountMode as NonNullable<SiteData["githubConfig"]>["commitCountMode"])
        : existing.commitCountMode || "publicCommitsOnly",
    repositorySelectionMode:
      typeof incoming.repositorySelectionMode === "string"
        ? (incoming.repositorySelectionMode as NonNullable<SiteData["githubConfig"]>["repositorySelectionMode"])
        : existing.repositorySelectionMode || "all",
    selectedRepositories: Array.isArray(incoming.selectedRepositories)
      ? incoming.selectedRepositories.filter((value): value is string => typeof value === "string")
      : Array.isArray(existing.selectedRepositories)
        ? existing.selectedRepositories
        : [],
    commitMessageIncludes: Array.isArray(incoming.commitMessageIncludes)
      ? incoming.commitMessageIncludes.filter((value): value is string => typeof value === "string")
      : Array.isArray(existing.commitMessageIncludes)
        ? existing.commitMessageIncludes
        : [],
    commitMessageExcludes: Array.isArray(incoming.commitMessageExcludes)
      ? incoming.commitMessageExcludes.filter((value): value is string => typeof value === "string")
      : Array.isArray(existing.commitMessageExcludes)
        ? existing.commitMessageExcludes
        : [],
  };

  const token = typeof incoming.token === "string" ? incoming.token.trim() : "";
  if (token && token !== "********") {
    nextConfig.token = token;
  } else {
    nextConfig.token = existing.token || "";
  }

  return nextConfig;
}

export async function POST(request: Request) {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;

  try {
    const body = await request.json();
    const existingSiteData = await getPortfolioSiteData();
    const normalizedExistingSiteData = normalizeSiteData(existingSiteData);
    const incomingSiteData = (body?.data ?? body) as Partial<SiteData> & Record<string, unknown>;
    const githubConfigInput = (incomingSiteData.githubConfig ?? body?.githubConfig ?? {}) as Record<string, unknown>;
    const existingGithubConfig =
      normalizedExistingSiteData.githubConfig ?? {
        username: "",
        token: "",
        enabled: false,
        refreshInterval: 30,
        includePrivateRepos: false,
        includePrivateCommits: false,
        showLifetimeCommits: true,
        showPrivateReposPublicly: false,
        showPrivateCommitsPublicly: false,
        publicDisplayMode: "publicOnly",
        commitCountMode: "publicCommitsOnly",
        repositorySelectionMode: "all",
        selectedRepositories: [],
        commitMessageIncludes: [],
        commitMessageExcludes: [],
      };
    const safeGithubConfig = normalizeGitHubConfig(existingGithubConfig, githubConfigInput);
    const mergedSiteData: SiteData = {
      ...normalizedExistingSiteData,
      ...(incomingSiteData as Partial<SiteData>),
      githubConfig: safeGithubConfig,
    };

    const normalizedIncoming = normalizeSiteData(mergedSiteData);
    const githubConfigToSave: NonNullable<SiteData["githubConfig"]> = {
      ...safeGithubConfig,
      token: "",
    };

    console.log("[admin/site-data/update] githubConfig payload", {
      githubConfig: {
        ...githubConfigToSave,
        token: undefined,
      },
      selectedRepositoriesLength: Array.isArray(githubConfigToSave.selectedRepositories) ? githubConfigToSave.selectedRepositories.length : 0,
      commitMessageIncludesLength: Array.isArray(githubConfigToSave.commitMessageIncludes) ? githubConfigToSave.commitMessageIncludes.length : 0,
      commitMessageExcludesLength: Array.isArray(githubConfigToSave.commitMessageExcludes) ? githubConfigToSave.commitMessageExcludes.length : 0,
    });

    const nextData: SiteData = {
      ...normalizedIncoming,
      githubConfig: githubConfigToSave,
      updatedAt: new Date().toISOString(),
    };

    const saved = await saveSiteData(nextData);
    let githubSync: { success: boolean; error?: string } | null = null;

    if (saved.data.githubConfig?.enabled && saved.data.githubConfig.username) {
      try {
        githubSync = await syncGitHubStats(saved.data.githubConfig.username);
      } catch (syncError) {
        githubSync = {
          success: false,
          error: syncError instanceof Error ? syncError.message : "GitHub sync failed after save",
        };
      }
    }

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
    const details =
      error instanceof Error
        ? error.stack && process.env.NODE_ENV !== "production"
          ? `${error.message}\n${error.stack}`
          : error.message
        : "Failed to update site data";
    console.error("[admin/site-data/update] save failed", {
      name: error instanceof Error ? error.name : "UnknownError",
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error && process.env.NODE_ENV !== "production" ? error.stack : undefined,
    });
    return NextResponse.json(
      {
        success: false,
        ok: false,
        error: error instanceof Error ? error.message : "Failed to update site data",
        details,
      },
      { status: 500 }
    );
  }
}
