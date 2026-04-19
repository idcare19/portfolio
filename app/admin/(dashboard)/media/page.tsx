"use client";

import { PageHeader } from "@/components/admin/PageHeader";
import { SimpleArrayEditor } from "@/components/admin/editors/SimpleArrayEditor";
import { useSiteDataEditor } from "@/components/admin/useSiteDataEditor";
import { useToast } from "@/components/admin/ToastProvider";

export default function MediaAdminPage() {
  const { notify } = useToast();
  const { data, setData, loading, saving, error, save } = useSiteDataEditor();

  async function handleSave() {
    if (!data) return;
    const result = await save(data, "chore: update media library from admin panel");
    if (result.ok) notify("success", "Media library saved to GitHub");
    else notify("error", result.error || "Save failed");
  }

  return (
    <div className="space-y-4">
      <PageHeader title="Media Library" description="Manage image/file URLs used across portfolio content." />
      {loading ? <p className="text-sm text-slate-600">Loading media library...</p> : null}
      {error ? <p className="text-sm font-medium text-rose-600">{error}</p> : null}
      {data ? (
        <SimpleArrayEditor
          title="Media Items"
          description="Store direct URLs (Cloudinary, S3, CDN, GitHub raw links, etc.)."
          items={data.mediaLibrary}
          setItems={(items) => setData?.({ ...data, mediaLibrary: items } as any)}
          fields={[
            { key: "id", label: "ID" },
            { key: "name", label: "Name" },
            { key: "url", label: "URL" },
            { key: "type", label: "Type" },
            { key: "size", label: "Size (bytes)", type: "number" }
          ]}
          createItem={() => ({ id: `media-${Date.now()}`, name: "", url: "", type: "image", size: 0 }) as any}
        />
      ) : null}
      <button onClick={handleSave} disabled={!data || saving} className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60">{saving ? "Saving..." : "Save Media Library"}</button>
    </div>
  );
}
