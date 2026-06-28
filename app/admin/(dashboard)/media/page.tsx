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
  const [deletingId, setDeletingId] = useState<string | null>(null);

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

      const uploadRes = await fetch("/api/admin/upload", {
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
            url: String(uploadPayload.url),
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
      notify("success", "Image uploaded to Cloudinary and added to media library");
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

  async function handleDeleteImage(item: { id?: string; name?: string; url?: string }) {
    if (!data) return;

    const id = String(item.id || "");
    const name = String(item.name || "image");
    const proceed = window.confirm(`Remove \"${name}\" from media library?`);
    if (!proceed) return;

    setDeletingId(id);
    try {
      const nextData = {
        ...data,
        mediaLibrary: data.mediaLibrary.filter((media) => media.id !== item.id),
      };

      setData(nextData as any);
      const saveResult = await save(nextData as any, `chore: remove media ${name} from library`);
      if (!saveResult.ok) throw new Error(saveResult.error || "Deleted but failed to save media library");

      notify("success", "Media removed from library");
    } catch (err) {
      notify("error", err instanceof Error ? err.message : "Delete failed");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-4">
      <PageHeader title="Media Library" description="Upload images to Cloudinary and manage reusable media URLs." />
      {loading ? <p className="text-sm text-admin-text-muted">Loading media library...</p> : null}
      {error ? <p className="text-sm font-medium text-rose-600">{error}</p> : null}

      <form onSubmit={handleUpload} className="rounded-2xl border border-admin-border bg-white p-4 shadow-sm sm:p-5">
        <h2 className="text-base font-semibold text-admin-text">Upload to Cloudinary</h2>
        <p className="mt-1 text-sm text-admin-text-muted">Selected file will be uploaded to your Cloudinary portfolio folder and saved for reuse across projects, blogs, and sections.</p>
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
            className="rounded-xl bg-admin-primary px-4 py-2 text-sm font-semibold text-white hover:bg-[#1D4ED8] disabled:opacity-80"
          >
            {uploading ? "Uploading..." : "Upload Image"}
          </button>
        </div>
      </form>

      {data ? (
        <div className="space-y-4">
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

          <div className="rounded-2xl border border-admin-border bg-white p-4 shadow-sm sm:p-5">
            <h3 className="text-sm font-semibold text-admin-text">Quick Delete</h3>
            <p className="mt-1 text-xs text-admin-text-muted">
              This removes the asset from the media library. Cloudinary deletion is not automated here, so the original asset stays in your Cloudinary account.
            </p>
            <div className="mt-3 space-y-2">
              {data.mediaLibrary.map((item) => (
                <div key={item.id} className="flex flex-col gap-2 rounded-xl border border-admin-border bg-white p-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-admin-text">{item.name || item.id}</p>
                    <p className="truncate text-xs text-admin-text-muted">{item.url}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteImage(item)}
                    disabled={deletingId === item.id}
                    className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-100 disabled:opacity-80"
                  >
                    {deletingId === item.id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
      <button onClick={handleSave} disabled={!data || saving} className="rounded-xl bg-admin-primary px-4 py-2 text-sm font-semibold text-white hover:bg-[#1D4ED8] disabled:opacity-80">{saving ? "Saving..." : "Save Media Library"}</button>
    </div>
  );
}
