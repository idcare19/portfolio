import { portfolioData } from "@/data/portfolio";
import { ChevronUp, Github, Linkedin, Mail } from "lucide-react";

export function FooterSection() {
  const githubHref = portfolioData.socials.find((item) => item.label.toLowerCase() === "github")?.href ?? "https://github.com/idcare19";
  const linkedinHref = portfolioData.socials.find((item) => item.label.toLowerCase() === "linkedin")?.href ?? "https://www.linkedin.com/in/abhishekidcare19/";
  const emailHref = portfolioData.socials.find((item) => item.label.toLowerCase() === "email")?.href ?? "mailto:personal@idcare19.me";

  return (
    <footer className="relative overflow-hidden border-t border-slate-200/80 py-12">
      <div className="absolute inset-x-0 top-0 h-[2px] animate-pulse bg-gradient-to-r from-transparent via-blue-400 to-transparent" />

      <div className="section-wrap flex flex-col items-center justify-between gap-5 sm:flex-row">
        <p className="max-w-xl text-center text-sm text-slate-600 sm:text-left">
          &copy; {new Date().getFullYear()} {portfolioData.owner.name} ({portfolioData.owner.username}) - {portfolioData.owner.role}. All rights reserved.
        </p>

        <div className="flex items-center gap-3">
          <a
            href={githubHref}
            className="rounded-full border border-slate-300 bg-white p-2.5 transition-all duration-500 ease-out hover:-translate-y-1 hover:rotate-[-8deg] hover:scale-105 hover:border-blue-400"
            aria-label="GitHub"
          >
            <Github className="h-4 w-4" />
          </a>
          <a
            href={linkedinHref}
            className="rounded-full border border-slate-300 bg-white p-2.5 transition-all duration-500 ease-out hover:-translate-y-1 hover:rotate-[8deg] hover:scale-105 hover:border-cyan-400"
            aria-label="LinkedIn"
          >
            <Linkedin className="h-4 w-4" />
          </a>
          <a
            href={emailHref}
            className="rounded-full border border-slate-300 bg-white p-2.5 transition-all duration-500 ease-out hover:-translate-y-1 hover:rotate-[-8deg] hover:scale-105 hover:border-violet-400"
            aria-label="Email"
          >
            <Mail className="h-4 w-4" />
          </a>
          <a
            href="#home"
            className="animate-float-medium rounded-full border border-blue-300 bg-blue-50 p-2.5 text-blue-700 transition-all duration-500 ease-out hover:-translate-y-1"
            aria-label="Back to top"
          >
            <ChevronUp className="h-4 w-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}
