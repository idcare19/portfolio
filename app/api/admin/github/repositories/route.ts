import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin/server";
import { getFullGitHubStatsForAdmin, syncGitHubStats } from "@/lib/github-stats";
import { getFullSiteData } from "@/src/lib/site-data";

export const runtime = "nodejs";

export async function GET() {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;

  try {
    const siteData = await getFullSiteData();
    const username = siteData.githubConfig?.username;
    if (!username) {
      return NextResponse.json({ success: true, data: [] });
    }
    let stats = await getFullGitHubStatsForAdmin(username);
    if (!stats || (!Array.isArray((stats as any).availableRepositories) && !Array.isArray((stats as any).repositoryStats) && !Array.isArray((stats as any).repositories))) {
      const refreshed = await syncGitHubStats(username);
      if (refreshed.success) {
        stats = refreshed.stats as any;
      }
    }
    const payload = stats as any;
    return NextResponse.json({
      success: true,
      availableRepositories: Array.isArray(payload?.availableRepositories) ? payload.availableRepositories : Array.isArray(payload?.repositoryStats) ? payload.repositoryStats : Array.isArray(payload?.repositories) ? payload.repositories : [],
      selectedRepositories: Array.isArray(siteData.githubConfig?.selectedRepositories) ? siteData.githubConfig.selectedRepositories : [],
    });
  } catch (error) {
    return NextResponse.json({ success: false, reason: error instanceof Error ? error.message : "Failed to load repositories" }, { status: 500 });
  }
}
