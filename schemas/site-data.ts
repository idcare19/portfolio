import { z } from "zod";

export const navItemSchema = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
});

export const websiteControlSchema = z.object({
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
    name: z.string(),
    username: z.string(),
    identityLine: z.string(),
    introLine: z.string(),
    role: z.string(),
    tagline: z.string(),
    location: z.string(),
    badges: z.array(z.string()),
    profileImage: z.string(),
    resumeUrl: z.string(),
  }),
  nav: z.array(navItemSchema),
  about: z.object({
    intro: z.string(),
    stats: z.array(z.object({ label: z.string(), value: z.string() })),
  }),
  skills: z.array(z.string()),
  learningPhase: z.array(z.string()),
  projects: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      image: z.string(),
      tech: z.array(z.string()),
      liveUrl: z.string(),
      githubUrl: z.string(),
    })
  ),
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
  socials: z.array(z.object({ label: z.string(), value: z.string(), href: z.string() })),
  services: z.array(z.object({ id: z.string(), title: z.string(), description: z.string(), icon: z.string() })),
  skillsDetailed: z.array(z.object({ id: z.string(), name: z.string(), category: z.string(), icon: z.string(), level: z.number() })),
  projectsDetailed: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      shortDescription: z.string(),
      longDescription: z.string(),
      techStack: z.array(z.string()),
      category: z.string(),
      image: z.string(),
      liveDemoUrl: z.string(),
      githubUrl: z.string(),
      featured: z.boolean(),
      order: z.number(),
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
      createdAt: z.string(),
    })
  ),
  blogs: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      slug: z.string(),
      thumbnail: z.string(),
      content: z.string(),
      tags: z.array(z.string()),
      published: z.boolean(),
    })
  ),
  mediaLibrary: z.array(z.object({ id: z.string(), name: z.string(), url: z.string(), type: z.string(), size: z.number() })),
  websiteSettings: z.object({
    seoTitle: z.string(),
    metaDescription: z.string(),
    favicon: z.string(),
    logo: z.string(),
    footerText: z.string(),
    theme: z.enum(["light", "dark", "system"]),
  }),
  websiteControl: websiteControlSchema,
  collaboration: z.object({
    users: z.array(z.object({ name: z.string(), color: z.string() })),
    board: z.array(z.object({ title: z.string(), status: z.string() })),
    events: z.array(z.string()),
  }),
  heroTech: z.array(z.string()),
  updatedAt: z.string(),
  siteConnection: siteConnectionSchema.optional(),
});

export type SiteDataInput = z.infer<typeof siteDataSchema>;
