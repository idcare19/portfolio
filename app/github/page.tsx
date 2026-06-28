import { FooterSection } from "@/components/layout/FooterSection";
import { Navbar } from "@/components/layout/Navbar";
import { GitHubDashboardPage } from "@/components/github/GitHubDashboardPage";
import type { GitHubStatsResponse } from "@/components/github/types";
import { getPublicGitHubStats } from "@/lib/github-stats";
import { getSiteData } from "@/src/lib/site-data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function GitHubPage() {
  const siteData = await getSiteData();
  const enabled = Boolean(siteData.githubConfig?.enabled && siteData.githubConfig.username);
  const stats = enabled ? ((await getPublicGitHubStats(siteData.githubConfig!.username)) as GitHubStatsResponse | null) : null;

  return (
    <main className="min-h-screen bg-page-bg">
      <Navbar />
      <div className="section-wrap py-12 sm:py-16">
        <GitHubDashboardPage enabled={enabled} initialStats={stats} />
      </div>
      <FooterSection />
    </main>
  );
}
