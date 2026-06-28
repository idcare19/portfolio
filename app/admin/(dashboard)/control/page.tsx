"use client";

import { useState } from "react";
import { PageHeader } from "@/components/admin/PageHeader";
import { WebsiteControlEditor } from "@/components/admin/editors/WebsiteControlEditor";
import { useSiteDataEditor } from "@/components/admin/useSiteDataEditor";
import { useToast } from "@/components/admin/ToastProvider";

export default function ControlAdminPage() {
  const { notify } = useToast();
  const { data, setData, loading, saving, error, save, reload, contentMeta } = useSiteDataEditor();
  const [syncingGithubToDb, setSyncingGithubToDb] = useState(false);
  const [syncingDbToGithub, setSyncingDbToGithub] = useState(false);
  const [refreshingCache, setRefreshingCache] = useState(false);

  async function handleSave() {
    if (!data) return;
    const result = await save(data, "chore: update website control panel settings");
    if (result.ok) notify("success", "Website control settings saved and synced");
    else notify("error", result.error || "Save failed");
  }

  async function handleSyncGithubToDb() {
    setSyncingGithubToDb(true);
    try {
      const res = await fetch("/api/admin/sync/github-to-db", { method: "POST" });
      const payload = await res.json();
      if (!res.ok || !payload?.ok) throw new Error(payload?.error || "GitHub to MongoDB sync failed");
      await reload();
      notify("success", "GitHub content synced into MongoDB");
    } catch (error) {
      notify("error", error instanceof Error ? error.message : "GitHub to MongoDB sync failed");
    } finally {
      setSyncingGithubToDb(false);
    }
  }

  async function handleSyncDbToGithub() {
    setSyncingDbToGithub(true);
    try {
      const res = await fetch("/api/admin/sync/db-to-github", { method: "POST" });
      const payload = await res.json();
      if (!res.ok || !payload?.ok) throw new Error(payload?.error || "MongoDB to GitHub sync failed");
      await reload();
      notify("success", "MongoDB content synced to GitHub");
    } catch (error) {
      notify("error", error instanceof Error ? error.message : "MongoDB to GitHub sync failed");
    } finally {
      setSyncingDbToGithub(false);
    }
  }

  async function handleRefreshCache() {
    setRefreshingCache(true);
    try {
      const res = await fetch("/api/admin/revalidate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paths: ["/", "/maintenance"] }),
      });
      const payload = await res.json();
      if (!res.ok || !payload?.ok) throw new Error(payload?.error || "Cache refresh failed");
      await reload();
      notify("success", "Cache refresh completed");
    } catch (error) {
      notify("error", error instanceof Error ? error.message : "Cache refresh failed");
    } finally {
      setRefreshingCache(false);
    }
  }

  return (
    <div className="space-y-4">
      <PageHeader title="Website Control Panel" description="Manage popup, maintenance mode, top notice bar, and version/update badge." />
      {loading ? <p className="text-sm text-admin-text-muted">Loading website controls...</p> : null}
      {error ? <p className="text-sm font-medium text-rose-600">{error}</p> : null}
      {data ? (
        <WebsiteControlEditor
          data={data}
          onChange={setData as any}
          status={{
            activeSource: contentMeta.source,
            requestedSource: contentMeta.requestedSource,
            fallbackActivated: contentMeta.fallbackActivated,
            lastMongoUpdateAt: contentMeta.lastMongoUpdateAt,
            lastGitHubSyncAt: contentMeta.lastGitHubSyncAt,
          }}
          actions={{
            syncingGithubToDb,
            syncingDbToGithub,
            refreshingCache,
            onSyncGithubToDb: handleSyncGithubToDb,
            onSyncDbToGithub: handleSyncDbToGithub,
            onRefreshCache: handleRefreshCache,
          }}
        />
      ) : null}
      <button onClick={handleSave} disabled={!data || saving} className="rounded-xl bg-admin-primary px-4 py-2 text-sm font-semibold text-white hover:bg-[#1D4ED8] disabled:opacity-80">{saving ? "Saving..." : "Save Website Controls"}</button>
    </div>
  );
}
