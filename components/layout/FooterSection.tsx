"use client";

import { trackClientEvent } from "@/components/site/AnalyticsTracker";
import { useSiteDataContext } from "@/components/site/SiteDataProvider";
import { ChevronUp, Github, Linkedin, Mail } from "lucide-react";

export function FooterSection() {
  const portfolioData = useSiteDataContext();
  const footer = portfolioData.shell.footer;
  const githubHref = portfolioData.socials.find((item) => item.label.toLowerCase() === "github")?.href ?? "https://github.com/idcare19";
  const linkedinHref = portfolioData.socials.find((item) => item.label.toLowerCase() === "linkedin")?.href ?? "https://www.linkedin.com/in/abhishekidcare19/";
  const emailHref = portfolioData.socials.find((item) => item.label.toLowerCase() === "email")?.href ?? "mailto:personal@idcare19.me";

  return (
    <footer className="border-t border-[rgb(var(--border))] bg-[rgb(var(--page-bg))] py-10">
      <div className="section-wrap flex flex-col items-center justify-between gap-5 sm:flex-row">
        <p className="max-w-xl text-center text-sm text-text-muted sm:text-left">
          &copy; {new Date().getFullYear()} {portfolioData.owner.name} ({portfolioData.owner.username}) - {portfolioData.owner.role}. {footer.copyrightText}
        </p>
        <div className="flex items-center gap-3">
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
            aria-label={footer.backToTopLabel}
          >
            <ChevronUp className="h-4 w-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}
