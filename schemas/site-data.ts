import { z } from "zod";

export const arrayItemSchema = z.object({
  id: z.string(),
  type: z.enum(["badge", "stat", "link", "social", "service", "milestone", "skill", "projectLink"]),
  label: z.string(),
  value: z.string().optional(),
  href: z.string().optional(),
  iconKey: z.string().optional(),
  iconColor: z.string().optional(),
  order: z.number(),
  isEnabled: z.boolean(),
});

export const blogSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  slug: z.string().min(1),
  excerpt: z.string(),
  content: z.string(),
  coverImage: z.string().optional(),
  tags: z.array(z.string()),
  category: z.string(),
  status: z.enum(["draft", "published"]),
  isFeatured: z.boolean(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  publishedAt: z.string().optional(),
  order: z.number(),
  isEnabled: z.boolean(),
});

export const navItemSchema = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
});

export const sectionControlSchema = z.object({
  id: z.enum(["about", "skills", "projects", "working", "completed", "reviews", "journey", "education", "services", "contact", "blogs", "github"]),
  label: z.string().min(1),
  visible: z.boolean(),
  showInNav: z.boolean(),
  deleted: z.boolean(),
});

const dynamicSectionSchema = z.object({
  id: z.enum(["hero", "about", "skills", "projects", "working", "completed", "reviews", "journey", "education", "services", "contact", "blogs", "github", "footer"]),
  label: z.string().min(1),
  renderer: z.enum(["hero", "about", "skills", "projects", "working", "completed", "reviews", "journey", "education", "services", "contact", "blogs", "github", "footer"]),
  enabled: z.boolean(),
  order: z.number(),
  layout: z.string().optional(),
  status: z.enum(["draft", "published"]).optional(),
  nav: z
    .object({
      show: z.boolean(),
      href: z.string(),
      label: z.string(),
    })
    .optional(),
  emptyMessage: z.string().optional(),
  textBlocks: z.array(z.object({
    key: z.string(),
    type: z.enum(["plain", "rich", "markdown", "link", "button", "badge", "stat", "list-item"]),
    label: z.string(),
    value: z.string(),
    href: z.string().optional(),
    sectionId: z.enum(["hero", "about", "skills", "projects", "working", "completed", "reviews", "journey", "education", "services", "contact", "blogs", "github", "footer"]),
    order: z.number(),
    isEnabled: z.boolean(),
  })).optional(),
  settings: z.record(z.string(), z.unknown()).optional(),
  data: z.record(z.string(), z.unknown()),
  items: z.array(z.unknown()),
});

export const websiteControlSchema = z.object({
  dataSource: z.enum(["mongodb", "github", "auto"]).default("auto"),
  syncStatus: z
    .object({
      lastMongoUpdate: z.string().optional(),
      lastGitHubSync: z.string().optional(),
    })
    .default({}),
  popupAnnouncement: z.object({
    enabled: z.boolean(),
    title: z.string(),
    message: z.string(),
    buttonText: z.string(),
    buttonLink: z.string(),
    image: z.string(),
    frequency: z.enum(["once", "always"]),
    style: z.enum(["info", "update", "warning", "offer"]),
    closeButton: z.boolean(),
    startDate: z.string(),
    endDate: z.string(),
  }),
  maintenanceMode: z.object({
    enabled: z.boolean(),
    title: z.string(),
    subtitle: z.string(),
    estimatedReturn: z.string(),
    contactButtonText: z.string(),
    contactButtonLink: z.string(),
    whatsappLink: z.string(),
    socialLinks: z.array(z.object({ label: z.string(), href: z.string() })),
    allowedRoutes: z.array(z.string()),
    whitelistAdmin: z.boolean(),
  }),
  topNoticeBar: z.object({
    enabled: z.boolean(),
    message: z.string(),
    ctaText: z.string(),
    ctaLink: z.string(),
    colorStyle: z.enum(["blue", "emerald", "amber", "rose"]),
  }),
  versionInfo: z.object({
    currentVersion: z.string(),
    showUpdateMessage: z.boolean(),
    updateMessage: z.string(),
    changelogShort: z.string(),
    showBadge: z.boolean(),
  }),
});

export const siteConnectionSchema = z.object({
  name: z.string().min(1),
  owner: z.string().min(1),
  repo: z.string().min(1),
  branch: z.string().default("main"),
  contentPath: z.string().default("src/data/siteData.json"),
});

