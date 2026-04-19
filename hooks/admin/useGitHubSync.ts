"use client";

import { useState } from "react";
import type { SiteData } from "@/src/types/site-data";

export type GitHubConfigInput = {
  token?: string;
  owner: string;
  repo: string;
  branch?: string;
  contentPath?: string;
};

export function useGitHubSync() {
  const [syncing, setSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);

  async function pull(config: GitHubConfigInput) {
    setSyncing(true);
    setSyncError(null);
    try {
      const res = await fetch("/api/admin/github/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "pull", githubConfig: config }),
      });
      const payload = await res.json();

      if (!res.ok || !payload?.ok) {
        throw new Error(payload?.error || payload?.message || "GitHub pull failed");
      }

      return { ok: true as const, data: payload?.data?.data as SiteData };
    } catch (error) {
      const message = error instanceof Error ? error.message : "GitHub pull failed";
      setSyncError(message);
      return { ok: false as const, error: message };
    } finally {
      setSyncing(false);
    }
  }

  async function push(config: GitHubConfigInput, data: SiteData, commitMessage: string) {
    setSyncing(true);
    setSyncError(null);
    try {
      const res = await fetch("/api/admin/github/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "push", githubConfig: config, data, commitMessage }),
      });
      const payload = await res.json();

      if (!res.ok || !payload?.ok) {
        throw new Error(payload?.error || payload?.message || "GitHub push failed");
      }

      return { ok: true as const, data: payload?.data };
    } catch (error) {
      const message = error instanceof Error ? error.message : "GitHub push failed";
      setSyncError(message);
      return { ok: false as const, error: message };
    } finally {
      setSyncing(false);
    }
  }

  return { syncing, syncError, pull, push };
}
