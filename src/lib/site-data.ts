import "server-only";

import { unstable_noStore as noStore } from "next/cache";
<<<<<<< HEAD
import { toPublicSiteDataWithMeta, type PublicSiteData } from "@/lib/public-site-data";
import { getOrSeedSiteData } from "@/lib/site-data-store";
import type { SiteData } from "@/src/types/site-data";

export async function getFullSiteData(): Promise<SiteData> {
=======
import { getOrSeedSiteData } from "@/lib/site-data-store";
import type { SiteData } from "@/src/types/site-data";

export async function getSiteData(): Promise<SiteData> {
>>>>>>> c974e6d18f7e4d84cefd23b3ad822ac4cf9981fc
  noStore();
  return getOrSeedSiteData();
}

<<<<<<< HEAD
export async function getSiteData(): Promise<PublicSiteData> {
  return toPublicSiteDataWithMeta(await getFullSiteData());
}

=======
>>>>>>> c974e6d18f7e4d84cefd23b3ad822ac4cf9981fc
export async function getWebsiteControl() {
  const siteData = await getSiteData();
  return siteData.websiteControl;
}
