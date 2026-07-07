"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatedSection } from "@/components/effects/AnimatedSection";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useSectionData, useSiteDataContext } from "@/components/site/SiteDataProvider";
import type { GitHubRepository, GitHubStatsResponse } from "@/components/github/types";
import {
  ExternalLink,
  GitBranch,
  Sparkles,
  Star,
} from "lucide-react";

function formatDate(value?: string, options?: Intl.DateTimeFormatOptions) {
  if (!value) return "Not synced yet";
  return new Date(value).toLocaleDateString("en-US", { timeZone: "UTC", ...options });
}

function formatDateTime(value?: string) {
  if (!value) return "Not synced yet";
  return new Date(value).toLocaleString("en-US", { timeZone: "UTC" });
}

function safeArray<T>(value: T[] | undefined | null): T[] {
  return Array.isArray(value) ? value : [];
}

function resolveRepoHref(repo: GitHubRepository, profileUrl?: string) {
  return repo.url || (repo.fullName ? `https://github.com/${repo.fullName}` : profileUrl || "#");
}

function Heatmap({ values }: { values: Array<{ date: string; count: number; level: number }> }) {
  return (
    <div className="grid grid-cols-7 gap-2">
      {values.map((day) => (
        <div key={day.date} title={`${day.date}: ${day.count} contributions`} className={`aspect-square rounded-xl border border-white/60 ${day.level === 0 ? "bg-slate-100" : day.level === 1 ? "bg-emerald-100" : day.level === 2 ? "bg-emerald-300" : day.level === 3 ? "bg-emerald-500" : "bg-emerald-700"} shadow-sm`} />
      ))}
    </div>
  );
}

