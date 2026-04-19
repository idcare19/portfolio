"use client";

import { useEffect, useMemo, useState } from "react";
import { useToast } from "@/components/admin/ToastProvider";

type FieldType = "text" | "textarea" | "number" | "checkbox" | "tags" | "select" | "url";

type FieldConfig = {
  key: string;
  label: string;
  type: FieldType;
  options?: string[];
  placeholder?: string;
};

type CrudManagerProps = {
  resource: string;
  title: string;
  fields: FieldConfig[];
};

function defaultValue(field: FieldConfig) {
  if (field.type === "checkbox") return false;
  if (field.type === "number") return 0;
  if (field.type === "tags") return [] as string[];
  return "";
}

export function CrudManager({ resource, title, fields }: CrudManagerProps) {
  const { notify } = useToast();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [open, setOpen] = useState(false);
  const initialForm = useMemo(
    () => Object.fromEntries(fields.map((f) => [f.key, defaultValue(f)])),
    [fields]
  );
  const [form, setForm] = useState<Record<string, any>>(initialForm);

  async function loadItems() {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/${resource}`);
      const payload = await res.json();
      setItems(payload.data || []);
    } catch {
      notify("error", "Failed to load records");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadItems();
  }, [resource]);

  function openCreate() {
    setEditingItem(null);
    setForm(initialForm);
    setOpen(true);
  }

  function openEdit(item: any) {
    setEditingItem(item);
    setForm({ ...initialForm, ...item });
    setOpen(true);
  }

  async function saveItem() {
    try {
      const method = editingItem?._id ? "PUT" : "POST";
      const url = editingItem?._id ? `/api/admin/${resource}/${editingItem._id}` : `/api/admin/${resource}`;

      const payload = {
        ...form,
        ...(Array.isArray(form.techStack) ? { techStack: form.techStack } : {}),
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "Request failed");
      }

      notify("success", editingItem?._id ? "Updated successfully" : "Created successfully");
      setOpen(false);
      await loadItems();
    } catch (error) {
      notify("error", error instanceof Error ? error.message : "Failed to save");
    }
  }

  async function removeItem(id: string) {
    if (!confirm("Delete this item?")) return;
    try {
      const res = await fetch(`/api/admin/${resource}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      notify("success", "Deleted successfully");
      await loadItems();
    } catch {
      notify("error", "Delete failed");
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4">
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
        <button onClick={openCreate} className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
          Add New
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        {loading ? (
          <p className="p-6 text-sm text-slate-600">Loading...</p>
        ) : items.length === 0 ? (
          <p className="p-6 text-sm text-slate-600">No records found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-left text-slate-600">
                <tr>
                  {fields.slice(0, 4).map((f) => (
                    <th key={f.key} className="px-4 py-3 font-semibold">{f.label}</th>
                  ))}
                  <th className="px-4 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item._id} className="border-t border-slate-100">
                    {fields.slice(0, 4).map((f) => (
                      <td key={f.key} className="px-4 py-3 text-slate-700">
                        {Array.isArray(item[f.key])
                          ? item[f.key].join(", ")
                          : typeof item[f.key] === "boolean"
                            ? item[f.key]
                              ? "Yes"
                              : "No"
                            : String(item[f.key] ?? "-")}
                      </td>
                    ))}
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(item)} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50">Edit</button>
                        <button onClick={() => removeItem(item._id)} className="rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-50">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {open ? (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/45 p-4">
          <div className="max-h-[85vh] w-full max-w-2xl overflow-auto rounded-2xl bg-white p-5 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">{editingItem ? "Edit" : "Add"} {title}</h3>
              <button onClick={() => setOpen(false)} className="rounded-lg border px-2 py-1 text-sm">Close</button>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {fields.map((field) => (
                <label key={field.key} className={`text-sm ${field.type === "textarea" || field.type === "tags" ? "md:col-span-2" : ""}`}>
                  <span className="mb-1 block font-medium text-slate-700">{field.label}</span>
                  {field.type === "textarea" ? (
                    <textarea
                      rows={4}
                      value={form[field.key] ?? ""}
                      onChange={(e) => setForm((prev) => ({ ...prev, [field.key]: e.target.value }))}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2"
                    />
                  ) : field.type === "checkbox" ? (
                    <input
                      type="checkbox"
                      checked={Boolean(form[field.key])}
                      onChange={(e) => setForm((prev) => ({ ...prev, [field.key]: e.target.checked }))}
                    />
                  ) : field.type === "tags" ? (
                    <input
                      value={Array.isArray(form[field.key]) ? form[field.key].join(", ") : ""}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          [field.key]: e.target.value
                            .split(",")
                            .map((v) => v.trim())
                            .filter(Boolean),
                        }))
                      }
                      placeholder="Comma separated"
                      className="w-full rounded-xl border border-slate-300 px-3 py-2"
                    />
                  ) : field.type === "select" ? (
                    <select
                      value={form[field.key] ?? ""}
                      onChange={(e) => setForm((prev) => ({ ...prev, [field.key]: e.target.value }))}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2"
                    >
                      <option value="">Select</option>
                      {field.options?.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type === "number" ? "number" : "text"}
                      value={field.type === "number" ? Number(form[field.key] ?? 0) : String(form[field.key] ?? "")}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          [field.key]: field.type === "number" ? Number(e.target.value || 0) : e.target.value,
                        }))
                      }
                      className="w-full rounded-xl border border-slate-300 px-3 py-2"
                      placeholder={field.placeholder}
                    />
                  )}
                </label>
              ))}
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button onClick={() => setOpen(false)} className="rounded-xl border border-slate-300 px-4 py-2 text-sm">Cancel</button>
              <button onClick={saveItem} className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white">Save</button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
