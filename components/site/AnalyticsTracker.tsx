"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

function ensureId(key: string) {
  const existing = window.localStorage.getItem(key);
  if (existing) return existing;
  const value = crypto.randomUUID();
  window.localStorage.setItem(key, value);
  return value;
}

export function trackClientEvent(eventType: string, payload?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  const visitorId = ensureId("portfolio_visitor_id");
  const sessionId = ensureId("portfolio_session_id");
  void fetch("/api/analytics/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      eventType,
      path: window.location.pathname + window.location.search,
      visitorId,
      sessionId,
      ...(payload || {}),
    }),
  }).catch(() => undefined);
}

export function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    trackClientEvent("page-view");
  }, [pathname]);

  return null;
}
