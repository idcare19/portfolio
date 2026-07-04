import "server-only";

import { getPublicGitHubStats } from "@/lib/github-stats";
import { scoreFuzzy } from "@/lib/content-utils";
import { getPublishedBlogs } from "@/lib/portfolio/repository";
import { getSiteData } from "@/src/lib/site-data";

export type PublicCorpusEntry = {
  type: string;
  title: string;
  href: string;
  description: string;
  content: string;
  keywords: string[];
};

type PublicGitHubRepo = {
  name: string;
  url: string;
  description?: string;
  language?: string;
  topics?: string[];
};

type PublicGitHubCommit = {
  repoName: string;
  url: string;
  message: string;
};

type PublicGitHubActivity = {
  repoName: string;
  url: string;
  summary: string;
  type: string;
};

const STOP_WORDS = new Set([
  "a",
  "an",
  "and",
  "are",
  "does",
  "for",
  "from",
  "in",
  "is",
  "me",
  "of",
  "offer",
  "offers",
  "please",
  "show",
  "tell",
  "the",
  "their",
  "there",
  "to",
  "what",
  "which",
  "who",
]);

function tokenizeQuery(query: string) {
  return query
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .map((token) => token.trim())
    .map((token) => token.replace(/(ies|s)$/i, (suffix) => (suffix.toLowerCase() === "ies" ? "y" : "")))
    .filter((token) => token.length > 1 && !STOP_WORDS.has(token));
}

export async function buildPublicCorpus() {
  const siteData = await getSiteData();
  const githubStats =
    siteData.githubConfig?.enabled && siteData.githubConfig.username
      ? await getPublicGitHubStats(siteData.githubConfig.username).catch(() => null)
      : null;

  const entries: PublicCorpusEntry[] = [
    ...siteData.projectsDetailed.map((project) => ({
      type: "project",
      title: project.title,
      href: `/projects/${project.slug || project.id}`,
      description: project.shortDescription,
      content: [
        "project case study work build built",
        project.shortDescription,
        project.longDescription,
        project.problem,
        project.solution,
        project.myRole,
        ...(project.features || []),
        ...(project.responsibilities || []),
      ]
        .filter(Boolean)
        .join(" "),
      keywords: [...project.techStack, ...(project.tags || []), project.category],
    })),
    ...(await getPublishedBlogs()).map((blog) => ({
      type: "blog",
      title: blog.title,
      href: `/blogs/${blog.slug}`,
      description: blog.excerpt,
      content: ["blog article post writing", blog.excerpt, blog.content, blog.category, ...(blog.tags || [])].filter(Boolean).join(" "),
      keywords: [...blog.tags, blog.category],
    })),
    ...siteData.skillsDetailed.map((skill: any) => ({
      type: "skill",
      title: skill.title || skill.name,
      href: "#skills",
      description: skill.category,
      content: `${skill.title || skill.name} ${skill.category} ${skill.level}`,
      keywords: [skill.category, skill.title || skill.name],
    })),
    ...siteData.experience.map((item) => ({
      type: "experience",
      title: item.role,
      href: "#journey",
      description: item.summary,
      content: `experience role career journey ${item.role} ${item.period} ${item.summary}`,
      keywords: [item.period, item.role],
    })),
    ...siteData.services.map((service) => ({
      type: "service",
      title: service.title,
      href: "#services",
      description: service.description,
      content: `service services offer offering help ${service.title} ${service.description}`,
      keywords: [service.title, "service", "services"],
    })),
    ...siteData.testimonialsDetailed.map((item) => ({
      type: "testimonial",
      title: item.clientName,
      href: "#reviews",
      description: item.roleCompany,
      content: `${item.clientName} ${item.roleCompany} ${item.message}`,
      keywords: [item.clientName, item.roleCompany],
    })),
    ...siteData.socials.map((social) => ({
      type: "contact",
      title: social.label,
      href: social.href,
      description: social.value,
      content: `${social.label} ${social.value} ${social.href}`,
      keywords: [social.label, social.value],
    })),
    ...(siteData.owner.resumeUrl
      ? [
          {
            type: "resume",
            title: "Resume",
            href: "/resume",
            description: "Open or download the latest resume",
            content: `Resume ${siteData.owner.resumeUrl}`,
            keywords: ["resume", "cv", "download"],
          },
        ]
      : []),
  ];

  if (githubStats) {
    const latestRepos = githubStats.latestRepos as PublicGitHubRepo[];
    const latestCommits = githubStats.latestCommits as PublicGitHubCommit[];
    const recentActivity = githubStats.recentActivity as PublicGitHubActivity[];

    entries.push(
      ...latestRepos.map((repo) => ({
        type: "github-repo",
        title: repo.name,
        href: repo.url,
        description: repo.description || repo.language || "GitHub repository",
        content: [repo.description, repo.language, ...(repo.topics || [])].filter(Boolean).join(" "),
        keywords: [repo.language || "", ...(repo.topics || [])].filter(Boolean),
      })),
      ...latestCommits.map((commit) => ({
        type: "github-commit",
        title: commit.repoName,
        href: commit.url,
        description: commit.message,
        content: `${commit.repoName} ${commit.message}`,
        keywords: [commit.repoName],
      })),
      ...recentActivity.map((activity) => ({
        type: "github-activity",
        title: activity.repoName,
        href: activity.url,
        description: activity.summary,
        content: `${activity.repoName} ${activity.type} ${activity.summary}`,
        keywords: [activity.type, activity.repoName],
      }))
    );
  }

  return { siteData, githubStats, entries };
}

export function rankPublicCorpus(query: string, entries: PublicCorpusEntry[], limit = 8) {
  const normalizedQuery = query.trim();
  const tokens = tokenizeQuery(normalizedQuery);

  return entries
    .map((entry) => {
      const haystack = `${entry.type} ${entry.title} ${entry.description} ${entry.content} ${entry.keywords.join(" ")}`.toLowerCase();
      const exactScore = normalizedQuery ? scoreFuzzy(normalizedQuery, haystack) : 0;
      const tokenScore = tokens.reduce((total, token) => {
        if (haystack.includes(token)) {
          return total + (entry.title.toLowerCase().includes(token) ? 32 : 16);
        }
        return total;
      }, 0);

      return {
        ...entry,
        score: Math.max(exactScore, tokenScore),
      };
    })
    .filter((entry) => entry.score > 0)
    .sort((left, right) => right.score - left.score)
    .slice(0, limit);
}
