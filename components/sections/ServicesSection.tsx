"use client";

import type { ReactNode } from "react";
import { AnimatedSection } from "@/components/effects/AnimatedSection";
import { useSectionData, useSiteDataContext } from "@/components/site/SiteDataProvider";
import { AnimatedCard } from "@/components/ui/AnimatedCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Wrench, Sparkles, Code2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { filterHomepageItems, getHomepageButtonLabel, getHomepageDisplayConfig, shouldShowViewMore, debugHomepageDisplay } from "@/lib/homepage-display-controls";
import { renderIcon } from "@/lib/skill-icons";

const iconMap: Record<string, ReactNode> = {
  code: <Code2 className="h-5 w-5 text-primary" />,
  wrench: <Wrench className="h-5 w-5 text-primary" />,
  layout: <Sparkles className="h-5 w-5 text-primary" />,
};

export function ServicesSection() {
  const section = useSectionData("services");
  const siteData = useSiteDataContext();
  const pathname = usePathname();
  const data = section.data as Record<string, any>;
  const homepageSettings = getHomepageDisplayConfig(siteData, "services");
  const isHomepage = pathname === "/";
  const fullItems = filterHomepageItems(section.items as Array<{ id?: string; title: string; description: string; icon?: string; isEnabled?: boolean }>, { ...homepageSettings, showOnlyFeatured: false, manualItemOrder: undefined, limit: undefined, itemsLimit: undefined });
  const homepageItems = filterHomepageItems(section.items as Array<{ id?: string; title: string; description: string; icon?: string; isEnabled?: boolean }>, { ...homepageSettings, limit: homepageSettings.limit ?? homepageSettings.itemsLimit ?? 6 });
  const items = isHomepage ? homepageItems : fullItems;
  const showMore = isHomepage && shouldShowViewMore(fullItems as any[], items, homepageSettings);
  debugHomepageDisplay("services", (section.items as any[]).length, items.length, homepageSettings);
  const hasHeader = Boolean(data.eyebrow || data.title || data.description);

  if (items.length === 0) {
    return null;
  }

  return (
    <AnimatedSection id="services" className="bg-section-bg py-20">
      <div className="section-wrap">
        {hasHeader ? <SectionHeader eyebrow={data.eyebrow} title={data.title} description={data.description} /> : null}

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item, index) => (
            <div key={item.id || `${item.title}-${index}`}>
              <AnimatedCard className="h-full">
                <div className="inline-flex rounded-2xl border border-primary/15 bg-primary/10 p-3 shadow-[0_10px_24px_rgba(37,99,235,0.08)]">
                  {item.iconUrl ? <img src={item.iconUrl} alt="" className="h-5 w-5 object-contain" /> : iconMap[item.icon || ""] || renderIcon(item.icon, item.iconColor, "h-5 w-5")}
                </div>
                <h3 className="mt-5 text-xl font-semibold text-text-main">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-text-muted">{item.description}</p>
              </AnimatedCard>
            </div>
          ))}
        </div>
        {isHomepage && showMore ? <div className="mt-8 flex justify-center"><Link href={homepageSettings.fullPageUrl || "/services"} className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white">{getHomepageButtonLabel(homepageSettings)}</Link></div> : null}
      </div>
    </AnimatedSection>
  );
}
