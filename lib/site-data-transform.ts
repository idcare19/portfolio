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
  "services",
  "contact",
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
  "services",
  "contact",
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
  const ids = ["hero", "about", "skills", "projects", "working", "completed", "reviews", "journey", "services", "github", "contact", "footer"] as const;
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
      },
      items: resolveSectionItems(
        sectionsInput.projects?.items as SiteData["projectsDetailed"] | undefined,
        undefined,
        input.projects.map((project, index) => ({
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
          }))
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
      items: resolveSectionItems(sectionsInput.completed?.items as SiteData["completedProjects"] | undefined, undefined, []),
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
    github: makeBlock("github", sectionsInput.github, {
      data: {
        eyebrow: sectionsInput.github?.data?.eyebrow ?? "",
        title: sectionsInput.github?.data?.title ?? "",
        description: sectionsInput.github?.data?.description ?? "",
      },
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
