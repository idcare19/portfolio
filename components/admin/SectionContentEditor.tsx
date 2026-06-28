"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { SiteData } from "@/src/types/site-data";
import { PageHeader } from "@/components/admin/PageHeader";
import { SectionCard } from "@/components/admin/SectionCard";
import { SectionItemsCrudEditor } from "@/components/admin/SectionItemsCrudEditor";
import { useSiteDataEditor } from "@/components/admin/useSiteDataEditor";
import { useToast } from "@/components/admin/ToastProvider";
import { getSectionContentConfig, getValueByPath, setValueByPath, type SectionArrayField } from "@/lib/admin/section-content-fields";

function updateArrayItem(item: any, key: string, value: string) {
  if (typeof item !== "object" || item === null) return value;
  return { ...item, [key]: value };
}

function renderInput(type: string | undefined, value: any, onChange: (next: string) => void, placeholder?: string) {
  const className = "w-full rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text";
  if (type === "textarea") {
    return <textarea rows={4} value={value ?? ""} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={className} />;
  }
  return <input type={type === "url" ? "url" : type === "number" ? "number" : "text"} value={value ?? ""} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={className} />;
}

function ArrayEditor({
  field,
  value,
  onChange,
}: {
  field: SectionArrayField;
  value: any[];
  onChange: (next: any[]) => void;
}) {
  const items = Array.isArray(value) ? value : [];
  return (
    <SectionCard title={field.label} description={`Manage ${field.itemLabel.toLowerCase()} entries.`}>
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={`${field.path}-${index}`} className="rounded-2xl border border-admin-border bg-admin-bg p-4">
            <div className="grid gap-3 md:grid-cols-2">
              {field.fields.map((subField) => (
                <label key={subField.key} className="block text-sm">
                  <span className="mb-1 block font-medium text-admin-text">{subField.label}</span>
                  {renderInput(
                    subField.type,
                    typeof item === "object" && item !== null ? item[subField.key] : item,
                    (next) =>
                      onChange(
                        items.map((entry, idx) =>
                          idx === index
                            ? field.fields.length === 1 && subField.key === "value" && typeof entry !== "object"
                              ? next
                              : updateArrayItem(entry, subField.key, next)
                            : entry
                        )
                      ),
                    subField.placeholder
                  )}
                </label>
              ))}
            </div>
            <div className="mt-3">
              <button type="button" onClick={() => onChange(items.filter((_, idx) => idx !== index))} className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700">
                Remove
              </button>
            </div>
          </div>
        ))}
        <button type="button" onClick={() => onChange([...items, field.createItem()])} className="rounded-xl border border-admin-border bg-admin-bg px-4 py-2 text-sm font-semibold text-admin-text">
          Add {field.itemLabel}
        </button>
      </div>
    </SectionCard>
  );
}

export function SectionContentEditor({ slug }: { slug: string }) {
  const { notify } = useToast();
  const config = getSectionContentConfig(slug);
  const { data, setData, saving, save } = useSiteDataEditor();
  const [draft, setDraft] = useState<SiteData | null>(null);

  useEffect(() => {
    setDraft(data);
  }, [data, slug]);

  if (!config) {
    return <p className="text-sm text-rose-600">Unknown section editor.</p>;
  }

  if (!data) {
    return <p className="text-sm text-admin-text-muted">Loading section content...</p>;
  }

  const editorData = draft || data;
  const enabledPath = config.enabledPath;
  const enabled = enabledPath ? Boolean(getValueByPath(editorData, enabledPath)) : true;

  function patch(next: SiteData) {
    setDraft(next);
    setData(next);
  }

  function setPath(path: string, value: unknown) {
    let next = setValueByPath(editorData, path, value);
    for (const sync of config.sync || []) {
      if (sync.from === path) {
        next = setValueByPath(next, sync.to, value);
      }
    }
    patch(next);
  }

  async function handleSave() {
    const result = await save(editorData!, config.saveMessage);
    if (result.ok) notify("success", `${config.title} saved`);
    else notify("error", result.error || "Save failed");
  }

  return (
    <div className="space-y-4">
      <PageHeader title={config.title} description={config.description} />

      <SectionCard title={`${config.title} Status`} description="Control visibility for this section.">
        <label className="inline-flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={enabled}
            onChange={(event) => {
              if (!enabledPath) return;
              setPath(enabledPath, event.target.checked);
            }}
          />
          Enabled / Disabled
        </label>
      </SectionCard>

      <div className="grid gap-4">
        {config.fields.map((field) => (
          <SectionCard key={field.path} title={field.label} description={field.helpText}>
            {renderInput(field.type, getValueByPath(editorData, field.path), (next) => setPath(field.path, next), field.placeholder)}
          </SectionCard>
        ))}

        {config.arrayFields?.map((field) => (
          <ArrayEditor key={field.path} field={field} value={getValueByPath(editorData, field.path) as any[]} onChange={(next) => setPath(field.path, next)} />
        ))}

        {config.itemCrud ? (
          <SectionItemsCrudEditor config={config.itemCrud} items={getValueByPath(editorData, config.itemCrud.path) as any[]} onChange={(next) => setPath(config.itemCrud!.path, next)} />
        ) : null}
      </div>

      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={handleSave} disabled={saving} className="rounded-xl bg-admin-primary px-4 py-2 text-sm font-semibold text-white disabled:opacity-80">
          {saving ? "Saving..." : "Save Changes"}
        </button>
        <Link href={config.previewHref} target="_blank" rel="noreferrer" className="rounded-xl border border-admin-border bg-admin-bg px-4 py-2 text-sm font-semibold text-admin-text">
          Preview Site
        </Link>
        <Link href="/admin/text-blocks" className="rounded-xl border border-admin-border bg-admin-bg px-4 py-2 text-sm font-semibold text-admin-text">
          Advanced Text Blocks
        </Link>
      </div>
    </div>
  );
}
