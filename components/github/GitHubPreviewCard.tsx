"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import type { GitHubStatsResponse } from "@/components/github/types";
import { trackClientEvent } from "@/components/site/AnalyticsTracker";
import { Clock3, ExternalLink, GitCommitHorizontal, Sparkles } from "lucide-react";

function formatSyncTime(value?: string) {
  if (!value) return "Not synced yet";
  return new Date(value).toLocaleString();
}

export function GitHubPreviewCard({ stats }: { stats: GitHubStatsResponse | null }) {
  if (!stats) {
    return (
      <div className="overflow-hidden rounded-[36px] border border-[rgb(var(--border))] bg-[linear-gradient(135deg,rgba(255,255,255,0.97),rgba(239,246,255,0.92))] p-8 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-[#BFDBFE] bg-[#EFF6FF] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#1D4ED8]">
            <Sparkles className="h-3.5 w-3.5" />
            GitHub Snapshot
          </div>
          <p className="text-2xl font-semibold tracking-tight text-text-main">GitHub data is getting ready</p>
          <p className="mt-3 text-sm leading-7 text-text-muted">
            Connect GitHub in the admin panel to publish repositories, recent commits, and live activity here.
          </p>
          <div className="mt-6">
            <Link href="/github" className="inline-flex items-center gap-2 rounded-full border border-[rgb(var(--border))] bg-white px-5 py-2.5 text-sm font-semibold text-text-main">
              Open GitHub Page <ExternalLink className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const recentItems: Array<{ repoName: string; createdAt: string; url: string; summary: string }> = stats.latestCommits.slice(0, 3).length
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
    <div className="overflow-hidden rounded-[36px] border border-[rgb(var(--border))] bg-[linear-gradient(135deg,rgba(255,255,255,0.98),rgba(248,250,252,0.92))] p-5 shadow-[0_20px_55px_rgba(15,23,42,0.06)] sm:p-7">
      <div className="space-y-6">
        <div className="flex items-start gap-4">
          {stats.profile.avatarUrl ? (
            <img
              src={stats.profile.avatarUrl}
              alt={stats.profile.name}
              className="h-16 w-16 rounded-[22px] border border-[rgb(var(--border))] object-cover shadow-[0_14px_34px_rgba(15,23,42,0.10)] sm:h-20 sm:w-20"
            />
          ) : null}
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-2xl font-semibold tracking-tight text-text-main">{stats.profile.name}</h3>
              <Badge className="bg-[#EFF6FF] text-[11px] text-[#1D4ED8]">@{stats.profile.login}</Badge>
            </div>
            {stats.profile.bio ? (
              <p className="mt-2 line-clamp-2 max-w-2xl text-sm leading-7 text-text-muted">{stats.profile.bio}</p>
            ) : (
              <p className="mt-2 text-sm text-text-muted">A live GitHub snapshot from the cached developer profile.</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-[24px] border border-[rgb(var(--border))] bg-white/90 p-4">
            <p className="text-[11px] uppercase tracking-[0.18em] text-text-muted">Repos</p>
            <p className="mt-2 text-2xl font-semibold text-text-main">{stats.totalRepositories}</p>
          </div>
          <div className="rounded-[24px] border border-[rgb(var(--border))] bg-white/90 p-4">
            <p className="text-[11px] uppercase tracking-[0.18em] text-text-muted">Stars</p>
            <p className="mt-2 text-2xl font-semibold text-text-main">{stats.stars}</p>
          </div>
          {stats.showLifetimeCommits !== false ? (
            <div className="rounded-[24px] border border-[rgb(var(--border))] bg-white/90 p-4">
              <p className="text-[11px] uppercase tracking-[0.18em] text-text-muted">Lifetime Commits</p>
              <p className="mt-2 text-2xl font-semibold text-text-main">{stats.totalCommits}</p>
            </div>
          ) : (
            <div className="rounded-[24px] border border-[rgb(var(--border))] bg-white/90 p-4">
              <p className="text-[11px] uppercase tracking-[0.18em] text-text-muted">Commits</p>
              <p className="mt-2 text-2xl font-semibold text-text-main">{stats.totalCommits}</p>
            </div>
          )}
          <div className="rounded-[24px] border border-[rgb(var(--border))] bg-white/90 p-4">
            <p className="text-[11px] uppercase tracking-[0.18em] text-text-muted">Followers</p>
            <p className="mt-2 text-2xl font-semibold text-text-main">{stats.followers}</p>
          </div>
        </div>

        <div className="rounded-[28px] border border-[rgb(var(--border))] bg-white/75 p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-text-main">Latest commits</p>
              <p className="text-xs text-text-muted">Only the 3 most recent public commits</p>
            </div>
            <GitCommitHorizontal className="h-4 w-4 text-primary" />
          </div>
          <div className="mt-4 space-y-3">
            {recentItems.length ? (
              recentItems.map((item) => (
                <a
                  key={`${item.repoName}-${item.createdAt}-${item.summary}`}
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => trackClientEvent("github-click", { targetType: "recent-item", targetSlug: item.repoName })}
                  className="flex items-start justify-between gap-4 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--page-bg))] px-4 py-3 transition hover:border-primary/30 hover:bg-white"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-text-main">{item.repoName}</p>
                    <p className="mt-1 line-clamp-2 text-sm text-text-muted">{item.summary}</p>
                  </div>
                  <p className="shrink-0 text-xs text-text-muted">{new Date(item.createdAt).toLocaleDateString()}</p>
                </a>
              ))
            ) : (
              <p className="text-sm text-text-muted">No recent public activity has been synced yet.</p>
            )}
          </div>
          <div className="mt-4 border-t border-[rgb(var(--border))] pt-4 text-xs text-text-muted">
            <span className="inline-flex items-center gap-2"><Clock3 className="h-3.5 w-3.5" /> Last synced {formatSyncTime(stats.syncedAt)}</span>
          </div>
        </div>
      </div>

      <div className="mt-6 border-t border-[rgb(var(--border))] pt-6">
        <Link
          href="/github"
          onClick={() => trackClientEvent("github-click", { targetType: "homepage-cta", targetSlug: "full-dashboard" })}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_38px_rgba(37,99,235,0.22)] transition hover:-translate-y-0.5 hover:bg-[#1D4ED8]"
        >
          View Full GitHub Dashboard <ExternalLink className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
