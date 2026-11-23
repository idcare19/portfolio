
"use client";

import { useEffect, useMemo, useState } from "react";
import type { SiteSectionBlock } from "@/src/types/site-data";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  ArrowUpRight,
  Building2,
  CalendarDays,
  LockKeyhole,
} from "lucide-react";

import {
  filterHomepageItems,
  getHomepageButtonLabel,
  getHomepageDisplayConfig,
  shouldShowViewMore,
  debugHomepageDisplay,
  normalizeHomepageDisplayConfig,
} from "@/lib/homepage-display-controls";

import { useSiteDataContext } from "@/components/site/SiteDataProvider";

function cleanText(value: unknown) {
  return String(value ?? "").trim();
}

function isTruthy(value: unknown) {
  if (typeof value === "boolean") return value;

  const raw = cleanText(value).toLowerCase();

  return ["true", "1", "yes"].includes(raw);
}

function resolveCompanyLogo(item: any) {
  return cleanText(item?.logo || item?.image || item?.thumbnail);
}

function formatCompanyDate(value: unknown) {
  const raw = cleanText(value);

  if (!raw) return "";

  const parsed = new Date(raw);

  if (Number.isNaN(parsed.getTime())) return raw;

  return new Intl.DateTimeFormat("en-GB", {
    month: "long",
    year: "numeric",
  }).format(parsed);
}

