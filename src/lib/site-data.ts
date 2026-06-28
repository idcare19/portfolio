import "server-only";

import { unstable_noStore as noStore } from "next/cache";
import { toPublicSiteDataWithMeta, type PublicSiteData } from "@/lib/public-site-data";
import { getOrSeedSiteData } from "@/lib/site-data-store";
import type { SiteData } from "@/src/types/site-data";

export async function getFullSiteData(): Promise<SiteData> {
  noStore();
  return getOrSeedSiteData();
}

export async function getSiteData(): Promise<PublicSiteData> {
  return toPublicSiteDataWithMeta(await getFullSiteData());
}

export async function getWebsiteControl() {
  const siteData = await getSiteData();
  return siteData.websiteControl;
}
