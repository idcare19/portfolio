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
      initial={{ opacity: 0, y: shouldReduceMotion ? 8 : 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.14 }}
      transition={{ duration: shouldReduceMotion ? 0.2 : 0.38, ease: "easeOut", delay: shouldReduceMotion ? delay * 0.2 : delay * 0.55 }}
    >
      {children}
    </motion.section>
  );
}