export function CompaniesSection({
  section,
}: {
  section: SiteSectionBlock;
}) {
  const siteData = useSiteDataContext();
  const pathname = usePathname();

  const isHomepage = pathname === "/";

  const homepageSettings = getHomepageDisplayConfig(
    siteData,
    "companies"
  );

  const normalized = normalizeHomepageDisplayConfig(homepageSettings);

  const initialItems = Math.max(1, Number(normalized.initialItems || 3));
  const loadCount = Math.max(1, Number(normalized.loadCount || 3));

  const [loadedCount, setLoadedCount] = useState(initialItems);

  useEffect(() => {
    setLoadedCount(initialItems);
  }, [initialItems]);

  const sourceItems = section?.items || [];

  const allItems = useMemo(
    () =>
      filterHomepageItems(sourceItems, {
        ...homepageSettings,
        limit: undefined,
        itemsLimit: undefined,
        showOnlyFeatured: false,
        manualItemOrder: undefined,
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
    "companies",
    sourceItems.length,
    items.length,
    homepageSettings
  );

  return (
    <section
      id="companies"
      aria-labelledby="companies-heading"
      className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
    >
      <div className="relative overflow-hidden rounded-[24px] border border-[rgb(var(--border))] bg-[rgb(var(--section))] p-5 shadow-sm transition-colors duration-300 sm:rounded-[28px] sm:p-8 lg:p-10">

        {/* Header */}
        <div className="relative">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--surface))] px-3.5 py-1.5">
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: "rgb(var(--primary))" }}
            />

            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted">
              {String(section.data?.eyebrow || "Experience")}
            </p>
          </div>

          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <h2
                id="companies-heading"
                className="text-3xl font-bold tracking-tight text-text-main sm:text-4xl"
              >
                {String(
                  section.data?.title || "Companies Worked With"
                )}
                <span style={{ color: "rgb(var(--primary))" }}>.</span>
              </h2>

              <p className="mt-2 max-w-xl text-sm leading-7 text-text-muted sm:text-base">
                Organizations, collaborations and professional
                relationships.
              </p>
            </div>

            <span className="text-xs font-medium text-text-muted">
              {items.length} of {allItems.length} companies
            </span>
          </div>
        </div>

        {/* Company cards */}
        <div className="relative mt-9 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((item: any, index: number) => {
            const confidential = isTruthy(item.confidential);

            const companyName = cleanText(
              item.companyName || item.title || "Company"
            );

            const logo = resolveCompanyLogo(item);

            const startDate = formatCompanyDate(item.startDate);
            const endDate = formatCompanyDate(item.endDate);

            const websiteUrl = cleanText(item.websiteUrl);

            const initials = companyName
              .split(/\s+/)
              .filter(Boolean)
              .slice(0, 2)
              .map((word: string) => word[0])
              .join("")
              .toUpperCase();

            return (
              <article
                key={
                  item.id ??
                  item.slug ??
                  `${companyName}-${index}`
                }
                className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-[rgb(var(--border))] bg-[rgb(var(--card-bg))] shadow-[0_8px_28px_rgba(15,23,42,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-[rgb(var(--primary))] hover:shadow-[0_20px_45px_rgba(15,23,42,0.10)]"
              >
                {/* Top accent */}
                <div
                  aria-hidden="true"
                  className="absolute left-0 top-0 z-10 h-[2px] w-0 transition-all duration-500 group-hover:w-full"
                  style={{ background: "rgb(var(--primary))" }}
                />

                {/* Logo area */}
                <div className="relative flex min-h-[150px] items-center justify-center overflow-hidden border-b border-[rgb(var(--border))] bg-[rgb(var(--surface))] px-6 py-7">
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 opacity-[0.045]"
                    style={{
                      backgroundImage:
                        "radial-gradient(rgb(var(--text-muted)) 0.7px, transparent 0.7px)",
                      backgroundSize: "12px 12px",
                    }}
                  />

                  {confidential ? (
                    <div className="relative flex flex-col items-center text-center">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-dashed border-[rgb(var(--border))] bg-[rgb(var(--card-bg))] text-text-muted">
                        <LockKeyhole className="h-6 w-6" />
                      </div>

                      <p className="mt-3 text-xs font-semibold text-text-muted">
                        Confidential Client
                      </p>
                    </div>
                  ) : logo ? (
                    <img
                      src={logo}
                      alt={`${companyName} logo`}
                      loading="lazy"
                      className="relative max-h-16 max-w-[72%] object-contain transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div
                      className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-[rgb(var(--border))] text-lg font-bold"
                      style={{
                        background:
                          "color-mix(in srgb, rgb(var(--primary)) 10%, rgb(var(--card-bg)))",
                        color: "rgb(var(--primary))",
                      }}
                    >
                      {initials || <Building2 className="h-7 w-7" />}
                    </div>
                  )}
                </div>

                {/* Company details */}
                <div className="flex flex-1 flex-col p-5 sm:p-6">
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span
                        className="text-[10px] font-bold uppercase tracking-[0.17em]"
                        style={{ color: "rgb(var(--primary))" }}
                      >
                        {cleanText(item.relationshipType) ||
                          "Collaboration"}
                      </span>

                      {confidential && (
                        <span className="inline-flex items-center gap-1 rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--surface))] px-2.5 py-1 text-[10px] font-semibold text-text-muted">
                          <LockKeyhole className="h-3 w-3" />
                          Private
                        </span>
                      )}
                    </div>

                    <h3 className="mt-3 text-lg font-bold tracking-tight text-text-main">
                      {confidential ? "Confidential Client" : companyName}
                    </h3>

                    {cleanText(item.industry) && (
                      <p className="mt-1 text-sm text-text-muted">
                        {cleanText(item.industry)}
                      </p>
                    )}
                  </div>

                  {cleanText(item.description) && (
                    <p className="mt-4 text-sm leading-7 text-text-muted">
                      {cleanText(item.description)}
                    </p>
                  )}

                  {/* Duration */}
                  {(startDate || endDate) && (
                    <div className="mt-5 flex items-start gap-3 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-3.5">
                      <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-text-muted" />

                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
                          Duration
                        </p>

                        <p className="mt-1 text-xs font-medium text-text-main">
                          {startDate || "Unknown"} — {endDate || "Current"}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Action */}
                  <div className="mt-auto pt-6">
                    {!confidential && websiteUrl ? (
                      <a
                        href={websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Visit ${companyName} website`}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                        style={{ background: "rgb(var(--primary))" }}
                      >
                        Visit Website
                        <ArrowUpRight className="h-4 w-4" />
                      </a>
                    ) : confidential ? (
                      <div className="flex items-center justify-center gap-2 rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--surface))] px-5 py-3 text-xs font-medium text-text-muted">
                        <LockKeyhole className="h-3.5 w-3.5" />
                        Client details protected
                      </div>
                    ) : (
                      <div className="flex items-center justify-center rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--surface))] px-5 py-3 text-xs font-medium text-text-muted">
                        Company profile
                      </div>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
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
                  "All Companies Loaded"
                )}
              </button>
            ) : (
              <Link
                href={homepageSettings.fullPageUrl || "/companies"}
                className="inline-flex items-center gap-3 rounded-full px-7 py-3.5 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
                style={{ background: "rgb(var(--primary))" }}
              >
                {getHomepageButtonLabel(homepageSettings)}
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
