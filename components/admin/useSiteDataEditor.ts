"use client";

import { useCallback, useEffect, useState } from "react";
import type { SiteData } from "@/src/types/site-data";

function normalizeSiteData(input: SiteData): SiteData {
  return input;
}

export function useSiteDataEditor() {
  const [data, setData] = useState<SiteData | null>(null);
  const [savedData, setSavedData] = useState<SiteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSaveMeta, setLastSaveMeta] = useState<any>(null);
  const [contentMeta, setContentMeta] = useState<{
    source: "mongodb" | "github" | null;
    requestedSource: "mongodb" | "github" | "auto";
    fallbackActivated: boolean;
    lastMongoUpdateAt: string | null;
    lastGitHubSyncAt: string | null;
  }>({
    source: null,
    requestedSource: "auto",
    fallbackActivated: false,
    lastMongoUpdateAt: null,
    lastGitHubSyncAt: null,
  });

  async function fetchLatestContent() {
    const cacheBust = Date.now();
    const res = await fetch(`/api/admin/site-data?_ts=${cacheBust}`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to load site data");
    return res.json();
  }

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const payload = await fetchLatestContent();
      const contentPayload = (payload.data || {}) as {
        data?: SiteData;
        source?: "mongodb" | "github";
        requestedSource?: "mongodb" | "github" | "auto";
        fallbackActivated?: boolean;
        meta?: {
          lastMongoUpdateAt?: string | null;
          lastGitHubSyncAt?: string | null;
        };
      };
      const normalized = normalizeSiteData((contentPayload.data || null) as SiteData);
      if (!normalized) throw new Error("Site data payload missing");
      setData(normalized);
      setSavedData(normalized);
      setContentMeta({
        source: contentPayload.source || null,
        requestedSource: contentPayload.requestedSource || normalized.websiteControl?.dataSource || "auto",
        fallbackActivated: Boolean(contentPayload.fallbackActivated),
        lastMongoUpdateAt: contentPayload.meta?.lastMongoUpdateAt || null,
        lastGitHubSyncAt: contentPayload.meta?.lastGitHubSyncAt || null,
      });

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

  const save = useCallback(async (updatedData: SiteData, commitMessage: string) => {
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
        }),
      });

      if (!res.ok) {
        const payload = await res.json();
        throw new Error(payload.error || "Failed to update content");
      }

      const payload = await res.json();
      const contentPayload = (payload?.data || {}) as {
        data?: SiteData;
        source?: "mongodb" | "github";
        requestedSource?: "mongodb" | "github" | "auto";
        fallbackActivated?: boolean;
        meta?: {
          lastMongoUpdateAt?: string | null;
          lastGitHubSyncAt?: string | null;
        };
      };
      const latestPayload = await fetchLatestContent().catch(() => null);
      const latestContentPayload = (latestPayload?.data || {}) as {
        data?: SiteData;
        source?: "mongodb" | "github";
        requestedSource?: "mongodb" | "github" | "auto";
        fallbackActivated?: boolean;
        meta?: {
          lastMongoUpdateAt?: string | null;
          lastGitHubSyncAt?: string | null;
        };
      };
      const authoritativeData = (latestContentPayload.data || contentPayload.data || nextData) as SiteData;
      const normalized = normalizeSiteData(authoritativeData);
      setData(normalized);
      setSavedData(normalized);
      setLastSaveMeta({
        ...payload,
        latestFetch: latestPayload,
      });
      setContentMeta({
        source: latestContentPayload.source || contentPayload.source || "mongodb",
        requestedSource: latestContentPayload.requestedSource || contentPayload.requestedSource || normalized.websiteControl?.dataSource || "auto",
        fallbackActivated: Boolean(latestContentPayload.fallbackActivated ?? contentPayload.fallbackActivated),
        lastMongoUpdateAt: latestContentPayload.meta?.lastMongoUpdateAt || contentPayload.meta?.lastMongoUpdateAt || null,
        lastGitHubSyncAt: latestContentPayload.meta?.lastGitHubSyncAt || contentPayload.meta?.lastGitHubSyncAt || null,
      });
      if (process.env.NODE_ENV !== "production") {
        console.debug("[admin/save] response", {
          success: Boolean(payload?.ok ?? payload?.success),
          activeSource: payload?.activeSource || payload?.source,
          updatedAt: payload?.updatedAt || normalized.updatedAt,
          savedPreview: payload?.savedFieldPreview || null,
          revalidatedPaths: payload?.revalidatedPaths || [],
        });
      }
      return { ok: true, data: normalized } as const;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
      return { ok: false, error: err instanceof Error ? err.message : "Save failed" } as const;
    } finally {
      setSaving(false);
    }
  }, []);

  const saveSection = useCallback(async (section: keyof SiteData, value: unknown, commitMessage: string) => {
    setSaving(true);
    setError(null);
    try {
      const previous = data;
      if (!previous) {
        throw new Error("No site data loaded");
      }

      return save(
        {
          ...previous,
          [section]: value as any,
          updatedAt: new Date().toISOString(),
        },
        commitMessage
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : "Save failed";
      setError(message);
      return { ok: false as const, error: message };
    } finally {
      setSaving(false);
    }
  }, [data, save]);

  const saveSections = useCallback(
    async (sections: Array<{ section: keyof SiteData; value: unknown }>, commitMessage: string) => {
      setSaving(true);
      setError(null);
      try {
        if (!data) {
          throw new Error("No site data loaded");
        }
        const next = { ...data } as SiteData;
        for (const entry of sections) {
          (next as any)[entry.section] = entry.value;
        }
        return await save(next, commitMessage);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Save failed";
        setError(message);
        return { ok: false as const, error: message };
      } finally {
        setSaving(false);
      }
    },
    [data, save]
  );

  const syncFromConnection = useCallback(
    async () => load(),
    [load]
  );

  return {
    data,
    setData,
    savedData,
    loading,
    saving,
    error,
    lastSaveMeta,
    contentMeta,
    isDirty: JSON.stringify(data) !== JSON.stringify(savedData),
    reload: load,
    resetToLastSaved: () => {
      if (savedData) setData(savedData);
    },
    save,
    saveSection,
    saveSections,
    syncFromConnection,
  };
}