function StatTile({ label, value, helper }: { label: string; value: string | number; helper?: string }) {
  return (
    <div className="rounded-[24px] border border-[rgb(var(--border))] bg-white/90 p-4 shadow-[0_14px_30px_rgba(15,23,42,0.05)]">
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
          setError(payload.reason || "GitHub data is not available yet.");
        }
      } catch (err) {
        if (!cancelled) {
          setStats(null);
          setError(err instanceof Error ? err.message : "Unable to load GitHub data.");
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
  const eyebrow = data.eyebrow || "GitHub Live";
  const summary = data.summary || "";
  const profile = useLiveGitHubAPI ? stats?.profile : undefined;
  const liveRepositories = safeArray(stats?.repositories as GitHubRepository[]).length ? (stats?.repositories as GitHubRepository[]) : safeArray(stats?.latestRepos);
  const manualRepositories = safeArray((manualProfile.repositoryList as GitHubRepository[]) || []);
  const repositories = useLiveGitHubAPI ? liveRepositories : manualRepositories;
  const languages = safeArray(stats?.languages);
  const contributions = stats?.contributions || { total: 0, weeks: 0, heatmap: [] };
  const homepageRepoLimit = Math.max(1, Number(config.repositoryCardsLimit || 3));
  const selectedRepoKeys = new Set([...(Array.isArray(config.repositoryCardsSelectedRepositories) ? config.repositoryCardsSelectedRepositories : []), ...(Array.isArray(config.selectedRepositories) ? config.selectedRepositories : [])].map((value: string) => String(value || "").trim().toLowerCase()).filter(Boolean));
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
        return base.sort((left, right) => String(left.name).localeCompare(String(right.name)));
      case "manual": {
        const order = new Map(manualOrder.map((key: string, index: number) => [String(key).toLowerCase(), index] as const));
        return base.sort((left, right) => (order.get(String(left.fullName || left.name).toLowerCase()) ?? 999) - (order.get(String(right.fullName || right.name).toLowerCase()) ?? 999));
      }
      default:
        return base.sort((left, right) => (right.stars || 0) - (left.stars || 0));
    }
  }, [config.repositoryCardsHideArchived, config.repositoryCardsHideForked, config.repositoryCardsHidePrivate, config.repositoryCardsSort, config.repositorySelectionMode, config.showPrivateRepos, manualOrder, repositories, selectedRepoKeys]);
  const visibleRepos = filteredRepos.slice(0, homepageRepoLimit);
  const topLanguage = languages[0]?.name || "N/A";
  const largestRepository = useMemo(() => {
    return [...repositories].sort((left, right) => (right.stars || 0) - (left.stars || 0) || (right.forks || 0) - (left.forks || 0) || new Date(right.updatedAt || 0).getTime() - new Date(left.updatedAt || 0).getTime())[0];
  }, [repositories]);
  const mostStarred = useMemo(() => {
    return [...repositories].sort((left, right) => (right.stars || 0) - (left.stars || 0))[0];
  }, [repositories]);
  const recentlyUpdated = useMemo(() => {
    return [...repositories].sort((left, right) => new Date(right.updatedAt || 0).getTime() - new Date(left.updatedAt || 0).getTime())[0];
  }, [repositories]);
  const showProfileHeader = config.showProfileHeader !== false;
  const showAvatar = config.showAvatar !== false;
  const showBio = config.showBio !== false;
  const showStats = config.showStats !== false;
  const showLanguageBreakdown = config.showLanguageBreakdown === true;
  const showContributionCalendar = config.showContributionCalendar === true;
  const showInsights = config.showInsights === true;
  const showActivityTimeline = config.showActivityTimeline === true;
  const showRepositoryCards = config.showRepositoryCards !== false;
  const showCacheDebugDetails = config.showCacheDebugDetails === true;
  const showViewGitHubButton = config.showViewGitHubButton !== false;
  const showViewMoreButton = config.showViewMoreButton !== false;
  const showLiveDemoButton = config.showLiveDemoButton !== false;
  const showViewRepositoryButton = config.showViewRepositoryButton !== false;
  const safeNumber = (value: unknown) => (typeof value === "number" && Number.isFinite(value) ? value : 0);
  const displayUsername = String(useLiveGitHubAPI ? profile?.login || config.username : manualProfile.username || config.username || "GitHub");
  const displayAvatar = String(useLiveGitHubAPI ? profile?.avatarUrl || "" : manualProfile.avatarUrl || "");
  const displayBio = String(useLiveGitHubAPI ? profile?.bio || "" : manualProfile.bio || "");
  const displayProfileUrl = String(useLiveGitHubAPI ? profile?.profileUrl || `https://github.com/${config.username || displayUsername}` : manualProfile.profileUrl || `https://github.com/${displayUsername}`);
  const displayStats = [
    { label: "Repositories", value: safeNumber(useLiveGitHubAPI ? stats?.totalRepositories ?? stats?.publicRepos : manualProfile.publicRepositories), helper: useLiveGitHubAPI ? `${safeNumber(stats?.publicRepos)} public repositories` : "CMS repository count" },
    { label: "Stars", value: safeNumber(useLiveGitHubAPI ? stats?.stars : manualProfile.stars), helper: "Stars earned" },
    { label: "Forks", value: safeNumber(useLiveGitHubAPI ? stats?.forks : manualProfile.forks), helper: "Forks created" },
    { label: "Followers", value: safeNumber(useLiveGitHubAPI ? stats?.followers : manualProfile.followers), helper: "GitHub followers" },
  ];
  return (
    <AnimatedSection id="github" className="bg-page-bg py-20">
      <div className="container mx-auto px-4">
        <SectionHeader title={title} description={description} eyebrow={eyebrow} />
        {summary ? <p className="mx-auto mt-4 max-w-4xl text-center text-sm leading-7 text-text-muted">{summary}</p> : null}
        {/* {process.env.NODE_ENV === "development" ? (
          <p className="mx-auto mt-3 max-w-4xl text-center text-xs text-text-muted">
            [github] preset visibility controlled by CMS
          </p>
        ) : null} */}

        {loading ? (
          <div className="mt-12 grid gap-4 lg:grid-cols-2">
            <div className="h-96 animate-pulse rounded-[32px] bg-white/70" />
            <div className="h-96 animate-pulse rounded-[32px] bg-white/70" />
          </div>
        ) : error ? (
          <div className="mt-12 rounded-[32px] border border-dashed border-[rgb(var(--border))] bg-white/85 p-8 text-center text-text-muted">
            {error}
          </div>
        ) : (
          <div className="mt-12 space-y-8">
            <section className="overflow-hidden rounded-[36px] border border-[rgb(var(--border))] bg-[linear-gradient(135deg,rgba(255,255,255,0.98),rgba(239,246,255,0.92))] p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)] lg:p-8">
              <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
                <div className="space-y-6">
                  {showProfileHeader ? (
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                      {showAvatar && displayAvatar ? (
                        <img
                          src={displayAvatar}
                          alt={displayUsername}
                          className="h-24 w-24 rounded-[28px] border border-[rgb(var(--border))] object-cover shadow-[0_18px_45px_rgba(15,23,42,0.12)]"
                        />
                      ) : null}
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="text-3xl font-semibold tracking-tight text-text-main">{displayUsername}</h3>
                          <Badge className="bg-[#EFF6FF] text-[#1D4ED8]">@{displayUsername.replace(/^@/, "")}</Badge>
                        </div>
                        {showBio && displayBio ? <p className="mt-3 max-w-2xl text-sm leading-7 text-text-muted sm:text-base">{displayBio}</p> : null}
                      </div>
                    </div>
                  ) : null}

                  {showStats ? <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{displayStats.map((stat) => <StatTile key={stat.label} label={stat.label} value={stat.value} helper={stat.helper} />)}</div> : null}
                  {showViewGitHubButton ? (
                    <div className="flex flex-wrap gap-3">
                      <Button href={displayProfileUrl || "/github"} target="_blank">
                        View GitHub
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  ) : null}
                </div>

                <div className="space-y-4">
                  {showContributionCalendar ? (
                    <div className="rounded-[30px] border border-[rgb(var(--border))] bg-white/90 p-5 shadow-[0_18px_40px_rgba(15,23,42,0.05)]">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-text-main">Contribution Calendar</p>
                          <p className="text-sm text-text-muted">{contributions.total} contributions across {contributions.weeks} weeks</p>
                        </div>
                        <Badge>{contributions.total}</Badge>
                      </div>
                      <div className="mt-4">
                        <Heatmap values={safeArray(contributions.heatmap)} />
                      </div>
                    </div>
                  ) : null}
                  {showInsights ? (
                    <div className="rounded-[30px] border border-[rgb(var(--border))] bg-white/90 p-5 shadow-[0_18px_40px_rgba(15,23,42,0.05)]">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-text-main">GitHub Insights</p>
                          <p className="text-sm text-text-muted">Key repository highlights</p>
                        </div>
                        <Sparkles className="h-4 w-4 text-amber-500" />
                      </div>
                      <div className="mt-4 grid gap-3">
                        <div className="rounded-2xl bg-[rgb(var(--page-bg))] p-4">
                          <p className="text-xs uppercase tracking-[0.18em] text-text-muted">Most Used Language</p>
                          <p className="mt-2 text-lg font-semibold text-text-main">{topLanguage}</p>
                        </div>
                        <div className="rounded-2xl bg-[rgb(var(--page-bg))] p-4">
                          <p className="text-xs uppercase tracking-[0.18em] text-text-muted">Largest Repository</p>
                        <p className="mt-2 text-lg font-semibold text-text-main">{largestRepository?.name || "N/A"}</p>
                        </div>
                        <div className="rounded-2xl bg-[rgb(var(--page-bg))] p-4">
                          <p className="text-xs uppercase tracking-[0.18em] text-text-muted">Most Starred Repository</p>
                          <p className="mt-2 text-lg font-semibold text-text-main">{mostStarred?.name || "N/A"}</p>
                        </div>
                        <div className="rounded-2xl bg-[rgb(var(--page-bg))] p-4">
                          <p className="text-xs uppercase tracking-[0.18em] text-text-muted">Recently Updated</p>
                          <p className="mt-2 text-lg font-semibold text-text-main">{recentlyUpdated?.name || "N/A"}</p>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </section>

            {showLanguageBreakdown ? (
              <section className="rounded-[34px] border border-[rgb(var(--border))] bg-white/85 p-6 shadow-[0_20px_55px_rgba(15,23,42,0.05)]">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-text-main">Language Breakdown</p>
                    <p className="text-sm text-text-muted">Minimal language summary</p>
                  </div>
                  <Badge>{languages.length} languages</Badge>
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  {languages.slice(0, 6).map((language) => <Badge key={language.name}>{language.name}</Badge>)}
                </div>
              </section>
            ) : null}

                {showRepositoryCards ? (
            <section className="rounded-[34px] border border-[rgb(var(--border))] bg-white/85 p-6 shadow-[0_20px_55px_rgba(15,23,42,0.05)]">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-text-main">Repository Cards</p>
                  <p className="text-sm text-text-muted">Homepage preview of selected repositories</p>
                </div>
                <Badge>{visibleRepos.length} shown</Badge>
              </div>
              <div className="mt-6 grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
                {visibleRepos.map((repo) => (
                  <article key={repo.fullName || repo.name} className="rounded-[28px] border border-[rgb(var(--border))] bg-[rgb(var(--page-bg))] p-5 shadow-[0_14px_30px_rgba(15,23,42,0.05)]">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-lg font-semibold text-text-main">{repo.name}</p>
                        <p className="mt-1 text-xs uppercase tracking-[0.18em] text-text-muted">{repo.private ? "Private" : "Public"}</p>
                      </div>
                      <ExternalLink className="h-4 w-4 text-text-muted" />
                    </div>
                    {repo.description ? <p className="mt-3 text-sm leading-6 text-text-muted">{repo.description}</p> : null}
                    <div className="mt-4 flex flex-wrap gap-2">
                      {repo.language ? <Badge>{repo.language}</Badge> : null}
                      <Badge><Star className="mr-1 h-3 w-3" /> {repo.stars}</Badge>
                      <Badge><GitBranch className="mr-1 h-3 w-3" /> {repo.forks}</Badge>
                      {repo.topics?.slice(0, 4).map((topic) => <Badge key={topic}>{topic}</Badge>)}
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {showViewRepositoryButton ? <Button href={resolveRepoHref(repo, displayProfileUrl)} target="_blank">View Repository</Button> : null}
                      {showLiveDemoButton && repo.homepage ? <Button href={repo.homepage} target="_blank">Live Demo</Button> : null}
                    </div>
                    <p className="mt-4 text-xs text-text-muted">Updated {formatDate(repo.updatedAt, { month: "short", day: "numeric", year: "numeric" })}{repo.homepage ? " · Homepage available" : ""}{repo.private ? " · Private" : " · Public"}</p>
                  </article>
                ))}
              </div>
              {showViewMoreButton ? (
                <div className="mt-6 flex justify-center">
                  <Button href="/github" variant="secondary">View More Repositories</Button>
                </div>
              ) : null}
            </section>
            ) : null}

                  {showCacheDebugDetails ? (
              <section className="rounded-[34px] border border-dashed border-[rgb(var(--border))] bg-white/85 p-6 shadow-[0_20px_55px_rgba(15,23,42,0.05)]">
                <p className="text-sm font-semibold text-text-main">Cache / Debug Details</p>
                        <p className="mt-2 text-sm text-text-muted">Last sync: {formatDateTime(stats?.syncedAt)}</p>
                <p className="mt-1 text-sm text-text-muted">Source: {useLiveGitHubAPI ? "GitHub cache" : "Manual CMS data"}</p>
              </section>
            ) : null}
          </div>
        )}
      </div>
    </AnimatedSection>
  );
}
