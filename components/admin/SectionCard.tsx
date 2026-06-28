import { cn } from "@/lib/utils";


type SectionCardProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  actions?: React.ReactNode;
};

export function SectionCard({ title, description, children, className, actions }: SectionCardProps) {

  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-[30px] border p-5 backdrop-blur-xl border-admin-border bg-admin-card shadow-lg",
        className
      )}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-admin-primary/50 to-transparent" />
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-admin-text">{title}</h2>
          {description ? <p className="mt-1 text-sm text-admin-text-muted">{description}</p> : null}
        </div>
        {actions}
      </div>
      {children}
    </section>
  );
}
