import { portfolioData } from "@/data/portfolio";

const styleMap: Record<string, string> = {
  blue: "bg-blue-600 text-white",
  emerald: "bg-emerald-600 text-white",
  amber: "bg-amber-500 text-slate-900",
  rose: "bg-rose-600 text-white",
};

export function TopNoticeBar() {
  const config = portfolioData.websiteControl.topNoticeBar;
  if (!config?.enabled) return null;

  return (
    <div className={`w-full px-4 py-2 text-center text-xs sm:text-sm ${styleMap[config.colorStyle] || styleMap.blue}`}>
      <span className="mr-2">{config.message}</span>
      {config.ctaText && config.ctaLink ? (
        <a href={config.ctaLink} className="font-semibold underline underline-offset-2">
          {config.ctaText}
        </a>
      ) : null}
    </div>
  );
}
