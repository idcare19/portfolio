import type { SiteData, SiteSectionBlock, TextBlock } from "@/src/types/site-data";
import { normalizeSectionControls } from "@/lib/section-controls";

const CORE_SECTION_IDS = new Set([
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
  "github",
  "footer",
]);

const CORE_RENDERERS = new Set([
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
  "github",
  "footer",
  "generic",
]);

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
  const controlMap = new Map((siteData.sectionControls || []).map((control) => [control.id, control] as const));
  return Object.values(siteData.sections || {})
    .map((section) => ({
      ...section,
      renderer: CORE_SECTION_IDS.has(section.id) ? section.id : CORE_RENDERERS.has(section.renderer) ? section.renderer : "generic",
      layout: section.layout || "default",
      status: section.status || "published",
      nav: {
        show: section.nav?.show ?? section.showOnHomepage ?? CORE_SECTION_IDS.has(section.id),
        href: section.nav?.href || `#${section.id}`,
        label: section.nav?.label || section.label || section.id,
      },
      enabled: section.enabled ?? true,
      showOnHomepage: section.showOnHomepage ?? CORE_SECTION_IDS.has(section.id),
      textBlocks: ensureSectionTextBlocks(section),
      order: controlMap.get(section.id as any)?.order ?? section.order,
    }))
    .sort((a, b) => a.order - b.order);
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
    const section = next.sections?.[block.sectionId];
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

  const section = next.sections?.[root];
  if (section) {
    section.data = { ...section.data, [maybeIndex || block.key]: block.value };
    section.textBlocks = ensureSectionTextBlocks(section).map((item) => item.key === block.key ? block : item);
  }
  return next;
}

export function saveAdminSections(siteData: SiteData, sections: SiteSectionBlock[]) {
  const next = structuredClone(siteData) as SiteData;
  const normalizedControls = normalizeSectionControls(
    sections.map((section, index) => ({
      id: section.id as any,
      label: section.label,
      order: section.order ?? index + 1,
      visible: section.enabled ?? true,
      showInNav: section.nav?.show ?? false,
      showOnHomepage: section.showOnHomepage ?? true,
      locked: (section as any).locked ?? false,
      deleted: false,
    }))
  );
  const sectionMap = Object.fromEntries(
    sections.map((section) => {
      const safeRenderer = CORE_SECTION_IDS.has(section.id) ? section.id : CORE_RENDERERS.has(section.renderer) ? section.renderer : "generic";
      return [
        section.id,
        {
          ...section,
          renderer: safeRenderer,
          enabled: section.enabled ?? true,
          showOnHomepage: section.showOnHomepage ?? CORE_SECTION_IDS.has(section.id),
          nav: {
            show: section.nav?.show ?? CORE_SECTION_IDS.has(section.id),
            href: section.nav?.href || `#${section.id}`,
            label: section.nav?.label || section.label || section.id,
          },
          locked: (section as any).locked ?? false,
          textBlocks: section.textBlocks || [],
          data: (section.textBlocks || []).reduce<Record<string, unknown>>(
            (acc, block) => {
              if (block.isEnabled) acc[block.key] = block.value;
              return acc;
            },
            { ...section.data }
          ),
        },
      ];
    })
  );
  next.sections = sectionMap as SiteData["sections"];
  next.sectionControls = normalizedControls;
  next.nav = sections
    .filter((section) => section.enabled && section.nav?.show)
    .sort((a, b) => a.order - b.order)
    .map((section) => ({ label: section.nav?.label || section.label, href: section.nav?.href || `#${section.id}` }));
  return next;
}
