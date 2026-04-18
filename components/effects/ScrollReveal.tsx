"use client";

import { motion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  once?: boolean;
  immediate?: boolean;
};

const buildVariants = (y: number): Variants => ({
  hidden: { opacity: 0, y },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
});

export function ScrollReveal({ children, className, delay = 0, y = 24, once = true, immediate = false }: RevealProps) {
  if (immediate) {
    return (
      <motion.div className={cn(className)} initial={false} animate="visible" variants={buildVariants(y)} transition={{ delay }}>
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      className={cn(className)}
      variants={buildVariants(y)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: 0.2 }}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}
