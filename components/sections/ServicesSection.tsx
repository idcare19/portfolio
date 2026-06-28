"use client";

import type { ReactNode } from "react";
import { AnimatedSection } from "@/components/effects/AnimatedSection";
import { FadeInUp } from "@/components/effects/FadeInUp";
import { useSectionData } from "@/components/site/SiteDataProvider";
import { AnimatedCard } from "@/components/ui/AnimatedCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Wrench, Sparkles, Code2 } from "lucide-react";

const iconMap: Record<string, ReactNode> = {
  code: <Code2 className="h-5 w-5 text-primary" />,
  wrench: <Wrench className="h-5 w-5 text-primary" />,
  layout: <Sparkles className="h-5 w-5 text-primary" />,
};

export function ServicesSection() {
  const section = useSectionData("services");
  const data = section.data as Record<string, any>;
  const items = section.items as Array<{ id?: string; title: string; description: string; icon?: string }>;

  if (items.length === 0) {
    return null;
  }

  return (
    <AnimatedSection id="services" className="bg-section-bg py-20">
      <div className="section-wrap">
        <SectionHeader
          eyebrow={data.eyebrow}
          title={data.title}
          description={data.description}
        />

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item, index) => (
            <FadeInUp key={item.id || `${item.title}-${index}`} delay={index * 0.05}>
              <AnimatedCard className="h-full">
                <div className="inline-flex rounded-2xl border border-primary/15 bg-primary/10 p-3">
                  {iconMap[item.icon || ""] || <Sparkles className="h-5 w-5 text-primary" />}
                </div>
                <h3 className="mt-5 text-xl font-semibold text-text-main">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-text-muted">{item.description}</p>
              </AnimatedCard>
            </FadeInUp>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
