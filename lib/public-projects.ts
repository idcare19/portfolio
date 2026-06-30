import { getPortfolioSiteData } from "@/lib/portfolio/repository";
import { slugify } from "@/lib/content-utils";

export type PublicProject = {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  status: string;
  category: string;
  image: string;
  thumbnail: string;
  banner: string;
  galleryImages: string[];
  liveDemoUrl: string;
  githubUrl: string;
  backendRepo: string;
  documentationUrl: string;
  techStack: string[];
  tags: string[];
  client: string;
  company: string;
  role: string;
  teamSize: string;
  duration: string;
  startDate: string;
  endDate: string;
  features: string[];
  responsibilities: string[];
  achievements: string[];
  featured: boolean;
  isEnabled: boolean;
  order: number;
  metaTitle: string;
  metaDescription: string;
  readingTimeMinutes: number;
};

function asList(value: unknown) {
  return Array.isArray(value) ? value.map(String).filter(Boolean) : [];
}

function normalizeProject(project: any, index: number): PublicProject {
  const title = String(project?.title || `Project ${index + 1}`);
  const slug = String(project?.slug || project?.id || slugify(title));
  return {
    id: String(project?.id || slug),
    slug,
    title,
    shortDescription: String(project?.shortDescription || project?.description || ""),
    longDescription: String(project?.longDescription || project?.description || ""),
    status: String(project?.status || project?.category || "Project"),
    category: String(project?.category || project?.status || "Project"),
    image: String(project?.image || project?.thumbnail || ""),
    thumbnail: String(project?.thumbnail || project?.image || ""),
    banner: String(project?.banner || ""),
    galleryImages: asList(project?.galleryImages),
    liveDemoUrl: String(project?.liveDemoUrl || ""),
    githubUrl: String(project?.githubUrl || ""),
    backendRepo: String(project?.backendRepo || ""),
    documentationUrl: String(project?.documentationUrl || ""),
    techStack: asList(project?.techStack || project?.technologies),
    tags: asList(project?.tags),
    client: String(project?.client || ""),
    company: String(project?.company || ""),
    role: String(project?.role || ""),
    teamSize: String(project?.teamSize || ""),
    duration: String(project?.duration || ""),
    startDate: String(project?.startDate || ""),
    endDate: String(project?.endDate || ""),
    features: asList(project?.features),
    responsibilities: asList(project?.responsibilities),
    achievements: asList(project?.achievements),
    featured: Boolean(project?.featured ?? project?.isFeatured),
    isEnabled: project?.isEnabled !== false,
    order: Number(project?.order ?? index + 1),
    metaTitle: String(project?.metaTitle || ""),
    metaDescription: String(project?.metaDescription || ""),
    readingTimeMinutes: Number(project?.readingTimeMinutes || 1),
  };
}

export async function getPublicProjects() {
  const data = await getPortfolioSiteData();
  const items = Array.isArray(data.sections?.projects?.items) ? data.sections.projects.items : [];
  return items
    .filter((project: any) => project?.isEnabled !== false)
    .map((project: any, index: number) => normalizeProject(project, index))
    .sort((a, b) => Number(b.featured) - Number(a.featured) || a.order - b.order || b.readingTimeMinutes - a.readingTimeMinutes);
}

export async function getPublicProjectBySlug(slug: string) {
  const projects = await getPublicProjects();
  return projects.find((project) => project.slug === slug || slugify(project.title) === slug) || null;
}
