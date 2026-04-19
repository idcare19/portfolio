"use client";

import { FormEvent, useState } from "react";
import { PageHeader } from "@/components/admin/PageHeader";
import { SimpleArrayEditor } from "@/components/admin/editors/SimpleArrayEditor";
import { useSiteDataEditor } from "@/components/admin/useSiteDataEditor";
import { useToast } from "@/components/admin/ToastProvider";

export default function MediaAdminPage() {
  const { notify } = useToast();
  const { data, setData, loading, saving, error, save } = useSiteDataEditor();
  const [uploading, setUploading] = useState(false);

  async function handleUpload(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!data) return;

    const formData = new FormData(e.currentTarget);
    const file = formData.get("file");
    if (!(file instanceof File)) {
      notify("error", "Please select an image file first");
      return;
    }

    setUploading(true);
    try {
      const uploadBody = new FormData();
      uploadBody.append("file", file);

      const uploadRes = await fetch("/api/github/upload", {
        method: "POST",
        body: uploadBody,
      });
      const uploadPayload = await uploadRes.json();

      if (!uploadRes.ok || !uploadPayload?.ok) {
        throw new Error(uploadPayload?.error || "Image upload failed");
      }

      const nextData = {
        ...data,
        mediaLibrary: [
          {
            id: `media-${Date.now()}`,
            name: String(uploadPayload.name || file.name),
            url: String(uploadPayload.publicUrl),
            type: String(uploadPayload.type || file.type || "image"),
            size: Number(uploadPayload.size || file.size || 0),
          },
          ...data.mediaLibrary,
        ],
      };

      setData(nextData as any);
      const saveResult = await save(nextData as any, `chore: add uploaded media ${uploadPayload.name || file.name}`);
      if (!saveResult.ok) throw new Error(saveResult.error || "Uploaded but failed to save media library");

      e.currentTarget.reset();
      notify("success", "Image uploaded to GitHub public/projects and added to media library");
    } catch (err) {
      notify("error", err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function handleSave() {
    if (!data) return;
    const result = await save(data, "chore: update media library from admin panel");
    if (result.ok) notify("success", "Media library saved to GitHub");
    else notify("error", result.error || "Save failed");
  }

  return (
    <div className="space-y-4">
      <PageHeader title="Media Library" description="Upload images to GitHub public/projects and manage reusable media URLs." />
      {loading ? <p className="text-sm text-slate-600">Loading media library...</p> : null}
      {error ? <p className="text-sm font-medium text-rose-600">{error}</p> : null}

      <form onSubmit={handleUpload} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <h2 className="text-base font-semibold text-slate-900">Upload to GitHub (`public/projects`)</h2>
        <p className="mt-1 text-sm text-slate-600">Selected file will be committed to your GitHub repo and instantly available as `/projects/filename`.</p>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            type="file"
            name="file"
            accept="image/png,image/jpeg,image/jpg,image/webp,image/gif,image/svg+xml,image/avif"
            required
            className="text-sm"
            aria-label="Upload project image"
          />
          <button
            type="submit"
            disabled={!data || uploading}
            className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {uploading ? "Uploading..." : "Upload Image"}
          </button>
        </div>
      </form>

      {data ? (
        <SimpleArrayEditor
          title="Media Items"
          description="This library is used in admin dropdown pickers (including project image selection)."
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
