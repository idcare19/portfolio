import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/admin/auth';
import { getFullGitHubStatsForAdmin } from '@/lib/github-stats';
import { getSiteData } from "@/src/lib/site-data";

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

    return NextResponse.json({ success: true, data: stats });
  } catch (error) {
    console.error('Error fetching GitHub stats:', error);
    return NextResponse.json({ success: false, reason: 'An error occurred while fetching GitHub stats.' }, { status: 500 });
  }
}
