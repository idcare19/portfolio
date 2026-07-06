import type { NavItem, SectionControlItem, SectionId } from "@/src/types/site-data";

export const SECTION_DEFINITIONS: Array<{ id: SectionId; label: string; href: string; showInNavByDefault: boolean }> = [
  { id: "hero", label: "Home / Hero", href: "#home", showInNavByDefault: true },
  { id: "about", label: "About", href: "#about", showInNavByDefault: true },
  { id: "skills", label: "Skills", href: "#skills", showInNavByDefault: true },
  { id: "projects", label: "Projects", href: "#projects", showInNavByDefault: true },
  { id: "working", label: "Working", href: "#working", showInNavByDefault: false },
  { id: "completed", label: "Worked On", href: "#completed", showInNavByDefault: true },
  { id: "faq", label: "FAQ", href: "#faq", showInNavByDefault: true },
  { id: "achievements", label: "Achievements", href: "#achievements", showInNavByDefault: false },
  { id: "companies", label: "Companies", href: "#companies", showInNavByDefault: false },
  { id: "certificates", label: "Certificates", href: "#certificates", showInNavByDefault: false },
  { id: "open-source", label: "Open Source", href: "#open-source", showInNavByDefault: true },
  { id: "reviews", label: "Reviews", href: "#reviews", showInNavByDefault: true },
  { id: "journey", label: "Experience", href: "#experience", showInNavByDefault: true },
  { id: "education", label: "Education", href: "#education", showInNavByDefault: false },
  { id: "services", label: "Services", href: "#services", showInNavByDefault: true },
  { id: "contact", label: "Contact", href: "#contact", showInNavByDefault: true },
  { id: "github", label: "GitHub", href: "#github", showInNavByDefault: true },
  { id: "footer", label: "Footer", href: "#footer", showInNavByDefault: false },
];

export const DEFAULT_SECTION_ORDER = new Map<SectionId, number>([
  ["hero", 1],
  ["about", 2],
  ["skills", 3],
  ["projects", 4],
  ["faq", 5],
  ["achievements", 6],
  ["companies", 7],
  ["certificates", 8],
  ["open-source", 9],
  ["working", 10],
  ["completed", 11],
  ["reviews", 12],
  ["journey", 13],
  ["education", 14],
  ["services", 15],
  ["contact", 16],
  ["github", 17],
  ["footer", 18],
]);

function sectionIdFromHref(href: string): SectionId | null {
  if (!href.startsWith("#")) return null;
  const raw = href.slice(1);
  const candidate = (raw === "experience" ? "journey" : raw) as SectionId;
  return SECTION_DEFINITIONS.some((section) => section.id === candidate) ? candidate : null;
}

export function normalizeSectionControls(input?: SectionControlItem[]): SectionControlItem[] {
  const source = new Map((input || []).map((item) => [item.id, item] as const));

  return SECTION_DEFINITIONS.map((definition, index) => {
    const current = source.get(definition.id);
    const deleted = Boolean(current?.deleted);
    const visible = deleted ? false : current?.visible ?? true;
    const showInNav =
      definition.id === "education"
        ? false
        : deleted
          ? false
          : current?.showInNav ?? definition.showInNavByDefault;

    return {
      id: definition.id,
      label: current?.label?.trim() || definition.label,
      order: current?.order ?? DEFAULT_SECTION_ORDER.get(definition.id) ?? index + 1,
      visible,
      showInNav,
      showOnHomepage: current?.showOnHomepage ?? visible,
      locked: current?.locked ?? false,
      deleted,
    };
  });
}

export function toSectionControlMap(input?: SectionControlItem[]): Record<SectionId, SectionControlItem> {
  const normalized = normalizeSectionControls(input);
  return normalized.reduce(
    (acc, item) => {
      acc[item.id] = item;
      return acc;
    },
    {} as Record<SectionId, SectionControlItem>
  );
}

export function isSectionEnabled(id: SectionId, controls?: SectionControlItem[]) {
  const map = toSectionControlMap(controls);
  const section = map[id];
  return !section.deleted && section.visible;
}

export function getManagedNavItems(navItems: NavItem[], controls?: SectionControlItem[]): NavItem[] {
  const controlMap = toSectionControlMap(controls);
  const managed = navItems
    .map((item, index) => {
      const sectionId = sectionIdFromHref(item.href);
      if (!sectionId) return { ...item, __index: index, __order: index };

      const control = controlMap[sectionId];
      if (control.deleted || !control.visible || !control.showInNav) {
        return null;
      }

      return {
        ...item,
        label: control.label || item.label,
        __index: index,
        __order: control.order ?? index,
      };
    })
    .filter((item): item is NavItem & { __index: number; __order: number } => Boolean(item));

  return managed.sort((left, right) => left.__order - right.__order || left.__index - right.__index).map(({ __index, __order, ...item }) => item);
}

export function getSectionHref(id: string) {
  return id === "journey" ? "#experience" : `#${id}`;
}
