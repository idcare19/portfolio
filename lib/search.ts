import "server-only";

import { buildPublicCorpus, rankPublicCorpus } from "@/lib/public-corpus";

export async function searchPortfolio(query: string) {
  const { entries } = await buildPublicCorpus();
  return rankPublicCorpus(query, entries, 12);}
