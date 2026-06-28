import { getSiteData } from "@/src/lib/site-data";
<<<<<<< HEAD
import type { PublicSiteData } from "@/lib/public-site-data";

export const portfolioData = null as unknown as PublicSiteData;

export async function getPortfolioData(): Promise<PublicSiteData> {
  return getSiteData();
}

export type PortfolioData = PublicSiteData;
=======
import type { SiteData } from "@/src/types/site-data";

export const portfolioData = null as unknown as SiteData;

export async function getPortfolioData(): Promise<SiteData> {
  return getSiteData();
}

export type PortfolioData = SiteData;
>>>>>>> c974e6d18f7e4d84cefd23b3ad822ac4cf9981fc
