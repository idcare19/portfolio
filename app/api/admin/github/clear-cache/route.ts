import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/admin/auth';
import { clearGitHubCache } from '@/lib/github-stats';
<<<<<<< HEAD
import { getFullSiteData } from "@/src/lib/site-data";
=======
import { getSiteData } from "@/src/lib/site-data";
>>>>>>> c974e6d18f7e4d84cefd23b3ad822ac4cf9981fc

export async function POST() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ success: false, reason: 'Unauthorized' }, { status: 401 });
  }

  try {
<<<<<<< HEAD
    const siteData = await getFullSiteData();
=======
    const siteData = await getSiteData();
>>>>>>> c974e6d18f7e4d84cefd23b3ad822ac4cf9981fc
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
<<<<<<< HEAD
}
=======
}
>>>>>>> c974e6d18f7e4d84cefd23b3ad822ac4cf9981fc
