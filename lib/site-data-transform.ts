import type {
  DynamicSectionId,
  SectionId,
  SectionRecord,
  SectionRendererId,
  SiteData,
  SiteSectionBlock,
} from "@/src/types/site-data";

import seedData from "@/src/data/siteData.json";

const CORE_RENDERERS = new Set([
  "hero",
  "about",
  "skills",
  "projects",
  "working",
  "completed",
  "reviews",
  "journey",
  "education",
  "blogs",
  "services",
  "contact",
  "faq",
  "achievements",
  "companies",
  "certificates",
  "open-source",
  "blogs",
  "github",
  "footer",
  "generic",
]);

const CORE_SECTION_IDS = new Set([
  "hero",
  "about",
  "skills",
  "projects",
  "working",
  "completed",
  "reviews",
  "journey",
  "education",
  "blogs",
  "services",
  "contact",
  "faq",
  "achievements",
  "companies",
  "certificates",
  "open-source",
  "blogs",
  "github",
  "footer",
]);

function normalizeSectionRenderer(sectionId: string, renderer?: string) {
  if (sectionId === "blogs") return "blogs";
  if (sectionId === "footer") return "footer";
  if (CORE_RENDERERS.has(sectionId)) return sectionId;
  const value = (renderer || "").trim();
  if (!value) return sectionId;
  return CORE_RENDERERS.has(value) ? value : "generic";
}

function cloneSeedData(): SiteData {
  return JSON.parse(JSON.stringify(seedData)) as SiteData;
}

function sectionSeed(
  seedSections: Partial<Record<string, Partial<SiteSectionBlock>>>,
  sectionId: string,
) {
  return seedSections[sectionId];
}

function controlOrder(sectionId: string, controls?: SiteData["sectionControls"]) {
  const control = controls?.find((item) => item.id === sectionId);
  return control?.order;
}

function makeBlock<K extends DynamicSectionId>(
  key: K,
  incoming: Partial<SiteSectionBlock> | undefined,
  patch: Pick<SiteSectionBlock, "data" | "items">,
): SiteSectionBlock {
  return {
    id: key,
    label: incoming?.label?.trim() || key,
    renderer: normalizeSectionRenderer(key, incoming?.renderer || key),
    enabled: incoming?.enabled ?? (incoming as any)?.isEnabled ?? true,
    order: incoming?.order ?? 0,
    layout: incoming?.layout || "default",
    status: incoming?.status || "published",
    nav: {
      show: incoming?.nav?.show ?? (incoming as any)?.showOnHomepage ?? false,
      href: incoming?.nav?.href || `#${key}`,
      label: incoming?.nav?.label || incoming?.label || key,
    },
    emptyMessage: incoming?.emptyMessage || "",
    textBlocks: (incoming?.textBlocks || []).map((block) => ({
      ...block,
      sectionId: block.sectionId || key,
    })),
    settings: incoming?.settings || {},
    data: patch.data ?? incoming?.data ?? {},
    items: patch.items ?? incoming?.items ?? [],
    showOnHomepage: (incoming as any)?.showOnHomepage ?? incoming?.nav?.show ?? CORE_SECTION_IDS.has(key),
  };
}

function resolveHomepageProjects(input: Partial<SiteData> & Record<string, any>) {
  const nested = input.websiteControl?.homepageProjects;
  const legacy = input.homepageProjectSettings;
  const source = (nested || legacy || {}) as {
    count?: 3 | 4 | 6 | 8 | 10 | "all";
    buttonText?: string;
  };
  return {
    count: source.count ?? 6,
    buttonText: String(source.buttonText || "View More Projects"),
  };
}

