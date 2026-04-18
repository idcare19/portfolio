"use client";

import { FadeInUp } from "@/components/effects/FadeInUp";
import { SplitText } from "@/components/effects/SplitText";
import { Button } from "@/components/ui/Button";
import { portfolioData } from "@/data/portfolio";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export function HeroSection() {
  const ref = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const prefersReducedMotion = useReducedMotion();
  const parallaxA = useTransform(scrollYProgress, [0, 1], [0, prefersReducedMotion ? 0 : -80]);
  const parallaxB = useTransform(scrollYProgress, [0, 1], [0, prefersReducedMotion ? 0 : 100]);
  const codeLines = [
    "const portfolio = createPremiumExperience();",
    "portfolio.addAnimation('smooth-fade-up');",
    "portfolio.optimize({ performance: 'high' });",
    "deploy('vercel');",
    "portfolio.monitor('core-web-vitals');",
  ];

  return (
    <section id="home" ref={ref} className="relative overflow-hidden pt-28 sm:pt-32">
      <motion.div style={{ y: parallaxA }} className="hero-blob -left-20 top-24 -z-10 h-56 w-56 bg-blue-300/40" />
      <motion.div style={{ y: parallaxB }} className="hero-blob -right-16 top-10 -z-10 h-64 w-64 bg-cyan-300/40" />
      <motion.div style={{ y: parallaxA }} className="hero-blob bottom-12 left-1/3 -z-10 h-44 w-44 bg-violet-300/30" />

      <div className="section-wrap grid items-center gap-10 pb-20 lg:grid-cols-[1.08fr_0.92fr]">
        <div>
          <FadeInUp immediate>
            <p className="mb-4 inline-flex rounded-full border border-blue-200 bg-blue-50/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-blue-700">
              {portfolioData.owner.identityLine}
            </p>
          </FadeInUp>
          <FadeInUp delay={0.06} immediate>
            <h1 className="text-3xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              <SplitText text={`Hi, I'm ${portfolioData.owner.name}`} className="block" />
              <motion.span
                className="text-gradient-animated mt-2 block"
                initial={false}
                animate={prefersReducedMotion ? undefined : { y: [12, 0], opacity: [0.96, 1] }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.26 }}
              >
                {portfolioData.owner.role}
              </motion.span>
            </h1>
          </FadeInUp>
          <FadeInUp delay={0.12} immediate>
            <p className="mt-6 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-lg">{portfolioData.owner.tagline}</p>
          </FadeInUp>

          <FadeInUp delay={0.18}>
            <motion.div
              className="mt-8 flex flex-wrap gap-3"
              animate={prefersReducedMotion ? undefined : { y: [0, -2, 0] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
            >
              <Button href="#projects">View Projects</Button>
              <Button href="#contact" variant="ghost">
                Contact Me
              </Button>
            </motion.div>
          </FadeInUp>

          <FadeInUp delay={0.24}>
            <div className="mt-8 flex flex-wrap gap-2">
              {portfolioData.owner.badges.map((badge) => (
                <motion.span
                  key={badge}
                  className="rounded-full border border-blue-200 bg-blue-50/80 px-3 py-1 text-xs font-medium text-blue-800"
                  animate={
                    prefersReducedMotion
                      ? undefined
                      : {
                          y: [0, -3, 0],
                          boxShadow: [
                            "0 0 0 rgba(59,130,246,0)",
                            "0 8px 16px rgba(59,130,246,0.15)",
                            "0 0 0 rgba(59,130,246,0)",
                          ],
                        }
                  }
                  transition={{ duration: 2.2, repeat: Infinity }}
                >
                  {badge}
                </motion.span>
              ))}
            </div>
          </FadeInUp>

          <FadeInUp delay={0.28}>
            <div className="mt-7 grid max-w-xl grid-cols-1 gap-3 sm:grid-cols-3">
              {portfolioData.about.stats.map((stat) => (
                <div key={stat.label} className="panel p-3 text-center">
                  <p className="text-xl font-bold text-slate-900">{stat.value}</p>
                  <p className="text-xs text-slate-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </FadeInUp>

          <motion.div
            className="mt-10 hidden items-center gap-3 text-xs text-slate-500 md:flex"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55 }}
          >
            <span>Scroll</span>
            <span className="relative inline-flex h-6 w-4 items-start rounded-full border border-slate-400 p-1">
              <motion.span
                className="h-1.5 w-1.5 rounded-full bg-slate-500"
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 1.4, repeat: Infinity }}
              />
            </span>
          </motion.div>
        </div>

        <FadeInUp delay={0.18} className="mx-auto w-full max-w-sm sm:max-w-md">
          <motion.div
            animate={prefersReducedMotion ? undefined : { y: [0, -10, 0] }}
            transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
            whileHover={{ rotate: 1.2, y: -6 }}
            className="panel relative overflow-hidden p-4"
          >
            <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-blue-400/25 blur-2xl" />
            <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-cyan-300/25 blur-2xl" />

            <div className="relative h-[360px] w-full overflow-hidden rounded-2xl border border-slate-200/80 bg-gradient-to-b from-slate-900 to-slate-800 p-3 shadow-inner sm:h-[420px] sm:p-4">
              <motion.div
                className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-blue-400/20"
                animate={prefersReducedMotion ? undefined : { rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              />
              <motion.div
                className="absolute -bottom-12 -left-10 h-40 w-40 rounded-full bg-cyan-400/20"
                animate={prefersReducedMotion ? undefined : { rotate: -360 }}
                transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
              />

              <div className="relative z-10 rounded-xl border border-slate-600/60 bg-slate-900/80 p-4 backdrop-blur-sm">
                <div className="mb-4 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                  </div>
                  <motion.span
                    className="rounded-full border border-cyan-300/40 bg-cyan-300/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-cyan-200"
                    animate={prefersReducedMotion ? undefined : { opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.6, repeat: Infinity }}
                  >
                    Live Build
                  </motion.span>
                </div>

                {codeLines.map((line, index) => (
                  <motion.p
                    key={`${line}-${index}`}
                    className="mb-2 flex items-start gap-2 font-mono text-[11px] text-slate-200 sm:text-xs"
                    initial={{ opacity: 0.35 }}
                    animate={prefersReducedMotion ? undefined : { opacity: [0.35, 1, 0.35] }}
                    transition={{ duration: 2.6, repeat: Infinity, delay: index * 0.35 }}
                  >
                    <span className="w-5 text-right text-slate-500">{String(index + 1).padStart(2, "0")}</span>
                    <span className={`break-all ${index === codeLines.length - 1 ? "text-cyan-200" : "text-slate-200"}`}>{line}</span>
                    {index === codeLines.length - 1 ? (
                      <motion.span
                        className="inline-block h-3 w-px bg-cyan-300"
                        animate={prefersReducedMotion ? undefined : { opacity: [0, 1, 0] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      />
                    ) : null}
                  </motion.p>
                ))}
              </div>

              <motion.div
                className="absolute bottom-4 left-4 right-4 h-1.5 overflow-hidden rounded-full bg-slate-700"
                initial={{ opacity: 0.8 }}
              >
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-blue-400 via-cyan-300 to-violet-400"
                  animate={prefersReducedMotion ? undefined : { x: ["-100%", "100%"] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                />
              </motion.div>
            </div>

            {portfolioData.heroTech.map((tech, index) => (
              <motion.span
                key={tech}
                className="absolute hidden rounded-full border border-slate-200 bg-white/90 px-2.5 py-1 text-[10px] font-semibold text-slate-700 sm:inline-flex"
                style={{
                  top: `${12 + (index % 3) * 26}%`,
                  left: `${index % 2 === 0 ? 6 : 68}%`,
                }}
                animate={prefersReducedMotion ? undefined : { y: [0, -6, 0] }}
                transition={{ duration: 2.2, repeat: Infinity, delay: index * 0.15 }}
              >
                {tech}
              </motion.span>
            ))}
          </motion.div>
        </FadeInUp>
      </div>
    </section>
  );
}
