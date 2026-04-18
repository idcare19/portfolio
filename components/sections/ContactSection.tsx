"use client";

import { AnimatedSection } from "@/components/effects/AnimatedSection";
import { FadeInUp } from "@/components/effects/FadeInUp";
import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { portfolioData } from "@/data/portfolio";
import { motion, useReducedMotion } from "framer-motion";
import type { FormEvent } from "react";
import { useState } from "react";

export function ContactSection() {
  const prefersReducedMotion = useReducedMotion();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const emailContact = portfolioData.socials.find((social) => social.label.toLowerCase() === "email")?.href ?? "mailto:personal@idcare19.me";
  const toEmail = emailContact.replace(/^mailto:/, "");
  const mailSubject = encodeURIComponent(`Portfolio Contact from ${name || "Visitor"}`);
  const mailBody = encodeURIComponent(`Name: ${name || "-"}\nEmail: ${email || "-"}\n\nMessage:\n${message || "-"}`);
  const mailtoHref = `mailto:${toEmail}?subject=${mailSubject}&body=${mailBody}`;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    window.location.href = mailtoHref;
  }

  return (
    <AnimatedSection id="contact" className="py-20">
      <div className="section-wrap">
        <SectionHeader
          eyebrow="Contact"
          title="Let's talk about your next project"
          description="Freelance projects, internships, and collaboration opportunities are always welcome."
        />

        <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
          <FadeInUp className="glass relative overflow-hidden rounded-3xl border border-white/80 p-6 shadow-[0_12px_34px_rgba(15,23,42,0.08)]">
            <motion.div
              className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-white/50 to-transparent"
              animate={prefersReducedMotion ? undefined : { x: ["-120%", "320%"] }}
              transition={{ duration: 3.1, repeat: Infinity, repeatDelay: 1.3, ease: "easeInOut" }}
            />
            <h3 className="text-xl font-semibold text-slate-900">Let's build something amazing together.</h3>
            <p className="mt-3 text-sm text-slate-600">
              Whether it's a startup idea, website revamp, or app concept - I'd love to help build it.
            </p>

            <div className="mt-5 space-y-2 text-sm">
              {portfolioData.socials.map((social, index) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  className="block break-all rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-700 transition-all duration-500 ease-out hover:-translate-y-0.5 hover:border-blue-300 hover:text-blue-700"
                  initial={{ opacity: 0.9 }}
                  animate={prefersReducedMotion ? undefined : { y: [0, -2, 0], opacity: [0.92, 1, 0.92] }}
                  transition={{ duration: 2.2, repeat: Infinity, delay: index * 0.18 }}
                >
                  <span className="font-semibold">{social.label}</span> - {social.value}
                </motion.a>
              ))}
            </div>
          </FadeInUp>

          <FadeInUp delay={0.08} className="glass relative overflow-hidden rounded-3xl border border-white/80 p-6 shadow-[0_12px_34px_rgba(15,23,42,0.08)]">
            <motion.div
              className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-400/80 to-transparent"
              animate={prefersReducedMotion ? undefined : { opacity: [0.2, 0.9, 0.2] }}
              transition={{ duration: 2.4, repeat: Infinity }}
            />
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="contact-name" className="mb-1.5 block text-sm font-medium text-slate-700">
                  Name
                </label>
                <input
                  id="contact-name"
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                  placeholder="Your name"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-blue-400 transition-all duration-500 ease-out focus:ring-2"
                />
              </div>
              <div>
                <label htmlFor="contact-email" className="mb-1.5 block text-sm font-medium text-slate-700">
                  Email
                </label>
                <input
                  id="contact-email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-blue-400 transition-all duration-500 ease-out focus:ring-2"
                />
              </div>
              <div>
                <label htmlFor="contact-message" className="mb-1.5 block text-sm font-medium text-slate-700">
                  Message
                </label>
                <textarea
                  id="contact-message"
                  rows={5}
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  required
                  placeholder="Tell me about your project..."
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-blue-400 transition-all duration-500 ease-out focus:ring-2"
                />
              </div>

              <Button type="submit">Open Mail App</Button>
            </form>
          </FadeInUp>
        </div>
      </div>
    </AnimatedSection>
  );
}
