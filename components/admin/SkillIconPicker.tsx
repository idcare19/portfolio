"use client";

import { useMemo, useRef, useState } from "react";
import { Upload, X } from "lucide-react";
import { iconCategories, getIconOptions, renderIcon } from "@/lib/skill-icons";

type Props = {
  value: string;
  onChange: (next: string) => void;
  iconUrl?: string;
  onIconUrlChange?: (next: string) => void;
  color?: string;
  onColorChange?: (next: string) => void;
  onUpload?: (dataUrl: string) => void;
  title?: string;
};

export function SkillIconPicker({ value, onChange, iconUrl, onIconUrlChange, color, onColorChange, onUpload, title = "Icon Picker" }: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("");
  const fileRef = useRef<HTMLInputElement | null>(null);
  const options = useMemo(() => getIconOptions(query, category), [query, category]);

  async function handleUpload(files: FileList | null) {
    if (!files?.length) return;
    const file = files[0];
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ""));
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
    onUpload?.(dataUrl);
    onIconUrlChange?.(dataUrl);
  }

  return (
    <div className="rounded-2xl border border-admin-border bg-admin-bg p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-admin-text">{title}</p>
          <p className="text-xs text-admin-text-muted">Search an icon, upload a file, paste a URL, or type a name manually.</p>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => { onChange(""); onIconUrlChange?.(""); }} className="rounded-xl border border-admin-border bg-admin-card px-3 py-2 text-sm font-semibold text-admin-text">
            Clear Icon
          </button>
          <button type="button" onClick={() => setOpen((state) => !state)} className="rounded-xl border border-admin-border bg-admin-card px-3 py-2 text-sm font-semibold text-admin-text">
            {open ? "Close" : "Choose Icon"}
          </button>
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-[1fr_auto]">
        <label className="block">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-admin-text-muted">Manual Icon Name</span>
          <input value={value} onChange={(e) => onChange(e.target.value)} placeholder="code, react, github, certificate" className="w-full rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text" />
        </label>
        <div className="rounded-xl border border-admin-border bg-admin-card p-3">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-admin-text-muted">Preview</p>
          <div className="mt-2 flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-white text-admin-text">
            {iconUrl ? <img src={iconUrl} alt="Icon preview" className="h-full w-full object-contain" /> : renderIcon(value, color, "h-5 w-5")}
          </div>
        </div>
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-admin-text-muted">Icon URL</span>
          <input value={iconUrl || ""} onChange={(e) => onIconUrlChange?.(e.target.value)} placeholder="https://..., data:image/svg+xml..., /icons/react.svg" className="w-full rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text" />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-admin-text-muted">Icon Color</span>
          <input type="text" value={color || ""} onChange={(e) => onColorChange?.(e.target.value)} placeholder="#1D4ED8" className="w-full rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text" />
        </label>
      </div>

      <div className="mt-3 flex flex-wrap gap-3">
        <button type="button" onClick={() => fileRef.current?.click()} className="inline-flex items-center gap-2 rounded-xl border border-admin-border bg-admin-card px-3 py-2 text-sm font-semibold text-admin-text">
          <Upload className="h-4 w-4" />
          Upload Custom Icon
        </button>
        <input ref={fileRef} type="file" accept="image/*,.svg" className="hidden" onChange={(e) => void handleUpload(e.target.files)} />
        <button type="button" onClick={() => onChange("code")} className="inline-flex items-center gap-2 rounded-xl border border-admin-border bg-admin-card px-3 py-2 text-sm font-semibold text-admin-text">
          Use fallback code icon
        </button>
      </div>

      {open ? (
        <div className="mt-4 rounded-2xl border border-admin-border bg-admin-card p-3">
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => setCategory("")} className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${!category ? "border-admin-primary bg-admin-primary/10 text-admin-primary" : "border-admin-border text-admin-text"}`}>
              All
            </button>
            {iconCategories.map((group) => (
              <button key={group} type="button" onClick={() => setCategory(group)} className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${category === group ? "border-admin-primary bg-admin-primary/10 text-admin-primary" : "border-admin-border text-admin-text"}`}>
                {group}
              </button>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-2">
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder='Search "react", "postgres", "award"' className="w-full rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text" />
            <button type="button" onClick={() => setOpen(false)} className="rounded-xl border border-admin-border px-3 py-2">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-3 grid max-h-72 gap-2 overflow-y-auto sm:grid-cols-2">
            {options.map((option) => (
              <button
                key={option.key}
                type="button"
                onClick={() => {
                  onChange(option.key);
                  setOpen(false);
                }}
                className="flex items-center gap-3 rounded-xl border border-admin-border bg-admin-bg px-3 py-3 text-left text-sm text-admin-text transition hover:border-admin-primary"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white">
                  {option.type === "tech" ? <img src={`https://cdn.simpleicons.org/${option.slug}`} alt={option.label} className="h-5 w-5 object-contain" loading="lazy" /> : option.icon}
                </div>
                <div>
                  <p className="font-semibold">{option.label}</p>
                  <p className="text-xs text-admin-text-muted">{option.category}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export { SkillIconPicker as IconPicker };
