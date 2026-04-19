"use client";

import type { SiteData } from "@/src/types/site-data";

type Props = {
  data: SiteData;
  onChange: (next: SiteData) => void;
};

export function ProfileEditor({ data, onChange }: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-2">
      <input className="rounded-xl border border-slate-300 px-3 py-2" value={data.owner.name} onChange={(e) => onChange({ ...data, owner: { ...data.owner, name: e.target.value } })} placeholder="Name" />
      <input className="rounded-xl border border-slate-300 px-3 py-2" value={data.owner.role} onChange={(e) => onChange({ ...data, owner: { ...data.owner, role: e.target.value } })} placeholder="Role/Title" />
      <textarea className="rounded-xl border border-slate-300 px-3 py-2 md:col-span-2" rows={4} value={data.owner.tagline} onChange={(e) => onChange({ ...data, owner: { ...data.owner, tagline: e.target.value } })} placeholder="Bio/About" />
      <input className="rounded-xl border border-slate-300 px-3 py-2" value={data.owner.profileImage} onChange={(e) => onChange({ ...data, owner: { ...data.owner, profileImage: e.target.value } })} placeholder="Profile image URL" />
      <input className="rounded-xl border border-slate-300 px-3 py-2" value={data.owner.resumeUrl} onChange={(e) => onChange({ ...data, owner: { ...data.owner, resumeUrl: e.target.value } })} placeholder="Resume/CV link" />

      {data.socials.map((social, idx) => (
        <div key={social.label} className="grid grid-cols-2 gap-2 md:col-span-2">
          <input className="rounded-xl border border-slate-300 px-3 py-2" value={social.value} onChange={(e) => onChange({ ...data, socials: data.socials.map((s, i) => i === idx ? { ...s, value: e.target.value } : s) })} placeholder={`${social.label} value`} />
          <input className="rounded-xl border border-slate-300 px-3 py-2" value={social.href} onChange={(e) => onChange({ ...data, socials: data.socials.map((s, i) => i === idx ? { ...s, href: e.target.value } : s) })} placeholder={`${social.label} URL`} />
        </div>
      ))}
    </div>
  );
}
