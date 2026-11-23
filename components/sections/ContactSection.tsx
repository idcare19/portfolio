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

const INPUT_CLASS =
  "min-h-14 w-full rounded-[18px] border border-[rgb(var(--border))] bg-[rgb(var(--page-bg))] px-4 py-3 text-sm text-text-main outline-none ring-primary/40 transition-all duration-300 ease-out placeholder:text-text-muted/70 focus:border-primary focus:ring-2";

const INFO_CARD_CLASS =
  "rounded-[18px] border border-[rgb(var(--border))] bg-[rgb(var(--card-bg))] p-4 shadow-sm backdrop-blur";

const INFO_LABEL_CLASS =
  "flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-text-muted";

const DETAIL_ITEMS = [
  { key: "email", label: "Email", Icon: Mail },
  { key: "github", label: "GitHub", Icon: Github },
  { key: "linkedin", label: "LinkedIn", Icon: Linkedin },
];

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
    <AnimatedSection id="contact" className="bg-[rgb(var(--page-bg))] py-10 sm:py-14">
      <div className="section-wrap">
        {hasHeader ? <SectionHeader eyebrow={data.eyebrow} title={data.title} description={data.description} /> : null}

        <div className="mx-auto max-w-[1050px]">
          <div className="grid overflow-hidden rounded-[38px] border border-[rgb(var(--border))] bg-[rgb(var(--card-bg))] shadow-[0_32px_84px_rgba(15,23,42,0.12)] dark:shadow-[0_32px_84px_rgba(0,0,0,0.5)] lg:grid-cols-[0.92fr_1.08fr]">
            <div className="relative overflow-hidden border-b border-[rgb(var(--border))] bg-primary/10 p-6 sm:p-8 lg:border-b-0 lg:border-r">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.12),transparent_35%)]" />
              <div className="relative flex h-full flex-col gap-5">
                <div className="space-y-3">
                  {hasContent(availabilityLabel) ? <Badge>{availabilityLabel}</Badge> : null}
                  {hasContent(data.cardTitle) ? <h3 className="text-2xl font-semibold tracking-tight text-text-main sm:text-[2rem]">{String(data.cardTitle)}</h3> : null}
                  {hasContent(data.cardDescription) ? <p className="max-w-xl text-sm leading-7 text-text-muted">{String(data.cardDescription)}</p> : null}
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
                        className="flex items-center gap-3 rounded-[18px] border border-[rgb(var(--border))] bg-[rgb(var(--card-bg))] px-4 py-3 text-sm text-text-muted shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:border-primary/40 hover:text-primary"
                      >
                        <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">{icon}</span>
                        <span className="min-w-0 flex-1">
                          <span className="block font-medium text-text-main">{label}</span>
                          <span className="block truncate text-text-muted">{value}</span>
                        </span>
                      </a>
                    );
                  })}
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {hasContent(responseTimeValue) ? (
                    <div className={INFO_CARD_CLASS}>
                      <div className={INFO_LABEL_CLASS}>
                        <Timer className="h-4 w-4 text-primary" />
                        {responseTimeLabel || "Response Time"}
                      </div>
                      <p className="mt-2 text-sm font-semibold text-text-main">{responseTimeValue}</p>
                    </div>
                  ) : null}
                  {hasContent(locationValue) ? (
                    <div className={INFO_CARD_CLASS}>
                      <div className={INFO_LABEL_CLASS}>
                        <MapPin className="h-4 w-4 text-primary" />
                        {locationLabel || "Location"}
                      </div>
                      <p className="mt-2 text-sm font-semibold text-text-main">{locationValue}</p>
                    </div>
                  ) : null}
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {DETAIL_ITEMS.map(({ key, label, Icon }) => {
                    const value = String(
                      socials.find((item: any) => String(item.label || "").toLowerCase().includes(key))?.value || ""
                    );
                    if (!hasContent(value)) return null;
                    return (
                      <div key={key} className={INFO_CARD_CLASS}>
                        <div className={INFO_LABEL_CLASS}>
                          <Icon className="h-4 w-4 text-primary" />
                          {label}
                        </div>
                        <p className="mt-2 truncate text-sm font-semibold text-text-main">{value}</p>
                      </div>
                    );
                  })}
                  {hasContent(String(data.availabilityValue || "")) ? (
                    <div className={`${INFO_CARD_CLASS} sm:col-span-2`}>
                      <div className={INFO_LABEL_CLASS}>
                        <Mail className="h-4 w-4 text-primary" />
                        Availability
                      </div>
                      <p className="mt-2 text-sm font-semibold text-text-main">{String(data.availabilityValue)}</p>
                    </div>
                  ) : null}
                </div>

                <div className="mt-auto rounded-[22px] border border-[rgb(var(--border))] bg-[rgb(var(--card-bg))] p-4 shadow-sm backdrop-blur">
                  <p className="text-sm leading-6 text-text-muted">{ctaText || "Let's build something together."}</p>
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

            <div className="border-t border-[rgb(var(--border))] bg-[rgb(var(--card-bg))] p-6 sm:p-8 lg:border-l lg:border-t-0">
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="contact-name" className="mb-2 block text-sm font-semibold text-text-main">{nameLabel || "Name"}</label>
                    <input
                      id="contact-name"
                      type="text"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      required
                      placeholder={namePlaceholder || "Your name"}
                      className={INPUT_CLASS}
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-email" className="mb-2 block text-sm font-semibold text-text-main">{emailLabel || "Email"}</label>
                    <input
                      id="contact-email"
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      required
                      placeholder={emailPlaceholder || "you@example.com"}
                      className={INPUT_CLASS}
                    />
                  </div>
                </div>

                {subjectEnabled ? (
                  <div>
                    <label htmlFor="contact-subject" className="mb-2 block text-sm font-semibold text-text-main">{subjectLabel || "Subject"}</label>
                    <input
                      id="contact-subject"
                      type="text"
                      value={subject}
                      onChange={(event) => setSubject(event.target.value)}
                      placeholder={subjectPlaceholder || "How can I help?"}
                      className={INPUT_CLASS}
                    />
                  </div>
                ) : null}

                <div>
                  <label htmlFor="contact-message" className="mb-2 block text-sm font-semibold text-text-main">{messageLabel || "Message"}</label>
                  <textarea
                    id="contact-message"
                    rows={8}
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    required
                    placeholder={messagePlaceholder || "Tell me about your project..."}
                    className="min-h-56 w-full rounded-[22px] border border-[rgb(var(--border))] bg-[rgb(var(--page-bg))] px-4 py-3 text-sm text-text-main outline-none ring-primary/40 transition-all duration-300 ease-out placeholder:text-text-muted/70 focus:border-primary focus:ring-2"
                  />
                </div>

                <Button type="submit" className="w-full justify-center py-3.5 text-base sm:max-w-[360px]">
                  <Send className="mr-2 h-4 w-4" />
                  {submitting ? String(data.sendingLabel || "Sending...") : sendLabel || "Send Message"}
                </Button>

                {submitState ? (
                  <p
                    className={`text-sm ${
                      submitState.type === "success"
                        ? "text-emerald-700 dark:text-emerald-400"
                        : "text-rose-600 dark:text-rose-400"
                    }`}
                    role="status"
                    aria-live="polite"
                  >
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