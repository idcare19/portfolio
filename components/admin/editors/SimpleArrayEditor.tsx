"use client";

type ItemRecord = Record<string, any>;
type FieldType = "text" | "number" | "textarea" | "checkbox" | "select";

type FieldOption = {
  label: string;
  value: string;
};

type Props<T extends ItemRecord> = {
  title: string;
  description: string;
  items: T[];
  setItems: (items: T[]) => void;
  fields: Array<{ key: keyof T; label: string; type?: FieldType; options?: FieldOption[] }>;
  createItem: () => T;
};

export function SimpleArrayEditor<T extends ItemRecord>({ title, description, items, setItems, fields, createItem }: Props<T>) {
  function addItem() {
    setItems([...items, createItem()]);
  }

  function removeItem(index: number) {
    if (!confirm("Delete this item?")) return;
    setItems(items.filter((_, i) => i !== index));
  }

  function update(index: number, key: keyof T, value: any) {
    setItems(items.map((item, i) => (i === index ? { ...item, [key]: value } : item)));
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
          <p className="text-sm text-slate-600">{description}</p>
        </div>
        <button onClick={addItem} className="rounded-xl bg-blue-600 px-3 py-2 text-xs font-semibold text-white">Add Item</button>
      </div>

      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={(item.id as string) || index} className="rounded-xl border border-slate-200 p-4">
            <div className="mb-3 flex justify-end">
              <button onClick={() => removeItem(index)} className="text-xs font-semibold text-rose-600">Delete</button>
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {fields.map((field) => (
                <label key={String(field.key)} className={`text-sm ${field.type === "textarea" ? "md:col-span-2" : ""}`}>
                  <span className="mb-1 block font-medium text-slate-700">{field.label}</span>
                  {field.type === "textarea" ? (
                    <textarea className="w-full rounded-xl border border-slate-300 px-3 py-2" rows={3} value={String(item[field.key] ?? "")} onChange={(e) => update(index, field.key, e.target.value)} />
                  ) : field.type === "checkbox" ? (
                    <input type="checkbox" checked={Boolean(item[field.key])} onChange={(e) => update(index, field.key, e.target.checked)} />
                  ) : field.type === "select" ? (
                    <select
                      className="w-full rounded-xl border border-slate-300 px-3 py-2"
                      value={String(item[field.key] ?? "")}
                      onChange={(e) => update(index, field.key, e.target.value)}
                    >
                      {(field.options || []).map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type === "number" ? "number" : "text"}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2"
                      value={field.type === "number" ? Number(item[field.key] ?? 0) : String(item[field.key] ?? "")}
                      onChange={(e) => update(index, field.key, field.type === "number" ? Number(e.target.value || 0) : e.target.value)}
                    />
                  )}
                </label>
              ))}
            </div>
          </div>
        ))}
        {items.length === 0 ? <p className="text-sm text-slate-500">No items yet.</p> : null}
      </div>
    </section>
  );
}
