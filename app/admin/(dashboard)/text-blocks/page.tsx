"use client";

import { PageHeader } from "@/components/admin/PageHeader";
import { TextBlockManager } from "@/components/admin/TextBlockManager";
import { useSiteDataEditor } from "@/components/admin/useSiteDataEditor";
import { useToast } from "@/components/admin/ToastProvider";
import { buildAdminSections, buildGlobalTextBlocks, updateTextBlockValue } from "@/lib/admin/content-manager";

export default function TextBlocksAdminPage() {
  const { notify } = useToast();
  const { data, setData, loading, saving, error, save } = useSiteDataEditor();

  const sectionBlocks = data
    ? buildAdminSections(data).flatMap((section) => (section.textBlocks || []).map((block) => ({ ...block, sectionId: section.id })))
    : [];
  const globalBlocks = data ? buildGlobalTextBlocks(data) : [];

  async function handleSave() {
    if (!data) return;
    const result = await save(data, "chore: update text blocks from admin panel");
    if (result.ok) notify("success", "Text blocks saved");
    else notify("error", result.error || "Save failed");
  }

  return (
    <div className="space-y-4">
      <PageHeader title="Text Blocks" description="Edit every visible text block, CTA, badge, stat, and link on the website." />
      {loading ? <p className="text-sm text-admin-text-muted">Loading text blocks...</p> : null}
      {error ? <p className="text-sm font-medium text-rose-600">{error}</p> : null}
      {data ? (
        <>
          <TextBlockManager
            title="Global Text"
            description="Logo text, hero lines, footer text, and social labels/links."
            blocks={globalBlocks}
            onChange={(blocks) => {
              let next = data;
              blocks.forEach((block) => {
                next = updateTextBlockValue(next, block);
              });
              setData(next);
            }}
          />
          <TextBlockManager
            title="Section Text"
            description="Section titles, subtitles, descriptions, CTAs, badges, stats, and per-section copy."
            blocks={sectionBlocks}
            showSectionField
            onChange={(blocks) => {
              let next = data;
              blocks.forEach((block) => {
                next = updateTextBlockValue(next, block);
              });
              setData(next);
            }}
          />
        </>
      ) : null}
      <button onClick={handleSave} disabled={!data || saving} className="rounded-xl bg-admin-primary px-4 py-2 text-sm font-semibold text-white hover:bg-[#1D4ED8] disabled:opacity-80">
        {saving ? "Saving..." : "Save Text Blocks"}
      </button>
    </div>
  );
}
