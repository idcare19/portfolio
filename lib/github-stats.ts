import "server-only";

import { connectToDatabase } from "./mongodb";
import { GitHubStats } from "@/models/GitHubStats";
import { getFullSiteData } from "@/src/lib/site-data";

const GITHUB_API_URL = "https://api.github.com";
const GITHUB_GRAPHQL_URL = "https://api.github.com/graphql";
const STALE_FALLBACK_MINUTES = 30;
const MAX_PUBLIC_REPOS = 12;
const MAX_PUBLIC_COMMITS = 12;
const MAX_PUBLIC_ACTIVITY = 12;
const CONTRIBUTION_DAYS = 7 * 12;

type GitHubPrivacyConfig = {
  username: string;
  token?: string;
  enabled: boolean;
  refreshInterval: number;
  includePrivateRepos?: boolean;
  includePrivateCommits?: boolean;
  showLifetimeCommits?: boolean;
  showPrivateReposPublicly?: boolean;
  showPrivateCommitsPublicly?: boolean;
  publicDisplayMode?: "publicOnly" | "aggregatePrivateOnly" | "includePrivateNames" | "includePrivateWithCommits";
  commitCountMode?: "publicCommitsOnly" | "publicAndPrivateCommits" | "publicReposOnly" | "selectedRepositoriesOnly" | "customRepositoryList";
  repositorySelectionMode?: "all" | "publicOnly" | "privateOnly" | "selected";
  selectedRepositories?: string[];
  commitMessageIncludes?: string[];
  commitMessageExcludes?: string[];
  recentCommitsEnabled?: boolean;
  recentCommitsLimit?: number;
  recentCommitsHideRepositories?: string[];
  recentCommitsHideKeywords?: string[];
  recentCommitsSelectedRepositories?: string[];
  recentCommitsShowMessage?: boolean;
  recentCommitsShowRepository?: boolean;
  recentCommitsShowDate?: boolean;
  recentCommitsShowAuthor?: boolean;
  recentCommitsShowAvatar?: boolean;
  recentCommitsSortNewest?: boolean;
  recentActivityEnabled?: boolean;
  recentActivityLimit?: number;
  recentActivityHiddenTypes?: string[];
  recentActivityHideRepositories?: string[];
  recentActivityHideKeywords?: string[];
  repositoryCardsLimit?: number;
  repositoryCardsSelectedRepositories?: string[];
  repositoryCardsHideArchived?: boolean;
  repositoryCardsHideForked?: boolean;
  repositoryCardsHidePrivate?: boolean;
  repositoryCardsSort?: "stars" | "updated" | "name" | "manual";
  repositoryCardsManualOrder?: string[];
  showTotalCommits?: boolean;
  showStars?: boolean;
  showFollowers?: boolean;
  showFollowing?: boolean;
  showForks?: boolean;
  showPullRequests?: boolean;
  showIssues?: boolean;
  showOrganizations?: boolean;
  showContributionStreak?: boolean;
  pinnedProjectsLimit?: number;
  pinnedProjectsOrder?: string[];
  cardsPerRow?: number;
  paginationSize?: number;
  infiniteScroll?: boolean;
  showViewOnGitHubButtons?: boolean;
  openLinksInNewTab?: boolean;
  showGitHubIcons?: boolean;
  showLanguageColors?: boolean;
};

type GitHubHeaders = HeadersInit;

type CachedGitHubStats = {
  username: string;
  syncedAt: string;
  profile?: {
    login: string;
    name?: string;
    avatarUrl?: string;
    bio?: string;
    company?: string;
    location?: string;
    blog?: string;
    profileUrl?: string;
    joinedAt?: string;
  };
  totals: {
    totalRepos: number;
    publicRepos: number;
    privateRepos: number;
    totalStars: number;
    totalForks: number;
    publicCommits?: number;
    privateCommits?: number;
    totalCommits?: number;
    totalPullRequests?: number;
    totalIssues?: number;
    followers?: number;
    following?: number;
  };
  repositories: Array<Record<string, unknown>>;
  pinnedRepositories?: Array<Record<string, unknown>>;
  languages: Record<string, number>;
  recentCommits: Array<Record<string, unknown>>;
  recentActivity?: Array<Record<string, unknown>>;
  contributionCalendar?: Array<{ date: string; count: number; level: number }>;
  contributionSummary?: {
    totalContributions: number;
    weeks: number;
  };
  organizations?: Array<Record<string, unknown>>;
  achievements?: Array<Record<string, unknown>>;
  rateLimit?: {
    remaining: number;
    limit: number;
    resetAt: string;
  };
  lastSyncError?: string | null;
};

