
"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import type { GitHubStatsResponse } from "@/components/github/types";
import { trackClientEvent } from "@/components/site/AnalyticsTracker";
import {
  ExternalLink,
  GitCommitHorizontal,
  Sparkles,
  ArrowUpRight,
  Github,
} from "lucide-react";

export function GitHubPreviewCard({
  stats,
}: {
  stats: GitHubStatsResponse | null;
}) {
  if (!stats) {
    return (
      <div className="overflow-hidden rounded-[30px] border border-[rgb(var(--border))] bg-[rgb(var(--card-bg))] p-6 shadow-[0_16px_45px_rgba(0,0,0,0.04)] sm:rounded-[36px] sm:p-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))]">
            <Github className="h-7 w-7 text-text-main" />
          </div>

          <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--surface))] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-text-muted">
            <Sparkles className="h-3.5 w-3.5" />
            GitHub Snapshot
          </div>

          <h3 className="mt-4 text-2xl font-semibold tracking-tight text-text-main">
            GitHub data is getting ready
          </h3>

          <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-text-muted">
            Connect GitHub in the admin panel to publish repositories,
            recent commits, and developer activity here.
          </p>

          <Link
            href="/github"
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--surface))] px-5 py-3 text-sm font-semibold text-text-main transition hover:border-primary/40 hover:bg-[rgb(var(--card-hover))]"
          >
            Open GitHub Page
            <ExternalLink className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  const recentItems = stats.latestCommits.slice(0, 3).length
    ? stats.latestCommits.slice(0, 3).map((item) => ({
        repoName: item.repoName,
        createdAt: item.createdAt,
        url: item.url,
        summary: item.message,
      }))
    : stats.recentActivity.slice(0, 3).map((item) => ({
        repoName: item.repoName,
        createdAt: item.createdAt,
        url: item.url,
        summary: item.summary,
      }));

  return (
    <div className="overflow-hidden rounded-[30px] border border-[rgb(var(--border))] bg-[rgb(var(--card-bg))] p-5 shadow-[0_16px_45px_rgba(0,0,0,0.04)] transition-colors sm:rounded-[36px] sm:p-7">
      <div className="space-y-6">
        {/* PROFILE */}
        <div className="flex min-w-0 items-center gap-4">
          {stats.profile.avatarUrl ? (
            <a
              href={stats.profile.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0"
            >
              <img
                src={stats.profile.avatarUrl}
                alt={stats.profile.name || stats.profile.login}
                className="h-16 w-16 rounded-[20px] border border-[rgb(var(--border))] object-cover transition duration-300 hover:-translate-y-1 sm:h-20 sm:w-20 sm:rounded-[24px]"
              />
            </a>
          ) : (
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[20px] border border-[rgb(var(--border))] bg-[rgb(var(--surface))] sm:h-20 sm:w-20">
              <Github className="h-8 w-8 text-text-muted" />
            </div>
          )}

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="break-words text-xl font-semibold tracking-tight text-text-main sm:text-2xl">
                {stats.profile.name || stats.profile.login}
              </h3>

              <Badge>@{stats.profile.login}</Badge>
            </div>

            {stats.profile.bio ? (
              <p className="mt-2 line-clamp-2 max-w-2xl text-sm leading-6 text-text-muted">
                {stats.profile.bio}
              </p>
            ) : (
              <p className="mt-2 text-sm text-text-muted">
                A snapshot of my GitHub activity and projects.
              </p>
            )}
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            {
              label: "Repositories",
              value: stats.totalRepositories,
            },
            {
              label: "Stars",
              value: stats.stars,
            },
            {
              label:
                stats.showLifetimeCommits !== false
                  ? "Lifetime Commits"
                  : "Commits",
              value: stats.totalCommits,
            },
            {
              label: "Followers",
              value: stats.followers,
            },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-[22px] border border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-4 transition hover:border-primary/30 hover:bg-[rgb(var(--card-hover))] sm:rounded-[24px]"
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-text-muted sm:text-[11px]">
                {item.label}
              </p>

              <p className="mt-2 break-words text-2xl font-semibold tracking-tight text-text-main sm:text-3xl">
                {item.value}
              </p>
            </div>
          ))}
        </div>

        {/* RECENT COMMITS */}
        <div className="rounded-[24px] border border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-4 sm:rounded-[28px] sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h4 className="text-sm font-semibold text-text-main">
                Latest Commits
              </h4>
              <p className="mt-1 text-xs text-text-muted">
                Your 3 most recent public commits
              </p>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card-bg))]">
              <GitCommitHorizontal className="h-4 w-4 text-text-main" />
            </div>
          </div>

          <div className="mt-4 space-y-2.5">
            {recentItems.length ? (
              recentItems.map((item) => (
                <a
                  key={`${item.repoName}-${item.createdAt}-${item.summary}`}
                  href={item.url || stats.profile.profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    trackClientEvent("github-click", {
                      targetType: "recent-item",
                      targetSlug: item.repoName,
                    })
                  }
                  className="group flex min-w-0 items-start justify-between gap-3 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card-bg))] px-4 py-3 transition hover:border-primary/40 hover:bg-[rgb(var(--card-hover))]"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-semibold text-text-main transition group-hover:text-primary">
                        {item.repoName}
                      </p>

                      <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-text-muted transition group-hover:text-primary" />
                    </div>

                    <p className="mt-1 line-clamp-2 text-xs leading-5 text-text-muted">
                      {item.summary}
                    </p>
                  </div>

                  <p className="shrink-0 text-[10px] text-text-muted">
                    {item.createdAt &&
                    !Number.isNaN(new Date(item.createdAt).getTime())
                      ? new Date(item.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          timeZone: "UTC",
                        })
                      : "—"}
                  </p>
                </a>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-[rgb(var(--border))] px-4 py-7 text-center">
                <GitCommitHorizontal className="mx-auto h-6 w-6 text-text-muted/60" />

                <p className="mt-2 text-sm font-medium text-text-main">
                  No recent commits
                </p>

                <p className="mt-1 text-xs text-text-muted">
                  Recent public activity will appear after GitHub sync.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="mt-6 border-t border-[rgb(var(--border))] pt-5">
        <Link
          href="/github"
          onClick={() =>
            trackClientEvent("github-click", {
              targetType: "homepage-cta",
              targetSlug: "full-dashboard",
            })
          }
          className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:opacity-90 sm:w-auto"
        >
          View Full GitHub Dashboard
          <ExternalLink className="h-4 w-4 transition group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
}
