import "server-only";

import siteDataSeed from "@/src/data/siteData.json";
import { calculateReadingTimeMinutes, slugify } from "@/lib/content-utils";
import { connectToDatabase } from "@/lib/mongodb";
import { normalizeSiteData, summarizeSectionCounts } from "@/lib/site-data-transform";
import { Blog } from "@/models/Blog";
import { Experience } from "@/models/Experience";
import { Message } from "@/models/Message";
import { Project } from "@/models/Project";
import { Section } from "@/models/Section";
import { SiteSettings } from "@/models/SiteSettings";
import { Skill } from "@/models/Skill";
import { Testimonial } from "@/models/Testimonial";
import type { SiteData, SiteSectionBlock } from "@/src/types/site-data";

const SETTINGS_KEY = "primary";

type StoredSettings = {
  owner: SiteData["owner"];
  nav?: SiteData["nav"];
  socials?: SiteData["socials"];
  websiteSettings: SiteData["websiteSettings"];
  websiteControl: SiteData["websiteControl"];
  shell?: SiteData["shell"];
  githubConfig?: SiteData["githubConfig"];
  heroTech?: SiteData["heroTech"];
  learningPhase?: SiteData["learningPhase"];
  collaboration?: SiteData["collaboration"];
  siteConnection?: SiteData["siteConnection"] | null;
  mediaLibrary?: SiteData["mediaLibrary"];
  services?: SiteData["services"];
  completedProjects?: SiteData["completedProjects"];
  education?: SiteData["education"];
  extra?: {
    about?: SiteData["about"];
    sectionControls?: SiteData["sectionControls"];
    workingProjects?: SiteData["workingProjects"];
    journeyNow?: SiteData["journeyNow"];
  };
  updatedAt?: string;
};

function cloneSeedData(): SiteData {
  return JSON.parse(JSON.stringify(siteDataSeed)) as SiteData;
}

function createSectionDoc(section: SiteSectionBlock) {
  const showOnHomepage = (section as any).showOnHomepage ?? section.nav?.show ?? true;
  return {
    key: section.id,
    id: section.id,
    label: section.label,
    renderer: section.renderer,
    isEnabled: section.enabled,
    enabled: section.enabled,
    order: section.order,
    nav: section.nav,
    emptyMessage: section.emptyMessage,
    showOnHomepage,
    layout: section.layout || "default",
    settings: section.settings || {},
    data: section.data,
    items: section.items || [],
    textBlocks: section.textBlocks || [],
    updatedAt: new Date().toISOString(),
  };
}

function buildSiteDataFromSections(
  sections: any[],
  settings: any,
  projects: any[],
  skills: any[],
  experience: any[],
  testimonials: any[],
  blogs: any[]
) {
  const fallback = (cloneSeedData().sections || {}) as NonNullable<SiteData["sections"]>;
  const map = Object.fromEntries(sections.map((section) => [section.key || section.id, section]));

  const sectionIds = [
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
  ] as const;

  const built = sectionIds.reduce((acc, key) => {
    const source = map[key];
    const fallbackSection = fallback[key];
    const sectionItems = source?.items;
    const items =
      sectionItems !== undefined
        ? sectionItems
        : key === "projects"
          ? projects
          : key === "skills"
            ? skills
            : key === "journey"
              ? experience
              : key === "reviews"
                ? testimonials
                : key === "blogs"
                  ? blogs
                  : fallbackSection?.items ?? [];

    acc[key] = {
      id: key,
      label: source?.label ?? fallbackSection?.label ?? key,
      renderer: source?.renderer ?? fallbackSection?.renderer ?? key,
      enabled: source?.enabled ?? source?.isEnabled ?? fallbackSection?.enabled ?? true,
      order: source?.order ?? fallbackSection?.order ?? 0,
      template: source?.template ?? fallbackSection?.template ?? "",
      nav: source?.nav ?? fallbackSection?.nav ?? { show: source?.showOnHomepage ?? fallbackSection?.nav?.show ?? false, href: `#${key}`, label: source?.label ?? key },
      emptyMessage: source?.emptyMessage ?? fallbackSection?.emptyMessage ?? "",
      data: source?.data ?? fallbackSection?.data ?? {},
      layout: source?.layout ?? fallbackSection?.layout ?? "default",
      settings: source?.settings ?? fallbackSection?.settings ?? {},
      showOnHomepage: source?.showOnHomepage ?? source?.nav?.show ?? fallbackSection?.nav?.show ?? false,
      items,
    };
    return acc;
  }, {} as NonNullable<SiteData["sections"]>);

  for (const section of sections) {
    const key = section.key || section.id;
    if (!key || key in built) continue;
    built[key] = {
      id: key,
      label: section.label ?? key,
      renderer: section.renderer ?? key,
      enabled: section.enabled ?? section.isEnabled ?? true,
      order: section.order ?? 0,
      template: section.template ?? "",
      nav: section.nav ?? { show: section.showOnHomepage ?? false, href: `#${key}`, label: section.label ?? key },
      emptyMessage: section.emptyMessage ?? "",
      data: section.data ?? {},
      layout: section.layout ?? "default",
      settings: section.settings ?? {},
      showOnHomepage: section.showOnHomepage ?? section.nav?.show ?? false,
      items: Array.isArray(section.items) ? section.items : [],
      textBlocks: Array.isArray(section.textBlocks) ? section.textBlocks : [],
    } as any;
  }

  built.about.items = built.about.items ?? [];
  built.working.items = built.working.items ?? [];
  built.completed.items = built.completed.items ?? [];
  built.education.items = built.education.items ?? [];
  built.services.items = built.services.items ?? [];
  built.contact.items = built.contact.items ?? [];
  const journeyData = built.journey.data as Record<string, unknown>;
  if (!journeyData.currentWork && settings?.extra?.journeyNow?.currentWork) {
    built.journey.data = {
      ...journeyData,
      currentWork: settings.extra.journeyNow.currentWork,
      milestones: settings.extra.journeyNow.ongoingMilestones || [],
    };
  }

  return built;
}

