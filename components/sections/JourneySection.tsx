"use client";

import { AnimatedSection } from "@/components/effects/AnimatedSection";
import { FadeInUp } from "@/components/effects/FadeInUp";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { portfolioData } from "@/data/portfolio";
import { useIsMobile } from "@/lib/use-is-mobile";
import { motion, useReducedMotion } from "framer-motion";

export function JourneySection() {
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const lightweightMode = prefersReducedMotion || isMobile;

  return (
    <AnimatedSection id="journey" className="py-20">
      <div className="section-wrap">
        <SectionHeader
          eyebrow="Experience"
          title="Timeline of roles & milestones"
          description="Hands-on roles that shaped my practical engineering and security-first development approach."
        />

        <div className="mx-auto mb-5 max-w-4xl rounded-2xl border border-slate-200 bg-white/70 p-4 backdrop-blur-sm">
          <div className="mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
            <span>Progress</span>
            <span>{portfolioData.experience.length} role{portfolioData.experience.length > 1 ? "s" : ""}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-100">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 via-cyan-400 to-violet-500"
              initial={{ width: 0 }}
              whileInView={{ width: "100%" }}
              viewport={{ once: true, amount: 0.8 }}
              transition={{ duration: 1.15, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
        </div>

        <div className="relative mx-auto max-w-4xl border-l border-blue-200/80 pl-6">
          {portfolioData.experience.map((item, index) => (
            <FadeInUp key={`${item.role}-${item.period}`} delay={index * 0.06} className="relative pb-7 last:pb-0">
              <motion.span
                className="absolute -left-[31px] top-1.5 inline-flex h-4 w-4 rounded-full border-2 border-blue-500 bg-white"
                animate={
                  lightweightMode
                    ? undefined
                    : {
                        scale: [1, 1.15, 1],
                        boxShadow: [
                          "0 0 0 rgba(59,130,246,0)",
                          "0 0 0 8px rgba(59,130,246,0.14)",
                          "0 0 0 rgba(59,130,246,0)",
                        ],
                      }
                }
                transition={{ duration: 2.3, repeat: Infinity, delay: index * 0.14 }}
              />

              <motion.div
                className="group rounded-xl border border-slate-200/80 bg-white/80 p-4 backdrop-blur-md transition-all duration-500 ease-out hover:-translate-y-1 hover:border-blue-300"
                whileHover={lightweightMode ? undefined : { x: 4 }}
              >
                <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-blue-700">{item.period}</div>
                <p className="text-sm font-semibold text-slate-900">{item.role}</p>
                <p className="mt-2 text-sm text-slate-700">{item.summary}</p>
              </motion.div>
            </FadeInUp>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
