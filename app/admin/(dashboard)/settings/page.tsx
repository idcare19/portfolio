"use client";

import { PageHeader } from "@/components/admin/PageHeader";
import { useSiteDataEditor } from "@/components/admin/useSiteDataEditor";
import { useToast } from "@/components/admin/ToastProvider";

export default function SettingsAdminPage() {
  const { notify } = useToast();
  const { data, setData, loading, saving, error, save } = useSiteDataEditor();

  async function handleSave() {
    if (!data) return;
    const result = await save(data, "chore: update website settings from admin panel");
    if (result.ok) notify("success", "Settings saved to GitHub");
    else notify("error", result.error || "Save failed");
  }

  return (
    <div className="space-y-4">
      <PageHeader title="Website Settings" description="Control contact info, SEO defaults, and footer metadata." />
      {loading ? <p className="text-sm text-slate-600">Loading settings...</p> : null}
      {error ? <p className="text-sm font-medium text-rose-600">{error}</p> : null}

      {data ? (
        <section className="grid grid-cols-1 gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-2">
          <input className="rounded-xl border border-slate-300 px-3 py-2 md:col-span-2" value={data.websiteSettings.seoTitle} onChange={(e) => setData({ ...data, websiteSettings: { ...data.websiteSettings, seoTitle: e.target.value } })} placeholder="SEO title" />
          <textarea className="rounded-xl border border-slate-300 px-3 py-2 md:col-span-2" rows={3} value={data.websiteSettings.metaDescription} onChange={(e) => setData({ ...data, websiteSettings: { ...data.websiteSettings, metaDescription: e.target.value } })} placeholder="Meta description" />
          <input className="rounded-xl border border-slate-300 px-3 py-2" value={data.websiteSettings.favicon} onChange={(e) => setData({ ...data, websiteSettings: { ...data.websiteSettings, favicon: e.target.value } })} placeholder="Favicon URL" />
          <input className="rounded-xl border border-slate-300 px-3 py-2" value={data.websiteSettings.logo} onChange={(e) => setData({ ...data, websiteSettings: { ...data.websiteSettings, logo: e.target.value } })} placeholder="Logo URL" />
          <input className="rounded-xl border border-slate-300 px-3 py-2 md:col-span-2" value={data.websiteSettings.footerText} onChange={(e) => setData({ ...data, websiteSettings: { ...data.websiteSettings, footerText: e.target.value } })} placeholder="Footer text" />
          <select aria-label="Theme" className="rounded-xl border border-slate-300 px-3 py-2" value={data.websiteSettings.theme} onChange={(e) => setData({ ...data, websiteSettings: { ...data.websiteSettings, theme: e.target.value as "light" | "dark" | "system" } })}>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="system">System</option>
          </select>
        </section>
      ) : null}

      <button onClick={handleSave} disabled={!data || saving} className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60">{saving ? "Saving..." : "Save Settings"}</button>
    </div>
  );
}
