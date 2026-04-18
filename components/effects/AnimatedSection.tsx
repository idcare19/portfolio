"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

type AnimatedSectionProps = {
  id: string;
  className?: string;
  children: React.ReactNode;
  delay?: number;
};

export function AnimatedSection({ id, className, children, delay = 0 }: AnimatedSectionProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.section
      id={id}
      className={cn("relative py-20 md:py-24", className)}
      initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
      whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: "easeOut", delay }}
    >
      {children}
    </motion.section>
  );
}
