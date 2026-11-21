
"use client";

import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { trackClientEvent } from "@/components/site/AnalyticsTracker";
import type {
  GitHubRepository,
  GitHubStatsResponse,
} from "@/components/github/types";
import {
  ArrowUpRight,
  Building2,
  ExternalLink,
  GitBranch,
  GitCommitHorizontal,
  Globe,
  MapPin,
  Search,
  Sparkles,
  Star,
  ChevronLeft,
  ChevronRight,
  Github,
  Code2,
  Activity,
  CalendarDays,
} from "lucide-react";
import { useSiteDataContext } from "@/components/site/SiteDataProvider";

type Props = {
  enabled: boolean;
  initialStats: GitHubStatsResponse | null;
};

type SortOption = "updated" | "stars" | "forks" | "name";

const REPOS_PER_PAGE = 6;
const COMMITS_PER_PAGE = 25;

const heatmapColors = [
  "bg-[rgb(var(--card-hover))]",
  "bg-emerald-300/70 dark:bg-emerald-950",
  "bg-emerald-400/80 dark:bg-emerald-800",
  "bg-emerald-500 dark:bg-emerald-600",
  "bg-emerald-600 dark:bg-emerald-400",
];

function formatDate(
  value?: string,
  options?: Intl.DateTimeFormatOptions
) {
  if (!value) return "Not available";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Not available";

  return date.toLocaleDateString("en-US", {
    timeZone: "UTC",
    ...options,
  });
}

function formatDateTime(value?: string) {
  if (!value) return "Not synced yet";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Not synced yet";

  return date.toLocaleString("en-US", {
    timeZone: "UTC",
  });
}

function SafeExternalLink({
  href,
  children,
  className,
  onClick,
  ariaLabel,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  ariaLabel?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick}
      className={className}
      aria-label={ariaLabel}
    >
      {children}
    </a>
  );
}

function Panel({
  children,
  className = "",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section
      id={id}
      className={`rounded-[28px] border border-[rgb(var(--border))] bg-[rgb(var(--card-bg))] p-5 shadow-[0_12px_40px_rgba(0,0,0,0.035)] transition-colors sm:rounded-[32px] sm:p-6 ${className}`}
    >
      {children}
    </section>
  );
}

function SectionHeading({
  title,
  description,
  icon,
  action,
}: {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div className="flex min-w-0 items-start gap-3">
        {icon ? (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] text-text-main">
            {icon}
          </div>
        ) : null}

        <div className="min-w-0">
          <h2 className="text-base font-semibold tracking-tight text-text-main sm:text-lg">
            {title}
          </h2>

          {description ? (
            <p className="mt-1 text-sm leading-6 text-text-muted">
              {description}
            </p>
          ) : null}
        </div>
      </div>

      {action}
    </div>
  );
}

function StatCard({
  label,
  value,
  helper,
  href,
}: {
  label: string;
  value: string | number;
  helper?: string;
  href?: string;
}) {
  const content = (
    <>
      <div className="flex items-center justify-between gap-3">
        <p className="text-[10px] font-semibold uppercase tracking-[0.17em] text-text-muted sm:text-[11px]">
          {label}
        </p>

        <ArrowUpRight className="h-4 w-4 text-text-muted opacity-50 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary group-hover:opacity-100" />
      </div>

      <p className="mt-4 break-words text-3xl font-semibold tracking-tight text-text-main sm:text-4xl">
        {value}
      </p>

      {helper ? (
        <p className="mt-2 text-xs leading-5 text-text-muted sm:text-sm">
          {helper}
        </p>
      ) : null}
    </>
  );

  const className =
    "group block min-w-0 rounded-[24px] border border-[rgb(var(--border))] bg-[rgb(var(--card-bg))] p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:bg-[rgb(var(--card-hover))]";

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {content}
      </a>
    );
  }

  return <div className={className}>{content}</div>;
}

function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex min-h-36 flex-col items-center justify-center rounded-2xl border border-dashed border-[rgb(var(--border))] bg-[rgb(var(--surface))] px-5 py-8 text-center">
      <Github className="h-7 w-7 text-text-muted/60" />

      <p className="mt-3 text-sm font-semibold text-text-main">
        {title}
      </p>

      <p className="mt-1 max-w-md text-xs leading-6 text-text-muted">
        {description}
      </p>
    </div>
  );
}

