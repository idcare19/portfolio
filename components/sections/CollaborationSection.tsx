"use client";

import { AnimatedSection } from "@/components/effects/AnimatedSection";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { portfolioData } from "@/data/portfolio";
import { motion, useReducedMotion } from "framer-motion";
import { RefreshCw } from "lucide-react";

export function CollaborationSection() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <AnimatedSection id="collaboration" className="py-10 md:py-14">
      <div className="section-wrap">
        <SectionHeader
          eyebrow="Realtime"
          title="Collaborative animations"
          description="Live-presence inspired interactions for a modern, team-ready product feel."
        />

        <motion.div
          className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white/75 p-4 shadow-[0_18px_40px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
        >
          <div className="relative z-10 mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white/70 px-3 py-3 sm:px-4">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
              </span>
              Live session active
            </div>

            <motion.div
              className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700"
              animate={prefersReducedMotion ? undefined : { scale: [1, 1.04, 1] }}
              transition={{ duration: 1.4, repeat: Infinity }}
            >
              <motion.span
                animate={prefersReducedMotion ? undefined : { rotate: 360 }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
              >
                <RefreshCw className="h-3.5 w-3.5" />
              </motion.span>
              Syncing updates
            </motion.div>

            <div className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
              <span>Typing</span>
              {[0, 1, 2].map((dot) => (
                <motion.span
                  key={dot}
                  className="h-1.5 w-1.5 rounded-full bg-slate-500"
                  animate={prefersReducedMotion ? undefined : { y: [0, -3, 0], opacity: [0.45, 1, 0.45] }}
                  transition={{ duration: 0.8, repeat: Infinity, delay: dot * 0.12 }}
                />
              ))}
            </div>
          </div>

          <motion.div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.13),transparent_40%),radial-gradient(circle_at_80%_20%,rgba(6,182,212,0.11),transparent_35%),radial-gradient(circle_at_50%_100%,rgba(139,92,246,0.12),transparent_40%)]"
            animate={prefersReducedMotion ? undefined : { opacity: [0.65, 1, 0.65] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
          />

          <div className="relative z-10 grid gap-5 lg:grid-cols-[1fr_1fr]">
            <div className="rounded-2xl border border-slate-200 bg-white/80 p-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Live presence</p>
              <div className="relative h-44 overflow-hidden rounded-xl bg-slate-50">
                {portfolioData.collaboration.users.map((user, index) => (
                  <motion.div
                    key={user.name}
                    className="absolute"
                    animate={
                      prefersReducedMotion
                        ? undefined
                        : {
                            x: [10 + index * 60, 120 + index * 45, 30 + index * 65],
                            y: [20 + index * 30, 60 + index * 35, 105 - index * 16],
                          }
                    }
                    transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut", delay: index * 0.25 }}
                  >
                    <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-2 py-1 text-[10px] font-semibold text-slate-700 shadow-sm">
                      <span className={`h-2 w-2 rounded-full ${user.color}`} />
                      {user.name}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white/80 p-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Realtime board sync</p>
              <div className="space-y-2">
                {portfolioData.collaboration.board.map((item, index) => (
                  <motion.div
                    key={item.title}
                    className="flex flex-col items-start justify-between gap-2 rounded-xl border border-slate-200 bg-white p-3 sm:flex-row sm:items-center"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ delay: index * 0.08, duration: 0.35 }}
                    whileHover={{ y: -2, boxShadow: "0 10px 22px rgba(59,130,246,0.15)" }}
                  >
                    <span className="text-sm font-medium text-slate-700">{item.title}</span>
                    <motion.span
                      className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-[10px] font-semibold text-blue-700"
                      animate={prefersReducedMotion ? undefined : { opacity: [0.7, 1, 0.7] }}
                      transition={{ duration: 1.6, repeat: Infinity, delay: index * 0.2 }}
                    >
                      {item.status}
                    </motion.span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          <div className="relative z-10 mt-5 flex flex-wrap gap-2">
            {portfolioData.collaboration.events.map((event, index) => (
              <motion.span
                key={event}
                className="rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-medium text-cyan-700"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: index * 0.08, duration: 0.3 }}
                animate={prefersReducedMotion ? undefined : { y: [0, -2, 0] }}
              >
                {event}
              </motion.span>
            ))}
          </div>

          <div className="relative z-10 mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white/80 py-2">
            <motion.div
              className="flex gap-6 whitespace-nowrap px-4 text-xs font-medium text-slate-500"
              animate={prefersReducedMotion ? undefined : { x: ["0%", "-50%"] }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            >
              {portfolioData.collaboration.events.concat(portfolioData.collaboration.events).map((event, index) => (
                <span key={`${event}-${index}`} className="inline-flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-500" />
                  {event}
                </span>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </AnimatedSection>
  );
}
