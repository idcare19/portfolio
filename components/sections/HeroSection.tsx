
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

import NeuralBrain from "@/src/components/3d/NeuralBrain";

export function HeroSection() {
  const portfolioData = useSiteDataContext();
  const section = useSectionData("hero");
  const aboutSection = useSectionData("about");
  const reduceMotion = useReducedMotion();

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
      {/* BACKGROUND */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-blue-500/[0.07] blur-[120px]" />

        <div className="absolute right-[-10%] top-[15%] h-[300px] w-[300px] rounded-full bg-violet-500/[0.08] blur-[100px]" />

        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgb(100 116 139) 1px, transparent 1px), linear-gradient(90deg, rgb(100 116 139) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

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
                className="mb-7 inline-flex items-center gap-2 rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--card-bg))]/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-text-muted shadow-sm backdrop-blur-xl"
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
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative mx-auto flex aspect-square w-full max-w-[560px] items-center justify-center lg:scale-110"
          >
            {/* Ambient glow */}
            <div className="pointer-events-none absolute inset-[5%] rounded-full bg-blue-500/[0.08] blur-[80px]" />

            <div className="pointer-events-none absolute inset-[8%] rounded-full border border-blue-500/20" />

            <div className="pointer-events-none absolute inset-[16%] animate-spin rounded-full border border-dashed border-violet-500/25 [animation-duration:45s]" />

            <div className="pointer-events-none absolute inset-[24%] rounded-full border border-white/[0.08]" />

            {/* Brain renderer */}
            <div className="relative z-10 h-full w-full">
              <NeuralBrain
                className="h-full w-full"
                brainScale={1.15}
                nodeSize={0.55}
                nodeBrightness={1.08}
                lineBrightness={0.55}
                lineWidth={0.6}
                pulseColor="#FFFFFF"
                backgroundColor="transparent"
                particleColor="#D9DEE8"
                autoRotation
                autoRotationSpeed={0.03}
                pulseEnabled
                pulseSpeed={1}
                backgroundParticleCount={44}
              />
            </div>

            {/* Floating label 1 */}
            <motion.div
              animate={
                reduceMotion
                  ? undefined
                  : { y: [0, -10, 0] }
              }
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="pointer-events-none absolute right-[2%] top-[18%] z-20 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card-bg))]/80 px-4 py-3 shadow-xl backdrop-blur-xl"
            >
              <span className="text-xs font-semibold tracking-wider text-primary">
                AI & TECHNOLOGY
              </span>
            </motion.div>

            {/* Floating label 2 */}
            <motion.div
              animate={
                reduceMotion
                  ? undefined
                  : { y: [0, 10, 0] }
              }
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="pointer-events-none absolute bottom-[17%] left-[0%] z-20 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card-bg))]/80 px-4 py-3 shadow-xl backdrop-blur-xl"
            >
              <span className="text-xs font-semibold tracking-wider text-text-main">
                CREATIVE ENGINEERING
              </span>
            </motion.div>
          </motion.div>
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
