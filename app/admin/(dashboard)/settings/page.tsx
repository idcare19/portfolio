"use client";

import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
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
  const navItems = data?.nav ?? [];
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

  function updateNavItems(nextNav: SiteData["nav"]) {
    if (!data) return;
    setData({ ...data, nav: nextNav });
  }

  function addNavItem() {
    updateNavItems([
      ...navItems,
      {
        label: "New Link",
        href: "/blogs",
      },
    ]);
  }

  function updateNavItem(index: number, patch: Partial<SiteData["nav"][number]>) {
    updateNavItems(navItems.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item)));
  }

  function moveNavItem(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= navItems.length) return;
    const next = [...navItems];
    [next[index], next[target]] = [next[target], next[index]];
    updateNavItems(next);
  }

  function removeNavItem(index: number) {
    updateNavItems(navItems.filter((_, itemIndex) => itemIndex !== index));
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Manage global website settings and the GitHub integration." />

      <SectionCard title="GitHub Integration" description="Connect your GitHub account to display live stats and repositories." className="border-admin-border/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(245,247,255,0.96))] shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
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
              className="inline-flex items-center justify-center rounded-full bg-admin-primary px-5 py-2.5 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(37,99,235,0.22)] transition hover:-translate-y-0.5 hover:bg-[#1D4ED8] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {refreshing ? "Refreshing..." : "Refresh GitHub Data"}
            </button>
          </div>
        </div>
      </SectionCard>

      <SectionCard
        title="Navigation Links"
        description="Add custom navbar links and routes like /blogs, /resume, or any page you want."
        className="border-admin-border/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(245,247,255,0.96))] shadow-[0_18px_50px_rgba(15,23,42,0.08)]"
      >
        <div className="space-y-3">
          {navItems.length ? (
            navItems.map((item, index) => (
              <div key={`nav-item-${index}`} className="grid gap-3 rounded-2xl border border-admin-border bg-admin-card p-3 md:grid-cols-[1fr_1fr_auto]">
                <input
                  value={item.label}
                  onChange={(e) => updateNavItem(index, { label: e.target.value })}
                  className="rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text"
                  placeholder="Label"
                />
                <input
                  value={item.href}
                  onChange={(e) => updateNavItem(index, { href: e.target.value })}
                  className="rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text"
                  placeholder="/blogs or #about"
                />
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => moveNavItem(index, -1)} className="rounded-full border border-admin-border p-2 text-admin-text">
                    <ArrowUp className="h-4 w-4" />
                  </button>
                  <button type="button" onClick={() => moveNavItem(index, 1)} className="rounded-full border border-admin-border p-2 text-admin-text">
                    <ArrowDown className="h-4 w-4" />
                  </button>
                  <button type="button" onClick={() => removeNavItem(index)} className="rounded-full border border-rose-200 bg-rose-50 p-2 text-rose-600">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-admin-text-muted">No custom links yet. Add one below.</p>
          )}
          <button
            type="button"
            onClick={addNavItem}
            className="inline-flex items-center gap-2 rounded-full bg-admin-primary px-4 py-2 text-sm font-semibold text-white"
          >
            <Plus className="h-4 w-4" />
            Add Nav Link
          </button>
        </div>
      </SectionCard>

      <SectionCard title="Git-based CMS" description="Connect a GitHub repository to use as a content source." className="border-admin-border/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(245,247,255,0.96))] shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
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

      <SectionCard title="Website SEO" description="Global SEO title, meta description, and favicon." className="border-admin-border/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(245,247,255,0.96))] shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
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
            className="inline-flex items-center justify-center rounded-full bg-admin-primary px-6 py-2.5 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(37,99,235,0.22)] transition hover:-translate-y-0.5 hover:bg-[#1D4ED8] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save All Settings"}
          </button>
        </div>
      </SectionCard>
    </div>
  );
}
