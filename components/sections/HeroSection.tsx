"use client";

import { FadeInUp } from "@/components/effects/FadeInUp";
import { TypewriterLines } from "@/components/effects/TypewriterLines";
import { Button } from "@/components/ui/Button";
import { portfolioData } from "@/data/portfolio";

export function HeroSection() {
  return (
    <section id="home" className="relative overflow-hidden pt-28 sm:pt-32">
      <div className="hero-blob animate-float-gentle -left-20 top-24 -z-10 hidden h-52 w-52 bg-blue-200/35 sm:block" />
      <div className="hero-blob animate-float-gentle-reverse -right-16 top-10 -z-10 hidden h-60 w-60 bg-cyan-200/35 sm:block" />

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
              <TypewriterLines
                lines={["Full Stack Developer", "Nest JS Developer"]}
                className="text-gradient-animated mt-2 inline-block align-top"
              />
            </h1>
          </FadeInUp>
          <FadeInUp delay={0.12} immediate>
            <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-lg">{portfolioData.owner.tagline}</p>
          </FadeInUp>

          <FadeInUp delay={0.18}>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button href="#projects">View Projects</Button>
              <Button href="#contact" variant="ghost">
                Contact Me
              </Button>
            </div>
          </FadeInUp>

          <FadeInUp delay={0.24}>
            <div className="mt-8 flex flex-wrap justify-center gap-2">
              {portfolioData.owner.badges.map((badge) => (
                <span
                  key={badge}
                  className="rounded-full border border-blue-200 bg-blue-50/80 px-3 py-1 text-xs font-medium text-blue-800 transition-transform duration-200 hover:-translate-y-0.5"
                >
                  {badge}
                </span>
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

          <FadeInUp delay={0.32} className="mt-10 hidden items-center justify-center gap-3 text-xs text-slate-500 md:flex">
            <span>Scroll</span>
            <span className="relative inline-flex h-6 w-4 items-start rounded-full border border-slate-400 p-1">
              <span className="animate-scroll-dot h-1.5 w-1.5 rounded-full bg-slate-500" />
            </span>
          </FadeInUp>
        </div>

      </div>
    </section>
  );
}
