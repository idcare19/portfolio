"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { trackClientEvent } from "@/components/site/AnalyticsTracker";
import type { GitHubRepository, GitHubStatsResponse } from "@/components/github/types";
import {
  ArrowUpRight,
  Building2,
  ExternalLink,
  Filter,
  GitBranch,
  GitCommitHorizontal,
  Globe,
  Loader2,
  MapPin,
  RefreshCcw,
  Search,
  Sparkles,
  Star,
  Users,
} from "lucide-react";

const heatmapColors = [
  "bg-[rgb(var(--card-hover))]",
  "bg-emerald-200",
  "bg-emerald-300",
  "bg-emerald-500",
  "bg-emerald-700",
];

type Props = {
  enabled: boolean;
  initialStats: GitHubStatsResponse | null;
};

type SortOption = "updated" | "stars" | "forks" | "name";
const REPOS_PER_PAGE = 6;
const COMMITS_PER_PAGE = 25;

function formatDate(value?: string, options?: Intl.DateTimeFormatOptions) {
  if (!value) return "Not available";
  return new Date(value).toLocaleDateString("en-US", { timeZone: "UTC", ...options });
}

function formatDateTime(value?: string) {
  if (!value) return "Not synced yet";
  return new Date(value).toLocaleString("en-US", { timeZone: "UTC" });
}

function StatCard({ label, value, helper }: { label: string; value: string | number; helper?: string }) {
  return (
    <div className="rounded-[28px] border border-[rgb(var(--border))] bg-white/85 p-5 shadow-[0_18px_40px_rgba(15,23,42,0.05)]">
      <p className="text-[11px] uppercase tracking-[0.18em] text-text-muted">{label}</p>
      <p className="mt-3 text-3xl font-semibold tracking-tight text-text-main">{value}</p>
      {helper ? <p className="mt-2 text-sm text-text-muted">{helper}</p> : null}
    </div>
  );
}

