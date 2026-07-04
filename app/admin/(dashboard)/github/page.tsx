"use client";

import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "@/components/admin/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { useToast } from "@/components/admin/ToastProvider";

type CommitCountMode = "publicCommitsOnly" | "publicAndPrivateCommits" | "publicReposOnly" | "selectedRepositoriesOnly" | "customRepositoryList";
type RepositorySelectionMode = "all" | "publicOnly" | "privateOnly" | "selected";

type GitHubConfig = {
  username: string;
  token: string;
  enabled: boolean;
  refreshInterval: number;
  includePrivateRepos: boolean;
  includePrivateCommits: boolean;
  showLifetimeCommits: boolean;
  showPrivateReposPublicly: boolean;
  showPrivateCommitsPublicly: boolean;
  publicDisplayMode: "publicOnly" | "aggregatePrivateOnly" | "includePrivateNames" | "includePrivateWithCommits";
  commitCountMode: CommitCountMode;
  repositorySelectionMode: RepositorySelectionMode;
  selectedRepositories: string[];
  commitMessageIncludes: string[];
  commitMessageExcludes: string[];
  recentCommitsEnabled: boolean;
  recentCommitsLimit: number;
  recentCommitsHideRepositories: string[];
  recentCommitsHideKeywords: string[];
  recentCommitsSelectedRepositories: string[];
  recentCommitsShowMessage: boolean;
  recentCommitsShowRepository: boolean;
  recentCommitsShowDate: boolean;
  recentCommitsShowAuthor: boolean;
  recentCommitsShowAvatar: boolean;
  recentCommitsSortNewest: boolean;
  recentActivityEnabled: boolean;
  recentActivityLimit: number;
  recentActivityHiddenTypes: string[];
  recentActivityHideRepositories: string[];
  recentActivityHideKeywords: string[];
  repositoryCardsLimit: number;
  repositoryCardsSelectedRepositories: string[];
  repositoryCardsHideArchived: boolean;
  repositoryCardsHideForked: boolean;
  repositoryCardsHidePrivate: boolean;
  repositoryCardsSort: "stars" | "updated" | "name" | "manual";
  repositoryCardsManualOrder: string[];
  showTotalCommits: boolean;
  showStars: boolean;
  showFollowers: boolean;
  showFollowing: boolean;
  showForks: boolean;
  showPullRequests: boolean;
  showIssues: boolean;
  showOrganizations: boolean;
  showContributionStreak: boolean;
  pinnedProjectsLimit: number;
  pinnedProjectsOrder: string[];
  cardsPerRow: number;
  paginationSize: number;
  infiniteScroll: boolean;
  showViewOnGitHubButtons: boolean;
  openLinksInNewTab: boolean;
  showGitHubIcons: boolean;
  showLanguageColors: boolean;
};

type GitHubStats = {
  syncedAt?: string;
  publicCommits?: number;
  privateCommits?: number;
  totalCommits?: number;
  privateIncluded?: boolean;
  totals?: {
    totalRepos: number;
    publicRepos: number;
    privateRepos: number;
    totalStars: number;
    totalForks: number;
    publicCommits?: number;
    privateCommits?: number;
    totalCommits?: number;
  };
  repositories?: Array<{ name: string; fullName?: string; private?: boolean; commitCount?: number; publicCommitCount?: number; privateCommitCount?: number }>;
  repositoryStats?: Array<{ name: string; fullName: string; private: boolean; commitCount: number; publicCommitCount: number; privateCommitCount: number; selected: boolean; syncStatus: "success" | "failed"; error?: string }>;
  availableRepositories?: Array<{ name: string; fullName?: string; private?: boolean; commitCount?: number; publicCommitCount?: number; privateCommitCount?: number; selected?: boolean }>;
  selectedRepositories?: string[];
  lastSyncError?: string;
};

