"use client";

import { FadeInUp } from "@/components/effects/FadeInUp";
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

  return (
    <section id="home" ref={ref} className="relative overflow-hidden pt-28 sm:pt-32">
      <motion.div style={{ y: parallaxA }} className="hero-blob -left-20 top-24 -z-10 h-56 w-56 bg-blue-300/40" />
      <motion.div style={{ y: parallaxB }} className="hero-blob -right-16 top-10 -z-10 h-64 w-64 bg-cyan-300/40" />
      <motion.div style={{ y: parallaxA }} className="hero-blob bottom-12 left-1/3 -z-10 h-44 w-44 bg-violet-300/30" />

      <div className="section-wrap pb-20">
        <div className="mx-auto max-w-4xl text-center">
          <FadeInUp immediate>
            <p className="mb-4 inline-flex rounded-full border border-blue-200 bg-blue-50/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-blue-700">
              {portfolioData.owner.identityLine}
            </p>
          </FadeInUp>
          <FadeInUp delay={0.06} immediate>
            <h1 className="text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-6xl lg:text-7xl">
              <span className="block">{`Hi, I'm ${portfolioData.owner.name}`}</span>
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
            <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-lg">{portfolioData.owner.tagline}</p>
          </FadeInUp>

          <FadeInUp delay={0.18}>
            <motion.div
              className="mt-8 flex flex-wrap justify-center gap-3"
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
            <div className="mt-8 flex flex-wrap justify-center gap-2">
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
            <div className="mx-auto mt-7 grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3">
              {portfolioData.about.stats.map((stat) => (
                <div key={stat.label} className="panel p-3 text-center">
                  <p className="text-xl font-bold text-slate-900">{stat.value}</p>
                  <p className="text-xs text-slate-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </FadeInUp>

          <motion.div
            className="mt-10 hidden items-center justify-center gap-3 text-xs text-slate-500 md:flex"
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

      </div>
    </section>
  );
}
