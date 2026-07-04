"use client";

import { PageHeader } from "@/components/admin/PageHeader";
import { SimpleArrayEditor } from "@/components/admin/editors/SimpleArrayEditor";
import { useSiteDataEditor } from "@/components/admin/useSiteDataEditor";
import { useToast } from "@/components/admin/ToastProvider";
import { v4 as uuidv4 } from "uuid";

export default function BlogsAdminPage() {
  const { notify } = useToast();
  const { data, setData, loading, saving, error, save } = useSiteDataEditor();

  async function handleSave() {
    if (!data) return;
    const result = await save(data, "chore: update blogs from admin panel");
    if (result.ok) notify("success", "Blogs updated successfully");
    else notify("error", result.error || "Save failed");
  }

  function createBlog() {
    return {
      id: uuidv4(),
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      coverImage: "",
      author: "",
      tags: [],
      category: "Uncategorized",
      status: "draft" as const,
      isFeatured: false,
      seoTitle: "",
      seoDescription: "",
      publishedAt: "",
      order: (data?.blogs?.length || 0) + 1,
      isEnabled: true,
    };
  }

  return (
    <div className="space-y-4">
      <PageHeader title="Blogs Management" description="Create, edit, delete, and manage blog posts." />
      {loading ? <p className="text-sm text-admin-text-muted">Loading blogs...</p> : null}
      {error ? <p className="text-sm font-medium text-rose-600">{error}</p> : null}
      {data ? (
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-admin-border bg-admin-card p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-admin-text-muted">Admin count</p>
            <p className="mt-1 text-2xl font-bold text-admin-text">{data.blogs?.length || 0}</p>
          </div>
          <div className="rounded-2xl border border-admin-border bg-admin-card p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-admin-text-muted">Published</p>
            <p className="mt-1 text-2xl font-bold text-admin-text">{(data.blogs || []).filter((blog) => blog.status === "published" && blog.isEnabled).length}</p>
          </div>
          <div className="rounded-2xl border border-admin-border bg-admin-card p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-admin-text-muted">Homepage visible</p>
            <p className="mt-1 text-2xl font-bold text-admin-text">{(data.blogs || []).filter((blog) => blog.status === "published" && blog.isEnabled).length}</p>
          </div>
        </div>
      ) : null}
      {data ? (
        <SimpleArrayEditor
          title="Blog Posts"
          description="Manage your blog entries with full CRUD support, enable/disable, and reordering."
          items={data.blogs || []}
          setItems={(items) => setData?.({ ...data, blogs: items })}
          createItem={createBlog}
          fields={[
            { key: "id", label: "ID" },
            { key: "title", label: "Title", required: true },
            { key: "slug", label: "Slug", required: true },
            { key: "excerpt", label: "Excerpt", type: "textarea" },
            { key: "content", label: "Content", type: "textarea" },
            { key: "coverImage", label: "Cover Image URL" },
            { key: "author", label: "Author" },
            {
              key: "tags",
              label: "Tags (comma separated)",
              format: (value) => (Array.isArray(value) ? value.join(", ") : String(value || "")),
              parse: (value) => String(value || "").split(",").map((item) => item.trim()).filter(Boolean),
            },
            { key: "category", label: "Category" },
            { key: "status", label: "Status", type: "select", options: [
              { value: "draft", label: "Draft" },
              { value: "published", label: "Published" }
            ]},
            { key: "isFeatured", label: "Featured", type: "checkbox" },
            { key: "seoTitle", label: "SEO Title" },
            { key: "seoDescription", label: "SEO Description", type: "textarea" },
            { key: "publishedAt", label: "Published At" },
            { key: "order", label: "Order", type: "number" },
            { key: "isEnabled", label: "Enabled", type: "checkbox" }
          ]}
        />
      ) : null}
      {!loading && data && (
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      )}
    </div>
  );
}
