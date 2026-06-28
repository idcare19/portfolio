import { NextResponse } from 'next/server';
import { getSiteData } from "@/src/lib/site-data";
import { getPublicGitHubStats } from '@/lib/github-stats';

export async function GET() {
  try {
    const siteData = await getSiteData();
    const githubConfig = siteData?.githubConfig;

    if (!githubConfig?.enabled || !githubConfig.username) {
      return NextResponse.json({ success: false, reason: 'GitHub integration disabled or username not configured.' });
    }

    const stats = await getPublicGitHubStats(githubConfig.username);
    
    if (!stats) {
      return NextResponse.json({ success: false, reason: 'GitHub data not synced yet. Please sync from admin.' });
    }

    return NextResponse.json({ success: true, data: stats, syncedAt: stats.syncedAt });
  } catch (error) {
    console.error('Error fetching GitHub stats:', error);
    return NextResponse.json({ success: false, reason: 'An error occurred while fetching GitHub stats.' }, { status: 500 });
  }
}
