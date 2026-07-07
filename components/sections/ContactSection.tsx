"use client";

import { AnimatedSection } from "@/components/effects/AnimatedSection";
import { useSectionData } from "@/components/site/SiteDataProvider";
import { trackClientEvent } from "@/components/site/AnalyticsTracker";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { FormEvent } from "react";
import { useState } from "react";
import { Github, Linkedin, Mail, MapPin, Send, Timer } from "lucide-react";
import { hasContent } from "@/lib/has-content";

export function ContactSection() {
  const section = useSectionData("contact");
  const data = section.data as Record<string, any>;
  const socials = Array.isArray(section.items) ? section.items.filter((item: any) => item && item.isEnabled !== false) : [];
  const resumeUrl = String(data.resumeUrl || "").trim();
  const hasResume = Boolean(resumeUrl && resumeUrl !== "#");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitState, setSubmitState] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const hasHeader = hasContent(data.eyebrow) || hasContent(data.title) || hasContent(data.description);
  const availabilityLabel = String(data.availabilityLabel || "");
  const responseTimeLabel = String(data.responseTimeLabel || "");
  const responseTimeValue = String(data.responseTimeValue || "");
  const locationLabel = String(data.locationLabel || "");
  const locationValue = String(data.locationValue || "");
  const subjectEnabled = data.subjectEnabled !== false;
  const sendLabel = String(data.sendLabel || data.sendButtonText || "");
  const resumeButtonLabel = String(data.resumeButtonLabel || "");
  const nameLabel = String(data.nameLabel || "");
  const namePlaceholder = String(data.namePlaceholder || "");
  const emailLabel = String(data.emailLabel || "");
  const emailPlaceholder = String(data.emailPlaceholder || "");
  const subjectLabel = String(data.subjectLabel || data.subjectText || "");
  const subjectPlaceholder = String(data.subjectPlaceholder || "");
  const messageLabel = String(data.messageLabel || "");
  const messagePlaceholder = String(data.messagePlaceholder || "");
  const successMessage = String(data.successMessage || "");
  const errorMessage = String(data.errorMessage || "");
  const ctaText = String(data.ctaText || data.cardCTA || "");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    setSubmitState(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          subject: subject || String(data.formSubject || ""),
          message,
        }),
      });

      const payload = (await response.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
      if (!response.ok || !payload?.ok) throw new Error(payload?.error || "Failed to send message. Please try again.");

      trackClientEvent("contact-submit", { targetType: "contact" });
      setSubmitState({ type: "success", text: successMessage });
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch (error) {
      setSubmitState({ type: "error", text: errorMessage || (error instanceof Error ? error.message : "") });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AnimatedSection id="contact" className="bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.1),transparent_34%),linear-gradient(180deg,rgba(248,250,252,1),rgba(255,255,255,1))] py-10 sm:py-14">
      <div className="section-wrap">
        {hasHeader ? <SectionHeader eyebrow={data.eyebrow} title={data.title} description={data.description} /> : null}

        <div className="mx-auto max-w-[1050px]">
          <div className="grid overflow-hidden rounded-[38px] border border-[rgb(var(--border))] bg-white shadow-[0_32px_84px_rgba(15,23,42,0.12)] lg:grid-cols-[0.92fr_1.08fr]">
            <div className="relative overflow-hidden border-b border-[rgb(var(--border))] bg-[linear-gradient(180deg,rgba(219,234,254,1),rgba(191,219,254,0.56))] p-6 sm:p-8 lg:border-b-0 lg:border-r">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.72),transparent_22%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.18),transparent_24%),linear-gradient(135deg,rgba(255,255,255,0.08),transparent_45%)]" />
              <div className="relative flex h-full flex-col gap-5">
                <div className="space-y-3">
                  {hasContent(availabilityLabel) ? <Badge>{availabilityLabel}</Badge> : null}
                  {hasContent(data.cardTitle) ? <h3 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-[2rem]">{String(data.cardTitle)}</h3> : null}
                  {hasContent(data.cardDescription) ? <p className="max-w-xl text-sm leading-7 text-slate-700">{String(data.cardDescription)}</p> : null}
                </div>

                <div className="grid gap-3">
                  {socials.map((social: any) => {
                    const label = String(social.label || "");
                    const value = String(social.value || social.href || "");
                    const normalized = label.toLowerCase();
                    const icon = normalized.includes("github") ? <Github className="h-4 w-4" /> : normalized.includes("linkedin") ? <Linkedin className="h-4 w-4" /> : <Mail className="h-4 w-4" />;
                    if (!hasContent(value)) return null;
                    return (
                      <a
                        key={label}
                        href={social.href}
                        className="flex items-center gap-3 rounded-[18px] border border-white/60 bg-white/84 px-4 py-3 text-sm text-slate-600 shadow-[0_12px_24px_rgba(37,99,235,0.08)] backdrop-blur transition hover:-translate-y-0.5 hover:border-blue-300 hover:text-blue-700"
                      >
                        <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-blue-600/10 text-blue-700">{icon}</span>
                        <span className="min-w-0 flex-1">
                          <span className="block font-medium text-slate-950">{label}</span>
                          <span className="block truncate text-slate-600">{value}</span>
                        </span>
                      </a>
                    );
                  })}
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {hasContent(responseTimeValue) ? (
                    <div className="rounded-[18px] border border-white/60 bg-white/86 p-4 shadow-[0_12px_24px_rgba(37,99,235,0.08)] backdrop-blur">
                      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                        <Timer className="h-4 w-4 text-blue-700" />
                        {responseTimeLabel || "Response Time"}
                      </div>
                      <p className="mt-2 text-sm font-semibold text-slate-950">{responseTimeValue}</p>
                    </div>
                  ) : null}
                  {hasContent(locationValue) ? (
                    <div className="rounded-[18px] border border-white/60 bg-white/86 p-4 shadow-[0_12px_24px_rgba(37,99,235,0.08)] backdrop-blur">
                      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                        <MapPin className="h-4 w-4 text-blue-700" />
                        {locationLabel || "Location"}
                      </div>
                      <p className="mt-2 text-sm font-semibold text-slate-950">{locationValue}</p>
                    </div>
                  ) : null}
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {hasContent(String(socials.find((item: any) => String(item.label || "").toLowerCase().includes("email"))?.value || "")) ? (
                    <div className="rounded-[18px] border border-white/60 bg-white/86 p-4 shadow-[0_12px_24px_rgba(37,99,235,0.08)] backdrop-blur">
                      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                        <Mail className="h-4 w-4 text-blue-700" />
                        Email
                      </div>
                      <p className="mt-2 truncate text-sm font-semibold text-slate-950">{String(socials.find((item: any) => String(item.label || "").toLowerCase().includes("email"))?.value || "")}</p>
                    </div>
                  ) : null}
                  {hasContent(String(socials.find((item: any) => String(item.label || "").toLowerCase().includes("github"))?.value || "")) ? (
                    <div className="rounded-[18px] border border-white/60 bg-white/86 p-4 shadow-[0_12px_24px_rgba(37,99,235,0.08)] backdrop-blur">
                      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                        <Github className="h-4 w-4 text-blue-700" />
                        GitHub
                      </div>
                      <p className="mt-2 truncate text-sm font-semibold text-slate-950">{String(socials.find((item: any) => String(item.label || "").toLowerCase().includes("github"))?.value || "")}</p>
                    </div>
                  ) : null}
                  {hasContent(String(socials.find((item: any) => String(item.label || "").toLowerCase().includes("linkedin"))?.value || "")) ? (
                    <div className="rounded-[18px] border border-white/60 bg-white/86 p-4 shadow-[0_12px_24px_rgba(37,99,235,0.08)] backdrop-blur">
                      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                        <Linkedin className="h-4 w-4 text-blue-700" />
                        LinkedIn
                      </div>
                      <p className="mt-2 truncate text-sm font-semibold text-slate-950">{String(socials.find((item: any) => String(item.label || "").toLowerCase().includes("linkedin"))?.value || "")}</p>
                    </div>
                  ) : null}
                  {hasContent(String(data.availabilityValue || "")) ? (
                    <div className="rounded-[18px] border border-white/60 bg-white/86 p-4 shadow-[0_12px_24px_rgba(37,99,235,0.08)] backdrop-blur sm:col-span-2">
                      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                        <Mail className="h-4 w-4 text-blue-700" />
                        Availability
                      </div>
                      <p className="mt-2 text-sm font-semibold text-slate-950">{String(data.availabilityValue)}</p>
                    </div>
                  ) : null}
                </div>

                <div className="mt-auto rounded-[22px] border border-white/60 bg-white/86 p-4 shadow-[0_16px_32px_rgba(37,99,235,0.08)] backdrop-blur">
                  <p className="text-sm leading-6 text-slate-700">{ctaText || "Let's build something together."}</p>
                  {hasResume ? (
                    <div className="mt-4">
                      <Button href={resumeUrl} variant="secondary" target="_blank" download className="w-full sm:w-auto">
                        {resumeButtonLabel || "Download Resume"}
                      </Button>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="border-t border-[rgb(var(--border))] bg-[linear-gradient(180deg,rgba(255,255,255,1),rgba(248,250,252,0.98))] p-6 sm:p-8 lg:border-l lg:border-t-0">
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="contact-name" className="mb-2 block text-sm font-semibold text-slate-900">{nameLabel || "Name"}</label>
                    <input
                      id="contact-name"
                      type="text"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      required
                      placeholder={namePlaceholder || "Your name"}
                      className="min-h-14 w-full rounded-[18px] border border-[rgb(var(--border))] bg-[rgb(var(--card-bg))] px-4 py-3 text-sm text-text-main outline-none ring-blue-500/40 transition-all duration-300 ease-out placeholder:text-text-muted/70 focus:border-blue-300 focus:ring-2"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-email" className="mb-2 block text-sm font-semibold text-slate-900">{emailLabel || "Email"}</label>
                    <input
                      id="contact-email"
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      required
                      placeholder={emailPlaceholder || "you@example.com"}
                      className="min-h-14 w-full rounded-[18px] border border-[rgb(var(--border))] bg-[rgb(var(--card-bg))] px-4 py-3 text-sm text-text-main outline-none ring-blue-500/40 transition-all duration-300 ease-out placeholder:text-text-muted/70 focus:border-blue-300 focus:ring-2"
                    />
                  </div>
                </div>

                {subjectEnabled ? (
                  <div>
                    <label htmlFor="contact-subject" className="mb-2 block text-sm font-semibold text-slate-900">{subjectLabel || "Subject"}</label>
                    <input
                      id="contact-subject"
                      type="text"
                      value={subject}
                      onChange={(event) => setSubject(event.target.value)}
                      placeholder={subjectPlaceholder || "How can I help?"}
                      className="min-h-14 w-full rounded-[18px] border border-[rgb(var(--border))] bg-[rgb(var(--card-bg))] px-4 py-3 text-sm text-text-main outline-none ring-blue-500/40 transition-all duration-300 ease-out placeholder:text-text-muted/70 focus:border-blue-300 focus:ring-2"
                    />
                  </div>
                ) : null}

                <div>
                  <label htmlFor="contact-message" className="mb-2 block text-sm font-semibold text-slate-900">{messageLabel || "Message"}</label>
                  <textarea
                    id="contact-message"
                    rows={8}
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    required
                    placeholder={messagePlaceholder || "Tell me about your project..."}
                    className="min-h-56 w-full rounded-[22px] border border-[rgb(var(--border))] bg-[rgb(var(--card-bg))] px-4 py-3 text-sm text-text-main outline-none ring-blue-500/40 transition-all duration-300 ease-out placeholder:text-text-muted/70 focus:border-blue-300 focus:ring-2"
                  />
                </div>

                <Button type="submit" className="w-full justify-center py-3.5 text-base sm:max-w-[360px]">
                  <Send className="mr-2 h-4 w-4" />
                  {submitting ? String(data.sendingLabel || "Sending...") : sendLabel || "Send Message"}
                </Button>

                {submitState ? (
                  <p className={`text-sm ${submitState.type === "success" ? "text-emerald-700" : "text-rose-600"}`} role="status" aria-live="polite">
                    {submitState.text}
                  </p>
                ) : null}
              </form>
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
