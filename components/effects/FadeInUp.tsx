"use client";

import { ScrollReveal } from "@/components/effects/ScrollReveal";

type FadeInUpProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  immediate?: boolean;
};

export function FadeInUp({ children, className, delay, immediate = false }: FadeInUpProps) {
  return (
    <ScrollReveal className={className} delay={delay} y={24} immediate={immediate}>
      {children}
    </ScrollReveal>
  );
}
