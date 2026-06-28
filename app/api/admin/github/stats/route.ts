import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/admin/auth';
import { getFullGitHubStatsForAdmin } from '@/lib/github-stats';
import { getSiteData } from "@/src/lib/site-data";

function normalizeStats(stats: any) {
  const totals = stats?.totals || {};
  return {
    syncedAt: stats?.syncedAt || "",
    publicCommits: stats?.publicCommits ?? totals.publicCommits ?? 0,
    privateCommits: stats?.privateCommits ?? totals.privateCommits ?? 0,
    totalCommits: stats?.totalCommits ?? totals.totalCommits ?? 0,
    privateIncluded: Boolean(stats?.privateIncluded),
    totals: {
      totalRepos: totals.totalRepos ?? 0,
      publicRepos: totals.publicRepos ?? 0,
      privateRepos: totals.privateRepos ?? 0,
      totalStars: totals.totalStars ?? 0,
      totalForks: totals.totalForks ?? 0,
      publicCommits: totals.publicCommits ?? stats?.publicCommits ?? 0,
      privateCommits: totals.privateCommits ?? stats?.privateCommits ?? 0,
      totalCommits: totals.totalCommits ?? stats?.totalCommits ?? 0,
    },
    repositories: Array.isArray(stats?.repositories) ? stats.repositories : [],
    selectedRepositories: Array.isArray(stats?.selectedRepositories) ? stats.selectedRepositories : [],
    lastSyncError: stats?.lastSyncError || "",
  };
}

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ success: false, reason: 'Unauthorized' }, { status: 401 });
  }

  try {
    const siteData = await getSiteData();
    const githubConfig = siteData?.githubConfig;

    if (!githubConfig?.enabled || !githubConfig.username) {
      return NextResponse.json({ success: false, reason: 'GitHub integration disabled or username not configured.' });
    }

    const stats = await getFullGitHubStatsForAdmin(githubConfig.username);

    return NextResponse.json({ success: true, data: normalizeStats(stats) });
  } catch (error) {
    console.error('Error fetching GitHub stats:', error);
    return NextResponse.json({ success: false, reason: 'An error occurred while fetching GitHub stats.' }, { status: 500 });
  }
}
