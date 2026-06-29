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
    recentCommitsEnabled: typeof incoming.recentCommitsEnabled === "boolean" ? incoming.recentCommitsEnabled : Boolean(existing.recentCommitsEnabled ?? true),
    recentCommitsLimit: Number.isFinite(Number(incoming.recentCommitsLimit)) ? Number(incoming.recentCommitsLimit) : existing.recentCommitsLimit ?? 10,
    recentCommitsHideRepositories: Array.isArray(incoming.recentCommitsHideRepositories)
      ? incoming.recentCommitsHideRepositories.filter((value): value is string => typeof value === "string")
      : Array.isArray(existing.recentCommitsHideRepositories)
        ? existing.recentCommitsHideRepositories
        : [],
    recentCommitsHideKeywords: Array.isArray(incoming.recentCommitsHideKeywords)
      ? incoming.recentCommitsHideKeywords.filter((value): value is string => typeof value === "string")
      : Array.isArray(existing.recentCommitsHideKeywords)
        ? existing.recentCommitsHideKeywords
        : [],
    recentCommitsSelectedRepositories: Array.isArray(incoming.recentCommitsSelectedRepositories)
      ? incoming.recentCommitsSelectedRepositories.filter((value): value is string => typeof value === "string")
      : Array.isArray(existing.recentCommitsSelectedRepositories)
        ? existing.recentCommitsSelectedRepositories
        : [],
    recentCommitsShowMessage: typeof incoming.recentCommitsShowMessage === "boolean" ? incoming.recentCommitsShowMessage : Boolean(existing.recentCommitsShowMessage ?? true),
    recentCommitsShowRepository: typeof incoming.recentCommitsShowRepository === "boolean" ? incoming.recentCommitsShowRepository : Boolean(existing.recentCommitsShowRepository ?? true),
    recentCommitsShowDate: typeof incoming.recentCommitsShowDate === "boolean" ? incoming.recentCommitsShowDate : Boolean(existing.recentCommitsShowDate ?? true),
    recentCommitsShowAuthor: typeof incoming.recentCommitsShowAuthor === "boolean" ? incoming.recentCommitsShowAuthor : Boolean(existing.recentCommitsShowAuthor ?? false),
    recentCommitsShowAvatar: typeof incoming.recentCommitsShowAvatar === "boolean" ? incoming.recentCommitsShowAvatar : Boolean(existing.recentCommitsShowAvatar ?? false),
    recentCommitsSortNewest: typeof incoming.recentCommitsSortNewest === "boolean" ? incoming.recentCommitsSortNewest : Boolean(existing.recentCommitsSortNewest ?? true),
    recentActivityEnabled: typeof incoming.recentActivityEnabled === "boolean" ? incoming.recentActivityEnabled : Boolean(existing.recentActivityEnabled ?? true),
    recentActivityLimit: Number.isFinite(Number(incoming.recentActivityLimit)) ? Number(incoming.recentActivityLimit) : existing.recentActivityLimit ?? 10,
    recentActivityHiddenTypes: Array.isArray(incoming.recentActivityHiddenTypes)
      ? incoming.recentActivityHiddenTypes.filter((value): value is string => typeof value === "string")
      : Array.isArray(existing.recentActivityHiddenTypes)
        ? existing.recentActivityHiddenTypes
        : [],
    recentActivityHideRepositories: Array.isArray(incoming.recentActivityHideRepositories)
      ? incoming.recentActivityHideRepositories.filter((value): value is string => typeof value === "string")
      : Array.isArray(existing.recentActivityHideRepositories)
        ? existing.recentActivityHideRepositories
        : [],
    recentActivityHideKeywords: Array.isArray(incoming.recentActivityHideKeywords)
      ? incoming.recentActivityHideKeywords.filter((value): value is string => typeof value === "string")
      : Array.isArray(existing.recentActivityHideKeywords)
        ? existing.recentActivityHideKeywords
        : [],
    repositoryCardsLimit: Number.isFinite(Number(incoming.repositoryCardsLimit)) ? Number(incoming.repositoryCardsLimit) : existing.repositoryCardsLimit ?? 12,
    repositoryCardsSelectedRepositories: Array.isArray(incoming.repositoryCardsSelectedRepositories)
      ? incoming.repositoryCardsSelectedRepositories.filter((value): value is string => typeof value === "string")
      : Array.isArray(existing.repositoryCardsSelectedRepositories)
        ? existing.repositoryCardsSelectedRepositories
        : [],
    repositoryCardsHideArchived: typeof incoming.repositoryCardsHideArchived === "boolean" ? incoming.repositoryCardsHideArchived : Boolean(existing.repositoryCardsHideArchived ?? false),
    repositoryCardsHideForked: typeof incoming.repositoryCardsHideForked === "boolean" ? incoming.repositoryCardsHideForked : Boolean(existing.repositoryCardsHideForked ?? false),
    repositoryCardsHidePrivate: typeof incoming.repositoryCardsHidePrivate === "boolean" ? incoming.repositoryCardsHidePrivate : Boolean(existing.repositoryCardsHidePrivate ?? true),
    repositoryCardsSort:
      typeof incoming.repositoryCardsSort === "string"
        ? (incoming.repositoryCardsSort as NonNullable<SiteData["githubConfig"]>["repositoryCardsSort"])
        : existing.repositoryCardsSort || "stars",
    repositoryCardsManualOrder: Array.isArray(incoming.repositoryCardsManualOrder)
      ? incoming.repositoryCardsManualOrder.filter((value): value is string => typeof value === "string")
      : Array.isArray(existing.repositoryCardsManualOrder)
        ? existing.repositoryCardsManualOrder
        : [],
    showTotalCommits: typeof incoming.showTotalCommits === "boolean" ? incoming.showTotalCommits : Boolean(existing.showTotalCommits ?? true),
    showStars: typeof incoming.showStars === "boolean" ? incoming.showStars : Boolean(existing.showStars ?? true),
    showFollowers: typeof incoming.showFollowers === "boolean" ? incoming.showFollowers : Boolean(existing.showFollowers ?? true),
    showFollowing: typeof incoming.showFollowing === "boolean" ? incoming.showFollowing : Boolean(existing.showFollowing ?? true),
    showForks: typeof incoming.showForks === "boolean" ? incoming.showForks : Boolean(existing.showForks ?? true),
    showPullRequests: typeof incoming.showPullRequests === "boolean" ? incoming.showPullRequests : Boolean(existing.showPullRequests ?? true),
    showIssues: typeof incoming.showIssues === "boolean" ? incoming.showIssues : Boolean(existing.showIssues ?? true),
    showOrganizations: typeof incoming.showOrganizations === "boolean" ? incoming.showOrganizations : Boolean(existing.showOrganizations ?? true),
    showContributionStreak: typeof incoming.showContributionStreak === "boolean" ? incoming.showContributionStreak : Boolean(existing.showContributionStreak ?? true),
    pinnedProjectsLimit: Number.isFinite(Number(incoming.pinnedProjectsLimit)) ? Number(incoming.pinnedProjectsLimit) : existing.pinnedProjectsLimit ?? 6,
    pinnedProjectsOrder: Array.isArray(incoming.pinnedProjectsOrder)
      ? incoming.pinnedProjectsOrder.filter((value): value is string => typeof value === "string")
      : Array.isArray(existing.pinnedProjectsOrder)
        ? existing.pinnedProjectsOrder
        : [],
    cardsPerRow: Number.isFinite(Number(incoming.cardsPerRow)) ? Number(incoming.cardsPerRow) : existing.cardsPerRow ?? 3,
    paginationSize: Number.isFinite(Number(incoming.paginationSize)) ? Number(incoming.paginationSize) : existing.paginationSize ?? 12,
    infiniteScroll: typeof incoming.infiniteScroll === "boolean" ? incoming.infiniteScroll : Boolean(existing.infiniteScroll ?? false),
    showViewOnGitHubButtons: typeof incoming.showViewOnGitHubButtons === "boolean" ? incoming.showViewOnGitHubButtons : Boolean(existing.showViewOnGitHubButtons ?? true),
    openLinksInNewTab: typeof incoming.openLinksInNewTab === "boolean" ? incoming.openLinksInNewTab : Boolean(existing.openLinksInNewTab ?? true),
    showGitHubIcons: typeof incoming.showGitHubIcons === "boolean" ? incoming.showGitHubIcons : Boolean(existing.showGitHubIcons ?? true),
    showLanguageColors: typeof incoming.showLanguageColors === "boolean" ? incoming.showLanguageColors : Boolean(existing.showLanguageColors ?? true),
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
        recentCommitsEnabled: true,
        recentCommitsLimit: 10,
        recentCommitsHideRepositories: [],
        recentCommitsHideKeywords: [],
        recentCommitsSelectedRepositories: [],
        recentCommitsShowMessage: true,
        recentCommitsShowRepository: true,
        recentCommitsShowDate: true,
        recentCommitsShowAuthor: false,
        recentCommitsShowAvatar: false,
        recentCommitsSortNewest: true,
        recentActivityEnabled: true,
        recentActivityLimit: 10,
        recentActivityHiddenTypes: [],
        recentActivityHideRepositories: [],
        recentActivityHideKeywords: [],
        repositoryCardsLimit: 12,
        repositoryCardsSelectedRepositories: [],
        repositoryCardsHideArchived: false,
        repositoryCardsHideForked: false,
        repositoryCardsHidePrivate: true,
        repositoryCardsSort: "stars",
        repositoryCardsManualOrder: [],
        showTotalCommits: true,
        showStars: true,
        showFollowers: true,
        showFollowing: true,
        showForks: true,
        showPullRequests: true,
        showIssues: true,
        showOrganizations: true,
        showContributionStreak: true,
        pinnedProjectsLimit: 6,
        pinnedProjectsOrder: [],
        cardsPerRow: 3,
        paginationSize: 12,
        infiniteScroll: false,
        showViewOnGitHubButtons: true,
        openLinksInNewTab: true,
        showGitHubIcons: true,
        showLanguageColors: true,
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
