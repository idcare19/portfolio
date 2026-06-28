"use client";

<<<<<<< HEAD
import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "@/components/admin/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { useToast } from "@/components/admin/ToastProvider";

type CommitCountMode = "publicCommitsOnly" | "publicAndPrivateCommits" | "publicReposOnly" | "selectedRepositoriesOnly" | "customRepositoryList";
type RepositorySelectionMode = "all" | "publicOnly" | "privateOnly" | "selected";

type GitHubConfig = {
=======
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/admin/PageHeader";
import { useToast } from "@/components/admin/ToastProvider";
import { Badge } from "@/components/ui/Badge";

interface GitHubConfig {
>>>>>>> c974e6d18f7e4d84cefd23b3ad822ac4cf9981fc
  username: string;
  token: string;
  enabled: boolean;
  refreshInterval: number;
<<<<<<< HEAD
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
=======
}

interface GitHubStats {
  syncedAt?: string;
  rateLimit?: {
    remaining: number;
    limit: number;
    resetAt: string;
  };
>>>>>>> c974e6d18f7e4d84cefd23b3ad822ac4cf9981fc
  totals?: {
    totalRepos: number;
    publicRepos: number;
    privateRepos: number;
    totalStars: number;
    totalForks: number;
<<<<<<< HEAD
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
=======
  };
  lastSyncError?: string;
}

export default function GitHubAdminPage() {
>>>>>>> c974e6d18f7e4d84cefd23b3ad822ac4cf9981fc
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [showToken, setShowToken] = useState(false);
<<<<<<< HEAD
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
=======
  const [config, setConfig] = useState<GitHubConfig>({
    username: "",
    token: "",
    enabled: false,
    refreshInterval: 30,
  });
  const [stats, setStats] = useState<GitHubStats | null>(null);
  const { notify } = useToast();

  // Fetch current config and stats
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch site data to get current config
        const siteRes = await fetch('/api/admin/site-data');
        if (siteRes.ok) {
          const siteData = await siteRes.json();
          if (siteData.data?.githubConfig) {
            setConfig(siteData.data.githubConfig);
          }
        }
        
        // Fetch full stats
        const statsRes = await fetch('/api/admin/github/stats');
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          if (statsData.success) {
            setStats(statsData.data);
          }
        }
      } catch (error) {
        console.error('Error fetching GitHub data:', error);
      }
    };
    
    fetchData();
  }, []);

  const handleSaveConfig = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/site-data/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          githubConfig: config,
        }),
      });
      const data = await response.json();
      if (data.success) {
        notify("success", "GitHub configuration saved successfully.");
      } else {
        notify("error", data.reason || "Failed to save configuration.");
      }
    } catch (error) {
      notify("error", "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      const response = await fetch('/api/admin/github/sync', {
        method: 'POST',
      });
      const data = await response.json();
      if (data.success) {
        notify("success", "GitHub data synced successfully.");
        // Refresh stats after sync
        const statsRes = await fetch('/api/admin/github/stats');
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          if (statsData.success) {
            setStats(statsData.data);
          }
        }
      } else {
        notify("error", data.reason || "Failed to sync GitHub data.");
      }
    } catch (error) {
      notify("error", "An unexpected error occurred.");
    } finally {
      setSyncing(false);
    }
  };

  const handleClearCache = async () => {
    setClearing(true);
    try {
      const response = await fetch('/api/admin/github/clear-cache', {
        method: 'POST',
      });
      const data = await response.json();
      if (data.success) {
        notify("success", "GitHub cache cleared successfully.");
        setStats(null);
      } else {
        notify("error", data.reason || "Failed to clear cache.");
      }
    } catch (error) {
      notify("error", "An unexpected error occurred.");
    } finally {
      setClearing(false);
    }
  };

  return (
    <div>
      <PageHeader title="GitHub Settings" />
      <div className="p-6 space-y-8 max-w-4xl">
        {/* Configuration Section */}
        <div className="rounded-xl border border-admin-border bg-admin-card p-6 space-y-6">
          <h3 className="text-xl font-semibold text-admin-text">Configuration</h3>
          
          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-admin-text">Enable GitHub Section</p>
                <p className="text-sm text-admin-text-muted">Show GitHub statistics on your public portfolio</p>
              </div>
              <input
                type="checkbox"
                checked={config.enabled}
                onChange={(e) => setConfig({...config, enabled: e.target.checked})}
                className="h-5 w-5 rounded border-admin-border"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-admin-text">GitHub Username</label>
              <input
                value={config.username}
                onChange={(e) => setConfig({...config, username: e.target.value})}
                placeholder="your-github-username"
                className="w-full rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-admin-text">GitHub Token</label>
              <div className="relative">
                <input
                  type={showToken ? "text" : "password"}
                  value={config.token}
                  onChange={(e) => setConfig({...config, token: e.target.value})}
                  placeholder="ghp_xxxxxxxxxxxxxxx"
                  className="w-full rounded-xl border border-admin-border bg-admin-input px-3 py-2 pr-16 text-admin-text"
                />
                <button
                  type="button"
                  onClick={() => setShowToken(!showToken)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-admin-text-muted hover:text-admin-text text-sm"
                >
                  {showToken ? "Hide" : "Show"}
                </button>
              </div>
              <p className="text-xs text-admin-text-muted">Token is stored securely and never exposed client-side</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-admin-text">Auto-refresh Interval (minutes)</label>
              <input
                type="number"
                value={config.refreshInterval}
                onChange={(e) => setConfig({...config, refreshInterval: parseInt(e.target.value) || 30})}
                className="w-full rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text"
              />
            </div>

            <button 
              onClick={handleSaveConfig} 
              disabled={loading} 
              className="mt-4 inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-500 ease-out hover:scale-105 bg-primary text-white shadow-[0_14px_30px_rgba(37,99,235,0.22)] hover:bg-[#1D4ED8] hover:shadow-[0_20px_40px_rgba(37,99,235,0.28)]"
            >
              {loading ? "Saving..." : "Save Configuration"}
            </button>
          </div>
        </div>

        {/* Token Status */}
        <div className="rounded-xl border border-admin-border bg-admin-card p-6">
          <h3 className="text-xl font-semibold text-admin-text mb-4">Token Status</h3>
          <Badge className={config.token ? "bg-green-500 border-green-200 text-green-800" : "bg-yellow-500 border-yellow-200 text-yellow-800"}>
            {config.token ? "Token Saved" : "Token Not Configured"}
          </Badge>
        </div>

        {/* Sync Section */}
        <div className="rounded-xl border border-admin-border bg-admin-card p-6 space-y-4">
          <h3 className="text-xl font-semibold text-admin-text">Data Sync</h3>
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={handleSync} 
              disabled={syncing} 
              className="inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-500 ease-out hover:scale-105 bg-blue-600 text-white shadow-[0_14px_30px_rgba(37,99,235,0.22)] hover:bg-blue-700 hover:shadow-[0_20px_40px_rgba(37,99,235,0.28)]"
            >
              {syncing ? "Syncing..." : "Sync GitHub Data"}
            </button>
            <button 
              onClick={handleClearCache} 
              disabled={clearing}
              className="inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-500 ease-out hover:scale-105 bg-rose-600 text-white shadow-[0_14px_30px_rgba(220,38,38,0.22)] hover:bg-rose-700 hover:shadow-[0_20px_40px_rgba(220,38,38,0.28)]"
            >
              {clearing ? "Clearing..." : "Clear Cache"}
            </button>
          </div>
        </div>

        {/* Statistics Overview */}
        {stats && (
          <div className="rounded-xl border border-admin-border bg-admin-card p-6 space-y-6">
            <h3 className="text-xl font-semibold text-admin-text">Current Statistics</h3>
            
            {stats.lastSyncError && (
              <div className="p-4 bg-red-500/10 border border-red-500 rounded-lg">
                <p className="text-red-500 font-medium">Last Sync Error</p>
                <p className="text-sm text-red-400 mt-1">{stats.lastSyncError}</p>
              </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-admin-input rounded-lg">
                <p className="text-2xl font-bold text-admin-text">{stats.totals?.totalRepos || 0}</p>
                <p className="text-sm text-admin-text-muted">Total Repos</p>
              </div>
              <div className="p-4 bg-admin-input rounded-lg">
                <p className="text-2xl font-bold text-green-500">{stats.totals?.publicRepos || 0}</p>
                <p className="text-sm text-admin-text-muted">Public Repos</p>
              </div>
              <div className="p-4 bg-admin-input rounded-lg">
                <p className="text-2xl font-bold text-blue-500">{stats.totals?.privateRepos || 0}</p>
                <p className="text-sm text-admin-text-muted">Private Repos</p>
              </div>
              <div className="p-4 bg-admin-input rounded-lg">
                <p className="text-2xl font-bold text-yellow-500">{stats.totals?.totalStars || 0}</p>
                <p className="text-sm text-admin-text-muted">Total Stars</p>
              </div>
            </div>

            {/* Rate Limit Info */}
            {stats.rateLimit && (
              <div className="mt-4 p-4 bg-admin-input rounded-lg">
                <p className="font-medium text-admin-text mb-2">API Rate Limit</p>
                <div className="flex items-center gap-4">
                  <Badge className="bg-blue-50 border-blue-200 text-blue-800">
                    {stats.rateLimit.remaining}/{stats.rateLimit.limit} remaining
                  </Badge>
                  <p className="text-sm text-admin-text-muted">
                    Resets at {new Date(stats.rateLimit.resetAt).toLocaleString()}
                  </p>
                </div>
              </div>
            )}

            {stats.syncedAt && (
              <p className="text-sm text-admin-text-muted">
                Last synced: {new Date(stats.syncedAt).toLocaleString()}
              </p>
            )}
          </div>
        )}

        {!stats && (
          <div className="rounded-xl border border-admin-border bg-admin-card p-6">
            <p className="text-admin-text-muted">No GitHub data synced yet. Click "Sync GitHub Data" to fetch your statistics.</p>
          </div>
        )}
      </div>
    </div>
  );
}
>>>>>>> c974e6d18f7e4d84cefd23b3ad822ac4cf9981fc