async function seedCollectionsFromSiteData(siteData: SiteData) {
  await connectToDatabase();
  const now = new Date().toISOString();

  if (siteData.sections) {
    await Section.deleteMany({});
    await Section.insertMany(
      Object.values(siteData.sections).map((section) => createSectionDoc(section)),
      { ordered: false }
    );
  }

  await Project.deleteMany({});
  const projects = (siteData.projectsDetailed || []).map((project, index) => ({
    slug: slugify((project as any).slug || project.title),
    title: project.title,
    shortDescription: project.shortDescription,
    longDescription: project.longDescription,
    image: project.image,
    category: project.category,
    techStack: project.techStack || [],
    featured: Boolean(project.featured),
    order: project.order ?? index + 1,
    status: "published",
    problem: String((project as any).problem || ""),
    overview: String((project as any).overview || project.shortDescription || ""),
    solution: String((project as any).solution || ""),
    myRole: String((project as any).myRole || ""),
    responsibilities: Array.isArray((project as any).responsibilities) ? (project as any).responsibilities : [],
    features: Array.isArray((project as any).features) ? (project as any).features : [],
    screenshots: Array.isArray((project as any).screenshots) ? (project as any).screenshots : [project.image].filter(Boolean),
    architectureDiagram: String((project as any).architectureDiagram || ""),
    databaseSchema: String((project as any).databaseSchema || ""),
    apiFlow: String((project as any).apiFlow || ""),
    folderStructure: String((project as any).folderStructure || ""),
    challenges: String((project as any).challenges || ""),
    lessonsLearned: String((project as any).lessonsLearned || ""),
    futureImprovements: Array.isArray((project as any).futureImprovements) ? (project as any).futureImprovements : [],
    timeline: String((project as any).timeline || ""),
    tags: Array.isArray((project as any).tags) ? (project as any).tags : [],
    readingTimeMinutes: Number((project as any).readingTimeMinutes || calculateReadingTimeMinutes(`${project.longDescription} ${(project as any).solution || ""}`)),
    outcome: String((project as any).outcome || ""),
    liveDemoUrl: project.liveDemoUrl,
    githubUrl: project.githubUrl,
    updatedAt: siteData.updatedAt || now,
  }));
  if (projects.length) {
    await Project.insertMany(projects, { ordered: false });
  }

  await Skill.deleteMany({});
  const skills = (siteData.skillsDetailed || []).map((skill, index) => ({
    key: skill.id || slugify(skill.name),
    name: skill.name,
    category: skill.category,
    icon: skill.icon,
    level: skill.level,
    order: index + 1,
    updatedAt: siteData.updatedAt || now,
  }));
  if (skills.length) {
    await Skill.insertMany(skills, { ordered: false });
  }

  await Experience.deleteMany({});
  const experience = (siteData.experience || []).map((item, index) => ({
    key: `exp-${index + 1}-${slugify(item.role)}`,
    role: item.role,
    period: item.period,
    summary: item.summary,
    company: "",
    highlights: [],
    order: index + 1,
    updatedAt: siteData.updatedAt || now,
  }));
  if (experience.length) {
    await Experience.insertMany(experience, { ordered: false });
  }

  await Blog.deleteMany({});
  const blogs = (siteData.blogs || []).map((blog: Record<string, unknown>, index) => ({
    slug: slugify(String(blog.slug || blog.title || `blog-${index + 1}`)),
    title: String(blog.title || `Blog ${index + 1}`),
    excerpt: String(blog.excerpt || blog.description || ""),
    content: String(blog.content || ""),
    markdown: String(blog.markdown || blog.content || ""),
    thumbnail: String(blog.thumbnail || blog.image || ""),
    tags: Array.isArray(blog.tags) ? blog.tags.map(String) : [],
    categories: Array.isArray(blog.categories) ? blog.categories.map(String) : [],
    published: blog.published !== false,
    scheduledFor: String(blog.scheduledFor || ""),
    featured: Boolean(blog.featured),
    seoTitle: String(blog.seoTitle || blog.title || ""),
    seoDescription: String(blog.seoDescription || blog.excerpt || ""),
    readingTimeMinutes: Number(blog.readingTimeMinutes || calculateReadingTimeMinutes(String(blog.markdown || blog.content || ""))),
    relatedSlugs: Array.isArray(blog.relatedSlugs) ? blog.relatedSlugs.map(String) : [],
    order: index + 1,
    updatedAt: siteData.updatedAt || now,
  }));
  if (blogs.length) {
    await Blog.insertMany(blogs, { ordered: false });
  }

  await Testimonial.deleteMany({});
  const testimonials = (siteData.testimonialsDetailed || []).map((item, index) => ({
    key: item.id || `testimonial-${index + 1}`,
    clientName: item.clientName,
    roleCompany: item.roleCompany,
    message: item.message,
    image: item.image,
    featured: index < 3,
    order: index + 1,
    updatedAt: siteData.updatedAt || now,
  }));
  if (testimonials.length) {
    await Testimonial.insertMany(testimonials, { ordered: false });
  }

  await Message.deleteMany({});
  const messages = (siteData.contactMessages || []).map((item) => ({
    key: item.id,
    name: item.name,
    email: item.email,
    subject: item.subject,
    message: item.message,
    read: item.read,
    status: item.status || (item.read ? "read" : "unread"),
    createdAt: item.createdAt,
    repliedAt: item.repliedAt || "",
    updatedAt: item.createdAt,
  }));
  if (messages.length) {
    await Message.insertMany(messages, { ordered: false });
  }
}

