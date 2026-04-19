"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/lib/use-is-mobile";

type AnimatedSectionProps = {
  id: string;
  className?: string;
  children: React.ReactNode;
  delay?: number;
};

export function AnimatedSection({ id, className, children, delay = 0 }: AnimatedSectionProps) {
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const shouldReduceMotion = prefersReducedMotion || isMobile;

  return (
    <motion.section
      id={id}
      className={cn("relative py-20 md:py-24", className)}
      initial={shouldReduceMotion ? { opacity: 0, y: 10 } : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: shouldReduceMotion ? 0.08 : 0.2 }}
      transition={{ duration: shouldReduceMotion ? 0.28 : 0.6, ease: "easeOut", delay: shouldReduceMotion ? delay * 0.35 : delay }}
    >
      {children}
    </motion.section>
  );
}
