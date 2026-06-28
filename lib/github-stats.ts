<<<<<<< HEAD
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
  };
}

function normalizeBlogUrl(value: unknown) {
  const text = String(value || "").trim();
  return text;
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

async function countRepoCommits(repoFullName: string, username: string) {
  const commits = await fetchAllPages(`/repos/${repoFullName}/commits?author=${encodeURIComponent(username)}`);
  return Array.isArray(commits) ? commits.length : 0;
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
  return {
    name: repo.name,
    description: repo.description || "",
    private: Boolean(repo.private),
    stars: Number(repo.stargazers_count || repo.stars || 0),
    forks: Number(repo.forks_count || repo.forks || 0),
    language: repo.language || "",
    languages: repo.languages || {},
    url: repo.html_url || repo.url || "",
    updatedAt: repo.pushed_at || repo.updatedAt || new Date().toISOString(),
    commitCount: Number(repo.commitCount || 0),
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
    .slice(0, MAX_PUBLIC_REPOS)
    .map((repo: any) => sanitizeRepositoryForPublic(repo, allowPrivateRepoNames));
  const pinnedRepos = (fullStats.pinnedRepositories || [])
    .filter((repo: any) => !repo.private || allowPrivateRepoNames)
    .slice(0, 6)
    .map((repo: any) => sanitizeRepositoryForPublic(repo, allowPrivateRepoNames));
  const latestCommits = (fullStats.recentCommits || [])
    .filter((commit: any) => !commit.isPrivate || allowPrivateCommitMessages)
    .slice(0, MAX_PUBLIC_COMMITS)
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
    .slice(0, MAX_PUBLIC_ACTIVITY)
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
    return toPublicStats(cached, privacyConfig);
  }

  return cached ? toPublicStats(cached, privacyConfig) : null;
}

export async function getFullGitHubStatsForAdmin(username: string) {
  await connectToDatabase();
  return await GitHubStats.findOne({ username });
}

export async function syncGitHubStats(username: string) {
  await connectToDatabase();

  try {
    const siteData = await getFullSiteData();
    const privacyConfig = getPrivacyConfig(siteData);
    const hasToken = Boolean(privacyConfig.token || process.env.GITHUB_TOKEN || process.env.GITHUB_PAT);
    const includePrivateRepos = shouldUsePrivateRepos(privacyConfig) && hasToken;
    const reposEndpoint = includePrivateRepos ? `/user/repos?visibility=all&affiliation=owner&sort=updated` : `/users/${username}/repos?type=owner&sort=updated`;

    const [{ data: user, rateLimit }, reposPayload, publicEvents, orgs] = await Promise.all([
      fetchGitHubApi(`/users/${username}`),
      fetchAllPages(reposEndpoint),
      fetchGitHubApi(`/users/${username}/events/public?per_page=30`),
      fetchGitHubApi(`/users/${username}/orgs?per_page=20`),
    ]);
    const repos = reposPayload.filter((repo: any) => repo.owner?.login === username && isRepoSelected(repo, privacyConfig));

    const pinnedRepositories = await fetchPinnedRepositories(username, Boolean(privacyConfig.includePrivateRepos));
    const languages: Record<string, number> = {};
    const recentCommits: Array<Record<string, unknown>> = [];
    const recentActivity: Array<Record<string, unknown>> = [];
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

        if (repoShouldCount) {
          try {
            repoCommitCount = await countRepoCommits(repo.full_name, username);
            const { data: commits } = await fetchGitHubApi(`/repos/${repo.full_name}/commits?author=${encodeURIComponent(username)}&per_page=8`);
            if (Array.isArray(commits)) {
              for (const commit of commits) {
                recentCommits.push({
                  repoName: repo.name,
                  message: commit.commit?.message || "",
                  createdAt: commit.commit?.author?.date || repo.pushed_at,
                  url: commit.html_url,
                  isPrivate: Boolean(repo.private),
                });
              }
            }
          } catch {
            // Keep syncing even if commit fetch fails for one repo.
          }
        }

        if (repo.private) privateCommits += repoCommitCount;
        else publicCommits += repoCommitCount;
        totalCommits += repoCommitCount;
        return mapRepository({
          ...repo,
          fullName: repo.full_name,
          commitCount: 0,
          publicCommitCount: repo.private ? 0 : repoCommitCount,
          privateCommitCount: repo.private ? repoCommitCount : 0,
          pullRequestCount: repo.open_prs_count || 0,
          issueCount: repo.open_issues_count || 0,
          languages: repoLanguages,
          topics: repo.topics || [],
          homepage: repo.homepage || "",
        });
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
        profileUrl: user.html_url || `https://github.com/${user.login}`,
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
      commitSelection: {
        includePrivateCommits: Boolean(privacyConfig.includePrivateCommits),
        repositoryMode: privacyConfig.repositorySelectionMode || "all",
        selectedRepositories: privacyConfig.selectedRepositories || [],
      },
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
=======
import { connectToDatabase } from './mongodb';
import { GitHubStats } from '@/models/GitHubStats';
import { getSiteData } from "@/src/lib/site-data";

const GITHUB_API_URL = 'https://api.github.com';

async function getHeaders() {
    const siteData = await getSiteData();
    // Use token from admin config, fallback to process.env.GITHUB_TOKEN
    const token = siteData.githubConfig?.token || process.env.GITHUB_TOKEN;
    
    const headers: HeadersInit = {
        'Accept': 'application/vnd.github.v3+json',
    };

    if (token) {
        headers['Authorization'] = `token ${token}`;
    }
    return headers;
}

async function fetchGitHubApi(endpoint: string) {
    const headers = await getHeaders();
    const response = await fetch(`${GITHUB_API_URL}${endpoint}`, { headers });
    if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }
    // Get rate limit info from response headers
    const rateLimit = {
        remaining: parseInt(response.headers.get('X-RateLimit-Remaining') || '0'),
        limit: parseInt(response.headers.get('X-RateLimit-Limit') || '0'),
        resetAt: new Date(parseInt(response.headers.get('X-RateLimit-Reset') || '0') * 1000).toISOString()
    };
    const data = await response.json();
    return { data, rateLimit };
}

// Helper to handle pagination for GitHub API
async function fetchAllPages(endpoint: string) {
    let allData: any[] = [];
    let nextUrl: string | null = endpoint;
    
    while (nextUrl) {
        const { data } = await fetchGitHubApi(nextUrl.replace(GITHUB_API_URL, ''));
        allData = allData.concat(data);
        
        // Check for Link header to find next page
        const headers = await getHeaders();
        const linkResponse: Response = await fetch(`${GITHUB_API_URL}${nextUrl}`, { headers });
        const linkHeader: string | null = linkResponse.headers.get('Link');
        if (linkHeader && linkHeader.includes('rel="next"')) {
            const match: RegExpMatchArray | null = linkHeader.match(/<(https:\/\/api.github.com[^>]+)>; rel="next"/);
            nextUrl = match ? match[1] : null;
        } else {
            nextUrl = null;
        }
    }
    return allData;
}

export async function getPublicGitHubStats(username: string) {
    await connectToDatabase();
    
    const fullStats = await GitHubStats.findOne({ username });
    if (!fullStats) {
        return null;
    }

    // Return only public-safe data
    const publicRepos = fullStats.repositories.filter((repo: any) => !repo.private).slice(0, 10);
    const publicCommits = fullStats.recentCommits.filter((commit: any) => !commit.isPrivate).slice(0, 10);
    
    return {
        username: fullStats.username,
        totalRepos: fullStats.totals.totalRepos,
        publicRepos: fullStats.totals.publicRepos,
        privateRepos: fullStats.totals.privateRepos,
        totalStars: fullStats.totals.totalStars,
        totalForks: fullStats.totals.totalForks,
        topLanguages: fullStats.languages,
        latestPublicRepos: publicRepos,
        recentPublicActivity: publicCommits,
        syncedAt: fullStats.syncedAt,
        profileUrl: `https://github.com/${username}`,
    };
}

export async function getFullGitHubStatsForAdmin(username: string) {
    await connectToDatabase();
    return await GitHubStats.findOne({ username });
}

export async function syncGitHubStats(username: string) {
    await connectToDatabase();
    
    try {
        // Fetch user data
        const { data: user, rateLimit } = await fetchGitHubApi('/user');
        
        // Fetch all repositories (public + private)
        const repos = await fetchAllPages('/user/repos?visibility=all&affiliation=owner,collaborator,organization_member&per_page=100');
        
        // Calculate totals
        let totalStars = 0;
        let totalForks = 0;
        let totalCommits = 0;
        let totalPullRequests = 0;
        let totalIssues = 0;
        const languages: Record<string, number> = {};
        const allCommits: any[] = [];
        
        const publicRepos = repos.filter((repo: any) => !repo.private);
        const privateRepos = repos.filter((repo: any) => repo.private);
        
        // Process repositories
        const processedRepos = await Promise.all(repos.map(async (repo: any) => {
            totalStars += repo.stargazers_count;
            totalForks += repo.forks_count;
            totalPullRequests += repo.open_prs_count || 0;
            totalIssues += repo.open_issues_count || 0;
            
            if (repo.language) {
                languages[repo.language] = (languages[repo.language] || 0) + 1;
            }
            
            // Fetch commits only for latest public repos to avoid rate limits
            if (!repo.private && new Date(repo.pushed_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)) {
                try {
                    const { data: commits } = await fetchGitHubApi(`/repos/${repo.full_name}/commits?per_page=20`);
                    const repoCommits = commits.map((commit: any) => ({
                        repoName: repo.name,
                        message: commit.commit.message,
                        createdAt: commit.commit.author.date,
                        url: commit.html_url,
                        isPrivate: repo.private,
                    }));
                    allCommits.push(...repoCommits);
                    totalCommits += commits.length;
                } catch (e) {
                    // Skip if we can't fetch commits
                }
            }
            
            return {
                name: repo.name,
                description: repo.description,
                private: repo.private,
                stars: repo.stargazers_count,
                forks: repo.forks_count,
                language: repo.language,
                url: repo.html_url,
                updatedAt: repo.pushed_at,
                commitCount: repo.default_branch ? 0 : null, // Approximate if we didn't fetch
                pullRequestCount: repo.open_prs_count || 0,
                issueCount: repo.open_issues_count || 0,
            };
        }));
        
        // Sort languages by usage
        const sortedLanguages = Object.entries(languages)
            .sort(([, a], [, b]) => b - a)
            .reduce((acc, [lang, count]) => ({ ...acc, [lang]: count }), {});
            
        // Sort commits by date
        allCommits.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        
        // Fetch organizations
        const { data: orgs } = await fetchGitHubApi('/user/orgs');
        
        // Store in MongoDB
        const stats = {
            username: user.login,
            syncedAt: new Date().toISOString(),
            totals: {
                totalRepos: repos.length,
                publicRepos: publicRepos.length,
                privateRepos: privateRepos.length,
                totalStars,
                totalForks,
                totalCommits,
                totalPullRequests,
                totalIssues,
            },
            repositories: processedRepos,
            languages: sortedLanguages,
            recentCommits: allCommits.slice(0, 20),
            activity: {},
            privateSummary: {
                totalPrivateRepos: privateRepos.length,
            },
            organizations: orgs,
            rateLimit: {
                remaining: rateLimit.remaining,
                limit: rateLimit.limit,
                resetAt: rateLimit.resetAt,
            },
            lastSyncError: null,
        };
        
        await GitHubStats.findOneAndUpdate(
            { username },
            stats,
            { upsert: true, new: true }
        );
        
        return { success: true, stats };
    } catch (error) {
        console.error('Error syncing GitHub stats:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        
        // Update with error
        await GitHubStats.findOneAndUpdate(
            { username },
            { 
                lastSyncError: errorMessage,
                syncedAt: new Date().toISOString(),
            },
            { upsert: true }
        );
        
        return { success: false, error: errorMessage };
    }
}

export async function clearGitHubCache(username: string) {
    await connectToDatabase();
    await GitHubStats.deleteOne({ username });
    return { success: true };
}
>>>>>>> c974e6d18f7e4d84cefd23b3ad822ac4cf9981fc
