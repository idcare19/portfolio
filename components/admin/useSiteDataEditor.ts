"use client";

import { useCallback, useEffect, useState } from "react";
import type { SiteData } from "@/src/types/site-data";

export function useSiteDataEditor() {
  const [data, setData] = useState<SiteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/content", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load site data");
      const payload = await res.json();
      setData(payload.data as SiteData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load data");
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
      const res = await fetch("/api/github/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: { ...updatedData, updatedAt: new Date().toISOString() }, commitMessage }),
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

  return { data, setData, loading, saving, error, reload: load, save };
}
