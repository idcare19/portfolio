"use client";

import { useSiteDataContext } from "@/components/site/SiteDataProvider";
import { ArrowRight, Sparkles } from "lucide-react";

const styleMap: Record<string, string> = {
  blue: "from-blue-50 via-white to-indigo-50 text-slate-900",
  emerald: "from-emerald-50 via-white to-teal-50 text-slate-900",
  amber: "from-amber-50 via-white to-orange-50 text-slate-900",
  rose: "from-rose-50 via-white to-pink-50 text-slate-900",
};

export function TopNoticeBar() {
  const portfolioData = useSiteDataContext();
  const config = portfolioData.websiteControl.topNoticeBar;
  const versionInfo = portfolioData.websiteControl.versionInfo;
  if (!config?.enabled) return null;

  return (
<<<<<<< HEAD
    <div className={`fixed inset-x-0 top-0 z-[110] w-full border-b border-[rgb(var(--border))] bg-gradient-to-r px-3 py-2 sm:px-4 ${styleMap[config.colorStyle] || styleMap.blue}`}>
      <div className="section-wrap">
        <div className="flex flex-col items-center justify-center gap-2 text-center sm:flex-row sm:gap-3 sm:text-sm">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[rgb(var(--border))] bg-white/85 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary shadow-sm">
            <Sparkles className="h-3 w-3" />
            Notice
          </span>
          <span className="max-w-[min(92vw,46rem)] text-[11px] font-medium leading-snug sm:max-w-none sm:text-sm">
            {config.message}
          </span>
=======
    <div className={`fixed inset-x-0 top-0 z-[110] w-full border-b border-[rgb(var(--border))] bg-gradient-to-r px-3 py-2 ${styleMap[config.colorStyle] || styleMap.blue}`}>
      <div className="section-wrap">
        <div className="flex min-h-8 flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center text-[11px] sm:text-sm">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[rgb(var(--border))] bg-white px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
            <Sparkles className="h-3 w-3" />
            Notice
          </span>
          <span className="font-medium">{config.message}</span>
>>>>>>> c974e6d18f7e4d84cefd23b3ad822ac4cf9981fc

          {versionInfo?.showUpdateMessage && versionInfo.updateMessage ? (
            <span className="inline-flex items-center rounded-full border border-[#BFDBFE] bg-[#EFF6FF] px-2.5 py-1 text-[11px] font-semibold text-[#1D4ED8] sm:text-xs">
              {versionInfo.updateMessage}
            </span>
          ) : null}

          {config.ctaText && config.ctaLink ? (
            <a
              href={config.ctaLink}
<<<<<<< HEAD
              className="inline-flex shrink-0 items-center gap-1 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[10px] font-semibold whitespace-nowrap text-primary transition-colors hover:bg-primary/15 sm:px-3 sm:py-1.5 sm:text-xs"
=======
              className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary transition-colors hover:bg-primary/15 sm:text-xs"
>>>>>>> c974e6d18f7e4d84cefd23b3ad822ac4cf9981fc
            >
              {config.ctaText}
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
}