export const siteDataSchema = z.object({
  owner: z.object({
    name: z.string().default(""),
    username: z.string().default(""),
    identityLine: z.string().default(""),
    introLine: z.string().default(""),
    role: z.string().default(""),
    tagline: z.string().default(""),
    location: z.string().default(""),
    badges: z.array(z.string()).default([]),
    profileImage: z.string().default(""),
    resumeUrl: z.string().default(""),
  }),
  nav: z.array(navItemSchema).default([]),
  sectionControls: z.array(sectionControlSchema).optional().default([]),
  about: z.object({
    intro: z.string().default(""),
    stats: z.array(z.object({ label: z.string(), value: z.string() })).default([]),
  }),
  skills: z.array(z.string()).default([]),
  learningPhase: z.array(z.string()).default([]),
  projects: z.array(
    z.object({
      title: z.string().default(""),
      subtitle: z.string().optional().default(""),
      description: z.string().default(""),
      image: z.string().default(""),
      tech: z.array(z.string()).default([]),
      liveUrl: z.string().default(""),
      githubUrl: z.string().default(""),
    })
  ).default([]),
  workingProjects: z
    .array(
      z.object({
        title: z.string(),
        description: z.string(),
        status: z.string(),
        timeline: z.string(),
        link: z.string(),
      })
    )
    .optional(),
  completedProjects: z
    .array(
      z.object({
        title: z.string(),
        timeline: z.string(),
        role: z.string(),
        link: z.string(),
        workDone: z.string(),
      })
    )
    .optional(),
  reviews: z.array(
    z.object({
      clientName: z.string(),
      website: z.string(),
      quote: z.string(),
      icon: z.string().optional(),
    })
  ),
  experience: z.array(
    z.object({
      role: z.string(),
      period: z.string(),
      summary: z.string(),
    })
  ),
  education: z
    .array(
      z.object({
        id: z.string(),
        school: z.string(),
        degree: z.string(),
        period: z.string(),
        description: z.string(),
      })
    )
    .optional(),
  journeyNow: z
    .object({
      currentWork: z.string(),
      ongoingMilestones: z.array(z.string()),
    })
    .optional(),
  socials: z.array(z.object({ label: z.string(), value: z.string(), href: z.string() })),
  services: z.array(z.object({ id: z.string(), title: z.string(), description: z.string(), icon: z.string() })),
  skillsDetailed: z.array(z.object({
    id: z.string(),
    name: z.string(),
    category: z.string(),
    icon: z.string(),
    iconKey: z.string().optional(),
    iconColor: z.string().optional(),
    level: z.number(),
    isEnabled: z.boolean().optional(),
    order: z.number().optional(),
  })),
  projectsDetailed: z.array(
    z.object({
      id: z.string(),
      slug: z.string().optional(),
      title: z.string(),
      subtitle: z.string().optional(),
      shortDescription: z.string(),
      longDescription: z.string(),
      fullDescription: z.string().optional(),
      status: z.string().optional(),
      projectType: z.string().optional(),
      techStack: z.array(z.string()),
      category: z.string(),
      tags: z.array(z.string()).optional(),
      featuredBadge: z.string().optional(),
      image: z.string(),
      thumbnail: z.string().optional(),
      coverImage: z.string().optional(),
      galleryImages: z.array(z.string()).optional(),
      uiScreenshots: z.array(z.string()).optional(),
      demoVideoUrl: z.string().optional(),
      architectureDiagram: z.string().optional(),
      liveDemoUrl: z.string(),
      githubUrl: z.string(),
      backendRepo: z.string().optional(),
      apiDocumentationUrl: z.string().optional(),
      documentationUrl: z.string().optional(),
      figmaUrl: z.string().optional(),
      caseStudyUrl: z.string().optional(),
      problemStatement: z.string().optional(),
      solution: z.string().optional(),
      targetUsers: z.string().optional(),
      businessValue: z.string().optional(),
      impact: z.string().optional(),
      keyFeatures: z.array(z.string()).optional(),
      coreModules: z.array(z.string()).optional(),
      futureRoadmap: z.array(z.string()).optional(),
      challengesFaced: z.string().optional(),
      learnings: z.string().optional(),
      frontend: z.string().optional(),
      backend: z.string().optional(),
      database: z.string().optional(),
      authentication: z.string().optional(),
      hosting: z.string().optional(),
      apisIntegrations: z.string().optional(),
      aiMlUsed: z.string().optional(),
      architectureNotes: z.string().optional(),
      techBadges: z.array(z.string()).optional(),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
      duration: z.string().optional(),
      teamSize: z.string().optional(),
      currentProgress: z.number().optional(),
      draft: z.boolean().optional(),
      published: z.boolean().optional(),
      featured: z.boolean(),
      order: z.number(),
      overview: z.string().optional(),
      problem: z.string().optional(),
      myRole: z.string().optional(),
      responsibilities: z.array(z.string()).optional(),
      features: z.array(z.string()).optional(),
      screenshots: z.array(z.string()).optional(),
      databaseSchema: z.string().optional(),
      apiFlow: z.string().optional(),
      folderStructure: z.string().optional(),
      challenges: z.string().optional(),
      lessonsLearned: z.string().optional(),
      futureImprovements: z.array(z.string()).optional(),
      timeline: z.string().optional(),
      readingTimeMinutes: z.number().optional(),
    })
  ),
  testimonialsDetailed: z.array(
    z.object({ id: z.string(), clientName: z.string(), roleCompany: z.string(), message: z.string(), image: z.string() })
  ),
  contactMessages: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      email: z.string(),
      subject: z.string(),
      message: z.string(),
      read: z.boolean(),
      status: z.enum(["unread", "read", "replied", "archived"]).optional(),
      createdAt: z.string(),
      repliedAt: z.string().optional(),
    })
  ),
  blogs: z.array(blogSchema),
  mediaLibrary: z.array(z.object({ id: z.string(), name: z.string(), url: z.string(), type: z.string(), size: z.number() })),
  websiteSettings: z.object({
    seoTitle: z.string(),
    metaDescription: z.string(),
    favicon: z.string(),
    logo: z.string(),
    footerText: z.string(),
    themeMode: z.enum(["light", "dark", "system"]),
    primaryColor: z.string().optional(),
    accentColor: z.string().optional(),
    fontFamily: z.string().optional(),
    radius: z.string().optional(),
    animations: z.enum(["minimal", "smooth", "rich"]).optional(),
  }),
  websiteControl: websiteControlSchema,
  aiConfig: z.object({
    enabled: z.boolean().default(true),
    model: z.string().default("gemini-2.5-flash"),
    temperature: z.number().default(0.2),
    maxTokens: z.number().default(700),
    maxContextChunks: z.number().default(6),
    confidenceThreshold: z.number().default(0.2),
  }).optional().default({
    enabled: true,
    model: "gemini-2.5-flash",
    temperature: 0.2,
    maxTokens: 700,
    maxContextChunks: 6,
    confidenceThreshold: 0.2,
  }),
  shell: z.object({
    navbar: z.object({
      desktopCtaLabel: z.string().default("Hire Me"),
      desktopCtaHref: z.string().default("#contact"),
      mobileMenuLabel: z.string().default("Toggle menu"),
      brandBadgePrefix: z.string().default("Version"),
    }).default({
      desktopCtaLabel: "Hire Me",
      desktopCtaHref: "#contact",
      mobileMenuLabel: "Toggle menu",
      brandBadgePrefix: "Version",
    }),
    footer: z.object({
      copyrightText: z.string().default("All rights reserved."),
      backToTopLabel: z.string().default("Back to top"),
      quickLinks: z.array(z.object({ label: z.string(), href: z.string() })).default([]),
      ctaLabel: z.string().default("Let's work together"),
      ctaHref: z.string().default("#contact"),
    }).default({
      copyrightText: "All rights reserved.",
      backToTopLabel: "Back to top",
      quickLinks: [],
      ctaLabel: "Let's work together",
      ctaHref: "#contact",
    }),
    search: z.object({
      buttonLabel: z.string().default("Search"),
      shortcutLabel: z.string().default("Ctrl K"),
      inputPlaceholder: z.string().default("Search projects, blogs, skills, technologies..."),
      emptyPrompt: z.string().default("Start typing to search across your portfolio."),
    }).default({
      buttonLabel: "Search",
      shortcutLabel: "Ctrl K",
      inputPlaceholder: "Search projects, blogs, skills, technologies...",
      emptyPrompt: "Start typing to search across your portfolio.",
    }),
    assistant: z.object({
      buttonLabel: z.string().default("Ask Portfolio AI"),
      panelTitle: z.string().default("Portfolio Assistant"),
      panelDescription: z.string().default("Answers only from portfolio content"),
      inputPlaceholder: z.string().default("Ask about projects, skills, experience, or blogs..."),
      submitLabel: z.string().default("Ask"),
      loadingLabel: z.string().default("Searching..."),
    }).default({
      buttonLabel: "Ask Portfolio AI",
      panelTitle: "Portfolio Assistant",
      panelDescription: "Answers only from portfolio content",
      inputPlaceholder: "Ask about projects, skills, experience, or blogs...",
      submitLabel: "Ask",
      loadingLabel: "Searching...",
    }),
  }).default({
    navbar: {
      desktopCtaLabel: "Hire Me",
      desktopCtaHref: "#contact",
      mobileMenuLabel: "Toggle menu",
      brandBadgePrefix: "Version",
    },
    footer: {
      copyrightText: "All rights reserved.",
      backToTopLabel: "Back to top",
      quickLinks: [],
      ctaLabel: "Let's work together",
      ctaHref: "#contact",
    },
    search: {
      buttonLabel: "Search",
      shortcutLabel: "Ctrl K",
      inputPlaceholder: "Search projects, blogs, skills, technologies...",
      emptyPrompt: "Start typing to search across your portfolio.",
    },
    assistant: {
      buttonLabel: "Ask Portfolio AI",
      panelTitle: "Portfolio Assistant",
      panelDescription: "Answers only from portfolio content",
      inputPlaceholder: "Ask about projects, skills, experience, or blogs...",
      submitLabel: "Ask",
      loadingLabel: "Searching...",
    },
  }),
  sections: z
    .object({
      hero: dynamicSectionSchema,
      about: dynamicSectionSchema,
      skills: dynamicSectionSchema,
      projects: dynamicSectionSchema,
      working: dynamicSectionSchema,
      completed: dynamicSectionSchema,
      reviews: dynamicSectionSchema,
      journey: dynamicSectionSchema,
      education: dynamicSectionSchema,
      services: dynamicSectionSchema,
      contact: dynamicSectionSchema,
      blogs: dynamicSectionSchema,
      github: dynamicSectionSchema,
      footer: dynamicSectionSchema,
    })
    .optional(),
  collaboration: z.object({
    users: z.array(z.object({ name: z.string(), color: z.string() })),
    board: z.array(z.object({ title: z.string(), status: z.string() })),
    events: z.array(z.string()),
  }),
  heroTech: z.array(z.string()).default([]),
  githubConfig: z.object({
    username: z.string().default(''),
    token: z.string().optional().default(''),
    enabled: z.boolean().default(false),
    refreshInterval: z.number().default(30),
    includePrivateRepos: z.boolean().default(false),
    includePrivateCommits: z.boolean().default(false),
    showLifetimeCommits: z.boolean().default(true),
    showPrivateReposPublicly: z.boolean().default(false),
    showPrivateCommitsPublicly: z.boolean().default(false),
    publicDisplayMode: z.enum(["publicOnly", "aggregatePrivateOnly", "includePrivateNames", "includePrivateWithCommits"]).default("publicOnly"),
    commitCountMode: z.enum(["publicCommitsOnly", "publicAndPrivateCommits", "publicReposOnly", "selectedRepositoriesOnly", "customRepositoryList"]).default("publicCommitsOnly"),
    repositorySelectionMode: z.enum(["all", "publicOnly", "privateOnly", "selected"]).default("all"),
    selectedRepositories: z.array(z.string()).default([]),
    commitMessageIncludes: z.array(z.string()).default([]),
    commitMessageExcludes: z.array(z.string()).default([]),
  }).optional().default({
    username: "",
    token: "",
    enabled: false,
    refreshInterval: 30,
    includePrivateRepos: false,
    includePrivateCommits: false,
    showLifetimeCommits: true,
    showPrivateReposPublicly: false,
    showPrivateCommitsPublicly: false,
    publicDisplayMode: "publicOnly",
    commitCountMode: "publicCommitsOnly",
    repositorySelectionMode: "all",
    selectedRepositories: [],
    commitMessageIncludes: [],
    commitMessageExcludes: [],
  }),
  updatedAt: z.string().default(() => new Date().toISOString()),
  siteConnection: siteConnectionSchema.optional(),
}).passthrough();

export type SiteDataInput = z.infer<typeof siteDataSchema>;
