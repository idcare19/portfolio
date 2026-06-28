import type { SiteData, DynamicSectionId } from "@/src/types/site-data";

export type SectionFieldType = "text" | "textarea" | "url" | "number" | "checkbox";

export type SectionField = {
  label: string;
  path: string;
  type?: SectionFieldType;
  placeholder?: string;
  helpText?: string;
};

export type SectionArrayField = {
  label: string;
  path: string;
  itemLabel: string;
  createItem: () => Record<string, unknown>;
  fields: Array<{
    key: string;
    label: string;
    type?: SectionFieldType;
    placeholder?: string;
  }>;
};

export type SectionItemCrudConfig = SectionArrayField & {
  description?: string;
};

export type SectionContentConfig = {
  title: string;
  description: string;
  previewHref: string;
  enabledPath?: string;
  sectionId?: DynamicSectionId;
  saveMessage: string;
  fields: SectionField[];
  arrayFields?: SectionArrayField[];
  itemCrud?: SectionItemCrudConfig;
  sync?: Array<{ from: string; to: string }>;
};

export const sectionContentConfigs: Record<string, SectionContentConfig> = {
  hero: {
    title: "Hero",
    description: "Edit the main hero copy, buttons, badges, stats, and visibility.",
    previewHref: "/",
    enabledPath: "sections.hero.enabled",
    sectionId: "hero",
    saveMessage: "chore: update hero content from admin panel",
    fields: [
      { label: "Logo Text", path: "owner.username" },
      { label: "Hero Badge", path: "owner.identityLine" },
      { label: "Hero Heading", path: "sections.hero.data.title" },
      { label: "Hero Subtitle", path: "sections.hero.data.animatedRole" },
      { label: "Hero Description", path: "sections.hero.data.description", type: "textarea" },
      { label: "Primary Button Text", path: "sections.hero.data.primaryCtaLabel" },
      { label: "Primary Button Link", path: "sections.hero.data.primaryCtaHref" },
      { label: "Secondary Button Text", path: "sections.hero.data.secondaryCtaLabel" },
      { label: "Secondary Button Link", path: "sections.hero.data.secondaryCtaHref" },
      { label: "Resume Button Text", path: "shell.footer.ctaLabel" },
      { label: "Resume Link", path: "owner.resumeUrl", type: "url" },
    ],
    arrayFields: [
      {
        label: "Availability Badges",
        path: "sections.hero.data.badges",
        itemLabel: "Badge",
        createItem: () => ({ value: "" }),
        fields: [{ key: "value", label: "Badge", type: "text" }],
      },
      {
        label: "Stats (Shared with About)",
        path: "sections.about.items",
        itemLabel: "Stat",
        createItem: () => ({ label: "", value: "", isEnabled: true, order: 1 }),
        fields: [
          { key: "label", label: "Label" },
          { key: "value", label: "Value" },
        ],
      },
    ],
    sync: [
      { from: "sections.hero.data.title", to: "owner.introLine" },
      { from: "sections.hero.data.animatedRole", to: "owner.role" },
      { from: "sections.hero.data.description", to: "owner.tagline" },
    ],
    itemCrud: {
      label: "About Stats",
      path: "sections.about.items",
      itemLabel: "Stat",
      createItem: () => ({ label: "", value: "", isEnabled: true, order: 1 }),
      fields: [
        { key: "label", label: "Label" },
        { key: "value", label: "Value" },
        { key: "isEnabled", label: "Enabled", type: "checkbox" },
        { key: "order", label: "Order", type: "number" },
      ],
    },
  },
  about: {
    title: "About",
    description: "Edit the about section heading, description, intro, and stats.",
    previewHref: "/",
    enabledPath: "sections.about.enabled",
    sectionId: "about",
    saveMessage: "chore: update about content from admin panel",
    fields: [
      { label: "Small Label", path: "sections.about.data.eyebrow" },
      { label: "Title", path: "sections.about.data.title" },
      { label: "Description", path: "sections.about.data.description", type: "textarea" },
      { label: "Intro Paragraph", path: "about.intro", type: "textarea" },
    ],
    arrayFields: [
      {
        label: "Stats",
        path: "sections.about.items",
        itemLabel: "Stat",
        createItem: () => ({ label: "", value: "", isEnabled: true, order: 1 }),
        fields: [
          { key: "label", label: "Label" },
          { key: "value", label: "Value" },
        ],
      },
    ],
  },
  "skills-content": {
    title: "Skills Content",
    description: "Edit the skills section heading and learning phase copy.",
    previewHref: "/",
    enabledPath: "sections.skills.enabled",
    sectionId: "skills",
    saveMessage: "chore: update skills content from admin panel",
    fields: [
      { label: "Small Label", path: "sections.skills.data.eyebrow" },
      { label: "Title", path: "sections.skills.data.title" },
      { label: "Description", path: "sections.skills.data.description", type: "textarea" },
      { label: "Learning Title", path: "sections.skills.data.learningTitle" },
    ],
    arrayFields: [
      {
        label: "Learning Items",
        path: "sections.skills.data.learningItems",
        itemLabel: "Learning Item",
        createItem: () => ({ value: "" }),
        fields: [{ key: "value", label: "Learning Item" }],
      },
    ],
    itemCrud: {
      label: "Skills",
      path: "sections.skills.items",
      itemLabel: "Skill",
      createItem: () => ({ id: `skill-${Date.now()}`, name: "", category: "Core Skills", icon: "", level: 0, isEnabled: true, order: 1 }),
      fields: [
        { key: "name", label: "Name" },
        { key: "category", label: "Category" },
        { key: "level", label: "Level", type: "number" },
        { key: "icon", label: "Icon" },
        { key: "isEnabled", label: "Enabled", type: "checkbox" },
        { key: "order", label: "Order", type: "number" },
      ],
    },
  },
  "projects-content": {
    title: "Projects Content",
    description: "Edit the projects section heading and visibility.",
    previewHref: "/projects",
    enabledPath: "sections.projects.enabled",
    sectionId: "projects",
    saveMessage: "chore: update projects content from admin panel",
    fields: [
      { label: "Small Label", path: "sections.projects.data.eyebrow" },
      { label: "Title", path: "sections.projects.data.title" },
      { label: "Description", path: "sections.projects.data.description", type: "textarea" },
    ],
    itemCrud: {
      label: "Projects",
      path: "sections.projects.items",
      itemLabel: "Project",
      createItem: () => ({ id: `project-${Date.now()}`, title: "", shortDescription: "", longDescription: "", techStack: [], category: "Project", image: "", liveDemoUrl: "", githubUrl: "", featured: false, order: 1 }),
      fields: [
        { key: "title", label: "Title" },
        { key: "shortDescription", label: "Description", type: "textarea" },
        { key: "category", label: "Status" },
        { key: "image", label: "Image" },
        { key: "featured", label: "Featured", type: "checkbox" },
        { key: "order", label: "Order", type: "number" },
      ],
    },
  },
  "working-content": {
    title: "Working Content",
    description: "Edit the currently working projects section copy.",
    previewHref: "/",
    enabledPath: "sections.working.enabled",
    sectionId: "working",
    saveMessage: "chore: update working content from admin panel",
    fields: [
      { label: "Small Label", path: "sections.working.data.eyebrow" },
      { label: "Title", path: "sections.working.data.title" },
      { label: "Description", path: "sections.working.data.description", type: "textarea" },
    ],
    itemCrud: {
      label: "Working Projects",
      path: "sections.working.items",
      itemLabel: "Working Item",
      createItem: () => ({ title: "", description: "", status: "", timeline: "", link: "", isEnabled: true, order: 1 }),
      fields: [
        { key: "title", label: "Title" },
        { key: "description", label: "Description", type: "textarea" },
        { key: "status", label: "Status" },
        { key: "timeline", label: "Progress" },
        { key: "link", label: "Link", type: "url" },
        { key: "isEnabled", label: "Enabled", type: "checkbox" },
        { key: "order", label: "Order", type: "number" },
      ],
    },
  },
  "completed-content": {
    title: "Completed Content",
    description: "Edit the completed projects section copy.",
    previewHref: "/",
    enabledPath: "sections.completed.enabled",
    sectionId: "completed",
    saveMessage: "chore: update completed content from admin panel",
    fields: [
      { label: "Small Label", path: "sections.completed.data.eyebrow" },
      { label: "Title", path: "sections.completed.data.title" },
      { label: "Description", path: "sections.completed.data.description", type: "textarea" },
    ],
    itemCrud: {
      label: "Completed Projects",
      path: "sections.completed.items",
      itemLabel: "Completed Item",
      createItem: () => ({ title: "", timeline: "", role: "", link: "", workDone: "", isEnabled: true, order: 1 }),
      fields: [
        { key: "title", label: "Title" },
        { key: "role", label: "Role" },
        { key: "timeline", label: "Date" },
        { key: "workDone", label: "Description", type: "textarea" },
        { key: "link", label: "Link", type: "url" },
        { key: "isEnabled", label: "Enabled", type: "checkbox" },
        { key: "order", label: "Order", type: "number" },
      ],
    },
  },
  "reviews-content": {
    title: "Reviews Content",
    description: "Edit the reviews section heading and public review cards.",
    previewHref: "/",
    enabledPath: "sections.reviews.enabled",
    sectionId: "reviews",
    saveMessage: "chore: update reviews content from admin panel",
    fields: [
      { label: "Small Label", path: "sections.reviews.data.eyebrow" },
      { label: "Title", path: "sections.reviews.data.title" },
      { label: "Description", path: "sections.reviews.data.description", type: "textarea" },
    ],
    itemCrud: {
      label: "Reviews",
      path: "sections.reviews.items",
      itemLabel: "Review",
      createItem: () => ({ id: `review-${Date.now()}`, clientName: "", roleCompany: "", message: "", image: "", isEnabled: true, order: 1 }),
      fields: [
        { key: "clientName", label: "Name" },
        { key: "roleCompany", label: "Role / Company" },
        { key: "message", label: "Quote", type: "textarea" },
        { key: "image", label: "Avatar" },
        { key: "isEnabled", label: "Enabled", type: "checkbox" },
        { key: "order", label: "Order", type: "number" },
      ],
    },
  },
  "experience-content": {
    title: "Experience Content",
    description: "Edit the experience section heading and timeline copy.",
    previewHref: "/",
    enabledPath: "sections.journey.enabled",
    sectionId: "journey",
    saveMessage: "chore: update experience content from admin panel",
    fields: [
      { label: "Small Label", path: "sections.journey.data.eyebrow" },
      { label: "Title", path: "sections.journey.data.title" },
      { label: "Description", path: "sections.journey.data.description", type: "textarea" },
    ],
    itemCrud: {
      label: "Experience",
      path: "sections.journey.items",
      itemLabel: "Experience",
      createItem: () => ({ role: "", period: "", summary: "", isEnabled: true, order: 1 }),
      fields: [
        { key: "role", label: "Role" },
        { key: "period", label: "Start / End" },
        { key: "summary", label: "Description", type: "textarea" },
        { key: "isEnabled", label: "Enabled", type: "checkbox" },
        { key: "order", label: "Order", type: "number" },
      ],
    },
  },
  "services-content": {
    title: "Services Content",
    description: "Edit the services section heading and card visibility.",
    previewHref: "/",
    enabledPath: "sections.services.enabled",
    sectionId: "services",
    saveMessage: "chore: update services content from admin panel",
    fields: [
      { label: "Small Label", path: "sections.services.data.eyebrow" },
      { label: "Title", path: "sections.services.data.title" },
      { label: "Description", path: "sections.services.data.description", type: "textarea" },
    ],
    itemCrud: {
      label: "Services",
      path: "sections.services.items",
      itemLabel: "Service",
      createItem: () => ({ title: "", description: "", icon: "", features: [], priceLabel: "", ctaLabel: "", ctaHref: "", isEnabled: true, order: 1 }),
      fields: [
        { key: "title", label: "Title" },
        { key: "description", label: "Description", type: "textarea" },
        { key: "icon", label: "Icon" },
        { key: "priceLabel", label: "Price Label" },
        { key: "ctaLabel", label: "CTA Label" },
        { key: "ctaHref", label: "CTA Link", type: "url" },
        { key: "isEnabled", label: "Enabled", type: "checkbox" },
        { key: "order", label: "Order", type: "number" },
      ],
    },
  },
  "github-content": {
    title: "GitHub Content",
    description: "Edit the GitHub section heading and public visibility.",
    previewHref: "/github",
    enabledPath: "sections.github.enabled",
    sectionId: "github",
    saveMessage: "chore: update github content from admin panel",
    fields: [
      { label: "Small Label", path: "sections.github.data.eyebrow" },
      { label: "Title", path: "sections.github.data.title" },
      { label: "Description", path: "sections.github.data.description", type: "textarea" },
    ],
  },
  "contact-content": {
    title: "Contact Content",
    description: "Edit the contact section copy, form text, and social links.",
    previewHref: "/",
    enabledPath: "sections.contact.enabled",
    sectionId: "contact",
    saveMessage: "chore: update contact content from admin panel",
    fields: [
      { label: "Small Label", path: "sections.contact.data.eyebrow" },
      { label: "Title", path: "sections.contact.data.title" },
      { label: "Description", path: "sections.contact.data.description", type: "textarea" },
      { label: "Card Title", path: "sections.contact.data.cardTitle" },
      { label: "Card Description", path: "sections.contact.data.cardDescription", type: "textarea" },
      { label: "Form Title", path: "sections.contact.data.formTitle" },
      { label: "Name Label", path: "sections.contact.data.nameLabel" },
      { label: "Name Placeholder", path: "sections.contact.data.namePlaceholder" },
      { label: "Email Label", path: "sections.contact.data.emailLabel" },
      { label: "Email Placeholder", path: "sections.contact.data.emailPlaceholder" },
      { label: "Message Label", path: "sections.contact.data.messageLabel" },
      { label: "Message Placeholder", path: "sections.contact.data.messagePlaceholder" },
      { label: "Send Button Text", path: "sections.contact.data.sendButtonText" },
      { label: "Success Message", path: "sections.contact.data.successMessage", type: "textarea" },
      { label: "Error Message", path: "sections.contact.data.errorMessage", type: "textarea" },
    ],
    arrayFields: [
      {
        label: "Social Links",
        path: "socials",
        itemLabel: "Social Link",
        createItem: () => ({ label: "", value: "", href: "" }),
        fields: [
          { key: "label", label: "Label" },
          { key: "value", label: "Visible Text" },
          { key: "href", label: "Link", type: "url" },
        ],
      },
    ],
    itemCrud: {
      label: "Social Links",
      path: "socials",
      itemLabel: "Social Link",
      createItem: () => ({ label: "", value: "", href: "", icon: "", isEnabled: true, order: 1 }),
      fields: [
        { key: "label", label: "Label" },
        { key: "value", label: "Value" },
        { key: "href", label: "Href", type: "url" },
        { key: "icon", label: "Icon" },
        { key: "isEnabled", label: "Enabled", type: "checkbox" },
        { key: "order", label: "Order", type: "number" },
      ],
    },
  },
  "footer-content": {
    title: "Footer Content",
    description: "Edit the footer text, CTA, quick links, and social links.",
    previewHref: "/",
    enabledPath: "sections.footer.enabled",
    sectionId: "footer",
    saveMessage: "chore: update footer content from admin panel",
    fields: [
      { label: "Footer Text", path: "websiteSettings.footerText", type: "textarea" },
      { label: "Copyright", path: "shell.footer.copyrightText" },
      { label: "CTA Title", path: "shell.footer.ctaLabel" },
      { label: "CTA Description", path: "shell.footer.ctaHref" },
    ],
    arrayFields: [
      {
        label: "Quick Links",
        path: "shell.footer.quickLinks",
        itemLabel: "Quick Link",
        createItem: () => ({ label: "", href: "" }),
        fields: [
          { key: "label", label: "Label" },
          { key: "href", label: "Link", type: "url" },
        ],
      },
      {
        label: "Social Links",
        path: "socials",
        itemLabel: "Social Link",
        createItem: () => ({ label: "", value: "", href: "" }),
        fields: [
          { key: "label", label: "Label" },
          { key: "value", label: "Visible Text" },
          { key: "href", label: "Link", type: "url" },
        ],
      },
    ],
    itemCrud: {
      label: "Footer Links",
      path: "shell.footer.quickLinks",
      itemLabel: "Footer Link",
      createItem: () => ({ label: "", href: "", group: "", isEnabled: true, order: 1 }),
      fields: [
        { key: "label", label: "Label" },
        { key: "href", label: "Href", type: "url" },
        { key: "group", label: "Group" },
        { key: "isEnabled", label: "Enabled", type: "checkbox" },
        { key: "order", label: "Order", type: "number" },
      ],
    },
  },
};

export function getSectionContentConfig(slug: string) {
  return sectionContentConfigs[slug];
}

export function getValueByPath(data: SiteData, path: string) {
  return path.split(".").reduce<any>((acc, key) => (acc == null ? acc : acc[key]), data);
}

export function setValueByPath(data: SiteData, path: string, value: unknown): SiteData {
  const next = structuredClone(data) as SiteData;
  const parts = path.split(".");
  let target: any = next;
  for (let index = 0; index < parts.length - 1; index += 1) {
    const key = parts[index];
    if (target[key] == null) target[key] = {};
    target = target[key];
  }
  target[parts[parts.length - 1]] = value;
  return next;
}