export function GitHubDashboardPage({ enabled, initialStats }: Props) {
  const [stats, setStats] = useState<GitHubStatsResponse | null>(initialStats);
  const [isAdmin, setIsAdmin] = useState(false);
  const [query, setQuery] = useState("");
  const [language, setLanguage] = useState("all");
  const [sortBy, setSortBy] = useState<SortOption>("updated");
  const [repoPage, setRepoPage] = useState(1);
  const [commitPage, setCommitPage] = useState(1);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    let cancelled = false;

    fetch("/api/admin/auth/session", { cache: "no-store" })
      .then((response) => {
        if (!response.ok) return null;
        return response.json();
      })
      .then((payload) => {
        if (!cancelled) {
          setIsAdmin(Boolean(payload?.ok));
        }
      })
      .catch(() => {
        if (!cancelled) setIsAdmin(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const repositoryList = stats?.repositories || [];
  const languageOptions = useMemo(
    () => ["all", ...new Set(repositoryList.map((repo) => repo.language).filter(Boolean))],
    [repositoryList]
  );

  const filteredRepositories = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const next = repositoryList.filter((repo) => {
      const matchesQuery =
        !normalizedQuery ||
        `${repo.name} ${repo.description || ""} ${repo.language || ""} ${(repo.topics || []).join(" ")}`.toLowerCase().includes(normalizedQuery);
      const matchesLanguage = language === "all" || repo.language === language;
      return matchesQuery && matchesLanguage;
    });

    return next.sort((left, right) => {
      if (sortBy === "stars") return right.stars - left.stars;
      if (sortBy === "forks") return right.forks - left.forks;
      if (sortBy === "name") return left.name.localeCompare(right.name);
      return new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime();
    });
  }, [language, query, repositoryList, sortBy]);

  const totalLanguageCount = useMemo(
    () => stats?.languages.reduce((sum, item) => sum + item.value, 0) || 0,
    [stats?.languages]
  );
  const contributionByWeekday = useMemo(() => {
    const labels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const totals = labels.map((label, dayIndex) => ({
      label,
      count: 0,
      level: 0,
    }));

    for (const item of stats?.contributions.heatmap || []) {
      const day = new Date(item.date).getDay();
      totals[day].count += item.count;
    }

    const maxCount = Math.max(0, ...totals.map((item) => item.count));
    return totals.map((item) => ({
      ...item,
      level:
        maxCount === 0
          ? 0
          : item.count >= maxCount * 0.75
            ? 4
            : item.count >= maxCount * 0.5
              ? 3
              : item.count >= maxCount * 0.25
                ? 2
                : item.count > 0
                  ? 1
                  : 0,
    }));
  }, [stats?.contributions.heatmap]);
  const paginatedRepositories = useMemo(
    () => filteredRepositories.slice((repoPage - 1) * REPOS_PER_PAGE, repoPage * REPOS_PER_PAGE),
    [filteredRepositories, repoPage]
  );
  const totalRepoPages = Math.max(1, Math.ceil(filteredRepositories.length / REPOS_PER_PAGE));
  const totalCommitPages = Math.max(1, Math.ceil((stats?.latestCommits.length || 0) / COMMITS_PER_PAGE));
  const paginatedCommits = useMemo(
    () => (stats?.latestCommits || []).slice((commitPage - 1) * COMMITS_PER_PAGE, commitPage * COMMITS_PER_PAGE),
    [commitPage, stats?.latestCommits]
  );

  useEffect(() => {
    setRepoPage(1);
  }, [query, language, sortBy]);

  function refreshStats() {
    if (!isAdmin) return;
    startTransition(async () => {
      const syncResponse = await fetch("/api/admin/github/refresh", { method: "POST" });
      const syncPayload = await syncResponse.json().catch(() => null);
      if (!syncResponse.ok || !syncPayload?.success) {
        return;
      }

      const statsResponse = await fetch("/api/github/stats", { cache: "no-store" });
      const statsPayload = await statsResponse.json().catch(() => null);
      if (statsPayload?.success && statsPayload.data) {
        setStats(statsPayload.data as GitHubStatsResponse);
      }
    });
  }

  if (!enabled) {
    return (
      <div className="overflow-hidden rounded-[36px] border border-dashed border-[rgb(var(--border))] bg-[linear-gradient(135deg,rgba(255,255,255,0.96),rgba(239,246,255,0.86))] p-10 text-center shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">GitHub</p>
        <p className="mt-3 text-2xl font-semibold tracking-tight text-text-main">GitHub integration is currently disabled</p>
        <p className="mt-3 text-sm leading-7 text-text-muted">
          Enable GitHub from the admin settings to publish repositories, commits, contributions, and developer activity here.
        </p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="overflow-hidden rounded-[36px] border border-dashed border-[rgb(var(--border))] bg-[linear-gradient(135deg,rgba(255,255,255,0.96),rgba(239,246,255,0.86))] p-10 text-center shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">GitHub</p>
        <p className="mt-3 text-2xl font-semibold tracking-tight text-text-main">No GitHub snapshot is available yet</p>
        <p className="mt-3 text-sm leading-7 text-text-muted">
          The page is ready. Run a GitHub sync from the admin panel to populate the full dashboard.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-[36px] border border-[rgb(var(--border))] bg-[linear-gradient(135deg,rgba(255,255,255,0.98),rgba(239,246,255,0.9))] p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)] sm:p-8 lg:p-10">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
              {stats.profile.avatarUrl ? (
                <img
                  src={stats.profile.avatarUrl}
                  alt={stats.profile.name}
                  className="h-24 w-24 rounded-[28px] border border-[rgb(var(--border))] object-cover shadow-[0_18px_45px_rgba(15,23,42,0.12)]"
                />
              ) : null}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">GitHub Dashboard</p>
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-3xl font-semibold tracking-tight text-text-main sm:text-4xl">{stats.profile.name}</h1>
                  <Badge className="text-xs">@{stats.profile.login}</Badge>
                </div>
                {stats.profile.bio ? <p className="mt-3 max-w-2xl text-sm leading-7 text-text-muted sm:text-base">{stats.profile.bio}</p> : null}
                <div className="mt-4 flex flex-wrap gap-3 text-sm text-text-muted">
                  {stats.profile.company ? <span className="inline-flex items-center gap-2"><Building2 className="h-4 w-4" /> {stats.profile.company}</span> : null}
                  {stats.profile.location ? <span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4" /> {stats.profile.location}</span> : null}
                  {stats.profile.blog ? <a href={stats.profile.blog} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-primary"><Globe className="h-4 w-4" /> {stats.profile.blog.replace(/^https?:\/\//, "")}</a> : null}
                  {stats.profile.joinedAt ? <span className="inline-flex items-center gap-2"><Users className="h-4 w-4" /> Joined {formatDate(stats.profile.joinedAt, { month: "short", year: "numeric" })}</span> : null}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button href={stats.profile.profileUrl} target="_blank">
                View GitHub Profile <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
              {isAdmin ? (
                <button
                  type="button"
                  onClick={refreshStats}
                  disabled={isPending}
                  className="inline-flex items-center gap-2 rounded-full border border-[rgb(var(--border))] bg-white px-5 py-2.5 text-sm font-semibold text-text-main shadow-[0_10px_24px_rgba(15,23,42,0.06)] transition hover:-translate-y-0.5 hover:border-primary/30 disabled:opacity-60"
                >
                  {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCcw className="h-4 w-4" />}
                  Refresh Cached Stats
                </button>
              ) : null}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <StatCard label="Repositories" value={stats.totalRepositories} helper={`${stats.publicRepos} public repositories`} />
            <StatCard label="Public Commits" value={stats.publicCommits || 0} helper="Cached during the last sync" />
            <StatCard label="Private Commits" value={stats.privateCommits || 0} helper={stats.privateIncluded ? "Included in totals" : "Not included"} />
            {stats.showLifetimeCommits !== false ? (
              <StatCard label="Lifetime Commits" value={stats.totalCommits} helper={`${stats.pullRequests || 0} pull requests tracked`} />
            ) : (
              <StatCard label="Commits" value={stats.totalCommits} helper={`${stats.pullRequests || 0} pull requests tracked`} />
            )}
            <StatCard label="Stars" value={stats.stars} helper={`${stats.forks} forks across repositories`} />
            <StatCard label="Followers" value={stats.followers} helper={`${stats.following} following`} />
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Public Repositories" value={stats.publicRepos} />
        <StatCard label="Private Repositories" value={stats.privateRepos} helper="Shown only as counts" />
        <StatCard label="Forks" value={stats.forks} />
        <StatCard label="Issues" value={stats.issues || 0} />
        <StatCard label="Organizations" value={stats.organizations.length} />
      </section>

      <section className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[34px] border border-[rgb(var(--border))] bg-white/80 p-6 shadow-[0_20px_55px_rgba(15,23,42,0.05)]">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-text-main">Contribution Heatmap</p>
              <p className="text-sm text-text-muted">{stats.contributions.total} tracked contributions across {stats.contributions.weeks} weeks</p>
            </div>
            <Badge>{stats.contributions.total} total</Badge>
          </div>
          <div className="mt-6 grid grid-cols-7 gap-3">
            {contributionByWeekday.map((day) => (
              <div
                key={day.label}
                title={`${day.label}: ${day.count} contributions`}
                className="space-y-2"
              >
                <p className="text-center text-xs font-medium text-text-muted">{day.label}</p>
                <div className={`aspect-square rounded-[12px] ${heatmapColors[day.level] || heatmapColors[0]} flex items-center justify-center text-xs font-semibold text-slate-900`}>
                  {day.count}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[34px] border border-[rgb(var(--border))] bg-white/80 p-6 shadow-[0_20px_55px_rgba(15,23,42,0.05)]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-text-main">Language Breakdown</p>
              <p className="text-sm text-text-muted">Calculated from synced repositories</p>
            </div>
            <Badge>{stats.languages.length} languages</Badge>
          </div>
          <div className="mt-5 space-y-4">
            {stats.languages.length ? (
              stats.languages.map((language) => {
                const percentage = totalLanguageCount ? Math.round((language.value / totalLanguageCount) * 100) : 0;
                return (
                  <div key={language.name}>
                    <div className="flex items-center justify-between gap-3 text-sm">
                      <p className="font-medium text-text-main">{language.name}</p>
                      <p className="text-text-muted">{percentage}%</p>
                    </div>
                    <div className="mt-2 h-2 rounded-full bg-[rgb(var(--card-hover))]">
                      <div className="h-2 rounded-full bg-primary" style={{ width: `${Math.max(10, percentage)}%` }} />
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-text-muted">No language data available yet.</p>
            )}
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Public Commits" value={stats.publicCommits || 0} />
        <StatCard label="Private Commits" value={stats.privateCommits || 0} />
        <StatCard label={stats.showLifetimeCommits !== false ? "Lifetime Commits" : "Combined Commits"} value={stats.totalCommits} />
      </section>

      <section className="rounded-[34px] border border-[rgb(var(--border))] bg-white/80 p-6 shadow-[0_20px_55px_rgba(15,23,42,0.05)]">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-text-main">Pinned Repositories</p>
            <p className="text-sm text-text-muted">Featured work pulled from the cached GitHub snapshot</p>
          </div>
          <Badge>{stats.pinnedRepos.length} pinned</Badge>
        </div>
        <div className="mt-6 grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {stats.pinnedRepos.length ? (
            stats.pinnedRepos.map((repo) => (
              <article key={repo.name} className="rounded-[28px] border border-[rgb(var(--border))] bg-[rgb(var(--page-bg))] p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-lg font-semibold text-text-main">{repo.name}</p>
                    <p className="mt-2 line-clamp-3 text-sm leading-7 text-text-muted">{repo.description || "No description provided."}</p>
                  </div>
                  <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-text-muted" />
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {repo.language ? <Badge>{repo.language}</Badge> : null}
                  <Badge><Star className="mr-1 h-3 w-3" /> {repo.stars}</Badge>
                  <Badge><GitBranch className="mr-1 h-3 w-3" /> {repo.forks}</Badge>
                </div>
                <div className="mt-5 flex items-center justify-between gap-3">
                  <p className="text-xs text-text-muted">Updated {formatDate(repo.updatedAt, { month: "short", day: "numeric", year: "numeric" })}</p>
                  <a
                    href={repo.url}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => trackClientEvent("github-click", { targetType: "pinned-repo", targetSlug: repo.name })}
                    className="inline-flex items-center gap-2 rounded-full border border-[rgb(var(--border))] bg-white px-4 py-2 text-xs font-semibold text-text-main transition hover:border-primary/30 hover:text-primary"
                  >
                    View Repository <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </article>
            ))
          ) : (
            <p className="text-sm text-text-muted">No pinned repositories available.</p>
          )}
        </div>
      </section>

      <section className="rounded-[34px] border border-[rgb(var(--border))] bg-white/80 p-6 shadow-[0_20px_55px_rgba(15,23,42,0.05)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold text-text-main">Repository Explorer</p>
            <p className="text-sm text-text-muted">Search, filter, and sort the public repositories already cached in MongoDB.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <label className="relative block">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search repositories"
                className="w-full rounded-full border border-[rgb(var(--border))] bg-white py-2.5 pl-10 pr-4 text-sm text-text-main outline-none"
              />
            </label>
            <label className="relative block">
              <Filter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
              <select
                value={language}
                onChange={(event) => setLanguage(event.target.value)}
                className="w-full appearance-none rounded-full border border-[rgb(var(--border))] bg-white py-2.5 pl-10 pr-4 text-sm text-text-main outline-none"
              >
                {languageOptions.map((item) => (
                  <option key={item} value={item}>{item === "all" ? "All languages" : item}</option>
                ))}
              </select>
            </label>
            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value as SortOption)}
              className="w-full appearance-none rounded-full border border-[rgb(var(--border))] bg-white px-4 py-2.5 text-sm text-text-main outline-none"
            >
              <option value="updated">Sort by updated</option>
              <option value="stars">Sort by stars</option>
              <option value="forks">Sort by forks</option>
              <option value="name">Sort by name</option>
            </select>
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {paginatedRepositories.length ? (
            paginatedRepositories.map((repo: GitHubRepository) => (
              <article key={repo.name} className="rounded-[28px] border border-[rgb(var(--border))] bg-[rgb(var(--page-bg))] p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-lg font-semibold text-text-main">{repo.name}</p>
                    <p className="mt-2 line-clamp-3 text-sm leading-7 text-text-muted">{repo.description || "No description provided."}</p>
                  </div>
                  <a
                    href={repo.url}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => trackClientEvent("github-click", { targetType: "repo-explorer", targetSlug: repo.name })}
                    className="rounded-full border border-[rgb(var(--border))] bg-white p-2 text-text-muted transition hover:border-primary/30 hover:text-primary"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {repo.language ? <Badge>{repo.language}</Badge> : null}
                  <Badge><Star className="mr-1 h-3 w-3" /> {repo.stars}</Badge>
                  <Badge><GitBranch className="mr-1 h-3 w-3" /> {repo.forks}</Badge>
                  {repo.homepage ? <Badge>{repo.homepage.replace(/^https?:\/\//, "")}</Badge> : null}
                </div>
                {repo.topics?.length ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {repo.topics.slice(0, 5).map((topic) => (
                      <span key={topic} className="rounded-full bg-[#EFF6FF] px-3 py-1 text-xs font-medium text-[#1D4ED8]">{topic}</span>
                    ))}
                  </div>
                ) : null}
                <p className="mt-4 text-xs text-text-muted">Updated {formatDate(repo.updatedAt, { month: "short", day: "numeric", year: "numeric" })}</p>
              </article>
            ))
          ) : (
            <div className="rounded-[28px] border border-dashed border-[rgb(var(--border))] p-6 text-sm text-text-muted">
              No repositories match this search and filter combination.
            </div>
          )}
        </div>
        {filteredRepositories.length ? (
          <div className="mt-6 flex items-center justify-between gap-3">
            <p className="text-sm text-text-muted">Page {repoPage} of {totalRepoPages}</p>
            <div className="flex gap-2">
              <button type="button" onClick={() => setRepoPage((current) => Math.max(1, current - 1))} disabled={repoPage === 1} className="rounded-full border border-[rgb(var(--border))] px-4 py-2 text-sm text-text-main disabled:opacity-50">
                Previous
              </button>
              <button type="button" onClick={() => setRepoPage((current) => Math.min(totalRepoPages, current + 1))} disabled={repoPage >= totalRepoPages} className="rounded-full border border-[rgb(var(--border))] px-4 py-2 text-sm text-text-main disabled:opacity-50">
                Next
              </button>
            </div>
          </div>
        ) : null}
      </section>

      <section className="grid gap-8 xl:grid-cols-2">
        <div className="rounded-[34px] border border-[rgb(var(--border))] bg-white/80 p-6 shadow-[0_20px_55px_rgba(15,23,42,0.05)]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-text-main">Recent Commits</p>
              <p className="text-sm text-text-muted">A timeline of the latest synced public commits</p>
            </div>
            <GitCommitHorizontal className="h-4 w-4 text-primary" />
          </div>
          <div className="mt-6 space-y-4">
            {paginatedCommits.length ? (
              paginatedCommits.map((commit) => (
                <a
                  key={`${commit.repoName}-${commit.createdAt}-${commit.message}`}
                  href={commit.url}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => trackClientEvent("github-click", { targetType: "commit", targetSlug: commit.repoName })}
                  className="block rounded-[24px] border border-[rgb(var(--border))] bg-[rgb(var(--page-bg))] p-4 transition hover:border-primary/30 hover:bg-white"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">{commit.repoName}</p>
                      <p className="mt-2 text-sm leading-7 text-text-main">{commit.message}</p>
                    </div>
                    <p className="shrink-0 text-xs text-text-muted">{formatDate(commit.createdAt, { month: "short", day: "numeric" })}</p>
                  </div>
                </a>
              ))
            ) : (
              <p className="text-sm text-text-muted">No recent commits are available yet.</p>
            )}
          </div>
          {stats.latestCommits.length ? (
            <div className="mt-6 flex items-center justify-between gap-3">
              <p className="text-sm text-text-muted">Page {commitPage} of {totalCommitPages}</p>
              <div className="flex gap-2">
                <button type="button" onClick={() => setCommitPage((current) => Math.max(1, current - 1))} disabled={commitPage === 1} className="rounded-full border border-[rgb(var(--border))] px-4 py-2 text-sm text-text-main disabled:opacity-50">
                  Previous
                </button>
                <button type="button" onClick={() => setCommitPage((current) => Math.min(totalCommitPages, current + 1))} disabled={commitPage >= totalCommitPages} className="rounded-full border border-[rgb(var(--border))] px-4 py-2 text-sm text-text-main disabled:opacity-50">
                  Next
                </button>
              </div>
            </div>
          ) : null}
        </div>

        <div className="rounded-[34px] border border-[rgb(var(--border))] bg-white/80 p-6 shadow-[0_20px_55px_rgba(15,23,42,0.05)]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-text-main">Recent Public Activity</p>
              <p className="text-sm text-text-muted">Timeline of GitHub events already cached for the profile</p>
            </div>
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
          <div className="mt-6 space-y-4">
            {stats.recentActivity.length ? (
              stats.recentActivity.map((activity) => (
                <a
                  key={`${activity.repoName}-${activity.createdAt}-${activity.type}`}
                  href={activity.url}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => trackClientEvent("github-click", { targetType: "activity", targetSlug: activity.repoName })}
                  className="block rounded-[24px] border border-[rgb(var(--border))] bg-[rgb(var(--page-bg))] p-4 transition hover:border-primary/30 hover:bg-white"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">{activity.type}</p>
                      <p className="mt-2 text-base font-semibold text-text-main">{activity.repoName}</p>
                      <p className="mt-1 text-sm leading-7 text-text-muted">{activity.summary}</p>
                    </div>
                    <p className="shrink-0 text-xs text-text-muted">{formatDate(activity.createdAt, { month: "short", day: "numeric" })}</p>
                  </div>
                </a>
              ))
            ) : (
              <p className="text-sm text-text-muted">No recent public activity is available yet.</p>
            )}
          </div>
        </div>
      </section>

      <section className="grid gap-8 xl:grid-cols-2">
        <div className="rounded-[34px] border border-[rgb(var(--border))] bg-white/80 p-6 shadow-[0_20px_55px_rgba(15,23,42,0.05)]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-text-main">Organizations</p>
              <p className="text-sm text-text-muted">Public GitHub organizations connected to this profile</p>
            </div>
            <Badge>{stats.organizations.length}</Badge>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {stats.organizations.length ? (
              stats.organizations.map((organization) => (
                <a
                  key={organization.login}
                  href={organization.url || "#"}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-4 rounded-[24px] border border-[rgb(var(--border))] bg-[rgb(var(--page-bg))] p-4 transition hover:border-primary/30 hover:bg-white"
                >
                  {organization.avatarUrl ? (
                    <img src={organization.avatarUrl} alt={organization.login || "Organization"} className="h-12 w-12 rounded-2xl object-cover" />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EFF6FF] text-[#1D4ED8]">
                      <Building2 className="h-5 w-5" />
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-semibold text-text-main">{organization.login || "Organization"}</p>
                    <p className="text-xs text-text-muted">Open organization profile</p>
                  </div>
                </a>
              ))
            ) : (
              <p className="text-sm text-text-muted">No organizations are available from the synced profile.</p>
            )}
          </div>
        </div>

        <div className="rounded-[34px] border border-[rgb(var(--border))] bg-white/80 p-6 shadow-[0_20px_55px_rgba(15,23,42,0.05)]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-text-main">Achievements</p>
              <p className="text-sm text-text-muted">Visible when achievement data is available in the synced snapshot</p>
            </div>
            <Sparkles className="h-4 w-4 text-amber-500" />
          </div>
          <div className="mt-6 grid gap-4">
            {stats.achievements?.length ? (
              stats.achievements.map((achievement) => (
                <a
                  key={achievement.title}
                  href={achievement.url || stats.profile.profileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-4 rounded-[24px] border border-[rgb(var(--border))] bg-[rgb(var(--page-bg))] p-4 transition hover:border-primary/30 hover:bg-white"
                >
                  {achievement.iconUrl ? (
                    <img src={achievement.iconUrl} alt={achievement.title} className="h-12 w-12 rounded-2xl object-cover" />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FEF3C7] text-amber-700">
                      <Sparkles className="h-5 w-5" />
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-semibold text-text-main">{achievement.title}</p>
                    {achievement.description ? <p className="text-xs text-text-muted">{achievement.description}</p> : null}
                  </div>
                </a>
              ))
            ) : (
              <div className="rounded-[24px] border border-dashed border-[rgb(var(--border))] p-5 text-sm text-text-muted">
                No GitHub achievements are currently available in the synced public data.
              </div>
            )}
          </div>
        </div>
      </section>

      <footer className="rounded-[34px] border border-[rgb(var(--border))] bg-white/80 p-6 shadow-[0_20px_55px_rgba(15,23,42,0.05)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold text-text-main">GitHub cache status</p>
            <p className="mt-2 text-sm text-text-muted">Last synced {formatDateTime(stats.syncedAt)}</p>
            {stats.lastSyncError ? <p className="mt-1 text-sm text-rose-600">Last sync error: {stats.lastSyncError}</p> : null}
          </div>
          <div className="flex flex-wrap gap-3">
            {isAdmin ? (
              <button
                type="button"
                onClick={refreshStats}
                disabled={isPending}
                className="inline-flex items-center gap-2 rounded-full border border-[rgb(var(--border))] bg-white px-5 py-2.5 text-sm font-semibold text-text-main shadow-[0_10px_24px_rgba(15,23,42,0.06)] transition hover:-translate-y-0.5 hover:border-primary/30 disabled:opacity-60"
              >
                {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCcw className="h-4 w-4" />}
                Refresh
              </button>
            ) : null}
            <Link
              href={stats.profile.profileUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-[0_18px_38px_rgba(37,99,235,0.22)] transition hover:-translate-y-0.5 hover:bg-[#1D4ED8]"
            >
              Open GitHub Profile <ExternalLink className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
