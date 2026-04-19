import { portfolioData } from "@/data/portfolio";
import { ArrowRight, Sparkles } from "lucide-react";

const styleMap: Record<string, string> = {
  blue: "from-blue-600 via-blue-500 to-cyan-500 text-white",
  emerald: "from-emerald-600 via-emerald-500 to-teal-500 text-white",
  amber: "from-amber-400 via-amber-300 to-orange-300 text-slate-900",
  rose: "from-rose-600 via-fuchsia-500 to-pink-500 text-white",
};

export function TopNoticeBar() {
  const config = portfolioData.websiteControl.topNoticeBar;
  if (!config?.enabled) return null;

  return (
    <div className={`relative z-[110] w-full bg-gradient-to-r px-3 py-2 ${styleMap[config.colorStyle] || styleMap.blue}`}>
      <div className="section-wrap">
        <div className="flex min-h-8 flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center text-[11px] sm:text-sm">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/18 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ring-1 ring-white/25">
            <Sparkles className="h-3 w-3" />
            Notice
          </span>
          <span className="font-medium">{config.message}</span>

          {config.ctaText && config.ctaLink ? (
            <a
              href={config.ctaLink}
              className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-semibold ring-1 ring-white/30 transition-colors hover:bg-white/25 sm:text-xs"
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
