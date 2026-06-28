"use client";

import { useEffect, useState } from "react";
import { AnimatedSection } from "@/components/effects/AnimatedSection";
import { FadeInUp } from "@/components/effects/FadeInUp";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { Star, GitFork, Code, ExternalLink, Calendar, Github } from "lucide-react";
import { useSectionData, useSiteDataContext } from "@/components/site/SiteDataProvider";
import { Badge } from "@/components/ui/Badge";
import type { GitHubStatsResponse } from "@/components/github/types";

interface GitHubRepo {
  name: string;
  description: string;
  stars: number;
  forks: number;
  language: string;
  url: string;
  updatedAt: string;
  private: boolean;
}

interface GitHubActivity {
  repoName: string;
  message: string;
  createdAt: string;
  url: string;
  isPrivate: boolean;
}

interface GitHubStats {
  username: string;
  latestPublicRepos: GitHubRepo[];
  recentPublicActivity: GitHubActivity[];
  totalRepos: number;
  publicRepos: number;
  privateRepos: number;
  totalStars: number;
  totalForks: number;
  topLanguages: Record<string, number>;
  syncedAt: string;
  profileUrl: string;
}

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
        const response = await fetch("/api/github/stats");
        const payload = (await response.json()) as { success?: boolean; data?: GitHubStatsResponse };
        if (!cancelled) {
          setStats(payload.success && payload.data ? payload.data : null);
        }
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

  if (!section.enabled || !siteData.githubConfig?.enabled) {
    return null;
  }

  const data = section.data as Record<string, string>;
  const title = data.title || "GitHub Activity";
  const description = data.description || "A clean preview of live GitHub activity and featured repositories.";
  const eyebrow = data.eyebrow || "GitHub";

  return (
    <AnimatedSection id="github" className="bg-page-bg py-20">
      <div className="container mx-auto px-4">
        <FadeInUp>
          <SectionHeader title={title} description={description} eyebrow={eyebrow} />
        </FadeInUp>

        {loading ? (
          <div className="mt-12 text-center">Loading GitHub stats...</div>
        ) : stats ? (
          <div className="mt-12 grid gap-8 lg:grid-cols-2">
            {/* Stats Overview */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <Github className="h-6 w-6" />
                <h3 className="text-xl font-semibold">@{stats.profile.login}</h3>
                <a href={stats.profile.profileUrl} target="_blank" rel="noopener noreferrer" className="ml-auto">
                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                </a>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <Code className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{stats.totalRepositories} repos</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm">{stats.stars} stars</span>
                </div>
                <div className="flex items-center gap-2">
                  <GitFork className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">{stats.forks} forks</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Synced recently</span>
                </div>
              </div>

              {/* Top Languages */}
              <div className="flex flex-wrap gap-2">
                {stats.languages.slice(0, 5).map((language) => (
                  <Badge key={language.name}>{language.name}</Badge>
                ))}
              </div>
            </div>

            {/* Latest Repos */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-6">Latest Repositories</h3>
              <div className="space-y-4">
                {stats.latestRepos.slice(0, 3).map((repo) => (
                  <a
                    key={repo.name}
                    href={repo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-lg border border-border p-4 transition-colors hover:bg-muted/50"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium">{repo.name}</h4>
                        <p className="text-sm text-muted-foreground line-clamp-1">{repo.description}</p>
                      </div>
                      <ExternalLink className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
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
            </div>
          </div>
        ) : (
          <div className="mt-12 text-center text-muted-foreground">Unable to load GitHub statistics</div>
        )}
      </div>
    </AnimatedSection>
  );
}
