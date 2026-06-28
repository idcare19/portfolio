"use client";

import { PageHeader } from "@/components/admin/PageHeader";
import { TextBlockManager } from "@/components/admin/TextBlockManager";
import { SimpleArrayEditor } from "@/components/admin/editors/SimpleArrayEditor";
import { useSiteDataEditor } from "@/components/admin/useSiteDataEditor";
import { useToast } from "@/components/admin/ToastProvider";
import { buildAdminSections, updateTextBlockValue } from "@/lib/admin/content-manager";

export default function ContactAdminPage() {
  const { notify } = useToast();
  const { data, setData, loading, saving, error, save } = useSiteDataEditor();

  async function handleSave() {
    if (!data) return;
    const result = await save(data, "chore: update contact section from admin panel");
    if (result.ok) notify("success", "Contact content updated");
    else notify("error", result.error || "Save failed");
  }

  const contactSection = data ? buildAdminSections(data).find((section) => section.id === "contact") : null;

  return (
    <div className="space-y-4">
      <PageHeader title="Contact" description="Manage contact section text, CTA copy, social links, email links, and support text." />
      {loading ? <p className="text-sm text-admin-text-muted">Loading contact content...</p> : null}
      {error ? <p className="text-sm font-medium text-rose-600">{error}</p> : null}
      {data && contactSection ? (
        <>
          <TextBlockManager
            title="Contact Text Blocks"
            description="Heading, subtitle, descriptions, card text, form text, and CTA copy."
            blocks={(contactSection.textBlocks || []).map((block) => ({ ...block, sectionId: "contact" }))}
            onChange={(blocks) => {
              let next = data;
              blocks.forEach((block) => {
                next = updateTextBlockValue(next, block);
              });
              setData(next);
            }}
          />
          <SimpleArrayEditor
            title="Contact Links"
            description="Email, GitHub, LinkedIn, phone, WhatsApp, and any footer/contact links."
            items={data.socials as any[]}
            setItems={(items) => setData({ ...data, socials: items as any })}
            fields={[
              { key: "label", label: "Label", required: true },
              { key: "value", label: "Visible Text" },
              { key: "href", label: "Link", type: "url", required: true },
            ] as any}
            createItem={() => ({ label: "", value: "", href: "" } as any)}
          />
        </>
      ) : null}
      <button onClick={handleSave} disabled={!data || saving} className="rounded-xl bg-admin-primary px-4 py-2 text-sm font-semibold text-white hover:bg-[#1D4ED8] disabled:opacity-80">{saving ? "Saving..." : "Save Contact"}</button>
    </div>
  );
}