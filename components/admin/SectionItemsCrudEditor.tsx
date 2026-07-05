"use client";

import { useMemo, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { ChevronDown, ChevronUp, GripVertical, ImagePlus, Plus, Trash2 } from "lucide-react";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { CustomFieldsEditor } from "@/components/admin/CustomFieldsEditor";
import { SectionCard } from "@/components/admin/SectionCard";
import type { SectionItemCrudConfig } from "@/lib/admin/section-content-fields";

type Props = {
  config: SectionItemCrudConfig;
  items: any[];
  onChange: (items: any[]) => void;
};

function uid(prefix: string) {
  return globalThis.crypto?.randomUUID?.() || `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function asList(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String).filter(Boolean);
  if (typeof value === "string") return value.split(",").map((entry) => entry.trim()).filter(Boolean);
  return [];
}

function labelForIndex(item: any, index: number) {
  return String(item?.question || item?.title || item?.companyName || item?.certificateTitle || item?.projectName || item?.label || item?.name || item?.value || `Item ${index + 1}`);
}

function StatusPill({ label, tone = "neutral" }: { label: string; tone?: "neutral" | "green" | "blue" | "amber" | "rose" }) {
  const styles: Record<string, string> = {
    neutral: "border-admin-border bg-admin-bg text-admin-text-muted",
    green: "border-emerald-200 bg-emerald-50 text-emerald-700",
    blue: "border-blue-200 bg-blue-50 text-blue-700",
    amber: "border-amber-200 bg-amber-50 text-amber-700",
    rose: "border-rose-200 bg-rose-50 text-rose-700",
  };
  return <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold ${styles[tone]}`}>{label}</span>;
}

function MiniCrudList({
  label,
  values,
  onChange,
  placeholder,
}: {
  label: string;
  values: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
}) {
  const [draft, setDraft] = useState("");
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  function commit(next: string[]) {
    onChange(next.filter((entry) => entry.trim().length > 0));
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= values.length) return;
    const next = [...values];
    const [item] = next.splice(index, 1);
    next.splice(target, 0, item);
    commit(next);
  }

  function addItem() {
    const next = draft.trim();
    if (!next) return;
    commit([...values, next]);
    setDraft("");
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addItem();
            }
          }}
          placeholder={placeholder || `Add ${label.toLowerCase()}`}
          className="w-full rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text"
        />
        <button type="button" onClick={addItem} className="inline-flex items-center gap-2 rounded-xl border border-admin-border px-3 py-2 text-xs font-semibold text-admin-text">
          <Plus className="h-4 w-4" />
          Add
        </button>
      </div>
      <div className="space-y-2">
        {values.length ? (
          values.map((value, index) => (
            <div
              key={`${label}-${value}-${index}`}
              className="flex items-center gap-2 rounded-xl border border-admin-border bg-admin-card px-3 py-2"
              draggable
              onDragStart={() => setDragIndex(index)}
              onDragOver={(event) => event.preventDefault()}
              onDrop={() => {
                if (dragIndex === null) return;
                const next = [...values];
                const [moved] = next.splice(dragIndex, 1);
                next.splice(index, 0, moved);
                commit(next);
                setDragIndex(null);
              }}
              onDragEnd={() => setDragIndex(null)}
            >
              <GripVertical className="h-4 w-4 shrink-0 text-admin-text-muted" />
              <input
                value={value}
                onChange={(e) => {
                  const next = [...values];
                  next[index] = e.target.value;
                  commit(next);
                }}
                className="min-w-0 flex-1 rounded-lg border border-admin-border bg-admin-input px-2 py-1 text-sm text-admin-text"
                aria-label={`${label} item ${index + 1}`}
              />
              <button type="button" onClick={() => move(index, -1)} className="rounded-lg border border-admin-border px-2 py-1 text-xs">
                <ChevronUp className="h-4 w-4" />
              </button>
              <button type="button" onClick={() => move(index, 1)} className="rounded-lg border border-admin-border px-2 py-1 text-xs">
                <ChevronDown className="h-4 w-4" />
              </button>
              <button type="button" onClick={() => commit(values.filter((_, itemIndex) => itemIndex !== index))} className="rounded-lg border border-rose-200 px-2 py-1 text-xs text-rose-700">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))
        ) : (
          <p className="text-xs text-admin-text-muted">No {label.toLowerCase()} yet.</p>
        )}
      </div>
    </div>
  );
}

