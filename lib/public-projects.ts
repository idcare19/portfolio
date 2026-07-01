import { getPortfolioSiteData } from "@/lib/portfolio/repository";
import { slugify } from "@/lib/content-utils";

export type PublicProject = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  shortDescription: string;
  longDescription: string;
  fullDescription: string;
  status: string;
  projectType: string;
  category: string;
  image: string;
  thumbnail: string;
  coverImage: string;
  banner: string;
  galleryImages: string[];
  uiScreenshots: string[];
  demoVideoUrl: string;
  architectureDiagram: string;
  liveDemoUrl: string;
  githubUrl: string;
  backendRepo: string;
  apiDocumentationUrl: string;
  figmaUrl: string;
  caseStudyUrl: string;
  documentationUrl: string;
  techStack: string[];
  techBadges: string[];
  tags: string[];
  client: string;
  company: string;
  role: string;
  teamSize: string;
  duration: string;
  startDate: string;
  endDate: string;
  features: string[];
  keyFeatures: string[];
  coreModules: string[];
  futureRoadmap: string[];
  responsibilities: string[];
  achievements: string[];
  problemStatement: string;
  solution: string;
  targetUsers: string;
  businessValue: string;
  impact: string;
  challengesFaced: string;
  learnings: string;
  frontend: string;
  backend: string;
  database: string;
  authentication: string;
  hosting: string;
  apisIntegrations: string;
  aiMlUsed: string;
  architectureNotes: string;
  featured: boolean;
  draft: boolean;
  published: boolean;
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
    subtitle: String(project?.subtitle || ""),
    shortDescription: String(project?.shortDescription || project?.description || ""),
    longDescription: String(project?.longDescription || project?.description || ""),
    fullDescription: String(project?.fullDescription || project?.longDescription || project?.description || ""),
    status: String(project?.status || project?.category || "Project"),
    projectType: String(project?.projectType || ""),
    category: String(project?.category || project?.status || "Project"),
    image: String(project?.image || project?.thumbnail || ""),
    thumbnail: String(project?.thumbnail || project?.image || ""),
    coverImage: String(project?.coverImage || project?.banner || project?.image || ""),
    banner: String(project?.banner || ""),
    galleryImages: asList(project?.galleryImages),
    uiScreenshots: asList(project?.uiScreenshots),
    demoVideoUrl: String(project?.demoVideoUrl || ""),
    architectureDiagram: String(project?.architectureDiagram || ""),
    liveDemoUrl: String(project?.liveDemoUrl || ""),
    githubUrl: String(project?.githubUrl || ""),
    backendRepo: String(project?.backendRepo || ""),
    apiDocumentationUrl: String(project?.apiDocumentationUrl || project?.documentationUrl || ""),
    figmaUrl: String(project?.figmaUrl || ""),
    caseStudyUrl: String(project?.caseStudyUrl || ""),
    documentationUrl: String(project?.documentationUrl || ""),
    techStack: asList(project?.techStack || project?.technologies),
    techBadges: asList(project?.techBadges),
    tags: asList(project?.tags),
    client: String(project?.client || ""),
    company: String(project?.company || ""),
    role: String(project?.role || ""),
    teamSize: String(project?.teamSize || ""),
    duration: String(project?.duration || ""),
    startDate: String(project?.startDate || ""),
    endDate: String(project?.endDate || ""),
    features: asList(project?.features),
    keyFeatures: asList(project?.keyFeatures || project?.features),
    coreModules: asList(project?.coreModules),
    futureRoadmap: asList(project?.futureRoadmap || project?.futureImprovements),
    responsibilities: asList(project?.responsibilities),
    achievements: asList(project?.achievements),
    problemStatement: String(project?.problemStatement || project?.problem || ""),
    solution: String(project?.solution || ""),
    targetUsers: String(project?.targetUsers || ""),
    businessValue: String(project?.businessValue || ""),
    impact: String(project?.impact || ""),
    challengesFaced: String(project?.challengesFaced || project?.challenges || ""),
    learnings: String(project?.learnings || project?.lessonsLearned || ""),
    frontend: String(project?.frontend || ""),
    backend: String(project?.backend || ""),
    database: String(project?.database || ""),
    authentication: String(project?.authentication || ""),
    hosting: String(project?.hosting || ""),
    apisIntegrations: String(project?.apisIntegrations || project?.apiFlow || ""),
    aiMlUsed: String(project?.aiMlUsed || ""),
    architectureNotes: String(project?.architectureNotes || project?.folderStructure || ""),
    featured: Boolean(project?.featured ?? project?.isFeatured),
    draft: Boolean(project?.draft),
    published: project?.published !== false,
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
