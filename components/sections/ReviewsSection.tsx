"use client";

import { AnimatedSection } from "@/components/effects/AnimatedSection";
import { FadeInUp } from "@/components/effects/FadeInUp";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { portfolioData } from "@/data/portfolio";
import { useIsMobile } from "@/lib/use-is-mobile";
import { motion, useReducedMotion } from "framer-motion";
import { Code2, ExternalLink, Quote } from "lucide-react";
import Link from "next/link";

export function ReviewsSection() {
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const lightweightMode = prefersReducedMotion || isMobile;

  return (
    <AnimatedSection id="reviews" className="py-20">
      <div className="section-wrap">
        <SectionHeader
          eyebrow="Client Reviews"
          title="What clients say"
          description="Feedback from recent portfolio projects delivered for clients."
        />

        <div className="grid gap-5 md:grid-cols-2">
          {portfolioData.reviews.map((review, index) => (
            <FadeInUp key={review.clientName} delay={index * 0.08}>
              <motion.article
                className="glass relative overflow-hidden rounded-3xl border border-white/80 p-6 shadow-[0_12px_34px_rgba(15,23,42,0.08)]"
                whileHover={lightweightMode ? undefined : { y: -6 }}
                transition={{ type: "spring", stiffness: 220, damping: 18 }}
              >
                <motion.div
                  className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-white/45 to-transparent"
                  animate={lightweightMode ? undefined : { x: ["-120%", "320%"] }}
                  transition={{ duration: 3, repeat: Infinity, repeatDelay: 1.2, ease: "easeInOut" }}
                />

                <Quote className="h-5 w-5 text-blue-600" />
                <p className="mt-3 text-sm leading-relaxed text-slate-600">"{review.quote}"</p>

                <div className="mt-5 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
                  <p className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-white">
                      <Code2 className="h-3.5 w-3.5" />
                    </span>
                    {review.clientName}
                  </p>
                  <Link
                    href={review.website}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex w-full items-center justify-center gap-1.5 rounded-full border border-blue-300 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 transition-all duration-500 hover:scale-105 hover:border-blue-500 hover:bg-blue-100 sm:w-auto"
                  >
                    Visit Site <ExternalLink className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </motion.article>
            </FadeInUp>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
