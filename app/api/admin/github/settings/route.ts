import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin/server";
import { getSiteData } from "@/src/lib/site-data";
import { saveSiteData } from "@/lib/site-data-store";

export const runtime = "nodejs";

function normalizeList(value: unknown) {
  return Array.isArray(value) ? value.map((item) => String(item).trim()).filter(Boolean) : [];
}

function normalizeBoolean(value: unknown, fallback = false) {
  return typeof value === "boolean" ? value : Boolean(value ?? fallback);
}

function normalizeNumber(value: unknown, fallback: number) {
  const next = Number(value);
  return Number.isFinite(next) ? next : fallback;
}

export async function GET() {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;

  const siteData = await getSiteData();
  const githubConfig = (siteData.githubConfig || {}) as Record<string, unknown>;
  return NextResponse.json({
    success: true,
    data: {
      ...githubConfig,
      username: String(githubConfig.username || ""),
      enabled: normalizeBoolean(githubConfig.enabled, false),
      refreshInterval: normalizeNumber(githubConfig.refreshInterval, 30),
      includePrivateRepos: normalizeBoolean(githubConfig.includePrivateRepos, false),
      includePrivateCommits: normalizeBoolean(githubConfig.includePrivateCommits, false),
      showLifetimeCommits: normalizeBoolean(githubConfig.showLifetimeCommits, true),
      showPrivateReposPublicly: normalizeBoolean(githubConfig.showPrivateReposPublicly, false),
      showPrivateCommitsPublicly: normalizeBoolean(githubConfig.showPrivateCommitsPublicly, false),
      publicDisplayMode: githubConfig.publicDisplayMode || "publicOnly",
      commitCountMode: githubConfig.commitCountMode || "publicCommitsOnly",
      repositorySelectionMode: githubConfig.repositorySelectionMode || "all",
      selectedRepositories: normalizeList(githubConfig.selectedRepositories),
      commitMessageIncludes: normalizeList(githubConfig.commitMessageIncludes),
      commitMessageExcludes: normalizeList(githubConfig.commitMessageExcludes),
      recentCommitsEnabled: normalizeBoolean(githubConfig.recentCommitsEnabled, true),
      recentCommitsLimit: normalizeNumber(githubConfig.recentCommitsLimit, 10),
      recentCommitsHideRepositories: normalizeList(githubConfig.recentCommitsHideRepositories),
      recentCommitsHideKeywords: normalizeList(githubConfig.recentCommitsHideKeywords),
      recentCommitsSelectedRepositories: normalizeList(githubConfig.recentCommitsSelectedRepositories),
      recentCommitsShowMessage: normalizeBoolean(githubConfig.recentCommitsShowMessage, true),
      recentCommitsShowRepository: normalizeBoolean(githubConfig.recentCommitsShowRepository, true),
      recentCommitsShowDate: normalizeBoolean(githubConfig.recentCommitsShowDate, true),
      recentCommitsShowAuthor: normalizeBoolean(githubConfig.recentCommitsShowAuthor, false),
      recentCommitsShowAvatar: normalizeBoolean(githubConfig.recentCommitsShowAvatar, false),
      recentCommitsSortNewest: normalizeBoolean(githubConfig.recentCommitsSortNewest, true),
      recentActivityEnabled: normalizeBoolean(githubConfig.recentActivityEnabled, true),
      recentActivityLimit: normalizeNumber(githubConfig.recentActivityLimit, 10),
      recentActivityHiddenTypes: normalizeList(githubConfig.recentActivityHiddenTypes),
      recentActivityHideRepositories: normalizeList(githubConfig.recentActivityHideRepositories),
      recentActivityHideKeywords: normalizeList(githubConfig.recentActivityHideKeywords),
      repositoryCardsLimit: normalizeNumber(githubConfig.repositoryCardsLimit, 12),
      repositoryCardsSelectedRepositories: normalizeList(githubConfig.repositoryCardsSelectedRepositories),
      repositoryCardsHideArchived: normalizeBoolean(githubConfig.repositoryCardsHideArchived, false),
      repositoryCardsHideForked: normalizeBoolean(githubConfig.repositoryCardsHideForked, false),
      repositoryCardsHidePrivate: normalizeBoolean(githubConfig.repositoryCardsHidePrivate, true),
      repositoryCardsSort: githubConfig.repositoryCardsSort || "stars",
      repositoryCardsManualOrder: normalizeList(githubConfig.repositoryCardsManualOrder),
    },
  });
}

export async function PUT(request: Request) {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;

  try {
    const body = await request.json();
    const siteData = await getSiteData();
    const nextGithub = {
      ...(siteData.githubConfig || {}),
      ...(body?.data || body || {}),
      selectedRepositories: normalizeList((body?.data || body || {}).selectedRepositories),
      commitMessageIncludes: normalizeList((body?.data || body || {}).commitMessageIncludes),
      commitMessageExcludes: normalizeList((body?.data || body || {}).commitMessageExcludes),
    };

    const saved = await saveSiteData({
      ...siteData,
      githubConfig: nextGithub,
      updatedAt: new Date().toISOString(),
    } as any);

    return NextResponse.json({ success: true, data: (saved as any).githubConfig || nextGithub });
  } catch (error) {
    return NextResponse.json({ success: false, reason: error instanceof Error ? error.message : "Failed to save GitHub settings" }, { status: 500 });
  }
}