function Pagination({
  page,
  totalPages,
  onPrevious,
  onNext,
}: {
  page: number;
  totalPages: number;
  onPrevious: () => void;
  onNext: () => void;
}) {
  return (
    <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[rgb(var(--border))] pt-5">
      <p className="text-xs text-text-muted">
        Page <span className="font-semibold text-text-main">{page}</span> of{" "}
        <span className="font-semibold text-text-main">{totalPages}</span>
      </p>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={onPrevious}
          disabled={page <= 1}
          className="inline-flex items-center gap-2 rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--surface))] px-4 py-2 text-xs font-medium text-text-main transition hover:border-primary/40 hover:bg-[rgb(var(--card-hover))] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          Previous
        </button>

        <button
          type="button"
          onClick={onNext}
          disabled={page >= totalPages}
          className="inline-flex items-center gap-2 rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--surface))] px-4 py-2 text-xs font-medium text-text-main transition hover:border-primary/40 hover:bg-[rgb(var(--card-hover))] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

export function GitHubDashboardPage({
  enabled,
  initialStats,
}: Props) {
  const siteData = useSiteDataContext();

  const [stats] = useState<GitHubStatsResponse | null>(initialStats);
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("updated");
  const [repoPage, setRepoPage] = useState(1);
  const [commitPage, setCommitPage] = useState(1);

  const repositoryList = stats?.latestRepos || stats?.repositories || [];

  const selectedRepositoryKeys = useMemo(
    () =>
      new Set(
        [
          ...(siteData.githubConfig?.repositoryCardsSelectedRepositories || []),
          ...(siteData.githubConfig?.selectedRepositories || []),
        ]
          .map((value) => String(value || "").trim().toLowerCase())
          .filter(Boolean)
      ),
    [
      siteData.githubConfig?.repositoryCardsSelectedRepositories,
      siteData.githubConfig?.selectedRepositories,
    ]
  );

  const repositorySelectionMode =
    siteData.githubConfig?.repositorySelectionMode || "all";

  const selectedOnly =
    repositorySelectionMode === "selected" ||
    selectedRepositoryKeys.size > 0;

  const isSelectedRepo = (repo: GitHubRepository) => {
    if (!selectedOnly) return true;

    const keys = [repo.fullName, repo.name]
      .map((value) => String(value || "").trim().toLowerCase())
      .filter(Boolean);

    return keys.some((key) => selectedRepositoryKeys.has(key));
  };

  const repositoryExplorerTitle = selectedOnly
    ? "Selected Repositories"
    : "Repository Explorer";

  const repositoryExplorerDescription = selectedOnly
    ? "Repositories selected from your admin settings."
    : "Explore, search and sort your synced public repositories.";

  const filteredRepositories = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    const next = repositoryList.filter((repo) => {
      const searchableContent = [
        repo.name,
        repo.fullName,
        repo.description,
        repo.language,
        ...(repo.topics || []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesQuery =
        !normalizedQuery || searchableContent.includes(normalizedQuery);

      return matchesQuery && isSelectedRepo(repo);
    });

    return [...next].sort((left, right) => {
      if (sortBy === "stars") return right.stars - left.stars;
      if (sortBy === "forks") return right.forks - left.forks;
      if (sortBy === "name") return left.name.localeCompare(right.name);

      return (
        new Date(right.updatedAt).getTime() -
        new Date(left.updatedAt).getTime()
      );
    });
  }, [
    query,
    sortBy,
    repositoryList,
    selectedOnly,
    selectedRepositoryKeys,
  ]);

  const totalLanguageCount = useMemo(
    () => stats?.languages.reduce((sum, item) => sum + item.value, 0) || 0,
    [stats?.languages]
  );

  // Build a date-wise GitHub contribution calendar.
  const contributionWeeks = useMemo(() => {
    const source = stats?.contributions.heatmap || [];

    const entries = source
      .map((item) => ({
        date: String(item.date).slice(0, 10),
        count: Math.max(0, Number(item.count) || 0),
      }))
      .filter((item) => {
        const date = new Date(`${item.date}T00:00:00.000Z`);
        return !Number.isNaN(date.getTime());
      })
      .sort((a, b) => a.date.localeCompare(b.date));

    if (!entries.length) return [];

    const counts = new Map(
      entries.map((item) => [item.date, item.count])
    );

    const start = new Date(`${entries[0].date}T00:00:00.000Z`);
    const end = new Date(
      `${entries[entries.length - 1].date}T00:00:00.000Z`
    );

    // Pad calendar to begin on Sunday.
    start.setUTCDate(start.getUTCDate() - start.getUTCDay());

    // Pad calendar to finish on Saturday.
    end.setUTCDate(end.getUTCDate() + (6 - end.getUTCDay()));

    const days: {
      date: string;
      count: number;
    }[] = [];

    const cursor = new Date(start);

    while (cursor <= end) {
      const date = cursor.toISOString().slice(0, 10);

      days.push({
        date,
        count: counts.get(date) || 0,
      });

      cursor.setUTCDate(cursor.getUTCDate() + 1);
    }

    const weeks: {
      date: string;
      count: number;
    }[][] = [];

    for (let index = 0; index < days.length; index += 7) {
      weeks.push(days.slice(index, index + 7));
    }

    return weeks;
  }, [stats?.contributions.heatmap]);

  const maxContribution = useMemo(
    () =>
      Math.max(
        1,
        ...(stats?.contributions.heatmap || []).map(
          (item) => Number(item.count) || 0
        )
      ),
    [stats?.contributions.heatmap]
  );

  function getContributionColor(count: number) {
    if (count === 0) return heatmapColors[0];
    if (count <= maxContribution * 0.25) return heatmapColors[1];
    if (count <= maxContribution * 0.5) return heatmapColors[2];
    if (count <= maxContribution * 0.75) return heatmapColors[3];

    return heatmapColors[4];
  }

  const totalRepoPages = Math.max(
    1,
    Math.ceil(filteredRepositories.length / REPOS_PER_PAGE)
  );

  const totalCommitPages = Math.max(
    1,
    Math.ceil((stats?.latestCommits.length || 0) / COMMITS_PER_PAGE)
  );

  const paginatedRepositories = useMemo(
    () =>
      filteredRepositories.slice(
        (repoPage - 1) * REPOS_PER_PAGE,
        repoPage * REPOS_PER_PAGE
      ),
    [filteredRepositories, repoPage]
  );

  const paginatedCommits = useMemo(
    () =>
      (stats?.latestCommits || []).slice(
        (commitPage - 1) * COMMITS_PER_PAGE,
        commitPage * COMMITS_PER_PAGE
      ),
    [commitPage, stats?.latestCommits]
  );

  useEffect(() => {
    setRepoPage(1);
  }, [query, sortBy, selectedRepositoryKeys]);

  useEffect(() => {
    setRepoPage((page) => Math.min(page, totalRepoPages));
  }, [totalRepoPages]);

  useEffect(() => {
    setCommitPage((page) => Math.min(page, totalCommitPages));
  }, [totalCommitPages]);

  if (!enabled) {
    return (
      <div className="overflow-hidden rounded-[32px] border border-dashed border-[rgb(var(--border))] bg-[rgb(var(--card-bg))] px-6 py-16 text-center sm:rounded-[36px] sm:px-10">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))]">
          <Github className="h-8 w-8 text-text-main" />
        </div>

        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
          GitHub Integration
        </p>

        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-text-main">
          GitHub integration is disabled
        </h2>

        <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-text-muted">
          Enable GitHub from the admin settings to publish repositories,
          commits, contributions and developer activity here.
        </p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="overflow-hidden rounded-[32px] border border-dashed border-[rgb(var(--border))] bg-[rgb(var(--card-bg))] px-6 py-16 text-center sm:rounded-[36px] sm:px-10">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))]">
          <Activity className="h-8 w-8 text-text-main" />
        </div>

        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
          GitHub Dashboard
        </p>

        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-text-main">
          No GitHub snapshot available
        </h2>

        <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-text-muted">
          The dashboard is ready. Run a GitHub sync from the admin panel to
          populate your profile and developer activity.
        </p>
      </div>
    );
  }

  const profileHref = stats.profile.profileUrl;
  const baseProfileHref = profileHref.replace(/\/?$/, "");

  const commitsHref = `${baseProfileHref}?tab=overview`;
  const organizationsHref = baseProfileHref;
  const followersHref = `${baseProfileHref}?tab=followers`;
  const starsHref = `${baseProfileHref}?tab=stars`;
  const repositoriesHref = `${baseProfileHref}?tab=repositories`;

  function resolveRepoHref(repo: GitHubRepository) {
    const fallbackRepoHref = repo.fullName
      ? `https://github.com/${repo.fullName}`
      : `${baseProfileHref}/${repo.name}`;

    if (
      repo.private &&
      !stats?.privateIncluded &&
      siteData.githubConfig?.showPrivateReposPublicly !== true
    ) {
      return profileHref;
    }

    return repo.url || fallbackRepoHref || profileHref;
  }

  function resolveOrganizationHref(organization: { url?: string }) {
    return organization.url || profileHref;
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* PROFILE HERO */}
      <section className="relative overflow-hidden rounded-[30px] border border-[rgb(var(--border))] bg-[rgb(var(--card-bg))] shadow-[0_20px_60px_rgba(0,0,0,0.045)] sm:rounded-[36px]">
        <div className="pointer-events-none absolute -right-24 -top-32 h-80 w-80 rounded-full bg-primary/[0.07] blur-3xl" />

        <div className="relative grid gap-8 p-5 sm:p-8 lg:grid-cols-[1.1fr_0.9fr] lg:p-10">
          <div className="flex min-w-0 flex-col justify-between gap-8">
            <div>
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                <SafeExternalLink
                  href={profileHref}
                  ariaLabel={`Open GitHub profile for ${stats.profile.login}`}
                  className="shrink-0"
                >
                  {stats.profile.avatarUrl ? (
                    <img
                      src={stats.profile.avatarUrl}
                      alt={stats.profile.name || stats.profile.login}
                      className="h-20 w-20 rounded-[24px] border border-[rgb(var(--border))] object-cover shadow-xl transition duration-300 hover:-translate-y-1 sm:h-24 sm:w-24 sm:rounded-[28px]"
                    />
                  ) : (
                    <div className="flex h-20 w-20 items-center justify-center rounded-[24px] border border-[rgb(var(--border))] bg-[rgb(var(--surface))] sm:h-24 sm:w-24">
                      <Github className="h-10 w-10 text-text-main" />
                    </div>
                  )}
                </SafeExternalLink>

                <div className="min-w-0 flex-1">
                  <div className="mb-3 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-text-muted sm:text-xs">
                      It's aviii
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <SafeExternalLink
                      href={profileHref}
                      className="break-words text-2xl font-semibold tracking-tight text-text-main transition hover:text-primary sm:text-3xl lg:text-4xl"
                      ariaLabel={`Open GitHub profile for ${stats.profile.login}`}
                    >
                      {stats.profile.name || stats.profile.login}
                    </SafeExternalLink>
                  </div>

                  <SafeExternalLink
                    href={profileHref}
                    className="mt-2 inline-flex text-sm text-text-muted transition hover:text-primary"
                  >
                    @{stats.profile.login}
                    <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
                  </SafeExternalLink>

                  {stats.profile.bio ? (
                    <p className="mt-4 max-w-xl text-sm leading-7 text-text-muted">
                      {stats.profile.bio}
                    </p>
                  ) : null}

                  <div className="mt-5 flex flex-wrap gap-x-5 gap-y-3 text-xs text-text-muted">
                    {stats.profile.company ? (
                      <span className="inline-flex items-center gap-2">
                        <Building2 className="h-3.5 w-3.5" />
                        {stats.profile.company}
                      </span>
                    ) : null}

                    {stats.profile.location ? (
                      <span className="inline-flex items-center gap-2">
                        <MapPin className="h-3.5 w-3.5" />
                        {stats.profile.location}
                      </span>
                    ) : null}

                    {stats.profile.blog ? (
                      <SafeExternalLink
                        href={stats.profile.blog}
                        className="inline-flex items-center gap-2 transition hover:text-primary"
                      >
                        <Globe className="h-3.5 w-3.5" />
                        {stats.profile.blog.replace(/^https?:\/\//, "")}
                      </SafeExternalLink>
                    ) : null}

                    {stats.profile.joinedAt ? (
                      <span className="inline-flex items-center gap-2">
                        <CalendarDays className="h-3.5 w-3.5" />
                        Joined{" "}
                        {formatDate(stats.profile.joinedAt, {
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button href={profileHref} target="_blank">
                View GitHub Profile
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>

              <span className="inline-flex items-center gap-2 rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--surface))] px-4 py-2.5 text-xs text-text-muted">
                <Github className="h-4 w-4" />
                GitHub Snapshot
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <StatCard
              label="Repositories"
              value={stats.totalRepositories}
              helper={`${stats.publicRepos} public repositories`}
              href={repositoriesHref}
            />

            <StatCard
              label="Public Commits"
              value={stats.publicCommits || 0}
              helper="Cached during sync"
              href={commitsHref}
            />

            <StatCard
              label="Private Commits"
              value={stats.privateCommits || 0}
              helper={stats.privateIncluded ? "Included in totals" : "Not included"}
              href={commitsHref}
            />

            <StatCard
              label={stats.showLifetimeCommits !== false ? "Lifetime Commits" : "Commits"}
              value={stats.totalCommits}
              helper={`${stats.pullRequests || 0} pull requests tracked`}
              href={commitsHref}
            />

            <StatCard
              label="Stars"
              value={stats.stars}
              helper={`${stats.forks} forks across repositories`}
              href={starsHref}
            />

            <StatCard
              label="Followers"
              value={stats.followers}
              helper={`${stats.following} following`}
              href={followersHref}
            />
          </div>
        </div>
      </section>

      {/* QUICK STATS */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 xl:grid-cols-5">
        <StatCard
          label="Public Repositories"
          value={stats.publicRepos}
          href={repositoriesHref}
        />

        <StatCard
          label="Private Repositories"
          value={stats.privateRepos}
          helper="Shown only as counts"
          href={repositoriesHref}
        />

        <StatCard label="Forks" value={stats.forks} href={repositoriesHref} />

        <StatCard label="Issues" value={stats.issues || 0} href={repositoriesHref} />

        <StatCard
          label="Organizations"
          value={stats.organizations.length}
          href={organizationsHref}
        />
      </section>

      {/* CONTRIBUTIONS AND LANGUAGES */}
      <section id="contributions" className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <Panel>
          <SectionHeading
            title="Contribution Activity"
            description={`${stats.contributions.total} tracked contributions across ${stats.contributions.weeks} weeks`}
            icon={<Activity className="h-5 w-5" />}
            action={<Badge>{stats.contributions.total} total</Badge>}
          />

          {/* GitHub-style daily contribution squares */}
          <div className="mt-7 overflow-x-auto pb-2">
            {contributionWeeks.length ? (
              <div className="flex min-w-max gap-[5px]">
                {contributionWeeks.map((week, weekIndex) => (
                  <div
                    key={`week-${weekIndex}`}
                    className="flex flex-col gap-[5px]"
                  >
                    {week.map((day) => (
                      <div
                        key={day.date}
                        title={`${day.date}: ${day.count} contributions`}
                        aria-label={`${day.date}: ${day.count} contributions`}
                        className={`h-[13px] w-[13px] rounded-[3px] transition duration-150 hover:scale-125 hover:ring-2 hover:ring-emerald-500/40 ${getContributionColor(day.count)}`}
                      />
                    ))}
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                title="No contribution activity"
                description="Daily contribution squares will appear after your next GitHub sync."
              />
            )}
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[rgb(var(--border))] pt-5">
            <p className="text-xs text-text-muted">
              Daily contributions
            </p>

            <div className="flex items-center gap-1.5">
              <span className="mr-1 text-[10px] text-text-muted">Less</span>
              {heatmapColors.map((color, index) => (
                <span
                  key={index}
                  className={`h-3 w-3 rounded-[3px] ${color}`}
                />
              ))}
              <span className="ml-1 text-[10px] text-text-muted">More</span>
            </div>
          </div>
        </Panel>

        <Panel>
          <SectionHeading
            title="Language Breakdown"
            description="Distribution across synced repositories"
            icon={<Code2 className="h-5 w-5" />}
            action={<Badge>{stats.languages.length} languages</Badge>}
          />

          <div className="mt-7 space-y-5">
            {stats.languages.length ? (
              stats.languages.map((language) => {
                const percentage = totalLanguageCount
                  ? Math.round((language.value / totalLanguageCount) * 100)
                  : 0;

                return (
                  <div key={language.name}>
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-medium text-text-main">
                        {language.name}
                      </p>

                      <p className="text-xs font-semibold tabular-nums text-text-muted">
                        {percentage}%
                      </p>
                    </div>

                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-[rgb(var(--card-hover))]">
                      <div
                        className="h-full rounded-full bg-primary transition-all duration-700"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <EmptyState
                title="No language data"
                description="Language statistics will appear after your next GitHub sync."
              />
            )}
          </div>
        </Panel>
      </section>

      {/* COMMIT OVERVIEW */}
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
        <StatCard
          label="Public Commits"
          value={stats.publicCommits || 0}
        />

        <StatCard
          label="Private Commits"
          value={stats.privateCommits || 0}
        />

        <StatCard
          label={stats.showLifetimeCommits !== false ? "Lifetime Commits" : "Combined Commits"}
          value={stats.totalCommits}
        />
      </section>

      {/* PINNED REPOSITORIES */}
      {/* <Panel>
        <SectionHeading
          title="Pinned Repositories"
          description="Featured work from your synced GitHub snapshot"
          icon={<Star className="h-5 w-5" />}
          action={<Badge>{stats.pinnedRepos.length} pinned</Badge>}
        />

        <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {stats.pinnedRepos.length ? (
            stats.pinnedRepos.map((repo) => (
              <a
                key={repo.name}
                href={resolveRepoHref(repo)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  trackClientEvent("github-click", {
                    targetType: "pinned-repo",
                    targetSlug: repo.name,
                  })
                }
                className="group relative overflow-hidden rounded-[24px] border border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:bg-[rgb(var(--card-hover))]"
                aria-label={`Open pinned repository ${repo.name} on GitHub`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card-bg))]">
                    <Github className="h-5 w-5 text-text-main" />
                  </div>

                  <ArrowUpRight className="h-4 w-4 text-text-muted transition group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-primary" />
                </div>

                <h3 className="mt-5 break-words text-base font-semibold text-text-main transition group-hover:text-primary">
                  {repo.name}
                </h3>

                <div className="mt-4 flex flex-wrap gap-2">
                  {repo.language ? <Badge>{repo.language}</Badge> : null}

                  <Badge>
                    <Star className="mr-1 h-3 w-3" />
                    {repo.stars}
                  </Badge>

                  <Badge>
                    <GitBranch className="mr-1 h-3 w-3" />
                    {repo.forks}
                  </Badge>
                </div>

                <p className="mt-5 text-[11px] text-text-muted">
                  Updated{" "}
                  {formatDate(repo.updatedAt, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </a>
            ))
          ) : (
            <div className="sm:col-span-2 xl:col-span-3">
              <EmptyState
                title="No pinned repositories"
                description="Pinned repositories will appear here when available in your GitHub snapshot."
              />
            </div>
          )}
        </div>
      </Panel> */}

      {/* REPOSITORY EXPLORER */}
      {/* <Panel>
        <SectionHeading
          title={repositoryExplorerTitle}
          description={repositoryExplorerDescription}
          icon={<Github className="h-5 w-5" />}
          action={<Badge>{filteredRepositories.length} repositories</Badge>}
        />

        <div className="mt-6 grid gap-3 sm:grid-cols-[1fr_190px]">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />

            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search repositories, languages, topics..."
              className="w-full rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--surface))] py-3 pl-11 pr-4 text-sm text-text-main outline-none transition placeholder:text-text-muted/70 focus:border-primary/60 focus:ring-2 focus:ring-primary/10"
            />
          </label>

          <div className="relative">
            <select
              value={sortBy}
              onChange={(event) =>
                setSortBy(event.target.value as SortOption)
              }
              className="w-full appearance-none rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--surface))] px-4 py-3 pr-10 text-sm text-text-main outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-primary/10"
              aria-label="Sort repositories"
            >
              <option value="updated">Recently updated</option>
              <option value="stars">Most stars</option>
              <option value="forks">Most forks</option>
              <option value="name">Name A–Z</option>
            </select>

            <GitBranch className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          </div>
        </div>

        <div className="mt-6 grid gap-3 lg:grid-cols-2">
          {paginatedRepositories.length ? (
            paginatedRepositories.map((repo: GitHubRepository) => (
              <a
                key={repo.name}
                href={resolveRepoHref(repo)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  trackClientEvent("github-click", {
                    targetType: "repo-explorer",
                    targetSlug: repo.name,
                  })
                }
                className="group block min-w-0 rounded-[24px] border border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-[rgb(var(--card-hover))]"
                aria-label={`Open repository ${repo.name} on GitHub`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card-bg))]">
                      <Github className="h-5 w-5 text-text-main" />
                    </div>

                    <div className="min-w-0">
                      <h3 className="break-words text-sm font-semibold text-text-main transition group-hover:text-primary">
                        {repo.name}
                      </h3>

                      {repo.fullName ? (
                        <p className="mt-1 truncate text-[10px] text-text-muted">
                          {repo.fullName}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <ExternalLink className="h-4 w-4 shrink-0 text-text-muted transition group-hover:text-primary" />
                </div>

                <p className="mt-4 line-clamp-3 min-h-[60px] text-xs leading-6 text-text-muted">
                  {repo.description ||
                    (repo.topics || []).join(", ") ||
                    repo.homepage ||
                    repo.language ||
                    "Repository snapshot"}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {repo.language ? <Badge>{repo.language}</Badge> : null}

                  <Badge>
                    <Star className="mr-1 h-3 w-3" />
                    {repo.stars}
                  </Badge>

                  <Badge>
                    <GitBranch className="mr-1 h-3 w-3" />
                    {repo.forks}
                  </Badge>
                </div>

                {repo.topics?.length ? (
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {repo.topics.slice(0, 5).map((topic) => (
                      <span
                        key={topic}
                        className="rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--card-bg))] px-2.5 py-1 text-[10px] font-medium text-text-muted"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                ) : null}

                <div className="mt-5 border-t border-[rgb(var(--border))] pt-3">
                  <p className="text-[10px] text-text-muted">
                    Updated{" "}
                    {formatDate(repo.updatedAt, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </a>
            ))
          ) : (
            <div className="lg:col-span-2">
              <EmptyState
                title="No repositories found"
                description="Try another search term or change your sorting and selection settings."
              />
            </div>
          )}
        </div>

        {filteredRepositories.length > 0 ? (
          <Pagination
            page={repoPage}
            totalPages={totalRepoPages}
            onPrevious={() =>
              setRepoPage((current) => Math.max(1, current - 1))
            }
            onNext={() =>
              setRepoPage((current) =>
                Math.min(totalRepoPages, current + 1)
              )
            }
          />
        ) : null}
      </Panel>

      {/* RECENT COMMITS */}
      {/* <Panel id="recent-commits">
        <SectionHeading
          title="Recent Commits"
          description="A timeline of your latest synced public commits"
          icon={<GitCommitHorizontal className="h-5 w-5" />}
          action={<Badge>{stats.latestCommits.length} commits</Badge>}
        />

        <div className="mt-6 space-y-3">
          {paginatedCommits.length ? (
            paginatedCommits.map((commit) => (
              <a
                key={`${commit.repoName}-${commit.createdAt}-${commit.message}`}
                href={commit.url || commitsHref}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  trackClientEvent("github-click", {
                    targetType: "commit",
                    targetSlug: commit.repoName,
                  })
                }
                className="group block rounded-[22px] border border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-4 transition hover:border-primary/40 hover:bg-[rgb(var(--card-hover))] sm:p-5"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card-bg))]">
                    <GitCommitHorizontal className="h-4 w-4 text-text-muted transition group-hover:text-primary" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="break-all text-xs font-semibold text-primary">
                        {commit.repoName}
                      </p>

                      <p className="shrink-0 text-[10px] text-text-muted">
                        {formatDate(commit.createdAt, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>

                    <p className="mt-2 text-sm leading-6 text-text-main">
                      {commit.message}
                    </p>
                  </div>

                  <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-text-muted transition group-hover:text-primary" />
                </div>
              </a>
            ))
          ) : (
            <EmptyState
              title="No recent commits"
              description="Your latest public commits will appear here after GitHub sync."
            />
          )}
        </div>

        {stats.latestCommits.length > 0 ? (
          <Pagination
            page={commitPage}
            totalPages={totalCommitPages}
            onPrevious={() =>
              setCommitPage((current) => Math.max(1, current - 1))
            }
            onNext={() =>
              setCommitPage((current) =>
                Math.min(totalCommitPages, current + 1)
              )
            }
          />
        ) : null}
      </Panel> */}

      {/* ORGANIZATIONS AND ACHIEVEMENTS */}
      {/* <section className="grid gap-5 xl:grid-cols-2">
        <Panel id="organizations">
          <SectionHeading
            title="Organizations"
            description="Public GitHub organizations connected to this profile"
            icon={<Building2 className="h-5 w-5" />}
            action={<Badge>{stats.organizations.length}</Badge>}
          />

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {stats.organizations.length ? (
              stats.organizations.map((organization) => (
                <a
                  key={organization.login}
                  href={resolveOrganizationHref(organization)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex min-w-0 items-center gap-3 rounded-[22px] border border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-4 transition hover:border-primary/40 hover:bg-[rgb(var(--card-hover))]"
                >
                  {organization.avatarUrl ? (
                    <img
                      src={organization.avatarUrl}
                      alt={organization.login || "Organization"}
                      className="h-11 w-11 shrink-0 rounded-xl border border-[rgb(var(--border))] object-cover"
                    />
                  ) : (
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card-bg))]">
                      <Building2 className="h-5 w-5 text-text-muted" />
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-text-main transition group-hover:text-primary">
                      {organization.login || "Organization"}
                    </p>

                    <p className="mt-1 text-[10px] text-text-muted">
                      Open organization profile
                    </p>
                  </div>

                  <ArrowUpRight className="h-4 w-4 shrink-0 text-text-muted transition group-hover:text-primary" />
                </a>
              ))
            ) : (
              <div className="sm:col-span-2">
                <EmptyState
                  title="No organizations found"
                  description="Public organizations will appear here when available in the synced profile."
                />
              </div>
            )}
          </div>
        </Panel>

        <Panel id="achievements">
          <SectionHeading
            title="Achievements"
            description="Recognition available in your synced GitHub data"
            icon={<Sparkles className="h-5 w-5" />}
            action={<Sparkles className="h-5 w-5 text-text-muted" />}
          />

          <div className="mt-6 space-y-3">
            {stats.achievements?.length ? (
              stats.achievements.map((achievement) => (
                <a
                  key={achievement.title}
                  href={achievement.url || profileHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex min-w-0 items-center gap-3 rounded-[22px] border border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-4 transition hover:border-primary/40 hover:bg-[rgb(var(--card-hover))]"
                >
                  {achievement.iconUrl ? (
                    <img
                      src={achievement.iconUrl}
                      alt={achievement.title}
                      className="h-11 w-11 shrink-0 rounded-xl border border-[rgb(var(--border))] object-cover"
                    />
                  ) : (
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card-bg))]">
                      <Sparkles className="h-5 w-5 text-text-muted" />
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-text-main transition group-hover:text-primary">
                      {achievement.title}
                    </p>

                    {achievement.description ? (
                      <p className="mt-1 text-xs leading-5 text-text-muted">
                        {achievement.description}
                      </p>
                    ) : null}
                  </div>

                  <ArrowUpRight className="h-4 w-4 shrink-0 text-text-muted transition group-hover:text-primary" />
                </a>
              ))
            ) : (
              <EmptyState
                title="No achievements available"
                description="GitHub achievements will appear here if they are included in the synced public data."
              />
            )}
          </div>
        </Panel>
      </section> */}

      {/* CACHE STATUS */}
      <footer className="overflow-hidden rounded-[28px] border border-[rgb(var(--border))] bg-[rgb(var(--card-bg))] p-5 sm:rounded-[32px] sm:p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))]">
              <Activity className="h-5 w-5 text-text-muted" />
            </div>

            <div>
              <p className="text-sm font-semibold text-text-main">
                GitHub Cache Status
              </p>

              <p className="mt-1 text-xs text-text-muted">
                Last synced {formatDateTime(stats.syncedAt)}
              </p>

              {stats.lastSyncError ? (
                <p className="mt-2 break-words text-xs text-rose-500">
                  Last sync error: {stats.lastSyncError}
                </p>
              ) : null}
            </div>
          </div>

          <a
            href={profileHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-xs font-semibold text-white transition hover:-translate-y-0.5 hover:opacity-90"
          >
            Open GitHub Profile
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </footer>
    </div>
  );
}
