import type { SiteData, SiteSectionBlock } from "@/src/types/site-data";

export type HomepageDisplayConfig = {
  limit?: number | "all";
  itemsLimit?: number | "all";
  showOnlyFeatured?: boolean;
  showViewMoreButton?: boolean;
  viewMoreMode?: "navigate" | "load-more";
  viewMoreButtonText?: string;
  fullPageUrl?: string;
  manualItemOrder?: string[];
  initialItems?: number;
  loadCount?: number;
};

const SECTION_ALIASES: Record<string, string[]> = {
  company: ["companies"],
  companies: ["company"],
  completedProjects: ["completed", "completed-projects"],
  completed: ["completedProjects", "completed-projects"],
  certificate: ["certificates"],
  certificates: ["certificate"],
  faqs: ["faq"],
  faq: ["faqs"],
  openSource: ["open-source"],
  "open-source": ["openSource"],
  journey: ["experience"],
  experience: ["journey"],
};

const DEFAULTS: Required<Pick<HomepageDisplayConfig, "showOnlyFeatured" | "showViewMoreButton" | "viewMoreButtonText" | "fullPageUrl">> = {
  showOnlyFeatured: false,
  showViewMoreButton: true,
  viewMoreButtonText: "View More",
  fullPageUrl: "",
};

export function normalizeHomepageDisplayConfig(config?: HomepageDisplayConfig): Required<Pick<HomepageDisplayConfig, "showOnlyFeatured" | "showViewMoreButton" | "viewMoreMode" | "viewMoreButtonText" | "fullPageUrl" | "initialItems" | "loadCount">> & HomepageDisplayConfig {
  return {
    showOnlyFeatured: config?.showOnlyFeatured ?? false,
    showViewMoreButton: config?.showViewMoreButton ?? true,
    viewMoreMode: config?.viewMoreMode || "navigate",
    viewMoreButtonText: config?.viewMoreButtonText || "View More",
    fullPageUrl: config?.fullPageUrl || "",
    initialItems: config?.initialItems ?? 3,
    loadCount: config?.loadCount ?? 3,
    ...config,
  };
}

export function getHomepageDisplayConfig(siteData: SiteData | undefined, sectionId: string): HomepageDisplayConfig {
  const keys = [sectionId, ...(SECTION_ALIASES[sectionId] || [])];
  const homepageDisplay = keys.map((key) => siteData?.websiteControl?.homepageDisplay?.[key]).find(Boolean);
  const sectionHomepage = keys.map((key) => siteData?.websiteControl?.sectionHomepage?.[key]).find(Boolean);
  return {
    ...DEFAULTS,
    ...(homepageDisplay || sectionHomepage || {}),
  };
}

function getItemIdentity(item: any) {
  return String(item?.id || item?.slug || item?.title || item?.projectName || item?.companyName || item?.certificateTitle || item?.question || "");
}

export function filterHomepageItems(items: any[], config: HomepageDisplayConfig): any[] {
  const normalized = normalizeHomepageDisplayConfig(config);
  let filtered = items.filter((item) => item && item.isEnabled !== false);
  if (normalized.showOnlyFeatured) {
    filtered = filtered.filter((item) => Boolean(item.featured || item.isFeatured));
  }
  if (normalized.manualItemOrder?.length) {
    const order = new Map(normalized.manualItemOrder.map((id, index) => [id, index] as const));
    filtered = [...filtered]
      .filter((item) => order.has(getItemIdentity(item)))
      .sort((left, right) => (order.get(getItemIdentity(left)) ?? 0) - (order.get(getItemIdentity(right)) ?? 0));
  } else {
    filtered = [...filtered].sort((left, right) => Number(left.order || 0) - Number(right.order || 0));
  }
  const limit = normalized.limit ?? normalized.itemsLimit;
  if (typeof limit === "number") {
    return filtered.slice(0, limit);
  }
  return filtered;
}

export function debugHomepageDisplay(sectionId: string, originalCount: number, renderedCount: number, config: HomepageDisplayConfig) {
  if (process.env.NODE_ENV !== "development") return;
  console.debug("[homepage-display]", {
    sectionId,
    limit: config.limit ?? config.itemsLimit ?? "all",
    originalCount,
    renderedCount,
  });
}

export function shouldShowViewMore(allItems: any[], visibleItems: any[], config: HomepageDisplayConfig) {
  const normalized = normalizeHomepageDisplayConfig(config);
  if (normalized.showViewMoreButton === false) return false;
  return allItems.length > visibleItems.length;
}

export function getHomepageButtonLabel(config: HomepageDisplayConfig) {
  return String(config?.viewMoreButtonText || "View More");
}

export function getHomepageRouteItems<T>(items: T[], isHomepage: boolean, config: HomepageDisplayConfig): T[] {
  if (!isHomepage) return items;
  return filterHomepageItems(items as any[], config) as T[];
}
