"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useSiteDataEditor } from "@/components/admin/useSiteDataEditor";
import { GenericCards } from "@/components/sections/custom/GenericCards";
import { GenericFaq } from "@/components/sections/custom/GenericFaq";
import { GenericGallery } from "@/components/sections/custom/GenericGallery";
import { GenericStats } from "@/components/sections/custom/GenericStats";
import { GenericTestimonials } from "@/components/sections/custom/GenericTestimonials";
import { GenericTimeline } from "@/components/sections/custom/GenericTimeline";
import { GenericSection } from "@/components/sections/GenericSection";
import type { SiteData, SiteSectionBlock } from "@/src/types/site-data";

const PROTECTED = new Set(["hero","about","skills","projects","working","completed","reviews","journey","services","github","contact","footer","blogs"]);
const VALID_TEMPLATES = new Set(["text","cards","faq","gallery","stats","timeline","testimonials"]);

export function CustomSectionEditor({ slug }: { slug: string }) {
  const router = useRouter();
  const { data, saving, save } = useSiteDataEditor();
  const section = data?.sections?.[slug] as SiteSectionBlock | undefined;
  const [draft, setDraft] = useState<SiteSectionBlock | null>(null);

  useEffect(() => {
    if (section) setDraft(structuredClone(section) as SiteSectionBlock);
  }, [section]);

  const validationError = useMemo(() => {
    if (!draft) return "";
    if (!draft.label?.trim()) return "Title is required.";
    if (!draft.renderer?.trim()) return "Renderer is required.";
    if (!draft.template?.trim()) return "Template is required.";
    if (PROTECTED.has(slug)) return "Core section slugs are protected.";
    if (!VALID_TEMPLATES.has(String(draft.template).toLowerCase())) return "Invalid template.";
    return "";
  }, [draft, slug]);

  if (!draft) return <p className="text-sm text-admin-text-muted">Loading section...</p>;

  const template = String(draft.template || "text").toLowerCase();

  function updateItems(items: any[]) {
    setDraft((current) => (current ? { ...current, items } : current));
  }

  async function handleSave() {
    if (!data || validationError) return;
    const next: SiteData = {
      ...data,
      sections: {
        ...data.sections,
        [slug]: draft as SiteSectionBlock,
      },
    };
    await save(next, `chore: update custom section ${slug}`);
    router.refresh();
  }

  async function handleDelete() {
    if (!data) return;
    const ok = window.confirm(`Delete section "${slug}"? This cannot be undone.`);
    if (!ok) return;
    const next: SiteData = {
      ...data,
      sections: Object.fromEntries(Object.entries(data.sections || {}).filter(([key]) => key !== slug)) as SiteData["sections"],
    };
    await save(next, `chore: delete custom section ${slug}`);
    router.push("/admin/sections");
    router.refresh();
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-6">
        {validationError ? <p className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{validationError}</p> : null}

        <div className="grid gap-3 md:grid-cols-2">
          <label className="space-y-1 text-sm">
            <span className="font-medium text-admin-text">Section Name</span>
            <input value={draft.label} onChange={(e) => setDraft({ ...draft, label: e.target.value })} className="w-full rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text" />
          </label>
          <label className="space-y-1 text-sm">
            <span className="font-medium text-admin-text">Slug</span>
            <input value={draft.id} readOnly className="w-full rounded-xl border border-admin-border bg-admin-bg px-3 py-2 text-admin-text-muted" />
          </label>
          <label className="space-y-1 text-sm">
            <span className="font-medium text-admin-text">Renderer</span>
            <input value={draft.renderer} onChange={(e) => setDraft({ ...draft, renderer: e.target.value })} className="w-full rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text" />
          </label>
          <label className="space-y-1 text-sm">
            <span className="font-medium text-admin-text">Template</span>
            <select value={draft.template || "text"} onChange={(e) => setDraft({ ...draft, template: e.target.value })} className="w-full rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text">
              {Array.from(VALID_TEMPLATES).map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
          <label className="space-y-1 text-sm md:col-span-2">
            <span className="font-medium text-admin-text">Eyebrow</span>
            <input value={String(draft.data?.eyebrow || "")} onChange={(e) => setDraft({ ...draft, data: { ...(draft.data || {}), eyebrow: e.target.value } })} className="w-full rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text" />
          </label>
          <label className="space-y-1 text-sm md:col-span-2">
            <span className="font-medium text-admin-text">Title</span>
            <input value={String(draft.data?.title || "")} onChange={(e) => setDraft({ ...draft, data: { ...(draft.data || {}), title: e.target.value } })} className="w-full rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text" />
          </label>
          <label className="space-y-1 text-sm md:col-span-2">
            <span className="font-medium text-admin-text">Description</span>
            <textarea value={String(draft.data?.description || "")} onChange={(e) => setDraft({ ...draft, data: { ...(draft.data || {}), description: e.target.value } })} rows={4} className="w-full rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text" />
          </label>
          <label className="flex items-center gap-2 text-sm text-admin-text">
            <input type="checkbox" checked={draft.enabled !== false} onChange={(e) => setDraft({ ...draft, enabled: e.target.checked })} />
            Enabled
          </label>
          <label className="flex items-center gap-2 text-sm text-admin-text">
            <input type="checkbox" checked={draft.showOnHomepage !== false} onChange={(e) => setDraft({ ...draft, showOnHomepage: e.target.checked })} />
            Show on homepage
          </label>
          <label className="flex items-center gap-2 text-sm text-admin-text">
            <input type="checkbox" checked={draft.nav?.show !== false} onChange={(e) => setDraft({ ...draft, nav: { href: `#${slug}`, label: draft.label, show: e.target.checked } })} />
            Show in navbar
          </label>
          <label className="space-y-1 text-sm">
            <span className="font-medium text-admin-text">Order</span>
            <input type="number" value={draft.order} onChange={(e) => setDraft({ ...draft, order: Number(e.target.value) })} className="w-full rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text" />
          </label>
        </div>

        {template === "cards" ? <GenericCards items={draft.items || []} onChange={updateItems} /> : null}
        {template === "faq" ? <GenericFaq items={draft.items || []} onChange={updateItems} /> : null}
        {template === "gallery" ? <GenericGallery items={draft.items || []} onChange={updateItems} /> : null}
        {template === "stats" ? <GenericStats items={draft.items || []} onChange={updateItems} /> : null}
        {template === "timeline" ? <GenericTimeline items={draft.items || []} onChange={updateItems} /> : null}
        {template === "testimonials" ? <GenericTestimonials items={draft.items || []} onChange={updateItems} /> : null}
        {template === "text" ? (
          <label className="space-y-1 text-sm block">
            <span className="font-medium text-admin-text">Body</span>
            <textarea value={String(draft.data?.body || "")} onChange={(e) => setDraft({ ...draft, data: { ...(draft.data || {}), body: e.target.value } })} rows={8} className="w-full rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text" />
          </label>
        ) : null}

        <div className="flex gap-3">
          <button type="button" disabled={saving || Boolean(validationError)} onClick={handleSave} className="rounded-xl bg-admin-primary px-4 py-2 text-sm font-semibold text-white disabled:opacity-70">
            {saving ? "Saving..." : "Save Section"}
          </button>
          <button type="button" disabled={saving} onClick={handleDelete} className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 disabled:opacity-70">
            Delete Section
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="rounded-2xl border border-admin-border bg-admin-card p-4">
          <p className="mb-3 text-sm font-semibold text-admin-text">Preview</p>
          <GenericSection section={draft} />
        </div>
      </div>
    </div>
  );
}
