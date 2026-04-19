"use client";

type DrawerFormProps = {
  open: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
};

export function DrawerForm({ open, title, children, onClose }: DrawerFormProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[120]" role="dialog" aria-modal="true">
      <button className="absolute inset-0 bg-slate-950/40" onClick={onClose} aria-label="Close drawer" />
      <aside className="absolute right-0 top-0 h-full w-full max-w-xl overflow-y-auto bg-white p-5 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
          <button onClick={onClose} className="rounded-lg border border-slate-300 px-2 py-1 text-xs font-semibold text-slate-700">Close</button>
        </div>
        {children}
      </aside>
    </div>
  );
}
