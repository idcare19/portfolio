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

  function toggleRead(id: string) {
    if (!data) return;
    setData({
      ...data,
      contactMessages: data.contactMessages.map((m) => (m.id === id ? { ...m, read: !m.read } : m)),
    });
  }

  function remove(id: string) {
    if (!data || !confirm("Delete this message?")) return;
    setData({ ...data, contactMessages: data.contactMessages.filter((m) => m.id !== id) });
  }

  return (
    <div className="space-y-4">
      <PageHeader title="Messages" description="View and manage contact form submissions." />
      {loading ? <p className="text-sm text-slate-600">Loading messages...</p> : null}
      {error ? <p className="text-sm font-medium text-rose-600">{error}</p> : null}

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="space-y-3">
          {data?.contactMessages.length ? data.contactMessages.map((msg) => (
            <article key={msg.id} className="rounded-xl border border-slate-200 p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h3 className="font-semibold text-slate-900">{msg.name} <span className="text-sm font-normal text-slate-500">({msg.email})</span></h3>
                  <p className="text-sm text-slate-500">{msg.subject} • {new Date(msg.createdAt).toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => toggleRead(msg.id)} className="rounded-lg border border-slate-300 px-2 py-1 text-xs">{msg.read ? "Mark Unread" : "Mark Read"}</button>
                  <button onClick={() => remove(msg.id)} className="rounded-lg border border-rose-300 px-2 py-1 text-xs text-rose-600">Delete</button>
                </div>
              </div>
              <p className="mt-2 text-sm text-slate-700">{msg.message}</p>
            </article>
          )) : <p className="text-sm text-slate-500">No messages yet.</p>}
        </div>
      </section>

      <button onClick={handleSave} disabled={!data || saving} className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60">{saving ? "Saving..." : "Save Message Changes"}</button>
    </div>
  );
}
