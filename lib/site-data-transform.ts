import type {
  DynamicSectionId,
  SectionId,
  SectionRecord,
  SectionRendererId,
  SiteData,
  SiteSectionBlock,
} from "@/src/types/site-data";

const DEFAULT_SECTION_META: Record<
  DynamicSectionId,
  { label: string; renderer: SectionRendererId; order: number; navHref?: string; navLabel?: string }
> = {
  hero: { label: "Hero", renderer: "hero", order: 1, navHref: "#home", navLabel: "Home" },
  about: { label: "About", renderer: "about", order: 2, navHref: "#about", navLabel: "About" },
  skills: { label: "Skills", renderer: "skills", order: 3, navHref: "#skills", navLabel: "Skills" },
  projects: { label: "Projects", renderer: "projects", order: 4, navHref: "#projects", navLabel: "Projects" },
  working: { label: "Working Projects", renderer: "working", order: 5 },
  completed: { label: "Completed Projects", renderer: "completed", order: 6 },
  reviews: { label: "Reviews", renderer: "reviews", order: 7 },
  journey: { label: "Experience", renderer: "journey", order: 8, navHref: "#journey", navLabel: "Experience" },
  education: { label: "Education", renderer: "education", order: 9 },
  services: { label: "Services", renderer: "services", order: 10, navHref: "#services", navLabel: "Services" },
  contact: { label: "Contact", renderer: "contact", order: 99, navHref: "#contact", navLabel: "Contact" },
  blogs: { label: "Blogs", renderer: "blogs", order: 11, navHref: "#blogs", navLabel: "Blogs" },
  github: { label: "GitHub Activity", renderer: "github", order: 8, navHref: "#github", navLabel: "GitHub" },
  footer: { label: "Footer", renderer: "footer", order: 100 },
};

