"use client";

import { useMemo, useState } from "react";
import type { SiteSectionBlock } from "@/src/types/site-data";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { filterHomepageItems, getHomepageButtonLabel, getHomepageDisplayConfig, shouldShowViewMore, debugHomepageDisplay, normalizeHomepageDisplayConfig } from "@/lib/homepage-display-controls";
import { useSiteDataContext } from "@/components/site/SiteDataProvider";

export function AchievementsSection({ section }: { section: SiteSectionBlock }) {
  const siteData = useSiteDataContext();
  const pathname = usePathname();
  const homepageSettings = getHomepageDisplayConfig(siteData, "achievements");
  const isHomepage = pathname === "/";
  const normalized = normalizeHomepageDisplayConfig(homepageSettings);
  const allItems = useMemo(() => filterHomepageItems(section?.items || [], { showOnlyFeatured: false, manualItemOrder: undefined, limit: undefined, itemsLimit: undefined }), [section?.items]);
  const [loadedCount, setLoadedCount] = useState(Number(normalized.initialItems || 3));
  const homepageItems = useMemo(() => filterHomepageItems(section?.items || [], { ...homepageSettings, limit: normalized.viewMoreMode === "load-more" ? loadedCount : Number(normalized.limit ?? normalized.itemsLimit ?? 6) }), [section?.items, homepageSettings.limit, homepageSettings.itemsLimit, homepageSettings.showOnlyFeatured, homepageSettings.manualItemOrder?.join("|"), loadedCount, normalized.viewMoreMode]);
  const items = isHomepage ? homepageItems : allItems;
  const showMore = isHomepage && shouldShowViewMore(allItems, items, homepageSettings);
  debugHomepageDisplay("achievements", (section?.items || []).length, items.length, homepageSettings);
  return (
    <section id="achievements" className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="rounded-[32px] border border-[rgb(var(--border))] bg-white p-6 shadow-[0_18px_55px_rgba(15,23,42,0.06)] sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">{String(section.data?.eyebrow || "Highlights")}</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-text-main">{String(section.data?.title || "Achievements")}</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((item: any, index: number) => (
            <div key={item.title || index} className="rounded-3xl border border-[rgb(var(--border))] p-5">
              <div className="text-3xl font-semibold text-primary">{item.metric || "0"}</div>
              <h3 className="mt-3 text-lg font-semibold text-text-main">{item.title || "Achievement"}</h3>
              <p className="mt-2 text-sm leading-7 text-text-muted">{item.description || ""}</p>
            </div>
          ))}
        </div>
        {isHomepage && showMore ? <div className="mt-8 flex justify-center">{normalized.viewMoreMode === "load-more" ? <button type="button" onClick={() => setLoadedCount((count) => count + Number(normalized.loadCount || 3))} className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white">{items.length >= allItems.length ? "No More Items" : getHomepageButtonLabel(homepageSettings)}</button> : <Link href={homepageSettings.fullPageUrl || "/achievements"} className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white">{getHomepageButtonLabel(homepageSettings)}</Link>}</div> : null}
      </div>
    </section>
  );
}
