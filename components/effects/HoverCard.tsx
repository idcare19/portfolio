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
        "rounded-3xl border border-[rgb(var(--border))] bg-[rgb(var(--card-bg))] shadow-[0_12px_32px_rgba(15,23,42,0.05)] transition-transform duration-200 ease-out hover:-translate-y-0.5 hover:border-primary/30 hover:bg-[rgb(var(--card-hover))]",
        className
      )}
    >
      {children}
    </div>
  );
}
