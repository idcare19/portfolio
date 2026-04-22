export type NavItem = { label: string; href: string };

export type SiteConnection = {
  name: string;
  owner: string;
  repo: string;
  branch: string;
  contentPath: string;
};

export type ProjectItem = {
  id: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  techStack: string[];
  category: string;
  image: string;
  liveDemoUrl: string;
  githubUrl: string;
  featured: boolean;
  order: number;
};

export type WorkingProjectItem = {
  title: string;
  description: string;
  status: string;
  timeline: string;
  link: string;
};

export type CompletedProjectItem = {
  title: string;
  timeline: string;
  role: string;
  link: string;
  workDone: string;
};

export type JourneyNow = {
  currentWork: string;
  ongoingMilestones: string[];
};

export type SectionId = "about" | "skills" | "projects" | "working" | "completed" | "reviews" | "journey" | "contact";

export type SectionControlItem = {
  id: SectionId;
  label: string;
  visible: boolean;
  showInNav: boolean;
  deleted: boolean;
};

export type SkillItem = {
  id: string;
  name: string;
  category: "Frontend" | "Backend" | "Database" | "Tools";
  icon: string;
  level: number;
};

export type ServiceItem = {
  id: string;
  title: string;
  description: string;
  icon: string;
};

export type TestimonialItem = {
  id: string;
  clientName: string;
  roleCompany: string;
  message: string;
  image: string;
};

export type ContactMessageItem = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
};

export type BlogItem = {
  id: string;
  title: string;
  slug: string;
  thumbnail: string;
  content: string;
  tags: string[];
  published: boolean;
};

export type MediaItem = {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
};

export type WebsiteControl = {
  popupAnnouncement: {
    enabled: boolean;
    title: string;
    message: string;
    buttonText: string;
    buttonLink: string;
    image: string;
    frequency: "once" | "always";
    style: "info" | "update" | "warning" | "offer";
    closeButton: boolean;
    startDate: string;
    endDate: string;
  };
  maintenanceMode: {
    enabled: boolean;
    title: string;
    subtitle: string;
    estimatedReturn: string;
    contactButtonText: string;
    contactButtonLink: string;
    whatsappLink: string;
    socialLinks: { label: string; href: string }[];
    allowedRoutes: string[];
    whitelistAdmin: boolean;
  };
  topNoticeBar: {
    enabled: boolean;
    message: string;
    ctaText: string;
    ctaLink: string;
    colorStyle: "blue" | "emerald" | "amber" | "rose";
  };
  versionInfo: {
    currentVersion: string;
    showUpdateMessage: boolean;
    updateMessage: string;
    changelogShort: string;
    showBadge: boolean;
  };
};

export type SiteData = {
  owner: {
    name: string;
    username: string;
    identityLine: string;
    introLine: string;
    role: string;
    tagline: string;
    location: string;
    badges: string[];
    profileImage: string;
    resumeUrl: string;
  };
  nav: NavItem[];
  sectionControls?: SectionControlItem[];
  heroTech: string[];
  about: {
    intro: string;
    stats: { label: string; value: string }[];
  };
  skills: string[];
  learningPhase: string[];
  projects: {
    title: string;
    description: string;
    image: string;
    tech: string[];
    liveUrl: string;
    githubUrl: string;
  }[];
  workingProjects?: WorkingProjectItem[];
  completedProjects?: CompletedProjectItem[];
  reviews: {
    clientName: string;
    website: string;
    quote: string;
    icon?: string;
  }[];
  collaboration: {
    users: { name: string; color: string }[];
    board: { title: string; status: string }[];
    events: string[];
  };
  experience: {
    role: string;
    period: string;
    summary: string;
  }[];
  journeyNow?: JourneyNow;
  socials: { label: string; value: string; href: string }[];
  services: ServiceItem[];
  skillsDetailed: SkillItem[];
  projectsDetailed: ProjectItem[];
  testimonialsDetailed: TestimonialItem[];
  contactMessages: ContactMessageItem[];
  blogs: BlogItem[];
  mediaLibrary: MediaItem[];
  websiteSettings: {
    seoTitle: string;
    metaDescription: string;
    favicon: string;
    logo: string;
    footerText: string;
    theme: "light" | "dark" | "system";
  };
  websiteControl: WebsiteControl;
  siteConnection?: SiteConnection;
  updatedAt: string;
};