type PublicGitHubStats = {
  profile: {
    login: string;
    name: string;
    avatarUrl: string;
    bio: string;
    company: string;
    location: string;
    blog: string;
    profileUrl: string;
    joinedAt?: string;
  };
  followers: number;
  following: number;
  stars: number;
  forks: number;
  publicRepos: number;
  privateRepos: number;
  totalCommits: number;
  totalRepositories: number;
  pullRequests: number;
  issues: number;
  privateCommitCount?: number;
  publicCommits: number;
  privateCommits: number;
  privateIncluded: boolean;
  showLifetimeCommits?: boolean;
  languages: Array<{ name: string; value: number }>;
  organizations: Array<Record<string, unknown>>;
  contributions: {
    total: number;
    weeks: number;
    heatmap: Array<{ date: string; count: number; level: number }>;
  };
  repositories: Array<Record<string, unknown>>;
  latestRepos: Array<Record<string, unknown>>;
  pinnedRepos: Array<Record<string, unknown>>;
  recentActivity: Array<Record<string, unknown>>;
  latestCommits: Array<Record<string, unknown>>;
  achievements?: Array<Record<string, unknown>>;
  syncedAt: string;
  lastSyncError: string | null;
};

type GitHubRepositoryStats = {
  name: string;
  fullName: string;
  private: boolean;
  commitCount: number;
  publicCommitCount: number;
  privateCommitCount: number;
  selected: boolean;
  syncStatus: "success" | "failed";
  error?: string;
  archived?: boolean;
  fork?: boolean;
  updatedAt?: string;
};

function getConfiguredRefreshInterval(siteData?: Awaited<ReturnType<typeof getFullSiteData>>) {
  return siteData?.githubConfig?.refreshInterval || STALE_FALLBACK_MINUTES;
}

function getPrivacyConfig(siteData?: Awaited<ReturnType<typeof getFullSiteData>>): GitHubPrivacyConfig {
  return {
    username: siteData?.githubConfig?.username || "",
    token: siteData?.githubConfig?.token || "",
    enabled: Boolean(siteData?.githubConfig?.enabled),
    refreshInterval: siteData?.githubConfig?.refreshInterval || STALE_FALLBACK_MINUTES,
    includePrivateRepos: Boolean(siteData?.githubConfig?.includePrivateRepos),
    includePrivateCommits: Boolean(siteData?.githubConfig?.includePrivateCommits),
    showPrivateReposPublicly: Boolean(siteData?.githubConfig?.showPrivateReposPublicly),
    showPrivateCommitsPublicly: Boolean(siteData?.githubConfig?.showPrivateCommitsPublicly),
    publicDisplayMode: siteData?.githubConfig?.publicDisplayMode || "publicOnly",
    commitCountMode: siteData?.githubConfig?.commitCountMode || "publicCommitsOnly",
    repositorySelectionMode: siteData?.githubConfig?.repositorySelectionMode || "all",
    selectedRepositories: siteData?.githubConfig?.selectedRepositories || [],
    recentCommitsEnabled: siteData?.githubConfig?.recentCommitsEnabled ?? true,
    recentCommitsLimit: siteData?.githubConfig?.recentCommitsLimit ?? 10,
    recentCommitsHideRepositories: siteData?.githubConfig?.recentCommitsHideRepositories || [],
    recentCommitsHideKeywords: siteData?.githubConfig?.recentCommitsHideKeywords || [],
    recentCommitsSelectedRepositories: siteData?.githubConfig?.recentCommitsSelectedRepositories || [],
    recentCommitsSortNewest: siteData?.githubConfig?.recentCommitsSortNewest ?? true,
    recentActivityEnabled: siteData?.githubConfig?.recentActivityEnabled ?? true,
    recentActivityLimit: siteData?.githubConfig?.recentActivityLimit ?? 10,
    recentActivityHiddenTypes: siteData?.githubConfig?.recentActivityHiddenTypes || [],
    recentActivityHideRepositories: siteData?.githubConfig?.recentActivityHideRepositories || [],
    recentActivityHideKeywords: siteData?.githubConfig?.recentActivityHideKeywords || [],
    repositoryCardsLimit: siteData?.githubConfig?.repositoryCardsLimit ?? 12,
    repositoryCardsSelectedRepositories: siteData?.githubConfig?.repositoryCardsSelectedRepositories || [],
    repositoryCardsHideArchived: siteData?.githubConfig?.repositoryCardsHideArchived ?? false,
    repositoryCardsHideForked: siteData?.githubConfig?.repositoryCardsHideForked ?? false,
    repositoryCardsHidePrivate: siteData?.githubConfig?.repositoryCardsHidePrivate ?? true,
    repositoryCardsSort: siteData?.githubConfig?.repositoryCardsSort || "stars",
    repositoryCardsManualOrder: siteData?.githubConfig?.repositoryCardsManualOrder || [],
    showTotalCommits: siteData?.githubConfig?.showTotalCommits ?? true,
    showStars: siteData?.githubConfig?.showStars ?? true,
    showFollowers: siteData?.githubConfig?.showFollowers ?? true,
    showFollowing: siteData?.githubConfig?.showFollowing ?? true,
    showForks: siteData?.githubConfig?.showForks ?? true,
    showPullRequests: siteData?.githubConfig?.showPullRequests ?? true,
    showIssues: siteData?.githubConfig?.showIssues ?? true,
    showOrganizations: siteData?.githubConfig?.showOrganizations ?? true,
    showContributionStreak: siteData?.githubConfig?.showContributionStreak ?? true,
    pinnedProjectsLimit: siteData?.githubConfig?.pinnedProjectsLimit ?? 6,
    pinnedProjectsOrder: siteData?.githubConfig?.pinnedProjectsOrder || [],
    cardsPerRow: siteData?.githubConfig?.cardsPerRow ?? 3,
    paginationSize: siteData?.githubConfig?.paginationSize ?? 12,
    infiniteScroll: siteData?.githubConfig?.infiniteScroll ?? false,
    showViewOnGitHubButtons: siteData?.githubConfig?.showViewOnGitHubButtons ?? true,
    openLinksInNewTab: siteData?.githubConfig?.openLinksInNewTab ?? true,
    showGitHubIcons: siteData?.githubConfig?.showGitHubIcons ?? true,
    showLanguageColors: siteData?.githubConfig?.showLanguageColors ?? true,
  };
}

