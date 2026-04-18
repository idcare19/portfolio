"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

type HoverCardProps = {
  children: React.ReactNode;
  className?: string;
};

export function HoverCard({ children, className }: HoverCardProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      className={cn(
        "rounded-3xl border border-slate-200/70 bg-white/65 shadow-[0_10px_30px_rgba(15,23,42,0.06)] backdrop-blur-xl transition-all duration-500 ease-out",
        className
      )}
      whileHover={
        prefersReducedMotion
          ? undefined
          : {
              y: -8,
              boxShadow: "0 25px 45px rgba(59, 130, 246, 0.2)",
              borderColor: "rgba(59, 130, 246, 0.45)",
            }
      }
    >
      {children}
    </motion.div>
  );
}