const defaultConfig: GitHubConfig = {
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

function normalizeConfig(input?: Partial<GitHubConfig> | null): GitHubConfig {
  return {
    ...defaultConfig,
    ...input,
    username: input?.username || "",
    token: input?.token || "",
    selectedRepositories: Array.isArray(input?.selectedRepositories) ? input.selectedRepositories : [],
    commitMessageIncludes: Array.isArray(input?.commitMessageIncludes) ? input.commitMessageIncludes : [],
    commitMessageExcludes: Array.isArray(input?.commitMessageExcludes) ? input.commitMessageExcludes : [],
    recentCommitsEnabled: input?.recentCommitsEnabled ?? true,
    recentCommitsLimit: input?.recentCommitsLimit ?? 10,
    recentCommitsHideRepositories: Array.isArray(input?.recentCommitsHideRepositories) ? input.recentCommitsHideRepositories : [],
    recentCommitsHideKeywords: Array.isArray(input?.recentCommitsHideKeywords) ? input.recentCommitsHideKeywords : [],
    recentCommitsSelectedRepositories: Array.isArray(input?.recentCommitsSelectedRepositories) ? input.recentCommitsSelectedRepositories : [],
    recentCommitsShowMessage: input?.recentCommitsShowMessage ?? true,
    recentCommitsShowRepository: input?.recentCommitsShowRepository ?? true,
    recentCommitsShowDate: input?.recentCommitsShowDate ?? true,
    recentCommitsShowAuthor: input?.recentCommitsShowAuthor ?? false,
    recentCommitsShowAvatar: input?.recentCommitsShowAvatar ?? false,
    recentCommitsSortNewest: input?.recentCommitsSortNewest ?? true,
    recentActivityEnabled: input?.recentActivityEnabled ?? true,
    recentActivityLimit: input?.recentActivityLimit ?? 10,
    recentActivityHiddenTypes: Array.isArray(input?.recentActivityHiddenTypes) ? input.recentActivityHiddenTypes : [],
    recentActivityHideRepositories: Array.isArray(input?.recentActivityHideRepositories) ? input.recentActivityHideRepositories : [],
    recentActivityHideKeywords: Array.isArray(input?.recentActivityHideKeywords) ? input.recentActivityHideKeywords : [],
    repositoryCardsLimit: input?.repositoryCardsLimit ?? 12,
    repositoryCardsSelectedRepositories: Array.isArray(input?.repositoryCardsSelectedRepositories) ? input.repositoryCardsSelectedRepositories : [],
    repositoryCardsHideArchived: input?.repositoryCardsHideArchived ?? false,
    repositoryCardsHideForked: input?.repositoryCardsHideForked ?? false,
    repositoryCardsHidePrivate: input?.repositoryCardsHidePrivate ?? true,
    repositoryCardsSort: input?.repositoryCardsSort ?? "stars",
    repositoryCardsManualOrder: Array.isArray(input?.repositoryCardsManualOrder) ? input.repositoryCardsManualOrder : [],
    showTotalCommits: input?.showTotalCommits ?? true,
    showStars: input?.showStars ?? true,
    showFollowers: input?.showFollowers ?? true,
    showFollowing: input?.showFollowing ?? true,
    showForks: input?.showForks ?? true,
    showPullRequests: input?.showPullRequests ?? true,
    showIssues: input?.showIssues ?? true,
    showOrganizations: input?.showOrganizations ?? true,
    showContributionStreak: input?.showContributionStreak ?? true,
    pinnedProjectsLimit: input?.pinnedProjectsLimit ?? 6,
    pinnedProjectsOrder: Array.isArray(input?.pinnedProjectsOrder) ? input.pinnedProjectsOrder : [],
    cardsPerRow: input?.cardsPerRow ?? 3,
    paginationSize: input?.paginationSize ?? 12,
    infiniteScroll: input?.infiniteScroll ?? false,
    showViewOnGitHubButtons: input?.showViewOnGitHubButtons ?? true,
    openLinksInNewTab: input?.openLinksInNewTab ?? true,
    showGitHubIcons: input?.showGitHubIcons ?? true,
    showLanguageColors: input?.showLanguageColors ?? true,
  };
}

function normalizeStats(input?: Partial<GitHubStats> | null) {
  const totals: NonNullable<GitHubStats["totals"]> = input?.totals || {
    totalRepos: 0,
    publicRepos: 0,
    privateRepos: 0,
    totalStars: 0,
    totalForks: 0,
  };
  return {
    syncedAt: input?.syncedAt || "",
    publicCommits: input?.publicCommits ?? totals.publicCommits ?? 0,
    privateCommits: input?.privateCommits ?? totals.privateCommits ?? 0,
    totalCommits: input?.totalCommits ?? totals.totalCommits ?? 0,
    privateIncluded: Boolean(input?.privateIncluded),
    totals: {
      totalRepos: totals.totalRepos ?? 0,
      publicRepos: totals.publicRepos ?? 0,
      privateRepos: totals.privateRepos ?? 0,
      totalStars: totals.totalStars ?? 0,
      totalForks: totals.totalForks ?? 0,
      publicCommits: totals.publicCommits ?? input?.publicCommits ?? 0,
      privateCommits: totals.privateCommits ?? input?.privateCommits ?? 0,
      totalCommits: totals.totalCommits ?? input?.totalCommits ?? 0,
    },
    repositories: Array.isArray(input?.repositories) ? input.repositories : [],
    repositoryStats: Array.isArray(input?.repositoryStats) ? input.repositoryStats : [],
    availableRepositories: Array.isArray(input?.availableRepositories) ? input.availableRepositories : [],
    selectedRepositories: Array.isArray(input?.selectedRepositories) ? input.selectedRepositories : [],
    lastSyncError: input?.lastSyncError || "",
  };
}

export default function GitHubAdminPage() {
  const { notify } = useToast();
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [showToken, setShowToken] = useState(false);
  const [config, setConfig] = useState<GitHubConfig>(defaultConfig);
  const [stats, setStats] = useState<ReturnType<typeof normalizeStats> | null>(null);
  const [repoOptions, setRepoOptions] = useState<NonNullable<GitHubStats["availableRepositories"]>>([]);

  useEffect(() => {
    async function fetchData() {
      const siteRes = await fetch("/api/admin/github/settings");
      if (siteRes.ok) {
        const siteData = await siteRes.json();
        if (siteData.data) setConfig(normalizeConfig(siteData.data));
      }

      const reposRes = await fetch("/api/admin/github/repositories");
      if (reposRes.ok) {
        const reposData = await reposRes.json();
        if (reposData.success) {
          const nextRepos = Array.isArray(reposData.availableRepositories) ? reposData.availableRepositories : [];
          setRepoOptions(nextRepos);
          setStats((current) => normalizeStats({ ...(current || {}), availableRepositories: nextRepos, selectedRepositories: Array.isArray(reposData.selectedRepositories) ? reposData.selectedRepositories : [] }));
        }
      }

      const statsRes = await fetch("/api/admin/github/stats");
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        if (statsData.success) {
          setStats(normalizeStats(statsData.data));
          if (Array.isArray(statsData.data?.availableRepositories) && statsData.data.availableRepositories.length > 0) {
            setRepoOptions(statsData.data.availableRepositories);
          } else if (Array.isArray(statsData.data?.repositoryStats) && statsData.data.repositoryStats.length > 0) {
            setRepoOptions(statsData.data.repositoryStats);
          } else if (Array.isArray(statsData.data?.repositories) && statsData.data.repositories.length > 0) {
            setRepoOptions(statsData.data.repositories);
          }
        }
        else setStats(normalizeStats(null));
      }
    }

    void fetchData();
  }, []);

  const repoList = useMemo(() => repoOptions.length ? repoOptions : (stats?.availableRepositories ?? stats?.repositoryStats ?? stats?.repositories ?? []), [repoOptions, stats?.availableRepositories, stats?.repositoryStats, stats?.repositories]);
  const selectedRepositories = config.selectedRepositories ?? [];
  const recentCommitsSelectedRepositories = config.recentCommitsSelectedRepositories ?? [];
  const recentActivityHiddenTypes = config.recentActivityHiddenTypes ?? [];
  const recentActivityHideRepositories = config.recentActivityHideRepositories ?? [];
  const includeRules = config.commitMessageIncludes ?? [];
  const excludeRules = config.commitMessageExcludes ?? [];
  const selectedSet = useMemo(() => new Set(selectedRepositories), [selectedRepositories]);
  const recentCommitsSelectedSet = useMemo(() => new Set(recentCommitsSelectedRepositories), [recentCommitsSelectedRepositories]);
  const recentActivityHideRepoSet = useMemo(() => new Set(recentActivityHideRepositories), [recentActivityHideRepositories]);
  const recentActivityHiddenTypeSet = useMemo(() => new Set(recentActivityHiddenTypes), [recentActivityHiddenTypes]);
  const visibleRepoCount = repoList.length;
  const selectedVisibleRepoCount = repoList.filter((repo) => selectedSet.has((repo as any).fullName || (repo as any).name) || Boolean((repo as any).selected)).length;
  const selectedRecentCommitRepoCount = repoList.filter((repo) => recentCommitsSelectedSet.has((repo as any).fullName || (repo as any).name) || Boolean((repo as any).selected)).length;
  const selectedRecentActivityRepoCount = repoList.filter((repo) => recentActivityHideRepoSet.has((repo as any).fullName || (repo as any).name) || Boolean((repo as any).selected)).length;

  function updateConfig(next: Partial<GitHubConfig>) {
    setConfig((current) => ({ ...current, ...next }));
  }

  async function saveConfig() {
    setLoading(true);
    try {
      const nextConfig = normalizeConfig({
        ...config,
        selectedRepositories: config.selectedRepositories ?? [],
        commitMessageIncludes: config.commitMessageIncludes ?? [],
        commitMessageExcludes: config.commitMessageExcludes ?? [],
      });
      const response = await fetch("/api/admin/github/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: nextConfig }),
      });
      const payload = await response.json();
      if (!payload.success) throw new Error(payload.error || payload.reason || payload.details || "Failed to save configuration");
      notify("success", "GitHub configuration saved.");
      if (payload.data) setConfig(normalizeConfig(payload.data));
      const reposRes = await fetch("/api/admin/github/repositories");
      if (reposRes.ok) {
        const reposData = await reposRes.json();
        if (reposData.success) setStats((current) => normalizeStats({ ...(current || {}), availableRepositories: Array.isArray(reposData.availableRepositories) ? reposData.availableRepositories : [], selectedRepositories: Array.isArray(reposData.selectedRepositories) ? reposData.selectedRepositories : [] }));
      }
    } catch (error) {
      notify("error", error instanceof Error ? error.message : "Failed to save configuration.");
    } finally {
      setLoading(false);
    }
  }

  async function syncGitHub() {
    setSyncing(true);
    try {
      const response = await fetch("/api/admin/github/sync", { method: "POST" });
      const payload = await response.json();
      if (!response.ok || !payload.success) throw new Error(payload.details || payload.error || "GitHub sync failed");
      notify("success", "GitHub stats synced.");
      const reposRes = await fetch("/api/admin/github/repositories");
      if (reposRes.ok) {
        const reposData = await reposRes.json();
        if (reposData.success) setStats((current) => normalizeStats({ ...(current || {}), availableRepositories: Array.isArray(reposData.availableRepositories) ? reposData.availableRepositories : [], selectedRepositories: Array.isArray(reposData.selectedRepositories) ? reposData.selectedRepositories : [] }));
      }
      const statsRes = await fetch("/api/admin/github/stats");
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        if (statsData.success) setStats(statsData.data);
      }
    } catch (error) {
      notify("error", error instanceof Error ? error.message : "GitHub sync failed.");
    } finally {
      setSyncing(false);
    }
  }

  async function clearCache() {
    setClearing(true);
    try {
      const response = await fetch("/api/admin/github/clear-cache", { method: "POST" });
      const payload = await response.json();
      if (!response.ok || !payload.success) throw new Error(payload.details || payload.error || "Clear cache failed");
      setStats(null);
      notify("success", "GitHub cache cleared.");
    } catch (error) {
      notify("error", error instanceof Error ? error.message : "Clear cache failed.");
    } finally {
      setClearing(false);
    }
  }

  function toggleSelectedRepository(name: string) {
    setConfig((current) => {
      const next = new Set(current.selectedRepositories ?? []);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return { ...current, selectedRepositories: Array.from(next) };
    });
  }

  function toggleRecentCommitRepository(name: string) {
    setConfig((current) => {
      const next = new Set(current.recentCommitsSelectedRepositories ?? []);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return { ...current, recentCommitsSelectedRepositories: Array.from(next) };
    });
  }

  function toggleRecentActivityHiddenRepository(name: string) {
    setConfig((current) => {
      const next = new Set(current.recentActivityHideRepositories ?? []);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return { ...current, recentActivityHideRepositories: Array.from(next) };
    });
  }

  function toggleRecentActivityHiddenType(type: string) {
    setConfig((current) => {
      const next = new Set(current.recentActivityHiddenTypes ?? []);
      if (next.has(type)) next.delete(type);
      else next.add(type);
      return { ...current, recentActivityHiddenTypes: Array.from(next) };
    });
  }

  function parseList(value: string) {
    return value
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
  }

  return (
    <div className="space-y-6">
      <PageHeader title="GitHub Settings" description="Configure repository selection and commit counting modes." />

      <section className="rounded-2xl border border-admin-border bg-admin-card p-6 space-y-4">
        <h3 className="text-lg font-semibold text-admin-text">Commit Count Mode</h3>
        <div className="grid gap-3 md:grid-cols-2">
          <select className="rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text" value={config.commitCountMode} onChange={(e) => updateConfig({ commitCountMode: e.target.value as CommitCountMode })}>
            <option value="publicCommitsOnly">Public commits only</option>
            <option value="publicAndPrivateCommits">Public + Private commits</option>
            <option value="publicReposOnly">Public repositories only</option>
            <option value="selectedRepositoriesOnly">Selected repositories only</option>
            <option value="customRepositoryList">Custom repository list</option>
          </select>
          <label className="inline-flex items-center gap-2 text-sm text-admin-text">
            <input type="checkbox" checked={config.includePrivateRepos} onChange={(e) => updateConfig({ includePrivateRepos: e.target.checked })} />
            Fetch private repositories during sync
          </label>
          <label className="inline-flex items-center gap-2 text-sm text-admin-text">
            <input type="checkbox" checked={config.includePrivateCommits} onChange={(e) => updateConfig({ includePrivateCommits: e.target.checked })} />
            Include Private Commits
          </label>
          <label className="inline-flex items-center gap-2 text-sm text-admin-text">
            <input type="checkbox" checked={config.showLifetimeCommits} onChange={(e) => updateConfig({ showLifetimeCommits: e.target.checked })} />
            Show Lifetime Commits Publicly
          </label>
        </div>
      </section>

      <section className="rounded-2xl border border-admin-border bg-admin-card p-6 space-y-4">
        <h3 className="text-lg font-semibold text-admin-text">Public Visibility</h3>
        <p className="text-sm text-admin-text-muted">
          Choose how much private GitHub data can appear on the public site.
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          <label className="inline-flex items-center gap-2 text-sm text-admin-text">
            <input type="checkbox" checked={config.showPrivateReposPublicly} onChange={(e) => updateConfig({ showPrivateReposPublicly: e.target.checked })} />
            Show private repository names publicly
          </label>
          <label className="inline-flex items-center gap-2 text-sm text-admin-text">
            <input type="checkbox" checked={config.showPrivateCommitsPublicly} onChange={(e) => updateConfig({ showPrivateCommitsPublicly: e.target.checked })} />
            Show private commit messages publicly
          </label>
          <label className="block text-sm text-admin-text">
            <span className="mb-1 block font-medium">Public display mode</span>
            <select className="w-full rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text" value={config.publicDisplayMode} onChange={(e) => updateConfig({ publicDisplayMode: e.target.value as GitHubConfig["publicDisplayMode"] })}>
              <option value="publicOnly">Public only</option>
              <option value="aggregatePrivateOnly">Show private totals only</option>
              <option value="includePrivateNames">Show private repo names</option>
              <option value="includePrivateWithCommits">Show private names and commit details</option>
            </select>
          </label>
          <label className="inline-flex items-center gap-2 text-sm text-admin-text pt-7">
            <input type="checkbox" checked={config.recentActivityEnabled} onChange={(e) => updateConfig({ recentActivityEnabled: e.target.checked })} />
            Enable recent activity
          </label>
        </div>
      </section>

      <section className="rounded-2xl border border-admin-border bg-admin-card p-6 space-y-4">
        <h3 className="text-lg font-semibold text-admin-text">Repository Selection</h3>
        <p className="text-sm text-admin-text-muted">
          {selectedVisibleRepoCount} selected of {visibleRepoCount} repositories
        </p>
        <select className="w-full rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text" value={config.repositorySelectionMode} onChange={(e) => updateConfig({ repositorySelectionMode: e.target.value as RepositorySelectionMode })}>
          <option value="all">All repositories</option>
          <option value="publicOnly">Public only</option>
          <option value="privateOnly">Private only</option>
          <option value="selected">Selected repositories</option>
        </select>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="rounded-full border border-admin-border px-3 py-1 text-sm" onClick={() => updateConfig({ selectedRepositories: repoList.map((repo) => repo.fullName || repo.name) })}>Select all</button>
          <button type="button" className="rounded-full border border-admin-border px-3 py-1 text-sm" onClick={() => updateConfig({ selectedRepositories: [] })}>Clear</button>
        </div>
        <div className="grid gap-2 md:grid-cols-2">
          {repoList.map((repo) => {
            const key = repo.fullName || repo.name;
            const checked = selectedSet.has(key) || Boolean((repo as any).selected);
            return (
              <label key={key} className="flex items-center gap-3 rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-sm text-admin-text">
                <input type="checkbox" checked={checked} onChange={() => toggleSelectedRepository(key)} />
                <span className="flex-1 truncate">{repo.name}</span>
                <Badge>{repo.private ? "Private" : "Public"}</Badge>
                <span className="text-admin-text-muted">
                  {config.commitCountMode === "publicAndPrivateCommits"
                    ? (repo.publicCommitCount ?? 0) + (repo.privateCommitCount ?? 0)
                    : repo.commitCount ?? 0}{" "}
                  commits
                </span>
              </label>
            );
          })}
        </div>
      </section>

      <section className="rounded-2xl border border-admin-border bg-admin-card p-6 space-y-4">
        <h3 className="text-lg font-semibold text-admin-text">Commit Display</h3>
        <p className="text-sm text-admin-text-muted">
          {selectedRecentCommitRepoCount} selected of {visibleRepoCount} repositories will be used for the recent commit list.
        </p>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="rounded-full border border-admin-border px-3 py-1 text-sm" onClick={() => updateConfig({ recentCommitsSelectedRepositories: repoList.map((repo) => repo.fullName || repo.name) })}>Select all</button>
          <button type="button" className="rounded-full border border-admin-border px-3 py-1 text-sm" onClick={() => updateConfig({ recentCommitsSelectedRepositories: [] })}>Clear</button>
        </div>
        <div className="grid gap-2 md:grid-cols-2">
          {repoList.map((repo) => {
            const key = repo.fullName || repo.name;
            const checked = recentCommitsSelectedSet.has(key) || Boolean((repo as any).selected);
            return (
              <label key={`${key}-recent`} className="flex items-center gap-3 rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-sm text-admin-text">
                <input type="checkbox" checked={checked} onChange={() => toggleRecentCommitRepository(key)} />
                <span className="flex-1 truncate">{repo.name}</span>
                <Badge>{repo.private ? "Private" : "Public"}</Badge>
              </label>
            );
          })}
        </div>
      </section>

      <section className="rounded-2xl border border-admin-border bg-admin-card p-6 space-y-4">
        <h3 className="text-lg font-semibold text-admin-text">Recent Public Activity</h3>
        <p className="text-sm text-admin-text-muted">
          Control which cached GitHub events stay visible on the public timeline.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block text-sm text-admin-text">
            <span className="mb-1 block font-medium">Activity limit</span>
            <input
              type="number"
              min={1}
              className="w-full rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text"
              value={config.recentActivityLimit}
              onChange={(e) => updateConfig({ recentActivityLimit: Number(e.target.value) || 10 })}
            />
          </label>
          <label className="inline-flex items-center gap-2 text-sm text-admin-text pt-7">
            <input
              type="checkbox"
              checked={config.recentActivityEnabled}
              onChange={(e) => updateConfig({ recentActivityEnabled: e.target.checked })}
            />
            Enable recent activity
          </label>
        </div>
        <div className="rounded-xl border border-dashed border-admin-border/80 p-4 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-medium text-admin-text">Hide activity from these repositories</p>
            <div className="flex flex-wrap gap-2">
              <button type="button" className="rounded-full border border-admin-border px-3 py-1 text-sm" onClick={() => updateConfig({ recentActivityHideRepositories: repoList.map((repo) => repo.fullName || repo.name) })}>Hide all</button>
              <button type="button" className="rounded-full border border-admin-border px-3 py-1 text-sm" onClick={() => updateConfig({ recentActivityHideRepositories: [] })}>Show all</button>
            </div>
          </div>
          <div className="grid gap-2 md:grid-cols-2">
            {repoList.map((repo) => {
              const key = repo.fullName || repo.name;
              const checked = recentActivityHideRepoSet.has(key);
              return (
                <label key={`${key}-activity`} className="flex items-center gap-3 rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-sm text-admin-text">
                  <input type="checkbox" checked={checked} onChange={() => toggleRecentActivityHiddenRepository(key)} />
                  <span className="flex-1 truncate">{repo.name}</span>
                  <Badge>{repo.private ? "Private" : "Public"}</Badge>
                </label>
              );
            })}
          </div>
        </div>
        <div className="rounded-xl border border-dashed border-admin-border/80 p-4 space-y-3">
          <p className="text-sm font-medium text-admin-text">Hide activity event types</p>
          <div className="flex flex-wrap gap-2">
            {["PushEvent", "CreateEvent", "PullRequestEvent", "IssuesEvent", "ReleaseEvent", "ForkEvent"].map((type) => {
              const active = recentActivityHiddenTypeSet.has(type);
              return (
                <button
                  key={type}
                  type="button"
                  className={`rounded-full border px-3 py-1 text-sm ${active ? "border-admin-primary bg-admin-primary text-white" : "border-admin-border"}`}
                  onClick={() => toggleRecentActivityHiddenType(type)}
                >
                  {type}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-admin-border bg-admin-card p-6 space-y-4">
        <h3 className="text-lg font-semibold text-admin-text">Commit Visibility Rules</h3>
        <p className="text-sm text-admin-text-muted">
          Add one keyword per line. Include rules keep matching commits visible, exclude rules hide matching commits.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block text-sm text-admin-text">
            <span className="mb-1 block font-medium">Show only commits matching</span>
            <textarea
              className="min-h-32 w-full rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text"
              value={includeRules.join("\n")}
              onChange={(e) => updateConfig({ commitMessageIncludes: parseList(e.target.value) })}
              placeholder="release\nfix\nblog"
            />
          </label>
          <label className="block text-sm text-admin-text">
            <span className="mb-1 block font-medium">Hide commits matching</span>
            <textarea
              className="min-h-32 w-full rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text"
              value={excludeRules.join("\n")}
              onChange={(e) => updateConfig({ commitMessageExcludes: parseList(e.target.value) })}
              placeholder="wip\ntest\nchore"
            />
          </label>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-admin-border bg-admin-card p-5">
          <p className="text-sm text-admin-text-muted">Total Public Commits</p>
          <p className="mt-2 text-3xl font-semibold text-admin-text">{stats?.totals?.publicCommits ?? stats?.publicCommits ?? 0}</p>
        </div>
        <div className="rounded-2xl border border-admin-border bg-admin-card p-5">
          <p className="text-sm text-admin-text-muted">Total Private Commits</p>
          <p className="mt-2 text-3xl font-semibold text-admin-text">{stats?.totals?.privateCommits ?? stats?.privateCommits ?? 0}</p>
        </div>
        <div className="rounded-2xl border border-admin-border bg-admin-card p-5">
          <p className="text-sm text-admin-text-muted">Combined Total Commits</p>
          <p className="mt-2 text-3xl font-semibold text-admin-text">{stats?.totals?.totalCommits ?? stats?.totalCommits ?? 0}</p>
        </div>
      </section>

      <section className="rounded-2xl border border-admin-border bg-admin-card p-6">
        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={saveConfig} disabled={loading} className="rounded-full bg-admin-primary px-4 py-2 text-sm font-semibold text-white">{loading ? "Saving..." : "Save Settings"}</button>
          <button type="button" onClick={syncGitHub} disabled={syncing} className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white">{syncing ? "Syncing..." : "Manual Sync"}</button>
          <button type="button" onClick={clearCache} disabled={clearing} className="rounded-full bg-rose-600 px-4 py-2 text-sm font-semibold text-white">{clearing ? "Clearing..." : "Clear Cache"}</button>
        </div>
        {!stats ? <p className="mt-4 text-sm text-amber-700">GitHub stats are not loaded yet. Run Manual Sync.</p> : null}
        {stats?.syncedAt ? <p className="mt-4 text-sm text-admin-text-muted">Last synced: {new Date(stats.syncedAt).toLocaleString()}</p> : null}
        {stats?.lastSyncError ? <p className="mt-2 text-sm text-rose-600">Last sync error: {stats.lastSyncError}</p> : null}
      </section>
    </div>
  );
}
