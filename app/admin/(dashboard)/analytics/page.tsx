"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatCard } from "@/components/admin/StatCard";

type Summary = {
  range: string;
  totalVisitors: number;
  uniqueVisitors: number;
  pageViews: number;
  projectViews: number;
  blogViews: number;
  resumeDownloads: number;
  contactSubmissions: number;
};

export default function AnalyticsAdminPage() {
  const [summaries, setSummaries] = useState<Summary[]>([]);
  const [recent, setRecent] = useState<Array<{ label: string; eventType: string }>>([]);
<<<<<<< HEAD
  const [topPages, setTopPages] = useState<Array<{ _id: string; count: number }>>([]);
  const [topProjects, setTopProjects] = useState<Array<{ _id: string; count: number }>>([]);
  const [topSearchTerms, setTopSearchTerms] = useState<Array<{ _id: string; count: number }>>([]);
  const [githubClicks, setGithubClicks] = useState<Array<{ _id: string; count: number }>>([]);
  const [portfolioAiUsage, setPortfolioAiUsage] = useState(0);
  const [resumeDownloads, setResumeDownloads] = useState(0);
  const [contactSubmissions, setContactSubmissions] = useState(0);
=======
>>>>>>> c974e6d18f7e4d84cefd23b3ad822ac4cf9981fc

  useEffect(() => {
    void fetch("/api/analytics/summary")
      .then((res) => res.json())
      .then((payload) => {
        setSummaries(payload.summaries || []);
        setRecent(payload.recent || []);
<<<<<<< HEAD
        setTopPages(payload.topPages || []);
        setTopProjects(payload.topProjects || []);
        setTopSearchTerms(payload.topSearchTerms || []);
        setGithubClicks(payload.githubClicks || []);
        setPortfolioAiUsage(payload.portfolioAiUsage || 0);
        setResumeDownloads(payload.resumeDownloads || 0);
        setContactSubmissions(payload.contactSubmissions || 0);
=======
>>>>>>> c974e6d18f7e4d84cefd23b3ad822ac4cf9981fc
      })
      .catch(() => undefined);
  }, []);

  const current = summaries[0];

  return (
    <div className="space-y-6">
      <PageHeader title="Analytics Dashboard" description="Visitors, views, clicks, and conversions across the portfolio." />
      {current ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Today Visitors" value={current.totalVisitors} />
          <StatCard label="Unique Visitors" value={current.uniqueVisitors} />
          <StatCard label="Project Views" value={current.projectViews} />
          <StatCard label="Contact Submissions" value={current.contactSubmissions} />
<<<<<<< HEAD
          <StatCard label="Portfolio AI Usage" value={portfolioAiUsage} />
          <StatCard label="Resume Downloads" value={resumeDownloads} />
=======
>>>>>>> c974e6d18f7e4d84cefd23b3ad822ac4cf9981fc
        </div>
      ) : null}
      <section className="rounded-[28px] border border-admin-border bg-admin-card p-5">
        <h2 className="text-lg font-semibold text-admin-text">Range Summary</h2>
        <div className="mt-4 space-y-4">
          {summaries.map((item) => (
            <div key={item.range} className="rounded-2xl border border-admin-border bg-white p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="font-semibold text-admin-text">{item.range}</p>
                <p className="text-sm text-admin-text-muted">{item.pageViews} page views</p>
              </div>
              <div className="mt-3 grid gap-3 md:grid-cols-4">
                {[
                  ["Visitors", item.totalVisitors],
                  ["Unique", item.uniqueVisitors],
                  ["Blogs", item.blogViews],
                  ["Resume", item.resumeDownloads],
                ].map(([label, value]) => (
                  <div key={String(label)}>
                    <p className="text-xs text-admin-text-muted">{label}</p>
                    <div className="mt-2 h-2 rounded-full bg-slate-100">
                      <div className="h-2 rounded-full bg-admin-primary" style={{ width: `${Math.min(100, Number(value) * 10)}%` }} />
                    </div>
                    <p className="mt-1 text-sm font-semibold text-admin-text">{String(value)}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="rounded-[28px] border border-admin-border bg-admin-card p-5">
        <h2 className="text-lg font-semibold text-admin-text">Recent Activity Chart</h2>
        <div className="mt-4 flex items-end gap-2 overflow-x-auto">
          {recent.map((item, index) => (
            <div key={`${item.label}-${index}`} className="min-w-[52px] text-center">
              <div className="mx-auto w-8 rounded-t-lg bg-admin-primary" style={{ height: `${24 + (index % 7) * 10}px` }} />
              <p className="mt-2 text-[10px] text-admin-text-muted">{item.label.slice(5)}</p>
            </div>
          ))}
        </div>
      </section>
<<<<<<< HEAD
      <section className="grid gap-4 xl:grid-cols-2">
        <div className="rounded-[28px] border border-admin-border bg-admin-card p-5">
          <h2 className="text-lg font-semibold text-admin-text">Top Pages</h2>
          <div className="mt-4 space-y-3">
            {topPages.map((item) => (
              <div key={item._id} className="flex items-center justify-between rounded-2xl bg-white p-3">
                <span className="text-sm text-admin-text">{item._id}</span>
                <span className="text-sm font-semibold text-admin-text">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-[28px] border border-admin-border bg-admin-card p-5">
          <h2 className="text-lg font-semibold text-admin-text">Most Viewed Projects</h2>
          <div className="mt-4 space-y-3">
            {topProjects.map((item) => (
              <div key={item._id} className="flex items-center justify-between rounded-2xl bg-white p-3">
                <span className="text-sm text-admin-text">{item._id}</span>
                <span className="text-sm font-semibold text-admin-text">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-[28px] border border-admin-border bg-admin-card p-5">
          <h2 className="text-lg font-semibold text-admin-text">Most Searched Terms</h2>
          <div className="mt-4 space-y-3">
            {topSearchTerms.map((item) => (
              <div key={item._id} className="flex items-center justify-between rounded-2xl bg-white p-3">
                <span className="text-sm text-admin-text">{item._id}</span>
                <span className="text-sm font-semibold text-admin-text">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-[28px] border border-admin-border bg-admin-card p-5">
          <h2 className="text-lg font-semibold text-admin-text">GitHub Clicks</h2>
          <div className="mt-4 space-y-3">
            {githubClicks.map((item) => (
              <div key={item._id || "empty"} className="flex items-center justify-between rounded-2xl bg-white p-3">
                <span className="text-sm text-admin-text">{item._id || "GitHub"}</span>
                <span className="text-sm font-semibold text-admin-text">{item.count}</span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm text-admin-text-muted">Total contact submissions tracked: {contactSubmissions}</p>
        </div>
      </section>
=======
>>>>>>> c974e6d18f7e4d84cefd23b3ad822ac4cf9981fc
    </div>
  );
}
