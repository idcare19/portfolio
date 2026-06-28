import { cn } from "@/lib/utils";

type AnimatedCardProps = {
  children: React.ReactNode;
  className?: string;
};

export function AnimatedCard({ children, className }: AnimatedCardProps) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-[28px] border border-[rgb(var(--border))] bg-[rgb(var(--card-bg))] p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)] transition duration-300 hover:-translate-y-1 hover:border-primary/30 hover:bg-[rgb(var(--card-hover))] hover:shadow-[0_24px_70px_rgba(15,23,42,0.10)]",
        className
      )}
    >
      <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      {children}
    </div>
  );
}
