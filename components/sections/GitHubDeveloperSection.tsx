"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatedSection } from "@/components/effects/AnimatedSection";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useSectionData, useSiteDataContext } from "@/components/site/SiteDataProvider";
import type { GitHubRepository, GitHubStatsResponse } from "@/components/github/types";
import { ExternalLink, GitBranch, Sparkles, Star } from "lucide-react";

function formatDate(value?: string, options?: Intl.DateTimeFormatOptions) {
  if (!value) return "--";
  return new Date(value).toLocaleDateString("en-US", { timeZone: "UTC", ...options });
}

function formatDateTime(value?: string) {
  if (!value) return "--";
  return new Date(value).toLocaleString("en-US", { timeZone: "UTC" });
}

function safeArray<T>(value: T[] | undefined | null): T[] {
  return Array.isArray(value) ? value : [];
}

function resolveRepoHref(repo: GitHubRepository, profileUrl?: string) {
  return repo.url || (repo.fullName ? `https://github.com/${repo.fullName}` : profileUrl || "#");
}

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178C6",
  JavaScript: "#F7DF1E",
  Python: "#3776AB",
  PHP: "#777BB4",
  HTML: "#E34F26",
  CSS: "#1572B6",
  Go: "#00ADD8",
  Rust: "#DEA584",
  Java: "#007396",
  "C++": "#00599C",
};

function getLanguageColor(language?: string) {
  if (!language) return "#94A3B8";
  return LANGUAGE_COLORS[language] || "#64748B";
}

function isPresent(value: unknown) {
  return value !== null && value !== undefined && value !== "";
}

function formatCount(value: unknown) {
  return isPresent(value) ? String(value) : "--";
}

function ProfileSkeleton() {
  return (
    <div className="rounded-[32px] border border-[rgb(var(--border))] bg-white/90 p-6 shadow-[0_20px_55px_rgba(15,23,42,0.05)]">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
        <div className="h-24 w-24 animate-pulse rounded-[28px] bg-slate-200" />
        <div className="min-w-0 flex-1 space-y-3">
          <div className="h-8 w-56 animate-pulse rounded-full bg-slate-200" />
          <div className="h-5 w-40 animate-pulse rounded-full bg-slate-200" />
          <div className="h-4 w-full max-w-2xl animate-pulse rounded-full bg-slate-200" />
          <div className="h-4 w-5/6 animate-pulse rounded-full bg-slate-200" />
        </div>
      </div>
    </div>
  );
}

function StatSkeleton() {
  return (
    <div className="rounded-[24px] border border-[rgb(var(--border))] bg-white/90 p-4 shadow-[0_14px_30px_rgba(15,23,42,0.05)]">
      <div className="h-3 w-24 animate-pulse rounded-full bg-slate-200" />
      <div className="mt-4 h-8 w-20 animate-pulse rounded-full bg-slate-200" />
      <div className="mt-3 h-3 w-28 animate-pulse rounded-full bg-slate-200" />
    </div>
  );
}

function RepoSkeleton() {
  return (
    <article className="flex h-full flex-col rounded-[28px] border border-[rgb(var(--border))] bg-white/90 p-5 shadow-[0_14px_30px_rgba(15,23,42,0.05)]">
      <div className="h-5 w-3/4 animate-pulse rounded-full bg-slate-200" />
      <div className="mt-3 h-4 w-full animate-pulse rounded-full bg-slate-200" />
      <div className="mt-2 h-4 w-5/6 animate-pulse rounded-full bg-slate-200" />
      <div className="mt-auto pt-6 space-y-3">
        <div className="flex gap-2">
          <div className="h-6 w-20 animate-pulse rounded-full bg-slate-200" />
          <div className="h-6 w-16 animate-pulse rounded-full bg-slate-200" />
        </div>
        <div className="flex gap-3">
          <div className="h-10 w-32 animate-pulse rounded-full bg-slate-200" />
          <div className="h-10 w-28 animate-pulse rounded-full bg-slate-200" />
        </div>
      </div>
    </article>
  );
}

