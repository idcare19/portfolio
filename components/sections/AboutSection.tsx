"use client";

import { AnimatedSection } from "@/components/effects/AnimatedSection";
import { HoverCard } from "@/components/effects/HoverCard";
import { FadeInUp } from "@/components/effects/FadeInUp";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { portfolioData } from "@/data/portfolio";
import { motion, useReducedMotion } from "framer-motion";

export function AboutSection() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <AnimatedSection id="about" className="py-20">
      <div className="section-wrap">
        <SectionHeader
          eyebrow="About"
          title="Building modern products with clean execution"
          description="I love transforming ideas into smooth, responsive, and practical digital experiences."
        />

        <FadeInUp className="glass relative mb-6 overflow-hidden rounded-3xl border border-white/80 p-6 shadow-[0_14px_30px_rgba(15,23,42,0.06)]">
          <motion.div
            className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-white/50 to-transparent"
            animate={prefersReducedMotion ? undefined : { x: ["-120%", "320%"] }}
            transition={{ duration: 3.2, repeat: Infinity, repeatDelay: 1.4, ease: "easeInOut" }}
          />
          <p className="relative text-slate-600">{portfolioData.about.intro}</p>
        </FadeInUp>

        <div className="grid gap-4 md:grid-cols-3">
          {portfolioData.about.stats.map((item, index) => (
            <FadeInUp key={item.label} delay={index * 0.08}>
              <HoverCard className="relative overflow-hidden p-6">
                <motion.div
                  className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-blue-300/20 blur-2xl"
                  animate={prefersReducedMotion ? undefined : { scale: [1, 1.25, 1], opacity: [0.25, 0.45, 0.25] }}
                  transition={{ duration: 2.6, repeat: Infinity, delay: index * 0.15 }}
                />
                <p className="text-sm font-medium text-slate-500">{item.label}</p>
                <motion.p
                  className="mt-2 text-3xl font-bold text-slate-900"
                  animate={prefersReducedMotion ? undefined : { scale: [1, 1.04, 1], y: [0, -2, 0] }}
                  transition={{ duration: 1.8, repeat: Infinity, delay: index * 0.2 }}
                >
                  {item.value}
                </motion.p>
              </HoverCard>
            </FadeInUp>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