function GalleryEditor({
  values,
  onChange,
}: {
  values: string[];
  onChange: (next: string[]) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  function commit(next: string[]) {
    onChange(next.filter(Boolean));
  }

  async function handleFiles(files: FileList | null) {
    if (!files?.length) return;
    const selected = await Promise.all(
      Array.from(files).map(
        (file) =>
          new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(String(reader.result || ""));
            reader.onerror = () => reject(reader.error);
            reader.readAsDataURL(file);
          })
      )
    );
    commit([...values, ...selected]);
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= values.length) return;
    const next = [...values];
    const [item] = next.splice(index, 1);
    next.splice(target, 0, item);
    commit(next);
  }

  return (
    <div className="space-y-3">
      <button type="button" onClick={() => fileInputRef.current?.click()} className="inline-flex items-center gap-2 rounded-xl border border-admin-border px-3 py-2 text-xs font-semibold text-admin-text">
        <ImagePlus className="h-4 w-4" />
        Upload images
      </button>
      <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => void handleFiles(e.target.files)} />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {values.length ? (
          values.map((value, index) => (
            <div
              key={`${value}-${index}`}
              className="overflow-hidden rounded-2xl border border-admin-border bg-admin-card"
              draggable
              onDragStart={() => setDragIndex(index)}
              onDragOver={(event) => event.preventDefault()}
              onDrop={() => {
                if (dragIndex === null) return;
                const next = [...values];
                const [moved] = next.splice(dragIndex, 1);
                next.splice(index, 0, moved);
                commit(next);
                setDragIndex(null);
              }}
              onDragEnd={() => setDragIndex(null)}
            >
              <div className="aspect-[16/9] bg-admin-bg">
                <img src={value} alt={`Gallery ${index + 1}`} className="h-full w-full object-cover" />
              </div>
              <div className="space-y-2 border-t border-admin-border p-3">
                <input
                  value={value}
                  onChange={(e) => {
                    const next = [...values];
                    next[index] = e.target.value;
                    commit(next);
                  }}
                  className="w-full rounded-lg border border-admin-border bg-admin-input px-2 py-1 text-xs text-admin-text"
                  aria-label={`Gallery image ${index + 1}`}
                />
                <div className="flex items-center justify-end gap-1">
                  <button type="button" onClick={() => move(index, -1)} className="rounded-lg border border-admin-border px-2 py-1 text-xs">
                    <ChevronUp className="h-4 w-4" />
                  </button>
                  <button type="button" onClick={() => move(index, 1)} className="rounded-lg border border-admin-border px-2 py-1 text-xs">
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  <button type="button" onClick={() => commit(values.filter((_, itemIndex) => itemIndex !== index))} className="rounded-lg border border-rose-200 px-2 py-1 text-xs text-rose-700">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-xs text-admin-text-muted">No gallery images yet.</p>
        )}
      </div>
    </div>
  );
}

function fieldValue(item: any, key: string) {
  const value = item?.[key];
  if (Array.isArray(value)) return value.join(", ");
  if (typeof value === "boolean") return value ? "true" : "false";
  return String(value ?? "");
}

function setListField(item: any, key: string, value: string[]) {
  return { ...item, [key]: value };
}