function buildSectionMap(sections: any[], settings: any, projects: any[], skills: any[], experience: any[], testimonials: any[], blogs: any[]) {
  const fallback = (cloneSeedData().sections || {}) as NonNullable<SiteData["sections"]>;
  const map = Object.fromEntries(sections.map((section) => [section.key, section]));

  const sectionIds = [
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
  ] as const;

  const built = sectionIds.reduce((acc, key) => {
    const source = map[key];
    const fallbackSection = fallback[key];
    const sectionItems = source?.items;
    const items =
      sectionItems !== undefined
        ? sectionItems
        : key === "projects"
          ? projects
          : key === "skills"
            ? skills
            : key === "journey"
              ? experience
              : key === "reviews"
                ? testimonials
                : key === "blogs"
                  ? blogs
                  : fallbackSection?.items ?? [];

    acc[key] = {
      id: key,
      label: source?.label ?? fallbackSection?.label ?? key,
      renderer: source?.renderer ?? fallbackSection?.renderer ?? key,
      enabled: source?.isEnabled ?? fallbackSection?.enabled ?? true,
      order: source?.order ?? fallbackSection?.order ?? 0,
      nav: source?.nav ?? fallbackSection?.nav,
      emptyMessage: source?.emptyMessage ?? fallbackSection?.emptyMessage ?? "",
      data: source?.data ?? fallbackSection?.data ?? {},
      items,
    };
    return acc;
  }, {} as NonNullable<SiteData["sections"]>);

  for (const section of sections) {
    const key = section.key || section.id;
    if (!key || key in built) continue;
    built[key] = {
      id: key,
      label: section.label ?? key,
      renderer: section.renderer ?? key,
      enabled: section.enabled ?? section.isEnabled ?? true,
      order: section.order ?? 0,
      nav: section.nav ?? { show: section.showOnHomepage ?? false, href: `#${key}`, label: section.label ?? key },
      emptyMessage: section.emptyMessage ?? "",
      data: section.data ?? {},
      items: Array.isArray(section.items) ? section.items : [],
      layout: section.layout ?? "default",
      settings: section.settings ?? {},
      showOnHomepage: section.showOnHomepage ?? section.nav?.show ?? false,
      template: section.template ?? "",
      textBlocks: Array.isArray(section.textBlocks) ? section.textBlocks : [],
    } as any;
  }

  built.about.items = built.about.items ?? [];
  built.working.items = built.working.items ?? [];
  built.completed.items = built.completed.items ?? [];
  built.education.items = built.education.items ?? [];
  built.services.items = built.services.items ?? [];
  built.contact.items = built.contact.items ?? [];
  const journeyData = built.journey.data as Record<string, unknown>;
  if (!journeyData.currentWork && settings?.extra?.journeyNow?.currentWork) {
    built.journey.data = {
      ...journeyData,
      currentWork: settings.extra.journeyNow.currentWork,
      milestones: settings.extra.journeyNow.ongoingMilestones || [],
    };
  }

  return built;
}

