"use client";

import { useMemo, useState } from "react";
import type { SiteData } from "@/src/types/site-data";
import { ANIMATION_PRESETS, ANIMATION_SECTIONS, ANIMATION_TEMPLATE_NAMES, ANIMATION_TRIGGERS, defaultAnimationConfig } from "@/lib/animation-presets";
import { motion, useReducedMotion } from "framer-motion";

const SECTION_LABELS: Record<string, string> = {
  hero: "Hero",
  about: "About",
  achievements: "Achievements",
  skills: "Skills",
  certificates: "Certificates",
  services: "Services",
  projects: "Projects",
  working: "Working Projects",
  completed: "Completed Projects",
  companies: "Companies",
  experience: "Experience",
  reviews: "Reviews",
  faq: "FAQ",
  "open-source": "Open Source",
  blogs: "Blogs",
  github: "GitHub",
  contact: "Contact",
  footer: "Footer",
};

const TEMPLATE_PRESETS: Record<string, string> = {
  Minimal: "Fade In",
  Modern: "Fade Up",
  "Apple Style": "Scale",
  Linear: "Slide Up",
  "Premium SaaS": "Stagger Cards",
  Creative: "Morph",
  Glass: "Blur In",
  Corporate: "Fade Up",
  Playful: "Bounce",
};

function presetToVariant(preset: string, intensity: number, disabled: boolean) {
  if (disabled) return { hidden: { opacity: 1, y: 0, scale: 1, x: 0 }, visible: { opacity: 1, y: 0, scale: 1, x: 0 } };
  const amount = Math.max(0.15, intensity);
  const base = {
    hidden: { opacity: 0, y: 24 * amount, x: 0, scale: 1, rotate: 0, filter: "blur(0px)" },
    visible: { opacity: 1, y: 0, x: 0, scale: 1, rotate: 0, filter: "blur(0px)" },
  };
  switch (preset) {
    case "Fade Down":
      return { hidden: { ...base.hidden, y: -24 * amount }, visible: base.visible };
    case "Fade Left":
      return { hidden: { ...base.hidden, x: -28 * amount, y: 0 }, visible: base.visible };
    case "Fade Right":
      return { hidden: { ...base.hidden, x: 28 * amount, y: 0 }, visible: base.visible };
    case "Scale":
    case "Zoom In":
      return { hidden: { ...base.hidden, scale: 0.88 }, visible: base.visible };
    case "Zoom Out":
      return { hidden: { ...base.hidden, scale: 1.1 }, visible: base.visible };
    case "Slide Up":
      return { hidden: { ...base.hidden, y: 30 * amount }, visible: base.visible };
    case "Slide Down":
      return { hidden: { ...base.hidden, y: -30 * amount }, visible: base.visible };
    case "Slide Left":
      return { hidden: { ...base.hidden, x: -36 * amount, y: 0 }, visible: base.visible };
    case "Slide Right":
      return { hidden: { ...base.hidden, x: 36 * amount, y: 0 }, visible: base.visible };
    case "Rotate":
      return { hidden: { ...base.hidden, rotate: -10 * amount }, visible: base.visible };
    case "Flip X":
      return { hidden: { ...base.hidden, rotateX: 75 * amount }, visible: base.visible };
    case "Flip Y":
      return { hidden: { ...base.hidden, rotateY: 75 * amount }, visible: base.visible };
    case "Blur In":
      return { hidden: { ...base.hidden, opacity: 0, filter: `blur(${10 * amount}px)` }, visible: base.visible };
    case "Bounce":
      return { hidden: { ...base.hidden, y: 36 * amount }, visible: base.visible };
    case "Elastic":
      return { hidden: { ...base.hidden, scale: 0.7 }, visible: base.visible };
    case "Float":
      return { hidden: { ...base.hidden, y: 16 * amount }, visible: base.visible };
    case "Pop":
      return { hidden: { ...base.hidden, scale: 0.8 }, visible: base.visible };
    case "Reveal":
      return { hidden: { ...base.hidden, opacity: 0, y: 12 * amount }, visible: base.visible };
    case "Stagger Cards":
      return { hidden: { ...base.hidden, opacity: 0, y: 20 * amount }, visible: base.visible };
    case "Parallax":
      return { hidden: { ...base.hidden, y: 14 * amount }, visible: base.visible };
    case "Morph":
      return { hidden: { ...base.hidden, scale: 0.92, borderRadius: "28px" }, visible: base.visible };
    case "3D Rotate":
      return { hidden: { ...base.hidden, rotateX: 55 * amount, rotateY: -10 * amount }, visible: base.visible };
    case "Skew":
      return { hidden: { ...base.hidden, skewX: -10 * amount }, visible: base.visible };
    case "Typewriter":
      return { hidden: { ...base.hidden, opacity: 0 }, visible: base.visible };
    case "Counter Animation":
      return { hidden: { ...base.hidden, opacity: 0 }, visible: base.visible };
    case "Progress Bar Fill":
      return { hidden: { ...base.hidden, scaleX: 0, originX: 0 }, visible: { ...base.visible, scaleX: 1, originX: 0 } };
    default:
      return { hidden: { ...base.hidden, opacity: 0, y: 20 * amount }, visible: base.visible };
  }
}

