"use client";

import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, Eye, EyeOff, Trash2 } from "lucide-react";
import { SectionCard } from "@/components/admin/SectionCard";
import type { SiteSectionBlock } from "@/src/types/site-data";

const RENDERERS = [
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
  "github",
];

const LAYOUTS = ["default", "split", "stacked", "compact", "highlight"];
export function SectionManager({
  sections,
  onChange,
}: {
  sections: SiteSectionBlock[];
  onChange: (sections: SiteSectionBlock[]) => void;
}) {
  const [search, setSearch] = useState("");
  const [newSectionId, setNewSectionId] = useState("");
  const [newSectionLabel, setNewSectionLabel] = useState("");
  const [newSectionType, setNewSectionType] = useState("text");
  const [newSectionOrder, setNewSectionOrder] = useState(String(sections.length + 1));
  const [newSectionEnabled, setNewSectionEnabled] = useState(true);
  const [newSectionHomepage, setNewSectionHomepage] = useState(true);
  const [newSectionNav, setNewSectionNav] = useState(true);
  const visibleSections = useMemo(
    () => sections.filter((section) => `${section.label} ${section.renderer} ${section.id}`.toLowerCase().includes(search.toLowerCase())),
    [search, sections]
  );

  function update(index: number, patch: Partial<SiteSectionBlock>) {
    onChange(sections.map((section, itemIndex) => (itemIndex === index ? { ...section, ...patch } : section)));
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= sections.length) return;
    const next = [...sections];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next.map((section, order) => ({ ...section, order: order + 1 })));
  }

  function removeSection(index: number) {
    onChange(sections.filter((_, itemIndex) => itemIndex !== index).map((section, order) => ({ ...section, order: order + 1 })));
  }

  function addSection() {
    const id = newSectionId.trim().toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, "");
    const label = newSectionLabel.trim();
    const order = Number(newSectionOrder) || sections.length + 1;
    if (!id || !label) return;
    if (sections.some((section) => section.id === id)) return;

    const nextSection: SiteSectionBlock = {
      id,
      label,
      renderer: "generic",
      template: newSectionType,
      enabled: newSectionEnabled,
      order,
      layout: "default",
      status: "published",
      showOnHomepage: newSectionHomepage,
      nav: {
        show: newSectionNav,
        href: `#${id}`,
        label,
      },
      emptyMessage: "",
      textBlocks: [],
      settings: {},
      data: {},
      items: [],
    };

    onChange([...sections, nextSection]);
    setNewSectionId("");
    setNewSectionLabel("");
    setNewSectionType("text");
    setNewSectionOrder(String(sections.length + 1));
    setNewSectionEnabled(true);
    setNewSectionHomepage(true);
    setNewSectionNav(true);
  }

  return (
    <SectionCard
      title="Section Manager"
      description="Create, edit, reorder, enable, disable, and configure public website sections."
    >
      <div className="mb-4 grid gap-3 rounded-[24px] border border-admin-border bg-admin-bg p-4 md:grid-cols-2">
        <input value={newSectionLabel} onChange={(event) => { setNewSectionLabel(event.target.value); setNewSectionId(event.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, "")); }} placeholder="Section Name" className="rounded-2xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text" />
        <input value={newSectionId} onChange={(event) => setNewSectionId(event.target.value)} placeholder="Auto slug" className="rounded-2xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text" />
        <select value={newSectionType} onChange={(event) => setNewSectionType(event.target.value)} className="rounded-2xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text">
          <option value="text">Text</option>
          <option value="cards">Cards</option>
          <option value="faq">FAQ</option>
          <option value="gallery">Gallery</option>
          <option value="stats">Stats</option>
        </select>
        <input value={newSectionOrder} onChange={(event) => setNewSectionOrder(event.target.value)} type="number" placeholder="Order" className="rounded-2xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text" />
        <label className="flex items-center gap-2 text-sm text-admin-text"><input type="checkbox" checked={newSectionEnabled} onChange={(e) => setNewSectionEnabled(e.target.checked)} /> Enabled</label>
        <label className="flex items-center gap-2 text-sm text-admin-text"><input type="checkbox" checked={newSectionHomepage} onChange={(e) => setNewSectionHomepage(e.target.checked)} /> Show on homepage</label>
        <label className="flex items-center gap-2 text-sm text-admin-text"><input type="checkbox" checked={newSectionNav} onChange={(e) => setNewSectionNav(e.target.checked)} /> Show in navbar</label>
        <button type="button" onClick={addSection} className="rounded-2xl bg-admin-primary px-4 py-2 text-sm font-semibold text-white hover:bg-[#1D4ED8]">
          Add Section
        </button>
      </div>
      <div className="mb-4">
        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search sections..." className="w-full rounded-2xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text" />
      </div>

      <div className="space-y-4">
        {visibleSections.map((section) => {
          const index = sections.findIndex((item) => item.id === section.id);
          return (
            <div key={String(section.id)} className="rounded-[26px] border border-admin-border bg-admin-card p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-admin-text">{section.label}</p>
                  <p className="text-xs text-admin-text-muted">{section.renderer} • order {section.order}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => move(index, -1)} className="rounded-full border border-admin-border p-2 text-admin-text">
                    <ArrowUp className="h-3.5 w-3.5" />
                  </button>
                  <button type="button" onClick={() => move(index, 1)} className="rounded-full border border-admin-border p-2 text-admin-text">
                    <ArrowDown className="h-3.5 w-3.5" />
                  </button>
                  <button type="button" onClick={() => update(index, { enabled: !section.enabled })} className="rounded-full border border-admin-border p-2 text-admin-text">
                    {section.enabled ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                  </button>
                  <button type="button" onClick={() => removeSection(index)} className="rounded-full border border-rose-200 bg-rose-50 p-2 text-rose-600">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                <input value={section.label} onChange={(event) => update(index, { label: event.target.value })} className="rounded-2xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text" placeholder="Section label" />
                <select value={section.renderer} onChange={(event) => update(index, { renderer: event.target.value as any })} className="rounded-2xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text">
                  {RENDERERS.map((renderer) => (
                    <option key={renderer} value={renderer}>
                      {renderer}
                    </option>
                  ))}
                </select>
                <select value={section.layout || "default"} onChange={(event) => update(index, { layout: event.target.value })} className="rounded-2xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text">
                  {LAYOUTS.map((layout) => (
                    <option key={layout} value={layout}>
                      {layout}
                    </option>
                  ))}
                </select>
                <select value={section.status || "published"} onChange={(event) => update(index, { status: event.target.value as "draft" | "published" })} className="rounded-2xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text">
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
                <label className="flex items-center gap-2 text-sm text-admin-text">
                  <input type="checkbox" checked={Boolean(section.nav?.show)} onChange={(event) => update(index, { nav: { show: event.target.checked, href: section.nav?.href || `#${section.id}`, label: section.nav?.label || section.label } })} />
                  Show in navigation
                </label>
                <label className="flex items-center gap-2 text-sm text-admin-text">
                  <input type="checkbox" checked={Boolean(section.showOnHomepage ?? true)} onChange={(event) => update(index, { showOnHomepage: event.target.checked })} />
                  Show on homepage
                </label>
              </div>
            </div>
          );
        })}
      </div>
    </SectionCard>
  );
}
