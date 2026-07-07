"use client";

import { AnimatedSection } from "@/components/effects/AnimatedSection";
import { HoverCard } from "@/components/effects/HoverCard";
import { useSectionData } from "@/components/site/SiteDataProvider";
import { Badge } from "@/components/ui/Badge";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ArrowRight, Sparkles, Users, Zap } from "lucide-react";

export function AboutSection() {
  const section = useSectionData("about");
  const data = section.data as Record<string, any>;
  const stats = Array.isArray(section.items) ? section.items : [];
  const hasHeader = Boolean(data.eyebrow || data.title || data.description);
  const intro = String(data.intro || "");

  return (
    <AnimatedSection id="about" className="bg-[linear-gradient(180deg,rgba(255,255,255,1),rgba(248,250,252,1))] py-24">
      <div className="section-wrap">
        {hasHeader ? <SectionHeader eyebrow={data.eyebrow} title={data.title} description={data.description} /> : null}

        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="panel relative overflow-hidden p-7 sm:p-8">
            <div className="hero-blob right-[-2rem] top-[-1rem] h-40 w-40 bg-primary/10 blur-3xl" />
            <div className="relative">
              <Badge className="mb-5">About this work</Badge>
              <p className="max-w-3xl text-lg leading-8 text-text-main sm:text-xl">{intro}</p>
              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {stats.slice(0, 3).map((item: any) => (
                  <div key={item.label} className="rounded-[24px] border border-[rgb(var(--border))] bg-[rgb(var(--card-bg))] p-4 shadow-[0_12px_26px_rgba(15,23,42,0.05)]">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">{item.label}</p>
                    <p className="mt-3 text-3xl font-semibold tracking-tight text-text-main">{item.value}</p>
                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[rgb(var(--card-hover))]">
                      <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-primary to-secondary" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-[30px] border border-[rgb(var(--border))] bg-[linear-gradient(135deg,rgba(239,246,255,0.92),rgba(255,255,255,0.96))] p-6 shadow-[0_18px_42px_rgba(15,23,42,0.06)]">
              <div className="flex items-center gap-2 text-sm font-semibold text-text-main">
                <Sparkles className="h-4 w-4 text-primary" />
                Highlights
              </div>
              <div className="mt-5 grid gap-3">
                {["Product-led thinking", "CMS-first content", "Premium interface details"].map((item) => (
                  <div key={item} className="flex items-center justify-between rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card-bg))] px-4 py-3 text-sm text-text-main">
                    <span>{item}</span>
                    <ArrowRight className="h-4 w-4 text-primary" />
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[30px] border border-[rgb(var(--border))] bg-[rgb(var(--card-bg))] p-6 shadow-[0_18px_42px_rgba(15,23,42,0.06)]">
              <div className="flex items-center gap-2 text-sm font-semibold text-text-main">
                <Zap className="h-4 w-4 text-primary" />
                Journey preview
              </div>
              <div className="mt-5 space-y-4">
                {stats.slice(0, 3).map((item: any, index) => (
                  <div key={`${item.label}-${index}`} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <span className="h-3 w-3 rounded-full bg-primary" />
                      {index < 2 ? <span className="mt-1 h-full w-px flex-1 bg-[rgb(var(--border))]" /> : null}
                    </div>
                    <div className="pb-3">
                      <p className="text-sm font-semibold text-text-main">{item.label}</p>
                      <p className="mt-1 text-sm text-text-muted">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
