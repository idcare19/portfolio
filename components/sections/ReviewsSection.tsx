"use client";

import { AnimatedSection } from "@/components/effects/AnimatedSection";
import { FadeInUp } from "@/components/effects/FadeInUp";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { portfolioData } from "@/data/portfolio";
import {
  Briefcase,
  Code2,
  ExternalLink,
  Globe,
  Quote,
  Sparkles,
  Star,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { useRef, type PointerEvent, type WheelEvent } from "react";

const reviewIconMap: Record<string, LucideIcon> = {
  code2: Code2,
  user: UserRound,
  briefcase: Briefcase,
  globe: Globe,
  sparkles: Sparkles,
  star: Star,
};

function getReviewIcon(icon?: string): LucideIcon {
  if (!icon) return Code2;
  return reviewIconMap[icon.toLowerCase()] || Code2;
}

export function ReviewsSection() {
  const railRef = useRef<HTMLDivElement | null>(null);
  const dragState = useRef<{ active: boolean; startX: number; startLeft: number }>({
    active: false,
    startX: 0,
    startLeft: 0,
  });

  function handleWheel(event: WheelEvent<HTMLDivElement>) {
    const rail = railRef.current;
    if (!rail) return;

    if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
      rail.scrollLeft += event.deltaY;
      event.preventDefault();
    }
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    const rail = railRef.current;
    if (!rail) return;

    dragState.current = {
      active: true,
      startX: event.clientX,
      startLeft: rail.scrollLeft,
    };

    rail.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!dragState.current.active) return;
    const rail = railRef.current;
    if (!rail) return;

    const delta = event.clientX - dragState.current.startX;
    rail.scrollLeft = dragState.current.startLeft - delta;
  }

  function handlePointerUp(event: PointerEvent<HTMLDivElement>) {
    const rail = railRef.current;
    if (rail?.hasPointerCapture(event.pointerId)) {
      rail.releasePointerCapture(event.pointerId);
    }
    dragState.current.active = false;
  }

  return (
    <AnimatedSection id="reviews" className="py-20">
      <div className="section-wrap">
        <SectionHeader
          eyebrow="Client Reviews"
          title="What clients say"
          description="Feedback from recent portfolio projects delivered for clients."
        />

        <FadeInUp>
          <div
            ref={railRef}
            onWheel={handleWheel}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            className="reviews-scroll -mx-2 flex snap-x snap-mandatory gap-4 overflow-x-auto px-2 pb-2 touch-pan-x md:gap-5"
          >
            <div aria-hidden className="w-[4px] shrink-0" />
            {portfolioData.reviews.map((review, index) => {
              const ReviewIcon = getReviewIcon(review.icon);

              return (
              <article
                key={`${review.clientName}-${index}`}
                className="glass w-[clamp(260px,78vw,380px)] snap-start shrink-0 rounded-3xl p-6 shadow-[0_10px_24px_rgba(15,23,42,0.06)] transition-transform duration-200 hover:-translate-y-0.5"
              >

                <Quote className="h-5 w-5 text-blue-600" />
                <p className="mt-3 text-sm leading-relaxed text-slate-600">"{review.quote}"</p>

                <div className="mt-5 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
                  <p className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-white">
                      <ReviewIcon className="h-3.5 w-3.5" />
                    </span>
                    {review.clientName}
                  </p>
                  <Link
                    href={review.website}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex w-full items-center justify-center gap-1.5 rounded-full border border-blue-300 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 transition-colors duration-200 hover:border-blue-500 hover:bg-blue-100 sm:w-auto"
                  >
                    Visit Site <ExternalLink className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </article>
            )})}
            <div aria-hidden className="w-[10vw] shrink-0" />
          </div>
        </FadeInUp>
      </div>
    </AnimatedSection>
  );
}
