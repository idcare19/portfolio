import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/admin/auth';
import { syncGitHubStats } from '@/lib/github-stats';
<<<<<<< HEAD
import { getFullSiteData } from "@/src/lib/site-data";

=======
import { getSiteData } from "@/src/lib/site-data";
>>>>>>> c974e6d18f7e4d84cefd23b3ad822ac4cf9981fc

export async function POST() {
  const session = await getAdminSession();
  if (!session) {
<<<<<<< HEAD
    return NextResponse.json({ success: false, error: 'Unauthorized', details: 'Admin session required.' }, { status: 401 });
  }

  try {
    const siteData = await getFullSiteData();
    const githubConfig = siteData.githubConfig;
    const username = githubConfig?.username;
    const hasToken = !!(githubConfig?.token || process.env.GITHUB_TOKEN || process.env.GITHUB_PAT);

    console.log('[GitHub Sync Config]', {
      username,
      enabled: githubConfig?.enabled,
      tokenExists: hasToken,
      source: siteData.websiteControl?.dataSource || 'mongodb',
    });

    if (githubConfig?.enabled === false) {
      console.warn('[GitHub Sync 400] GitHub integration is disabled.');
      return NextResponse.json({ success: false, error: 'GitHub Disabled', details: 'GitHub integration is disabled in settings.' }, { status: 400 });
    }

    if (!username) {
      console.warn('[GitHub Sync 400] Missing username.');
      return NextResponse.json({ success: false, error: 'GitHub username is required.', details: 'Please configure a GitHub username in the admin settings.' }, { status: 400 });
    }

    if (!hasToken) {
      console.warn(`[GitHub Sync] Token missing. Proceeding with public-only sync for ${username}`);
    }

    if (githubConfig?.includePrivateRepos && !hasToken) {
      return NextResponse.json(
        {
          success: false,
          error: 'GitHub token required',
          details: 'Include private repositories requires a valid GitHub token.',
        },
        { status: 400 }
      );
=======
    return NextResponse.json({ success: false, reason: 'Unauthorized' }, { status: 401 });
  }

  try {
    const siteData = await getSiteData();
    const username = siteData.githubConfig?.username;

    if (!username) {
      return NextResponse.json({ success: false, reason: 'GitHub username not configured.' }, { status: 400 });
>>>>>>> c974e6d18f7e4d84cefd23b3ad822ac4cf9981fc
    }

    const result = await syncGitHubStats(username);

    if (result.success) {
<<<<<<< HEAD
      return NextResponse.json({ success: true, data: result.stats, publicOnly: !hasToken });
    } else {
      console.error('[GitHub Sync 500] GitHub API error:', result.error);
      return NextResponse.json({ success: false, error: 'GitHub API Error', details: result.error }, { status: 500 });
    }
  } catch (error) {
    console.error('[GitHub Sync 500] Unexpected error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
    return NextResponse.json({ success: false, error: 'Sync failed', details: errorMessage }, { status: 500 });
  }
}
=======
      return NextResponse.json({ success: true, data: result.stats });
    } else {
      return NextResponse.json({ success: false, reason: result.error }, { status: 500 });
    }
  } catch (error) {
    console.error('Error syncing GitHub stats:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
    return NextResponse.json({ success: false, reason: errorMessage }, { status: 500 });
  }
}
>>>>>>> c974e6d18f7e4d84cefd23b3ad822ac4cf9981fc