function makeBlock<K extends DynamicSectionId>(
  key: K,
  incoming: Partial<SiteSectionBlock> | undefined,
  patch: Pick<SiteSectionBlock, "data" | "items">,
): SiteSectionBlock {
  const defaults = DEFAULT_SECTION_META[key];

  return {
    id: key,
    label: incoming?.label?.trim() || defaults.label,
    renderer: incoming?.renderer || defaults.renderer,
    enabled: incoming?.enabled ?? true,
    order: incoming?.order ?? defaults.order,
    layout: incoming?.layout || "default",
    status: incoming?.status || "published",
    nav: {
      show: incoming?.nav?.show ?? Boolean(defaults.navHref),
      href: incoming?.nav?.href || defaults.navHref || `#${key}`,
      label: incoming?.nav?.label || defaults.navLabel || defaults.label,
    },
    emptyMessage: incoming?.emptyMessage || "No content added yet.",
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
  const themeMode = input.websiteSettings?.themeMode || (input.websiteSettings as SiteData["websiteSettings"] & { theme?: SiteData["websiteSettings"]["themeMode"] })?.theme || "light";

  const sections: SectionRecord = {
    hero: makeBlock("hero", sectionsInput.hero, {
      data: {
        eyebrow: input.owner.identityLine,
        title: input.owner.introLine || `Hi, I'm ${input.owner.name}`,
        animatedRole: input.owner.role,
        description: input.owner.tagline,
        primaryCtaLabel: "View Projects",
        primaryCtaHref: "#projects",
        secondaryCtaLabel: "Contact Me",
        secondaryCtaHref: "#contact",
        badges: input.owner.badges,
        stats: input.about.stats,
        techStack: input.heroTech,
      },
      items: [],
    }),
    about: makeBlock("about", sectionsInput.about, {
      data: {
        eyebrow: "About",
        title: "Building modern products with clean execution",
        description: "I love transforming ideas into smooth, responsive, and practical digital experiences.",
        intro: input.about.intro,
      },
      items: input.about.stats,
    }),
    skills: makeBlock("skills", sectionsInput.skills, {
      data: {
        eyebrow: "Skills",
        title: "Comfortable across the stack",
        description: "Core tools and technologies I use to design, develop, and ship production-ready web products.",
        learningTitle: "Currently in Learning Phase",
        learningItems: input.learningPhase,
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
        eyebrow: "Projects",
        title: "Featured work",
        description: "Fast, clean project cards with minimal motion and better performance.",
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
        eyebrow: "Currently Working On",
        title: "Projects in progress",
        description: "A live snapshot of what I am building right now and where the work is headed next.",
      },
      items: input.workingProjects || [],
    }),
    completed: makeBlock("completed", sectionsInput.completed, {
      data: {
        eyebrow: "Projects I Worked On",
        title: "Completed work and what I delivered",
        description: "A clear record of finished projects and the exact work I handled in each.",
      },
      items: input.completedProjects || [],
    }),
    reviews: makeBlock("reviews", sectionsInput.reviews, {
      data: {
        eyebrow: "Client Reviews",
        title: "What clients say",
        description: "Feedback from recent portfolio projects delivered for clients.",
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
        eyebrow: "Experience",
        title: "Timeline of roles & milestones",
        description: "Hands-on roles that shaped my practical engineering and security-first development approach.",
        currentWorkTitle: "Where I Am Working Right Now",
        currentWork: input.journeyNow?.currentWork || "",
        milestones: input.journeyNow?.ongoingMilestones || [],
      },
      items: input.experience,
    }),
    education: makeBlock("education", sectionsInput.education, {
      data: {
        eyebrow: "Education",
        title: "Academic foundation",
        description: "Education, training, and practical study that shaped the work I do today.",
      },
      items: input.education || [],
    }),
    services: makeBlock("services", sectionsInput.services, {
      data: {
        eyebrow: "Services",
        title: "How I can help",
        description: "Flexible product, design, and development support for founders, teams, and fast-moving ideas.",
      },
      items: input.services || [],
    }),
    contact: makeBlock("contact", sectionsInput.contact, {
      data: {
        eyebrow: "Contact",
        title: "Let's talk about your next project",
        description: "Freelance projects, internships, and collaboration opportunities are always welcome.",
        cardTitle: "Let's build something amazing together.",
        cardDescription: "Whether it's a startup idea, website revamp, or app concept - I'd love to help build it.",
        formTitle: "Send a message",
      },
      items: input.socials,
    }),
    blogs: makeBlock("blogs", sectionsInput.blogs, {
      data: {
        eyebrow: "Blogs",
        title: "Notes, experiments, and practical write-ups",
        description: "Published posts, learnings, and project breakdowns from real work.",
      },
      items: input.blogs,
    }),
    github: makeBlock("github", sectionsInput.github, {
      data: {
        eyebrow: "Developer Activity",
        title: "Live from GitHub",
        description: "A real-time look at my recent contributions, projects, and statistics.",
      },
      items: [],
    }),
    footer: makeBlock("footer", sectionsInput.footer, {
      data: {
        copyrightText: input.shell?.footer?.copyrightText || input.websiteSettings?.footerText || "All rights reserved.",
        ctaLabel: input.shell?.footer?.ctaLabel || "Let's work together",
        ctaHref: input.shell?.footer?.ctaHref || "#contact",
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
        desktopCtaLabel: input.shell?.navbar?.desktopCtaLabel || "Hire Me",
        desktopCtaHref: input.shell?.navbar?.desktopCtaHref || "#contact",
        mobileMenuLabel: input.shell?.navbar?.mobileMenuLabel || "Toggle menu",
        brandBadgePrefix: input.shell?.navbar?.brandBadgePrefix || "Version",
      },
      footer: {
        copyrightText: input.shell?.footer?.copyrightText || input.websiteSettings?.footerText || "All rights reserved.",
        backToTopLabel: input.shell?.footer?.backToTopLabel || "Back to top",
        quickLinks: input.shell?.footer?.quickLinks || [],
        ctaLabel: input.shell?.footer?.ctaLabel || "Let's work together",
        ctaHref: input.shell?.footer?.ctaHref || "#contact",
      },
      search: {
        buttonLabel: input.shell?.search?.buttonLabel || "Search",
        shortcutLabel: input.shell?.search?.shortcutLabel || "Ctrl K",
        inputPlaceholder: input.shell?.search?.inputPlaceholder || "Search projects, blogs, skills, technologies...",
        emptyPrompt: input.shell?.search?.emptyPrompt || "Start typing to search across your portfolio.",
      },
      assistant: {
        buttonLabel: input.shell?.assistant?.buttonLabel || "Ask Portfolio AI",
        panelTitle: input.shell?.assistant?.panelTitle || "Portfolio Assistant",
        panelDescription: input.shell?.assistant?.panelDescription || "Answers only from portfolio content",
        inputPlaceholder: input.shell?.assistant?.inputPlaceholder || "Ask about projects, skills, experience, or blogs...",
        submitLabel: input.shell?.assistant?.submitLabel || "Ask",
        loadingLabel: input.shell?.assistant?.loadingLabel || "Searching...",
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
