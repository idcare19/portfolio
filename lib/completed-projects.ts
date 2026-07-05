import { getPortfolioSiteData } from "@/lib/portfolio/repository";
import { slugify } from "@/lib/content-utils";
import { isConfidentialProject, type PublicProject } from "@/lib/public-projects";

function asList(value: unknown) {
  return Array.isArray(value) ? value.map(String).filter(Boolean) : [];
}

function ensureUniqueSlug(baseSlug: string, seen: Map<string, number>, fallback: string) {
  const clean = slugify(baseSlug || fallback);
  if (!clean) return fallback;
  const count = seen.get(clean) || 0;
  seen.set(clean, count + 1);
  return count === 0 ? clean : `${clean}-${count + 1}`;
}

function normalizeCompletedProject(project: any, index: number): PublicProject {
  const title = String(project?.title || `Completed Project ${index + 1}`);
  const slug = String(project?.slug || project?.id || slugify(title));
  return {
    id: String(project?.id || slug),
    slug,
    title,
    subtitle: String(project?.subtitle || ""),
    shortDescription: String(project?.shortDescription || project?.workDone || ""),
    longDescription: String(project?.longDescription || project?.workDone || ""),
    fullDescription: String(project?.fullDescription || project?.longDescription || project?.workDone || ""),
    status: String(project?.status || "Completed"),
    projectType: String(project?.projectType || "Completed Project"),
    industry: String(project?.industry || ""),
    confidentialProject: isConfidentialProject(project),
    category: String(project?.category || "Completed"),
    image: String(project?.image || ""),
    thumbnail: String(project?.thumbnail || project?.image || ""),
    coverImage: String(project?.coverImage || project?.banner || project?.image || ""),
    banner: String(project?.banner || ""),
    galleryImages: asList(project?.galleryImages),
    uiScreenshots: asList(project?.uiScreenshots),
    demoVideoUrl: String(project?.demoVideoUrl || ""),
    architectureDiagram: String(project?.architectureDiagram || ""),
    liveDemoUrl: String(project?.liveDemoUrl || project?.link || ""),
    githubUrl: String(project?.githubUrl || ""),
    backendRepo: String(project?.backendRepo || ""),
    apiDocumentationUrl: String(project?.apiDocumentationUrl || project?.documentationUrl || ""),
    figmaUrl: String(project?.figmaUrl || ""),
    caseStudyUrl: String(project?.caseStudyUrl || ""),
    documentationUrl: String(project?.documentationUrl || ""),
    techStack: asList(project?.techStack),
    techBadges: asList(project?.techBadges),
    tags: asList(project?.tags),
    client: String(project?.client || ""),
    company: String(project?.company || ""),
    myRole: String(project?.myRole || project?.role || ""),
    teamSize: String(project?.teamSize || ""),
    duration: String(project?.duration || project?.timeline || ""),
    startDate: String(project?.startDate || ""),
    endDate: String(project?.endDate || ""),
    cloudHosting: String(project?.cloudHosting || ""),
    apisServicesUsed: String(project?.apisServicesUsed || ""),
    features: asList(project?.features),
    keyFeatures: asList(project?.keyFeatures || project?.features),
    keyResponsibilities: asList(project?.keyResponsibilities || project?.responsibilities),
    skillsApplied: asList(project?.skillsApplied),
    coreModules: asList(project?.coreModules),
    futureRoadmap: asList(project?.futureRoadmap || project?.futureImprovements),
    responsibilities: asList(project?.responsibilities),
    achievements: asList(project?.achievements),
    problemStatement: String(project?.problemStatement || ""),
    solution: String(project?.solution || ""),
    targetUsers: String(project?.targetUsers || ""),
    businessValue: String(project?.businessValue || ""),
    impact: String(project?.impact || ""),
    challengesFaced: String(project?.challengesFaced || ""),
    learnings: String(project?.learnings || ""),
    frontend: String(project?.frontend || ""),
    backend: String(project?.backend || ""),
    database: String(project?.database || ""),
    authentication: String(project?.authentication || ""),
    hosting: String(project?.hosting || ""),
    apisIntegrations: String(project?.apisIntegrations || ""),
    aiMlUsed: String(project?.aiMlUsed || ""),
    architectureNotes: String(project?.architectureNotes || ""),
    featured: Boolean(project?.featured),
    draft: Boolean(project?.draft),
    published: project?.published !== false,
    isEnabled: project?.isEnabled !== false,
    order: Number(project?.order ?? index + 1),
    metaTitle: String(project?.metaTitle || ""),
    metaDescription: String(project?.metaDescription || ""),
    keywords: asList(project?.keywords),
    openGraphImage: String(project?.openGraphImage || project?.banner || project?.image || ""),
    readingTimeMinutes: Number(project?.readingTimeMinutes || 1),
    customFields: Array.isArray(project?.customFields) ? project.customFields : [],
    overview: String(project?.overview || ""),
    problem: String(project?.problem || ""),
    screenshot: "",
    databaseSchema: String(project?.databaseSchema || ""),
    apiFlow: String(project?.apiFlow || ""),
    folderStructure: String(project?.folderStructure || ""),
    challenges: String(project?.challenges || ""),
    lessonsLearned: String(project?.lessonsLearned || ""),
    futureImprovements: asList(project?.futureImprovements),
    timeline: String(project?.timeline || project?.duration || ""),
    totalViews: Number(project?.totalViews || 0),
    uniqueViews: Number(project?.uniqueViews || 0),
    likes: Number(project?.likes || 0),
  } as PublicProject;
}

export async function getPublicCompletedProjects() {
  const data = await getPortfolioSiteData();
  const items = Array.isArray(data.sections?.completed?.items) ? data.sections.completed.items : [];
  const seen = new Map<string, number>();
  return items
    .filter((project: any) => project?.isEnabled !== false)
    .map((project: any, index: number) => {
      const normalized = normalizeCompletedProject(project, index);
      return {
        ...normalized,
        slug: ensureUniqueSlug(project?.slug || normalized.slug || normalized.title, seen, normalized.title),
      };
    })
    .sort((a, b) => Number(b.featured) - Number(a.featured) || a.order - b.order || b.readingTimeMinutes - a.readingTimeMinutes);
}

export async function getPublicCompletedProjectBySlug(slug: string) {
  const projects = await getPublicCompletedProjects();
  return projects.find((project) => project.slug === slug || slugify(project.title) === slug) || null;
}
