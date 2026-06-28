export type AdminNavItem = {
  label: string;
  href: string;
  hidden?: boolean;
};

export type AdminNavSection = {
  label: string;
  items: AdminNavItem[];
};

export const adminNavSections: AdminNavSection[] = [
  {
    label: "Dashboard",
    items: [
      { label: "Overview", href: "/admin/control" },
      { label: "Analytics", href: "/admin/analytics" },
    ],
  },
  {
    label: "Website",
    items: [
      { label: "Hero", href: "/admin/hero" },
      { label: "About", href: "/admin/about" },
      { label: "Sections", href: "/admin/sections" },
      { label: "Profile", href: "/admin/profile" },
      { label: "Skills Content", href: "/admin/skills-content" },
      { label: "Projects Content", href: "/admin/projects-content" },
      { label: "Working Content", href: "/admin/working-content" },
      { label: "Completed Content", href: "/admin/completed-content" },
      { label: "Reviews Content", href: "/admin/reviews-content" },
      { label: "Experience Content", href: "/admin/experience-content" },
      { label: "Services Content", href: "/admin/services-content" },
      { label: "GitHub Content", href: "/admin/github-content" },
      { label: "Contact Content", href: "/admin/contact-content" },
      { label: "Footer Content", href: "/admin/footer-content" },
      { label: "Advanced Text Blocks", href: "/admin/text-blocks" },
      { label: "Audit Text", href: "/admin/audit-text" },
      { label: "GitHub", href: "/admin/github" },
      { label: "Portfolio AI", href: "/admin/ai" },
    ],
  },
  {
    label: "Content",
    items: [
      { label: "Blogs", href: "/admin/blogs" },
      { label: "Resume", href: "/admin/resume" },
    ],
  },
  {
    label: "Management",
    items: [
      { label: "Messages", href: "/admin/messages" },
      { label: "Media", href: "/admin/media" },
    ],
  },
  {
    label: "System",
    items: [{ label: "Settings", href: "/admin/settings" }],
  },
];

export const adminNav = adminNavSections.flatMap((section) => section.items);