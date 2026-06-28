import { getSiteData } from "@/src/lib/site-data";
import type { PublicSiteData } from "@/lib/public-site-data";

export const portfolioData = null as unknown as PublicSiteData;

export async function getPortfolioData(): Promise<PublicSiteData> {
  return getSiteData();
}

export type PortfolioData = PublicSiteData;