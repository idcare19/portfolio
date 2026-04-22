"use client";

import { AnimatedSection } from "@/components/effects/AnimatedSection";
import { FadeInUp } from "@/components/effects/FadeInUp";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { portfolioData } from "@/data/portfolio";
import {
  Briefcase,
  ChevronLeft,
  ChevronRight,
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
import { useCallback, useEffect, useRef, useState, type PointerEvent, type WheelEvent } from "react";

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
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [hasOverflow, setHasOverflow] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const syncScrollButtons = useCallback(() => {
    const rail = railRef.current;
    if (!rail) return;

    const maxScroll = Math.max(0, rail.scrollWidth - rail.clientWidth);
    setHasOverflow(maxScroll > 4);
    setCanScrollPrev(rail.scrollLeft > 4);
    setCanScrollNext(rail.scrollLeft < maxScroll - 4);
  }, []);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    syncScrollButtons();

    const onScroll = () => syncScrollButtons();
    rail.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      rail.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [syncScrollButtons]);

  const scrollRail = useCallback((direction: -1 | 1, loopAtEdge = false) => {
    const rail = railRef.current;
    if (!rail) return;

    const maxScroll = Math.max(0, rail.scrollWidth - rail.clientWidth);
    if (maxScroll <= 4) return;

    const offset = Math.max(260, rail.clientWidth * 0.78);
    if (direction > 0) {
      const nextLeft = rail.scrollLeft + offset;
      if (loopAtEdge && nextLeft >= maxScroll - 4) {
        rail.scrollTo({ left: 0, behavior: "smooth" });
        return;
      }
      rail.scrollBy({ left: offset, behavior: "smooth" });
      return;
    }

    const prevLeft = rail.scrollLeft - offset;
    if (loopAtEdge && prevLeft <= 4) {
      rail.scrollTo({ left: maxScroll, behavior: "smooth" });
      return;
    }

    rail.scrollBy({ left: -offset, behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (!hasOverflow || isHovering || dragState.current.active) return;

    const interval = setInterval(() => {
      scrollRail(1, true);
    }, 3200);

    return () => clearInterval(interval);
  }, [hasOverflow, isHovering, scrollRail]);

  function handleWheel(event: WheelEvent<HTMLDivElement>) {
    const rail = railRef.current;
    if (!rail) return;

    const hasHorizontalOverflow = rail.scrollWidth - rail.clientWidth > 4;
    if (!hasHorizontalOverflow) return;

    const dominantDelta = Math.abs(event.deltaY) >= Math.abs(event.deltaX) ? event.deltaY : event.deltaX;
    if (dominantDelta === 0) return;

    rail.scrollLeft += dominantDelta;
    event.preventDefault();
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    const rail = railRef.current;
    if (!rail) return;

    dragState.current = {
      active: true,
      startX: event.clientX,
      startLeft: rail.scrollLeft,
    };

    event.preventDefault();
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
          <div className="mb-3 hidden items-center justify-end gap-2 md:flex">
            <button
              type="button"
              onClick={() => scrollRail(-1)}
              disabled={!canScrollPrev}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 transition hover:border-blue-300 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Scroll reviews left"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => scrollRail(1)}
              disabled={!canScrollNext}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 transition hover:border-blue-300 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Scroll reviews right"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 hidden w-8 bg-gradient-to-r from-slate-50 to-transparent md:block" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 hidden w-8 bg-gradient-to-l from-slate-50 to-transparent md:block" />

            <div
              ref={railRef}
              onWheel={handleWheel}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              onPointerLeave={handlePointerUp}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              className="reviews-scroll -mx-2 flex snap-x snap-mandatory gap-4 overflow-x-auto overflow-y-hidden px-2 pb-2 touch-pan-x md:cursor-grab md:gap-5 md:active:cursor-grabbing sm:-mx-4 sm:px-4"
            >
              <div aria-hidden className="w-[4px] shrink-0" />
              {portfolioData.reviews.map((review, index) => {
                const ReviewIcon = getReviewIcon(review.icon);

                return (
                  <article
                    key={`${review.clientName}-${index}`}
                    className="glass flex-shrink-0 snap-start rounded-3xl p-6 shadow-[0_10px_24px_rgba(15,23,42,0.06)] transition-transform duration-200 hover:-translate-y-0.5 w-[calc(100%-1rem)] sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1rem)]"
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
                );
              })}
              <div aria-hidden className="w-[2rem] shrink-0" />
            </div>
          </div>
        </FadeInUp>
      </div>
    </AnimatedSection>
  );
}
