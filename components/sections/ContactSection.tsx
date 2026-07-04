"use client";

import { AnimatedSection } from "@/components/effects/AnimatedSection";
import { FadeInUp } from "@/components/effects/FadeInUp";
import { useSectionData } from "@/components/site/SiteDataProvider";
import { trackClientEvent } from "@/components/site/AnalyticsTracker";
import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { FormEvent } from "react";
import { useState } from "react";

export function ContactSection() {
  const section = useSectionData("contact");
  const data = section.data as Record<string, any>;
  const socials = Array.isArray(section.items) ? section.items.filter((item: any) => item && item.isEnabled !== false) : [];
  const resumeUrl = String(data.resumeUrl || "").trim();
  const hasResume = Boolean(resumeUrl && resumeUrl !== "#");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitState, setSubmitState] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const hasHeader = Boolean(data.eyebrow || data.title || data.description);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    setSubmitState(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          message,
          subject: "Website Contact Form",
        }),
      });

      const payload = (await response.json().catch(() => null)) as { ok?: boolean; error?: string } | null;

      if (!response.ok || !payload?.ok) {
        throw new Error(payload?.error || "Failed to send message. Please try again.");
      }

      trackClientEvent("contact-submit", { targetType: "contact" });
      setSubmitState({ type: "success", text: "Message sent successfully." });
      setName("");
      setEmail("");
      setMessage("");
    } catch (error) {
      setSubmitState({
        type: "error",
        text: error instanceof Error ? error.message : "Unable to send message right now.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AnimatedSection id="contact" className="bg-page-bg py-20">
      <div className="section-wrap">
        {hasHeader ? <SectionHeader eyebrow={data.eyebrow} title={data.title} description={data.description} /> : null}

        <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
          <FadeInUp className="glass rounded-3xl p-6 shadow-[0_10px_26px_rgba(15,23,42,0.06)]">
            <h3 className="text-xl font-semibold text-text-main">{String(data.cardTitle || "")}</h3>
            <p className="mt-3 text-sm text-text-muted">
              {String(data.cardDescription || "")}
            </p>

            <div className="mt-5 space-y-2">
              {socials.map((social: any) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="block break-all rounded-xl border border-[rgb(var(--border))] bg-white px-3 py-2 text-text-muted transition-colors duration-200 hover:border-primary/50 hover:text-primary"
                >
                  <span className="font-semibold text-text-main">{social.label}</span> - {social.value}
                </a>
              ))}
            </div>

            {hasResume ? (
              <div className="mt-5">
                <Button href={resumeUrl} variant="secondary" target="_blank" download>
                  Download Resume
                </Button>
              </div>
            ) : null}
          </FadeInUp>

          <FadeInUp delay={0.08} className="glass rounded-3xl p-6 shadow-[0_10px_26px_rgba(15,23,42,0.06)]">
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="contact-name" className="mb-1.5 block text-sm font-medium text-text-main">
                  Name
                </label>
                <input
                  id="contact-name"
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                  placeholder="Your name"
                  className="w-full rounded-xl border border-[rgb(var(--border))] bg-white px-3 py-2 text-sm text-text-main outline-none ring-primary/50 transition-all duration-500 ease-out focus:ring-2"
                />
              </div>
              <div>
                <label htmlFor="contact-email" className="mb-1.5 block text-sm font-medium text-text-main">
                  Email
                </label>
                <input
                  id="contact-email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-[rgb(var(--border))] bg-white px-3 py-2 text-sm text-text-main outline-none ring-primary/50 transition-all duration-500 ease-out focus:ring-2"
                />
              </div>
              <div>
                <label htmlFor="contact-message" className="mb-1.5 block text-sm font-medium text-text-main">
                  Message
                </label>
                <textarea
                  id="contact-message"
                  rows={5}
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  required
                  placeholder="Tell me about your project..."
                  className="w-full rounded-xl border border-[rgb(var(--border))] bg-white px-3 py-2 text-sm text-text-main outline-none ring-primary/50 transition-all duration-500 ease-out focus:ring-2"
                />
              </div>

              <Button type="submit">{submitting ? "Sending..." : "Send Message"}</Button>

              {submitState ? (
                <p
                  className={`text-sm ${
                    submitState.type === "success" ? "text-emerald-700" : "text-rose-600"
                  }`}
                  role="status"
                  aria-live="polite"
                >
                  {submitState.text}
                </p>
              ) : null}
            </form>
          </FadeInUp>
        </div>
      </div>
    </AnimatedSection>
  );
}
