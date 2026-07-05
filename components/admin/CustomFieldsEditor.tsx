"use client";

import { useMemo, useState } from "react";
import { ChevronDown, ChevronUp, Copy, GripVertical, Plus, Search, Trash2 } from "lucide-react";
import type { CustomField } from "@/src/types/site-data";

type Props = {
  value?: CustomField[];
  onChange: (next: CustomField[]) => void;
};

const fieldTypes: CustomField["type"][] = ["text", "textarea", "richText", "number", "boolean", "date", "url", "email", "image", "tags", "select", "multiSelect", "json", "object"];

function uid() {
  return globalThis.crypto?.randomUUID?.() || `cf-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
}

function normalizeField(field: Partial<CustomField>, index: number): CustomField {
  return {
    id: field.id || uid(),
    label: field.label || "",
    key: field.key || slugify(field.label || `field_${index + 1}`),
    type: field.type || "text",
    value: field.value ?? "",
    required: Boolean(field.required),
    showOnPublic: field.showOnPublic ?? false,
    showInAdmin: field.showInAdmin ?? true,
    order: Number(field.order ?? index + 1),
    description: field.description || "",
    options: Array.isArray(field.options) ? field.options : [],
  };
}

function renderValue(field: CustomField) {
  if (field.type === "boolean") return String(Boolean(field.value));
  if (Array.isArray(field.value)) return field.value.join(", ");
  if (typeof field.value === "object" && field.value !== null) return JSON.stringify(field.value, null, 2);
  return String(field.value ?? "");
}

export function CustomFieldsEditor({ value = [], onChange }: Props) {
  const [query, setQuery] = useState("");
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const fields = useMemo(() => value.map((field, index) => normalizeField(field, index)).sort((a, b) => Number(a.order ?? 0) - Number(b.order ?? 0)), [value]);

  const filtered = fields.filter((field) => {
    const haystack = `${field.label} ${field.key} ${field.description || ""} ${field.type}`.toLowerCase();
    return haystack.includes(query.toLowerCase());
  });

  function commit(next: CustomField[]) {
    onChange(next.map((field, index) => normalizeField({ ...field, order: index + 1 }, index)));
  }

  function update(index: number, patch: Partial<CustomField>) {
    commit(fields.map((field, fieldIndex) => (fieldIndex === index ? normalizeField({ ...field, ...patch }, fieldIndex) : field)));
  }

  function duplicate(index: number) {
    const field = fields[index];
    commit([...fields.slice(0, index + 1), normalizeField({ ...field, id: uid(), key: `${field.key}_copy`, label: `${field.label} Copy` }, index + 1), ...fields.slice(index + 1)]);
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= fields.length) return;
    const next = [...fields];
    const [item] = next.splice(index, 1);
    next.splice(target, 0, item);
    commit(next);
  }

  return (
    <div className="space-y-4 rounded-3xl border border-admin-border bg-admin-bg p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h4 className="text-sm font-semibold text-admin-text">Custom Fields</h4>
          <p className="mt-1 text-xs text-admin-text-muted">Unlimited item-level custom fields. Stored in JSON, not schema columns.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 rounded-full border border-admin-border bg-white px-3 py-2">
            <Search className="h-3.5 w-3.5 text-admin-text-muted" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search fields" className="w-40 bg-transparent text-xs outline-none" />
          </div>
          <button type="button" onClick={() => commit([...fields, normalizeField({ label: "", key: "", type: "text", value: "" }, fields.length)])} className="inline-flex items-center gap-2 rounded-full border border-admin-border bg-white px-3 py-2 text-xs font-semibold text-admin-text">
            <Plus className="h-3.5 w-3.5" /> Add field
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {filtered.length ? filtered.map((field, index) => {
          const actualIndex = fields.findIndex((entry) => entry.id === field.id);
          const isCollapsed = collapsed[field.id] ?? false;
          return (
            <div key={field.id} className="rounded-2xl border border-admin-border bg-admin-card">
              <button type="button" onClick={() => setCollapsed((curr) => ({ ...curr, [field.id]: !isCollapsed }))} className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left">
                <span className="flex min-w-0 items-center gap-3">
                  <GripVertical className="h-4 w-4 shrink-0 text-admin-text-muted" />
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold text-admin-text">{field.label || "Untitled field"}</span>
                    <span className="text-xs text-admin-text-muted">{field.key || "missing key"} · {field.type}</span>
                  </span>
                </span>
                <ChevronDown className={`h-4 w-4 text-admin-text-muted transition-transform ${isCollapsed ? "" : "rotate-180"}`} />
              </button>
              {!isCollapsed ? (
                <div className="space-y-4 border-t border-admin-border p-4">
                  <div className="grid gap-3 md:grid-cols-2">
                    <input className="rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text" value={field.label} onChange={(e) => update(actualIndex, { label: e.target.value })} placeholder="Label" />
                    <input className="rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text" value={field.key} onChange={(e) => update(actualIndex, { key: slugify(e.target.value) })} placeholder="Key" />
                    <select className="rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text" value={field.type} onChange={(e) => update(actualIndex, { type: e.target.value as CustomField["type"] })}>
                      {fieldTypes.map((type) => <option key={type} value={type}>{type}</option>)}
                    </select>
                    <textarea className="rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text md:col-span-2" rows={field.type === "textarea" || field.type === "json" || field.type === "object" || field.type === "richText" ? 4 : 2} value={renderValue(field)} onChange={(e) => update(actualIndex, { value: e.target.value })} placeholder="Value" />
                    <textarea className="rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text md:col-span-2" rows={2} value={field.description || ""} onChange={(e) => update(actualIndex, { description: e.target.value })} placeholder="Description" />
                    <textarea className="rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text md:col-span-2" rows={2} value={(field.options || []).join(", ")} onChange={(e) => update(actualIndex, { options: e.target.value.split(",").map((item) => item.trim()).filter(Boolean) })} placeholder="Options (comma separated)" />
                    <label className="inline-flex items-center gap-2 text-sm text-admin-text"><input type="checkbox" checked={Boolean(field.required)} onChange={(e) => update(actualIndex, { required: e.target.checked })} /> Required</label>
                    <label className="inline-flex items-center gap-2 text-sm text-admin-text"><input type="checkbox" checked={field.showOnPublic !== false} onChange={(e) => update(actualIndex, { showOnPublic: e.target.checked })} /> Show on Public</label>
                    <label className="inline-flex items-center gap-2 text-sm text-admin-text"><input type="checkbox" checked={field.showInAdmin !== false} onChange={(e) => update(actualIndex, { showInAdmin: e.target.checked })} /> Show in Admin</label>
                    <input type="number" className="rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text" value={field.order ?? actualIndex + 1} onChange={(e) => update(actualIndex, { order: Number(e.target.value || 0) })} placeholder="Order" />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button type="button" onClick={() => move(actualIndex, -1)} className="inline-flex items-center gap-2 rounded-full border border-admin-border bg-white px-3 py-2 text-xs font-semibold text-admin-text"><ChevronUp className="h-3.5 w-3.5" /> Move up</button>
                    <button type="button" onClick={() => move(actualIndex, 1)} className="inline-flex items-center gap-2 rounded-full border border-admin-border bg-white px-3 py-2 text-xs font-semibold text-admin-text"><ChevronDown className="h-3.5 w-3.5" /> Move down</button>
                    <button type="button" onClick={() => duplicate(actualIndex)} className="inline-flex items-center gap-2 rounded-full border border-admin-border bg-white px-3 py-2 text-xs font-semibold text-admin-text"><Copy className="h-3.5 w-3.5" /> Duplicate</button>
                    <button type="button" onClick={() => commit(fields.filter((entry) => entry.id !== field.id))} className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700"><Trash2 className="h-3.5 w-3.5" /> Delete</button>
                  </div>
                </div>
              ) : null}
            </div>
          );
        }) : <p className="text-sm text-admin-text-muted">No custom fields yet.</p>}
      </div>
    </div>
  );
}
