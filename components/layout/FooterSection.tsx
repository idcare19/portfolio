"use client";

import { AnimatedSection } from "@/components/effects/AnimatedSection";
import { trackClientEvent } from "@/components/site/AnalyticsTracker";
import { useSiteDataContext } from "@/components/site/SiteDataProvider";
import { Badge } from "@/components/ui/Badge";
import { ChevronUp, Github, Linkedin, Mail, Sparkles } from "lucide-react";

export function FooterSection() {
  const portfolioData = useSiteDataContext();
  const footerSection = portfolioData.sections?.footer;
  const footer = footerSection?.data as Record<string, string> | undefined;
  if (footerSection?.enabled === false || footerSection?.showOnHomepage === false) return null;
  const socials = Array.isArray(portfolioData.socials) ? portfolioData.socials.filter((item) => item && item.isEnabled !== false) : [];

  const footerBrandText = String(footer?.brandText || portfolioData.owner.username || "");
  const footerIntro = String(footer?.intro || "");
  const footerAvailability = String(footer?.availability || "");
  const navLabel = String(footer?.navigationLabel || "");
  const socialsLabel = String(footer?.socialsLabel || "");
  const backToTop = String(footer?.backToTopLabel || "");
  const currentAvailabilityLabel = String(footer?.currentAvailabilityLabel || "");
  const quickLinks = Array.isArray(footer?.quickLinks) ? footer.quickLinks : [];
  return (
    <AnimatedSection id="footer" className="border-t border-[rgb(var(--border))] bg-[linear-gradient(180deg,rgba(248,250,252,1),rgba(255,255,255,1))] py-12">
      <div className="section-wrap">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-[#EFF6FF] p-3 text-[#1D4ED8]">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                {footerBrandText ? <p className="text-lg font-semibold text-text-main">{footerBrandText}</p> : null}
                {footerIntro ? <p className="text-sm text-text-muted">{footerIntro}</p> : null}
              </div>
            </div>
            {footer?.copyrightText ? <p className="max-w-xl text-sm leading-7 text-text-muted">{footer.copyrightText}</p> : null}
            {footerAvailability ? <Badge className="w-fit">{footerAvailability}</Badge> : null}
          </div>

          <div>
            {navLabel ? <p className="text-xs font-semibold uppercase tracking-[0.22em] text-text-muted">{navLabel}</p> : null}
            <div className="mt-4 grid gap-2 text-sm text-text-muted">
              {quickLinks.map((item: { label: string; href: string }) => (
                <a key={`${item.label}-${item.href}`} href={item.href} className="hover:text-primary">
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          <div>
            {socialsLabel ? <p className="text-xs font-semibold uppercase tracking-[0.22em] text-text-muted">{socialsLabel}</p> : null}
            <div className="mt-4 flex flex-wrap items-center gap-3">
              {socials.map((social) => (
                <a
                  key={`${social.label}-${social.href}`}
                  href={social.href}
                  onClick={() => trackClientEvent(`${social.label.toLowerCase()}-click`, { targetType: "social", targetSlug: social.label.toLowerCase() })}
                  className="rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--card-bg))] p-2.5 text-text-muted transition hover:border-primary/40 hover:text-primary"
                  aria-label={social.label}
                >
                  {social.label.toLowerCase() === "github" ? <Github className="h-4 w-4" /> : social.label.toLowerCase() === "linkedin" ? <Linkedin className="h-4 w-4" /> : <Mail className="h-4 w-4" />}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-4 border-t border-[rgb(var(--border))] pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-text-muted">{currentAvailabilityLabel}</p>
          <div className="flex items-center gap-3">
              <a href="#home" className="inline-flex items-center gap-2 rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--card-bg))] px-4 py-2 text-sm font-semibold text-text-main">
              {backToTop} <ChevronUp className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
