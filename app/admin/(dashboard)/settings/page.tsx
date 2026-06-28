"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/admin/PageHeader";
import { SectionCard } from "@/components/admin/SectionCard";
<<<<<<< HEAD
import { SimpleArrayEditor } from "@/components/admin/editors/SimpleArrayEditor";
=======
>>>>>>> c974e6d18f7e4d84cefd23b3ad822ac4cf9981fc
import { useSiteDataEditor } from "@/components/admin/useSiteDataEditor";
import { LoadingState } from "@/components/admin/LoadingState";
import { useToast } from "@/components/admin/ToastProvider";

export default function SettingsPage() {
  const { data, setData, saving, save } = useSiteDataEditor();
  const { notify } = useToast();
  const [tokenInput, setTokenInput] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [showToken, setShowToken] = useState(false);

  async function handleRefreshGitHub() {
    if (!data?.githubConfig?.username) {
      notify("error", "GitHub username not configured.");
      return;
    }

    setRefreshing(true);
    try {
      const response = await fetch('/api/admin/github/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const result = await response.json();
      
      if (result.success) {
        notify("success", "GitHub data refreshed successfully!");
      } else {
        notify("error", result.reason || "Failed to refresh GitHub data.");
      }
    } catch (error) {
      notify("error", "Failed to refresh GitHub data.");
    } finally {
      setRefreshing(false);
    }
  }

  useEffect(() => {
    if (data?.githubConfig?.token && tokenInput === "") {
      setTokenInput(data.githubConfig.token);
    }
  }, [data?.githubConfig?.token]);

<<<<<<< HEAD
  function updateGitHubConfig(next: Partial<NonNullable<typeof data>["githubConfig"]>) {
    if (!data) return;
    setData({
      ...data,
      githubConfig: {
        username: data.githubConfig?.username || "",
        token: data.githubConfig?.token || "",
        enabled: data.githubConfig?.enabled || false,
        refreshInterval: data.githubConfig?.refreshInterval || 30,
        includePrivateRepos: data.githubConfig?.includePrivateRepos || false,
        showPrivateReposPublicly: data.githubConfig?.showPrivateReposPublicly || false,
        showPrivateCommitsPublicly: data.githubConfig?.showPrivateCommitsPublicly || false,
        publicDisplayMode: data.githubConfig?.publicDisplayMode || "publicOnly",
        ...next,
      },
    });
  }

  if (!data) return <LoadingState />;
  const { websiteSettings, githubConfig, siteConnection, shell, websiteControl } = data;
=======
  if (!data) return <LoadingState />;
  const { websiteSettings, githubConfig, siteConnection } = data;
>>>>>>> c974e6d18f7e4d84cefd23b3ad822ac4cf9981fc

  async function handleSave() {
    if (!data) return;
    try {
      // Create a payload, but don't include the token if it hasn't been changed.
      const payload = { ...data };
      if (tokenInput === "" && payload.githubConfig) {
        delete payload.githubConfig.token;
      }
      await save(payload, "chore: update website settings from admin panel");
      notify("success", "Settings saved successfully!");
    } catch (error) {
      notify("error", "Failed to save settings.");
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Manage global website settings, integrations, and content sources." />
      <SectionCard title="GitHub Integration" description="Connect your GitHub account to display live stats and repositories.">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-admin-text">GitHub Username</span>
            <input 
              value={githubConfig?.username || ""} 
<<<<<<< HEAD
              onChange={(e) => updateGitHubConfig({ username: e.target.value })} 
=======
              onChange={(e) => setData({ 
                ...data, 
                githubConfig: { 
                  username: e.target.value, 
                  token: githubConfig?.token || "", 
                  enabled: githubConfig?.enabled || false, 
                  refreshInterval: githubConfig?.refreshInterval || 30 
                } 
              })} 
>>>>>>> c974e6d18f7e4d84cefd23b3ad822ac4cf9981fc
              className="w-full rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text" 
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-admin-text">GitHub Token</span>
            <div className="relative">
              <input 
                type={showToken ? "text" : "password"} 
                value={tokenInput} 
                onChange={(e) => { 
                  setTokenInput(e.target.value); 
<<<<<<< HEAD
                  updateGitHubConfig({ token: e.target.value }); 
=======
                  setData({ 
                    ...data, 
                    githubConfig: { 
                      username: githubConfig?.username || "", 
                      token: e.target.value, 
                      enabled: githubConfig?.enabled || false, 
                      refreshInterval: githubConfig?.refreshInterval || 30 
                    } 
                  }); 
>>>>>>> c974e6d18f7e4d84cefd23b3ad822ac4cf9981fc
                }} 
                className="w-full rounded-xl border border-admin-border bg-admin-input px-3 py-2 pr-12 text-admin-text" 
                placeholder="Leave blank to keep existing" 
              />
              <button
                type="button"
                onClick={() => setShowToken(!showToken)}
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
<<<<<<< HEAD
              onChange={(e) => updateGitHubConfig({ refreshInterval: Number(e.target.value) || 30 })} 
=======
              onChange={(e) => setData({ 
                ...data, 
                githubConfig: { 
                  username: githubConfig?.username || "", 
                  token: githubConfig?.token || "", 
                  enabled: githubConfig?.enabled || false, 
                  refreshInterval: Number(e.target.value) 
                } 
              })} 
>>>>>>> c974e6d18f7e4d84cefd23b3ad822ac4cf9981fc
              className="w-full rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text" 
            />
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input 
              type="checkbox" 
              checked={githubConfig?.enabled || false} 
<<<<<<< HEAD
              onChange={(e) => updateGitHubConfig({ enabled: e.target.checked })} 
=======
              onChange={(e) => setData({ 
                ...data, 
                githubConfig: { 
                  username: githubConfig?.username || "", 
                  token: githubConfig?.token || "", 
                  enabled: e.target.checked, 
                  refreshInterval: githubConfig?.refreshInterval || 30 
                } 
              })} 
>>>>>>> c974e6d18f7e4d84cefd23b3ad822ac4cf9981fc
            />
            <span className="font-medium text-admin-text">Enable GitHub Stats</span>
          </label>
          <div className="md:col-span-2">
<<<<<<< HEAD
            <div className="mb-3 grid grid-cols-1 gap-2 text-sm text-admin-text-muted md:grid-cols-3">
              <p>Token status: {githubConfig?.token ? "Saved" : "Not configured"}</p>
              <p>Last GitHub sync: {websiteControl?.syncStatus?.lastGitHubSync || "Not synced yet"}</p>
              <p>Last Mongo update: {websiteControl?.syncStatus?.lastMongoUpdate || "Not available"}</p>
            </div>
=======
>>>>>>> c974e6d18f7e4d84cefd23b3ad822ac4cf9981fc
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
<<<<<<< HEAD
      <SectionCard title="Admin Experience" description="Choose whether the admin opens in beginner mode or exposes advanced developer tools.">
        <label className="flex items-center gap-3 text-sm">
          <input
            type="checkbox"
            checked={websiteControl?.developerMode || false}
            onChange={(e) =>
              setData({
                ...data,
                websiteControl: {
                  ...websiteControl,
                  developerMode: e.target.checked,
                },
              })
            }
          />
          <span className="font-medium text-admin-text">Developer Mode</span>
        </label>
        <p className="mt-2 text-sm text-admin-text-muted">
          Off keeps the sidebar simplified. On keeps advanced editors available from hidden routes and developer tools.
        </p>
      </SectionCard>
      <SectionCard title="Navbar Shell" description="Edit public navbar CTA text and accessibility labels.">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-admin-text">Desktop CTA Label</span>
            <input
              value={shell.navbar.desktopCtaLabel}
              onChange={(e) => setData({ ...data, shell: { ...shell, navbar: { ...shell.navbar, desktopCtaLabel: e.target.value } } })}
              className="w-full rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-admin-text">Desktop CTA Link</span>
            <input
              value={shell.navbar.desktopCtaHref}
              onChange={(e) => setData({ ...data, shell: { ...shell, navbar: { ...shell.navbar, desktopCtaHref: e.target.value } } })}
              className="w-full rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-admin-text">Mobile Menu Label</span>
            <input
              value={shell.navbar.mobileMenuLabel}
              onChange={(e) => setData({ ...data, shell: { ...shell, navbar: { ...shell.navbar, mobileMenuLabel: e.target.value } } })}
              className="w-full rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-admin-text">Brand Badge Prefix</span>
            <input
              value={shell.navbar.brandBadgePrefix}
              onChange={(e) => setData({ ...data, shell: { ...shell, navbar: { ...shell.navbar, brandBadgePrefix: e.target.value } } })}
              className="w-full rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text"
            />
          </label>
        </div>
      </SectionCard>
      <SectionCard title="Search Shell" description="Edit Ctrl+K search labels, prompt text, and placeholder copy.">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-admin-text">Button Label</span>
            <input
              value={shell.search.buttonLabel}
              onChange={(e) => setData({ ...data, shell: { ...shell, search: { ...shell.search, buttonLabel: e.target.value } } })}
              className="w-full rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-admin-text">Shortcut Label</span>
            <input
              value={shell.search.shortcutLabel}
              onChange={(e) => setData({ ...data, shell: { ...shell, search: { ...shell.search, shortcutLabel: e.target.value } } })}
              className="w-full rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text"
            />
          </label>
          <label className="block text-sm md:col-span-2">
            <span className="mb-1 block font-medium text-admin-text">Input Placeholder</span>
            <input
              value={shell.search.inputPlaceholder}
              onChange={(e) => setData({ ...data, shell: { ...shell, search: { ...shell.search, inputPlaceholder: e.target.value } } })}
              className="w-full rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text"
            />
          </label>
          <label className="block text-sm md:col-span-2">
            <span className="mb-1 block font-medium text-admin-text">Empty Prompt</span>
            <textarea
              value={shell.search.emptyPrompt}
              onChange={(e) => setData({ ...data, shell: { ...shell, search: { ...shell.search, emptyPrompt: e.target.value } } })}
              className="w-full rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text"
            />
          </label>
        </div>
      </SectionCard>
      <SectionCard title="Portfolio AI Shell" description="Edit the public AI assistant labels and helper copy.">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-admin-text">Launch Button Label</span>
            <input
              value={shell.assistant.buttonLabel}
              onChange={(e) => setData({ ...data, shell: { ...shell, assistant: { ...shell.assistant, buttonLabel: e.target.value } } })}
              className="w-full rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-admin-text">Panel Title</span>
            <input
              value={shell.assistant.panelTitle}
              onChange={(e) => setData({ ...data, shell: { ...shell, assistant: { ...shell.assistant, panelTitle: e.target.value } } })}
              className="w-full rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text"
            />
          </label>
          <label className="block text-sm md:col-span-2">
            <span className="mb-1 block font-medium text-admin-text">Panel Description</span>
            <textarea
              value={shell.assistant.panelDescription}
              onChange={(e) => setData({ ...data, shell: { ...shell, assistant: { ...shell.assistant, panelDescription: e.target.value } } })}
              className="w-full rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text"
            />
          </label>
          <label className="block text-sm md:col-span-2">
            <span className="mb-1 block font-medium text-admin-text">Input Placeholder</span>
            <input
              value={shell.assistant.inputPlaceholder}
              onChange={(e) => setData({ ...data, shell: { ...shell, assistant: { ...shell.assistant, inputPlaceholder: e.target.value } } })}
              className="w-full rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-admin-text">Submit Label</span>
            <input
              value={shell.assistant.submitLabel}
              onChange={(e) => setData({ ...data, shell: { ...shell, assistant: { ...shell.assistant, submitLabel: e.target.value } } })}
              className="w-full rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-admin-text">Loading Label</span>
            <input
              value={shell.assistant.loadingLabel}
              onChange={(e) => setData({ ...data, shell: { ...shell, assistant: { ...shell.assistant, loadingLabel: e.target.value } } })}
              className="w-full rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text"
            />
          </label>
        </div>
      </SectionCard>
      <SimpleArrayEditor
        title="Footer Quick Links"
        description="Manage quick links shown in the public footer."
        items={shell.footer.quickLinks as any[]}
        setItems={(items) => setData({ ...data, shell: { ...shell, footer: { ...shell.footer, quickLinks: items as any } } })}
        fields={[
          { key: "label", label: "Label", required: true },
          { key: "href", label: "Link", required: true, type: "url" },
        ] as any}
        createItem={() => ({ label: "", href: "" } as any)}
      />
=======
>>>>>>> c974e6d18f7e4d84cefd23b3ad822ac4cf9981fc
      <SectionCard title="Git-based CMS" description="Connect a GitHub repository to use as a content source.">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-admin-text">Repository Owner</span>
            <input value={siteConnection?.owner || ""} onChange={(e) => setData({ ...data, siteConnection: { ...data.siteConnection, name: data.siteConnection?.name || "portfolio", owner: e.target.value, repo: siteConnection?.repo || "", branch: siteConnection?.branch || "main", contentPath: siteConnection?.contentPath || "content" } })} className="w-full rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text" />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-admin-text">Repository Name</span>
            <input value={siteConnection?.repo || ""} onChange={(e) => setData({ ...data, siteConnection: { ...data.siteConnection, name: data.siteConnection?.name || "portfolio", repo: e.target.value, owner: siteConnection?.owner || "", branch: siteConnection?.branch || "main", contentPath: siteConnection?.contentPath || "content" } })} className="w-full rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text" />
          </label>
        </div>
      </SectionCard>
      <SectionCard title="Website SEO" description="Global SEO title, meta description, and favicon.">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-admin-text">SEO Title</span>
            <input value={websiteSettings?.seoTitle || ""} onChange={(e) => setData({ ...data, websiteSettings: { ...data.websiteSettings, seoTitle: e.target.value } })} className="w-full rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text" />
          </label>
          <label className="block text-sm md:col-span-2">
            <span className="mb-1 block font-medium text-admin-text">Meta Description</span>
            <textarea value={websiteSettings?.metaDescription || ""} onChange={(e) => setData({ ...data, websiteSettings: { ...data.websiteSettings, metaDescription: e.target.value } })} className="w-full rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text" />
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
<<<<<<< HEAD
}
=======
}
>>>>>>> c974e6d18f7e4d84cefd23b3ad822ac4cf9981fc
