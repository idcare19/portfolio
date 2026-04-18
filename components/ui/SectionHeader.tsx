import { cn } from "@/lib/utils";

type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  description?: string;
  className?: string;
};

export function SectionHeader({ eyebrow, title, description, className }: SectionHeaderProps) {
  return (
    <div className={cn("mx-auto mb-10 max-w-2xl text-center", className)}>
      <p className="mb-3 inline-flex rounded-full border border-blue-200 bg-blue-50/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-blue-700">
        {eyebrow}
      </p>
      <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{title}</h2>
      {description ? <p className="mt-4 text-slate-600">{description}</p> : null}
    </div>
  );
}
