"use client";

import { useMemo, useState } from "react";
import { Copy, GripVertical, Plus, Trash2 } from "lucide-react";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { SectionCard } from "@/components/admin/SectionCard";

type ItemRecord = Record<string, any>;
type FieldType = "text" | "number" | "textarea" | "checkbox" | "select" | "url" | "email";

type FieldOption = {
  label: string;
  value: string;
};

type Props<T extends ItemRecord> = {
  title: string;
  description: string;
  items: T[];
  setItems: (items: T[]) => void;
  fields: Array<{ key: keyof T; label: string; type?: FieldType; options?: FieldOption[]; required?: boolean }>;
  createItem: () => T;
};

export function SimpleArrayEditor<T extends ItemRecord>({ title, description, items, setItems, fields, createItem }: Props<T>) {
  const [pendingDelete, setPendingDelete] = useState<number | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const validationMessage = useMemo(() => {
    if (items.length === 0) return "Add at least one item to keep this section populated.";

    for (const [index, item] of items.entries()) {
      for (const field of fields) {
        if (!field.required) continue;
        const value = item[field.key];
        if (typeof value === "string" && !value.trim()) {
          return `Item ${index + 1}: ${field.label} is required.`;
        }
      }
    }

    return null;
  }, [fields, items]);

  function addItem() {
    setItems([...items, createItem()]);
  }

  function duplicateItem(index: number) {
    const current = items[index];
    const duplicate = {
      ...current,
      id: current.id ? `${current.id}-copy-${Date.now()}` : `item-copy-${Date.now()}`,
    };
    const next = [...items];
    next.splice(index + 1, 0, duplicate);
    setItems(next);
  }

  function removeItem(index: number) {
    setItems(items.filter((_, i) => i !== index));
  }

  function update(index: number, key: keyof T, value: any) {
    setItems(items.map((item, i) => (i === index ? { ...item, [key]: value } : item)));
  }

  function moveItem(from: number, to: number) {
    if (to < 0 || to >= items.length || from === to) return;
    const next = [...items];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    setItems(next);
  }

  return (
    <SectionCard
      title={title}
      description={description}
      actions={
        <button
          onClick={addItem}
          className="inline-flex items-center gap-2 rounded-full border border-[#BFDBFE] bg-[#EFF6FF] px-4 py-2 text-xs font-semibold text-[#1D4ED8] transition hover:-translate-y-0.5 hover:bg-[#DBEAFE]"
        >
          <Plus className="h-3.5 w-3.5" /> Add Item
        </button>
      }
    >
      <div className="space-y-4">
        {validationMessage ? (
          <div className="rounded-2xl border border-[#FCD34D] bg-[#FFFBEB] px-4 py-3 text-sm text-[#92400E]">
            {validationMessage}
          </div>
        ) : null}

        {items.map((item, index) => (
          <div
            key={(item.id as string) || index}
            draggable
            onDragStart={() => setDragIndex(index)}
            onDragOver={(event) => event.preventDefault()}
            onDrop={() => {
              if (dragIndex === null) return;
              moveItem(dragIndex, index);
              setDragIndex(null);
            }}
            className="rounded-[26px] border border-admin-border bg-admin-card p-4 shadow-[0_18px_40px_rgba(0,0,0,0.18)]"
          >
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-admin-border bg-admin-bg text-admin-text-muted">
                  <GripVertical className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-admin-text">Item {index + 1}</p>
                  <p className="text-xs text-admin-text-muted">Drag to reorder</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => duplicateItem(index)}
                  className="inline-flex items-center gap-2 rounded-full border border-admin-border bg-admin-bg px-3 py-2 text-xs font-semibold text-admin-text transition hover:opacity-80"
                >
                  <Copy className="h-3.5 w-3.5" /> Duplicate
                </button>
                <button
                  type="button"
                  onClick={() => setPendingDelete(index)}
                  className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-100"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {fields.map((field) => (
                <label key={String(field.key)} className={`text-sm ${field.type === "textarea" ? "md:col-span-2" : ""}`}>
                  <span className="mb-1.5 block font-medium text-admin-text">{field.label}</span>
                  {field.type === "textarea" ? (
                    <textarea
                      className="w-full rounded-2xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text outline-none transition focus:border-admin-primary/50"
                      rows={4}
                      value={String(item[field.key] ?? "")}
                      onChange={(e) => update(index, field.key, e.target.value)}
                    />
                  ) : field.type === "checkbox" ? (
                    <input type="checkbox" checked={Boolean(item[field.key])} onChange={(e) => update(index, field.key, e.target.checked)} />
                  ) : field.type === "select" ? (
                    <select
                      className="w-full rounded-2xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text outline-none transition focus:border-admin-primary/50"
                      value={String(item[field.key] ?? "")}
                      onChange={(e) => update(index, field.key, e.target.value)}
                    >
                      {(field.options || []).map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type === "number" ? "number" : field.type === "email" ? "email" : field.type === "url" ? "url" : "text"}
                      className="w-full rounded-2xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text outline-none transition focus:border-admin-primary/50"
                      value={field.type === "number" ? Number(item[field.key] ?? 0) : String(item[field.key] ?? "")}
                      onChange={(e) => update(index, field.key, field.type === "number" ? Number(e.target.value || 0) : e.target.value)}
                    />
                  )}
                </label>
              ))}
            </div>
          </div>
        ))}

        {items.length === 0 ? (
          <div className="rounded-[26px] border border-dashed border-admin-border bg-admin-bg px-5 py-10 text-center">
            <p className="text-sm font-medium text-admin-text">No items yet</p>
            <p className="mt-1 text-sm text-admin-text-muted">Create the first item to populate this section.</p>
          </div>
        ) : null}
      </div>

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Delete item?"
        description="This item will be removed from the draft immediately. You can still restore from the last saved version before saving."
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          if (pendingDelete !== null) {
            removeItem(pendingDelete);
          }
          setPendingDelete(null);
        }}
      />
    </SectionCard>
  );
}
