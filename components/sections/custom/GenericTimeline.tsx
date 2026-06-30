"use client";

type Item = Record<string, any>;

export function GenericTimeline({ items, onChange }: { items: Item[]; onChange: (items: Item[]) => void }) {
  const update = (index: number, patch: Partial<Item>) => onChange(items.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item)));
  const add = () => onChange([...items, { id: crypto.randomUUID(), enabled: true, order: items.length + 1 }]);
  return (
    <div className="space-y-3">
      <button type="button" onClick={add} className="rounded-lg border border-admin-border px-3 py-2 text-sm">Add Timeline Item</button>
      {items.map((item, index) => (
        <div key={item.id || index} className="rounded-2xl border border-admin-border bg-admin-card p-4">
          <div className="grid gap-3 md:grid-cols-2">
            {["date", "title", "description", "badge", "icon"].map((key) => (
              <label key={key} className="space-y-1 text-sm md:col-span-2">
                <span className="font-medium text-admin-text">{key}</span>
                <textarea value={String(item[key] || "")} onChange={(e) => update(index, { [key]: e.target.value })} rows={key === "description" ? 4 : 2} className="w-full rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text" />
              </label>
            ))}
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={item.enabled !== false} onChange={(e) => update(index, { enabled: e.target.checked })} />Enabled</label>
          </div>
        </div>
      ))}
    </div>
  );
}
