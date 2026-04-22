"use client";

import { useCallback, useEffect, useState } from "react";
import type { SiteConnection, SiteData } from "@/src/types/site-data";

export type GitHubConfigInput = {
  token?: string;
  owner: string;
  repo: string;
  branch?: string;
  contentPath?: string;
};

const DEFAULT_SITE_CONNECTION: SiteConnection = {
  name: "This Website",
  owner: "",
  repo: "",
  branch: "main",
  contentPath: "src/data/siteData.json",
};

function toGitHubConfig(connection: SiteConnection, token?: string): GitHubConfigInput {
  return {
    token,
    owner: connection.owner,
    repo: connection.repo,
    branch: connection.branch,
    contentPath: connection.contentPath,
  };
}

function normalizeSiteData(input: SiteData): SiteData {
  return {
    ...input,
    siteConnection: {
      ...DEFAULT_SITE_CONNECTION,
      ...(input.siteConnection || {}),
    },
  };
}

export function useSiteDataEditor() {
  const [data, setData] = useState<SiteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (githubConfig?: GitHubConfigInput) => {
    setLoading(true);
    setError(null);
    try {
      if (githubConfig) {
        const syncRes = await fetch("/api/admin/github/sync", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "pull", githubConfig }),
        });

        const syncPayload = await syncRes.json();
        if (!syncRes.ok || !syncPayload?.ok) {
          throw new Error(syncPayload?.error || "Failed to sync selected project");
        }

        const remoteData = normalizeSiteData(syncPayload?.data?.data as SiteData);
        setData(remoteData);

        return { ok: true as const };
      }

      const res = await fetch("/api/admin/content", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load site data");
      const payload = await res.json();
      setData(normalizeSiteData(payload.data as SiteData));

      return { ok: true as const };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to load data";
      setError(message);
      return { ok: false as const, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const save = useCallback(async (updatedData: SiteData, commitMessage: string, githubConfig?: GitHubConfigInput) => {
    setSaving(true);
    setError(null);
    try {
      const nextData = normalizeSiteData(updatedData);
      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: { ...nextData, updatedAt: new Date().toISOString() },
          commitMessage,
          githubConfig,
        }),
      });

      if (!res.ok) {
        const payload = await res.json();
        throw new Error(payload.error || "Failed to update GitHub content");
      }

      setData({ ...nextData, updatedAt: new Date().toISOString() });
      return { ok: true } as const;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
      return { ok: false, error: err instanceof Error ? err.message : "Save failed" } as const;
    } finally {
      setSaving(false);
    }
  }, []);

  const syncFromConnection = useCallback(
    async (token?: string) => {
      if (!data?.siteConnection?.owner || !data.siteConnection.repo) {
        return { ok: false as const, error: "Set owner and repo first" };
      }

      const result = await load(toGitHubConfig(data.siteConnection, token));
      if (!result?.ok) {
        return { ok: false as const, error: result?.error || "Failed to sync connection" };
      }

      return { ok: true as const };
    },
    [data, load]
  );

  return {
    data,
    setData,
    loading,
    saving,
    error,
    reload: load,
    save,
    syncFromConnection,
    toGitHubConfig,
  };
}
