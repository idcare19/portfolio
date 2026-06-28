"use client";

import { trackClientEvent } from "@/components/site/AnalyticsTracker";
import { useSiteDataContext } from "@/components/site/SiteDataProvider";
import { ChevronUp, Github, Linkedin, Mail } from "lucide-react";

export function FooterSection() {
  const portfolioData = useSiteDataContext();
<<<<<<< HEAD
  const footer = portfolioData.shell.footer;
=======
>>>>>>> c974e6d18f7e4d84cefd23b3ad822ac4cf9981fc
  const githubHref = portfolioData.socials.find((item) => item.label.toLowerCase() === "github")?.href ?? "https://github.com/idcare19";
  const linkedinHref = portfolioData.socials.find((item) => item.label.toLowerCase() === "linkedin")?.href ?? "https://www.linkedin.com/in/abhishekidcare19/";
  const emailHref = portfolioData.socials.find((item) => item.label.toLowerCase() === "email")?.href ?? "mailto:personal@idcare19.me";

  return (
    <footer className="relative overflow-hidden border-t border-[rgb(var(--border))] bg-section-bg py-12">
      <div className="absolute inset-x-0 top-0 h-[2px] animate-pulse bg-gradient-to-r from-transparent via-primary to-transparent" />

      <div className="section-wrap flex flex-col items-center justify-between gap-5 sm:flex-row">
        <p className="max-w-xl text-center text-sm text-text-muted sm:text-left">
<<<<<<< HEAD
          &copy; {new Date().getFullYear()} {portfolioData.owner.name} ({portfolioData.owner.username}) - {portfolioData.owner.role}. {footer.copyrightText}
        </p>

        <div className="flex flex-wrap items-center gap-3">
          {footer.quickLinks.map((link) => (
            <a key={`${link.label}-${link.href}`} href={link.href} className="text-xs font-medium text-text-muted hover:text-text-main">
              {link.label}
            </a>
          ))}
          {footer.ctaLabel && footer.ctaHref ? (
            <a href={footer.ctaHref} className="rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--card-bg))] px-3 py-2 text-xs font-semibold text-text-main hover:border-primary/40 hover:text-primary">
              {footer.ctaLabel}
            </a>
          ) : null}
=======
          &copy; {new Date().getFullYear()} {portfolioData.owner.name} ({portfolioData.owner.username}) - {portfolioData.owner.role}. All rights reserved.
        </p>

        <div className="flex items-center gap-3">
>>>>>>> c974e6d18f7e4d84cefd23b3ad822ac4cf9981fc
          <a
            href={githubHref}
            onClick={() => trackClientEvent("github-click", { targetType: "social", targetSlug: "github" })}
            className="rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--card-bg))] p-2.5 text-text-muted transition-all duration-500 ease-out hover:-translate-y-1 hover:rotate-[-8deg] hover:scale-105 hover:border-primary/40 hover:text-primary"
            aria-label="GitHub"
          >
            <Github className="h-4 w-4" />
          </a>
          <a
            href={linkedinHref}
            onClick={() => trackClientEvent("linkedin-click", { targetType: "social", targetSlug: "linkedin" })}
            className="rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--card-bg))] p-2.5 text-text-muted transition-all duration-500 ease-out hover:-translate-y-1 hover:rotate-[8deg] hover:scale-105 hover:border-primary/40 hover:text-primary"
            aria-label="LinkedIn"
          >
            <Linkedin className="h-4 w-4" />
          </a>
          <a
            href={emailHref}
            className="rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--card-bg))] p-2.5 text-text-muted transition-all duration-500 ease-out hover:-translate-y-1 hover:rotate-[-8deg] hover:scale-105 hover:border-secondary/40 hover:text-secondary"
            aria-label="Email"
          >
            <Mail className="h-4 w-4" />
          </a>
          <a
            href="#home"
            className="animate-float-medium rounded-full border border-[#BFDBFE] bg-[#EFF6FF] p-2.5 text-[#1D4ED8] transition-all duration-500 ease-out hover:-translate-y-1"
<<<<<<< HEAD
            aria-label={footer.backToTopLabel}
=======
            aria-label="Back to top"
>>>>>>> c974e6d18f7e4d84cefd23b3ad822ac4cf9981fc
          >
            <ChevronUp className="h-4 w-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}
