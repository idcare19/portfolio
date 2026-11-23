
"use client";

import { useSiteDataContext } from "@/components/site/SiteDataProvider";
import { trackClientEvent } from "@/components/site/AnalyticsTracker";
import { Badge } from "@/components/ui/Badge";
import {
  ArrowUpRight,
  ArrowUp,
  Github,
  Linkedin,
  Mail,
  Globe,
  Sparkles,
  MoveUpRight,
} from "lucide-react";

type QuickLink = {
  label?: string;
  href?: string;
};

const getSocialIcon = (label: string) => {
  const value = label.toLowerCase();

  if (value.includes("github")) return Github;
  if (value.includes("linkedin")) return Linkedin;
  if (value.includes("mail") || value.includes("email")) return Mail;

  return Globe;
};

export function FooterSection() {
  const portfolioData = useSiteDataContext();

  const footerSection = portfolioData.sections?.footer;
  const footer = footerSection?.data as Record<string, any> | undefined;

  if (
    footerSection?.enabled === false ||
    footerSection?.showOnHomepage === false
  ) {
    return null;
  }

  const socials = Array.isArray(portfolioData.socials)
    ? portfolioData.socials.filter(
        (item) => item && item.isEnabled !== false,
      )
    : [];

  const footerBrandText = String(
    footer?.brandText || portfolioData.owner.username || "",
  );

  const footerIntro = String(footer?.intro || "");
  const footerAvailability = String(footer?.availability || "");
  const navLabel = String(footer?.navigationLabel || "");
  const socialsLabel = String(footer?.socialsLabel || "");
  const backToTop = String(footer?.backToTopLabel || "Back to top");

  const currentAvailabilityLabel = String(
    footer?.currentAvailabilityLabel || "",
  );

  const copyrightText = String(footer?.copyrightText || "");

  const quickLinks: QuickLink[] = Array.isArray(footer?.quickLinks)
    ? footer.quickLinks
    : [];

  const currentYear = new Date().getFullYear();

  return (
    <footer
      id="footer"
      className="relative isolate overflow-hidden border-t border-[rgb(var(--border))] bg-[rgb(var(--section-bg))] text-text-main transition-colors duration-300"
    >
      <div className="section-wrap relative py-16 sm:py-20 lg:py-24">
        {/* Top label */}
        <div className="mb-14 flex items-center justify-between gap-4 border-b border-[rgb(var(--border))] pb-6">
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.7)]" />
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-text-muted">
              End of page · Beginning of something new
            </span>
          </div>

          <span className="hidden text-[10px] font-semibold uppercase tracking-[0.2em] text-text-muted/60 sm:block">
            {String(currentYear)}
          </span>
        </div>

        {/* Main grid */}
        <div className="grid gap-14 lg:grid-cols-[1.5fr_0.7fr_0.7fr] lg:gap-12">
          {/* Brand */}
          <div className="max-w-xl">
            <a
              href="#home"
              aria-label="Back to homepage"
              className="group inline-flex items-center gap-3"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card-bg))] text-primary shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:border-primary/40 group-hover:bg-primary/10">
                <Sparkles className="h-5 w-5" />
              </span>

              <span className="text-2xl font-bold tracking-tight text-text-main">
                {footerBrandText || "Portfolio"}
                <span className="text-primary">.</span>
              </span>
            </a>

            {footerIntro ? (
              <p className="mt-7 max-w-md text-sm leading-8 text-text-muted sm:text-base">
                {footerIntro}
              </p>
            ) : null}

            {footerAvailability ? (
              <div className="mt-7">
                <Badge className="w-fit">{footerAvailability}</Badge>
              </div>
            ) : null}

            {copyrightText ? (
              <p className="mt-8 max-w-md text-xs leading-6 text-text-muted/70">
                {copyrightText}
              </p>
            ) : null}
          </div>

          {/* Navigation */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-text-muted">
              {navLabel || "Explore"}
            </p>

            <nav
              aria-label="Footer navigation"
              className="mt-7 flex flex-col items-start gap-4"
            >
              {quickLinks.map((item, index) => {
                if (!item?.label || !item?.href) return null;

                return (
                  <a
                    key={`${item.label}-${item.href}-${index}`}
                    href={item.href}
                    className="group inline-flex items-center gap-2 text-sm text-text-muted transition-all duration-300 hover:translate-x-1 hover:text-text-main"
                  >
                    <span>{item.label}</span>
                    <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:text-primary" />
                  </a>
                );
              })}
            </nav>
          </div>

          {/* Social links */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-text-muted">
              {socialsLabel || "Connect"}
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              {socials.map((social) => {
                const Icon = getSocialIcon(social.label || "website");

                return (
                  <a
                    key={`${social.label}-${social.href}`}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() =>
                      trackClientEvent(
                        `${String(social.label || "social").toLowerCase()}-click`,
                        {
                          targetType: "social",
                          targetSlug: String(
                            social.label || "social",
                          ).toLowerCase(),
                        },
                      )
                    }
                    aria-label={social.label}
                    title={social.label}
                    className="group flex h-12 w-12 items-center justify-center rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card-bg))] text-text-muted transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:bg-primary/10 hover:text-primary"
                  >
                    <Icon className="h-[18px] w-[18px] transition-transform duration-300 group-hover:scale-110" />
                  </a>
                );
              })}
            </div>

            {currentAvailabilityLabel ? (
              <p className="mt-7 max-w-xs text-sm leading-7 text-text-muted/80">
                {currentAvailabilityLabel}
              </p>
            ) : null}
          </div>
        </div>

        {/* Closing statement */}
        <div className="mt-20 border-y border-[rgb(var(--border))] py-10 sm:py-12">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.25em] text-primary">
                Keep building
              </p>

              <h2 className="max-w-2xl text-3xl font-bold leading-tight tracking-tight text-text-main sm:text-4xl lg:text-5xl">
                Ideas are just the
                <span className="text-text-muted/50"> beginning.</span>
              </h2>
            </div>

            <a
              href="#home"
              className="group inline-flex w-fit items-center gap-3 rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--card-bg))] px-5 py-3 text-xs font-semibold text-text-main shadow-sm transition-all duration-300 hover:border-primary/40 hover:bg-primary/10 hover:text-primary"
            >
              {backToTop}
              <MoveUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col gap-4 pt-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-white/35">
            © {currentYear} {footerBrandText || "Portfolio"}. All rights reserved.
          </p>

          <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/30">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Designed with intention
          </div>

          <a
            href="#home"
            aria-label="Scroll to top"
            className="group flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/50 transition-all duration-300 hover:-translate-y-1 hover:border-blue-400/40 hover:text-blue-300"
          >
            <ArrowUp className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-1" />
          </a>
        </div>
      </div>
    </footer>
  );
}
