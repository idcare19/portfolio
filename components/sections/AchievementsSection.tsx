
"use client";

import { useEffect, useMemo, useState } from "react";
import type { SiteSectionBlock } from "@/src/types/site-data";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  filterHomepageItems,
  getHomepageButtonLabel,
  getHomepageDisplayConfig,
  shouldShowViewMore,
  debugHomepageDisplay,
  normalizeHomepageDisplayConfig,
} from "@/lib/homepage-display-controls";

import { useSiteDataContext } from "@/components/site/SiteDataProvider";
import { renderIcon } from "@/lib/skill-icons";

type AchievementItem = {
  id?: string | number;
  slug?: string;
  title?: string;
  metric?: string;
  description?: string;
  icon?: string;
  iconColor?: string;
  iconUrl?: string;
};

export function AchievementsSection({
  section,
}: {
  section: SiteSectionBlock;
}) {
  const siteData = useSiteDataContext();
  const pathname = usePathname();

  const isHomepage = pathname === "/";
  const homepageSettings = getHomepageDisplayConfig(
    siteData,
    "achievements"
  );

  const normalized = normalizeHomepageDisplayConfig(homepageSettings);

  const initialItems = Math.max(1, Number(normalized.initialItems || 3));
  const loadCount = Math.max(1, Number(normalized.loadCount || 3));

  const [loadedCount, setLoadedCount] = useState(initialItems);

  // Keep the initial count in sync with updated CMS settings.
  useEffect(() => {
    setLoadedCount(initialItems);
  }, [initialItems]);

  const sourceItems = (section?.items || []) as AchievementItem[];

  const allItems = useMemo(
    () =>
      filterHomepageItems(sourceItems, {
        showOnlyFeatured: false,
        manualItemOrder: undefined,
        limit: undefined,
        itemsLimit: undefined,
      }),
    [sourceItems]
  );

  const homepageItems = useMemo(
    () =>
      filterHomepageItems(sourceItems, {
        ...homepageSettings,
        limit:
          normalized.viewMoreMode === "load-more"
            ? loadedCount
            : Number(normalized.limit ?? normalized.itemsLimit ?? 6),
      }),
    [
      sourceItems,
      homepageSettings.limit,
      homepageSettings.itemsLimit,
      homepageSettings.showOnlyFeatured,
      homepageSettings.manualItemOrder?.join("|"),
      loadedCount,
      normalized.viewMoreMode,
      normalized.limit,
      normalized.itemsLimit,
    ]
  );

  const items = isHomepage ? homepageItems : allItems;

  const showMore =
    isHomepage && shouldShowViewMore(allItems, items, homepageSettings);

  const hasMoreItems = items.length < allItems.length;

  debugHomepageDisplay(
    "achievements",
    sourceItems.length,
    items.length,
    homepageSettings
  );

  return (
    <section
      id="achievements"
      aria-labelledby="achievements-heading"
      className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
    >
      <div className="relative overflow-hidden rounded-[28px] border border-[rgb(var(--border))] bg-[rgb(var(--section))] p-5 shadow-[0_18px_55px_rgba(15,23,42,0.06)] transition-colors duration-300 sm:rounded-[32px] sm:p-8 lg:p-10">

        {/* Subtle decorative background */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full opacity-[0.07] blur-3xl"
          style={{ background: "rgb(var(--primary))" }}
        />

        {/* Section heading */}
        <div className="relative">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--surface))] px-3.5 py-1.5">
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: "rgb(var(--primary))" }}
            />
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted">
              {String(section.data?.eyebrow || "Highlights")}
            </p>
          </div>

          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <h2
                id="achievements-heading"
                className="text-3xl font-bold tracking-tight text-text-main sm:text-4xl"
              >
                {String(section.data?.title || "Achievements")}
                <span style={{ color: "rgb(var(--primary))" }}>.</span>
              </h2>

              <p className="mt-2 max-w-xl text-sm leading-7 text-text-muted sm:text-base">
                Milestones, accomplishments and measurable progress along the
                journey.
              </p>
            </div>

            <span className="text-xs font-medium text-text-muted">
              {items.length} of {allItems.length} achievements
            </span>
          </div>
        </div>

        {/* Achievement cards */}
        <div className="relative mt-9 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((item: AchievementItem, index: number) => (
            <article
              key={item.id ?? item.slug ?? `${item.title}-${index}`}
              className="group relative overflow-hidden rounded-3xl border border-[rgb(var(--border))] bg-[rgb(var(--card-bg))] p-5 shadow-[0_8px_25px_rgba(15,23,42,0.035)] transition-all duration-300 hover:-translate-y-1 hover:border-[rgb(var(--primary))] hover:shadow-[0_18px_40px_rgba(15,23,42,0.09)] sm:p-6"
            >
              {/* Top accent */}
              <div
                aria-hidden="true"
                className="absolute left-0 top-0 h-[2px] w-0 transition-all duration-500 group-hover:w-full"
                style={{ background: "rgb(var(--primary))" }}
              />

              {/* Icon */}
              <div
                className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl border border-[rgb(var(--border))] transition-transform duration-300 group-hover:scale-105"
                style={{
                  background:
                    "color-mix(in srgb, rgb(var(--primary)) 10%, rgb(var(--card-bg)))",
                  color: item.iconColor || "rgb(var(--primary))",
                }}
              >
                {item.iconUrl ? (
                  <img
                    src={item.iconUrl}
                    alt=""
                    loading="lazy"
                    className="h-6 w-6 object-contain"
                  />
                ) : (
                  renderIcon(item.icon, item.iconColor, "h-5 w-5")
                )}
              </div>

              {/* Metric */}
              <div className="mt-6">
                <p
                  className="text-3xl font-bold tracking-tight sm:text-4xl"
                  style={{ color: "rgb(var(--primary))" }}
                >
                  {item.metric || "0"}
                </p>

                <h3 className="mt-3 text-lg font-semibold tracking-tight text-text-main">
                  {item.title || "Achievement"}
                </h3>

                <p className="mt-2 text-sm leading-7 text-text-muted">
                  {item.description || ""}
                </p>
              </div>

              {/* Bottom indicator */}
              <div className="mt-6 flex items-center justify-between border-t border-[rgb(var(--border))] pt-4">
                <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-text-muted">
                  Achievement
                </span>

                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 rounded-full opacity-50 transition-all duration-300 group-hover:scale-150 group-hover:opacity-100"
                  style={{ background: "rgb(var(--primary))" }}
                />
              </div>
            </article>
          ))}
        </div>

        {/* View more */}
        {showMore && (
          <div className="relative mt-9 flex justify-center">
            {normalized.viewMoreMode === "load-more" ? (
              <button
                type="button"
                disabled={!hasMoreItems}
                onClick={() =>
                  setLoadedCount((count) =>
                    Math.min(count + loadCount, allItems.length)
                  )
                }
                className="inline-flex items-center gap-3 rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--card-bg))] px-7 py-3.5 text-sm font-semibold text-text-main shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[rgb(var(--primary))] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
              >
                {hasMoreItems ? (
                  <>
                    {getHomepageButtonLabel(homepageSettings)}
                    <span aria-hidden="true">↓</span>
                  </>
                ) : (
                  "All Achievements Loaded"
                )}
              </button>
            ) : (
              <Link
                href={homepageSettings.fullPageUrl || "/achievements"}
                className="inline-flex items-center gap-3 rounded-full px-7 py-3.5 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
                style={{ background: "rgb(var(--primary))" }}
              >
                {getHomepageButtonLabel(homepageSettings)}
                <span aria-hidden="true">→</span>
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
