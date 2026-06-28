"use client";

import { motion, useReducedMotion } from "framer-motion";

const particles = [
  { left: "8%", top: "18%", delay: 0.1 },
  { left: "22%", top: "72%", delay: 0.6 },
  { left: "38%", top: "28%", delay: 1.1 },
  { left: "56%", top: "84%", delay: 1.6 },
  { left: "68%", top: "36%", delay: 2.1 },
  { left: "84%", top: "20%", delay: 2.7 },
  { left: "92%", top: "68%", delay: 3.2 },
];

export function FullPageEffects() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <>
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <motion.div
          className="absolute -left-24 top-16 h-72 w-72 rounded-full bg-blue-300/25 blur-3xl"
          animate={prefersReducedMotion ? undefined : { x: [0, 40, 0], y: [0, -25, 0], scale: [1, 1.08, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute right-0 top-40 h-80 w-80 rounded-full bg-cyan-300/20 blur-3xl"
          animate={prefersReducedMotion ? undefined : { x: [0, -35, 0], y: [0, 30, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-12 left-1/3 h-64 w-64 rounded-full bg-violet-300/20 blur-3xl"
          animate={prefersReducedMotion ? undefined : { x: [0, 25, 0], y: [0, -18, 0], scale: [1, 1.06, 1] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.07)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.07)_1px,transparent_1px)] bg-[size:30px_30px] [mask-image:radial-gradient(circle_at_center,black,transparent_85%)]" />

        {particles.map((particle) => (
          <motion.span
            key={`${particle.left}-${particle.top}`}
            className="absolute h-1.5 w-1.5 rounded-full bg-blue-400/70"
            style={{ left: particle.left, top: particle.top }}
            animate={prefersReducedMotion ? undefined : { opacity: [0.2, 1, 0.2], scale: [0.6, 1.2, 0.6], y: [0, -10, 0] }}
            transition={{ duration: 2.8, repeat: Infinity, delay: particle.delay }}
          />
        ))}
      </div>

      <motion.div
        className="pointer-events-none fixed inset-x-0 top-16 z-[5] h-px bg-gradient-to-r from-transparent via-blue-400/60 to-transparent"
        animate={prefersReducedMotion ? undefined : { opacity: [0.3, 0.9, 0.3] }}
        transition={{ duration: 3.2, repeat: Infinity }}
      />
    </>
  );
}