function normalizeProjectRecord(project: any, index: number) {
  return {
    id: String(project?.id || project?.slug || `project-${index + 1}`),
    slug: String(project?.slug || project?.id || ""),
    title: String(project?.title || ""),
    shortDescription: String(project?.shortDescription || project?.description || ""),
    longDescription: String(project?.longDescription || project?.description || ""),
    techStack: Array.isArray(project?.techStack) ? project.techStack : Array.isArray(project?.technologies) ? project.technologies : [],
    category: String(project?.category || project?.status || "Project"),
    image: String(project?.image || project?.thumbnail || ""),
    liveDemoUrl: String(project?.liveDemoUrl || ""),
    githubUrl: String(project?.githubUrl || ""),
    featured: Boolean(project?.featured ?? project?.isFeatured),
    order: Number(project?.order ?? index + 1),
    overview: String(project?.overview || ""),
    problem: String(project?.problem || ""),
    solution: String(project?.solution || ""),
    myRole: String(project?.myRole || ""),
    responsibilities: Array.isArray(project?.responsibilities) ? project.responsibilities : [],
    features: Array.isArray(project?.features) ? project.features : [],
    screenshots: Array.isArray(project?.screenshots) ? project.screenshots : [],
    architectureDiagram: String(project?.architectureDiagram || ""),
    databaseSchema: String(project?.databaseSchema || ""),
    apiFlow: String(project?.apiFlow || ""),
    folderStructure: String(project?.folderStructure || ""),
    challenges: String(project?.challenges || ""),
    lessonsLearned: String(project?.lessonsLearned || ""),
    futureImprovements: Array.isArray(project?.futureImprovements) ? project.futureImprovements : [],
    timeline: String(project?.timeline || ""),
    tags: Array.isArray(project?.tags) ? project.tags : [],
    readingTimeMinutes: Number(project?.readingTimeMinutes || 1),
    outcome: String(project?.outcome || ""),
    isEnabled: project?.isEnabled !== false,
    thumbnail: String(project?.thumbnail || ""),
    banner: String(project?.banner || ""),
    galleryImages: Array.isArray(project?.galleryImages) ? project.galleryImages : [],
    backendRepo: String(project?.backendRepo || ""),
    documentationUrl: String(project?.documentationUrl || ""),
    client: String(project?.client || ""),
    company: String(project?.company || ""),
    role: String(project?.role || ""),
    teamSize: String(project?.teamSize || ""),
    duration: String(project?.duration || ""),
    startDate: String(project?.startDate || ""),
    endDate: String(project?.endDate || ""),
    metaTitle: String(project?.metaTitle || ""),
    metaDescription: String(project?.metaDescription || ""),
    achievements: Array.isArray(project?.achievements) ? project.achievements : [],
  };
}

