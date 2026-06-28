"use client";

import { Eye } from "lucide-react";
import { useEffect, useState } from "react";
import { trackClientEvent } from "@/components/site/AnalyticsTracker";

export function ViewCounter({ targetType, targetSlug }: { targetType: "project" | "blog"; targetSlug: string }) {
  const [views, setViews] = useState({ totalViews: 0, uniqueViews: 0 });

  useEffect(() => {
    trackClientEvent(`${targetType}-view`, { targetType, targetSlug });
    void fetch(`/api/views/summary?targetType=${targetType}&targetSlug=${encodeURIComponent(targetSlug)}`)
      .then((res) => res.json())
      .then((payload) => setViews({ totalViews: Number(payload.totalViews || 0), uniqueViews: Number(payload.uniqueViews || 0) }))
      .catch(() => undefined);
  }, [targetSlug, targetType]);

  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-[rgb(var(--border))] px-4 py-2 text-sm text-text-main">
      <Eye className="h-4 w-4" />
      {views.totalViews} views
    </div>
  );
}
