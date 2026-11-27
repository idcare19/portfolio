"use client";

import { AnimatedSection } from "@/components/effects/AnimatedSection";
import { useSectionData, useSiteDataContext } from "@/components/site/SiteDataProvider";
import { SectionHeader } from "@/components/ui/SectionHeader";
import {
  ArrowRight,
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
import { usePathname } from "next/navigation";
import {
  filterHomepageItems,
  getHomepageButtonLabel,
  getHomepageDisplayConfig,
  shouldShowViewMore,
  debugHomepageDisplay,
} from "@/lib/homepage-display-controls";
import {
  ThreeDScrollTriggerContainer,
  ThreeDScrollTriggerRow,
} from "@/components/lightswind/ThreeDScrollTrigger";

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

function normalizeHref(value?: string) {
  const href = String(value || "").trim();
  if (!href) return "";
  if (href.toLowerCase() === "none") return "";
  if (/^[a-z][a-z0-9+.-]*:\/\//i.test(href)) return href;
  if (href.startsWith("/") || href.startsWith("#")) return href;
  return "";
}

type Review = {
  clientName: string;
  roleCompany?: string;
  website?: string;
  quote: string;
  icon?: string;
};

function ReviewCard({ review, hidden = false }: { review: Review; hidden?: boolean }) {
  const ReviewIcon = getReviewIcon(review.icon);
  const href = normalizeHref(review.website);
  const isExternal = href.startsWith("http");

  return (
    <article
      aria-hidden={hidden || undefined}
      className="glass group relative flex h-[236px] w-[min(85vw,23rem)] flex-shrink-0 snap-start flex-col overflow-hidden whitespace-normal rounded-[28px] p-6 shadow-[0_18px_42px_rgba(15,23,42,0.06)] isolate transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_24px_52px_rgba(37,99,235,0.12)] sm:w-[24rem]"
    >
      {/* Oversized quote mark as a quiet background accent */}
      <Quote
        aria-hidden
        className="pointer-events-none absolute -right-2 -top-2 -z-10 h-24 w-24 rotate-6 text-primary/[0.07]"
      />

      <p className="relative z-10 line-clamp-4 flex-1 text-[15px] leading-relaxed text-text-main">
        &ldquo;{review.quote}&rdquo;
      </p>

      <div className="relative z-10 mt-4 flex items-center justify-between gap-3 border-t border-[rgb(var(--border))] pt-4">
        <div className="flex min-w-0 items-center gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary text-white shadow-[0_8px_18px_-6px_rgba(37,99,235,0.55)]">
            <ReviewIcon className="h-4.5 w-4.5" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-text-main">{review.clientName}</p>
            {review.roleCompany ? (
              <p className="truncate text-xs text-text-muted">{review.roleCompany}</p>
            ) : null}
          </div>
        </div>

        {href ? (
          <Link
            href={href}
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "noreferrer" : undefined}
            tabIndex={hidden ? -1 : undefined}
            aria-label={`Visit ${review.clientName}'s site`}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary transition-colors duration-200 hover:bg-primary hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            Visit
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        ) : null}
      </div>
    </article>
  );
}

export function ReviewsSection() {
  const section = useSectionData("reviews");
  const pathname = usePathname();
  const data = section.data as Record<string, any>;
  const reviewItems = Array.isArray(section.items) ? section.items : [];
  const homepageSettings = getHomepageDisplayConfig(useSiteDataContext(), "reviews");
  const isHomepage = pathname === "/";
  const fullReviews = filterHomepageItems(reviewItems, {
    showOnlyFeatured: false,
    manualItemOrder: undefined,
    limit: undefined,
    itemsLimit: undefined,
  });
  const visibleReviews = isHomepage
    ? filterHomepageItems(reviewItems, {
        ...homepageSettings,
        limit: homepageSettings.limit ?? homepageSettings.itemsLimit ?? 6,
      })
    : fullReviews;
  const showMore = isHomepage && shouldShowViewMore(fullReviews, visibleReviews, homepageSettings);
  debugHomepageDisplay("reviews", reviewItems.length, visibleReviews.length, homepageSettings);

  const reviews: Review[] = reviewItems.length
    ? visibleReviews.map((item: any) => ({
        clientName: item.clientName,
        roleCompany: item.roleCompany,
        website: item.website || item.websiteUrl || item.companyUrl || item.reviewerUrl,
        quote: item.message,
        icon: item.image,
      }))
    : [];

  return (
    <AnimatedSection id="reviews" className="bg-[rgb(var(--section-bg))] py-24">
      <div className="section-wrap">
        <SectionHeader eyebrow={data.eyebrow} title={data.title} description={data.description} />

        <ThreeDScrollTriggerContainer className="relative" aria-label="Client reviews">
          <ThreeDScrollTriggerRow
            baseVelocity={2.2}
            direction={1}
            tiltEffect
            className="[mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]"
          >
            <div className="flex gap-5 px-2 py-4 whitespace-normal">
              <div aria-hidden className="w-[4px] shrink-0" />
              {/* Second copy keeps the loop seamless; hidden from screen readers and Tab */}
              {[...reviews, ...reviews].map((review, index) => (
                <ReviewCard
                  key={`${review.clientName}-${index}`}
                  review={review}
                  hidden={index >= reviews.length}
                />
              ))}
              <div aria-hidden className="w-[2rem] shrink-0" />
            </div>
          </ThreeDScrollTriggerRow>
        </ThreeDScrollTriggerContainer>

        {isHomepage && showMore ? (
          <div className="mt-10 flex justify-center">
            <Link
              href={homepageSettings.fullPageUrl || "/reviews"}
              className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_28px_-8px_rgba(37,99,235,0.5)] transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              {getHomepageButtonLabel(homepageSettings)}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        ) : null}
      </div>
    </AnimatedSection>
  );
}