export async function getPortfolioSiteData(): Promise<SiteData> {
  await connectToDatabase();

  const [rawSettings, sections, projects, skills, experience, blogs, testimonials, messages] = await Promise.all([
    SiteSettings.findOne({ key: SETTINGS_KEY }).lean(),
    Section.find({}).sort({ order: 1, createdAt: 1 }).lean(),
    Project.find({}).sort({ order: 1, createdAt: 1 }).lean(),
    Skill.find({}).sort({ order: 1, createdAt: 1 }).lean(),
    Experience.find({}).sort({ order: 1, createdAt: 1 }).lean(),
    Blog.find({}).sort({ order: 1, createdAt: 1 }).lean(),
    Testimonial.find({}).sort({ order: 1, createdAt: 1 }).lean(),
    Message.find({}).sort({ createdAt: -1 }).lean(),
  ]);

  // Seed sample draft blogs if none exist
  if (blogs.length === 0) {
    const sampleBlogs = [
      {
        slug: "how-to-build-a-portfolio-that-converts",
        title: "How to build a portfolio that converts",
        excerpt: "Learn the key strategies to create a portfolio website that turns visitors into clients and opportunities.",
        content: "Building a portfolio that stands out requires more than just showcasing your work. In this guide, we'll explore the essential elements that make a portfolio convert visitors into clients...",
        thumbnail: "",
        tags: ["portfolio", "web development", "career"],
        categories: ["Development"],
        published: false,
        featured: false,
        seoTitle: "How to Build a Portfolio That Converts",
        seoDescription: "Learn the key strategies to create a portfolio website that turns visitors into clients and opportunities.",
        order: 1,
        updatedAt: new Date().toISOString(),
      },
      {
        slug: "10-tips-for-frontend-developers",
        title: "10 tips for frontend developers",
        excerpt: "Essential tips that every frontend developer should know to improve their workflow and code quality.",
        content: "Frontend development is constantly evolving. These 10 tips will help you stay ahead of the curve and write better code...",
        thumbnail: "",
        tags: ["frontend", "tips", "javascript"],
        categories: ["Development"],
        published: false,
        featured: false,
        seoTitle: "10 Tips for Frontend Developers",
        seoDescription: "Essential tips that every frontend developer should know to improve their workflow and code quality.",
        order: 2,
        updatedAt: new Date().toISOString(),
      },
      {
        slug: "mongodb-best-practices",
        title: "MongoDB best practices",
        excerpt: "A comprehensive guide to MongoDB best practices for performance, scalability, and maintainability.",
        content: "MongoDB is a powerful NoSQL database, but to get the most out of it, you need to follow these best practices...",
        thumbnail: "",
        tags: ["mongodb", "database", "backend"],
        categories: ["Database"],
        published: false,
        featured: false,
        seoTitle: "MongoDB Best Practices",
        seoDescription: "A comprehensive guide to MongoDB best practices for performance, scalability, and maintainability.",
        order: 3,
        updatedAt: new Date().toISOString(),
      },
    ];
    await Blog.insertMany(sampleBlogs);
    // Refresh blogs after seeding
    const refreshedBlogs = await Blog.find({}).sort({ order: 1, createdAt: 1 }).lean();
    Object.assign(blogs, refreshedBlogs);
  }

  if (!rawSettings) {
    const seed = cloneSeedData();
    await seedCollectionsFromSiteData(seed);
    return getPortfolioSiteData();
  }
  const settings = rawSettings as unknown as StoredSettings;

  const projectsSection = sections.find((section: any) => section.key === "projects" || section.id === "projects");
  const projectSource = Array.isArray(projectsSection?.items) && projectsSection.items.length ? projectsSection.items : projects;
  const projectItems = projectSource.map((project: any, index: number) => normalizeProjectRecord(project, index));

  const skillItems = skills.map((skill: any, index) => ({
    id: skill.key || `skill-${index + 1}`,
    name: skill.name,
    category: skill.category,
    icon: skill.icon,
    level: skill.level,
  }));

  const experienceItems = experience.map((item: any) => ({
    role: item.role,
    period: item.period,
    summary: item.summary,
  }));

  const testimonialItems = testimonials.map((item: any, index) => ({
    id: item.key || `testimonial-${index + 1}`,
    clientName: item.clientName,
    roleCompany: item.roleCompany,
    message: item.message,
    image: item.image || "",
  }));

  const normalizedBlogs: SiteData["blogs"] = blogs.map((blog: any, index) => ({
    id: blog.slug || `blog-${index + 1}`,
    slug: blog.slug || slugify(blog.title || `blog-${index + 1}`),
    title: blog.title || `Blog ${index + 1}`,
    excerpt: blog.excerpt || "",
    content: blog.content || blog.markdown || "",
    coverImage: blog.thumbnail || blog.coverImage || "",
    tags: blog.tags || [],
    category: Array.isArray(blog.categories) ? String(blog.categories[0] || "General") : "General",
    status: blog.published === false ? "draft" : "published",
    isFeatured: Boolean(blog.featured),
    seoTitle: blog.seoTitle || blog.title || "",
    seoDescription: blog.seoDescription || blog.excerpt || "",
    publishedAt: blog.published !== false ? String(blog.updatedAt || settings.updatedAt || new Date().toISOString()) : "",
    order: Number(blog.order ?? index + 1),
    isEnabled: blog.published !== false,
  }));

  const aboutSection = sections.find((section: any) => section.key === "about" || section.id === "about");

  return normalizeSiteData({
    owner: settings.owner,
    nav: settings.nav || [],
    sectionControls: settings.extra?.sectionControls || [],
    heroTech: settings.heroTech || [],
    about: settings.extra?.about || { intro: "", stats: [] },
    skills: skillItems.map((item) => item.name),
    learningPhase: settings.learningPhase || [],
    projects: projectItems.map((project) => ({
      title: project.title,
      description: project.shortDescription,
      image: project.image,
      tech: project.techStack,
      liveUrl: project.liveDemoUrl,
      githubUrl: project.githubUrl,
    })),
    workingProjects: settings.extra?.workingProjects || [],
    completedProjects: settings.completedProjects || [],
    reviews: testimonialItems.map((item) => ({
      clientName: item.clientName,
      website: item.roleCompany,
      quote: item.message,
      icon: item.image,
    })),
    collaboration: settings.collaboration || {
      users: [],
      board: [],
      events: [],
    },
    experience: experienceItems,
    education: settings.education || [],
    journeyNow: settings.extra?.journeyNow || { currentWork: "", ongoingMilestones: [] },
    socials: settings.socials || [],
    services: settings.services || [],
    skillsDetailed: skillItems,
    projectsDetailed: projectItems as SiteData["projectsDetailed"],
    testimonialsDetailed: testimonialItems,
    contactMessages: messages.map((item: any) => ({
      id: item.key,
      name: item.name,
      email: item.email,
      subject: item.subject,
      message: item.message,
      read: Boolean(item.read),
      status: item.status || (item.read ? "read" : "unread"),
      createdAt: item.createdAt,
      repliedAt: item.repliedAt || "",
    })),
    blogs: normalizedBlogs,
    mediaLibrary: settings.mediaLibrary || [],
    websiteSettings: settings.websiteSettings,
    websiteControl: settings.websiteControl,
    shell: settings.shell ?? cloneSeedData().shell,
    githubConfig: settings.githubConfig,
    updatedAt: settings.updatedAt || new Date().toISOString(),
    sections: buildSiteDataFromSections(
      sections,
      settings,
      projectItems,
      skillItems,
      experienceItems,
      testimonialItems,
      normalizedBlogs
    ),
  });
}

