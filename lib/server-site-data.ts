import "server-only";

import { getSiteData } from "@/src/lib/site-data";
import type { SiteData } from "@/src/types/site-data";

export async function getServerSiteData(): Promise<SiteData> {
  return getSiteData();
}