function normalizeProjectItem(project: any, index: number) {
  const title = String(project?.title || `Project ${index + 1}`);
  const techStack = Array.isArray(project?.techStack) ? project.techStack : Array.isArray(project?.tech) ? project.tech : [];
  const keyFeatures = Array.isArray(project?.keyFeatures) ? project.keyFeatures : Array.isArray(project?.features) ? project.features : [];
  const responsibilities = Array.isArray(project?.responsibilities) ? project.responsibilities : Array.isArray(project?.keyResponsibilities) ? project.keyResponsibilities : [];
  const skillsApplied = Array.isArray(project?.skillsApplied) ? project.skillsApplied : [];
  return {
    id: String(project?.id || `project-${index + 1}`),
    slug: String(project?.slug || project?.id || title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")),
    title,
    subtitle: String(project?.subtitle || ""),
    shortDescription: String(project?.shortDescription || project?.description || ""),
    longDescription: String(project?.longDescription || project?.fullDescription || project?.description || ""),
    fullDescription: String(project?.fullDescription || project?.longDescription || project?.description || ""),
    status: String(project?.status || "In Progress"),
    projectType: String(project?.projectType || "Personal Project"),
    industry: String(project?.industry || ""),
    featuredMirror: Boolean(project?.featuredMirror ?? project?.isFeatured),
    confidentialProject: Boolean(project?.confidentialProject),
    techStack,
    category: String(project?.category || "Project"),
    tags: Array.isArray(project?.tags) ? project.tags : [],
    featuredBadge: String(project?.featuredBadge || ""),
    image: String(project?.image || project?.thumbnail || ""),
    thumbnail: String(project?.thumbnail || project?.image || ""),
    coverImage: String(project?.coverImage || project?.banner || project?.image || ""),
    galleryImages: Array.isArray(project?.galleryImages) ? project.galleryImages : [],
    uiScreenshots: Array.isArray(project?.uiScreenshots) ? project.uiScreenshots : [],
    demoVideoUrl: String(project?.demoVideoUrl || ""),
    architectureDiagram: String(project?.architectureDiagram || ""),
    liveDemoUrl: String(project?.liveDemoUrl || project?.liveUrl || ""),
    githubUrl: String(project?.githubUrl || ""),
    backendRepo: String(project?.backendRepo || ""),
    apiDocumentationUrl: String(project?.apiDocumentationUrl || ""),
    documentationUrl: String(project?.documentationUrl || ""),
    documentation: String(project?.documentation || project?.documentationUrl || ""),
    figmaUrl: String(project?.figmaUrl || ""),
    caseStudyUrl: String(project?.caseStudyUrl || ""),
    problemStatement: String(project?.problemStatement || project?.problem || ""),
    solution: String(project?.solution || ""),
    targetUsers: String(project?.targetUsers || ""),
    businessValue: String(project?.businessValue || ""),
    impact: String(project?.impact || ""),
    myRole: String(project?.myRole || project?.role || ""),
    company: String(project?.company || ""),
    teamSize: String(project?.teamSize || ""),
    duration: String(project?.duration || ""),
    startDate: String(project?.startDate || ""),
    endDate: String(project?.endDate || ""),
    cloudHosting: String(project?.cloudHosting || project?.hosting || ""),
    apisServicesUsed: String(project?.apisServicesUsed || project?.apisIntegrations || project?.apiFlow || ""),
    confidentialNote: String(project?.confidentialNote || ""),
    keyFeatures,
    keyResponsibilities: Array.isArray(project?.keyResponsibilities) ? project.keyResponsibilities : responsibilities,
    skillsApplied,
    coreModules: Array.isArray(project?.coreModules) ? project.coreModules : [],
    futureRoadmap: Array.isArray(project?.futureRoadmap) ? project.futureRoadmap : Array.isArray(project?.futureImprovements) ? project.futureImprovements : [],
    challengesFaced: String(project?.challengesFaced || project?.challenges || ""),
    learnings: String(project?.learnings || project?.lessonsLearned || ""),
    frontend: String(project?.frontend || ""),
    backend: String(project?.backend || ""),
    database: String(project?.database || project?.databaseSchema || ""),
    authentication: String(project?.authentication || ""),
    hosting: String(project?.hosting || project?.cloudHosting || ""),
    apisIntegrations: String(project?.apisIntegrations || project?.apiFlow || ""),
    aiMlUsed: String(project?.aiMlUsed || ""),
    architectureNotes: String(project?.architectureNotes || project?.folderStructure || ""),
    techBadges: Array.isArray(project?.techBadges) ? project.techBadges : [],
    currentProgress: Number(project?.currentProgress || 0),
    draft: Boolean(project?.draft),
    published: project?.published !== false,
    featured: Boolean(project?.featured ?? project?.isFeatured),
    order: Number(project?.order ?? index + 1),
    metaTitle: String(project?.metaTitle || ""),
    metaDescription: String(project?.metaDescription || ""),
    keywords: Array.isArray(project?.keywords) ? project.keywords : [],
    openGraphImage: String(project?.openGraphImage || project?.banner || project?.image || ""),
    customFields: Array.isArray(project?.customFields) ? project.customFields : [],
    overview: String(project?.overview || ""),
    problem: String(project?.problem || project?.problemStatement || ""),
    responsibilities,
    features: Array.isArray(project?.features) ? project.features : keyFeatures,
    screenshots: Array.isArray(project?.screenshots) ? project.screenshots : [],
    databaseSchema: String(project?.databaseSchema || ""),
    apiFlow: String(project?.apiFlow || ""),
    folderStructure: String(project?.folderStructure || ""),
    challenges: String(project?.challenges || project?.challengesFaced || ""),
    lessonsLearned: String(project?.lessonsLearned || project?.learnings || ""),
    futureImprovements: Array.isArray(project?.futureImprovements) ? project.futureImprovements : [],
    timeline: String(project?.timeline || ""),
    readingTimeMinutes: Number(project?.readingTimeMinutes || 1),
    totalViews: Number(project?.totalViews || 0),
    uniqueViews: Number(project?.uniqueViews || 0),
    likes: Number(project?.likes || 0),
    isEnabled: project?.isEnabled !== false,
  };
}

function resolveSectionItems<T>(
  sectionItems: T[] | undefined,
  legacyItems: T[] | undefined,
  bootstrapItems: T[]
): T[] {
  if (sectionItems !== undefined) return sectionItems;
  if (legacyItems !== undefined) return legacyItems;
  return bootstrapItems;
}

function buildSectionBlockFromInput(key: string, incoming: Partial<SiteSectionBlock> | undefined, fallback?: Partial<SiteSectionBlock>): SiteSectionBlock {
  const merged = { ...(fallback || {}), ...(incoming || {}) } as Partial<SiteSectionBlock>;
  return {
    id: key,
    label: merged.label?.trim() || key,
    renderer: normalizeSectionRenderer(key, merged.renderer || key),
    enabled: merged.enabled ?? true,
    order: merged.order ?? 0,
    layout: merged.layout || "default",
    status: merged.status || "published",
    nav: {
      show: merged.nav?.show ?? merged.showOnHomepage ?? false,
      href: merged.nav?.href || `#${key}`,
      label: merged.nav?.label || merged.label || key,
    },
    emptyMessage: merged.emptyMessage || "",
    textBlocks: (merged.textBlocks || []).map((block) => ({
      ...block,
      sectionId: block.sectionId || key,
    })),
    settings: merged.settings || {},
    data: merged.data || {},
    items: merged.items || [],
    showOnHomepage: merged.showOnHomepage ?? merged.nav?.show ?? CORE_SECTION_IDS.has(key),
  };
}

export function summarizeSectionCounts(sections?: SectionRecord) {
  const ids = ["hero", "about", "skills", "projects", "working", "completed", "reviews", "journey", "services", "faq", "achievements", "companies", "certificates", "open-source", "github", "contact", "footer"] as const;
  return Object.fromEntries(
    ids.map((id) => [id, Array.isArray(sections?.[id]?.items) ? sections[id]!.items.length : null])
  ) as Record<(typeof ids)[number], number | null>;
}

export function normalizeSiteData(input: SiteData): SiteData {
  const sectionsInput = input.sections || ({} as SectionRecord);
  const seedSections = cloneSeedData().sections || {};
  const educationItems: any[] = Array.isArray(sectionsInput.education?.items) ? [...sectionsInput.education.items] : [];
  const heroSeed = sectionSeed(seedSections, "hero");
  const themeMode = input.websiteSettings?.themeMode || (input.websiteSettings as SiteData["websiteSettings"] & { theme?: SiteData["websiteSettings"]["themeMode"] })?.theme || "light";

  const sections: SectionRecord = {
    hero: makeBlock("hero", sectionsInput.hero, {
      data: {
        eyebrow: sectionsInput.hero?.data?.eyebrow ?? heroSeed?.data?.eyebrow ?? "",
        title: sectionsInput.hero?.data?.title ?? heroSeed?.data?.title ?? "",
        animatedRole: sectionsInput.hero?.data?.animatedRole ?? heroSeed?.data?.animatedRole ?? "",
        description: sectionsInput.hero?.data?.description ?? heroSeed?.data?.description ?? "",
        primaryCtaLabel: sectionsInput.hero?.data?.primaryCtaLabel ?? heroSeed?.data?.primaryCtaLabel ?? "",
        primaryCtaHref: sectionsInput.hero?.data?.primaryCtaHref ?? heroSeed?.data?.primaryCtaHref ?? "",
        secondaryCtaLabel: sectionsInput.hero?.data?.secondaryCtaLabel ?? heroSeed?.data?.secondaryCtaLabel ?? "",
        secondaryCtaHref: sectionsInput.hero?.data?.secondaryCtaHref ?? heroSeed?.data?.secondaryCtaHref ?? "",
        badges: sectionsInput.hero?.data?.badges ?? heroSeed?.data?.badges ?? [],
        stats: Array.isArray(sectionsInput.about?.items) ? (sectionsInput.about.items as SiteData["about"]["stats"]) : [],
        techStack: sectionsInput.hero?.data?.techStack ?? heroSeed?.data?.techStack ?? [],
      },
      items: [],
    }),
    about: makeBlock("about", sectionsInput.about, {
      data: {
        eyebrow: sectionsInput.about?.data?.eyebrow ?? "",
        title: sectionsInput.about?.data?.title ?? "",
        description: sectionsInput.about?.data?.description ?? "",
        intro: sectionsInput.about?.data?.intro ?? "",
      },
      items: Array.isArray(sectionsInput.about?.items) ? (sectionsInput.about.items as SiteData["about"]["stats"]) : [],
    }),
    skills: makeBlock("skills", sectionsInput.skills, {
      data: {
        eyebrow: sectionsInput.skills?.data?.eyebrow ?? "",
        title: sectionsInput.skills?.data?.title ?? "",
        description: sectionsInput.skills?.data?.description ?? "",
        learningTitle: sectionsInput.skills?.data?.learningTitle ?? "",
        learningItems: sectionsInput.skills?.data?.learningItems ?? [],
      },
      items: resolveSectionItems(
        sectionsInput.skills?.items as SiteData["skillsDetailed"] | undefined,
        input.skillsDetailed.length ? input.skillsDetailed : undefined,
        input.skills.length
          ? input.skills.map((name, index) => ({
              id: `skill-${index + 1}`,
              name,
              category: "Tools",
              icon: "",
              level: 80,
            }))
          : []
      ),
    }),
    projects: makeBlock("projects", sectionsInput.projects, {
      data: {
        eyebrow: sectionsInput.projects?.data?.eyebrow ?? "",
        title: sectionsInput.projects?.data?.title ?? "",
        description: sectionsInput.projects?.data?.description ?? "",
        homepageLimit: sectionsInput.projects?.data?.homepageLimit ?? 6,
        homepageButtonText: sectionsInput.projects?.data?.homepageButtonText ?? "View More Projects",
      },
      items: resolveSectionItems(
        sectionsInput.projects?.items as SiteData["projectsDetailed"] | undefined,
        undefined,
        input.projects.map((project, index) => normalizeProjectItem(project, index))
      ).sort((a: any, b: any) => Number(a.order ?? 0) - Number(b.order ?? 0)),
    }),
    working: makeBlock("working", sectionsInput.working, {
      data: {
        eyebrow: sectionsInput.working?.data?.eyebrow ?? "",
        title: sectionsInput.working?.data?.title ?? "",
        description: sectionsInput.working?.data?.description ?? "",
      },
      items: resolveSectionItems(sectionsInput.working?.items as SiteData["workingProjects"] | undefined, undefined, []),
    }),
    completed: makeBlock("completed", sectionsInput.completed, {
      data: {
        eyebrow: sectionsInput.completed?.data?.eyebrow ?? "",
        title: sectionsInput.completed?.data?.title ?? "",
        description: sectionsInput.completed?.data?.description ?? "",
      },
      items: resolveSectionItems(
        sectionsInput.completed?.items as SiteData["projectsDetailed"] | undefined,
        undefined,
        Array.isArray(input.completedProjects)
          ? input.completedProjects.map((project, index) =>
              normalizeProjectItem(
                {
                  id: `completed-${index + 1}`,
                  slug: String((project as any)?.slug || ""),
                  title: project.title,
                  shortDescription: String((project as any)?.workDone || ""),
                  longDescription: String((project as any)?.workDone || ""),
                  myRole: String((project as any)?.role || ""),
                  timeline: String((project as any)?.timeline || ""),
                  liveDemoUrl: String((project as any)?.link || ""),
                  githubUrl: String((project as any)?.githubUrl || ""),
                  projectType: "Completed Project",
                  category: "Completed",
                  status: "Completed",
                  featured: false,
                  isEnabled: true,
                },
                index
              )
            )
          : []
      ),
    }),
    reviews: makeBlock("reviews", sectionsInput.reviews, {
      data: {
        eyebrow: sectionsInput.reviews?.data?.eyebrow ?? "",
        title: sectionsInput.reviews?.data?.title ?? "",
        description: sectionsInput.reviews?.data?.description ?? "",
      },
      items: resolveSectionItems(
        sectionsInput.reviews?.items as SiteData["testimonialsDetailed"] | undefined,
        undefined,
        input.testimonialsDetailed.length
          ? input.testimonialsDetailed
          : input.reviews.map((review, index) => ({
            id: `review-${index + 1}`,
            clientName: review.clientName,
            roleCompany: review.website,
            message: review.quote,
            image: review.icon || "",
          }))
      ),
    }),
    journey: makeBlock("journey", sectionsInput.journey, {
      data: {
        eyebrow: sectionsInput.journey?.data?.eyebrow ?? "",
        title: sectionsInput.journey?.data?.title ?? "",
        description: sectionsInput.journey?.data?.description ?? "",
        currentWorkTitle: sectionsInput.journey?.data?.currentWorkTitle ?? "",
        currentWork: sectionsInput.journey?.data?.currentWork ?? "",
        milestones: sectionsInput.journey?.data?.milestones ?? [],
      },
      items: resolveSectionItems(sectionsInput.journey?.items as SiteData["experience"] | undefined, undefined, input.experience.length ? input.experience : []),
    }),
    education: makeBlock("education", sectionsInput.education, {
      data: {
        eyebrow: sectionsInput.education?.data?.eyebrow ?? "",
        title: sectionsInput.education?.data?.title ?? "",
        description: sectionsInput.education?.data?.description ?? "",
      },
      items: educationItems,
    }),
    services: makeBlock("services", sectionsInput.services, {
      data: {
        eyebrow: sectionsInput.services?.data?.eyebrow ?? "",
        title: sectionsInput.services?.data?.title ?? "",
        description: sectionsInput.services?.data?.description ?? "",
      },
      items: resolveSectionItems(sectionsInput.services?.items as SiteData["services"] | undefined, undefined, input.services.length ? input.services : []),
    }),
    contact: makeBlock("contact", sectionsInput.contact, {
      data: {
        eyebrow: sectionsInput.contact?.data?.eyebrow ?? "",
        title: sectionsInput.contact?.data?.title ?? "",
        description: sectionsInput.contact?.data?.description ?? "",
        cardTitle: sectionsInput.contact?.data?.cardTitle ?? "",
        cardDescription: sectionsInput.contact?.data?.cardDescription ?? "",
        formTitle: sectionsInput.contact?.data?.formTitle ?? "",
      },
      items: resolveSectionItems(sectionsInput.contact?.items as SiteData["socials"] | undefined, undefined, input.socials.length ? input.socials : []),
    }),
    blogs: makeBlock("blogs", sectionsInput.blogs, {
      data: {
        eyebrow: sectionsInput.blogs?.data?.eyebrow ?? "",
        title: sectionsInput.blogs?.data?.title ?? "",
        description: sectionsInput.blogs?.data?.description ?? "",
      },
      items: resolveSectionItems(sectionsInput.blogs?.items as SiteData["blogs"] | undefined, undefined, input.blogs.length ? input.blogs : []),
    }),
    faq: makeBlock("faq", sectionsInput.faq, {
      data: {
        eyebrow: sectionsInput.faq?.data?.eyebrow ?? "FAQ",
        title: sectionsInput.faq?.data?.title ?? "Frequently Asked Questions",
        description: sectionsInput.faq?.data?.description ?? "",
      },
      items: resolveSectionItems(sectionsInput.faq?.items as any[] | undefined, undefined, []),
    }),
    achievements: makeBlock("achievements", sectionsInput.achievements, {
      data: {
        eyebrow: sectionsInput.achievements?.data?.eyebrow ?? "Highlights",
        title: sectionsInput.achievements?.data?.title ?? "Achievements",
        description: sectionsInput.achievements?.data?.description ?? "",
      },
      items: resolveSectionItems(sectionsInput.achievements?.items as any[] | undefined, undefined, []),
    }),
    companies: makeBlock("companies", sectionsInput.companies, {
      data: {
        eyebrow: sectionsInput.companies?.data?.eyebrow ?? "Experience",
        title: sectionsInput.companies?.data?.title ?? "Companies Worked With",
        description: sectionsInput.companies?.data?.description ?? "",
      },
      items: resolveSectionItems(sectionsInput.companies?.items as any[] | undefined, undefined, []),
    }),
    certificates: makeBlock("certificates", sectionsInput.certificates, {
      data: {
        eyebrow: sectionsInput.certificates?.data?.eyebrow ?? "Credentials",
        title: sectionsInput.certificates?.data?.title ?? "Certificates",
        description: sectionsInput.certificates?.data?.description ?? "",
      },
      items: resolveSectionItems(sectionsInput.certificates?.items as any[] | undefined, undefined, []),
    }),
    "open-source": makeBlock("open-source", sectionsInput["open-source"], {
      data: {
        eyebrow: sectionsInput["open-source"]?.data?.eyebrow ?? "Open Source",
        title: sectionsInput["open-source"]?.data?.title ?? "Open Source",
        description: sectionsInput["open-source"]?.data?.description ?? "",
      },
      items: resolveSectionItems(sectionsInput["open-source"]?.items as any[] | undefined, undefined, []),
    }),
    github: makeBlock("github", sectionsInput.github, {
      data: {},
      items: resolveSectionItems(sectionsInput.github?.items as any[] | undefined, undefined, []),
    }),
    footer: makeBlock("footer", sectionsInput.footer, {
      data: {
        copyrightText: sectionsInput.footer?.data?.copyrightText ?? "",
        ctaLabel: sectionsInput.footer?.data?.ctaLabel ?? "",
        ctaHref: sectionsInput.footer?.data?.ctaHref ?? "",
      },
      items: resolveSectionItems(sectionsInput.footer?.items as any[] | undefined, undefined, input.shell?.footer?.quickLinks || []),
    }),
  };

  for (const [sectionId, section] of Object.entries(sectionsInput)) {
    if (sectionId in sections) continue;
    sections[sectionId] = buildSectionBlockFromInput(sectionId, section, seedSections[sectionId]);
  }

  for (const [sectionId, block] of Object.entries(sections)) {
    const preferredOrder = controlOrder(sectionId, input.sectionControls) ?? block.order ?? 0;
    block.order = preferredOrder;
  }

  const normalizedSectionControls = input.sectionControls?.length
    ? input.sectionControls
        .map((control, index) => ({
          ...control,
          order: control.order ?? index + 1,
        }))
        .sort((a, b) => a.order - b.order)
    : [];

  const nav = input.nav?.length
    ? input.nav
    : Object.values(sections)
        .filter((section) => section.nav?.show)
        .sort((a, b) => a.order - b.order)
        .map((section) => ({
          label: section.nav?.label || section.label,
          href: section.nav?.href || `#${section.id}`,
        }));

  return {
    ...input,
    websiteSettings: {
      ...input.websiteSettings,
      themeMode,
    },
    aiConfig: {
      enabled: input.aiConfig?.enabled ?? true,
      model: input.aiConfig?.model || "gemini-2.5-flash",
      temperature: input.aiConfig?.temperature ?? 0.2,
      maxTokens: input.aiConfig?.maxTokens ?? 700,
      maxContextChunks: input.aiConfig?.maxContextChunks ?? 6,
      confidenceThreshold: input.aiConfig?.confidenceThreshold ?? 0.2,
    },
    shell: {
      navbar: {
        desktopCtaLabel: input.shell?.navbar?.desktopCtaLabel || "",
        desktopCtaHref: input.shell?.navbar?.desktopCtaHref || "",
        mobileMenuLabel: input.shell?.navbar?.mobileMenuLabel || "",
        brandBadgePrefix: input.shell?.navbar?.brandBadgePrefix || "",
      },
      footer: {
        copyrightText: input.shell?.footer?.copyrightText ?? input.websiteSettings?.footerText ?? "",
        backToTopLabel: input.shell?.footer?.backToTopLabel || "",
        quickLinks: input.shell?.footer?.quickLinks || [],
        ctaLabel: input.shell?.footer?.ctaLabel || "",
        ctaHref: input.shell?.footer?.ctaHref || "",
      },
      search: {
        buttonLabel: input.shell?.search?.buttonLabel || "",
        shortcutLabel: input.shell?.search?.shortcutLabel || "",
        inputPlaceholder: input.shell?.search?.inputPlaceholder || "",
        emptyPrompt: input.shell?.search?.emptyPrompt || "",
      },
      assistant: {
        buttonLabel: input.shell?.assistant?.buttonLabel || "",
        panelTitle: input.shell?.assistant?.panelTitle || "",
        panelDescription: input.shell?.assistant?.panelDescription || "",
        inputPlaceholder: input.shell?.assistant?.inputPlaceholder || "",
        submitLabel: input.shell?.assistant?.submitLabel || "",
        loadingLabel: input.shell?.assistant?.loadingLabel || "",
      },
    },
    nav,
    sectionControls: normalizedSectionControls.length ? normalizedSectionControls : input.sectionControls,
    sections,
    projectsDetailed: sections.projects.items as SiteData["projectsDetailed"],
    projects: (sections.projects.items as SiteData["projectsDetailed"]).map((project) => ({
      title: project.title,
      description: project.shortDescription,
      image: project.image,
      tech: project.techStack,
      liveUrl: project.liveDemoUrl,
      githubUrl: project.githubUrl,
    })),
    skillsDetailed: (sections.skills.items as SiteData["skillsDetailed"]).map((skill: any) => ({
      ...skill,
      name: String(skill.name || skill.title || ""),
      title: String(skill.title || skill.name || ""),
    })),
    skills: (sections.skills.items as SiteData["skillsDetailed"]).map((skill: any) => String(skill.name || skill.title || "")).filter(Boolean),
    learningPhase: ((sections.skills.data as Record<string, unknown>).learningItems as string[] | undefined) ?? [],
    workingProjects: sections.working.items as SiteData["workingProjects"],
    completedProjects: sections.completed.items as SiteData["completedProjects"],
    experience: sections.journey.items as SiteData["experience"],
    education: sections.education.items as SiteData["education"],
    journeyNow: {
      currentWork: String((sections.journey.data as Record<string, unknown>).currentWork || ""),
      ongoingMilestones: (((sections.journey.data as Record<string, unknown>).milestones as string[] | undefined) || []).filter(Boolean),
    },
    testimonialsDetailed: sections.reviews.items as SiteData["testimonialsDetailed"],
    reviews: (sections.reviews.items as SiteData["testimonialsDetailed"]).map((item) => ({
      clientName: item.clientName,
      website: item.roleCompany,
      quote: item.message,
      icon: item.image,
    })),
    socials: sections.contact.items as SiteData["socials"],
    services: sections.services.items as SiteData["services"],
    blogs: Array.isArray(input.blogs) ? input.blogs : [],
    heroTech: (((sections.hero.data as Record<string, unknown>).techStack as string[] | undefined) ?? []).filter(Boolean),
    about: {
      intro: String((sections.about.data as Record<string, unknown>).intro ?? ""),
      stats: sections.about.items as SiteData["about"]["stats"],
    },
    updatedAt: input.updatedAt || new Date().toISOString(),
    homepageProjectSettings: resolveHomepageProjects(input),
    githubConfig: {
      username: input.githubConfig?.username ?? "",
      enabled: input.githubConfig?.enabled ?? false,
      refreshInterval: input.githubConfig?.refreshInterval ?? 30,
      includePrivateRepos: input.githubConfig?.includePrivateRepos ?? false,
      includePrivateCommits: input.githubConfig?.includePrivateCommits ?? false,
      showLifetimeCommits: input.githubConfig?.showLifetimeCommits ?? true,
      showPrivateReposPublicly: input.githubConfig?.showPrivateReposPublicly ?? false,
      showPrivateCommitsPublicly: input.githubConfig?.showPrivateCommitsPublicly ?? false,
      publicDisplayMode: input.githubConfig?.publicDisplayMode ?? "publicOnly",
      commitCountMode: input.githubConfig?.commitCountMode ?? "publicCommitsOnly",
      repositorySelectionMode: input.githubConfig?.repositorySelectionMode ?? "all",
      selectedRepositories: input.githubConfig?.selectedRepositories ?? [],
      commitMessageIncludes: input.githubConfig?.commitMessageIncludes ?? [],
      commitMessageExcludes: input.githubConfig?.commitMessageExcludes ?? [],
      recentCommitsEnabled: input.githubConfig?.recentCommitsEnabled ?? true,
      recentCommitsLimit: input.githubConfig?.recentCommitsLimit ?? 10,
      recentCommitsHideRepositories: input.githubConfig?.recentCommitsHideRepositories ?? [],
      recentCommitsHideKeywords: input.githubConfig?.recentCommitsHideKeywords ?? [],
      recentCommitsSelectedRepositories: input.githubConfig?.recentCommitsSelectedRepositories ?? [],
      recentCommitsShowMessage: input.githubConfig?.recentCommitsShowMessage ?? true,
      recentCommitsShowRepository: input.githubConfig?.recentCommitsShowRepository ?? true,
      recentCommitsShowDate: input.githubConfig?.recentCommitsShowDate ?? true,
      recentCommitsShowAuthor: input.githubConfig?.recentCommitsShowAuthor ?? false,
      recentCommitsShowAvatar: input.githubConfig?.recentCommitsShowAvatar ?? false,
      recentCommitsSortNewest: input.githubConfig?.recentCommitsSortNewest ?? true,
      recentActivityEnabled: input.githubConfig?.recentActivityEnabled ?? true,
      recentActivityLimit: input.githubConfig?.recentActivityLimit ?? 10,
      recentActivityHiddenTypes: input.githubConfig?.recentActivityHiddenTypes ?? [],
      recentActivityHideRepositories: input.githubConfig?.recentActivityHideRepositories ?? [],
      recentActivityHideKeywords: input.githubConfig?.recentActivityHideKeywords ?? [],
      repositoryCardsLimit: input.githubConfig?.repositoryCardsLimit ?? 12,
      repositoryCardsSelectedRepositories: input.githubConfig?.repositoryCardsSelectedRepositories ?? [],
      repositoryCardsHideArchived: input.githubConfig?.repositoryCardsHideArchived ?? false,
      repositoryCardsHideForked: input.githubConfig?.repositoryCardsHideForked ?? false,
      repositoryCardsHidePrivate: input.githubConfig?.repositoryCardsHidePrivate ?? true,
      repositoryCardsSort: input.githubConfig?.repositoryCardsSort ?? "stars",
      repositoryCardsManualOrder: input.githubConfig?.repositoryCardsManualOrder ?? [],
      showTotalCommits: input.githubConfig?.showTotalCommits ?? true,
      showStars: input.githubConfig?.showStars ?? true,
      showFollowers: input.githubConfig?.showFollowers ?? true,
      showFollowing: input.githubConfig?.showFollowing ?? true,
      showForks: input.githubConfig?.showForks ?? true,
      showPullRequests: input.githubConfig?.showPullRequests ?? true,
      showIssues: input.githubConfig?.showIssues ?? true,
      showOrganizations: input.githubConfig?.showOrganizations ?? true,
      showContributionStreak: input.githubConfig?.showContributionStreak ?? true,
      pinnedProjectsLimit: input.githubConfig?.pinnedProjectsLimit ?? 6,
      pinnedProjectsOrder: input.githubConfig?.pinnedProjectsOrder ?? [],
      cardsPerRow: input.githubConfig?.cardsPerRow ?? 3,
      paginationSize: input.githubConfig?.paginationSize ?? 12,
      infiniteScroll: input.githubConfig?.infiniteScroll ?? false,
      showViewOnGitHubButtons: input.githubConfig?.showViewOnGitHubButtons ?? true,
      openLinksInNewTab: input.githubConfig?.openLinksInNewTab ?? true,
      showGitHubIcons: input.githubConfig?.showGitHubIcons ?? true,
      showLanguageColors: input.githubConfig?.showLanguageColors ?? true,
    },
  };
}
