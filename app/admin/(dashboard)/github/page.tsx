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
};

export default function GitHubAdminPage() {
  const { notify } = useToast();
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [showToken, setShowToken] = useState(false);
  const [config, setConfig] = useState<GitHubConfig>(defaultConfig);
  const [stats, setStats] = useState<GitHubStats | null>(null);

  useEffect(() => {
    async function fetchData() {
      const siteRes = await fetch("/api/admin/site-data");
      if (siteRes.ok) {
        const siteData = await siteRes.json();
        if (siteData.data?.githubConfig) setConfig((current) => ({ ...current, ...siteData.data.githubConfig }));
      }

      const statsRes = await fetch("/api/admin/github/stats");
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        if (statsData.success) setStats(statsData.data);
      }
    }

    void fetchData();
  }, []);

  const repoOptions = useMemo(() => stats?.repositories || [], [stats?.repositories]);
  const selectedSet = useMemo(() => new Set(config.selectedRepositories), [config.selectedRepositories]);

  function updateConfig(next: Partial<GitHubConfig>) {
    setConfig((current) => ({ ...current, ...next }));
  }

  async function saveConfig() {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/site-data/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ githubConfig: config }),
      });
      const payload = await response.json();
      if (!payload.success) throw new Error(payload.reason || "Failed to save configuration");
      notify("success", "GitHub configuration saved.");
      if (config.repositorySelectionMode === "selected" || config.commitCountMode === "selectedRepositoriesOnly") {
        notify("success", "Repository selection updated. Run sync to recalculate commit totals.");
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
      const next = new Set(current.selectedRepositories);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return { ...current, selectedRepositories: Array.from(next) };
    });
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
        <h3 className="text-lg font-semibold text-admin-text">Repository Selection</h3>
        <select className="w-full rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text" value={config.repositorySelectionMode} onChange={(e) => updateConfig({ repositorySelectionMode: e.target.value as RepositorySelectionMode })}>
          <option value="all">All repositories</option>
          <option value="publicOnly">Public only</option>
          <option value="privateOnly">Private only</option>
          <option value="selected">Selected repositories</option>
        </select>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="rounded-full border border-admin-border px-3 py-1 text-sm" onClick={() => updateConfig({ selectedRepositories: repoOptions.map((repo) => repo.fullName || repo.name) })}>Select all</button>
          <button type="button" className="rounded-full border border-admin-border px-3 py-1 text-sm" onClick={() => updateConfig({ selectedRepositories: [] })}>Clear</button>
        </div>
        <div className="grid gap-2 md:grid-cols-2">
          {repoOptions.map((repo) => {
            const key = repo.fullName || repo.name;
            const checked = selectedSet.has(key);
            return (
              <label key={key} className="flex items-center gap-3 rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-sm text-admin-text">
                <input type="checkbox" checked={checked} onChange={() => toggleSelectedRepository(key)} />
                <span className="flex-1 truncate">{repo.name}</span>
                <Badge>{repo.private ? "Private" : "Public"}</Badge>
                <span className="text-admin-text-muted">{repo.commitCount || 0} commits</span>
              </label>
            );
          })}
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
        {stats?.syncedAt ? <p className="mt-4 text-sm text-admin-text-muted">Last synced: {new Date(stats.syncedAt).toLocaleString()}</p> : null}
        {stats?.lastSyncError ? <p className="mt-2 text-sm text-rose-600">Last sync error: {stats.lastSyncError}</p> : null}
      </section>
    </div>
  );
}
