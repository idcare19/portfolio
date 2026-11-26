"use client";

import { useSiteDataContext } from "@/components/site/SiteDataProvider";
import { ArrowRight, Bell, Megaphone, Rocket, TriangleAlert, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

function isWithinSchedule(startDate: string, endDate: string) {
  const now = Date.now();
  const start = startDate ? Date.parse(startDate) : Number.NEGATIVE_INFINITY;
  const end = endDate ? Date.parse(endDate) : Number.POSITIVE_INFINITY;
  return now >= start && now <= end;
}

// One accent per announcement style. Full class names so Tailwind can see them.
const THEMES = {
  info: {
    icon: Bell,
    text: "text-blue-600 dark:text-blue-400",
    tile: "bg-blue-500/10 ring-blue-500/25",
    bar: "via-blue-500",
    glow: "bg-blue-500/25",
    button: "bg-blue-600 shadow-blue-600/25 hover:bg-blue-500",
    dot: "#3b82f6",
  },
  update: {
    icon: Rocket,
    text: "text-violet-600 dark:text-violet-400",
    tile: "bg-violet-500/10 ring-violet-500/25",
    bar: "via-violet-500",
    glow: "bg-violet-500/25",
    button: "bg-violet-600 shadow-violet-600/25 hover:bg-violet-500",
    dot: "#8b5cf6",
  },
  warning: {
    icon: TriangleAlert,
    text: "text-amber-600 dark:text-amber-400",
    tile: "bg-amber-500/10 ring-amber-500/25",
    bar: "via-amber-500",
    glow: "bg-amber-500/25",
    button: "bg-amber-600 shadow-amber-600/25 hover:bg-amber-500",
    dot: "#f59e0b",
  },
  offer: {
    icon: Megaphone,
    text: "text-emerald-600 dark:text-emerald-400",
    tile: "bg-emerald-500/10 ring-emerald-500/25",
    bar: "via-emerald-500",
    glow: "bg-emerald-500/25",
    button: "bg-emerald-600 shadow-emerald-600/25 hover:bg-emerald-500",
    dot: "#10b981",
  },
} as const;

type ThemeKey = keyof typeof THEMES;

const EXIT_MS = 220;

export function GlobalPopupAnnouncement() {
  const portfolioData = useSiteDataContext();
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
  const [visible, setVisible] = useState(false); // drives the enter/exit animation
  const dialogRef = useRef<HTMLDivElement>(null);
  const exitTimer = useRef(0);

  const active = open && canShow;

  const dismiss = useCallback(() => {
    setVisible(false);
    window.clearTimeout(exitTimer.current);
    exitTimer.current = window.setTimeout(() => {
      setOpen(false);
      if (config?.frequency === "once") {
        window.localStorage.setItem("site_popup_seen", "1");
      }
    }, EXIT_MS);
  }, [config?.frequency]);

  // Enter animation + move focus into the dialog
  useEffect(() => {
    if (!active) return;
    const id = requestAnimationFrame(() => {
      setVisible(true);
      dialogRef.current?.focus();
    });
    return () => cancelAnimationFrame(id);
  }, [active]);

  // Escape closes the popup (only when it is allowed to be closed)
  useEffect(() => {
    if (!active || !config?.closeButton) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, config?.closeButton, dismiss]);

  useEffect(() => () => window.clearTimeout(exitTimer.current), []);

  if (!active) return null;

  const theme = THEMES[(config.style as ThemeKey) in THEMES ? (config.style as ThemeKey) : "info"];
  const ThemeIcon = theme.icon;

  return (
    <div className="fixed inset-0 z-[120] flex items-end justify-center p-4 sm:items-center">
      {/* Backdrop */}
      <div
        aria-hidden
        onClick={config.closeButton ? dismiss : undefined}
        className={`absolute inset-0 bg-slate-950/45 backdrop-blur-sm transition-opacity duration-300 motion-reduce:transition-none ${
          visible ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Card */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="site-popup-title"
        tabIndex={-1}
        className={`relative w-full max-w-md overflow-hidden rounded-3xl border border-[rgb(var(--border))] bg-[rgb(var(--page-bg))] text-text-main shadow-2xl shadow-black/20 outline-none transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
          visible ? "translate-y-0 scale-100 opacity-100" : "translate-y-6 scale-95 opacity-0"
        }`}
      >
        {/* Accent line */}
        <div
          aria-hidden
          className={`absolute inset-x-0 top-0 z-10 h-[3px] bg-gradient-to-r from-transparent ${theme.bar} to-transparent`}
        />

        {/* Soft glow + dot grid (same dot motif as the loader) */}
        <div
          aria-hidden
          className={`pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full blur-3xl ${theme.glow}`}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute right-0 top-0 h-36 w-44 opacity-40"
          style={{
            color: theme.dot,
            backgroundImage: "radial-gradient(circle, currentColor 1.2px, transparent 1.6px)",
            backgroundSize: "14px 14px",
            maskImage: "radial-gradient(circle at top right, #000, transparent 70%)",
            WebkitMaskImage: "radial-gradient(circle at top right, #000, transparent 70%)",
          }}
        />

        {/* Image */}
        {config.image ? (
          <div className="relative h-44 w-full overflow-hidden">
            <img
              src={config.image}
              alt={config.title || "Announcement"}
              className="h-full w-full object-cover"
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-[rgb(var(--page-bg))] via-transparent to-transparent"
            />
          </div>
        ) : null}

        {/* Close button */}
        {config.closeButton ? (
          <button
            onClick={dismiss}
            aria-label="Close announcement"
            className="absolute right-4 top-4 z-20 inline-flex h-9 w-9 items-center justify-center rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--page-bg))]/80 text-text-muted backdrop-blur transition-colors hover:text-text-main focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}

        <div className={`relative px-6 pb-6 sm:px-7 sm:pb-7 ${config.image ? "-mt-6" : "pt-7"}`}>
          {/* Icon + label */}
          <div className="flex items-center gap-3">
            <span
              className={`flex h-11 w-11 items-center justify-center rounded-2xl ring-1 ${theme.tile} ${theme.text}`}
            >
              <ThemeIcon className="h-5 w-5" />
            </span>
            <span className="text-sm font-medium text-text-muted">Announcement</span>
          </div>

          <h3
            id="site-popup-title"
            className="mt-5 text-2xl font-bold leading-tight tracking-tight sm:text-[1.75rem]"
          >
            {config.title}
          </h3>
          <p className="mt-2.5 text-sm leading-relaxed text-text-muted sm:text-[15px]">
            {config.message}
          </p>

          {/* Actions */}
          <div className="mt-7 flex flex-col-reverse gap-2.5 sm:flex-row sm:items-center">
            {config.closeButton ? (
              <button
                onClick={dismiss}
                className="rounded-xl border border-[rgb(var(--border))] px-4 py-2.5 text-sm font-semibold text-text-muted transition-colors hover:text-text-main focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                Maybe later
              </button>
            ) : null}

            {config.buttonText && config.buttonLink ? (
              <a
                href={config.buttonLink}
                className={`group inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary sm:ml-auto ${theme.button}`}
              >
                {config.buttonText}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}