function StatTile({ label, value, helper }: { label: string; value: string; helper?: string }) {
  return (
    <div className="rounded-[24px] border border-[rgb(var(--border))] bg-white/95 p-4 shadow-[0_14px_30px_rgba(15,23,42,0.05)]">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-text-muted">{label}</p>
      <p className="mt-3 text-2xl font-semibold tracking-tight text-text-main">{value}</p>
      {helper ? <p className="mt-2 text-sm text-text-muted">{helper}</p> : null}
    </div>
  );
}

export function GitHubDeveloperSection() {
  const section = useSectionData("github");
  const siteData = useSiteDataContext();
  const [stats, setStats] = useState<GitHubStatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const config = (siteData.githubConfig || {}) as Record<string, any>;
  const useLiveGitHubAPI = config.useLiveGitHubAPI !== false;
  const manualProfile = config.manualProfile || {};

  useEffect(() => {
    let cancelled = false;

    async function loadStats() {
      if (!useLiveGitHubAPI) {
        setLoading(false);
        setStats(null);
        setError(null);
        return;
      }

      if (!config.enabled || !config.username) {
        setLoading(false);
        setStats(null);
        setError("GitHub data is temporarily unavailable.");
        return;
      }

      setLoading(true);
      try {
        const response = await fetch("/api/github/stats?refresh=true", { cache: "no-store" });
        const payload = (await response.json()) as { success?: boolean; data?: GitHubStatsResponse; reason?: string };
        if (cancelled) return;
        if (payload.success && payload.data) {
          setStats(payload.data);
          setError(null);
        } else {
          setStats(null);
          setError(payload.reason || "GitHub data is temporarily unavailable.");
        }
      } catch {
        if (!cancelled) {
          setStats(null);
          setError("GitHub data is temporarily unavailable.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadStats();
    return () => {
      cancelled = true;
    };
  }, [config.enabled, config.username, useLiveGitHubAPI]);

  if (!section.enabled || !config.enabled) return null;

  const data = section.data as Record<string, string>;
  const title = data.title || "GitHub";
  const description = data.description || "A curated developer profile powered by GitHub data.";
  const eyebrow = data.eyebrow || "GitHub";
  const summary = data.summary || "";
  const profile = useLiveGitHubAPI ? stats?.profile : undefined;
  const liveRepositories = safeArray(stats?.repositories as GitHubRepository[]).length ? (stats?.repositories as GitHubRepository[]) : safeArray(stats?.latestRepos);
  const manualRepositories = safeArray((manualProfile.repositoryList as GitHubRepository[]) || []);
  const repositories = useLiveGitHubAPI ? liveRepositories : manualRepositories;
  const visibleRepositories = repositories.slice(0, Math.max(1, Number(config.repositoryCardsLimit || 3)));
  const languages = safeArray(stats?.languages);
  const contributions = stats?.contributions || { total: 0, weeks: 0, heatmap: [] };
  const selectedRepoKeys = new Set(
    [...(Array.isArray(config.repositoryCardsSelectedRepositories) ? config.repositoryCardsSelectedRepositories : []), ...(Array.isArray(config.selectedRepositories) ? config.selectedRepositories : [])]
      .map((value: string) => String(value || "").trim().toLowerCase())
      .filter(Boolean)
  );
  const manualOrder = Array.isArray(config.repositoryCardsManualOrder) ? config.repositoryCardsManualOrder : [];

  const filteredRepos = useMemo(() => {
    const base = [...repositories].filter((repo) => {
      if (config.showPrivateRepos === false && repo.private) return false;
      if (config.repositoryCardsHidePrivate && repo.private) return false;
      if (config.repositoryCardsHideArchived && (repo as any).archived) return false;
      if (config.repositoryCardsHideForked && (repo as any).fork) return false;
      if (selectedRepoKeys.size > 0 || config.repositorySelectionMode === "selected") {
        return selectedRepoKeys.has(String(repo.fullName || repo.name || "").toLowerCase());
      }
      return true;
    });

    switch (config.repositoryCardsSort) {
      case "updated":
        return base.sort((left, right) => new Date(right.updatedAt || 0).getTime() - new Date(left.updatedAt || 0).getTime());
      case "name":
        return base.sort((left, right) => String(left.name || "").localeCompare(String(right.name || "")));
      case "manual": {
        const order = new Map(manualOrder.map((key: string, index: number) => [String(key).toLowerCase(), index] as const));
        return base.sort(
          (left, right) =>
            (order.get(String(left.fullName || left.name).toLowerCase()) ?? 999) -
            (order.get(String(right.fullName || right.name).toLowerCase()) ?? 999)
        );
      }
      default:
        return base.sort((left, right) => (right.stars || 0) - (left.stars || 0));
    }
  }, [config.repositoryCardsHideArchived, config.repositoryCardsHideForked, config.repositoryCardsHidePrivate, config.repositoryCardsSort, config.repositorySelectionMode, config.showPrivateRepos, manualOrder, repositories, selectedRepoKeys]);

  const topLanguage = languages[0]?.name || "";
  const largestRepository = useMemo(
    () => [...repositories].sort((left, right) => (right.stars || 0) - (left.stars || 0) || (right.forks || 0) - (left.forks || 0) || new Date(right.updatedAt || 0).getTime() - new Date(left.updatedAt || 0).getTime())[0],
    [repositories]
  );

  const displayName = useLiveGitHubAPI ? profile?.name || profile?.login || config.username : manualProfile.username || config.username || "";
  const displayHandle = useLiveGitHubAPI ? profile?.login || config.username : manualProfile.username || config.username || "";
  const displayAvatar = useLiveGitHubAPI ? profile?.avatarUrl || "" : manualProfile.avatarUrl || "";
  const displayBio = useLiveGitHubAPI ? profile?.bio || "" : manualProfile.bio || "";
  const displayProfileUrl = useLiveGitHubAPI ? profile?.profileUrl || `https://github.com/${config.username || displayHandle}` : manualProfile.profileUrl || `https://github.com/${displayHandle}`;
  const showStats = config.showStats !== false;
  const showContributionCalendar = config.showContributionCalendar === true;
  const showRepositoryCards = config.showRepositoryCards !== false;
  const showViewRepositoryButton = config.showViewRepositoryButton !== false;
  const showLiveDemoButton = config.showLiveDemoButton !== false;
  const showViewMoreButton = config.showViewMoreButton !== false;

  const statCards = [
    { label: "Repositories", value: useLiveGitHubAPI ? stats?.totalRepositories ?? stats?.publicRepos : manualProfile.publicRepositories },
    { label: "Followers", value: useLiveGitHubAPI ? stats?.followers : manualProfile.followers },
    { label: "Following", value: useLiveGitHubAPI ? stats?.following : manualProfile.following },
    { label: "Stars", value: useLiveGitHubAPI ? stats?.stars : manualProfile.stars },
    { label: "Forks", value: useLiveGitHubAPI ? stats?.forks : manualProfile.forks },
  ].filter((item) => item.value !== null && item.value !== undefined);

  const repoCountLabel = filteredRepos.length > visibleRepositories.length ? `${visibleRepositories.length} of ${filteredRepos.length}` : `${visibleRepositories.length}`;

  if (error && !loading) {
    return (
      <AnimatedSection id="github" className="bg-page-bg py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-xl rounded-[28px] border border-[rgb(var(--border))] bg-white/90 p-6 text-center shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
            <p className="text-lg font-semibold text-text-main">GitHub data is temporarily unavailable.</p>
            <div className="mt-5 flex justify-center">
              <Button href={displayProfileUrl} target="_blank" variant="secondary">
                View GitHub Profile
              </Button>
            </div>
          </div>
        </div>
      </AnimatedSection>
    );
  }

  return (
    <AnimatedSection id="github" className="bg-page-bg py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-6xl">
          <SectionHeader title={title} description={description} eyebrow={eyebrow} />
          {summary ? <p className="mx-auto mt-4 max-w-4xl text-center text-sm leading-7 text-text-muted">{summary}</p> : null}
        </div>

        <div className="mt-12 space-y-8">
          <section className="rounded-[34px] border border-[rgb(var(--border))] bg-white/90 p-6 shadow-[0_20px_55px_rgba(15,23,42,0.05)] lg:p-8">
            <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="space-y-6">
                {loading ? (
                  <ProfileSkeleton />
                ) : (
                  <>
                    {displayName ? (
                      <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                        {displayAvatar && (
                          <img
                            src={displayAvatar}
                            alt={displayHandle ? `Avatar for ${displayHandle}` : "GitHub avatar"}
                            className="h-24 w-24 rounded-[28px] border border-[rgb(var(--border))] object-cover shadow-[0_18px_45px_rgba(15,23,42,0.12)]"
                          />
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-3">
                            <h3 className="text-3xl font-semibold tracking-tight text-text-main">{displayName}</h3>
                            {displayHandle && displayHandle !== displayName ? <Badge className="bg-[#EFF6FF] text-[#1D4ED8]">@{displayHandle.replace(/^@/, "")}</Badge> : null}
                          </div>
                          {displayBio ? <p className="mt-3 max-w-2xl text-sm leading-7 text-text-muted sm:text-base">{displayBio}</p> : null}
                          <div className="mt-5 flex flex-wrap gap-3">
                            <Button href={displayProfileUrl || "/github"} target="_blank">
                              View GitHub
                              <ExternalLink className="ml-2 h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </>
                )}

                {showStats ? (
                  loading ? (
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                      {Array.from({ length: 5 }).map((_, index) => <StatSkeleton key={index} />)}
                    </div>
                  ) : statCards.length > 0 ? (
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                      {statCards.map((stat) => (
                        <StatTile key={stat.label} label={stat.label} value={formatCount(stat.value)} helper={isPresent(stat.value) ? undefined : "--"} />
                      ))}
                    </div>
                  ) : null
                ) : null}
              </div>

              <div className="space-y-4">
                {useLiveGitHubAPI && showContributionCalendar ? (
                  <div className="rounded-[28px] border border-[rgb(var(--border))] bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(248,250,252,0.95))] p-5">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-text-main">Contribution Calendar</p>
                        <p className="text-sm text-text-muted">{contributions.total} contributions</p>
                      </div>
                      <Badge>{contributions.total}</Badge>
                    </div>
                    <div className="mt-4 overflow-hidden rounded-2xl">
                      <div className="grid grid-cols-7 gap-2">
                        {safeArray(contributions.heatmap).map((day) => (
                          <div
                            key={day.date}
                            title={`${day.date}: ${day.count} contributions`}
                            className={`aspect-square rounded-xl border border-white/60 ${
                              day.level === 0 ? "bg-slate-100" : day.level === 1 ? "bg-emerald-100" : day.level === 2 ? "bg-emerald-300" : day.level === 3 ? "bg-emerald-500" : "bg-emerald-700"
                            } shadow-sm`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                ) : null}

                {useLiveGitHubAPI && config.showInsights ? (
                  <div className="rounded-[28px] border border-[rgb(var(--border))] bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(248,250,252,0.95))] p-5">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-text-main">GitHub Insights</p>
                        <p className="text-sm text-text-muted">Top repository signals</p>
                      </div>
                      <Sparkles className="h-4 w-4 text-amber-500" />
                    </div>
                    <div className="mt-4 space-y-3">
                      <div className="rounded-2xl bg-white p-4">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-text-muted">Most Used Language</p>
                        <p className="mt-2 text-base font-semibold text-text-main">{topLanguage || "--"}</p>
                      </div>
                      <div className="rounded-2xl bg-white p-4">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-text-muted">Largest Repository</p>
                        <p className="mt-2 text-base font-semibold text-text-main">{largestRepository?.name || "--"}</p>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </section>

          {showRepositoryCards ? (
            <section className="rounded-[34px] border border-[rgb(var(--border))] bg-white/90 p-6 shadow-[0_20px_55px_rgba(15,23,42,0.05)]">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-text-main">Repositories</p>
                  <p className="text-sm text-text-muted">Selected repositories with clean, premium cards</p>
                </div>
                <Badge>{repoCountLabel} shown</Badge>
              </div>

              {loading ? (
                <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {Array.from({ length: Math.max(1, Number(config.repositoryCardsLimit || 3)) }).map((_, index) => (
                    <RepoSkeleton key={index} />
                  ))}
                </div>
              ) : filteredRepos.length > 0 ? (
                <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {visibleRepositories.map((repo) => (
                    <article
                      key={repo.fullName || repo.name}
                      className="group flex h-full flex-col rounded-[28px] border border-[rgb(var(--border))] bg-[rgb(var(--page-bg))] p-5 shadow-[0_14px_30px_rgba(15,23,42,0.05)] transition-all duration-200 hover:-translate-y-1 hover:border-[rgb(var(--accent))] hover:shadow-[0_24px_50px_rgba(15,23,42,0.12)]"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-lg font-semibold tracking-tight text-text-main">{repo.name || "--"}</p>
                          <p className="mt-1 text-xs uppercase tracking-[0.18em] text-text-muted">{repo.private ? "Private" : "Public"}</p>
                        </div>
                        <ExternalLink className="h-4 w-4 text-text-muted opacity-70 transition group-hover:opacity-100" />
                      </div>

                      {repo.description ? <p className="mt-3 line-clamp-3 text-sm leading-6 text-text-muted">{repo.description}</p> : null}

                      <div className="mt-4 flex flex-wrap gap-2">
                        {repo.language ? (
                          <Badge className="gap-2">
                            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: getLanguageColor(repo.language) }} />
                            {repo.language}
                          </Badge>
                        ) : null}
                        {isPresent(repo.stars) ? (
                          <Badge>
                            <Star className="mr-1 h-3 w-3" />
                            {repo.stars}
                          </Badge>
                        ) : null}
                        {isPresent(repo.forks) ? (
                          <Badge>
                            <GitBranch className="mr-1 h-3 w-3" />
                            {repo.forks}
                          </Badge>
                        ) : null}
                      </div>

                      {repo.topics?.length ? (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {repo.topics.slice(0, 3).map((topic) => (
                            <Badge key={topic} className="bg-white">
                              {topic}
                            </Badge>
                          ))}
                        </div>
                      ) : null}

                      <div className="mt-auto pt-5">
                        <p className="text-xs text-text-muted">Updated {formatDate(repo.updatedAt, { month: "short", day: "numeric", year: "numeric" })}</p>
                        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                          {showViewRepositoryButton ? (
                            <Button href={resolveRepoHref(repo, displayProfileUrl)} target="_blank" className="w-full sm:w-auto">
                              View Repository
                            </Button>
                          ) : null}
                          {showLiveDemoButton && repo.homepage ? (
                            <Button href={repo.homepage} target="_blank" variant="secondary" className="w-full sm:w-auto">
                              Live Demo
                            </Button>
                          ) : null}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="mt-6 rounded-[24px] border border-dashed border-[rgb(var(--border))] bg-[rgb(var(--page-bg))] p-5 text-sm text-text-muted">
                  GitHub data is temporarily unavailable.
                </div>
              )}

              {showViewMoreButton && filteredRepos.length > visibleRepositories.length ? (
                <div className="mt-6 flex justify-center">
                  <Button href="/github" variant="secondary" className="w-full max-w-sm sm:w-auto">
                    View More Repositories
                  </Button>
                </div>
              ) : null}
            </section>
          ) : null}

          {config.showCacheDebugDetails ? (
            <section className="rounded-[28px] border border-dashed border-[rgb(var(--border))] bg-white/85 p-5 text-sm text-text-muted">
              Last sync: {formatDateTime(stats?.syncedAt)}
            </section>
          ) : null}
        </div>
      </div>
    </AnimatedSection>
  );
}
