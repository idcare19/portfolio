"use client";

import { FadeInUp } from "@/components/effects/FadeInUp";
import { useSectionData, useSiteDataContext } from "@/components/site/SiteDataProvider";
import { TypewriterLines } from "@/components/effects/TypewriterLines";
import { Button } from "@/components/ui/Button";

export function HeroSection() {
  const portfolioData = useSiteDataContext();
  const section = useSectionData("hero");
  const heroData = section.data as Record<string, any>;
  const stats = Array.isArray(heroData.stats) ? heroData.stats : [];
  const badges = Array.isArray(heroData.badges) ? heroData.badges : [];
  const resumeUrl = String(heroData.resumeUrl || portfolioData.owner?.resumeUrl || "").trim();
  const hasResume = Boolean(resumeUrl && resumeUrl !== "#");
  if (process.env.NODE_ENV !== "production") {
    console.debug("[section:hero]", { eyebrow: heroData.eyebrow, title: heroData.title, description: heroData.description });
  }

  return (
    <section id="home" className="relative overflow-hidden bg-section-bg pt-32 sm:pt-36 pb-24">
      {/* Removed blobs that were causing washed out colors */}

      <div className="section-wrap">
        <div className="mx-auto max-w-5xl text-center">
          <FadeInUp immediate>
            {heroData.eyebrow ? <p className="mb-4 inline-flex rounded-full border border-[#BFDBFE] bg-[#EFF6FF] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#1D4ED8]">{heroData.eyebrow}</p> : null}
          </FadeInUp>
          <FadeInUp delay={0.06} immediate>
            <h1 className="text-4xl font-bold leading-[1.1] tracking-tight text-text-main sm:text-6xl lg:text-7xl">
              {heroData.title ? <span className="block">{heroData.title}</span> : null}
              {heroData.animatedRole ? <TypewriterLines text={heroData.animatedRole} className="text-gradient-animated mt-4 inline-block align-top" typeSpeedMs={80} holdMs={1800} /> : null}
            </h1>
          </FadeInUp>
          <FadeInUp delay={0.12} immediate>
            {heroData.description ? <p className="mx-auto mt-6 max-w-3xl text-sm leading-relaxed text-text-muted sm:text-lg md:text-xl">{heroData.description}</p> : null}
          </FadeInUp>

          <FadeInUp delay={0.18}>
            <div className="mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap">
              <Button href={heroData.primaryCtaHref || "#projects"} className="w-full sm:w-auto">
                View Projects
              </Button>
              {hasResume ? (
                <Button href={resumeUrl} variant="secondary" target="_blank" download className="w-full sm:w-auto">
                  Download Resume
                </Button>
              ) : null}
            </div>
          </FadeInUp>

          <FadeInUp delay={0.24}>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              {badges.map((badge: string) => (
                <span
                  key={badge}
                  className="rounded-full border border-[rgb(var(--border))] bg-white px-4 py-2 text-xs font-medium text-text-main transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[rgb(var(--card-hover))]"
                >
                  {badge}
                </span>
              ))}
            </div>
          </FadeInUp>

          <FadeInUp delay={0.28}>
            <div className="mx-auto mt-16 grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
              {stats.map((stat: { label: string; value: string }) => (
                <div key={stat.label} className="panel p-6 text-center">
                  <p className="text-3xl font-bold text-text-main">{stat.value}</p>
                  <p className="mt-2 text-sm text-text-muted">{stat.label}</p>
                </div>
              ))}
            </div>
          </FadeInUp>

          <FadeInUp delay={0.32} className="mt-10 hidden items-center justify-center gap-3 text-xs md:flex">
            <span className="text-text-muted">
              <span>Scroll</span>
              <span className="relative inline-flex h-6 w-4 items-start rounded-full border border-[rgb(var(--border))] p-1">
                <span className="animate-scroll-dot h-1.5 w-1.5 rounded-full bg-primary" />
              </span>
            </span>
          </FadeInUp>
        </div>

      </div>
    </section>
  );
}
