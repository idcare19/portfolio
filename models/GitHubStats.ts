import { Schema, model, models } from "mongoose";

const RepositorySchema = new Schema({
  name: { type: String, required: true },
<<<<<<< HEAD
  fullName: String,
=======
>>>>>>> c974e6d18f7e4d84cefd23b3ad822ac4cf9981fc
  description: String,
  private: { type: Boolean, required: true },
  stars: { type: Number, required: true },
  forks: { type: Number, required: true },
  language: String,
  url: { type: String, required: true },
  updatedAt: { type: String, required: true },
  commitCount: Number,
<<<<<<< HEAD
  publicCommitCount: Number,
  privateCommitCount: Number,
  pullRequestCount: Number,
  issueCount: Number,
  languages: Object,
  homepage: String,
  topics: [String],
  isPinned: Boolean,
=======
  pullRequestCount: Number,
  issueCount: Number,
  languages: Object,
>>>>>>> c974e6d18f7e4d84cefd23b3ad822ac4cf9981fc
});

const CommitSchema = new Schema({
  repoName: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: String, required: true },
  url: { type: String, required: true },
  isPrivate: { type: Boolean, required: true },
});

const TotalsSchema = new Schema({
  totalRepos: { type: Number, required: true },
  publicRepos: { type: Number, required: true },
  privateRepos: { type: Number, required: true },
  totalStars: { type: Number, required: true },
  totalForks: { type: Number, required: true },
<<<<<<< HEAD
  publicCommits: Number,
  privateCommits: Number,
  totalCommits: Number,
  totalPullRequests: Number,
  totalIssues: Number,
  followers: Number,
  following: Number,
});

const ContributionDaySchema = new Schema(
  {
    date: { type: String, required: true },
    count: { type: Number, required: true },
    level: { type: Number, required: true },
  },
  { _id: false }
);

=======
  totalCommits: Number,
  totalPullRequests: Number,
  totalIssues: Number,
});

>>>>>>> c974e6d18f7e4d84cefd23b3ad822ac4cf9981fc
const GitHubStatsSchema = new Schema(
  {
    username: { type: String, required: true, unique: true, index: true },
    syncedAt: { type: String, required: true },
    totals: { type: TotalsSchema, required: true },
    repositories: [RepositorySchema],
<<<<<<< HEAD
    pinnedRepositories: [RepositorySchema],
    languages: Object,
    recentCommits: [CommitSchema],
    recentActivity: [Object],
    profile: Object,
    contributionCalendar: [ContributionDaySchema],
    contributionSummary: {
      totalContributions: Number,
      weeks: Number,
    },
    commitCountMode: String,
    repositorySelectionMode: String,
    selectedRepositories: [String],
    commitSelection: {
      includePrivateCommits: Boolean,
      repositoryMode: String,
      selectedRepositories: [String],
    },
=======
    languages: Object,
    recentCommits: [CommitSchema],
>>>>>>> c974e6d18f7e4d84cefd23b3ad822ac4cf9981fc
    activity: Object,
    privateSummary: Object,
    organizations: [Object],
    rateLimit: {
      remaining: Number,
      limit: Number,
      resetAt: String,
    },
    lastSyncError: String,
  },
  { timestamps: true, minimize: false }
);

<<<<<<< HEAD
export const GitHubStats = models.GitHubStats || model("GitHubStats", GitHubStatsSchema);
=======
export const GitHubStats = models.GitHubStats || model("GitHubStats", GitHubStatsSchema);
>>>>>>> c974e6d18f7e4d84cefd23b3ad822ac4cf9981fc
