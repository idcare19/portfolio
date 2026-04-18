"use client";

import { portfolioData } from "@/data/portfolio";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronUp, Github, Linkedin, Mail } from "lucide-react";

export function FooterSection() {
  const prefersReducedMotion = useReducedMotion();
  const githubHref = portfolioData.socials.find((item) => item.label.toLowerCase() === "github")?.href ?? "https://github.com/idcare19";
  const linkedinHref = portfolioData.socials.find((item) => item.label.toLowerCase() === "linkedin")?.href ?? "https://www.linkedin.com/in/abhishekidcare19/";
  const emailHref = portfolioData.socials.find((item) => item.label.toLowerCase() === "email")?.href ?? "mailto:personal@idcare19.me";

  return (
    <footer className="relative overflow-hidden border-t border-slate-200/80 py-12">
      <motion.div
        className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-blue-400 to-transparent"
        animate={prefersReducedMotion ? undefined : { x: ["-25%", "25%", "-25%"] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="section-wrap flex flex-col items-center justify-between gap-5 sm:flex-row">
        <motion.p
          className="max-w-xl text-center text-sm text-slate-600 sm:text-left"
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 0.4 }}
        >
          &copy; {new Date().getFullYear()} {portfolioData.owner.name} ({portfolioData.owner.username}) - {portfolioData.owner.role}. All rights reserved.
        </motion.p>

        <div className="flex items-center gap-3">
          <motion.a
            href={githubHref}
            className="rounded-full border border-slate-300 bg-white p-2.5 transition-all duration-500 ease-out hover:-translate-y-1 hover:border-blue-400"
            aria-label="GitHub"
            whileHover={{ y: -5, rotate: -8, scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
          >
            <Github className="h-4 w-4" />
          </motion.a>
          <motion.a
            href={linkedinHref}
            className="rounded-full border border-slate-300 bg-white p-2.5 transition-all duration-500 ease-out hover:-translate-y-1 hover:border-cyan-400"
            aria-label="LinkedIn"
            whileHover={{ y: -5, rotate: 8, scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
          >
            <Linkedin className="h-4 w-4" />
          </motion.a>
          <motion.a
            href={emailHref}
            className="rounded-full border border-slate-300 bg-white p-2.5 transition-all duration-500 ease-out hover:-translate-y-1 hover:border-violet-400"
            aria-label="Email"
            whileHover={{ y: -5, rotate: -8, scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
          >
            <Mail className="h-4 w-4" />
          </motion.a>
          <motion.a
            href="#home"
            className="rounded-full border border-blue-300 bg-blue-50 p-2.5 text-blue-700 transition-all duration-500 ease-out hover:-translate-y-1"
            aria-label="Back to top"
            animate={prefersReducedMotion ? undefined : { y: [0, -2, 0] }}
            transition={{ duration: 1.6, repeat: Infinity }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronUp className="h-4 w-4" />
          </motion.a>
        </div>
      </div>
    </footer>
  );
}
