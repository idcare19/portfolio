"use client";

import { AnimatedSection } from "@/components/effects/AnimatedSection";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { motion, useReducedMotion } from "framer-motion";

const motionTags = ["Quantum UI", "Pulse Engine", "Neon Drift", "Orbit Sync", "Velocity Boost", "Future Ready", "Smooth Core"];

const orbitNodes = [
  { label: "⚡", angle: 0, distance: 108, delay: 0.1 },
  { label: "🎉", angle: 52, distance: 96, delay: 0.25 },
  { label: "✨", angle: 110, distance: 114, delay: 0.4 },
  { label: "🚀", angle: 168, distance: 92, delay: 0.55 },
  { label: "💫", angle: 228, distance: 104, delay: 0.7 },
  { label: "🌈", angle: 288, distance: 98, delay: 0.85 },
];

const energyBursts = [
  { x: "8%", y: "20%", delay: 0.1 },
  { x: "22%", y: "76%", delay: 0.5 },
  { x: "42%", y: "14%", delay: 0.9 },
  { x: "60%", y: "74%", delay: 1.3 },
  { x: "78%", y: "22%", delay: 1.7 },
  { x: "90%", y: "62%", delay: 2.1 },
];

export function LightMotionSection() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <AnimatedSection id="light-motion" className="py-10 md:py-14">
      <div className="section-wrap">
        <SectionHeader
          eyebrow="Motion"
          title="Extraordinary motion playground"
          description="A high-energy animation scene with orbiting icons, pulse rings, and kinetic strips for a wow effect."
        />

        <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-[linear-gradient(120deg,rgba(255,255,255,0.92),rgba(240,249,255,0.9),rgba(238,242,255,0.9))] p-4 shadow-[0_18px_44px_rgba(15,23,42,0.08)] sm:p-6">
          <motion.div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.18),transparent_35%),radial-gradient(circle_at_80%_18%,rgba(6,182,212,0.16),transparent_32%),radial-gradient(circle_at_50%_100%,rgba(139,92,246,0.16),transparent_42%)]"
            animate={prefersReducedMotion ? undefined : { opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut" }}
          />

          {energyBursts.map((burst) => (
            <motion.span
              key={`${burst.x}-${burst.y}`}
              aria-hidden
              className="pointer-events-none absolute z-10 h-2.5 w-2.5 rounded-full bg-cyan-400/85 shadow-[0_0_0_6px_rgba(34,211,238,0.18)]"
              style={{ left: burst.x, top: burst.y }}
              animate={prefersReducedMotion ? undefined : { scale: [0.8, 1.5, 0.8], opacity: [0.35, 1, 0.35] }}
              transition={{ duration: 2.2, repeat: Infinity, delay: burst.delay, ease: "easeInOut" }}
            />
          ))}

          <div className="relative z-20 mx-auto mb-6 flex h-[260px] w-full max-w-[360px] items-center justify-center rounded-3xl border border-white/60 bg-white/50 backdrop-blur-sm sm:h-[300px]">
            <motion.div
              className="absolute h-40 w-40 rounded-full border border-blue-300/60"
              animate={prefersReducedMotion ? undefined : { rotate: 360 }}
              transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute h-56 w-56 rounded-full border border-cyan-300/55"
              animate={prefersReducedMotion ? undefined : { rotate: -360 }}
              transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute h-28 w-28 rounded-full bg-gradient-to-br from-blue-500 via-cyan-400 to-violet-500 shadow-[0_0_40px_rgba(59,130,246,0.45)]"
              animate={prefersReducedMotion ? undefined : { scale: [1, 1.12, 1], boxShadow: ["0 0 26px rgba(59,130,246,0.35)", "0 0 44px rgba(6,182,212,0.45)", "0 0 26px rgba(59,130,246,0.35)"] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
            />

            {orbitNodes.map((node) => (
              <motion.div
                key={`${node.label}-${node.angle}`}
                className="absolute"
                style={{ transform: `rotate(${node.angle}deg) translateX(${node.distance}px)` }}
                animate={
                  prefersReducedMotion
                    ? undefined
                    : {
                        rotate: [node.angle, node.angle + 360],
                        scale: [1, 1.12, 1],
                      }
                }
                transition={{ duration: 10 + node.delay * 4, repeat: Infinity, ease: "linear", delay: node.delay }}
              >
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/70 bg-white/85 text-sm shadow-[0_8px_18px_rgba(15,23,42,0.12)] sm:h-10 sm:w-10 sm:text-base">
                  {node.label}
                </span>
              </motion.div>
            ))}

            <motion.p
              className="absolute bottom-5 rounded-full border border-blue-200 bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-blue-700"
              animate={prefersReducedMotion ? undefined : { y: [0, -4, 0], opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 2.2, repeat: Infinity }}
            >
              Energy Core Online
            </motion.p>
          </div>

          <div className="relative z-20 space-y-2">
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white/90 py-2">
              <div className="marquee-track flex gap-3 whitespace-nowrap px-3 [animation-duration:11s] sm:gap-4 sm:px-4">
                {motionTags.concat(motionTags).map((item, index) => (
                  <span
                    key={`${item}-${index}`}
                    className="inline-flex rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white/90 py-2">
              <div className="marquee-track-reverse flex gap-3 whitespace-nowrap px-3 [animation-duration:13s] sm:gap-4 sm:px-4">
                {motionTags.concat(motionTags).map((item, index) => (
                  <span
                    key={`rev-${item}-${index}`}
                    className="inline-flex rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-700"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <motion.div
              className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-200/80"
              initial={{ opacity: 0.8 }}
            >
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 via-cyan-400 to-violet-500"
                animate={prefersReducedMotion ? undefined : { x: ["-100%", "100%"] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
