"use client";

import { PageHeader } from "@/components/admin/PageHeader";
import { SimpleArrayEditor } from "@/components/admin/editors/SimpleArrayEditor";
import { useSiteDataEditor } from "@/components/admin/useSiteDataEditor";
import { useToast } from "@/components/admin/ToastProvider";

export default function BlogAdminPage() {
  const { notify } = useToast();
  const { data, setData, loading, saving, error, save } = useSiteDataEditor();

  async function handleSave() {
    if (!data) return;
    const result = await save(data, "chore: update blogs from admin panel");
    if (result.ok) notify("success", "Blog posts saved to GitHub");
    else notify("error", result.error || "Save failed");
  }

  return (
    <div className="space-y-4">
      <PageHeader title="Blog Management" description="Create and manage SEO-ready blog posts with tags and publish status." />
      {loading ? <p className="text-sm text-slate-600">Loading blogs...</p> : null}
      {error ? <p className="text-sm font-medium text-rose-600">{error}</p> : null}
      {data ? (
        <SimpleArrayEditor
          title="Blog Posts"
          description="Manage title, slug, thumbnail, content, tags, and published state."
          items={data.blogs}
          setItems={(items) => setData?.({ ...data, blogs: items } as any)}
          fields={[
            { key: "id", label: "ID" },
            { key: "title", label: "Title" },
            { key: "slug", label: "Slug" },
            { key: "thumbnail", label: "Thumbnail URL" },
            { key: "content", label: "Content", type: "textarea" },
            { key: "published", label: "Published", type: "checkbox" }
          ]}
          createItem={() => ({ id: `blog-${Date.now()}`, title: "", slug: "", thumbnail: "", content: "", tags: [], published: false }) as any}
        />
      ) : null}
      <button onClick={handleSave} disabled={!data || saving} className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60">{saving ? "Saving..." : "Save Blog Posts"}</button>
    </div>
  );
}
