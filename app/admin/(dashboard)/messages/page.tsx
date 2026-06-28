"use client";

import { PageHeader } from "@/components/admin/PageHeader";
import { useSiteDataEditor } from "@/components/admin/useSiteDataEditor";
import { useToast } from "@/components/admin/ToastProvider";

export default function MessagesAdminPage() {
  const { notify } = useToast();
  const { data, setData, loading, saving, error, saveSection } = useSiteDataEditor();

  async function handleSave() {
    if (!data) return;
    const result = await saveSection(
      "contactMessages",
      data.contactMessages,
      "chore: update contact messages state from admin panel"
    );
    if (result.ok) notify("success", "Messages state saved");
    else notify("error", result.error || "Save failed");
  }

  function setStatus(id: string, status: "unread" | "read" | "replied" | "archived") {
    if (!data) return;
    setData({
      ...data,
      contactMessages: data.contactMessages.map((m) => (m.id === id ? { ...m, read: status !== "unread", status } : m)),
    });
  }

  function remove(id: string) {
    if (!data || !confirm("Delete this message?")) return;
    setData({ ...data, contactMessages: data.contactMessages.filter((m) => m.id !== id) });
  }

  return (
    <div className="space-y-4">
      <PageHeader title="Messages" description="View and manage contact form submissions." />
      {loading ? <p className="text-sm text-admin-text-muted">Loading messages...</p> : null}
      {error ? <p className="text-sm font-medium text-rose-600">{error}</p> : null}

      <section className="rounded-2xl border border-admin-border bg-white p-5 shadow-sm">
        <div className="space-y-3">
          {data?.contactMessages.length ? data.contactMessages.map((msg) => (
            <article key={msg.id} className="rounded-xl border border-admin-border bg-white p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h3 className="font-semibold text-admin-text">{msg.name} <span className="text-sm font-normal text-admin-text-muted">({msg.email})</span></h3>
                  <p className="text-sm text-admin-text-muted">{msg.subject} • {new Date(msg.createdAt).toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-2">
                  <select value={msg.status || (msg.read ? "read" : "unread")} onChange={(e) => setStatus(msg.id, e.target.value as "unread" | "read" | "replied" | "archived")} className="rounded-lg border border-admin-border bg-white px-2 py-1 text-xs font-medium text-admin-text">
                    <option value="unread">Unread</option>
                    <option value="read">Read</option>
                    <option value="replied">Replied</option>
                    <option value="archived">Archived</option>
                  </select>
                  <button onClick={() => remove(msg.id)} className="rounded-lg border border-rose-200 bg-rose-50 px-2 py-1 text-xs font-medium text-rose-700 hover:bg-rose-100">Delete</button>
                </div>
              </div>
              <p className="mt-2 text-sm text-admin-text">{msg.message}</p>
            </article>
          )) : <p className="text-sm text-admin-text-muted">No messages yet.</p>}
        </div>
      </section>

      <button onClick={handleSave} disabled={!data || saving} className="rounded-xl bg-admin-primary px-4 py-2 text-sm font-semibold text-white hover:bg-[#1D4ED8] disabled:opacity-80">{saving ? "Saving..." : "Save Message Changes"}</button>
    </div>
  );
}
