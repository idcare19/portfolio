"use client";

import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, Eye, EyeOff, Plus, Trash2 } from "lucide-react";
import { SectionCard } from "@/components/admin/SectionCard";
import type { SiteSectionBlock } from "@/src/types/site-data";

const RENDERERS = ["hero", "about", "skills", "projects", "working", "completed", "reviews", "journey", "education", "services", "contact", "github"];
const LAYOUTS = ["default", "split", "stacked", "compact", "highlight"];

export function SectionManager({
  sections,
  onChange,
}: {
  sections: SiteSectionBlock[];
  onChange: (sections: SiteSectionBlock[]) => void;
}) {
  const [search, setSearch] = useState("");
  const visibleSections = useMemo(
    () => sections.filter((section) => `${section.label} ${section.renderer}`.toLowerCase().includes(search.toLowerCase())),
    [search, sections]
  );

<<<<<<< HEAD
  function update(id: SiteSectionBlock["id"], patch: Partial<SiteSectionBlock>) {
    onChange(sections.map((section) => (section.id === id ? { ...section, ...patch } : section)));
=======
  function update(index: number, patch: Partial<SiteSectionBlock>) {
    onChange(sections.map((section, itemIndex) => (itemIndex === index ? { ...section, ...patch } : section)));
>>>>>>> c974e6d18f7e4d84cefd23b3ad822ac4cf9981fc
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= sections.length) return;
    const next = [...sections];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next.map((section, order) => ({ ...section, order: order + 1 })));
  }

  function addSection() {
    const nextId = RENDERERS.find((renderer) => !sections.some((section) => section.id === renderer)) || "contact";
    const nextSection: SiteSectionBlock = {
      id: nextId as any,
      label: "New Section",
      renderer: nextId as any,
      enabled: true,
      order: sections.length + 1,
      layout: "default",
      status: "draft",
      data: {},
      items: [],
      textBlocks: [],
      nav: { show: false, href: `#${nextId}`, label: "New Section" },
    };
    if (sections.some((section) => section.id === nextId)) return;
    onChange([...sections, nextSection]);
  }

<<<<<<< HEAD
  function removeSection(id: SiteSectionBlock["id"]) {
    onChange(sections.filter((section) => section.id !== id).map((section, order) => ({ ...section, order: order + 1 })));
=======
  function removeSection(index: number) {
    onChange(sections.filter((_, itemIndex) => itemIndex !== index).map((section, order) => ({ ...section, order: order + 1 })));
>>>>>>> c974e6d18f7e4d84cefd23b3ad822ac4cf9981fc
  }

  return (
    <SectionCard
      title="Section Manager"
      description="Create, edit, reorder, enable, disable, and configure public website sections."
      actions={<button type="button" onClick={addSection} className="inline-flex items-center gap-2 rounded-full bg-admin-primary px-4 py-2 text-xs font-semibold text-white"><Plus className="h-3.5 w-3.5" />Add Section</button>}
    >
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
                  <button type="button" onClick={() => move(index, -1)} className="rounded-full border border-admin-border p-2 text-admin-text"><ArrowUp className="h-3.5 w-3.5" /></button>
                  <button type="button" onClick={() => move(index, 1)} className="rounded-full border border-admin-border p-2 text-admin-text"><ArrowDown className="h-3.5 w-3.5" /></button>
<<<<<<< HEAD
                  <button type="button" onClick={() => update(section.id, { enabled: !section.enabled })} className="rounded-full border border-admin-border p-2 text-admin-text">{section.enabled ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}</button>
                  <button type="button" onClick={() => removeSection(section.id)} className="rounded-full border border-rose-200 bg-rose-50 p-2 text-rose-600"><Trash2 className="h-3.5 w-3.5" /></button>
=======
                  <button type="button" onClick={() => update(index, { enabled: !section.enabled })} className="rounded-full border border-admin-border p-2 text-admin-text">{section.enabled ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}</button>
                  <button type="button" onClick={() => removeSection(index)} className="rounded-full border border-rose-200 bg-rose-50 p-2 text-rose-600"><Trash2 className="h-3.5 w-3.5" /></button>
>>>>>>> c974e6d18f7e4d84cefd23b3ad822ac4cf9981fc
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
<<<<<<< HEAD
                <input value={section.label} onChange={(event) => update(section.id, { label: event.target.value })} className="rounded-2xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text" placeholder="Section label" />
                <select value={section.renderer} onChange={(event) => update(section.id, { renderer: event.target.value as any })} className="rounded-2xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text">
                  {RENDERERS.map((renderer) => <option key={renderer} value={renderer}>{renderer}</option>)}
                </select>
                <select value={section.layout || "default"} onChange={(event) => update(section.id, { layout: event.target.value })} className="rounded-2xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text">
                  {LAYOUTS.map((layout) => <option key={layout} value={layout}>{layout}</option>)}
                </select>
                <select value={section.status || "published"} onChange={(event) => update(section.id, { status: event.target.value as "draft" | "published" })} className="rounded-2xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text">
=======
                <input value={section.label} onChange={(event) => update(index, { label: event.target.value })} className="rounded-2xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text" placeholder="Section label" />
                <select value={section.renderer} onChange={(event) => update(index, { renderer: event.target.value as any })} className="rounded-2xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text">
                  {RENDERERS.map((renderer) => <option key={renderer} value={renderer}>{renderer}</option>)}
                </select>
                <select value={section.layout || "default"} onChange={(event) => update(index, { layout: event.target.value })} className="rounded-2xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text">
                  {LAYOUTS.map((layout) => <option key={layout} value={layout}>{layout}</option>)}
                </select>
                <select value={section.status || "published"} onChange={(event) => update(index, { status: event.target.value as "draft" | "published" })} className="rounded-2xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text">
>>>>>>> c974e6d18f7e4d84cefd23b3ad822ac4cf9981fc
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
                <label className="flex items-center gap-2 text-sm text-admin-text">
<<<<<<< HEAD
                  <input type="checkbox" checked={Boolean(section.nav?.show)} onChange={(event) => update(section.id, { nav: { show: event.target.checked, href: section.nav?.href || `#${section.id}`, label: section.nav?.label || section.label } })} />
=======
                  <input type="checkbox" checked={Boolean(section.nav?.show)} onChange={(event) => update(index, { nav: { show: event.target.checked, href: section.nav?.href || `#${section.id}`, label: section.nav?.label || section.label } })} />
>>>>>>> c974e6d18f7e4d84cefd23b3ad822ac4cf9981fc
                  Show in navigation
                </label>
              </div>
            </div>
          );
        })}
      </div>
    </SectionCard>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> c974e6d18f7e4d84cefd23b3ad822ac4cf9981fc
