"use client";

import { useEffect, useRef, useState } from "react";
import { useSiteDataContext } from "@/components/site/SiteDataProvider";
import { ArrowRight, X } from "lucide-react";

type Tone = {
  bar: string;
  text: string;
  chip: string;
  dot: string;
  ping: string;
  cta: string;
};

const toneMap: Record<string, Tone> = {
  blue: {
    bar: "bg-blue-50/95 border-blue-200/70 dark:bg-slate-900/95 dark:border-blue-400/25",
    text: "text-slate-900 dark:text-blue-50",
    chip: "bg-white/80 text-slate-700 ring-slate-900/10 dark:bg-slate-800/90 dark:text-blue-100 dark:ring-blue-300/20",
    dot: "bg-blue-500",
    ping: "bg-blue-400",
    cta: "bg-blue-600 hover:bg-blue-700 focus-visible:outline-blue-600",
  },
  emerald: {
    bar: "bg-emerald-50/95 border-emerald-200/70 dark:bg-slate-900/95 dark:border-emerald-400/25",
    text: "text-slate-900 dark:text-emerald-50",
    chip: "bg-white/80 text-slate-700 ring-slate-900/10 dark:bg-slate-800/90 dark:text-emerald-100 dark:ring-emerald-300/20",
    dot: "bg-emerald-500",
    ping: "bg-emerald-400",
    cta: "bg-emerald-600 hover:bg-emerald-700 focus-visible:outline-emerald-600",
  },
  amber: {
    bar: "bg-amber-50/95 border-amber-200/70 dark:bg-slate-900/95 dark:border-amber-400/25",
    text: "text-slate-900 dark:text-amber-50",
    chip: "bg-white/80 text-slate-700 ring-slate-900/10 dark:bg-slate-800/90 dark:text-amber-100 dark:ring-amber-300/20",
    dot: "bg-amber-500",
    ping: "bg-amber-400",
    cta: "bg-amber-600 hover:bg-amber-700 focus-visible:outline-amber-600",
  },
  rose: {
    bar: "bg-rose-50/95 border-rose-200/70 dark:bg-slate-900/95 dark:border-rose-400/25",
    text: "text-slate-900 dark:text-rose-50",
    chip: "bg-white/80 text-slate-700 ring-slate-900/10 dark:bg-slate-800/90 dark:text-rose-100 dark:ring-rose-300/20",
    dot: "bg-rose-500",
    ping: "bg-rose-400",
    cta: "bg-rose-600 hover:bg-rose-700 focus-visible:outline-rose-600",
  },
};

export function TopNoticeBar() {
  const portfolioData = useSiteDataContext();
  const config = portfolioData.websiteControl.topNoticeBar;
  const versionInfo = portfolioData.websiteControl.versionInfo;

  const barRef = useRef<HTMLDivElement>(null);
  // null = not checked yet (avoids a flash of the bar before we read storage)
  const [dismissed, setDismissed] = useState<boolean | null>(null);

  const storageKey = `top-notice-dismissed:${config?.message ?? ""}`;
  const visible = Boolean(config?.enabled) && dismissed === false;

  // Remember the dismissal for this session (a new message shows again)
  useEffect(() => {
    try {
      setDismissed(sessionStorage.getItem(storageKey) === "1");
    } catch {
      setDismissed(false);
    }
  }, [storageKey]);

  // Publish the bar's height as --notice-bar-height so the navbar can sit below it.
  useEffect(() => {
    const root = document.documentElement;
    const el = barRef.current;
    if (!visible || !el) {
      root.style.setProperty("--notice-bar-height", "0px");
      return;
    }
    const update = () => root.style.setProperty("--notice-bar-height", `${el.offsetHeight}px`);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      ro.disconnect();
      root.style.setProperty("--notice-bar-height", "0px");
    };
  }, [visible]);

  if (!visible || !config) return null;

  const tone = toneMap[config.colorStyle] || toneMap.blue;
  const hasUpdate = versionInfo?.showUpdateMessage && versionInfo.updateMessage;
  const hasCta = config.ctaText && config.ctaLink;

  const dismiss = () => {
    try {
      sessionStorage.setItem(storageKey, "1");
    } catch {
      /* storage unavailable: still hide for this view */
    }
    setDismissed(true);
  };

  return (
    <div
      ref={barRef}
      role="status"
      className={`fixed inset-x-0 top-0 z-[110] w-full border-b py-2 pl-3 pr-10 backdrop-blur sm:px-12 ${tone.bar} ${tone.text}`}
    >
      <div className="section-wrap">
        <div className="flex flex-col items-center justify-center gap-x-3 gap-y-1.5 text-center sm:flex-row sm:text-left">
          <div className="flex items-start gap-2.5 sm:items-center">
            <span aria-hidden className="relative mt-1.5 flex h-2 w-2 shrink-0 sm:mt-0">
              <span className={`absolute inline-flex h-full w-full rounded-full opacity-60 motion-safe:animate-ping ${tone.ping}`} />
              <span className={`relative inline-flex h-2 w-2 rounded-full ${tone.dot}`} />
            </span>
            <p className="max-w-[min(80vw,46rem)] text-[12px] font-medium leading-snug sm:max-w-none sm:text-sm">
              {config.message}
            </p>
          </div>

          {hasUpdate || hasCta ? (
            <div className="flex flex-wrap items-center justify-center gap-2">
              {hasUpdate ? (
                <span className={`rounded-md px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset sm:text-xs ${tone.chip}`}>
                  {versionInfo.updateMessage}
                </span>
              ) : null}

              {hasCta ? (
                <a
                  href={config.ctaLink}
                  className={`group inline-flex shrink-0 items-center gap-1 rounded-full px-3 py-1 text-[11px] font-semibold whitespace-nowrap text-white shadow-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:text-xs ${tone.cta}`}
                >
                  {config.ctaText}
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </a>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>

      <button
        type="button"
        onClick={dismiss}
        aria-label="Close notice"
        className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full text-slate-600 transition-colors hover:bg-slate-900/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-slate-700 sm:right-4"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
