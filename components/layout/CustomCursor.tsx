"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect } from "react";

export function CustomCursor() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 26 });
  const sy = useSpring(y, { stiffness: 260, damping: 26 });

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const handleMove = (event: MouseEvent) => {
      x.set(event.clientX - 12);
      y.set(event.clientY - 12);
    };

    window.addEventListener("mousemove", handleMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMove);
  }, [x, y]);

  return (
    <motion.div
      aria-hidden
      style={{ x: sx, y: sy }}
      className="pointer-events-none fixed left-0 top-0 z-[70] hidden h-6 w-6 rounded-full border border-blue-400/50 bg-blue-300/10 backdrop-blur-sm md:block"
    />
  );
}
