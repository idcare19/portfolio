import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://portfolio-delta-dusky-86.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const base = siteUrl.endsWith("/") ? siteUrl.slice(0, -1) : siteUrl;
  const routes = ["/"];

  return routes.map((route) => ({
    url: `${base}${route}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: route === "/" ? 1 : 0.8,
  }));
}
