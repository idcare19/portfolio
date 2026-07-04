"use client";

import { createContext, useContext } from "react";
import type { DynamicSectionId, SiteData, SiteSectionBlock } from "@/src/types/site-data";

const SiteDataContext = createContext<SiteData | null>(null);

type SiteDataProviderProps = {
  data: SiteData;
  children: React.ReactNode;
};

export function SiteDataProvider({ data, children }: SiteDataProviderProps) {
  return <SiteDataContext.Provider value={data}>{children}</SiteDataContext.Provider>;
}

export function useSiteDataContext() {
  const value = useContext(SiteDataContext);

  if (!value) {
    throw new Error("useSiteDataContext must be used within a SiteDataProvider");
  }

  return value;
}

export function useSectionData(sectionId: DynamicSectionId): SiteSectionBlock {
  const siteData = useSiteDataContext();
  const section = siteData.sections?.[sectionId];

  if (!section) {
    return {
      id: sectionId,
      label: sectionId,
      renderer: sectionId,
      enabled: false,
      order: 0,
      data: {},
      items: [],
    };
  }

  return section;
}