export function AnimationEditor({ data, onChange }: { data: SiteData; onChange: (next: SiteData) => void }) {
  const [previewSection, setPreviewSection] = useState<string | null>(null);
  const [previewNonce, setPreviewNonce] = useState<Record<string, number>>({});
  const prefersReducedMotion = useReducedMotion();
  const animations = data.websiteControl?.animations || {};
  const setSection = (sectionId: string, patch: Record<string, unknown>) =>
    onChange({
      ...data,
      websiteControl: {
        ...data.websiteControl,
        animations: {
          ...animations,
          [sectionId]: { ...defaultAnimationConfig(sectionId), ...(animations[sectionId] || {}), ...patch },
        },
      },
    });

  const applyTemplateToAll = (templateName: string) => {
    const preset = TEMPLATE_PRESETS[templateName] || "Fade In";
    const next = { ...animations };
    for (const sectionId of ANIMATION_SECTIONS) {
      next[sectionId] = { ...defaultAnimationConfig(sectionId), ...(next[sectionId] || {}), preset };
    }
    onChange({ ...data, websiteControl: { ...data.websiteControl, animations: next } });
  };

  const setAllAnimations = (enabled: boolean) => {
    const next = { ...animations };
    for (const sectionId of ANIMATION_SECTIONS) {
      next[sectionId] = { ...defaultAnimationConfig(sectionId), ...(next[sectionId] || {}), enabled };
    }
    onChange({ ...data, websiteControl: { ...data.websiteControl, animations: next } });
  };

  const resetAllAnimations = () => {
    const next = { ...animations };
    for (const sectionId of ANIMATION_SECTIONS) {
      next[sectionId] = defaultAnimationConfig(sectionId);
    }
    onChange({ ...data, websiteControl: { ...data.websiteControl, animations: next } });
  };

  const replayPreview = (sectionId: string) => {
    setPreviewSection(sectionId);
    setPreviewNonce((current) => ({ ...current, [sectionId]: (current[sectionId] || 0) + 1 }));
  };

  return (
    <div className="space-y-6">
      <section className="rounded-[30px] border border-admin-border bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(243,246,255,0.96))] p-5 shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
        <h3 className="text-lg font-semibold text-admin-text">Website Animations</h3>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-admin-text-muted">
          These settings control how each section enters on the public website.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {ANIMATION_TEMPLATE_NAMES.map((name) => (
            <button key={name} type="button" className="rounded-full border border-[#BFDBFE] bg-[#EFF6FF] px-4 py-2 text-sm font-semibold text-[#1D4ED8] shadow-[0_12px_24px_rgba(37,99,235,0.10)] transition hover:-translate-y-0.5" onClick={() => applyTemplateToAll(name)}>
              Apply {name} to All
            </button>
          ))}
          <button type="button" className="rounded-full border border-[#BFDBFE] bg-white px-4 py-2 text-sm font-semibold text-[#1D4ED8]" onClick={() => setAllAnimations(true)}>
            Enable All Animations
          </button>
          <button type="button" className="rounded-full border border-[#BFDBFE] bg-white px-4 py-2 text-sm font-semibold text-[#1D4ED8]" onClick={() => setAllAnimations(false)}>
            Disable All Animations
          </button>
          <button type="button" className="rounded-full border border-[#E2E8F0] bg-white px-4 py-2 text-sm font-semibold text-text-main" onClick={resetAllAnimations}>
            Reset All to Default
          </button>
        </div>
      </section>

      <div className="grid gap-4">
        {ANIMATION_TEMPLATE_NAMES.map((name) => (
          <span key={name} className="sr-only" />
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
      {ANIMATION_SECTIONS.map((sectionId) => {
        const value = { ...defaultAnimationConfig(sectionId), ...(animations[sectionId] || {}) };
        const sectionTitle = SECTION_LABELS[sectionId] || sectionId;
        const variant = presetToVariant(String(value.preset), Number(value.intensity ?? 0.7), Boolean(prefersReducedMotion));
        const previewKey = `${sectionId}-${previewNonce[sectionId] || 0}`;
        return (
          <section key={sectionId} className={`rounded-[30px] border border-admin-border bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.08)] transition ${previewSection === sectionId ? "ring-2 ring-[#93C5FD]" : ""}`}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-admin-text">{sectionTitle}</h3>
                <p className="mt-1 text-xs uppercase tracking-[0.2em] text-admin-text-muted">{sectionId}</p>
              </div>
              <div className="flex gap-2">
                <button type="button" className="rounded-full border border-[#BFDBFE] bg-[#EFF6FF] px-4 py-2 text-sm font-semibold text-[#1D4ED8]" onClick={() => replayPreview(sectionId)}>
                  Preview Animation
                </button>
                <button type="button" className="rounded-full border border-[#E2E8F0] bg-white px-4 py-2 text-sm font-semibold text-text-main" onClick={() => setSection(sectionId, defaultAnimationConfig(sectionId))}>
                  Reset to Default
                </button>
              </div>
            </div>

            <div className="mt-4 rounded-3xl border border-[#E2E8F0] bg-[linear-gradient(180deg,rgba(248,251,255,1),rgba(255,255,255,1))] p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-admin-text-muted">Preview</p>
                  <p className="text-sm text-admin-text-muted">Replay the current preset without saving.</p>
                </div>
                {value.enabled ? null : <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">Animation is disabled for this section.</span>}
              </div>
              <motion.div
                key={previewKey}
                initial="hidden"
                animate="visible"
                variants={variant}
                transition={{
                  duration: Number(value.duration || 0.6),
                  delay: Number(value.delay || 0),
                  type: value.preset === "Bounce" ? "spring" : "tween",
                  stiffness: 140,
                  damping: 16,
                }}
                className="overflow-hidden rounded-2xl border border-[#BFDBFE] bg-white p-4 shadow-[0_14px_35px_rgba(37,99,235,0.08)]"
                style={{ transformStyle: "preserve-3d", perspective: 1000 }}
              >
                <motion.div
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: Number(value.delay || 0) + 0.05 }}
                  className="space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="text-lg font-semibold text-admin-text">{sectionTitle}</h4>
                      <p className="text-sm text-admin-text-muted">Sample section title</p>
                    </div>
                    <span className="rounded-full border border-[#BFDBFE] bg-[#EFF6FF] px-3 py-1 text-xs font-semibold text-[#1D4ED8]">
                      {String(value.preset)}
                    </span>
                  </div>

                  <motion.div
                    initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: Math.max(0.25, Number(value.duration || 0.6)), delay: Number(value.delay || 0) + 0.08, staggerChildren: Number(value.stagger || 0.08) }}
                    className="rounded-2xl border border-dashed border-[#C7D2FE] bg-[#F8FAFF] p-4"
                  >
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-2xl bg-white p-4 shadow-sm">
                        <div className="h-3 w-20 rounded-full bg-slate-200" />
                        <div className="mt-3 h-4 w-3/4 rounded-full bg-slate-300" />
                        <div className="mt-2 h-3 w-full rounded-full bg-slate-200" />
                        <div className="mt-4 h-24 rounded-2xl bg-gradient-to-br from-[#DBEAFE] to-[#EFF6FF]" />
                      </div>
                      <div className="flex flex-col justify-between rounded-2xl bg-white p-4 shadow-sm">
                        <div className="space-y-3">
                          <div className="h-4 w-28 rounded-full bg-slate-200" />
                          <div className="h-10 rounded-full bg-slate-300" />
                          <div className="h-10 rounded-full bg-slate-200" />
                          <div className="h-10 rounded-full bg-slate-200" />
                        </div>
                        <button type="button" className="mt-4 inline-flex w-fit items-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white">
                          Sample Button
                        </button>
                      </div>
                    </div>
                  </motion.div>

                  <p className="text-xs leading-6 text-admin-text-muted">
                    Preset: {String(value.preset)} · Trigger: {String(value.trigger)} · Duration: {String(value.duration)}s · Delay: {String(value.delay)}s · Stagger: {String(value.stagger)}s · Intensity: {String(value.intensity)}
                  </p>
                </motion.div>
              </motion.div>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <label className="flex items-center gap-3 rounded-2xl border border-admin-border bg-admin-input px-4 py-3 text-sm font-medium text-admin-text">
                <input type="checkbox" checked={Boolean(value.enabled)} onChange={(e) => setSection(sectionId, { enabled: e.target.checked })} />
                Enable Animation
              </label>

              <div className="space-y-1">
                <label className="text-sm font-medium text-admin-text">Preset</label>
                <select className="w-full rounded-2xl border border-admin-border bg-admin-input px-4 py-3 text-admin-text" value={String(value.preset)} onChange={(e) => setSection(sectionId, { preset: e.target.value })}>
                  {ANIMATION_PRESETS.map((p) => <option key={p}>{p}</option>)}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-admin-text">Trigger</label>
                <select className="w-full rounded-2xl border border-admin-border bg-admin-input px-4 py-3 text-admin-text" value={String(value.trigger)} onChange={(e) => setSection(sectionId, { trigger: e.target.value })}>
                  {ANIMATION_TRIGGERS.map((trigger) => <option key={trigger}>{trigger}</option>)}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-admin-text">Duration</label>
                <input className="w-full rounded-2xl border border-admin-border bg-admin-input px-4 py-3 text-admin-text" type="number" step="0.05" value={Number(value.duration)} onChange={(e) => setSection(sectionId, { duration: Number(e.target.value) })} />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-admin-text">Delay</label>
                <input className="w-full rounded-2xl border border-admin-border bg-admin-input px-4 py-3 text-admin-text" type="number" step="0.05" value={Number(value.delay)} onChange={(e) => setSection(sectionId, { delay: Number(e.target.value) })} />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-admin-text">Stagger</label>
                <input className="w-full rounded-2xl border border-admin-border bg-admin-input px-4 py-3 text-admin-text" type="number" step="0.05" value={Number(value.stagger)} onChange={(e) => setSection(sectionId, { stagger: Number(e.target.value) })} />
              </div>

              <label className="flex items-center gap-3 rounded-2xl border border-admin-border bg-admin-input px-4 py-3 text-sm font-medium text-admin-text">
                <input type="checkbox" checked={Boolean(value.once)} onChange={(e) => setSection(sectionId, { once: e.target.checked })} />
                Once Only
              </label>

              <label className="flex items-center gap-3 rounded-2xl border border-admin-border bg-admin-input px-4 py-3 text-sm font-medium text-admin-text">
                <input type="checkbox" checked={Boolean(value.mobile)} onChange={(e) => setSection(sectionId, { mobile: e.target.checked })} />
                Mobile Enabled
              </label>

              <label className="flex items-center gap-3 rounded-2xl border border-admin-border bg-admin-input px-4 py-3 text-sm font-medium text-admin-text">
                <input type="checkbox" checked={Boolean(value.tablet)} onChange={(e) => setSection(sectionId, { tablet: e.target.checked })} />
                Tablet Enabled
              </label>

              <label className="flex items-center gap-3 rounded-2xl border border-admin-border bg-admin-input px-4 py-3 text-sm font-medium text-admin-text">
                <input type="checkbox" checked={Boolean(value.desktop)} onChange={(e) => setSection(sectionId, { desktop: e.target.checked })} />
                Desktop Enabled
              </label>
            </div>
          </section>
        );
      })}
      </div>
    </div>
  );
}
