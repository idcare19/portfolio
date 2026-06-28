"use client";

type FormModalProps = {
  open: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
};

export function FormModal({ open, title, children, onClose }: FormModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-[rgba(15,23,42,0.18)] p-4" role="dialog" aria-modal="true">
      <div className="w-full max-w-2xl rounded-2xl bg-admin-card p-5 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-admin-text">{title}</h3>
          <button onClick={onClose} className="rounded-lg border border-admin-border px-2 py-1 text-xs font-semibold text-admin-text hover:bg-admin-bg">Close</button>
        </div>
        {children}
      </div>
    </div>
  );
}
