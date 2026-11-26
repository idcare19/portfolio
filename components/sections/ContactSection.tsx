
"use client";

import { useState, type FormEvent } from "react";
import {
  Github,
  Linkedin,
  Mail,
  MapPin,
  Send,
  Timer,
} from "lucide-react";

import { AnimatedSection } from "@/components/effects/AnimatedSection";
import { useSectionData } from "@/components/site/SiteDataProvider";
import { trackClientEvent } from "@/components/site/AnalyticsTracker";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { hasContent } from "@/lib/has-content";

const INPUT_CLASS =
  "min-h-12 w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--page-bg))] px-3 py-2.5 text-sm text-text-main outline-none transition-colors placeholder:text-text-muted/70 focus:border-primary focus:ring-2 focus:ring-primary/30 sm:min-h-14 sm:px-4 sm:py-3";

const INFO_CARD_CLASS =
  "rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card-bg))] p-4";

const INFO_LABEL_CLASS =
  "flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-text-muted";

export function ContactSection() {
  const section = useSectionData("contact");
  const data = section.data as Record<string, any>;

  const socials = Array.isArray(section.items)
    ? section.items.filter(
        (item: any) => item && item.isEnabled !== false
      )
    : [];

  const resumeUrl = String(data.resumeUrl || "").trim();
  const hasResume = Boolean(resumeUrl && resumeUrl !== "#");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [submitState, setSubmitState] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const hasHeader =
    hasContent(data.eyebrow) ||
    hasContent(data.title) ||
    hasContent(data.description);

  const availabilityLabel = String(data.availabilityLabel || "");
  const responseTimeLabel = String(data.responseTimeLabel || "");
  const responseTimeValue = String(data.responseTimeValue || "");
  const locationLabel = String(data.locationLabel || "");
  const locationValue = String(data.locationValue || "");

  const subjectEnabled = data.subjectEnabled !== false;

  const sendLabel = String(
    data.sendLabel || data.sendButtonText || "Send Message"
  );

  const resumeButtonLabel = String(
    data.resumeButtonLabel || "Download Resume"
  );

  const nameLabel = String(data.nameLabel || "Name");
  const namePlaceholder = String(
    data.namePlaceholder || "Your name"
  );

  const emailLabel = String(data.emailLabel || "Email");
  const emailPlaceholder = String(
    data.emailPlaceholder || "you@example.com"
  );

  const subjectLabel = String(
    data.subjectLabel || data.subjectText || "Subject"
  );

  const subjectPlaceholder = String(
    data.subjectPlaceholder || "How can I help?"
  );

  const messageLabel = String(data.messageLabel || "Message");

  const messagePlaceholder = String(
    data.messagePlaceholder || "Tell me about your project..."
  );

  const successMessage = String(data.successMessage || "");
  const errorMessage = String(data.errorMessage || "");

  const ctaText = String(
    data.ctaText || data.cardCTA || "Let's build something together."
  );

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
          subject: subject || String(data.formSubject || ""),
          message,
        }),
      });

      const payload = (await response.json().catch(() => null)) as
        | { ok?: boolean; error?: string }
        | null;

      if (!response.ok || !payload?.ok) {
        throw new Error(
          payload?.error || "Failed to send message. Please try again."
        );
      }

      trackClientEvent("contact-submit", {
        targetType: "contact",
      });

      setSubmitState({
        type: "success",
        text: successMessage || "Your message has been sent successfully.",
      });

      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch (error) {
      setSubmitState({
        type: "error",
        text:
          errorMessage ||
          (error instanceof Error ? error.message : "Something went wrong."),
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AnimatedSection
      id="contact"
      className="bg-[rgb(var(--page-bg))] py-12 sm:py-24"
    >
      <div className="section-wrap">
        {hasHeader ? (
          <SectionHeader
            eyebrow={data.eyebrow}
            title={data.title}
            description={data.description}
          />
        ) : null}

        <div className="mx-auto max-w-[1050px]">
          <div className="mx-2 grid overflow-hidden rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card-bg))] shadow-sm sm:mx-0 sm:rounded-3xl lg:grid-cols-[0.92fr_1.08fr]">

            {/* LEFT: CONTACT INFORMATION */}
            <div className="flex flex-col gap-5 border-b border-[rgb(var(--border))] bg-[rgb(var(--section-bg,var(--page-bg)))] p-4 sm:gap-6 sm:p-8 lg:border-b-0 lg:border-r">

              <div className="space-y-3">
                {hasContent(availabilityLabel) ? (
                  <Badge>{availabilityLabel}</Badge>
                ) : null}

                {hasContent(data.cardTitle) &&
                String(data.cardTitle) !== String(data.title) ? (
                  <h3 className="text-2xl font-bold tracking-tight text-text-main sm:text-3xl">
                    {String(data.cardTitle)}
                  </h3>
                ) : null}

                {hasContent(data.cardDescription) &&
                String(data.cardDescription) !== String(data.description) ? (
                  <p className="max-w-xl text-sm leading-7 text-text-muted">
                    {String(data.cardDescription)}
                  </p>
                ) : null}
              </div>

              {/* SOCIAL LINKS — EACH DISPLAYED ONCE */}
              {socials.length > 0 ? (
                <div className="grid gap-3">
                  {socials.map((social: any, index: number) => {
                    const label = String(social.label || "");
                    const value = String(
                      social.value || social.href || ""
                    );

                    if (!hasContent(value)) return null;

                    const normalized = label.toLowerCase();

                    const Icon = normalized.includes("github")
                      ? Github
                      : normalized.includes("linkedin")
                        ? Linkedin
                        : Mail;

                    return (
                      <a
                        key={`${label}-${index}`}
                        href={social.href || value}
                        target={
                          /^https?:\/\//i.test(
                            String(social.href || value)
                          )
                            ? "_blank"
                            : undefined
                        }
                        rel="noopener noreferrer"
                        className="flex min-w-0 items-center gap-3 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card-bg))] px-4 py-3 text-sm transition-colors hover:border-primary/50"
                      >
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <Icon className="h-4 w-4" />
                        </span>

                        <span className="min-w-0 flex-1">
                          <span className="block font-semibold text-text-main">
                            {label}
                          </span>

                          <span className="block truncate text-text-muted">
                            {value}
                          </span>
                        </span>
                      </a>
                    );
                  })}
                </div>
              ) : null}

              {/* RESPONSE TIME AND LOCATION */}
              {hasContent(responseTimeValue) ||
              hasContent(locationValue) ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  {hasContent(responseTimeValue) ? (
                    <div className={INFO_CARD_CLASS}>
                      <div className={INFO_LABEL_CLASS}>
                        <Timer className="h-4 w-4 text-primary" />
                        {responseTimeLabel || "Response Time"}
                      </div>

                      <p className="mt-2 text-sm font-semibold text-text-main">
                        {responseTimeValue}
                      </p>
                    </div>
                  ) : null}

                  {hasContent(locationValue) ? (
                    <div className={INFO_CARD_CLASS}>
                      <div className={INFO_LABEL_CLASS}>
                        <MapPin className="h-4 w-4 text-primary" />
                        {locationLabel || "Location"}
                      </div>

                      <p className="mt-2 text-sm font-semibold text-text-main">
                        {locationValue}
                      </p>
                    </div>
                  ) : null}
                </div>
              ) : null}

              {/* CTA AND RESUME */}
              <div className="mt-auto rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card-bg))] p-4 sm:p-5">
                <p className="text-sm leading-6 text-text-muted">
                  {ctaText}
                </p>

                {hasResume ? (
                  <div className="mt-4">
                    <Button
                      href={resumeUrl}
                      variant="secondary"
                      target="_blank"
                      download
                      className="w-full sm:w-auto"
                    >
                      {resumeButtonLabel}
                    </Button>
                  </div>
                ) : null}
              </div>
            </div>

            {/* RIGHT: CONTACT FORM */}
            <div className="bg-[rgb(var(--card-bg))] p-4 sm:p-8">
              <form
                className="space-y-4 sm:space-y-5"
                onSubmit={handleSubmit}
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="contact-name"
                      className="mb-2 block text-sm font-semibold text-text-main"
                    >
                      {nameLabel}
                    </label>

                    <input
                      id="contact-name"
                      type="text"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      required
                      autoComplete="name"
                      placeholder={namePlaceholder}
                      className={INPUT_CLASS}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="contact-email"
                      className="mb-2 block text-sm font-semibold text-text-main"
                    >
                      {emailLabel}
                    </label>

                    <input
                      id="contact-email"
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      required
                      autoComplete="email"
                      placeholder={emailPlaceholder}
                      className={INPUT_CLASS}
                    />
                  </div>
                </div>

                {subjectEnabled ? (
                  <div>
                    <label
                      htmlFor="contact-subject"
                      className="mb-2 block text-sm font-semibold text-text-main"
                    >
                      {subjectLabel}
                    </label>

                    <input
                      id="contact-subject"
                      type="text"
                      value={subject}
                      onChange={(event) => setSubject(event.target.value)}
                      placeholder={subjectPlaceholder}
                      className={INPUT_CLASS}
                    />
                  </div>
                ) : null}

                <div>
                  <label
                    htmlFor="contact-message"
                    className="mb-2 block text-sm font-semibold text-text-main"
                  >
                    {messageLabel}
                  </label>

                  <textarea
                    id="contact-message"
                    rows={6}
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    required
                    placeholder={messagePlaceholder}
                    className={`${INPUT_CLASS} min-h-32 resize-y sm:min-h-40`}
                  />
                </div>

             <button
  type="submit"
  disabled={submitting}
  className="inline-flex w-full items-center justify-center rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 sm:max-w-[360px] sm:px-6 sm:py-3.5 sm:text-base"
>
  <Send className="mr-2 h-4 w-4" />
  {submitting
    ? String(data.sendingLabel || "Sending...")
    : sendLabel}
</button>

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
