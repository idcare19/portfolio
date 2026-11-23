
"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown, ArrowUpRight } from "lucide-react";

import { AnimatedSection } from "@/components/effects/AnimatedSection";
import { TypewriterLines } from "@/components/effects/TypewriterLines";
import {
  useSectionData,
  useSiteDataContext,
} from "@/components/site/SiteDataProvider";
import { Button } from "@/components/ui/Button";
import { useTheme } from "@/components/site/ThemeProvider";

import NeuralBrain from "@/src/components/3d/NeuralBrain";

export function HeroSection() {
  const portfolioData = useSiteDataContext();
  const section = useSectionData("hero");
  const aboutSection = useSectionData("about");
  const reduceMotion = useReducedMotion();
  const { isDark } = useTheme();

  const heroData = section.data as Record<string, any>;

  const stats = Array.isArray(aboutSection.items)
    ? aboutSection.items
    : [];

  const badges = Array.isArray(heroData.badges)
    ? heroData.badges
    : [];

  const resumeUrl = String(
    heroData.resumeUrl || portfolioData.owner?.resumeUrl || ""
  ).trim();

  const hasResume = Boolean(resumeUrl && resumeUrl !== "#");

  const title = String(heroData.title || "Hi, I'm Abhishek");

  const description = String(
    heroData.description || portfolioData.owner?.tagline || ""
  );

  const eyebrow = String(
    heroData.eyebrow || portfolioData.owner?.identityLine || ""
  );

  const animatedRole = String(
    heroData.animatedRole || portfolioData.owner?.role || ""
  );

  return (
    <AnimatedSection
      id="hero"
      className="relative isolate overflow-hidden bg-section-bg pb-20 pt-32 sm:pb-28 sm:pt-40"
    >
      <div className="section-wrap">
        <div className="grid items-center gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10">

          {/* LEFT CONTENT */}
          <div className="relative z-10">

            {/* EYEBROW */}
            {eyebrow && (
              <motion.div
                initial={reduceMotion ? false : { opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-7 inline-flex items-center gap-2 rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--card-bg))] px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-text-muted shadow-sm"
              >
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                {eyebrow}
              </motion.div>
            )}

            {/* TITLE */}
            <motion.h1
              initial={reduceMotion ? false : { opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl text-5xl font-bold leading-[1.05] tracking-[-0.055em] text-text-main sm:text-6xl lg:text-[76px]"
            >
              {title}

              {animatedRole && (
                <span className="mt-4 block min-h-[1.15em] text-gradient-animated">
                  <TypewriterLines
                    text={animatedRole}
                    typeSpeedMs={80}
                    holdMs={1800}
                  />
                </span>
              )}
            </motion.h1>

            {/* DESCRIPTION */}
            {description && (
              <motion.p
                initial={reduceMotion ? false : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="mt-8 max-w-2xl text-base leading-8 text-text-muted sm:text-lg"
              >
                {description}
              </motion.p>
            )}

            {/* ACTIONS */}
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.35 }}
              className="mt-10 flex flex-col gap-4 sm:flex-row"
            >
              <Button
                href={heroData.primaryCtaHref || "#projects"}
                className="group w-full sm:w-auto"
              >
                View My Work
                <ArrowUpRight className="ml-2 inline-block h-4 w-4 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
              </Button>

              {hasResume && (
                <Button
                  href={resumeUrl}
                  variant="secondary"
                  target="_blank"
                  download
                  className="w-full sm:w-auto"
                >
                  Download Resume
                </Button>
              )}
            </motion.div>

            {/* BADGES */}
            {badges.length > 0 && (
              <div className="mt-10 flex flex-wrap gap-2">
                {badges.map((badge: string, index: number) => (
                  <motion.span
                    key={badge}
                    initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.08 }}
                    className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card-bg))] px-4 py-2 text-xs font-medium text-text-muted transition-all hover:-translate-y-1 hover:border-primary/40 hover:text-text-main"
                  >
                    {badge}
                  </motion.span>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT VISUAL — NEURAL BRAIN */}
          <div className="relative mx-auto flex aspect-square w-full max-w-[560px] items-center justify-center lg:scale-110">
            {/* Subtle solid geometric accent ring */}
            <div className="pointer-events-none absolute inset-[8%] rounded-full border border-[rgb(var(--border))]/60" />

            {/* Brain renderer */}
            <div className="relative z-10 h-full w-full">
              <NeuralBrain
                className="h-full w-full"
                brainScale={1.15}
                nodeSize={isDark ? 0.55 : 0.65}
                nodeBrightness={isDark ? 1.08 : 0.85}
                lineBrightness={isDark ? 0.55 : 0.45}
                lineWidth={isDark ? 0.6 : 0.75}
                pulseColor={isDark ? "#F4F6F8" : "#2869C7"}
                backgroundColor="transparent"
                particleColor={isDark ? "#A6B0BE" : "#758296"}
                autoRotation
                autoRotationSpeed={0.03}
                pulseEnabled
                pulseSpeed={1}
                backgroundParticleCount={isDark ? 36 : 28}
              />
            </div>

            {/* Floating label 1 */}
            <div className="pointer-events-none absolute right-[2%] top-[18%] z-20 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card-bg))] px-3.5 py-2 shadow-sm">
              <span className="text-xs font-semibold tracking-wider text-primary">
                AI & TECHNOLOGY
              </span>
            </div>

            {/* Floating label 2 */}
            <div className="pointer-events-none absolute bottom-[17%] left-[0%] z-20 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card-bg))] px-3.5 py-2 shadow-sm">
              <span className="text-xs font-semibold tracking-wider text-text-main">
                CREATIVE ENGINEERING
              </span>
            </div>
          </div>
        </div>

        {/* STATS */}
        {stats.length > 0 && (
          <div className="mt-20 grid gap-4 border-t border-[rgb(var(--border))] pt-8 sm:grid-cols-3">
            {stats.map(
              (stat: { label: string; value: string }, index: number) => (
                <motion.div
                  key={stat.label}
                  initial={reduceMotion ? false : { opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group rounded-2xl p-5 transition-colors hover:bg-[rgb(var(--card-hover))]"
                >
                  <p className="text-4xl font-bold tracking-tight text-text-main">
                    {stat.value}
                  </p>

                  <p className="mt-2 text-sm text-text-muted">
                    {stat.label}
                  </p>
                </motion.div>
              )
            )}
          </div>
        )}

        {/* SCROLL INDICATOR */}
        <div className="mt-12 flex justify-center">
          <a
            href="#about"
            aria-label="Scroll to about section"
            className="group flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-text-muted transition hover:text-primary"
          >
            Explore More
            <ArrowDown className="h-4 w-4 animate-bounce" />
          </a>
        </div>
      </div>
    </AnimatedSection>
  );
}
