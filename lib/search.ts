import "server-only";

<<<<<<< HEAD
import { buildPublicCorpus, rankPublicCorpus } from "@/lib/public-corpus";

export async function searchPortfolio(query: string) {
  const { entries } = await buildPublicCorpus();
  return rankPublicCorpus(query, entries, 12);
=======
import { getPortfolioSiteData } from "@/lib/portfolio/repository";
import { scoreFuzzy } from "@/lib/content-utils";

export async function searchPortfolio(query: string) {
  const siteData = await getPortfolioSiteData();
  const items = [
    ...siteData.projectsDetailed.map((project) => ({
      type: "project",
      title: project.title,
      href: `/projects/${project.slug || project.id}`,
      description: project.shortDescription,
      keywords: [...project.techStack, ...(project.tags || []), project.category],
    })),
    ...siteData.blogs.map((blog: any) => ({
      type: "blog",
      title: String(blog.title || ""),
      href: `/blogs/${blog.slug || ""}`,
      description: String(blog.excerpt || blog.content || ""),
      keywords: [...(blog.tags || []), ...(blog.categories || [])],
    })),
    ...siteData.skillsDetailed.map((skill) => ({
      type: "skill",
      title: skill.name,
      href: "#skills",
      description: skill.category,
      keywords: [skill.category],
    })),
    ...siteData.experience.map((item) => ({
      type: "experience",
      title: item.role,
      href: "#journey",
      description: item.summary,
      keywords: [item.period],
    })),
  ];

  return items
    .map((item) => ({
      ...item,
      score: scoreFuzzy(query, `${item.title} ${item.description} ${item.keywords.join(" ")}`),
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 12);
>>>>>>> c974e6d18f7e4d84cefd23b3ad822ac4cf9981fc
}
