<<<<<<< HEAD
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
=======
export const adminNav = [
  { label: "Dashboard", href: "/admin/control" },
  { label: "Analytics", href: "/admin/analytics" },
  { label: "Sections", href: "/admin/sections" },
  { label: "Text Blocks", href: "/admin/text-blocks" },
  { label: "Audit Text", href: "/admin/audit-text" },
  { label: "Profile", href: "/admin/profile" },
  { label: "Resume", href: "/admin/resume" },
  { label: "Projects", href: "/admin/projects" },
  { label: "Skills", href: "/admin/skills" },
  { label: "Experience", href: "/admin/experience" },
  { label: "Reviews", href: "/admin/reviews" },
  { label: "Services", href: "/admin/services" },
  { label: "Testimonials", href: "/admin/testimonials" },
  { label: "Blogs", href: "/admin/blogs" },
  { label: "Contact", href: "/admin/contact" },
  { label: "Footer", href: "/admin/footer" },
  { label: "Messages", href: "/admin/messages" },
  { label: "Media", href: "/admin/media" },
  { label: "GitHub", href: "/admin/github" },
  { label: "Settings", href: "/admin/settings" },
];
>>>>>>> c974e6d18f7e4d84cefd23b3ad822ac4cf9981fc
