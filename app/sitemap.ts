import type { MetadataRoute } from "next";
import { getPublicProjects } from "@/lib/public-projects";
import { getPublishedBlogs } from "@/lib/portfolio/repository";

const siteUrl = "https://www.idcare19.me";
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const base = siteUrl.endsWith("/") ? siteUrl.slice(0, -1) : siteUrl;
  const [projects, blogs] = await Promise.all([getPublicProjects(), getPublishedBlogs()]);
  const routes = ["/", "/about", "/projects", "/blogs", "/blog", "/services", "/achievements", "/certificates", "/full-stack-developer-india", "/nextjs-developer-india", "/django-developer-india", "/freelance-web-developer", "/saas-development"];

  const staticEntries: MetadataRoute.Sitemap = routes.map((route) => ({
    url: `${base}${route}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: route === "/" ? 1 : 0.8,
  }));
  return [...staticEntries,
    ...projects.map((project) => ({ url: `${base}/projects/${project.slug}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.7 })),
    ...blogs.map((blog: any) => ({ url: `${base}/blogs/${blog.slug}`, lastModified: blog.updatedAt || blog.publishedAt || now, changeFrequency: "monthly" as const, priority: 0.6 })),
  ];
}