export function SectionItemsCrudEditor({ config, items, onChange }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const list = Array.isArray(items) ? items : [];

  const titleLabel = useMemo(() => config.description || `Manage ${config.itemLabel.toLowerCase()} entries.`, [config]);

  function update(index: number, key: string, value: unknown) {
    onChange(list.map((item, itemIndex) => (itemIndex === index ? { ...item, [key]: value } : item)));
  }

  function updateList(index: number, key: string, value: string[]) {
    onChange(list.map((item, itemIndex) => (itemIndex === index ? setListField(item, key, value) : item)));
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

  function moveToIndex(fromIndex: number, toIndex: number) {
    if (fromIndex === toIndex || toIndex < 0 || toIndex >= list.length) return;
    const next = [...list];
    const [item] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, item);
    onChange(next.map((entry, idx) => ({ ...entry, order: idx + 1 })));
    setOpenIndex(toIndex);
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

  function handleHeaderKeyDown(event: KeyboardEvent<HTMLDivElement>, index: number) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setOpenIndex(openIndex === index ? null : index);
    }
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
          <div
            key={item.id || `${config.path}-${index}`}
            className="rounded-2xl border border-admin-border bg-admin-card"
            draggable
            onDragStart={() => setDragIndex(index)}
            onDragOver={(event) => event.preventDefault()}
            onDrop={() => {
              if (dragIndex === null) return;
              moveToIndex(dragIndex, index);
              setDragIndex(null);
            }}
            onDragEnd={() => setDragIndex(null)}
          >
            <div
              role="button"
              tabIndex={0}
              className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left outline-none"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              onKeyDown={(event) => handleHeaderKeyDown(event, index)}
            >
              <span className="flex min-w-0 items-center gap-3">
                <GripVertical className="h-4 w-4 shrink-0 text-admin-text-muted" />
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-admin-text">{labelForIndex(item, index)}</span>
                  <span className="mt-1 flex flex-wrap gap-2">
                    <StatusPill label={`#${Number(item.order || index + 1)}`} />
                    <StatusPill label={item.status || item.category || "Project"} tone="blue" />
                    <StatusPill label={item.isEnabled === false ? "Disabled" : "Enabled"} tone={item.isEnabled === false ? "rose" : "green"} />
                    <StatusPill label={item.featured || item.isFeatured ? "Featured" : "Normal"} tone={item.featured || item.isFeatured ? "amber" : "neutral"} />
                  </span>
                </span>
              </span>
              <ChevronDown className={`h-4 w-4 text-admin-text-muted transition-transform ${openIndex === index ? "rotate-180" : ""}`} />
            </div>
            <div className="flex flex-wrap items-center justify-end gap-2 px-4 pb-4">
              <button type="button" onClick={() => move(index, -1)} className="rounded-lg border border-admin-border px-2 py-1 text-xs">
                <ChevronUp className="h-4 w-4" />
              </button>
              <button type="button" onClick={() => move(index, 1)} className="rounded-lg border border-admin-border px-2 py-1 text-xs">
                <ChevronDown className="h-4 w-4" />
              </button>
              <button type="button" onClick={() => duplicate(index)} className="rounded-lg border border-admin-border px-2 py-1 text-xs">
                Duplicate
              </button>
              <button type="button" onClick={() => setDeleteIndex(index)} className="rounded-lg border border-rose-200 px-2 py-1 text-xs text-rose-700">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            {openIndex === index ? (
              <div className="space-y-5 border-t border-admin-border p-4">
                {config.groups?.length ? null : (
                  <div className="grid gap-3 md:grid-cols-2">
                    {config.fields.map((field) => {
                      if (field.key === "customFields") return null;
                      const commonClass = field.type === "textarea" ? "md:col-span-2" : "";
                      if (field.type === "checkbox") {
                        return (
                          <label key={field.key} className={commonClass}>
                            <span className="mb-1 block text-sm font-medium text-admin-text">{field.label}</span>
                            <input type="checkbox" checked={Boolean(item[field.key])} onChange={(e) => update(index, field.key, e.target.checked)} />
                          </label>
                        );
                      }

                      if (field.type === "textarea") {
                        return (
                          <label key={field.key} className={commonClass}>
                            <span className="mb-1 block text-sm font-medium text-admin-text">{field.label}</span>
                            <textarea
                              rows={4}
                              value={fieldValue(item, field.key)}
                              onChange={(e) => update(index, field.key, e.target.value)}
                              className="w-full rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text"
                            />
                          </label>
                        );
                      }

                      return (
                        <label key={field.key} className={commonClass}>
                          <span className="mb-1 block text-sm font-medium text-admin-text">{field.label}</span>
                          <input
                            type={field.type === "number" ? "number" : field.type === "url" ? "url" : "text"}
                            value={fieldValue(item, field.key)}
                            onChange={(e) => update(index, field.key, field.type === "number" ? Number(e.target.value || 0) : e.target.value)}
                            className="w-full rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text"
                          />
                        </label>
                      );
                    })}
                  </div>
                )}

                {config.groups?.map((group) => (
                  <div key={group.title} className="rounded-2xl border border-admin-border bg-admin-bg p-4">
                    <div className="mb-3">
                      <h4 className="text-sm font-semibold text-admin-text">{group.title}</h4>
                      {group.description ? <p className="mt-1 text-xs text-admin-text-muted">{group.description}</p> : null}
                    </div>
                    <div className="grid gap-3 md:grid-cols-2">
                      {group.fields.map((fieldKey) => {
                        const field = config.fields.find((entry) => entry.key === fieldKey);
                        if (!field) return null;

                        if (field.key === "galleryImages") {
                          return (
                            <div key={field.key} className="md:col-span-2">
                              <span className="mb-1 block text-sm font-medium text-admin-text">{field.label}</span>
                              <GalleryEditor values={asList(item[field.key])} onChange={(next) => updateList(index, field.key, next)} />
                            </div>
                          );
                        }

                        if (field.key === "techStack" || field.key === "features" || field.key === "responsibilities" || field.key === "achievements" || field.key === "tags") {
                          return (
                            <div key={field.key} className="md:col-span-2">
                              <span className="mb-1 block text-sm font-medium text-admin-text">{field.label}</span>
                              <MiniCrudList
                                label={field.label}
                                values={asList(item[field.key])}
                                onChange={(next) => updateList(index, field.key, next)}
                                placeholder={`Add ${field.label.toLowerCase().replace(/s$/, "")}`}
                              />
                            </div>
                          );
                        }

                        if (field.type === "checkbox") {
                          return (
                            <label key={field.key}>
                              <span className="mb-1 block text-sm font-medium text-admin-text">{field.label}</span>
                              <input type="checkbox" checked={Boolean(item[field.key])} onChange={(e) => update(index, field.key, e.target.checked)} />
                            </label>
                          );
                        }

                        if (field.type === "textarea") {
                          return (
                            <label key={field.key} className="md:col-span-2">
                              <span className="mb-1 block text-sm font-medium text-admin-text">{field.label}</span>
                              <textarea
                                rows={4}
                                value={fieldValue(item, field.key)}
                                onChange={(e) => update(index, field.key, e.target.value)}
                                className="w-full rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text"
                              />
                            </label>
                          );
                        }

                        return (
                          <label key={field.key}>
                            <span className="mb-1 block text-sm font-medium text-admin-text">{field.label}</span>
                            <input
                              type={field.type === "number" ? "number" : field.type === "url" ? "url" : "text"}
                              value={fieldValue(item, field.key)}
                              onChange={(e) => update(index, field.key, field.type === "number" ? Number(e.target.value || 0) : e.target.value)}
                              className="w-full rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text"
                            />
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))}
                <CustomFieldsEditor
                  value={Array.isArray(item.customFields) ? item.customFields : []}
                  onChange={(next) => update(index, "customFields", next)}
                />
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
