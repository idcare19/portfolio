type StatCardProps = {
  label: string;
  value: number;
};

export function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white/95 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="pointer-events-none absolute -right-8 -top-8 h-20 w-20 rounded-full bg-indigo-100/70 blur-2xl transition group-hover:bg-indigo-200/70" />
      <p className="relative text-sm font-medium text-slate-600">{label}</p>
      <p className="relative mt-2 text-3xl font-bold tracking-tight text-slate-900">{value}</p>
    </div>
  );
}
