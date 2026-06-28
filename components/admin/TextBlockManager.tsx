"use client";

import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { SectionCard } from "@/components/admin/SectionCard";
import type { TextBlock } from "@/src/types/site-data";

const TYPES: TextBlock["type"][] = ["plain", "rich", "markdown", "link", "button", "badge", "stat", "list-item"];
const SECTION_IDS: TextBlock["sectionId"][] = ["hero", "about", "skills", "projects", "working", "completed", "reviews", "journey", "education", "services", "contact", "blogs"];

export function TextBlockManager({
  title,
  description,
  blocks,
  onChange,
  showSectionField = false,
}: {
  title: string;
  description: string;
  blocks: Array<TextBlock & { sectionId?: string }>;
  onChange: (blocks: Array<TextBlock & { sectionId?: string }>) => void;
  showSectionField?: boolean;
}) {
  const [search, setSearch] = useState("");
  const filtered = useMemo(() => blocks.filter((block) => `${block.label} ${block.value} ${block.key}`.toLowerCase().includes(search.toLowerCase())), [blocks, search]);

<<<<<<< HEAD
  function update(target: TextBlock & { sectionId?: string }, patch: Partial<TextBlock & { sectionId?: string }>) {
    onChange(blocks.map((block) => (block.key === target.key && block.sectionId === target.sectionId ? { ...block, ...patch } : block)));
=======
  function update(index: number, patch: Partial<TextBlock & { sectionId?: string }>) {
    onChange(blocks.map((block, itemIndex) => itemIndex === index ? { ...block, ...patch } : block));
>>>>>>> c974e6d18f7e4d84cefd23b3ad822ac4cf9981fc
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= blocks.length) return;
    const next = [...blocks];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next.map((block, order) => ({ ...block, order: order + 1 })));
  }

  function add() {
    onChange([...blocks, { key: `block-${Date.now()}`, type: "plain", label: "New Block", value: "", sectionId: "hero", order: blocks.length + 1, isEnabled: true }]);
  }

<<<<<<< HEAD
  function remove(target: TextBlock & { sectionId?: string }) {
    onChange(blocks.filter((block) => !(block.key === target.key && block.sectionId === target.sectionId)).map((block, order) => ({ ...block, order: order + 1 })));
=======
  function remove(index: number) {
    onChange(blocks.filter((_, itemIndex) => itemIndex !== index).map((block, order) => ({ ...block, order: order + 1 })));
>>>>>>> c974e6d18f7e4d84cefd23b3ad822ac4cf9981fc
  }

  return (
    <SectionCard title={title} description={description} actions={<button type="button" onClick={add} className="inline-flex items-center gap-2 rounded-full bg-admin-primary px-4 py-2 text-xs font-semibold text-white"><Plus className="h-3.5 w-3.5" />Add Block</button>}>
      <div className="mb-4">
        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search text blocks..." className="w-full rounded-2xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text" />
      </div>
      <div className="space-y-4">
        {filtered.map((block) => {
<<<<<<< HEAD
          const identifier = `${block.sectionId || "global"}-${block.key}`;
          return (
            <div key={identifier} className="rounded-[24px] border border-admin-border bg-admin-card p-4">
              <div className="mb-3 flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-admin-text">{block.label}</p>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => move(blocks.findIndex((item) => item.key === block.key && item.sectionId === block.sectionId), -1)} className="rounded-full border border-admin-border p-2 text-admin-text"><ArrowUp className="h-3.5 w-3.5" /></button>
                  <button type="button" onClick={() => move(blocks.findIndex((item) => item.key === block.key && item.sectionId === block.sectionId), 1)} className="rounded-full border border-admin-border p-2 text-admin-text"><ArrowDown className="h-3.5 w-3.5" /></button>
                  <button type="button" onClick={() => remove(block)} className="rounded-full border border-rose-200 bg-rose-50 p-2 text-rose-600"><Trash2 className="h-3.5 w-3.5" /></button>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <input value={block.label} onChange={(event) => update(block, { label: event.target.value })} className="rounded-2xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text" placeholder="Label" />
                <input value={block.key} onChange={(event) => update(block, { key: event.target.value })} className="rounded-2xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text" placeholder="Key" />
                <select value={block.type} onChange={(event) => update(block, { type: event.target.value as TextBlock["type"] })} className="rounded-2xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text">
                  {TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
                </select>
                {showSectionField ? (
                  <select value={block.sectionId} onChange={(event) => update(block, { sectionId: event.target.value as TextBlock["sectionId"] })} className="rounded-2xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text">
                    {SECTION_IDS.map((sectionId) => <option key={sectionId} value={sectionId}>{sectionId}</option>)}
                  </select>
                ) : null}
                <input value={block.href || ""} onChange={(event) => update(block, { href: event.target.value })} className="rounded-2xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text" placeholder="Optional link" />
                <label className="flex items-center gap-2 text-sm text-admin-text">
                  <input type="checkbox" checked={block.isEnabled} onChange={(event) => update(block, { isEnabled: event.target.checked })} />
                  Enabled
                </label>
                <textarea value={block.value} onChange={(event) => update(block, { value: event.target.value })} rows={4} className="rounded-2xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text md:col-span-2" placeholder="Text value" />
=======
          const index = blocks.findIndex((item) => item.key === block.key && item.sectionId === block.sectionId);
          return (
            <div key={`${block.sectionId || "global"}-${block.key}`} className="rounded-[24px] border border-admin-border bg-admin-card p-4">
              <div className="mb-3 flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-admin-text">{block.label}</p>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => move(index, -1)} className="rounded-full border border-admin-border p-2 text-admin-text"><ArrowUp className="h-3.5 w-3.5" /></button>
                  <button type="button" onClick={() => move(index, 1)} className="rounded-full border border-admin-border p-2 text-admin-text"><ArrowDown className="h-3.5 w-3.5" /></button>
                  <button type="button" onClick={() => remove(index)} className="rounded-full border border-rose-200 bg-rose-50 p-2 text-rose-600"><Trash2 className="h-3.5 w-3.5" /></button>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <input value={block.label} onChange={(event) => update(index, { label: event.target.value })} className="rounded-2xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text" placeholder="Label" />
                <input value={block.key} onChange={(event) => update(index, { key: event.target.value })} className="rounded-2xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text" placeholder="Key" />
                <select value={block.type} onChange={(event) => update(index, { type: event.target.value as TextBlock["type"] })} className="rounded-2xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text">
                  {TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
                </select>
                {showSectionField ? (
                  <select value={block.sectionId} onChange={(event) => update(index, { sectionId: event.target.value as TextBlock["sectionId"] })} className="rounded-2xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text">
                    {SECTION_IDS.map((sectionId) => <option key={sectionId} value={sectionId}>{sectionId}</option>)}
                  </select>
                ) : null}
                <input value={block.href || ""} onChange={(event) => update(index, { href: event.target.value })} className="rounded-2xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text" placeholder="Optional link" />
                <label className="flex items-center gap-2 text-sm text-admin-text">
                  <input type="checkbox" checked={block.isEnabled} onChange={(event) => update(index, { isEnabled: event.target.checked })} />
                  Enabled
                </label>
                <textarea value={block.value} onChange={(event) => update(index, { value: event.target.value })} rows={4} className="rounded-2xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text md:col-span-2" placeholder="Text value" />
>>>>>>> c974e6d18f7e4d84cefd23b3ad822ac4cf9981fc
              </div>
            </div>
          );
        })}
      </div>
    </SectionCard>
  );
}
