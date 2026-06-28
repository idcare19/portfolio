import type { SiteData, SiteSectionBlock, TextBlock } from "@/src/types/site-data";

<<<<<<< HEAD
const SECTION_KEYS = ["hero", "about", "skills", "projects", "working", "completed", "reviews", "journey", "education", "services", "contact", "blogs", "footer"] as const;
=======
const SECTION_KEYS = ["hero", "about", "skills", "projects", "working", "completed", "reviews", "journey", "education", "services", "contact", "blogs"] as const;
>>>>>>> c974e6d18f7e4d84cefd23b3ad822ac4cf9981fc

type SectionKey = (typeof SECTION_KEYS)[number];

function makeTextBlock(key: string, label: string, value: unknown, order: number, type: TextBlock["type"] = "plain"): TextBlock {
  return {
    key,
    label,
    type,
    value: String(value ?? ""),
    sectionId: "hero",
    order,
    isEnabled: true,
  };
}

export function ensureSectionTextBlocks(section: SiteSectionBlock) {
  if (section.textBlocks?.length) return section.textBlocks;

  const data = section.data || {};
  const entries = Object.entries(data)
    .filter(([, value]) => typeof value === "string" || typeof value === "number")
    .map(([key, value], index) => ({
      ...makeTextBlock(key, key, value, index + 1, key.toLowerCase().includes("cta") ? "button" : "plain"),
      sectionId: section.id,
    }));

  return entries;
}

export function buildAdminSections(siteData: SiteData) {
  return SECTION_KEYS.map((key) => {
    const section = siteData.sections?.[key];
    if (!section) return null;
    return {
      ...section,
      layout: section.layout || "default",
      status: section.status || "published",
      textBlocks: ensureSectionTextBlocks(section),
    };
  }).filter(Boolean) as SiteSectionBlock[];
}

export function buildGlobalTextBlocks(siteData: SiteData): TextBlock[] {
  const blocks: TextBlock[] = [
    { ...makeTextBlock("owner.username", "Logo / Domain Text", siteData.owner.username, 1), sectionId: "hero" },
    { ...makeTextBlock("owner.identityLine", "Identity Line", siteData.owner.identityLine, 2, "badge"), sectionId: "hero" },
    { ...makeTextBlock("owner.introLine", "Hero Heading", siteData.owner.introLine, 3), sectionId: "hero" },
    { ...makeTextBlock("owner.role", "Hero Subtitle", siteData.owner.role, 4), sectionId: "hero" },
    { ...makeTextBlock("owner.tagline", "Hero Description", siteData.owner.tagline, 5, "rich"), sectionId: "hero" },
    { ...makeTextBlock("owner.resumeUrl", "Resume Link", siteData.owner.resumeUrl, 6, "link"), sectionId: "hero" },
    { ...makeTextBlock("websiteSettings.footerText", "Footer Text", siteData.websiteSettings.footerText, 7), sectionId: "contact" },
  ];

  siteData.socials.forEach((item, index) => {
    blocks.push({ ...makeTextBlock(`socials.${index}.label`, `Social ${index + 1} Label`, item.label, 20 + index * 3), sectionId: "contact" });
    blocks.push({ ...makeTextBlock(`socials.${index}.value`, `Social ${index + 1} Value`, item.value, 21 + index * 3), sectionId: "contact" });
    blocks.push({ ...makeTextBlock(`socials.${index}.href`, `Social ${index + 1} Link`, item.href, 22 + index * 3, "link"), href: item.href, sectionId: "contact" });
  });

  return blocks;
}

export function updateTextBlockValue(siteData: SiteData, block: TextBlock & { sectionId?: string }) {
  const next = structuredClone(siteData) as SiteData;
  if (block.sectionId) {
    const section = next.sections?.[block.sectionId as SectionKey];
    if (section) {
      section.data = { ...section.data, [block.key]: block.value };
      section.textBlocks = ensureSectionTextBlocks(section).map((item) => item.key === block.key ? { ...block } : item);
    }
    return next;
  }
  const [root, maybeIndex, maybeField] = block.key.split(".");

  if (root === "owner" && maybeField) {
    (next.owner as Record<string, unknown>)[maybeField] = block.value;
    return next;
  }
  if (root === "websiteSettings" && maybeField) {
    (next.websiteSettings as Record<string, unknown>)[maybeField] = block.value;
    return next;
  }
  if (root === "socials" && typeof maybeIndex !== "undefined" && maybeField) {
    const index = Number(maybeIndex);
    if (!Number.isNaN(index) && next.socials[index]) {
      (next.socials[index] as Record<string, unknown>)[maybeField] = block.value;
    }
    return next;
  }

  const section = next.sections?.[root as SectionKey];
  if (section) {
    section.data = { ...section.data, [maybeIndex || block.key]: block.value };
    section.textBlocks = ensureSectionTextBlocks(section).map((item) => item.key === block.key ? block : item);
  }
  return next;
}

export function saveAdminSections(siteData: SiteData, sections: SiteSectionBlock[]) {
  const next = structuredClone(siteData) as SiteData;
  const sectionMap = Object.fromEntries(sections.map((section) => [section.id, {
    ...section,
    textBlocks: section.textBlocks || [],
    data: (section.textBlocks || []).reduce<Record<string, unknown>>((acc, block) => {
      if (block.isEnabled) acc[block.key] = block.value;
      return acc;
    }, { ...section.data }),
  }]));
  next.sections = sectionMap as SiteData["sections"];
  next.nav = sections
    .filter((section) => section.enabled && section.nav?.show)
    .sort((a, b) => a.order - b.order)
    .map((section) => ({ label: section.nav?.label || section.label, href: section.nav?.href || `#${section.id}` }));
  return next;
<<<<<<< HEAD
}
=======
}
>>>>>>> c974e6d18f7e4d84cefd23b3ad822ac4cf9981fc
