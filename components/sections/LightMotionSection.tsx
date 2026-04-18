"use client";

import { AnimatedSection } from "@/components/effects/AnimatedSection";
import { SectionHeader } from "@/components/ui/SectionHeader";

const motionTags = [
  "⚡ Fast UI",
  "🎉 Fun Motion",
  "💫 Smooth Flow",
  "🚀 Snappy",
  "🌈 Color Pop",
  "🫧 Light Feel",
  "📱 Mobile Ready",
];

const bubbles = [
  { emoji: "✨", className: "left-[8%] top-[24%] animate-float-medium" },
  { emoji: "🎈", className: "left-[22%] top-[68%] animate-float-reverse" },
  { emoji: "⚡", className: "left-[44%] top-[20%] animate-float-slow" },
  { emoji: "🎊", className: "left-[66%] top-[64%] animate-float-medium" },
  { emoji: "💙", className: "left-[84%] top-[30%] animate-float-reverse" },
];

export function LightMotionSection() {
  return (
    <AnimatedSection id="light-motion" className="py-10 md:py-14">
      <div className="section-wrap">
        <SectionHeader
          eyebrow="Motion"
          title="Fun moving animation"
          description="Playful, colorful motion that feels alive without weighing down performance."
        />

        <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white/80 p-4 shadow-[0_14px_30px_rgba(15,23,42,0.06)] sm:p-6">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(59,130,246,0.12),transparent_35%),radial-gradient(circle_at_82%_20%,rgba(6,182,212,0.1),transparent_30%),radial-gradient(circle_at_50%_100%,rgba(139,92,246,0.1),transparent_40%)]" />
          {bubbles.map((bubble) => (
            <span
              key={`${bubble.emoji}-${bubble.className}`}
              aria-hidden
              className={`pointer-events-none absolute z-10 text-lg opacity-80 sm:text-xl ${bubble.className}`}
            >
              {bubble.emoji}
            </span>
          ))}

          <div className="relative z-10 space-y-2">
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white/85 py-2">
              <div className="marquee-track flex gap-3 whitespace-nowrap px-3 [animation-duration:16s] sm:gap-4 sm:px-4">
                {motionTags.concat(motionTags).map((item, index) => (
                  <span
                    key={`${item}-${index}`}
                    className="inline-flex rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white/85 py-2">
              <div className="marquee-track-reverse flex gap-3 whitespace-nowrap px-3 [animation-duration:18s] sm:gap-4 sm:px-4">
                {motionTags.concat(motionTags).map((item, index) => (
                  <span
                    key={`rev-${item}-${index}`}
                    className="inline-flex rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-700"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
