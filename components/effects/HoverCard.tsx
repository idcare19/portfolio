"use client";

import { cn } from "@/lib/utils";

type HoverCardProps = {
  children: React.ReactNode;
  className?: string;
};

export function HoverCard({ children, className }: HoverCardProps) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-slate-200/80 bg-white shadow-[0_10px_28px_rgba(15,23,42,0.05)] transition-transform duration-200 ease-out hover:-translate-y-0.5 hover:border-blue-200",
        className
      )}
    >
      {children}
    </div>
  );
}
