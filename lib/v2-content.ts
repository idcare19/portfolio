import "server-only";

import { slugify } from "@/lib/content-utils";
import { connectToDatabase } from "@/lib/mongodb";
import { ActivityEntry } from "@/models/ActivityEntry";
import { ChangelogEntry } from "@/models/ChangelogEntry";
import { RoadmapItem } from "@/models/RoadmapItem";

export async function getRoadmapItems() {
  await connectToDatabase();
  const existing = await RoadmapItem.find({}).sort({ status: 1, order: 1, createdAt: 1 }).lean();
  if (existing.length) return existing;
  const seed = [
    { key: slugify("Analytics Dashboard"), title: "Analytics Dashboard", description: "Track visitors, views, clicks, and conversions.", status: "completed", order: 1, eta: "" },
    { key: slugify("AI Portfolio Assistant"), title: "AI Portfolio Assistant", description: "Grounded answers over portfolio content.", status: "in-progress", order: 2, eta: "July 2026" },
    { key: slugify("Advanced GitHub Insights"), title: "Advanced GitHub Insights", description: "Pinned repos, commits, languages, and contribution summary.", status: "planned", order: 3, eta: "July 2026" },
  ];
  await RoadmapItem.insertMany(seed);
  return RoadmapItem.find({}).sort({ status: 1, order: 1, createdAt: 1 }).lean();
}

export async function getChangelogEntries() {
  await connectToDatabase();
  const existing = await ChangelogEntry.find({}).sort({ publishedAt: -1, createdAt: -1 }).lean();
  if (existing.length) return existing;
  const now = new Date().toISOString();
  const seed = [
    {
      key: slugify("v2-0"),
      version: "v2.0",
      title: "Portfolio V2 foundation",
      summary: "Expanded the dynamic portfolio system with public routes and collection-backed content.",
      bullets: ["Added blogs", "Added resume page", "Introduced Cloudinary media uploads", "Stabilized MongoDB collection repository"],
      publishedAt: now,
      updatedAt: now,
    },
  ];
  await ChangelogEntry.insertMany(seed);
  return ChangelogEntry.find({}).sort({ publishedAt: -1, createdAt: -1 }).lean();
}

export async function getActivityEntries() {
  await connectToDatabase();
  const existing = await ActivityEntry.find({}).sort({ occurredAt: -1, createdAt: -1 }).lean();
  if (existing.length) return existing;
  const seed = [
    { key: slugify("Added Blog System"), title: "Added Blog System", details: "Introduced dynamic blog listing and detail routes.", type: "release", occurredAt: new Date().toISOString(), href: "/blogs" },
    { key: slugify("Published Portfolio V2"), title: "Published Portfolio V2", details: "Moved the portfolio onto collection-backed content.", type: "release", occurredAt: new Date(Date.now() - 86400000).toISOString(), href: "/" },
  ];
  await ActivityEntry.insertMany(seed);
  return ActivityEntry.find({}).sort({ occurredAt: -1, createdAt: -1 }).lean();
}
