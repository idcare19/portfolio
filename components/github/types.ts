export type GitHubRepository = {
  name: string;
  fullName?: string;
  description: string;
  private?: boolean;
  stars: number;
  forks: number;
  language: string;
  url: string;
  updatedAt: string;
  commitCount?: number;
  publicCommitCount?: number;
  privateCommitCount?: number;
  pullRequestCount?: number;
  issueCount?: number;
  languages?: Record<string, number>;
  homepage?: string;
  topics?: string[];
  isPinned?: boolean;
};

export type GitHubActivityItem = {
  id?: string;
  type: string;
  repoName: string;
  createdAt: string;
  url: string;
  summary: string;
  isPrivate?: boolean;
};

export type GitHubCommitItem = {
  repoName: string;
  message: string;
  createdAt: string;
  url: string;
  isPrivate?: boolean;
};

export type GitHubStatsResponse = {
  profile: {
    login: string;
    name: string;
    avatarUrl: string;
    bio: string;
    company: string;
    location: string;
    blog: string;
    profileUrl: string;
    joinedAt?: string;
  };
  followers: number;
  following: number;
  stars: number;
  forks: number;
  publicRepos: number;
  privateRepos: number;
  publicCommits: number;
  privateCommits: number;
  totalCommits: number;
  privateIncluded?: boolean;
  showLifetimeCommits?: boolean;
  totalRepositories: number;
  pullRequests?: number;
  issues?: number;
  privateCommitCount?: number;
  languages: Array<{ name: string; value: number }>;
  organizations: Array<{ login?: string; avatarUrl?: string; url?: string }>;
  contributions: {
    total: number;
    weeks: number;
    heatmap: Array<{ date: string; count: number; level: number }>;
  };
  repositories?: GitHubRepository[];
  repositoryStats?: Array<{
    name: string;
    fullName: string;
    private: boolean;
    commitCount: number;
    publicCommitCount: number;
    privateCommitCount: number;
    selected: boolean;
    syncStatus: "success" | "failed";
    error?: string;
    archived?: boolean;
    fork?: boolean;
    updatedAt?: string;
  }>;
  latestRepos: GitHubRepository[];
  pinnedRepos: GitHubRepository[];
  recentActivity: GitHubActivityItem[];
  latestCommits: GitHubCommitItem[];
  achievements?: Array<{ title: string; description?: string; iconUrl?: string; url?: string }>;
  syncedAt: string;
  lastSyncError: string | null;
};
