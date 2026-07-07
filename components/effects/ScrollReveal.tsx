"use client";

import { cn } from "@/lib/utils";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  immediate?: boolean;
};
export function ScrollReveal({ children, className }: RevealProps) {
  return <div className={cn(className)}>{children}</div>;
}