export async function createPortfolioMessage(input: {
  name: string;
  email: string;
  subject: string;
  message: string;
  ipAddress?: string;
}) {
  await connectToDatabase();
  const createdAt = new Date().toISOString();
  const key = `msg-${Date.now()}`;
  const doc = await Message.create({
    key,
    name: input.name,
    email: input.email,
    subject: input.subject,
    message: input.message,
    ipAddress: input.ipAddress || "",
    read: false,
    createdAt,
    updatedAt: createdAt,
  });

  return {
    id: doc.key as string,
    name: doc.name as string,
    email: doc.email as string,
    subject: doc.subject as string,
    message: doc.message as string,
    read: Boolean(doc.read),
    createdAt: doc.createdAt as string,
  };
}

export async function savePortfolioSiteData(nextData: SiteData): Promise<SiteData> {
  const now = nextData.updatedAt || new Date().toISOString();
  console.log("[portfolio/repository] savePortfolioSiteData entry", {
    sections: summarizeSectionCounts(nextData.sections),
  });

  const savedSettings = await SiteSettings.findOneAndUpdate(
    { key: SETTINGS_KEY },
    {
      key: SETTINGS_KEY,
      owner: nextData.owner,
      nav: nextData.nav || [],
      socials: nextData.socials || [],
      websiteSettings: nextData.websiteSettings,
      websiteControl: nextData.websiteControl,
      shell: nextData.shell || {},
      githubConfig: nextData.githubConfig || {},
      heroTech: nextData.heroTech || [],
      learningPhase: nextData.learningPhase || [],
      collaboration: nextData.collaboration || { users: [], board: [], events: [] },
      siteConnection: nextData.siteConnection || null,
      mediaLibrary: nextData.mediaLibrary || [],
      services: nextData.services || [],
      completedProjects: nextData.completedProjects || [],
      education: nextData.education || [],
      extra: {
        about: nextData.about,
        sectionControls: nextData.sectionControls || [],
        workingProjects: nextData.workingProjects || [],
        journeyNow: nextData.journeyNow || { currentWork: "", ongoingMilestones: [] },
      },
      updatedAt: now,
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  const sectionWrites = Object.values(nextData.sections || {}).map((section) => ({
    updateOne: {
      filter: { key: section.id },
      update: {
        $set: {
          ...createSectionDoc(section),
          updatedAt: now,
        },
      },
      upsert: true,
    },
  }));
  const sectionIds = Object.values(nextData.sections || {}).map((section) => section.id);
  await Section.deleteMany(sectionIds.length ? { key: { $nin: sectionIds } } : {});
  if (sectionWrites.length) {
    await Section.bulkWrite(sectionWrites, { ordered: true });
  }

  const sectionReadback = await Section.find({}).sort({ order: 1, createdAt: 1 }).lean();
  const aboutSectionFromMongo = sectionReadback.find((section: any) => section.key === "about" || section.id === "about");
  const readback = await SiteSettings.findOne({ key: SETTINGS_KEY }).lean();
  const readbackData = readback as unknown as { _id?: unknown; sections?: SiteData["sections"] };

  const projectItemsRaw = (nextData.sections?.projects?.items || nextData.projectsDetailed || []) as any[];
  console.log("[portfolio/repository] before Mongo write", {
    sections: summarizeSectionCounts(nextData.sections),
  });
  const projects = projectItemsRaw.map((project, index) => ({
    slug: slugify((project as any).slug || project.id || project.title || `project-${index + 1}`),
    title: project.title,
    shortDescription: project.shortDescription || project.description || "",
    longDescription: project.longDescription || project.description || "",
    image: project.image || project.thumbnail || "",
    category: project.category || project.status || "Project",
    techStack: project.techStack || project.technologies || [],
    featured: Boolean(project.featured ?? project.isFeatured),
    order: project.order ?? index + 1,
    status: "published",
    problem: String((project as any).problem || ""),
    overview: String((project as any).overview || project.shortDescription || project.description || ""),
    solution: String((project as any).solution || ""),
    myRole: String((project as any).myRole || ""),
    responsibilities: Array.isArray((project as any).responsibilities) ? (project as any).responsibilities : [],
    features: Array.isArray((project as any).features) ? (project as any).features : [],
    screenshots: Array.isArray((project as any).screenshots) ? (project as any).screenshots : [project.image].filter(Boolean),
    architectureDiagram: String((project as any).architectureDiagram || ""),
    databaseSchema: String((project as any).databaseSchema || ""),
    apiFlow: String((project as any).apiFlow || ""),
    folderStructure: String((project as any).folderStructure || ""),
    challenges: String((project as any).challenges || ""),
    lessonsLearned: String((project as any).lessonsLearned || ""),
    futureImprovements: Array.isArray((project as any).futureImprovements) ? (project as any).futureImprovements : [],
    timeline: String((project as any).timeline || ""),
    tags: Array.isArray((project as any).tags) ? (project as any).tags : [],
    readingTimeMinutes: Number((project as any).readingTimeMinutes || calculateReadingTimeMinutes(`${project.longDescription || project.description || ""} ${(project as any).solution || ""}`)),
    outcome: String((project as any).outcome || ""),
    liveDemoUrl: project.liveDemoUrl,
    githubUrl: project.githubUrl,
    thumbnail: project.thumbnail || "",
    banner: project.banner || "",
    galleryImages: Array.isArray(project.galleryImages) ? project.galleryImages : [],
    backendRepo: project.backendRepo || "",
    documentationUrl: project.documentationUrl || "",
    client: project.client || "",
    company: project.company || "",
    role: project.role || "",
    teamSize: project.teamSize || "",
    duration: project.duration || "",
    startDate: project.startDate || "",
    endDate: project.endDate || "",
    achievements: Array.isArray(project.achievements) ? project.achievements : [],
    metaTitle: project.metaTitle || "",
    metaDescription: project.metaDescription || "",
    isEnabled: project.isEnabled !== false,
    updatedAt: now,
  }));
  if (projects.length) {
    await Project.deleteMany({ slug: { $nin: projects.map((project) => project.slug) } });
    await Project.bulkWrite(
      projects.map((project) => ({
        updateOne: {
          filter: { slug: project.slug },
          update: { $set: project },
          upsert: true,
        },
      })),
      { ordered: true }
    );
  } else {
    await Project.deleteMany({});
  }

  await Skill.deleteMany({});
  const skills = (nextData.skillsDetailed || []).map((skill, index) => ({
    key: skill.id || slugify(skill.name),
    name: skill.name,
    category: skill.category,
    icon: skill.icon,
    level: skill.level,
    order: index + 1,
    updatedAt: now,
  }));
  if (skills.length) {
    await Skill.insertMany(skills, { ordered: false });
  }

  await Experience.deleteMany({});
  const experience = (nextData.experience || []).map((item, index) => ({
    key: `exp-${index + 1}-${slugify(item.role)}`,
    role: item.role,
    period: item.period,
    summary: item.summary,
    updatedAt: now,
  }));
  if (experience.length) {
    await Experience.insertMany(experience, { ordered: false });
  }

  await Blog.deleteMany({});
  const blogs = (nextData.blogs || []).map((blog: Record<string, unknown>, index) => ({
    slug: slugify(String(blog.slug || blog.title || `blog-${index + 1}`)),
    title: String(blog.title || `Blog ${index + 1}`),
    excerpt: String(blog.excerpt || blog.description || ""),
    content: String(blog.content || ""),
    thumbnail: String(blog.coverImage || blog.thumbnail || ""),
    tags: Array.isArray(blog.tags) ? blog.tags : [],
    category: String(blog.category || ""),
    status: String(blog.status || "draft"),
    isFeatured: Boolean(blog.isFeatured),
    seoTitle: String(blog.seoTitle || ""),
    seoDescription: String(blog.seoDescription || ""),
    publishedAt: String(blog.publishedAt || now),
    order: Number(blog.order ?? index + 1),
    isEnabled: Boolean(blog.isEnabled),
    updatedAt: now,
  }));
  if (blogs.length) {
    await Blog.insertMany(blogs, { ordered: false });
  }

  await Testimonial.deleteMany({});
  const testimonials = (nextData.testimonialsDetailed || []).map((item, index) => ({
    key: item.id || `testimonial-${index + 1}`,
    clientName: item.clientName,
    roleCompany: item.roleCompany,
    message: item.message,
    image: item.image,
    featured: index < 3,
    order: index + 1,
    updatedAt: now,
  }));
  if (testimonials.length) {
    await Testimonial.insertMany(testimonials, { ordered: false });
  }

  await Message.deleteMany({});
  const messages = (nextData.contactMessages || []).map((item) => ({
    key: item.id,
    name: item.name,
    email: item.email,
    subject: item.subject,
    message: item.message,
    read: item.read,
    status: item.status || (item.read ? "read" : "unread"),
    createdAt: item.createdAt,
    repliedAt: item.repliedAt || "",
    updatedAt: item.createdAt,
  }));
  if (messages.length) {
    await Message.insertMany(messages, { ordered: false });
  }

  const readSettings = savedSettings?.toObject ? savedSettings.toObject() : readback;
  const rebuilt = buildSiteDataFromSections(
    sectionReadback,
    readSettings,
    projects.length ? projects : [],
    skills.length ? skills : [],
    experience.length ? experience : [],
    testimonials.length ? testimonials : [],
    blogs.length ? blogs : []
  );

  const projectReadback = await Project.find({}).sort({ order: 1, createdAt: 1 }).lean();
  const sectionProjectReadback = await Section.findOne({ key: "projects" }).lean();
  const sectionMetadataReadback = sectionReadback.reduce<Record<string, any>>((acc, section: any) => {
    acc[section.key || section.id] = {
      order: section.order,
      enabled: section.enabled ?? section.isEnabled,
      renderer: section.renderer,
      nav: section.nav,
      showOnHomepage: section.showOnHomepage,
    };
    return acc;
  }, {});
  console.log("[portfolio/repository] project save readback", {
    sectionsBefore: summarizeSectionCounts(nextData.sections),
    readbackProjectCount: projectReadback.length,
    readbackSectionProjectCount: Array.isArray((sectionProjectReadback as any)?.items) ? (sectionProjectReadback as any).items.length : null,
    readbackSectionMetadata: {
      about: sectionMetadataReadback.about,
      projects: sectionMetadataReadback.projects,
      blogs: sectionMetadataReadback.blogs,
      footer: sectionMetadataReadback.footer,
    },
  });

  return normalizeSiteData({
    ...nextData,
    sections: rebuilt,
  });
}

export async function getPublishedProjects() {
  const data = await getPortfolioSiteData();
  const sectionProjects = (data.sections?.projects?.items || []) as any[];
  return (sectionProjects.length ? sectionProjects : data.projectsDetailed).filter((project: any) => project.isEnabled !== false);
}

export async function getPublishedBlogs() {
  const data = await getPortfolioSiteData();
  return data.blogs
    .filter((blog) => blog.status === "published" && blog.isEnabled)
    .map((blog) => ({
      ...blog,
      thumbnail: blog.coverImage || (blog as any).thumbnail || "",
    }));
}
