"use client";

import { useCallback, useState } from "react";

export function useMaintenanceMode() {
  const [loading, setLoading] = useState(false);

  const updateMaintenanceMode = useCallback(async (enabled: boolean) => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/maintenance", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled }),
      });

      const payload = await res.json();
      if (!res.ok || !payload?.ok) {
        throw new Error(payload?.error || payload?.message || "Failed to update maintenance mode");
      }

      return { ok: true as const, data: payload?.data };
    } catch (error) {
      return { ok: false as const, error: error instanceof Error ? error.message : "Failed" };
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, updateMaintenanceMode };
}
