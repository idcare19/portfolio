"use client";

import { useState, useEffect, useCallback } from "react";
import type { SiteData } from "@/src/types/site-data";

export function useSiteData() {
  const [data, setData] = useState<SiteData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSiteData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/site-data", {
        cache: "no-store",
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      const payload = await res.json();
      if (!res.ok || !payload?.ok) {
        throw new Error(payload?.error || "Failed to fetch site data");
      }
      setData(payload.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch site data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSiteData();
  }, [fetchSiteData]);

  // Allow manual refresh function to refresh data after making changes in admin panel
  const refresh = useCallback(() => {
    fetchSiteData();
  }, [fetchSiteData]);

  return { data, loading, error, refresh };
}