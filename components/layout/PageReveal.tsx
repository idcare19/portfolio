"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Children, type ReactNode } from "react";

type PageRevealProps = {
  children: ReactNode;
};

export function PageReveal({ children }: PageRevealProps) {
  const prefersReducedMotion = useReducedMotion();
  const items = Children.toArray(children);

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{
        hidden: {},
        show: {
          transition: { staggerChildren: 0.09, delayChildren: 0.08 },
        },
      }}
    >
      {items.map((child, index) => (
        <motion.div
          key={index}
          variants={{
            hidden: prefersReducedMotion ? { opacity: 0, y: 16 } : { opacity: 0, y: 28, scale: 0.992, filter: "blur(4px)" },
            show: {
              opacity: 1,
              y: 0,
              scale: 1,
              filter: "blur(0px)",
              transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
            },
          }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}
