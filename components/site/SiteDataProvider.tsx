"use client";

import { createContext, useContext } from "react";
<<<<<<< HEAD
import type { PublicSiteData } from "@/lib/public-site-data";
import type { DynamicSectionId, SiteSectionBlock } from "@/src/types/site-data";

const SiteDataContext = createContext<PublicSiteData | null>(null);

type SiteDataProviderProps = {
  data: PublicSiteData;
=======
import type { DynamicSectionId, SiteData, SiteSectionBlock } from "@/src/types/site-data";

const SiteDataContext = createContext<SiteData | null>(null);

type SiteDataProviderProps = {
  data: SiteData;
>>>>>>> c974e6d18f7e4d84cefd23b3ad822ac4cf9981fc
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
    throw new Error(`Missing section data for ${sectionId}`);
  }

  return section;
}
