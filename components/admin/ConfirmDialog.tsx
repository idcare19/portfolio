"use client";


type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDialog({ open, title, description, onConfirm, onCancel }: ConfirmDialogProps) {

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center bg-[rgba(15,23,42,0.18)] p-4" role="dialog" aria-modal="true">
      <div
        className="w-full max-w-md rounded-[28px] border border-admin-border bg-admin-modal p-5 shadow-[0_20px_50px_rgba(15,23,42,0.10)]"
      >
        <h3 className="text-lg font-semibold text-admin-text">{title}</h3>
        {description ? <p className="mt-2 text-sm text-admin-text-muted">{description}</p> : null}
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onCancel} className="rounded-xl border px-3 py-2 text-sm border-admin-border text-admin-text hover:bg-admin-bg">Cancel</button>
          <button onClick={onConfirm} className="rounded-xl bg-admin-danger px-3 py-2 text-sm font-semibold text-white hover:bg-admin-danger/90">Confirm</button>
        </div>
      </div>
    </div>
  );
}
