"use client";

import { useEffect, useState } from "react";
import { AnimatedSection } from "@/components/effects/AnimatedSection";
import { FadeInUp } from "@/components/effects/FadeInUp";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Star, GitFork, Code, ExternalLink, Calendar, Github, GitCommitHorizontal, Layers3, Activity } from "lucide-react";
import { useSectionData, useSiteDataContext } from "@/components/site/SiteDataProvider";
import { Badge } from "@/components/ui/Badge";
import type { GitHubStatsResponse } from "@/components/github/types";

export function GitHubDeveloperSection() {
  const section = useSectionData("github");
  const siteData = useSiteDataContext();
  const [stats, setStats] = useState<GitHubStatsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadStats() {
      if (!siteData.githubConfig?.enabled) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("/api/github/stats?refresh=true");
        const payload = (await response.json()) as { success?: boolean; data?: GitHubStatsResponse };
        if (!cancelled) setStats(payload.success && payload.data ? payload.data : null);
      } catch {
        if (!cancelled) setStats(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadStats();
    return () => {
      cancelled = true;
    };
  }, [siteData.githubConfig?.enabled]);

  if (!section.enabled || !siteData.githubConfig?.enabled) return null;

  const data = section.data as Record<string, string>;
  const title = data.title || "GitHub";
  const description = data.description || "Live repositories, commits, and activity from GitHub.";
  const eyebrow = data.eyebrow || "GitHub Live";
  const summary = data.summary || "";
  const hasHeader = Boolean(eyebrow || title || description);
  const topLanguages = stats?.languages.slice(0, 4) || [];
  const latestRepo = stats?.latestRepos?.[0];
  const latestCommit = stats?.latestCommits?.[0];
  const resolveRepoUrl = (repo: { url?: string; name?: string }) => {
    if (repo.url) return repo.url;
    if (repo.name && stats?.profile.login) return `https://github.com/${stats.profile.login}/${repo.name}`;
    return stats?.profile.profileUrl || "/github";
  };

  return (
    <AnimatedSection id="github" className="bg-page-bg py-20">
      <div className="container mx-auto px-4">
        {hasHeader ? (
          <FadeInUp>
            <SectionHeader title={title} description={description} eyebrow={eyebrow} />
          </FadeInUp>
        ) : null}

        {summary ? (
          <FadeInUp>
            <div className="mx-auto mt-5 max-w-3xl rounded-3xl border border-[rgb(var(--border))] bg-white/85 px-5 py-4 text-sm leading-6 text-text-muted shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
              {summary}
            </div>
          </FadeInUp>
        ) : null}

        {loading ? (
          <div className="mt-12 text-center">Loading GitHub stats...</div>
        ) : stats ? (
          <div className="mt-12 grid gap-8 lg:grid-cols-2">
            <div className="rounded-[30px] border border-[rgb(var(--border))] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,250,252,0.92))] p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
              <div className="mb-6 flex items-center gap-3">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-[#BFDBFE] bg-[#EFF6FF] text-[#1D4ED8]">
                  <Github className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-text-muted">GitHub Profile</p>
                  <h3 className="text-xl font-semibold text-text-main">@{stats.profile.login}</h3>
                </div>
                <a href={stats.profile.profileUrl} target="_blank" rel="noopener noreferrer" className="ml-auto inline-flex h-10 w-10 items-center justify-center rounded-full border border-[rgb(var(--border))] bg-white text-text-muted transition hover:-translate-y-0.5 hover:text-primary">
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
              <div className="mb-6 grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Code className="h-4 w-4 text-text-muted" />
                  <span className="text-sm text-text-main">{stats.totalRepositories} repos</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm text-text-main">{stats.stars} stars</span>
                </div>
                <div className="flex items-center gap-2">
                  <GitFork className="h-4 w-4 text-primary" />
                  <span className="text-sm text-text-main">{stats.forks} forks</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-text-muted" />
                  <span className="text-sm text-text-main">Synced recently</span>
                </div>
              </div>
              <div className="mb-6 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-[rgb(var(--border))] bg-white/85 p-4">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-text-muted">
                    <GitCommitHorizontal className="h-4 w-4" />
                    Commits
                  </div>
                  <p className="mt-2 text-xl font-semibold text-text-main">{stats.totalCommits}</p>
                  <p className="text-xs text-text-muted">{stats.publicCommits} public, {stats.privateCommits} private</p>
                </div>
                <div className="rounded-2xl border border-[rgb(var(--border))] bg-white/85 p-4">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-text-muted">
                    <Layers3 className="h-4 w-4" />
                    Repos
                  </div>
                  <p className="mt-2 text-xl font-semibold text-text-main">{stats.totalRepositories}</p>
                  <p className="text-xs text-text-muted">{stats.publicRepos} public, {stats.privateRepos} private</p>
                </div>
                <div className="rounded-2xl border border-[rgb(var(--border))] bg-white/85 p-4">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-text-muted">
                    <Activity className="h-4 w-4" />
                    Stars
                  </div>
                  <p className="mt-2 text-xl font-semibold text-text-main">{stats.stars}</p>
                  <p className="text-xs text-text-muted">{stats.forks} forks tracked</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {topLanguages.map((language) => (
                  <Badge key={language.name} className="bg-white/90">
                    {language.name}
                  </Badge>
                ))}
              </div>
              {latestCommit ? (
                <div className="mt-6 rounded-2xl border border-[rgb(var(--border))] bg-white/85 p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-text-muted">Latest commit</p>
                  <p className="mt-2 text-sm font-medium text-text-main">{latestCommit.repoName}</p>
                  <p className="mt-1 text-sm text-text-muted line-clamp-2">{latestCommit.message}</p>
                </div>
              ) : null}
            </div>
            <div className="rounded-[30px] border border-[rgb(var(--border))] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,250,252,0.92))] p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
              <div className="mb-6 flex items-center justify-between gap-3">
                <h3 className="text-xl font-semibold text-text-main">Latest Repositories</h3>
                <span className="rounded-full border border-[#BFDBFE] bg-[#EFF6FF] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#1D4ED8]">Public</span>
              </div>
              <div className="space-y-4">
                {stats.latestRepos.slice(0, 3).map((repo) => (
                  <a
                    key={repo.name}
                    href={resolveRepoUrl(repo)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block rounded-2xl border border-[rgb(var(--border))] bg-white/85 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:bg-white hover:shadow-[0_12px_24px_rgba(37,99,235,0.10)]"
                    aria-label={`Open repository ${repo.name} on GitHub`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-text-main transition-colors group-hover:text-primary">{repo.name}</h4>
                      </div>
                      <ExternalLink className="h-4 w-4 text-text-muted" aria-hidden="true" />
                    </div>
                    <div className="mt-3 flex items-center gap-4 text-xs text-text-muted">
                      <span className="flex items-center gap-1">
                        <Star className="h-3 w-3" /> {repo.stars}
                      </span>
                      <span className="flex items-center gap-1">
                        <GitFork className="h-3 w-3" /> {repo.forks}
                      </span>
                      <span>{repo.language}</span>
                    </div>
                  </a>
                ))}
              </div>
              {latestRepo ? (
                <div className="mt-6 rounded-2xl border border-dashed border-[rgb(var(--border))] bg-white/70 p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-text-muted">Latest repo update</p>
                  <p className="mt-2 text-sm font-medium text-text-main">{latestRepo.name}</p>
                </div>
              ) : null}
              <div className="mt-6">
                <a href="/github" className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(37,99,235,0.22)] transition hover:-translate-y-0.5 hover:bg-[#1D4ED8]">
                  See more on GitHub <ExternalLink className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-12 text-center text-muted-foreground">Unable to load GitHub statistics</div>
        )}
      </div>
    </AnimatedSection>
  );
}
