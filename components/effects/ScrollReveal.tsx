"use client";

import { motion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");
    const sync = () => setIsMobile(media.matches);

    sync();
    media.addEventListener("change", sync);

    return () => media.removeEventListener("change", sync);
  }, []);

  const revealDuration = isMobile ? 0.34 : 0.6;
  const revealY = isMobile ? Math.min(y, 14) : y;
  const revealDelay = isMobile ? delay * 0.65 : delay;

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
