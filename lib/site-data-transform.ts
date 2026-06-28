import type {
  DynamicSectionId,
  SectionId,
  SectionRecord,
  SectionRendererId,
  SiteData,
  SiteSectionBlock,
} from "@/src/types/site-data";

import seedData from "@/src/data/siteData.json";

const SECTION_ORDER = [
  "hero",
  "about",
  "skills",
  "projects",
  "working",
  "completed",
  "reviews",
  "journey",
  "education",
  "github",
  "services",
  "contact",
] as const;

function cloneSeedData(): SiteData {
  return JSON.parse(JSON.stringify(seedData)) as SiteData;
}

function sectionSeed(
  seedSections: Partial<Record<string, Partial<SiteSectionBlock>>>,
  sectionId: string,
) {
  return seedSections[sectionId];
}

function sectionOrder(sectionId: string, fallback = 0) {
  const index = SECTION_ORDER.indexOf(sectionId as (typeof SECTION_ORDER)[number]);
  return index >= 0 ? index + 1 : fallback;
}

function makeBlock<K extends DynamicSectionId>(
  key: K,
  incoming: Partial<SiteSectionBlock> | undefined,
  patch: Pick<SiteSectionBlock, "data" | "items">,
): SiteSectionBlock {
  return {
    id: key,
    label: incoming?.label?.trim() || key,
    renderer: incoming?.renderer || key,
    enabled: incoming?.enabled ?? true,
    order: incoming?.order ?? 0,
    layout: incoming?.layout || "default",
    status: incoming?.status || "published",
    nav: {
      show: incoming?.nav?.show ?? false,
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
  };
}

export function normalizeSiteData(input: SiteData): SiteData {
  const sectionsInput = input.sections || ({} as SectionRecord);
  const seedSections = cloneSeedData().sections || {};
  const heroSeed = sectionSeed(seedSections, "hero");
  const aboutSeed = sectionSeed(seedSections, "about");
  const skillsSeed = sectionSeed(seedSections, "skills");
  const projectsSeed = sectionSeed(seedSections, "projects");
  const workingSeed = sectionSeed(seedSections, "working");
  const completedSeed = sectionSeed(seedSections, "completed");
  const reviewsSeed = sectionSeed(seedSections, "reviews");
  const journeySeed = sectionSeed(seedSections, "journey");
  const educationSeed = sectionSeed(seedSections, "education");
  const servicesSeed = sectionSeed(seedSections, "services");
  const contactSeed = sectionSeed(seedSections, "contact");
  const blogsSeed = sectionSeed(seedSections, "blogs");
  const githubSeed = sectionSeed(seedSections, "github");
  const footerSeed = sectionSeed(seedSections, "footer");
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
        stats: sectionsInput.hero?.data?.stats ?? heroSeed?.data?.stats ?? [],
        techStack: sectionsInput.hero?.data?.techStack ?? heroSeed?.data?.techStack ?? [],
      },
      items: [],
    }),
    about: makeBlock("about", sectionsInput.about, {
      data: {
        eyebrow: sectionsInput.about?.data?.eyebrow ?? aboutSeed?.data?.eyebrow ?? "",
        title: sectionsInput.about?.data?.title ?? aboutSeed?.data?.title ?? "",
        description: sectionsInput.about?.data?.description ?? aboutSeed?.data?.description ?? "",
        intro: sectionsInput.about?.data?.intro ?? aboutSeed?.data?.intro ?? "",
      },
      items: Array.isArray(sectionsInput.about?.items)
        ? (sectionsInput.about.items as SiteData["about"]["stats"])
        : (Array.isArray(aboutSeed?.items) ? (aboutSeed.items as SiteData["about"]["stats"]) : []),
    }),
    skills: makeBlock("skills", sectionsInput.skills, {
      data: {
        eyebrow: sectionsInput.skills?.data?.eyebrow ?? skillsSeed?.data?.eyebrow ?? "",
        title: sectionsInput.skills?.data?.title ?? skillsSeed?.data?.title ?? "",
        description: sectionsInput.skills?.data?.description ?? skillsSeed?.data?.description ?? "",
        learningTitle: sectionsInput.skills?.data?.learningTitle ?? skillsSeed?.data?.learningTitle ?? "",
        learningItems: sectionsInput.skills?.data?.learningItems ?? skillsSeed?.data?.learningItems ?? [],
      },
      items:
        (sectionsInput.skills?.items as SiteData["skillsDetailed"] | undefined) ??
        (skillsSeed?.items as SiteData["skillsDetailed"] | undefined) ??
        (input.skillsDetailed.length
          ? input.skillsDetailed
          : input.skills.map((name, index) => ({
              id: `skill-${index + 1}`,
              name,
              category: "Tools",
              icon: "",
              level: 80,
            }))),
    }),
    projects: makeBlock("projects", sectionsInput.projects, {
      data: {
        eyebrow: sectionsInput.projects?.data?.eyebrow ?? projectsSeed?.data?.eyebrow ?? "",
        title: sectionsInput.projects?.data?.title ?? projectsSeed?.data?.title ?? "",
        description: sectionsInput.projects?.data?.description ?? projectsSeed?.data?.description ?? "",
      },
      items: input.projectsDetailed.length
        ? [...input.projectsDetailed].sort((a, b) => a.order - b.order)
        : input.projects.map((project, index) => ({
            id: `project-${index + 1}`,
            title: project.title,
            shortDescription: project.description,
            longDescription: project.description,
            techStack: project.tech,
            category: "Project",
            image: project.image,
            liveDemoUrl: project.liveUrl,
            githubUrl: project.githubUrl,
            featured: index < 3,
            order: index + 1,
          })),
    }),
    working: makeBlock("working", sectionsInput.working, {
      data: {
        eyebrow: sectionsInput.working?.data?.eyebrow ?? workingSeed?.data?.eyebrow ?? "",
        title: sectionsInput.working?.data?.title ?? workingSeed?.data?.title ?? "",
        description: sectionsInput.working?.data?.description ?? workingSeed?.data?.description ?? "",
      },
      items: input.workingProjects || [],
    }),
    completed: makeBlock("completed", sectionsInput.completed, {
      data: {
        eyebrow: sectionsInput.completed?.data?.eyebrow ?? completedSeed?.data?.eyebrow ?? "",
        title: sectionsInput.completed?.data?.title ?? completedSeed?.data?.title ?? "",
        description: sectionsInput.completed?.data?.description ?? completedSeed?.data?.description ?? "",
      },
      items: input.completedProjects || [],
    }),
    reviews: makeBlock("reviews", sectionsInput.reviews, {
      data: {
        eyebrow: sectionsInput.reviews?.data?.eyebrow ?? reviewsSeed?.data?.eyebrow ?? "",
        title: sectionsInput.reviews?.data?.title ?? reviewsSeed?.data?.title ?? "",
        description: sectionsInput.reviews?.data?.description ?? reviewsSeed?.data?.description ?? "",
      },
      items: input.testimonialsDetailed.length
        ? input.testimonialsDetailed
        : input.reviews.map((review, index) => ({
            id: `review-${index + 1}`,
            clientName: review.clientName,
            roleCompany: review.website,
            message: review.quote,
            image: review.icon || "",
          })),
    }),
    journey: makeBlock("journey", sectionsInput.journey, {
      data: {
        eyebrow: sectionsInput.journey?.data?.eyebrow ?? journeySeed?.data?.eyebrow ?? "",
        title: sectionsInput.journey?.data?.title ?? journeySeed?.data?.title ?? "",
        description: sectionsInput.journey?.data?.description ?? journeySeed?.data?.description ?? "",
        currentWorkTitle: sectionsInput.journey?.data?.currentWorkTitle ?? journeySeed?.data?.currentWorkTitle ?? "",
        currentWork: sectionsInput.journey?.data?.currentWork ?? journeySeed?.data?.currentWork ?? "",
        milestones: sectionsInput.journey?.data?.milestones ?? journeySeed?.data?.milestones ?? [],
      },
      items: input.experience,
    }),
    education: makeBlock("education", sectionsInput.education, {
      data: {
        eyebrow: sectionsInput.education?.data?.eyebrow ?? educationSeed?.data?.eyebrow ?? "",
        title: sectionsInput.education?.data?.title ?? educationSeed?.data?.title ?? "",
        description: sectionsInput.education?.data?.description ?? educationSeed?.data?.description ?? "",
      },
      items: input.education || [],
    }),
    services: makeBlock("services", sectionsInput.services, {
      data: {
        eyebrow: sectionsInput.services?.data?.eyebrow ?? servicesSeed?.data?.eyebrow ?? "",
        title: sectionsInput.services?.data?.title ?? servicesSeed?.data?.title ?? "",
        description: sectionsInput.services?.data?.description ?? servicesSeed?.data?.description ?? "",
      },
      items: input.services || [],
    }),
    contact: makeBlock("contact", sectionsInput.contact, {
      data: {
        eyebrow: sectionsInput.contact?.data?.eyebrow ?? contactSeed?.data?.eyebrow ?? "",
        title: sectionsInput.contact?.data?.title ?? contactSeed?.data?.title ?? "",
        description: sectionsInput.contact?.data?.description ?? contactSeed?.data?.description ?? "",
        cardTitle: sectionsInput.contact?.data?.cardTitle ?? contactSeed?.data?.cardTitle ?? "",
        cardDescription: sectionsInput.contact?.data?.cardDescription ?? contactSeed?.data?.cardDescription ?? "",
        formTitle: sectionsInput.contact?.data?.formTitle ?? contactSeed?.data?.formTitle ?? "",
      },
      items: input.socials,
    }),
    blogs: makeBlock("blogs", sectionsInput.blogs, {
      data: {
        eyebrow: sectionsInput.blogs?.data?.eyebrow ?? blogsSeed?.data?.eyebrow ?? "",
        title: sectionsInput.blogs?.data?.title ?? blogsSeed?.data?.title ?? "",
        description: sectionsInput.blogs?.data?.description ?? blogsSeed?.data?.description ?? "",
      },
      items: input.blogs,
    }),
    github: makeBlock("github", sectionsInput.github, {
      data: {
        eyebrow: sectionsInput.github?.data?.eyebrow ?? githubSeed?.data?.eyebrow ?? "",
        title: sectionsInput.github?.data?.title ?? githubSeed?.data?.title ?? "",
        description: sectionsInput.github?.data?.description ?? githubSeed?.data?.description ?? "",
      },
      items: [],
    }),
    footer: makeBlock("footer", sectionsInput.footer, {
      data: {
        copyrightText: sectionsInput.footer?.data?.copyrightText ?? footerSeed?.data?.copyrightText ?? "",
        ctaLabel: sectionsInput.footer?.data?.ctaLabel ?? footerSeed?.data?.ctaLabel ?? "",
        ctaHref: sectionsInput.footer?.data?.ctaHref ?? footerSeed?.data?.ctaHref ?? "",
      },
      items: sectionsInput.footer?.items ?? footerSeed?.items ?? [],
    }),
  };

  for (const [sectionId, block] of Object.entries(sections)) {
    block.order = sectionOrder(sectionId, block.order);
  }

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
    skillsDetailed: sections.skills.items as SiteData["skillsDetailed"],
    skills: (sections.skills.items as SiteData["skillsDetailed"]).map((skill) => skill.name),
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
    },
  };
}
