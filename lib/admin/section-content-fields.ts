import type { SiteData, DynamicSectionId } from "@/src/types/site-data";

export type SectionFieldType = "text" | "textarea" | "url" | "number";

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

export type SectionContentConfig = {
  title: string;
  description: string;
  previewHref: string;
  enabledPath?: string;
  sectionId?: DynamicSectionId;
  saveMessage: string;
  fields: SectionField[];
  arrayFields?: SectionArrayField[];
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
        label: "Stats",
        path: "sections.hero.data.stats",
        itemLabel: "Stat",
        createItem: () => ({ label: "", value: "" }),
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
        path: "about.stats",
        itemLabel: "Stat",
        createItem: () => ({ label: "", value: "" }),
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