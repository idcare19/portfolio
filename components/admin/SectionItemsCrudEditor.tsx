"use client";

import { useMemo, useState } from "react";
import { ChevronDown, ChevronUp, Copy, GripVertical, Trash2 } from "lucide-react";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { SectionCard } from "@/components/admin/SectionCard";
import type { SectionItemCrudConfig } from "@/lib/admin/section-content-fields";

type Props = {
  config: SectionItemCrudConfig;
  items: any[];
  onChange: (items: any[]) => void;
};

export function SectionItemsCrudEditor({ config, items, onChange }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const list = Array.isArray(items) ? items : [];

  const titleLabel = useMemo(() => config.description || `Manage ${config.itemLabel.toLowerCase()} entries.`, [config]);

  function update(index: number, key: string, value: unknown) {
    onChange(list.map((item, itemIndex) => (itemIndex === index ? { ...item, [key]: value } : item)));
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= list.length) return;
    const next = [...list];
    const [item] = next.splice(index, 1);
    next.splice(target, 0, item);
    onChange(next.map((item, idx) => ({ ...item, order: typeof item.order === "number" ? item.order : idx + 1 })));
    setOpenIndex(target);
  }

  function duplicate(index: number) {
    const current = list[index];
    const copy = { ...current, id: current.id ? `${current.id}-copy-${Date.now()}` : `item-copy-${Date.now()}` };
    const next = [...list];
    next.splice(index + 1, 0, copy);
    onChange(next);
    setOpenIndex(index + 1);
  }

  function remove(index: number) {
    onChange(list.filter((_, i) => i !== index));
  }

  return (
    <SectionCard
      title={config.label}
      description={titleLabel}
      actions={
        <button type="button" onClick={() => onChange([...list, config.createItem()])} className="rounded-xl border border-admin-border bg-admin-bg px-4 py-2 text-sm font-semibold text-admin-text">
          Add {config.itemLabel}
        </button>
      }
    >
      <div className="space-y-3">
        {list.map((item, index) => (
          <div key={item.id || `${config.path}-${index}`} className="rounded-2xl border border-admin-border bg-admin-card">
            <button type="button" className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left" onClick={() => setOpenIndex(openIndex === index ? null : index)}>
              <span className="flex items-center gap-3">
                <GripVertical className="h-4 w-4 text-admin-text-muted" />
                <span>
                  <span className="block text-sm font-semibold text-admin-text">{String(item.label || item.title || item.name || `${config.itemLabel} ${index + 1}`)}</span>
                  <span className="block text-xs text-admin-text-muted">{item.isEnabled === false ? "Disabled" : "Enabled"}</span>
                </span>
              </span>
              <span className="flex items-center gap-2">
                <button type="button" onClick={(e) => { e.stopPropagation(); move(index, -1); }} className="rounded-lg border border-admin-border px-2 py-1 text-xs">
                  <ChevronUp className="h-4 w-4" />
                </button>
                <button type="button" onClick={(e) => { e.stopPropagation(); move(index, 1); }} className="rounded-lg border border-admin-border px-2 py-1 text-xs">
                  <ChevronDown className="h-4 w-4" />
                </button>
                <button type="button" onClick={(e) => { e.stopPropagation(); duplicate(index); }} className="rounded-lg border border-admin-border px-2 py-1 text-xs">
                  <Copy className="h-4 w-4" />
                </button>
                <button type="button" onClick={(e) => { e.stopPropagation(); setDeleteIndex(index); }} className="rounded-lg border border-rose-200 px-2 py-1 text-xs text-rose-700">
                  <Trash2 className="h-4 w-4" />
                </button>
              </span>
            </button>
            {openIndex === index ? (
              <div className="grid gap-3 border-t border-admin-border p-4 md:grid-cols-2">
                {config.fields.map((field) => (
                  <label key={field.key} className={field.type === "textarea" ? "md:col-span-2" : ""}>
                    <span className="mb-1 block text-sm font-medium text-admin-text">{field.label}</span>
                    {field.type === "checkbox" ? (
                      <input type="checkbox" checked={Boolean(item[field.key])} onChange={(e) => update(index, field.key, e.target.checked)} />
                    ) : field.type === "textarea" ? (
                      <textarea rows={4} value={String(item[field.key] ?? "")} onChange={(e) => update(index, field.key, e.target.value)} className="w-full rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text" />
                    ) : (
                      <input type={field.type === "number" ? "number" : field.type === "url" ? "url" : "text"} value={String(item[field.key] ?? "")} onChange={(e) => update(index, field.key, field.type === "number" ? Number(e.target.value || 0) : e.target.value)} className="w-full rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text" />
                    )}
                  </label>
                ))}
              </div>
            ) : null}
          </div>
        ))}
      </div>
      <ConfirmDialog
        open={deleteIndex !== null}
        title="Delete item?"
        description="This removes the item from the draft immediately."
        onCancel={() => setDeleteIndex(null)}
        onConfirm={() => {
          if (deleteIndex !== null) remove(deleteIndex);
          setDeleteIndex(null);
        }}
      />
    </SectionCard>
  );
}
