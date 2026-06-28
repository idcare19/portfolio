import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/admin/auth';
import { getFullGitHubStatsForAdmin } from '@/lib/github-stats';
<<<<<<< HEAD
import { getFullSiteData } from "@/src/lib/site-data";
=======
import { getSiteData } from "@/src/lib/site-data";
>>>>>>> c974e6d18f7e4d84cefd23b3ad822ac4cf9981fc

export async function GET() {
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
<<<<<<< HEAD
}
=======
}
>>>>>>> c974e6d18f7e4d84cefd23b3ad822ac4cf9981fc