function normalizeBlogUrl(value: unknown) {
  const text = String(value || "").trim();
  if (!text || text.toLowerCase() === "none") return "";
  return text;
}

function toPlainJson<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function normalizeTerms(values?: string[]) {
  return (values || []).map((term) => term.trim().toLowerCase()).filter(Boolean);
}

function normalizeRepositorySelection(values?: string[]) {
  return (values || []).map((value) => value.trim().toLowerCase()).filter(Boolean);
}

function normalizeCommitRuleInput(value?: string | string[]) {
  const lines = Array.isArray(value) ? value : String(value || "").split("\n");
  return lines
    .map((line) => line.replace(/\\n/g, "\n"))
    .flatMap((line) => line.split("\n"))
    .map((line) => line.trim())
    .filter(Boolean);
}

async function getHeaders() {
  const siteData = await getFullSiteData();
  const token = siteData.githubConfig?.token || process.env.GITHUB_TOKEN || process.env.GITHUB_PAT;
  const headers: GitHubHeaders = {
    Accept: "application/vnd.github+json",
    "User-Agent": "portfolio-github-sync",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

async function fetchGitHubApi(endpoint: string, init?: RequestInit) {
  const headers = await getHeaders();
  const response = await fetch(`${GITHUB_API_URL}${endpoint}`, {
    ...init,
    headers: {
      ...headers,
      ...(init?.headers || {}),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
  }

  const rateLimit = {
    remaining: parseInt(response.headers.get("X-RateLimit-Remaining") || "0", 10),
    limit: parseInt(response.headers.get("X-RateLimit-Limit") || "0", 10),
    resetAt: new Date(parseInt(response.headers.get("X-RateLimit-Reset") || "0", 10) * 1000).toISOString(),
  };
  const data = await response.json();
  return { data, rateLimit };
}

async function fetchAllPages(endpoint: string) {
  const allData: any[] = [];
  let page = 1;

  while (true) {
    const separator = endpoint.includes("?") ? "&" : "?";
    const { data } = await fetchGitHubApi(`${endpoint}${separator}per_page=100&page=${page}`);
    if (!Array.isArray(data) || data.length === 0) break;
    allData.push(...data);
    if (data.length < 100) break;
    page += 1;
  }

  return allData;
}

async function fetchAllRepositories(token: string) {
  const repositories: any[] = [];
  const headers: HeadersInit = {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  let page = 1;
  while (true) {
    const response = await fetch(`https://api.github.com/user/repos?per_page=100&page=${page}&affiliation=owner,collaborator,organization_member&sort=updated`, {
      headers,
      cache: "no-store",
    });
    if (!response.ok) {
      throw new Error(`GitHub repository fetch failed: ${response.status}`);
    }
    const currentPage = (await response.json()) as any[];
    repositories.push(...currentPage);
    if (!Array.isArray(currentPage) || currentPage.length < 100) break;
    page += 1;
  }
  return repositories;
}

function getRepoKey(repo: { full_name?: string; name: string }) {
  return repo.full_name || repo.name;
}

function isRepoSelected(repo: { private?: boolean; name: string; full_name?: string }, config: GitHubPrivacyConfig) {
  const mode = config.repositorySelectionMode || "all";
  const selected = new Set((config.selectedRepositories || []).map((item) => item.toLowerCase()));
  const key = getRepoKey(repo).toLowerCase();
  if (mode === "publicOnly") return !repo.private;
  if (mode === "privateOnly") return Boolean(repo.private);
  if (mode === "selected") return selected.has(key) || selected.has(repo.name.toLowerCase());
  return true;
}

function shouldCountPrivateCommits(config: GitHubPrivacyConfig) {
  return Boolean(config.includePrivateCommits || config.commitCountMode === "publicAndPrivateCommits");
}

function shouldUsePrivateRepos(config: GitHubPrivacyConfig) {
  return Boolean(
    config.includePrivateRepos ||
      config.commitCountMode === "publicAndPrivateCommits" ||
      config.commitCountMode === "selectedRepositoriesOnly" ||
      config.commitCountMode === "customRepositoryList"
  );
}

async function countRepoCommits(repoFullName: string, username: string, includeRules: string[], excludeRules: string[]) {
  const seen = new Set<string>();
  const firstPage: any[] = [];
  let page = 1;

  while (page <= 10) {
    const { data } = await fetchGitHubApi(`/repos/${repoFullName}/commits?author=${encodeURIComponent(username)}&per_page=100&page=${page}`);
    const commits = Array.isArray(data) ? data : [];
    if (!commits.length) break;

    for (const commit of commits) {
      const sha = String(commit?.sha || commit?.node_id || "").trim();
      const message = String(commit?.commit?.message || "");
      if (sha && commitVisibleByRules(message, includeRules, excludeRules)) seen.add(sha);
    }
    if (page === 1) firstPage.push(...commits);

    if (commits.length < 100) break;
    page += 1;
  }

  return { count: seen.size, firstPage };
}

async function fetchGraphQL<T>(query: string, variables: Record<string, unknown>) {
  const headers = await getHeaders();
  if (!("Authorization" in headers)) {
    return null;
  }

  const response = await fetch(GITHUB_GRAPHQL_URL, {
    method: "POST",
    headers: {
      ...headers,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`GitHub GraphQL error: ${response.status} ${response.statusText}`);
  }

  const payload = (await response.json()) as { data?: T; errors?: Array<{ message: string }> };
  if (payload.errors?.length) {
    throw new Error(payload.errors.map((error) => error.message).join("; "));
  }

  return payload.data || null;
}

function buildContributionHeatmap(commits: Array<{ createdAt: string }>) {
  const counts = new Map<string, number>();

  for (const commit of commits) {
    const date = String(commit.createdAt).slice(0, 10);
    counts.set(date, (counts.get(date) || 0) + 1);
  }

  const days: Array<{ date: string; count: number; level: number }> = [];
  for (let index = CONTRIBUTION_DAYS - 1; index >= 0; index -= 1) {
    const current = new Date();
    current.setHours(0, 0, 0, 0);
    current.setDate(current.getDate() - index);
    const date = current.toISOString().slice(0, 10);
    const count = counts.get(date) || 0;
    const level = count >= 8 ? 4 : count >= 5 ? 3 : count >= 3 ? 2 : count >= 1 ? 1 : 0;
    days.push({ date, count, level });
  }

  return {
    heatmap: days,
    total: days.reduce((sum, day) => sum + day.count, 0),
    weeks: Math.ceil(days.length / 7),
  };
}

function mapRepository(repo: any, isPinned = false) {
  const commitCount =
    Number(repo.commitCount ?? 0) ||
    Number(repo.publicCommitCount ?? 0) +
      Number(repo.privateCommitCount ?? 0);
  const languageEntries = repo.languages && typeof repo.languages === "object" ? Object.entries(repo.languages).sort(([, left], [, right]) => Number(right) - Number(left)) : [];
  const primaryLanguage = String(repo.language || languageEntries[0]?.[0] || "").trim();

  return {
    name: repo.name,
    description: repo.description || "",
    private: Boolean(repo.private),
    stars: Number(repo.stargazers_count || repo.stars || 0),
    forks: Number(repo.forks_count || repo.forks || 0),
    language: primaryLanguage,
    languages: repo.languages || {},
    url: normalizeBlogUrl(repo.html_url || repo.url),
    updatedAt: repo.pushed_at || repo.updatedAt || new Date().toISOString(),
    commitCount,
    publicCommitCount: Number(repo.publicCommitCount || 0),
    privateCommitCount: Number(repo.privateCommitCount || 0),
    pullRequestCount: Number(repo.pullRequestCount || 0),
    issueCount: Number(repo.open_issues_count || repo.issueCount || 0),
    homepage: normalizeBlogUrl(repo.homepage),
    topics: Array.isArray(repo.topics) ? repo.topics : [],
    isPinned,
  };
}

async function fetchPinnedRepositories(username: string, includePrivateRepos = false) {
  const query = `
    query PinnedRepos($username: String!) {
      user(login: $username) {
        pinnedItems(first: 6, types: REPOSITORY) {
          nodes {
            ... on Repository {
              name
              description
              url
              stargazerCount
              forkCount
              isPrivate
              primaryLanguage { name }
              pushedAt
              homepageUrl
              repositoryTopics(first: 10) {
                nodes { topic { name } }
              }
            }
          }
        }
      }
    }
  `;

  try {
    const data = await fetchGraphQL<{
      user?: {
        pinnedItems?: {
          nodes?: Array<{
            name: string;
            description?: string;
            url: string;
            stargazerCount: number;
            forkCount: number;
            isPrivate: boolean;
            primaryLanguage?: { name: string };
            pushedAt: string;
            homepageUrl?: string;
            repositoryTopics?: { nodes?: Array<{ topic?: { name?: string } }> };
          }>;
        };
      };
    }>(query, { username });

    const nodes = data?.user?.pinnedItems?.nodes || [];
    return nodes
      .filter((repo) => includePrivateRepos || !repo.isPrivate)
      .map((repo) =>
        mapRepository(
          {
            name: repo.name,
            description: repo.description,
            html_url: repo.url,
            stargazers_count: repo.stargazerCount,
            forks_count: repo.forkCount,
            private: repo.isPrivate,
            language: repo.primaryLanguage?.name || "",
            pushed_at: repo.pushedAt,
            homepage: repo.homepageUrl || "",
            topics: (repo.repositoryTopics?.nodes || []).map((node) => node.topic?.name).filter(Boolean),
          },
          true
        )
      );
  } catch {
    return [];
  }
}

function isFresh(syncedAt?: string, refreshIntervalMinutes = STALE_FALLBACK_MINUTES) {
  if (!syncedAt) return false;
  const ageMs = Date.now() - new Date(syncedAt).getTime();
  return ageMs < refreshIntervalMinutes * 60 * 1000;
}

function sanitizeRepositoryForPublic(repo: any, allowPrivateNames: boolean) {
  if (!repo.private || allowPrivateNames) {
    return repo;
  }

  return {
    ...repo,
    name: "Private Repository",
    description: "Private repository details are hidden.",
    homepage: "",
    topics: [],
    url: "",
  };
}

function toPublicStats(fullStats: CachedGitHubStats, privacyConfig: GitHubPrivacyConfig): PublicGitHubStats {
  const mode = privacyConfig.publicDisplayMode || "publicOnly";
  const allowPrivateRepoNames = Boolean(
    privacyConfig.showPrivateReposPublicly && (mode === "includePrivateNames" || mode === "includePrivateWithCommits")
  );
  const allowPrivateCommitMessages = Boolean(
    privacyConfig.showPrivateCommitsPublicly && mode === "includePrivateWithCommits"
  );
  const privateCommitCount = (fullStats.recentCommits || []).filter((commit: any) => commit.isPrivate).length;

  const visibleRepositories = (fullStats.repositories || []).filter((repo: any) => !repo.private || allowPrivateRepoNames);
  const latestRepos = visibleRepositories
    .sort((a: any, b: any) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, Number(privacyConfig.repositoryCardsLimit || MAX_PUBLIC_REPOS))
    .map((repo: any) => sanitizeRepositoryForPublic(repo, allowPrivateRepoNames));
  const pinnedRepos = (fullStats.pinnedRepositories || [])
    .filter((repo: any) => !repo.private || allowPrivateRepoNames)
    .slice(0, Number(privacyConfig.pinnedProjectsLimit || 6))
    .map((repo: any) => sanitizeRepositoryForPublic(repo, allowPrivateRepoNames));
  const latestCommits = (fullStats.recentCommits || [])
    .filter((commit: any) => !commit.isPrivate || allowPrivateCommitMessages)
    .filter((commit: any) => commitMatchesFilters(commit, privacyConfig))
    .filter((commit: any) => {
      const hiddenRepos = privacyConfig.recentCommitsHideRepositories || [];
      const hiddenKeywords = privacyConfig.recentCommitsHideKeywords || [];
      const selectedRepos = privacyConfig.recentCommitsSelectedRepositories || [];
      const repoMatch =
        selectedRepos.length === 0 || selectedRepos.some((repo) => repo.toLowerCase() === String(commit.repoName || "").toLowerCase());
      return repoMatch && matchesTextFilters(commit, hiddenRepos, hiddenKeywords);
    })
    .sort((a: any, b: any) =>
      privacyConfig.recentCommitsSortNewest === false ? new Date(String(a.createdAt)).getTime() - new Date(String(b.createdAt)).getTime() : new Date(String(b.createdAt)).getTime() - new Date(String(a.createdAt)).getTime()
    )
    .slice(0, Number(privacyConfig.recentCommitsLimit || MAX_PUBLIC_COMMITS))
    .map((commit: any) =>
      commit.isPrivate && !allowPrivateCommitMessages
        ? {
            ...commit,
            repoName: allowPrivateRepoNames ? commit.repoName : "Private Repository",
            message: "Private commit message hidden.",
            url: "",
          }
        : commit
    );
  const recentActivity = (fullStats.recentActivity || [])
    .filter((item: any) => !item.isPrivate || allowPrivateRepoNames)
    .filter((item: any) => {
      if ((privacyConfig.recentActivityHiddenTypes || []).includes(String(item.type))) return false;
      return matchesTextFilters(item, privacyConfig.recentActivityHideRepositories || [], privacyConfig.recentActivityHideKeywords || []);
    })
    .slice(0, Number(privacyConfig.recentActivityLimit || MAX_PUBLIC_ACTIVITY))
    .map((item: any) =>
      item.isPrivate && !allowPrivateRepoNames
        ? {
            ...item,
            repoName: "Private Repository",
            url: "",
            summary: "Private activity hidden.",
          }
        : item
    );

  return {
    profile: {
      login: fullStats.profile?.login || fullStats.username,
      name: fullStats.profile?.name || fullStats.username,
      avatarUrl: fullStats.profile?.avatarUrl || "",
      bio: fullStats.profile?.bio || "",
      company: fullStats.profile?.company || "",
      location: fullStats.profile?.location || "",
      blog: fullStats.profile?.blog || "",
      profileUrl: fullStats.profile?.profileUrl || `https://github.com/${fullStats.username}`,
      joinedAt: fullStats.profile?.joinedAt || "",
    },
    followers: Number(fullStats.totals.followers || 0),
    following: Number(fullStats.totals.following || 0),
    stars: Number(fullStats.totals.totalStars || 0),
    forks: Number(fullStats.totals.totalForks || 0),
    publicRepos: Number(fullStats.totals.publicRepos || 0),
    privateRepos: Number(fullStats.totals.privateRepos || 0),
    totalCommits: Number(fullStats.totals.totalCommits || 0),
    publicCommits: Number(fullStats.totals.publicCommits || 0),
    privateCommits: Number(fullStats.totals.privateCommits || 0),
    privateIncluded: Boolean(privacyConfig.includePrivateCommits || privacyConfig.commitCountMode === "publicAndPrivateCommits"),
    showLifetimeCommits: Boolean(privacyConfig.showLifetimeCommits ?? true),
    totalRepositories: Number(fullStats.totals.totalRepos || 0),
    pullRequests: Number(fullStats.totals.totalPullRequests || 0),
    issues: Number(fullStats.totals.totalIssues || 0),
    privateCommitCount,
    languages: Object.entries(fullStats.languages || {}).map(([name, value]) => ({ name, value: Number(value) })),
    organizations: fullStats.organizations || [],
    contributions: {
      total: Number(fullStats.contributionSummary?.totalContributions || 0),
      weeks: Number(fullStats.contributionSummary?.weeks || 0),
      heatmap: fullStats.contributionCalendar || [],
    },
    repositories: visibleRepositories.map((repo: any) => sanitizeRepositoryForPublic(repo, allowPrivateRepoNames)),
    latestRepos,
    pinnedRepos,
    recentActivity,
    latestCommits,
    achievements: fullStats.achievements || [],
    syncedAt: fullStats.syncedAt,
    lastSyncError: fullStats.lastSyncError || null,
  };
}

export async function getPublicGitHubStats(username: string, options?: { forceRefresh?: boolean }) {
  await connectToDatabase();
  const siteData = await getFullSiteData();
  const refreshInterval = getConfiguredRefreshInterval(siteData);
  const privacyConfig = getPrivacyConfig(siteData);
  const cached = (await GitHubStats.findOne({ username }).lean()) as CachedGitHubStats | null;

  if (cached && !options?.forceRefresh && isFresh(cached.syncedAt, refreshInterval)) {
    return toPlainJson(toPublicStats(cached, privacyConfig));
  }

  return cached ? toPlainJson(toPublicStats(cached, privacyConfig)) : null;
}

export async function getFullGitHubStatsForAdmin(username: string) {
  await connectToDatabase();
  const stats = await GitHubStats.findOne({ username }).lean();
  return stats ? toPlainJson(stats) : null;
}

export async function syncGitHubStats(username: string) {
  await connectToDatabase();

  try {
    const siteData = await getFullSiteData();
    const privacyConfig = getPrivacyConfig(siteData);
    const hasToken = Boolean(privacyConfig.token || process.env.GITHUB_TOKEN || process.env.GITHUB_PAT);
    const includePrivateRepos = shouldUsePrivateRepos(privacyConfig) && hasToken;
    const reposEndpoint = includePrivateRepos ? `/user/repos?visibility=all&affiliation=owner&sort=updated` : `/users/${username}/repos?type=owner&sort=updated`;
    const includeRules = normalizeCommitRulesInput(privacyConfig.commitMessageIncludes);
    const excludeRules = normalizeCommitRulesInput(privacyConfig.commitMessageExcludes);
    const selectedRepositories = normalizeRepositorySelection(privacyConfig.selectedRepositories);

    const [{ data: user, rateLimit }, reposPayload, publicEvents, orgs] = await Promise.all([
      fetchGitHubApi(`/users/${username}`),
      fetchAllPages(reposEndpoint),
      fetchGitHubApi(`/users/${username}/events/public?per_page=30`),
      fetchGitHubApi(`/users/${username}/orgs?per_page=20`),
    ]);
    const repos = reposPayload.filter((repo: any) => repo.owner?.login?.toLowerCase() === username.toLowerCase());

    const pinnedRepositories = await fetchPinnedRepositories(username, Boolean(privacyConfig.includePrivateRepos));
    const languages: Record<string, number> = {};
    const recentCommits: Array<Record<string, unknown>> = [];
    const recentActivity: Array<Record<string, unknown>> = [];
    const repositoryStats: GitHubRepositoryStats[] = [];
    const seenCommitShas = new Set<string>();
    let totalStars = 0;
    let totalForks = 0;
    let totalCommits = 0;
    let publicCommits = 0;
    let privateCommits = 0;
    let totalPullRequests = 0;
    let totalIssues = 0;

    const normalizedRepos = await Promise.all(
      repos.map(async (repo: any) => {
        totalStars += Number(repo.stargazers_count || 0);
        totalForks += Number(repo.forks_count || 0);
        totalPullRequests += Number(repo.open_prs_count || 0);
        totalIssues += Number(repo.open_issues_count || 0);

        if (repo.language) {
          languages[repo.language] = (languages[repo.language] || 0) + 1;
        }

        let repoLanguages: Record<string, number> = {};
        try {
          const { data: languageData } = await fetchGitHubApi(`/repos/${repo.full_name}/languages`);
          repoLanguages = languageData || {};
        } catch {
          repoLanguages = {};
        }

        const countPrivate = repo.private && shouldCountPrivateCommits(privacyConfig);
        const repoShouldCount = !repo.private || countPrivate;
        let repoCommitCount = 0;
        let repoError = "";

        if (repoShouldCount) {
          try {
            const repoCount = await countRepoCommits(repo.full_name, username, includeRules, excludeRules);
            repoCommitCount = repoCount.count;
            for (const commit of repoCount.firstPage) {
              const sha = String(commit?.sha || "").trim();
              const message = String(commit?.commit?.message || "");
              if (sha && !seenCommitShas.has(sha) && commitVisibleByRules(message, includeRules, excludeRules)) {
                seenCommitShas.add(sha);
                recentCommits.push({
                  repoName: repo.name,
                  message,
                  createdAt: commit.commit?.author?.date || repo.pushed_at,
                  url: commit.html_url,
                  isPrivate: Boolean(repo.private),
                });
              }
            }
          } catch {
            repoError = "Failed to fetch commits";
          }
        }

        if (shouldCountRepoInTotals(repo, privacyConfig)) {
          if (repo.private) privateCommits += repoCommitCount;
          else publicCommits += repoCommitCount;
          totalCommits += repoCommitCount;
        }
        const mappedRepo = mapRepository({
          ...repo,
          fullName: repo.full_name,
          publicCommitCount: repo.private ? 0 : repoCommitCount,
          privateCommitCount: repo.private ? repoCommitCount : 0,
          commitCount: repoCommitCount,
          pullRequestCount: repo.open_prs_count || 0,
          issueCount: repo.open_issues_count || 0,
          languages: repoLanguages,
          topics: repo.topics || [],
          homepage: repo.homepage || "",
        });

        repositoryStats.push({
          name: mappedRepo.name,
          fullName: repo.full_name,
          private: Boolean(repo.private),
          commitCount: repoCommitCount,
          publicCommitCount: repo.private ? 0 : repoCommitCount,
          privateCommitCount: repo.private ? repoCommitCount : 0,
          selected: selectedRepositories.length ? selectedRepositories.includes(repositoryKey(repo)) || selectedRepositories.includes(String(repo.name || "").toLowerCase()) : true,
          syncStatus: repoError ? "failed" : "success",
          error: repoError || undefined,
          archived: Boolean(repo.archived),
          fork: Boolean(repo.fork),
          updatedAt: repo.pushed_at || repo.updated_at,
        });

        return mappedRepo;
      })
    );

    for (const event of Array.isArray(publicEvents.data) ? publicEvents.data : []) {
      recentActivity.push({
        id: event.id,
        type: event.type,
        repoName: event.repo?.name || "",
        createdAt: event.created_at,
        url: event.repo?.name ? `https://github.com/${event.repo.name}` : `https://github.com/${username}`,
        summary: event.type === "PushEvent"
          ? `${event.payload?.commits?.length || 0} commit${event.payload?.commits?.length === 1 ? "" : "s"} pushed`
          : event.type === "CreateEvent"
            ? `Created ${event.payload?.ref_type || "resource"}`
            : event.type,
        isPrivate: false,
      });
    }

    recentCommits.sort((a: any, b: any) => new Date(String(b.createdAt)).getTime() - new Date(String(a.createdAt)).getTime());
    recentActivity.sort((a: any, b: any) => new Date(String(b.createdAt)).getTime() - new Date(String(a.createdAt)).getTime());

    const contribution = buildContributionHeatmap(recentCommits as Array<{ createdAt: string }>);

    const stats = {
      username: user.login,
      syncedAt: new Date().toISOString(),
      profile: {
        login: user.login,
        name: user.name || user.login,
        avatarUrl: user.avatar_url || "",
        bio: user.bio || "",
        company: user.company || "",
        location: user.location || "",
        blog: normalizeBlogUrl(user.blog),
      profileUrl: normalizeBlogUrl(user.html_url) || `https://github.com/${user.login}`,
        joinedAt: user.created_at || "",
      },
      totals: {
        totalRepos: repos.length,
        publicRepos: repos.filter((repo: any) => !repo.private).length,
        privateRepos: repos.filter((repo: any) => repo.private).length,
        totalStars,
        totalForks,
        publicCommits,
        privateCommits,
        totalCommits,
        totalPullRequests,
        totalIssues,
        followers: Number(user.followers || 0),
        following: Number(user.following || 0),
      },
      repositories: normalizedRepos,
      pinnedRepositories,
      languages: Object.entries(languages)
        .sort(([, left], [, right]) => Number(right) - Number(left))
        .reduce<Record<string, number>>((acc, [name, value]) => {
          acc[name] = Number(value);
          return acc;
        }, {}),
      recentCommits: recentCommits.slice(0, 60),
      recentActivity: recentActivity.slice(0, 40),
      contributionCalendar: contribution.heatmap,
      contributionSummary: {
        totalContributions: contribution.total,
        weeks: contribution.weeks,
      },
      commitCountMode: privacyConfig.commitCountMode || "publicCommitsOnly",
      repositorySelectionMode: privacyConfig.repositorySelectionMode || "all",
      selectedRepositories: privacyConfig.selectedRepositories || [],
      includeKeywords: includeRules,
      excludeKeywords: excludeRules,
      commitSelection: {
        includePrivateCommits: Boolean(privacyConfig.includePrivateCommits),
        repositoryMode: privacyConfig.repositorySelectionMode || "all",
        selectedRepositories: privacyConfig.selectedRepositories || [],
      },
      repositoryStats,
      availableRepositories: repositoryStats,
      activity: {},
      privateSummary: {
        totalPrivateRepos: repos.filter((repo: any) => repo.private).length,
      },
      organizations: Array.isArray(orgs.data)
        ? orgs.data.map((org: any) => ({
            login: org.login,
            avatarUrl: org.avatar_url,
            url: org.url || org.html_url,
          }))
        : [],
      achievements: [],
      rateLimit: {
        remaining: rateLimit.remaining,
        limit: rateLimit.limit,
        resetAt: rateLimit.resetAt,
      },
      lastSyncError: null,
    };

    await GitHubStats.findOneAndUpdate({ username }, stats, { upsert: true, new: true, setDefaultsOnInsert: true });
    return { success: true as const, stats };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";

    await GitHubStats.findOneAndUpdate(
      { username },
      {
        lastSyncError: errorMessage,
        syncedAt: new Date().toISOString(),
      },
      { upsert: true }
    );

    return { success: false as const, error: errorMessage };
  }
}

export async function clearGitHubCache(username: string) {
  await connectToDatabase();
  await GitHubStats.deleteOne({ username });
  return { success: true };
}

function commitMatchesFilters(commit: { repoName?: string; message?: string }, config: GitHubPrivacyConfig) {
  const includes = normalizeTerms(config.commitMessageIncludes);
  const excludes = normalizeTerms(config.commitMessageExcludes);
  const haystack = `${commit.repoName || ""} ${commit.message || ""}`.toLowerCase();

  if (includes.length > 0 && !includes.some((term) => haystack.includes(term))) {
    return false;
  }

  if (excludes.some((term) => haystack.includes(term))) {
    return false;
  }

  return true;
}

function repositoryKey(repo: { fullName?: string; full_name?: string; name: string }) {
  return String(repo.fullName || repo.full_name || repo.name || "").toLowerCase();
}

function repoMatchesCommitMode(repo: any, config: GitHubPrivacyConfig) {
  const mode = config.commitCountMode || "publicCommitsOnly";
  const selected = normalizeRepositorySelection(config.selectedRepositories);
  const repoKey = repositoryKey(repo);
  const isSelected = selected.length === 0 ? true : selected.includes(repoKey) || selected.includes(String(repo.name || "").toLowerCase());

  if (mode === "selectedRepositoriesOnly" || mode === "customRepositoryList") {
    return isSelected;
  }

  if (mode === "publicReposOnly") {
    return !repo.private;
  }

  return true;
}

function shouldCountRepoInTotals(repo: any, config: GitHubPrivacyConfig) {
  const mode = config.commitCountMode || "publicCommitsOnly";
  const selected = normalizeRepositorySelection(config.selectedRepositories);
  const repoKey = repositoryKey(repo);
  const isSelected = selected.length === 0 ? true : selected.includes(repoKey) || selected.includes(String(repo.name || "").toLowerCase());

  if (mode === "selectedRepositoriesOnly" || mode === "customRepositoryList") return isSelected;
  if (mode === "publicReposOnly") return !repo.private;
  return true;
}

function normalizeCommitRulesInput(values?: string[] | string) {
  return normalizeCommitRuleInput(values).map((value) => value.toLowerCase());
}

function commitVisibleByRules(commitMessage: string, includeRules: string[], excludeRules: string[]) {
  const haystack = commitMessage.toLowerCase();
  const hasIncludes = includeRules.length > 0;
  if (hasIncludes && !includeRules.some((term) => haystack.includes(term.toLowerCase()))) {
    return false;
  }
  if (excludeRules.some((term) => haystack.includes(term.toLowerCase()))) {
    return false;
  }
  return true;
}

function matchesTextFilters(item: { repoName?: string; summary?: string; message?: string }, hiddenRepos: string[], hiddenKeywords: string[]) {
  const repo = String(item.repoName || "").toLowerCase();
  const text = `${item.summary || ""} ${item.message || ""}`.toLowerCase();
  if (hiddenRepos.some((name) => repo === name.toLowerCase())) return false;
  if (hiddenKeywords.some((term) => text.includes(term.toLowerCase()))) return false;
  return true;
}
