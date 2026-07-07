"use client";

import type { SiteSectionBlock } from "@/src/types/site-data";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { filterHomepageItems, getHomepageButtonLabel, getHomepageDisplayConfig, shouldShowViewMore, debugHomepageDisplay } from "@/lib/homepage-display-controls";
import { useSiteDataContext } from "@/components/site/SiteDataProvider";

export function OpenSourceSection({ section }: { section: SiteSectionBlock }) {
  const siteData = useSiteDataContext();
  const pathname = usePathname();
  const homepageSettings = getHomepageDisplayConfig(siteData, "open-source");
  const isHomepage = pathname === "/";
  const fullItems = filterHomepageItems(section?.items || [], { showOnlyFeatured: false, manualItemOrder: undefined, limit: undefined, itemsLimit: undefined });
  const homepageItems = filterHomepageItems(section?.items || [], { ...homepageSettings, limit: homepageSettings.limit ?? homepageSettings.itemsLimit ?? 6 });
  const items = isHomepage ? homepageItems : fullItems;
  const showMore = isHomepage && shouldShowViewMore(fullItems, items, homepageSettings);
  debugHomepageDisplay("open-source", (section?.items || []).length, items.length, homepageSettings);
  return (
    <section id="open-source" className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="rounded-[32px] border border-[rgb(var(--border))] bg-white p-6 shadow-[0_18px_55px_rgba(15,23,42,0.06)] sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">{String(section.data?.eyebrow || "Open Source")}</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-text-main">{String(section.data?.title || "Open Source")}</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((item: any, index: number) => (
            <a key={item.projectName || index} href={item.repositoryUrl || "#"} target="_blank" rel="noreferrer" className="rounded-3xl border border-[rgb(var(--border))] p-5 transition hover:-translate-y-0.5">
              <h3 className="text-lg font-semibold text-text-main">{item.projectName || "Project"}</h3>
              <p className="mt-2 text-sm leading-7 text-text-muted">{item.description || ""}</p>
            </a>
          ))}
        </div>
        {isHomepage && showMore ? <div className="mt-8 flex justify-center"><Link href={homepageSettings.fullPageUrl || "/open-source"} className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white">{getHomepageButtonLabel(homepageSettings)}</Link></div> : null}
      </div>
    </section>
  );
}
