type EmptyStateProps = {
  title: string;
  description?: string;
};

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="rounded-2xl border border-dashed border-admin-border bg-white p-6 text-center">
      <p className="text-sm font-semibold text-admin-text">{title}</p>
      {description ? <p className="mt-1 text-sm text-admin-text-muted">{description}</p> : null}
    </div>
  );
}
