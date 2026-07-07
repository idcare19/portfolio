import { cn } from "@/lib/utils";

type BadgeProps = {
  children: React.ReactNode;
  className?: string;
};

export function Badge({ children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-[#BFDBFE] bg-[#EFF6FF] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#1D4ED8] shadow-[0_8px_20px_rgba(37,99,235,0.08)]",
        className
      )}
    >
      {children}
    </span>
  );
}
