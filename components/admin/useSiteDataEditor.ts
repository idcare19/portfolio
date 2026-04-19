"use client";

import { useCallback, useEffect, useState } from "react";
import type { GitHubProject, SiteData } from "@/src/types/site-data";

export type GitHubConfigInput = {
  token?: string;
  owner: string;
  repo: string;
  branch?: string;
  contentPath?: string;
};

function toGitHubConfig(project: GitHubProject, token?: string): GitHubConfigInput {
  return {
    token,
    owner: project.owner,
    repo: project.repo,
    branch: project.branch,
    contentPath: project.contentPath,
  };
}

export function useSiteDataEditor() {
  const [data, setData] = useState<SiteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);

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

        const remoteData = syncPayload?.data?.data as SiteData;
        setData(remoteData);

        if (remoteData?.activeGithubProjectId) {
          setActiveProjectId(remoteData.activeGithubProjectId);
        }

        return { ok: true as const };
      }

      const res = await fetch("/api/admin/content", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load site data");
      const payload = await res.json();
      setData(payload.data as SiteData);

      const loadedData = payload.data as SiteData;
      if (loadedData?.activeGithubProjectId) {
        setActiveProjectId(loadedData.activeGithubProjectId);
      }

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
      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: { ...updatedData, updatedAt: new Date().toISOString() },
          commitMessage,
          githubConfig,
        }),
      });

      if (!res.ok) {
        const payload = await res.json();
        throw new Error(payload.error || "Failed to update GitHub content");
      }

      setData({ ...updatedData, updatedAt: new Date().toISOString() });
      return { ok: true } as const;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
      return { ok: false, error: err instanceof Error ? err.message : "Save failed" } as const;
    } finally {
      setSaving(false);
    }
  }, []);

  const switchProject = useCallback(
    async (projectId: string, token?: string) => {
      if (!data) return { ok: false as const, error: "No site data loaded" };

      const project = data.githubProjects?.find((item) => item.id === projectId);
      if (!project) return { ok: false as const, error: "Project config not found" };

      const githubConfig = toGitHubConfig(project, token);
      const previousProjectId = activeProjectId;
      setActiveProjectId(projectId);

      const result = await load(githubConfig);
      if (!result?.ok) {
        setActiveProjectId(previousProjectId ?? null);
        return { ok: false as const, error: result?.error || "Failed to switch project" };
      }

      return { ok: true as const };
    },
    [activeProjectId, data, load]
  );

  return {
    data,
    setData,
    loading,
    saving,
    error,
    activeProjectId,
    setActiveProjectId,
    reload: load,
    save,
    switchProject,
  };
}
