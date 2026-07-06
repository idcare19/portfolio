"use client";

import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, GripVertical, Lock, Unlock, Eye, EyeOff, Trash2 } from "lucide-react";
import { SectionCard } from "@/components/admin/SectionCard";
import { DEFAULT_SECTION_ORDER } from "@/lib/section-controls";
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
  "faq",
  "achievements",
  "companies",
  "certificates",
  "open-source",
  "contact",
  "github",
];

const LAYOUTS = ["default", "split", "stacked", "compact", "highlight"];

function normalizeOrder(sections: SiteSectionBlock[]) {
  return [...sections].sort((a, b) => a.order - b.order).map((section, index) => ({ ...section, order: index + 1 }));
}

function orderFromArray(sections: SiteSectionBlock[]) {
  return sections.map((section, index) => ({ ...section, order: index + 1 }));
}

export function SectionManager({ sections, onChange }: { sections: SiteSectionBlock[]; onChange: (sections: SiteSectionBlock[]) => void }) {
  const [search, setSearch] = useState("");
  const [dragId, setDragId] = useState<string | null>(null);
  const [newSectionId, setNewSectionId] = useState("");
  const [newSectionLabel, setNewSectionLabel] = useState("");
  const [newSectionType, setNewSectionType] = useState("text");
  const [newSectionOrder, setNewSectionOrder] = useState(String(sections.length + 1));
  const [newSectionEnabled, setNewSectionEnabled] = useState(true);
  const [newSectionHomepage, setNewSectionHomepage] = useState(true);
  const [newSectionNav, setNewSectionNav] = useState(true);

  const visibleSections = useMemo(
    () => normalizeOrder(sections).filter((section) => `${section.label} ${section.renderer} ${section.id}`.toLowerCase().includes(search.toLowerCase())),
    [search, sections]
  );

  function commit(next: SiteSectionBlock[]) {
    onChange(normalizeOrder(next));
  }

  function update(index: number, patch: Partial<SiteSectionBlock>) {
    commit(sections.map((section, itemIndex) => (itemIndex === index ? { ...section, ...patch } : section)));
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= sections.length) return;
    const next = [...sections];
    if ((next[index] as any).locked || (next[target] as any).locked) return;
    [next[index], next[target]] = [next[target], next[index]];
    commit(orderFromArray(next));
  }

  function onDragStart(section: SiteSectionBlock) {
    if ((section as any).locked) return;
    setDragId(section.id);
  }

  function onDrop(target: SiteSectionBlock) {
    if (!dragId || dragId === target.id) return;
    const sourceIndex = sections.findIndex((section) => section.id === dragId);
    const targetIndex = sections.findIndex((section) => section.id === target.id);
    const source = sections[sourceIndex];
    const destination = sections[targetIndex];
    if (!source || !destination || (source as any).locked || (destination as any).locked) return;
    const next = [...sections];
    next.splice(sourceIndex, 1);
    next.splice(targetIndex, 0, source);
    commit(orderFromArray(next));
    setDragId(null);
  }

  function resetToDefaultOrder() {
    commit(orderFromArray([...sections].sort((a, b) => (DEFAULT_SECTION_ORDER.get(a.id as any) ?? a.order) - (DEFAULT_SECTION_ORDER.get(b.id as any) ?? b.order))));
  }

  function removeSection(index: number) {
    commit(sections.filter((_, itemIndex) => itemIndex !== index));
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
      nav: { show: newSectionNav, href: `#${id}`, label },
      emptyMessage: "",
      textBlocks: [],
      settings: {},
      data: {},
      items: [],
    };

    commit([...sections, nextSection]);
    setNewSectionId("");
    setNewSectionLabel("");
    setNewSectionType("text");
    setNewSectionOrder(String(sections.length + 1));
    setNewSectionEnabled(true);
    setNewSectionHomepage(true);
    setNewSectionNav(true);
  }

  return (
    <SectionCard title="Section Manager" description="Drag sections to reorder them, then adjust visibility and nav/homepage settings per section.">
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
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={addSection} className="rounded-2xl bg-admin-primary px-4 py-2 text-sm font-semibold text-white hover:bg-[#1D4ED8]">Add Section</button>
          <button type="button" onClick={resetToDefaultOrder} className="rounded-2xl border border-admin-border px-4 py-2 text-sm font-semibold text-admin-text">Reset to Default Order</button>
        </div>
      </div>
      <div className="mb-4">
        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search sections..." className="w-full rounded-2xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text" />
      </div>

      <div className="space-y-4">
        {visibleSections.map((section) => {
          const index = sections.findIndex((item) => item.id === section.id);
          const locked = Boolean((section as any).locked);
          return (
            <div
              key={String(section.id)}
              draggable={!locked}
              onDragStart={() => onDragStart(section)}
              onDragOver={(event) => event.preventDefault()}
              onDrop={() => onDrop(section)}
              className={`rounded-[26px] border bg-admin-card p-4 ${dragId === section.id ? "border-admin-primary shadow-[0_10px_28px_rgba(29,78,216,0.18)]" : "border-admin-border"}`}
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-admin-border bg-admin-bg text-admin-text" aria-hidden="true">
                    <GripVertical className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-admin-text">{section.label}</p>
                    <p className="text-xs text-admin-text-muted">{section.renderer} • order {section.order}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => update(index, { locked: !locked } as any)} className="rounded-full border border-admin-border p-2 text-admin-text" title={locked ? "Unlock section" : "Lock section"}>
                    {locked ? <Lock className="h-3.5 w-3.5" /> : <Unlock className="h-3.5 w-3.5" />}
                  </button>
                  <button type="button" onClick={() => move(index, -1)} className="rounded-full border border-admin-border p-2 text-admin-text" title="Move up">
                    <ArrowUp className="h-3.5 w-3.5" />
                  </button>
                  <button type="button" onClick={() => move(index, 1)} className="rounded-full border border-admin-border p-2 text-admin-text" title="Move down">
                    <ArrowDown className="h-3.5 w-3.5" />
                  </button>
                  <button type="button" onClick={() => update(index, { enabled: !section.enabled })} className="rounded-full border border-admin-border p-2 text-admin-text" title="Toggle visibility">
                    {section.enabled ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                  </button>
                  <button type="button" onClick={() => removeSection(index)} className="rounded-full border border-rose-200 bg-rose-50 p-2 text-rose-600" title="Delete section">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                <input value={section.label} onChange={(event) => update(index, { label: event.target.value })} className="rounded-2xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text" placeholder="Section label" />
                <input type="number" value={section.order} onChange={(event) => update(index, { order: Number(event.target.value) || 0 })} className="rounded-2xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text" placeholder="Order" />
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
