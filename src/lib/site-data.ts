import rawSiteData from "@/src/data/siteData.json";
import type { SiteData } from "@/src/types/site-data";

export const siteData = rawSiteData as SiteData;

export function getSiteData() {
  return siteData;
}

export function getWebsiteControl() {
  return siteData.websiteControl;
}
