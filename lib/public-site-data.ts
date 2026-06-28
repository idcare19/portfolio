import type { BlogItem, SiteData } from "@/src/types/site-data";
import { connectToDatabase } from "@/lib/mongodb";
import { GitHubStats } from "@/models/GitHubStats";

type PublicGitHubConfig = {
  username: string;
  enabled: boolean;
  refreshInterval: number;
  tokenExists: boolean;
  includePrivateRepos: boolean;
  showPrivateReposPublicly: boolean;
  showPrivateCommitsPublicly: boolean;
  publicDisplayMode: "publicOnly" | "aggregatePrivateOnly" | "includePrivateNames" | "includePrivateWithCommits";
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
          tokenExists: Boolean(siteData.githubConfig.token),
          includePrivateRepos: Boolean(siteData.githubConfig.includePrivateRepos),
          showPrivateReposPublicly: Boolean(siteData.githubConfig.showPrivateReposPublicly),
          showPrivateCommitsPublicly: Boolean(siteData.githubConfig.showPrivateCommitsPublicly),
          publicDisplayMode: siteData.githubConfig.publicDisplayMode || "publicOnly",
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
