export type NavItem = { label: string; href: string };

export type TextBlockType = "plain" | "rich" | "markdown" | "link" | "button" | "badge" | "stat" | "list-item";

export type TextBlock = {
  key: string;
  type: TextBlockType;
  label: string;
  value: string;
  href?: string;
  sectionId: DynamicSectionId;
  order: number;
  isEnabled: boolean;
};

export type SiteConnection = {
  name: string;
  owner: string;
  repo: string;
  branch: string;
  contentPath: string;
};

export type ProjectItem = {
  id: string;
  slug?: string;
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
  overview?: string;
  problem?: string;
  solution?: string;
  myRole?: string;
  responsibilities?: string[];
  features?: string[];
  screenshots?: string[];
  architectureDiagram?: string;
  databaseSchema?: string;
  apiFlow?: string;
  folderStructure?: string;
  challenges?: string;
  lessonsLearned?: string;
  futureImprovements?: string[];
  timeline?: string;
  tags?: string[];
  readingTimeMinutes?: number;
  totalViews?: number;
  uniqueViews?: number;
  likes?: number;
  isEnabled?: boolean;
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

export type EducationItem = {
  id: string;
  school: string;
  degree: string;
  period: string;
  description: string;
};

export type BlogItem = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  tags: string[];
  category: string;
  status: "draft" | "published";
  isFeatured: boolean;
  seoTitle?: string;
  seoDescription?: string;
  publishedAt?: string;
  order: number;
  isEnabled: boolean;
};

export type ArrayItem = {
  id: string;
  type: "badge" | "stat" | "link" | "social" | "service" | "milestone" | "skill" | "projectLink";
  label: string;
  value?: string;
  href?: string;
  iconKey?: string;
  iconColor?: string;
  order: number;
  isEnabled: boolean;
};

export type SectionId = "about" | "skills" | "projects" | "working" | "completed" | "reviews" | "journey" | "education" | "services" | "contact" | "blogs" | "github" | "footer";
export type DynamicSectionId = string;
export type SectionRendererId = string;

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
  iconKey?: string;
  iconColor?: string;
  level: number;
  isEnabled?: boolean;
  order?: number;
};

export type ServiceItem = {
  id: string;
  title: string;
  description: string;
  icon: string;
  isEnabled?: boolean;
  order?: number;
};

export type TestimonialItem = {
  id: string;
  clientName: string;
  roleCompany: string;
  message: string;
  image: string;
  isEnabled?: boolean;
  order?: number;
};

export type ContactMessageItem = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  status?: "unread" | "read" | "replied" | "archived";
  createdAt: string;
  repliedAt?: string;
};

export type MediaItem = {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
};

export type WebsiteControl = {
  dataSource?: "mongodb" | "github" | "auto";
  developerMode?: boolean;
  syncStatus?: {
    lastMongoUpdate?: string;
    lastGitHubSync?: string;
  };
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

export type SiteShellConfig = {
  navbar: {
    desktopCtaLabel: string;
    desktopCtaHref: string;
    mobileMenuLabel: string;
    brandBadgePrefix: string;
  };
  footer: {
    copyrightText: string;
    backToTopLabel: string;
    quickLinks: { label: string; href: string }[];
    ctaLabel: string;
    ctaHref: string;
  };
  search: {
    buttonLabel: string;
    shortcutLabel: string;
    inputPlaceholder: string;
    emptyPrompt: string;
  };
  assistant: {
    buttonLabel: string;
    panelTitle: string;
    panelDescription: string;
    inputPlaceholder: string;
    submitLabel: string;
    loadingLabel: string;
  };
};

export type SiteSectionBlock = {
  id: DynamicSectionId;
  label: string;
  renderer: SectionRendererId;
  enabled: boolean;
  order: number;
  layout?: string;
  status?: "draft" | "published";
  nav?: {
    show: boolean;
    href: string;
    label: string;
  };
  emptyMessage?: string;
  textBlocks?: TextBlock[];
  settings?: Record<string, unknown>;
  data: Record<string, unknown>;
  items: any[];
};

export type SectionRecord = Record<string, SiteSectionBlock>;

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
  education?: EducationItem[];
  journeyNow?: JourneyNow;
  socials: { label: string; value: string; href: string; icon?: string; isEnabled?: boolean; order?: number }[];
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
    themeMode: "light" | "dark" | "system";
    primaryColor?: string;
    accentColor?: string;
    fontFamily?: string;
    radius?: string;
    animations?: "minimal" | "smooth" | "rich";
  };
  websiteControl: WebsiteControl;
  shell: SiteShellConfig;
  aiConfig?: {
    enabled: boolean;
    model: string;
    temperature: number;
    maxTokens: number;
    maxContextChunks: number;
    confidenceThreshold: number;
  };
  siteConnection?: SiteConnection;
  sections?: SectionRecord;
  githubConfig?: {
    username: string;
    token?: string;
    enabled: boolean;
    refreshInterval: number;
    includePrivateRepos?: boolean;
    includePrivateCommits?: boolean;
    showLifetimeCommits?: boolean;
    showPrivateReposPublicly?: boolean;
    showPrivateCommitsPublicly?: boolean;
    publicDisplayMode?: "publicOnly" | "aggregatePrivateOnly" | "includePrivateNames" | "includePrivateWithCommits";
    commitCountMode?: "publicCommitsOnly" | "publicAndPrivateCommits" | "publicReposOnly" | "selectedRepositoriesOnly" | "customRepositoryList";
    repositorySelectionMode?: "all" | "publicOnly" | "privateOnly" | "selected";
    selectedRepositories?: string[];
    commitMessageIncludes?: string[];
    commitMessageExcludes?: string[];
    recentCommitsEnabled?: boolean;
    recentCommitsLimit?: number;
    recentCommitsHideRepositories?: string[];
    recentCommitsHideKeywords?: string[];
    recentCommitsSelectedRepositories?: string[];
    recentCommitsShowMessage?: boolean;
    recentCommitsShowRepository?: boolean;
    recentCommitsShowDate?: boolean;
    recentCommitsShowAuthor?: boolean;
    recentCommitsShowAvatar?: boolean;
    recentCommitsSortNewest?: boolean;
    recentActivityEnabled?: boolean;
    recentActivityLimit?: number;
    recentActivityHiddenTypes?: string[];
    recentActivityHideRepositories?: string[];
    recentActivityHideKeywords?: string[];
    repositoryCardsLimit?: number;
    repositoryCardsSelectedRepositories?: string[];
    repositoryCardsHideArchived?: boolean;
    repositoryCardsHideForked?: boolean;
    repositoryCardsHidePrivate?: boolean;
    repositoryCardsSort?: "stars" | "updated" | "name" | "manual";
    repositoryCardsManualOrder?: string[];
    showTotalCommits?: boolean;
    showStars?: boolean;
    showFollowers?: boolean;
    showFollowing?: boolean;
    showForks?: boolean;
    showPullRequests?: boolean;
    showIssues?: boolean;
    showOrganizations?: boolean;
    showContributionStreak?: boolean;
    pinnedProjectsLimit?: number;
    pinnedProjectsOrder?: string[];
    cardsPerRow?: number;
    paginationSize?: number;
    infiniteScroll?: boolean;
    showViewOnGitHubButtons?: boolean;
    openLinksInNewTab?: boolean;
    showGitHubIcons?: boolean;
    showLanguageColors?: boolean;
  };
  updatedAt: string;
};
