"use client";
<<<<<<< HEAD

import { useEffect, useState } from "react";
import { AnimatedSection } from "@/components/effects/AnimatedSection";
import { FadeInUp } from "@/components/effects/FadeInUp";
import { GitHubPreviewCard } from "@/components/github/GitHubPreviewCard";
import type { GitHubStatsResponse } from "@/components/github/types";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { useSectionData, useSiteDataContext } from "@/components/site/SiteDataProvider";
=======
import { useEffect, useState } from "react";
import { AnimatedSection } from "@/components/effects/AnimatedSection";
import { FadeInUp } from "@/components/effects/FadeInUp";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { Star, GitFork, Code, ExternalLink, Calendar, Github } from "lucide-react";
import { useSectionData, useSiteDataContext } from "@/components/site/SiteDataProvider";
import { Badge } from "@/components/ui/Badge";

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
>>>>>>> c974e6d18f7e4d84cefd23b3ad822ac4cf9981fc

export function GitHubDeveloperSection() {
  const section = useSectionData("github");
  const siteData = useSiteDataContext();
<<<<<<< HEAD
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
      <div className="section-wrap space-y-8">
        <SectionHeader eyebrow={eyebrow} title={title} description={description} />

        {loading ? (
          <div className="glass grid gap-5 rounded-[32px] border border-[rgb(var(--border))] p-6 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="space-y-4">
              <div className="h-20 animate-pulse rounded-[24px] bg-[rgb(var(--card-hover))]" />
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="h-24 animate-pulse rounded-[24px] bg-[rgb(var(--card-hover))]" />
                ))}
              </div>
              <div className="h-48 animate-pulse rounded-[28px] bg-[rgb(var(--card-hover))]" />
            </div>
            <div className="space-y-4">
              <div className="h-56 animate-pulse rounded-[28px] bg-[rgb(var(--card-hover))]" />
              <div className="h-40 animate-pulse rounded-[28px] bg-[rgb(var(--card-hover))]" />
            </div>
          </div>
        ) : (
          <FadeInUp>
            <GitHubPreviewCard stats={stats} />
          </FadeInUp>
        )}
      </div>
    </AnimatedSection>
  );
}
=======
  const [stats, setStats] = useState<GitHubStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const githubConfig = siteData.githubConfig;

  useEffect(() => {
          console.log("GitHub Config:", githubConfig);
          if (githubConfig?.enabled) {
            fetch('/api/github/stats')
              .then(res => {
                console.log("API Response Status:", res.status);
                return res.json();
              })
              .then(data => {
                console.log("API Response Data:", data);
                if (data.success) {
                  setStats(data.data);
                  console.log("Stats set successfully:", data.data);
                } else {
                  setError(data.reason || "Failed to fetch GitHub stats.");
                  console.error("API Error:", data.reason);
                }
              })
              .catch((err) => {
                console.error("Fetch Error:", err);
                setError("Failed to fetch GitHub stats.");
              })
              .finally(() => setLoading(false));
          } else {
            console.log("GitHub config not enabled:", githubConfig);
            setLoading(false);
          }
        }, [githubConfig?.enabled]);

  if (!section || !section.enabled || !githubConfig?.enabled) {
    return null;
  }

  const title = section.textBlocks?.find(b => b.key === 'title')?.value || "GitHub Activity";
  const subtitle = section.textBlocks?.find(b => b.key === 'subtitle')?.value || "Live developer activity from GitHub";

  return (
    <AnimatedSection id="github" className="py-24 sm:py-32">
      <FadeInUp>
        <div className="container mx-auto px-4">
          <SectionHeader
            eyebrow="GitHub"
            title={title}
            description={subtitle}
            className="mb-16"
          />
          
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="rounded-xl border border-border p-6 animate-pulse">
                  <div className="h-6 w-3/4 bg-muted mb-3 rounded"></div>
                  <div className="h-4 w-full bg-muted mb-2 rounded"></div>
                  <div className="h-4 w-2/3 bg-muted mb-4 rounded"></div>
                  <div className="flex gap-4">
                    <div className="h-4 w-12 bg-muted rounded"></div>
                    <div className="h-4 w-12 bg-muted rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <p className="text-red-500 font-semibold text-lg">Error: {error}</p>
              <p className="text-sm text-muted-foreground mt-2">GitHub data not loaded yet. Click refresh in admin.</p>
            </div>
          )}

          {!loading && !error && !stats && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">GitHub data not loaded yet. Sync from admin.</p>
            </div>
          )}

          {stats && (
            <div className="space-y-12">
              {/* Profile Overview */}
              <div className="flex flex-col md:flex-row items-center gap-6 p-8 rounded-2xl border border-border bg-card">
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-2xl font-bold flex items-center justify-center md:justify-start gap-2">
                    <Github className="h-6 w-6" />
                    {stats.username}
                  </h3>
                  <p className="text-muted-foreground mt-1">Last synced: {new Date(stats.syncedAt).toLocaleString()}</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                    <div className="p-4 bg-secondary/20 rounded-lg">
                      <p className="text-2xl font-bold">{stats.totalRepos}</p>
                      <p className="text-xs text-muted-foreground">Total Repos</p>
                    </div>
                    <div className="p-4 bg-green-500/10 rounded-lg">
                      <p className="text-2xl font-bold text-green-500">{stats.publicRepos}</p>
                      <p className="text-xs text-muted-foreground">Public</p>
                    </div>
                    <div className="p-4 bg-blue-500/10 rounded-lg">
                      <p className="text-2xl font-bold text-blue-500">{stats.privateRepos}</p>
                      <p className="text-xs text-muted-foreground">Private</p>
                    </div>
                    <div className="p-4 bg-yellow-500/10 rounded-lg">
                      <p className="text-2xl font-bold text-yellow-500">{stats.totalStars}</p>
                      <p className="text-xs text-muted-foreground">Stars</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-4">
                    <Badge className="flex items-center gap-1 bg-secondary text-secondary-foreground">
                      <Star className="h-3.5 w-3.5" /> {stats.totalStars} stars
                    </Badge>
                    <Badge className="flex items-center gap-1 bg-secondary text-secondary-foreground">
                      <GitFork className="h-3.5 w-3.5" /> {stats.totalForks} forks
                    </Badge>
                     {Object.entries(stats.topLanguages).slice(0, 3).map(([lang, count]) => (
                      <Badge key={lang} className="flex items-center gap-1 border border-border">
                        <Code className="h-3.5 w-3.5" /> {lang}
                      </Badge>
                    ))}
                  </div>
                </div>
                <a 
                  href={stats.profileUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex"
                >
                  <Button>
                    View Profile <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </a>
              </div>

              {/* Latest Repositories */}
              <div>
                <h4 className="text-xl font-semibold mb-6">Latest Repositories</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {stats.latestPublicRepos?.slice(0, 6).map((repo) => (
                    <a
                      key={repo.name}
                      href={repo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-xl border border-border p-6 hover:border-primary/50 transition-colors group"
                    >
                      <h5 className="font-semibold text-lg group-hover:text-primary transition-colors">{repo.name}</h5>
                      <p className="text-muted-foreground text-sm mt-2 line-clamp-2">{repo.description || "No description"}</p>
                      <div className="flex flex-wrap items-center gap-4 mt-4">
                        {repo.language && (
                          <span className="text-xs flex items-center gap-1">
                            <Code className="h-3.5 w-3.5" /> {repo.language}
                          </span>
                        )}
                        <span className="text-xs flex items-center gap-1">
                          <Star className="h-3.5 w-3.5" /> {repo.stars}
                        </span>
                        <span className="text-xs flex items-center gap-1">
                          <GitFork className="h-3.5 w-3.5" /> {repo.forks}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 mt-3 text-xs text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" />
                        Updated {new Date(repo.updatedAt).toLocaleDateString()}
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              {stats.recentPublicActivity?.length > 0 && (
                <div>
                  <h4 className="text-xl font-semibold mb-6">Recent Activity</h4>
                  <div className="space-y-4">
                    {stats.recentPublicActivity.slice(0, 5).map((act, i) => (
                      <div key={i} className="flex items-start gap-4 p-4 rounded-xl border border-border">
                        <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                        <div>
                          <p className="font-medium">{act.message}</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {act.repoName} • {new Date(act.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </FadeInUp>
    </AnimatedSection>
  );
}
>>>>>>> c974e6d18f7e4d84cefd23b3ad822ac4cf9981fc
