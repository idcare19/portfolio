import "server-only";

import { createHash } from "crypto";
import { cookies, headers } from "next/headers";
import { connectToDatabase } from "@/lib/mongodb";
import { AnalyticsEvent } from "@/models/AnalyticsEvent";
import { Like } from "@/models/Like";
import { View } from "@/models/View";

type RangeKey = "today" | "last7Days" | "last30Days" | "allTime";

export async function getVisitorIdentity() {
  const cookieStore = await cookies();
  const headerStore = await headers();
  const existingVisitorId = cookieStore.get("portfolio_visitor_id")?.value;
  const existingSessionId = cookieStore.get("portfolio_session_id")?.value;
  const visitorId = existingVisitorId || crypto.randomUUID();
  const sessionId = existingSessionId || crypto.randomUUID();

  const ip = headerStore.get("x-forwarded-for") || headerStore.get("x-real-ip") || "unknown";
  const ipHash = createHash("sha256").update(ip).digest("hex");

  return { visitorId, sessionId, ipHash };
}

function getRangeStart(range: RangeKey) {
  const now = new Date();
  if (range === "today") return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (range === "last7Days") return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  if (range === "last30Days") return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  return null;
}

export async function trackAnalyticsEvent(input: {
  eventType: string;
  path: string;
  targetType?: string;
  targetSlug?: string;
  metadata?: Record<string, unknown>;
  referrer?: string;
  userAgent?: string;
  visitorId: string;
  sessionId: string;
}) {
  await connectToDatabase();
  await AnalyticsEvent.create({
    ...input,
    targetType: input.targetType || "",
    targetSlug: input.targetSlug || "",
    fingerprint: `${input.visitorId}:${input.sessionId}`,
    occurredAt: new Date(),
  });
}

export async function trackUniqueView(input: {
  targetType: "project" | "blog";
  targetSlug: string;
  path: string;
  visitorId: string;
  sessionId: string;
}) {
  await connectToDatabase();
  await View.updateOne(
    { targetType: input.targetType, targetSlug: input.targetSlug, visitorId: input.visitorId },
    { $setOnInsert: { ...input, occurredAt: new Date() } },
    { upsert: true }
  );
}

export async function toggleAnonymousLike(input: {
  targetType: "project" | "blog";
  targetSlug: string;
  visitorId: string;
  sessionId: string;
  ipHash: string;
}) {
  await connectToDatabase();
  const existing = await Like.findOne({
    targetType: input.targetType,
    targetSlug: input.targetSlug,
    visitorId: input.visitorId,
  });

  if (existing) {
    await Like.deleteOne({ _id: existing._id });
    return { liked: false };
  }

  await Like.create(input);
  return { liked: true };
}

export async function getLikeSummary(targetType: "project" | "blog", targetSlug: string, visitorId?: string) {
  await connectToDatabase();
  const [count, likedDoc] = await Promise.all([
    Like.countDocuments({ targetType, targetSlug }),
    visitorId ? Like.findOne({ targetType, targetSlug, visitorId }) : null,
  ]);
  return { count, liked: Boolean(likedDoc) };
}

export async function getViewSummary(targetType: "project" | "blog", targetSlug: string) {
  await connectToDatabase();
  const [uniqueViews, totalViews] = await Promise.all([
    View.countDocuments({ targetType, targetSlug }),
    AnalyticsEvent.countDocuments({ eventType: `${targetType}-view`, targetSlug }),
  ]);
  return { uniqueViews, totalViews };
}

export async function getAnalyticsSummary() {
  await connectToDatabase();
  const ranges: RangeKey[] = ["today", "last7Days", "last30Days", "allTime"];

  const summaries = await Promise.all(
    ranges.map(async (range) => {
      const start = getRangeStart(range);
      const match = start ? { occurredAt: { $gte: start } } : {};
      const [events, uniqueVisitors, projectViews, blogViews, resumeDownloads, contacts] = await Promise.all([
        AnalyticsEvent.countDocuments(match),
        AnalyticsEvent.distinct("visitorId", match).then((items) => items.length),
        AnalyticsEvent.countDocuments({ ...match, eventType: "project-view" }),
        AnalyticsEvent.countDocuments({ ...match, eventType: "blog-view" }),
        AnalyticsEvent.countDocuments({ ...match, eventType: "resume-download" }),
        AnalyticsEvent.countDocuments({ ...match, eventType: "contact-submit" }),
      ]);

      return {
        range,
        totalVisitors: events,
        uniqueVisitors,
        pageViews: events,
        projectViews,
        blogViews,
        resumeDownloads,
        contactSubmissions: contacts,
      };
    })
  );

  const recent = await AnalyticsEvent.aggregate([
    { $sort: { occurredAt: -1 } },
    { $limit: 60 },
    {
      $project: {
        _id: 0,
        label: { $dateToString: { format: "%Y-%m-%d", date: "$occurredAt" } },
        eventType: 1,
      },
    },
  ]);

  const [topPages, topProjects, topSearchTerms, portfolioAiUsage, githubClicks, resumeDownloads, contactSubmissions] = await Promise.all([
    AnalyticsEvent.aggregate([
      { $match: { eventType: "page-view" } },
      { $group: { _id: "$path", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]),
    AnalyticsEvent.aggregate([
      { $match: { eventType: "project-view", targetSlug: { $ne: "" } } },
      { $group: { _id: "$targetSlug", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]),
    AnalyticsEvent.aggregate([
      { $match: { eventType: "search-query" } },
      { $group: { _id: "$metadata.query", count: { $sum: 1 } } },
      { $match: { _id: { $type: "string", $ne: "" } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]),
    AnalyticsEvent.aggregate([
      { $match: { eventType: "portfolio-ai-ask" } },
      { $group: { _id: "$eventType", count: { $sum: 1 } } },
    ]),
    AnalyticsEvent.aggregate([
      { $match: { eventType: { $in: ["github-click", "search-result-click"] } } },
      { $group: { _id: "$targetSlug", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]),
    AnalyticsEvent.countDocuments({ eventType: "resume-download" }),
    AnalyticsEvent.countDocuments({ eventType: "contact-submit" }),
  ]);

  return {
    summaries,
    recent,
    topPages,
    topProjects,
    topSearchTerms,
    portfolioAiUsage: portfolioAiUsage[0]?.count || 0,
    githubClicks,
    resumeDownloads,
    contactSubmissions,
  };}
