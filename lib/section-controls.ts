import type { NavItem, SectionControlItem, SectionId } from "@/src/types/site-data";

export const SECTION_DEFINITIONS: Array<{ id: SectionId; label: string; href: `#${SectionId}`; showInNavByDefault: boolean }> = [
  { id: "about", label: "About", href: "#about", showInNavByDefault: true },
  { id: "skills", label: "Skills", href: "#skills", showInNavByDefault: true },
  { id: "projects", label: "Projects", href: "#projects", showInNavByDefault: true },
  { id: "working", label: "Working", href: "#working", showInNavByDefault: false },
  { id: "completed", label: "Worked On", href: "#completed", showInNavByDefault: true },
  { id: "reviews", label: "Reviews", href: "#reviews", showInNavByDefault: true },
  { id: "journey", label: "Experience", href: "#journey", showInNavByDefault: true },
  { id: "contact", label: "Contact", href: "#contact", showInNavByDefault: true },
];

function sectionIdFromHref(href: string): SectionId | null {
  if (!href.startsWith("#")) return null;
  const candidate = href.slice(1) as SectionId;
  return SECTION_DEFINITIONS.some((section) => section.id === candidate) ? candidate : null;
}

export function normalizeSectionControls(input?: SectionControlItem[]): SectionControlItem[] {
  const source = new Map((input || []).map((item) => [item.id, item] as const));

  return SECTION_DEFINITIONS.map((definition) => {
    const current = source.get(definition.id);
    const deleted = Boolean(current?.deleted);
    const visible = deleted ? false : current?.visible ?? true;
    const showInNav = deleted ? false : current?.showInNav ?? definition.showInNavByDefault;

    return {
      id: definition.id,
      label: current?.label?.trim() || definition.label,
      visible,
      showInNav,
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

  return navItems
    .map((item) => {
      const sectionId = sectionIdFromHref(item.href);
      if (!sectionId) return item;

      const control = controlMap[sectionId];
      if (control.deleted || !control.visible || !control.showInNav) {
        return null;
      }

      return {
        ...item,
        label: control.label || item.label,
      };
    })
    .filter((item): item is NavItem => Boolean(item));
}
