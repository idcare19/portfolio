"use client";

import { portfolioData } from "@/data/portfolio";
import { Bell, Megaphone, Rocket, TriangleAlert, X } from "lucide-react";
import { useMemo, useState } from "react";

function isWithinSchedule(startDate: string, endDate: string) {
  const now = Date.now();
  const start = startDate ? Date.parse(startDate) : Number.NEGATIVE_INFINITY;
  const end = endDate ? Date.parse(endDate) : Number.POSITIVE_INFINITY;
  return now >= start && now <= end;
}

const styleMap: Record<string, string> = {
  info: "border-blue-200/80 from-blue-50 to-cyan-50 text-blue-900",
  update: "border-violet-200/80 from-violet-50 to-fuchsia-50 text-violet-900",
  warning: "border-amber-200/80 from-amber-50 to-orange-50 text-amber-900",
  offer: "border-emerald-200/80 from-emerald-50 to-teal-50 text-emerald-900",
};

const iconMap = {
  info: Bell,
  update: Rocket,
  warning: TriangleAlert,
  offer: Megaphone,
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

  const ThemeIcon = iconMap[config.style] || iconMap.info;
  const dismiss = () => {
    setOpen(false);
    if (config.frequency === "once") {
      window.localStorage.setItem("site_popup_seen", "1");
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
      <div
        className={`relative w-full max-w-lg overflow-hidden rounded-3xl border bg-gradient-to-b p-0 shadow-[0_30px_80px_rgba(2,6,23,0.4)] ${styleMap[config.style] || styleMap.info}`}
      >
        <div className="pointer-events-none absolute -right-14 -top-14 h-44 w-44 rounded-full bg-white/40 blur-3xl" />
        <div className="relative p-6 sm:p-7">
          {config.closeButton ? (
            <button
              onClick={dismiss}
              className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200/80 bg-white/75 text-slate-600 transition-colors hover:bg-white"
              aria-label="Close announcement"
            >
              <X className="h-4 w-4" />
            </button>
          ) : null}

          <div className="inline-flex items-center gap-2 rounded-full border border-current/20 bg-white/60 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
            <ThemeIcon className="h-3.5 w-3.5" />
            Announcement
          </div>

          {config.image ? (
            <img
              src={config.image}
              alt={config.title || "Announcement"}
              className="mt-4 h-40 w-full rounded-2xl border border-white/70 object-cover"
            />
          ) : null}

          <h3 className="mt-4 text-2xl font-bold tracking-tight">{config.title}</h3>
          <p className="mt-2 text-sm leading-relaxed opacity-90 sm:text-[15px]">{config.message}</p>

          <div className="mt-6 flex flex-wrap gap-2">
            {config.buttonText && config.buttonLink ? (
              <a
                href={config.buttonLink}
                className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_10px_20px_rgba(15,23,42,0.24)] transition-transform hover:-translate-y-0.5"
              >
                {config.buttonText}
              </a>
            ) : null}
            {config.closeButton ? (
              <button
                onClick={dismiss}
                className="rounded-xl border border-slate-300/80 bg-white/90 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-white"
              >
                Maybe later
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
