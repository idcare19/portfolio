import type { BlogItem, SiteData } from "@/src/types/site-data";
import { connectToDatabase } from "@/lib/mongodb";
import { GitHubStats } from "@/models/GitHubStats";

type PublicGitHubConfig = {
  username: string;
  enabled: boolean;
  refreshInterval: number;
  useLiveGitHubAPI?: boolean;
  tokenExists: boolean;
  includePrivateRepos: boolean;
  showPrivateReposPublicly: boolean;
  showPrivateCommitsPublicly: boolean;
  publicDisplayMode: "publicOnly" | "aggregatePrivateOnly" | "includePrivateNames" | "includePrivateWithCommits";
  showProfileHeader?: boolean;
  showAvatar?: boolean;
  showBio?: boolean;
  showStats?: boolean;
  showLanguageBreakdown?: boolean;
  showContributionCalendar?: boolean;
  showInsights?: boolean;
  showActivityTimeline?: boolean;
  showRepositoryCards?: boolean;
  showPrivateRepos?: boolean;
  showPrivateCommits?: boolean;
  showCacheDebugDetails?: boolean;
  showViewGitHubButton?: boolean;
  showViewMoreButton?: boolean;
  showLiveDemoButton?: boolean;
  showViewRepositoryButton?: boolean;
  repositoryCardsLimit?: number;
  repositoryCardsSelectedRepositories?: string[];
  repositoryCardsHideArchived?: boolean;
  repositoryCardsHideForked?: boolean;
  repositoryCardsHidePrivate?: boolean;
  repositoryCardsSort?: "stars" | "updated" | "name" | "manual";
  repositoryCardsManualOrder?: string[];
  manualProfile?: {
    username?: string;
    avatarUrl?: string;
    bio?: string;
    profileUrl?: string;
    publicRepositories?: number;
    stars?: number;
    forks?: number;
    followers?: number;
    following?: number;
    totalCommits?: number;
    repositoryList?: Array<{ name?: string; description?: string; url?: string; homepage?: string; language?: string; stars?: number; forks?: number; topics?: string[] }>;
    pinnedRepositories?: Array<{ name?: string; description?: string; url?: string; homepage?: string; language?: string; stars?: number; forks?: number; topics?: string[] }>;
    buttons?: { viewGitHub?: string; viewMore?: string };
  };
  hasStats?: boolean;
};

export type PublicSiteData = Omit<SiteData, "contactMessages" | "githubConfig"> & {
  contactMessages: [];
  githubConfig?: PublicGitHubConfig;
};

function isPublishedBlog(blog: BlogItem) {
  return blog.status === "published" && blog.isEnabled;
}

export function toPublicSiteData(siteData: SiteData): PublicSiteData {
  const blogs = siteData.blogs.filter(isPublishedBlog);
  const sections = siteData.sections
    ? {
        ...siteData.sections,
        blogs: siteData.sections.blogs
          ? {
              ...siteData.sections.blogs,
              items: blogs,
            }
          : siteData.sections.blogs,
      }
    : siteData.sections;

  return {
    ...siteData,
    blogs,
    sections,
    contactMessages: [],
    githubConfig: siteData.githubConfig
      ? {
          username: siteData.githubConfig.username,
          enabled: siteData.githubConfig.enabled,
          refreshInterval: siteData.githubConfig.refreshInterval,
          useLiveGitHubAPI: siteData.githubConfig.useLiveGitHubAPI,
          tokenExists: Boolean(siteData.githubConfig.token),
          includePrivateRepos: Boolean(siteData.githubConfig.includePrivateRepos),
          showPrivateReposPublicly: Boolean(siteData.githubConfig.showPrivateReposPublicly),
          showPrivateCommitsPublicly: Boolean(siteData.githubConfig.showPrivateCommitsPublicly),
          publicDisplayMode: siteData.githubConfig.publicDisplayMode || "publicOnly",
          showProfileHeader: siteData.githubConfig.showProfileHeader,
          showAvatar: siteData.githubConfig.showAvatar,
          showBio: siteData.githubConfig.showBio,
          showStats: siteData.githubConfig.showStats,
          showLanguageBreakdown: siteData.githubConfig.showLanguageBreakdown,
          showContributionCalendar: siteData.githubConfig.showContributionCalendar,
          showInsights: siteData.githubConfig.showInsights,
          showActivityTimeline: siteData.githubConfig.showActivityTimeline,
          showRepositoryCards: siteData.githubConfig.showRepositoryCards,
          showPrivateRepos: siteData.githubConfig.showPrivateRepos,
          showPrivateCommits: siteData.githubConfig.showPrivateCommits,
          showCacheDebugDetails: siteData.githubConfig.showCacheDebugDetails,
          showViewGitHubButton: siteData.githubConfig.showViewGitHubButton,
          showViewMoreButton: siteData.githubConfig.showViewMoreButton,
          showLiveDemoButton: siteData.githubConfig.showLiveDemoButton,
          showViewRepositoryButton: siteData.githubConfig.showViewRepositoryButton,
          repositoryCardsLimit: siteData.githubConfig.repositoryCardsLimit,
          repositoryCardsSelectedRepositories: siteData.githubConfig.repositoryCardsSelectedRepositories,
          repositoryCardsHideArchived: siteData.githubConfig.repositoryCardsHideArchived,
          repositoryCardsHideForked: siteData.githubConfig.repositoryCardsHideForked,
          repositoryCardsHidePrivate: siteData.githubConfig.repositoryCardsHidePrivate,
          repositoryCardsSort: siteData.githubConfig.repositoryCardsSort,
          repositoryCardsManualOrder: siteData.githubConfig.repositoryCardsManualOrder,
          manualProfile: siteData.githubConfig.manualProfile,
        }
      : undefined,
  };
}

export async function toPublicSiteDataWithMeta(siteData: SiteData): Promise<PublicSiteData> {
  const publicData = toPublicSiteData(siteData);

  if (!publicData.githubConfig?.username || !publicData.githubConfig.enabled) {
    return publicData;
  }

  try {
    await connectToDatabase();
    const cached = await GitHubStats.exists({ username: publicData.githubConfig.username });
    return {
      ...publicData,
      githubConfig: {
        ...publicData.githubConfig,
        hasStats: Boolean(cached),
      },
    };
  } catch {
    return publicData;
  }
}
