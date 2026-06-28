import type {
  DynamicSectionId,
  SectionId,
  SectionRecord,
  SectionRendererId,
  SiteData,
  SiteSectionBlock,
} from "@/src/types/site-data";

import seedData from "@/src/data/siteData.json";

function cloneSeedData(): SiteData {
  return JSON.parse(JSON.stringify(seedData)) as SiteData;
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
  const themeMode = input.websiteSettings?.themeMode || (input.websiteSettings as SiteData["websiteSettings"] & { theme?: SiteData["websiteSettings"]["themeMode"] })?.theme || "light";

  const sections: SectionRecord = {
    hero: makeBlock("hero", sectionsInput.hero, {
      data: {
        eyebrow: sectionsInput.hero?.data?.eyebrow ?? seedSections.hero?.data?.eyebrow ?? input.owner.identityLine ?? "",
        title: sectionsInput.hero?.data?.title ?? seedSections.hero?.data?.title ?? input.owner.introLine ?? "",
        animatedRole: sectionsInput.hero?.data?.animatedRole ?? seedSections.hero?.data?.animatedRole ?? input.owner.role ?? "",
        description: sectionsInput.hero?.data?.description ?? seedSections.hero?.data?.description ?? input.owner.tagline ?? "",
        primaryCtaLabel: sectionsInput.hero?.data?.primaryCtaLabel ?? seedSections.hero?.data?.primaryCtaLabel ?? "",
        primaryCtaHref: sectionsInput.hero?.data?.primaryCtaHref ?? seedSections.hero?.data?.primaryCtaHref ?? "",
        secondaryCtaLabel: sectionsInput.hero?.data?.secondaryCtaLabel ?? seedSections.hero?.data?.secondaryCtaLabel ?? "",
        secondaryCtaHref: sectionsInput.hero?.data?.secondaryCtaHref ?? seedSections.hero?.data?.secondaryCtaHref ?? "",
        badges: sectionsInput.hero?.data?.badges ?? seedSections.hero?.data?.badges ?? input.owner.badges,
        stats: sectionsInput.hero?.data?.stats ?? seedSections.hero?.data?.stats ?? input.about.stats,
        techStack: sectionsInput.hero?.data?.techStack ?? seedSections.hero?.data?.techStack ?? input.heroTech,
      },
      items: [],
    }),
    about: makeBlock("about", sectionsInput.about, {
      data: {
        eyebrow: sectionsInput.about?.data?.eyebrow ?? seedSections.about?.data?.eyebrow ?? "",
        title: sectionsInput.about?.data?.title ?? seedSections.about?.data?.title ?? "",
        description: sectionsInput.about?.data?.description ?? seedSections.about?.data?.description ?? "",
        intro: sectionsInput.about?.data?.intro ?? seedSections.about?.data?.intro ?? input.about.intro ?? "",
      },
      items: (sectionsInput.about?.items as SiteData["about"]["stats"] | undefined) ?? (seedSections.about?.items as SiteData["about"]["stats"] | undefined) ?? input.about.stats,
    }),
    skills: makeBlock("skills", sectionsInput.skills, {
      data: {
        eyebrow: sectionsInput.skills?.data?.eyebrow ?? seedSections.skills?.data?.eyebrow ?? "",
        title: sectionsInput.skills?.data?.title ?? seedSections.skills?.data?.title ?? "",
        description: sectionsInput.skills?.data?.description ?? seedSections.skills?.data?.description ?? "",
        learningTitle: sectionsInput.skills?.data?.learningTitle ?? seedSections.skills?.data?.learningTitle ?? "",
        learningItems: sectionsInput.skills?.data?.learningItems ?? seedSections.skills?.data?.learningItems ?? input.learningPhase,
      },
      items: input.skillsDetailed.length
        ? input.skillsDetailed
        : input.skills.map((name, index) => ({
            id: `skill-${index + 1}`,
            name,
            category: "Tools",
            icon: "",
            level: 80,
          })),
    }),
    projects: makeBlock("projects", sectionsInput.projects, {
      data: {
        eyebrow: sectionsInput.projects?.data?.eyebrow ?? seedSections.projects?.data?.eyebrow ?? "",
        title: sectionsInput.projects?.data?.title ?? seedSections.projects?.data?.title ?? "",
        description: sectionsInput.projects?.data?.description ?? seedSections.projects?.data?.description ?? "",
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
        eyebrow: sectionsInput.working?.data?.eyebrow ?? seedSections.working?.data?.eyebrow ?? "",
        title: sectionsInput.working?.data?.title ?? seedSections.working?.data?.title ?? "",
        description: sectionsInput.working?.data?.description ?? seedSections.working?.data?.description ?? "",
      },
      items: input.workingProjects || [],
    }),
    completed: makeBlock("completed", sectionsInput.completed, {
      data: {
        eyebrow: sectionsInput.completed?.data?.eyebrow ?? seedSections.completed?.data?.eyebrow ?? "",
        title: sectionsInput.completed?.data?.title ?? seedSections.completed?.data?.title ?? "",
        description: sectionsInput.completed?.data?.description ?? seedSections.completed?.data?.description ?? "",
      },
      items: input.completedProjects || [],
    }),
    reviews: makeBlock("reviews", sectionsInput.reviews, {
      data: {
        eyebrow: sectionsInput.reviews?.data?.eyebrow ?? seedSections.reviews?.data?.eyebrow ?? "",
        title: sectionsInput.reviews?.data?.title ?? seedSections.reviews?.data?.title ?? "",
        description: sectionsInput.reviews?.data?.description ?? seedSections.reviews?.data?.description ?? "",
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
        eyebrow: sectionsInput.journey?.data?.eyebrow ?? seedSections.journey?.data?.eyebrow ?? "",
        title: sectionsInput.journey?.data?.title ?? seedSections.journey?.data?.title ?? "",
        description: sectionsInput.journey?.data?.description ?? seedSections.journey?.data?.description ?? "",
        currentWorkTitle: sectionsInput.journey?.data?.currentWorkTitle ?? seedSections.journey?.data?.currentWorkTitle ?? "",
        currentWork: sectionsInput.journey?.data?.currentWork ?? seedSections.journey?.data?.currentWork ?? input.journeyNow?.currentWork ?? "",
        milestones: sectionsInput.journey?.data?.milestones ?? seedSections.journey?.data?.milestones ?? input.journeyNow?.ongoingMilestones ?? [],
      },
      items: input.experience,
    }),
    education: makeBlock("education", sectionsInput.education, {
      data: {
        eyebrow: sectionsInput.education?.data?.eyebrow ?? seedSections.education?.data?.eyebrow ?? "",
        title: sectionsInput.education?.data?.title ?? seedSections.education?.data?.title ?? "",
        description: sectionsInput.education?.data?.description ?? seedSections.education?.data?.description ?? "",
      },
      items: input.education || [],
    }),
    services: makeBlock("services", sectionsInput.services, {
      data: {
        eyebrow: sectionsInput.services?.data?.eyebrow ?? seedSections.services?.data?.eyebrow ?? "",
        title: sectionsInput.services?.data?.title ?? seedSections.services?.data?.title ?? "",
        description: sectionsInput.services?.data?.description ?? seedSections.services?.data?.description ?? "",
      },
      items: input.services || [],
    }),
    contact: makeBlock("contact", sectionsInput.contact, {
      data: {
        eyebrow: sectionsInput.contact?.data?.eyebrow ?? seedSections.contact?.data?.eyebrow ?? "",
        title: sectionsInput.contact?.data?.title ?? seedSections.contact?.data?.title ?? "",
        description: sectionsInput.contact?.data?.description ?? seedSections.contact?.data?.description ?? "",
        cardTitle: sectionsInput.contact?.data?.cardTitle ?? seedSections.contact?.data?.cardTitle ?? "",
        cardDescription: sectionsInput.contact?.data?.cardDescription ?? seedSections.contact?.data?.cardDescription ?? "",
        formTitle: sectionsInput.contact?.data?.formTitle ?? seedSections.contact?.data?.formTitle ?? "",
      },
      items: input.socials,
    }),
    blogs: makeBlock("blogs", sectionsInput.blogs, {
      data: {
        eyebrow: sectionsInput.blogs?.data?.eyebrow ?? seedSections.blogs?.data?.eyebrow ?? "",
        title: sectionsInput.blogs?.data?.title ?? seedSections.blogs?.data?.title ?? "",
        description: sectionsInput.blogs?.data?.description ?? seedSections.blogs?.data?.description ?? "",
      },
      items: input.blogs,
    }),
    github: makeBlock("github", sectionsInput.github, {
      data: {
        eyebrow: sectionsInput.github?.data?.eyebrow ?? seedSections.github?.data?.eyebrow ?? "",
        title: sectionsInput.github?.data?.title ?? seedSections.github?.data?.title ?? "",
        description: sectionsInput.github?.data?.description ?? seedSections.github?.data?.description ?? "",
      },
      items: [],
    }),
    footer: makeBlock("footer", sectionsInput.footer, {
      data: {
        copyrightText: sectionsInput.footer?.data?.copyrightText ?? seedSections.footer?.data?.copyrightText ?? input.shell?.footer?.copyrightText ?? input.websiteSettings?.footerText ?? "",
        ctaLabel: sectionsInput.footer?.data?.ctaLabel ?? seedSections.footer?.data?.ctaLabel ?? input.shell?.footer?.ctaLabel ?? "",
        ctaHref: sectionsInput.footer?.data?.ctaHref ?? seedSections.footer?.data?.ctaHref ?? input.shell?.footer?.ctaHref ?? "",
      },
      items: input.shell?.footer?.quickLinks || [],
    }),
  };

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
        copyrightText: input.shell?.footer?.copyrightText || input.websiteSettings?.footerText || "",
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
    learningPhase: ((sections.skills.data as Record<string, unknown>).learningItems as string[] | undefined) || input.learningPhase,
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
    heroTech: (((sections.hero.data as Record<string, unknown>).techStack as string[] | undefined) || input.heroTech).filter(Boolean),
    about: {
      intro: String((sections.about.data as Record<string, unknown>).intro || input.about.intro),
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
