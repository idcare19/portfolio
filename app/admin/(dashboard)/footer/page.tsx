<<<<<<< HEAD
import { redirect } from "next/navigation";

export default function FooterRedirectPage() {
  redirect("/admin/text-blocks");
=======
"use client";

import { PageHeader } from "@/components/admin/PageHeader";
import { TextBlockManager } from "@/components/admin/TextBlockManager";
import { useSiteDataEditor } from "@/components/admin/useSiteDataEditor";
import { useToast } from "@/components/admin/ToastProvider";
import { buildGlobalTextBlocks, updateTextBlockValue } from "@/lib/admin/content-manager";

export default function FooterAdminPage() {
  const { notify } = useToast();
  const { data, setData, loading, saving, error, save } = useSiteDataEditor();

  async function handleSave() {
    if (!data) return;
    const result = await save(data, "chore: update footer content from admin panel");
    if (result.ok) notify("success", "Footer content updated");
    else notify("error", result.error || "Save failed");
  }

  const footerBlocks = data ? buildGlobalTextBlocks(data).filter((block) => block.key.startsWith("websiteSettings.footerText") || block.key.startsWith("socials.") || block.key.startsWith("owner.username")) : [];

  return (
    <div className="space-y-4">
      <PageHeader title="Footer" description="Edit footer text, logo/domain text, and footer link labels/URLs." />
      {loading ? <p className="text-sm text-admin-text-muted">Loading footer content...</p> : null}
      {error ? <p className="text-sm font-medium text-rose-600">{error}</p> : null}
      {data ? (
        <TextBlockManager
          title="Footer Text Blocks"
          description="Footer copy, domain/logo text, and footer/social link labels and URLs."
          blocks={footerBlocks}
          onChange={(blocks) => {
            let next = data;
            blocks.forEach((block) => {
              next = updateTextBlockValue(next, block);
            });
            setData(next);
          }}
        />
      ) : null}
      <button onClick={handleSave} disabled={!data || saving} className="rounded-xl bg-admin-primary px-4 py-2 text-sm font-semibold text-white hover:bg-[#1D4ED8] disabled:opacity-80">{saving ? "Saving..." : "Save Footer"}</button>
    </div>
  );
>>>>>>> c974e6d18f7e4d84cefd23b3ad822ac4cf9981fc
}
