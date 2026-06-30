"use client";

import { useState } from "react";

type Item = Record<string, any>;

export function GenericGallery({ items, onChange }: { items: Item[]; onChange: (items: Item[]) => void }) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const update = (index: number, patch: Partial<Item>) => onChange(items.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item)));
  const add = () => onChange([...items, { id: crypto.randomUUID(), enabled: true, order: items.length + 1 }]);
  const swap = (index: number, target: number) => {
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next.map((item, order) => ({ ...item, order: order + 1 })));
  };
  async function uploadImage(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch("/api/admin/upload", { method: "POST", body: formData });
    const payload = await response.json();
    if (!response.ok || !payload?.url) throw new Error(payload?.error || "Upload failed");
    return String(payload.url);
  }
  return (
    <div className="space-y-3">
      <button type="button" onClick={add} className="rounded-lg border border-admin-border px-3 py-2 text-sm">Add Image</button>
      {items.map((item, index) => (
        <div
          key={item.id || index}
          draggable
          onDragStart={() => setDragIndex(index)}
          onDragOver={(event) => event.preventDefault()}
          onDrop={() => {
            if (dragIndex === null) return;
            swap(dragIndex, index);
            setDragIndex(null);
          }}
          onDragEnd={() => setDragIndex(null)}
          className="rounded-2xl border border-admin-border bg-admin-card p-4"
        >
          <div className="grid gap-3 md:grid-cols-2">
            {["caption", "alt", "link"].map((key) => (
              <label key={key} className="space-y-1 text-sm">
                <span className="font-medium text-admin-text">{key}</span>
                <input value={String(item[key] || "")} onChange={(e) => update(index, { [key]: e.target.value })} className="w-full rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text" />
              </label>
            ))}
            <label className="space-y-1 text-sm md:col-span-2">
              <span className="font-medium text-admin-text">Image</span>
              <div className="flex items-center gap-3">
                {item.image ? <img src={item.image} alt={String(item.alt || item.caption || "")} className="h-16 w-16 rounded-xl object-cover" /> : null}
                <input type="file" accept="image/*" onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const url = await uploadImage(file);
                  update(index, { image: url });
                  e.currentTarget.value = "";
                }} className="w-full rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text" />
                {item.image ? <button type="button" onClick={() => update(index, { image: "" })} className="rounded-lg border border-admin-border px-3 py-2 text-sm">Remove</button> : null}
              </div>
            </label>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={item.enabled !== false} onChange={(e) => update(index, { enabled: e.target.checked })} />Enabled</label>
            <label className="space-y-1 text-sm"><span className="font-medium text-admin-text">Order</span><input type="number" value={String(item.order ?? index + 1)} onChange={(e) => update(index, { order: Number(e.target.value) })} className="w-full rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text" /></label>
          </div>
        </div>
      ))}
    </div>
  );
}
