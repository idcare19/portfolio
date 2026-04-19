"use client";

import { motion, type Variants, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/lib/use-is-mobile";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  once?: boolean;
  immediate?: boolean;
};

const buildVariants = (y: number, duration: number): Variants => ({
  hidden: { opacity: 0, y },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration, ease: "easeOut" },
  },
});

export function ScrollReveal({ children, className, delay = 0, y = 24, once = true, immediate = false }: RevealProps) {
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const lightweightMode = prefersReducedMotion || isMobile;

  const revealDuration = lightweightMode ? 0.2 : 0.6;
  const revealY = lightweightMode ? Math.min(y, 10) : y;
  const revealDelay = lightweightMode ? delay * 0.25 : delay;

  if (immediate) {
    return (
      <motion.div
        className={cn(className)}
        initial={false}
        animate="visible"
        variants={buildVariants(revealY, revealDuration)}
        transition={{ delay: revealDelay }}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      className={cn(className)}
      variants={buildVariants(revealY, revealDuration)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: 0.2 }}
      transition={{ delay: revealDelay }}
    >
      {children}
    </motion.div>
  );
}
