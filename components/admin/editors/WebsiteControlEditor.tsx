"use client";

import type { SiteData } from "@/src/types/site-data";

type Props = {
  data: SiteData;
  onChange: (next: SiteData) => void;
};

export function WebsiteControlEditor({ data, onChange }: Props) {
  const control = data.websiteControl;

  const setControl = (patch: Partial<SiteData["websiteControl"]>) =>
    onChange({ ...data, websiteControl: { ...control, ...patch } });

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Global Popup Announcement</h2>
        <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
          <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" checked={control.popupAnnouncement.enabled} onChange={(e) => setControl({ popupAnnouncement: { ...control.popupAnnouncement, enabled: e.target.checked } })} /> Enable popup</label>
          <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" checked={control.popupAnnouncement.closeButton} onChange={(e) => setControl({ popupAnnouncement: { ...control.popupAnnouncement, closeButton: e.target.checked } })} /> Show close button</label>
          <input className="rounded-xl border border-slate-300 px-3 py-2" placeholder="Popup title" value={control.popupAnnouncement.title} onChange={(e) => setControl({ popupAnnouncement: { ...control.popupAnnouncement, title: e.target.value } })} />
          <input className="rounded-xl border border-slate-300 px-3 py-2" placeholder="Popup image/icon URL" value={control.popupAnnouncement.image} onChange={(e) => setControl({ popupAnnouncement: { ...control.popupAnnouncement, image: e.target.value } })} />
          <textarea className="rounded-xl border border-slate-300 px-3 py-2 md:col-span-2" rows={3} placeholder="Popup message" value={control.popupAnnouncement.message} onChange={(e) => setControl({ popupAnnouncement: { ...control.popupAnnouncement, message: e.target.value } })} />
          <input className="rounded-xl border border-slate-300 px-3 py-2" placeholder="Button text" value={control.popupAnnouncement.buttonText} onChange={(e) => setControl({ popupAnnouncement: { ...control.popupAnnouncement, buttonText: e.target.value } })} />
          <input className="rounded-xl border border-slate-300 px-3 py-2" placeholder="Button link" value={control.popupAnnouncement.buttonLink} onChange={(e) => setControl({ popupAnnouncement: { ...control.popupAnnouncement, buttonLink: e.target.value } })} />
          <select aria-label="Popup frequency" className="rounded-xl border border-slate-300 px-3 py-2" value={control.popupAnnouncement.frequency} onChange={(e) => setControl({ popupAnnouncement: { ...control.popupAnnouncement, frequency: e.target.value as "once" | "always" } })}><option value="once">Show once</option><option value="always">Every visit</option></select>
          <select aria-label="Popup style" className="rounded-xl border border-slate-300 px-3 py-2" value={control.popupAnnouncement.style} onChange={(e) => setControl({ popupAnnouncement: { ...control.popupAnnouncement, style: e.target.value as "info" | "update" | "warning" | "offer" } })}><option value="info">Info</option><option value="update">Update</option><option value="warning">Warning</option><option value="offer">Offer</option></select>
          <input type="datetime-local" title="Popup start date and time" aria-label="Popup start date and time" className="rounded-xl border border-slate-300 px-3 py-2" value={control.popupAnnouncement.startDate} onChange={(e) => setControl({ popupAnnouncement: { ...control.popupAnnouncement, startDate: e.target.value } })} />
          <input type="datetime-local" title="Popup end date and time" aria-label="Popup end date and time" className="rounded-xl border border-slate-300 px-3 py-2" value={control.popupAnnouncement.endDate} onChange={(e) => setControl({ popupAnnouncement: { ...control.popupAnnouncement, endDate: e.target.value } })} />
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Maintenance / Downtime Mode</h2>
        <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
          <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" checked={control.maintenanceMode.enabled} onChange={(e) => setControl({ maintenanceMode: { ...control.maintenanceMode, enabled: e.target.checked } })} /> Enable maintenance mode</label>
          <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" checked={control.maintenanceMode.whitelistAdmin} onChange={(e) => setControl({ maintenanceMode: { ...control.maintenanceMode, whitelistAdmin: e.target.checked } })} /> Whitelist admin access</label>
          <input className="rounded-xl border border-slate-300 px-3 py-2" value={control.maintenanceMode.title} onChange={(e) => setControl({ maintenanceMode: { ...control.maintenanceMode, title: e.target.value } })} placeholder="Maintenance title" />
          <input className="rounded-xl border border-slate-300 px-3 py-2" value={control.maintenanceMode.estimatedReturn} onChange={(e) => setControl({ maintenanceMode: { ...control.maintenanceMode, estimatedReturn: e.target.value } })} placeholder="Estimated return text" />
          <textarea className="rounded-xl border border-slate-300 px-3 py-2 md:col-span-2" rows={3} value={control.maintenanceMode.subtitle} onChange={(e) => setControl({ maintenanceMode: { ...control.maintenanceMode, subtitle: e.target.value } })} placeholder="Maintenance subtitle" />
          <input className="rounded-xl border border-slate-300 px-3 py-2" value={control.maintenanceMode.contactButtonText} onChange={(e) => setControl({ maintenanceMode: { ...control.maintenanceMode, contactButtonText: e.target.value } })} placeholder="Contact button text" />
          <input className="rounded-xl border border-slate-300 px-3 py-2" value={control.maintenanceMode.contactButtonLink} onChange={(e) => setControl({ maintenanceMode: { ...control.maintenanceMode, contactButtonLink: e.target.value } })} placeholder="Contact button link" />
          <input className="rounded-xl border border-slate-300 px-3 py-2 md:col-span-2" value={control.maintenanceMode.whatsappLink} onChange={(e) => setControl({ maintenanceMode: { ...control.maintenanceMode, whatsappLink: e.target.value } })} placeholder="WhatsApp link" />
          <input className="rounded-xl border border-slate-300 px-3 py-2 md:col-span-2" value={control.maintenanceMode.allowedRoutes.join(", ")} onChange={(e) => setControl({ maintenanceMode: { ...control.maintenanceMode, allowedRoutes: e.target.value.split(",").map((v) => v.trim()).filter(Boolean) } })} placeholder="Allowed routes e.g. /contact,/resume" />
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Top Notice Bar</h2>
        <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
          <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" checked={control.topNoticeBar.enabled} onChange={(e) => setControl({ topNoticeBar: { ...control.topNoticeBar, enabled: e.target.checked } })} /> Enable notice bar</label>
          <select aria-label="Notice color" className="rounded-xl border border-slate-300 px-3 py-2" value={control.topNoticeBar.colorStyle} onChange={(e) => setControl({ topNoticeBar: { ...control.topNoticeBar, colorStyle: e.target.value as "blue" | "emerald" | "amber" | "rose" } })}><option value="blue">Blue</option><option value="emerald">Emerald</option><option value="amber">Amber</option><option value="rose">Rose</option></select>
          <input className="rounded-xl border border-slate-300 px-3 py-2 md:col-span-2" value={control.topNoticeBar.message} onChange={(e) => setControl({ topNoticeBar: { ...control.topNoticeBar, message: e.target.value } })} placeholder="Notice message" />
          <input className="rounded-xl border border-slate-300 px-3 py-2" value={control.topNoticeBar.ctaText} onChange={(e) => setControl({ topNoticeBar: { ...control.topNoticeBar, ctaText: e.target.value } })} placeholder="CTA text" />
          <input className="rounded-xl border border-slate-300 px-3 py-2" value={control.topNoticeBar.ctaLink} onChange={(e) => setControl({ topNoticeBar: { ...control.topNoticeBar, ctaLink: e.target.value } })} placeholder="CTA link" />
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Version / Update Message</h2>
        <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
          <input className="rounded-xl border border-slate-300 px-3 py-2" value={control.versionInfo.currentVersion} onChange={(e) => setControl({ versionInfo: { ...control.versionInfo, currentVersion: e.target.value } })} placeholder="Current version" />
          <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" checked={control.versionInfo.showBadge} onChange={(e) => setControl({ versionInfo: { ...control.versionInfo, showBadge: e.target.checked } })} /> Show version badge on navbar</label>
          <label className="inline-flex items-center gap-2 text-sm md:col-span-2"><input type="checkbox" checked={control.versionInfo.showUpdateMessage} onChange={(e) => setControl({ versionInfo: { ...control.versionInfo, showUpdateMessage: e.target.checked } })} /> Enable update message</label>
          <input className="rounded-xl border border-slate-300 px-3 py-2 md:col-span-2" value={control.versionInfo.updateMessage} onChange={(e) => setControl({ versionInfo: { ...control.versionInfo, updateMessage: e.target.value } })} placeholder="Update message" />
          <textarea className="rounded-xl border border-slate-300 px-3 py-2 md:col-span-2" rows={2} value={control.versionInfo.changelogShort} onChange={(e) => setControl({ versionInfo: { ...control.versionInfo, changelogShort: e.target.value } })} placeholder="Short changelog" />
        </div>
      </section>
    </div>
  );
}
