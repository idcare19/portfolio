"use client";

import { portfolioData } from "@/data/portfolio";
import { useMemo, useState } from "react";

function isWithinSchedule(startDate: string, endDate: string) {
  const now = Date.now();
  const start = startDate ? Date.parse(startDate) : Number.NEGATIVE_INFINITY;
  const end = endDate ? Date.parse(endDate) : Number.POSITIVE_INFINITY;
  return now >= start && now <= end;
}

const styleMap: Record<string, string> = {
  info: "border-blue-200 bg-blue-50 text-blue-900",
  update: "border-violet-200 bg-violet-50 text-violet-900",
  warning: "border-amber-200 bg-amber-50 text-amber-900",
  offer: "border-emerald-200 bg-emerald-50 text-emerald-900",
};

export function GlobalPopupAnnouncement() {
  const config = portfolioData.websiteControl.popupAnnouncement;
  const canShow = useMemo(() => {
    if (!config?.enabled) return false;
    if (!isWithinSchedule(config.startDate, config.endDate)) return false;

    if (typeof window !== "undefined" && config.frequency === "once") {
      const seen = window.localStorage.getItem("site_popup_seen") === "1";
      if (seen) return false;
    }

    return true;
  }, [config]);

  const [open, setOpen] = useState(canShow);

  if (!open || !canShow) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/45 p-4">
      <div className={`w-full max-w-md rounded-2xl border p-5 shadow-2xl ${styleMap[config.style] || styleMap.info}`}>
        <h3 className="text-lg font-bold">{config.title}</h3>
        <p className="mt-2 text-sm opacity-90">{config.message}</p>

        <div className="mt-4 flex gap-2">
          {config.buttonText && config.buttonLink ? (
            <a href={config.buttonLink} className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
              {config.buttonText}
            </a>
          ) : null}
          {config.closeButton ? (
            <button
              onClick={() => {
                setOpen(false);
                if (config.frequency === "once") {
                  window.localStorage.setItem("site_popup_seen", "1");
                }
              }}
              className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700"
            >
              Close
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
