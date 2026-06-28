type StatCardProps = {
  label: string;
  value: number;
};

export function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-admin-border bg-admin-card p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="pointer-events-none absolute -right-8 -top-8 h-20 w-20 rounded-full bg-admin-primary/20 blur-2xl transition group-hover:bg-admin-primary/30" />
      <p className="relative text-sm font-medium text-admin-text-muted">{label}</p>
      <p className="relative mt-2 text-3xl font-bold tracking-tight text-admin-text">{value}</p>
    </div>
  );
}
