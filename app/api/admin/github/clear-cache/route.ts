import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/admin/auth';
import { clearGitHubCache } from '@/lib/github-stats';
import { getSiteData } from "@/src/lib/site-data";

export async function POST() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ success: false, reason: 'Unauthorized' }, { status: 401 });
  }

  try {
    const siteData = await getSiteData();
    const username = siteData.githubConfig?.username;

    if (!username) {
      return NextResponse.json({ success: false, reason: 'GitHub username not configured.' }, { status: 400 });
    }

    await clearGitHubCache(username);

    return NextResponse.json({ success: true, message: 'GitHub cache cleared successfully.' });
  } catch (error) {
    console.error('Error clearing GitHub cache:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
    return NextResponse.json({ success: false, reason: errorMessage }, { status: 500 });
  }
}
