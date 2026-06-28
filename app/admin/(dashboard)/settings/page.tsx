"use client";

import { useMemo, useState } from "react";
import { PageHeader } from "@/components/admin/PageHeader";
import { SectionCard } from "@/components/admin/SectionCard";
import { useSiteDataEditor } from "@/components/admin/useSiteDataEditor";
import { LoadingState } from "@/components/admin/LoadingState";
import { useToast } from "@/components/admin/ToastProvider";
import type { SiteData } from "@/src/types/site-data";

export default function SettingsPage() {
  const { data, setData, saving, save } = useSiteDataEditor();
  const { notify } = useToast();
  const [tokenInput, setTokenInput] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [showToken, setShowToken] = useState(false);
  const selectedRepositoriesText = useMemo(
    () => data?.githubConfig?.selectedRepositories?.join("\n") || "",
    [data?.githubConfig?.selectedRepositories]
  );

  if (!data) return <LoadingState />;

  const { websiteSettings, githubConfig, siteConnection } = data;
  type RepositorySelectionMode = NonNullable<NonNullable<SiteData["githubConfig"]>["repositorySelectionMode"]>;

  async function handleRefreshGitHub() {
    if (!githubConfig?.username) {
      notify("error", "GitHub username not configured.");
      return;
    }

    setRefreshing(true);
    try {
      const response = await fetch("/api/admin/github/refresh", { method: "POST", headers: { "Content-Type": "application/json" } });
      const result = await response.json();
      if (result.success) notify("success", "GitHub data refreshed successfully!");
      else notify("error", result.reason || "Failed to refresh GitHub data.");
    } catch {
      notify("error", "Failed to refresh GitHub data.");
    } finally {
      setRefreshing(false);
    }
  }

  async function handleSave() {
    try {
      if (!data) {
        throw new Error("Site data is still loading.");
      }
      const githubPayload = {
        username: githubConfig?.username || "",
        enabled: githubConfig?.enabled ?? false,
        refreshInterval: githubConfig?.refreshInterval ?? 30,
        includePrivateRepos: githubConfig?.includePrivateRepos,
        includePrivateCommits: githubConfig?.includePrivateCommits,
        showLifetimeCommits: githubConfig?.showLifetimeCommits,
        showPrivateReposPublicly: githubConfig?.showPrivateReposPublicly,
        showPrivateCommitsPublicly: githubConfig?.showPrivateCommitsPublicly,
        publicDisplayMode: githubConfig?.publicDisplayMode,
        commitCountMode: githubConfig?.commitCountMode,
        repositorySelectionMode: githubConfig?.repositorySelectionMode,
        selectedRepositories: githubConfig?.selectedRepositories,
        ...(tokenInput.trim() ? { token: tokenInput.trim() } : {}),
      };
      const payload: SiteData = {
        ...data,
        owner: data.owner,
        githubConfig: githubPayload
      };

      await save(payload, "chore: update website settings from admin panel");
      notify("success", "Settings saved successfully!");
    } catch {
      notify("error", "Failed to save settings.");
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Manage global website settings and the GitHub integration." />

      <SectionCard title="GitHub Integration" description="Connect your GitHub account to display live stats and repositories.">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-admin-text">GitHub Username</span>
            <input
              value={githubConfig?.username || ""}
              onChange={(e) =>
                setData({
                  ...data,
                  githubConfig: {
                    username: e.target.value,
                    enabled: githubConfig?.enabled ?? false,
                    refreshInterval: githubConfig?.refreshInterval ?? 30,
                    includePrivateRepos: githubConfig?.includePrivateRepos,
                    includePrivateCommits: githubConfig?.includePrivateCommits,
                    showLifetimeCommits: githubConfig?.showLifetimeCommits,
                    showPrivateReposPublicly: githubConfig?.showPrivateReposPublicly,
                    showPrivateCommitsPublicly: githubConfig?.showPrivateCommitsPublicly,
                    publicDisplayMode: githubConfig?.publicDisplayMode,
                    commitCountMode: githubConfig?.commitCountMode,
                    repositorySelectionMode: githubConfig?.repositorySelectionMode,
                    selectedRepositories: githubConfig?.selectedRepositories
                  }
                })
              }
              className="w-full rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text"
            />
          </label>

          <label className="block text-sm">
            <span className="mb-1 block font-medium text-admin-text">GitHub Token</span>
            <div className="relative">
              <input
                type={showToken ? "text" : "password"}
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                className="w-full rounded-xl border border-admin-border bg-admin-input px-3 py-2 pr-12 text-admin-text"
                placeholder="Enter token only if changing it"
              />
              <button
                type="button"
                onClick={() => setShowToken((current) => !current)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-admin-text-muted hover:text-admin-text"
              >
                {showToken ? "Hide" : "Show"}
              </button>
            </div>
          </label>

          <label className="block text-sm">
            <span className="mb-1 block font-medium text-admin-text">Refresh Interval (minutes)</span>
            <input
              type="number"
              value={githubConfig?.refreshInterval || 30}
              onChange={(e) =>
                setData({
                  ...data,
                  githubConfig: {
                    username: githubConfig?.username || "",
                    enabled: githubConfig?.enabled ?? false,
                    refreshInterval: Number(e.target.value) || 30,
                    includePrivateRepos: githubConfig?.includePrivateRepos,
                    includePrivateCommits: githubConfig?.includePrivateCommits,
                    showLifetimeCommits: githubConfig?.showLifetimeCommits,
                    showPrivateReposPublicly: githubConfig?.showPrivateReposPublicly,
                    showPrivateCommitsPublicly: githubConfig?.showPrivateCommitsPublicly,
                    publicDisplayMode: githubConfig?.publicDisplayMode,
                    commitCountMode: githubConfig?.commitCountMode,
                    repositorySelectionMode: githubConfig?.repositorySelectionMode,
                    selectedRepositories: githubConfig?.selectedRepositories
                  }
                })
              }
              className="w-full rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text"
            />
          </label>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={githubConfig?.enabled || false}
              onChange={(e) =>
                setData({
                  ...data,
                  githubConfig: {
                    username: githubConfig?.username || "",
                    enabled: e.target.checked,
                    refreshInterval: githubConfig?.refreshInterval ?? 30,
                    includePrivateRepos: githubConfig?.includePrivateRepos,
                    includePrivateCommits: githubConfig?.includePrivateCommits,
                    showLifetimeCommits: githubConfig?.showLifetimeCommits,
                    showPrivateReposPublicly: githubConfig?.showPrivateReposPublicly,
                    showPrivateCommitsPublicly: githubConfig?.showPrivateCommitsPublicly,
                    publicDisplayMode: githubConfig?.publicDisplayMode,
                    commitCountMode: githubConfig?.commitCountMode,
                    repositorySelectionMode: githubConfig?.repositorySelectionMode,
                    selectedRepositories: githubConfig?.selectedRepositories
                  }
                })
              }
            />
            <span className="font-medium text-admin-text">Enable GitHub Stats</span>
          </label>

          <label className="block text-sm md:col-span-2">
            <span className="mb-1 block font-medium text-admin-text">Repository Visibility</span>
            <select
              value={githubConfig?.repositorySelectionMode || "all"}
              onChange={(e) =>
                setData({
                  ...data,
                  githubConfig: {
                    username: githubConfig?.username || "",
                    enabled: githubConfig?.enabled ?? false,
                    refreshInterval: githubConfig?.refreshInterval ?? 30,
                    includePrivateRepos: githubConfig?.includePrivateRepos,
                    includePrivateCommits: githubConfig?.includePrivateCommits,
                    showLifetimeCommits: githubConfig?.showLifetimeCommits,
                    showPrivateReposPublicly: githubConfig?.showPrivateReposPublicly,
                    showPrivateCommitsPublicly: githubConfig?.showPrivateCommitsPublicly,
                    publicDisplayMode: githubConfig?.publicDisplayMode,
                    commitCountMode: githubConfig?.commitCountMode,
                    repositorySelectionMode: e.target.value as RepositorySelectionMode,
                    selectedRepositories: githubConfig?.selectedRepositories || [],
                  },
                })
              }
              className="w-full rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text"
            >
              <option value="all">All repositories</option>
              <option value="publicOnly">Public repositories only</option>
              <option value="privateOnly">Private repositories only</option>
              <option value="selected">Selected repositories only</option>
            </select>
            <p className="mt-1 text-xs text-admin-text-muted">
              Choose which repos the GitHub section and sync flow should consider.
            </p>
          </label>

          <label className="block text-sm md:col-span-2">
            <span className="mb-1 block font-medium text-admin-text">Selected Repositories</span>
            <textarea
              value={selectedRepositoriesText}
              onChange={(e) =>
                setData({
                  ...data,
                  githubConfig: {
                    username: githubConfig?.username || "",
                    enabled: githubConfig?.enabled ?? false,
                    refreshInterval: githubConfig?.refreshInterval ?? 30,
                    includePrivateRepos: githubConfig?.includePrivateRepos,
                    includePrivateCommits: githubConfig?.includePrivateCommits,
                    showLifetimeCommits: githubConfig?.showLifetimeCommits,
                    showPrivateReposPublicly: githubConfig?.showPrivateReposPublicly,
                    showPrivateCommitsPublicly: githubConfig?.showPrivateCommitsPublicly,
                    publicDisplayMode: githubConfig?.publicDisplayMode,
                    commitCountMode: githubConfig?.commitCountMode,
                    repositorySelectionMode: githubConfig?.repositorySelectionMode,
                    selectedRepositories: e.target.value
                      .split("\n")
                      .map((item) => item.trim())
                      .filter(Boolean),
                  },
                })
              }
              className="min-h-[140px] w-full rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text"
              placeholder={"repo-name-or-owner/repo-name\nanother-repo"}
            />
            <p className="mt-1 text-xs text-admin-text-muted">
              Use one repository per line. Example: <span className="font-mono">owner/repo</span>.
            </p>
          </label>

          <div className="md:col-span-2">
            <button
              type="button"
              onClick={handleRefreshGitHub}
              disabled={!githubConfig?.enabled || refreshing}
              className="rounded-xl bg-admin-secondary px-4 py-2 text-sm font-semibold text-white hover:bg-admin-secondary/80 disabled:opacity-50"
            >
              {refreshing ? "Refreshing..." : "Refresh GitHub Data"}
            </button>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Git-based CMS" description="Connect a GitHub repository to use as a content source.">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-admin-text">Repository Owner</span>
            <input
              value={siteConnection?.owner || ""}
              onChange={(e) =>
                setData({
                  ...data,
                  siteConnection: {
                    name: siteConnection?.name || "portfolio",
                    owner: e.target.value,
                    repo: siteConnection?.repo || "",
                    branch: siteConnection?.branch || "main",
                    contentPath: siteConnection?.contentPath || "content"
                  }
                })
              }
              className="w-full rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text"
            />
          </label>

          <label className="block text-sm">
            <span className="mb-1 block font-medium text-admin-text">Repository Name</span>
            <input
              value={siteConnection?.repo || ""}
              onChange={(e) =>
                setData({
                  ...data,
                  siteConnection: {
                    name: siteConnection?.name || "portfolio",
                    repo: e.target.value,
                    owner: siteConnection?.owner || "",
                    branch: siteConnection?.branch || "main",
                    contentPath: siteConnection?.contentPath || "content"
                  }
                })
              }
              className="w-full rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text"
            />
          </label>
        </div>
      </SectionCard>

      <SectionCard title="Website SEO" description="Global SEO title, meta description, and favicon.">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-admin-text">SEO Title</span>
            <input
              value={websiteSettings?.seoTitle || ""}
              onChange={(e) => setData({ ...data, websiteSettings: { ...websiteSettings, seoTitle: e.target.value } })}
              className="w-full rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text"
            />
          </label>
          <label className="block text-sm md:col-span-2">
            <span className="mb-1 block font-medium text-admin-text">Meta Description</span>
            <textarea
              value={websiteSettings?.metaDescription || ""}
              onChange={(e) => setData({ ...data, websiteSettings: { ...websiteSettings, metaDescription: e.target.value } })}
              className="w-full rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text"
            />
          </label>
        </div>
        <div className="mt-6">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="rounded-xl bg-admin-secondary px-6 py-2 text-sm font-semibold text-white hover:bg-admin-secondary/80 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save All Settings"}
          </button>
        </div>
      </SectionCard>
    </div>
  );
}
