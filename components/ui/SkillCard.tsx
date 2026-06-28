"use client";

import { FadeInUp } from "@/components/effects/FadeInUp";

type SkillCardProps = {
  title: string;
  items: string[];
  delay?: number;
};

export function SkillCard({ title, items, delay = 0 }: SkillCardProps) {
  return (
    <FadeInUp delay={delay} className="glass rounded-3xl p-6 shadow-[0_10px_24px_rgba(15,23,42,0.05)]">
      <h3 className="mb-4 text-lg font-semibold text-text-main">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <span
            key={item}
            className="rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--page-bg))] px-3 py-1 text-xs font-medium text-text-muted transition-colors duration-200 hover:border-primary/30 hover:bg-primary/8 hover:text-primary"
          >
            {item}
          </span>
        ))}
      </div>
    </FadeInUp>
  );
}
