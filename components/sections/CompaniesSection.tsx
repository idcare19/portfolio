"use client";

import { useMemo, useState } from "react";
import type { SiteSectionBlock } from "@/src/types/site-data";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { filterHomepageItems, getHomepageButtonLabel, getHomepageDisplayConfig, shouldShowViewMore, debugHomepageDisplay, normalizeHomepageDisplayConfig } from "@/lib/homepage-display-controls";
import { useSiteDataContext } from "@/components/site/SiteDataProvider";

function cleanText(value: unknown) {
  return String(value || "").trim();
}

function isTruthy(value: unknown) {
  if (typeof value === "boolean") return value;
  const raw = cleanText(value).toLowerCase();
  return raw === "true" || raw === "1" || raw === "yes";
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

export function CompaniesSection({ section }: { section: SiteSectionBlock }) {
  const siteData = useSiteDataContext();
  const pathname = usePathname();
  const homepageSettings = getHomepageDisplayConfig(siteData, "companies");
  const isHomepage = pathname === "/";
  const normalized = normalizeHomepageDisplayConfig(homepageSettings);
  const allItems = useMemo(() => filterHomepageItems(section?.items || [], { ...homepageSettings, limit: undefined, itemsLimit: undefined, showOnlyFeatured: false, manualItemOrder: undefined }), [section?.items]);
  const [loadedCount, setLoadedCount] = useState(Number(normalized.initialItems || 3));
  const homepageItems = isHomepage
    ? filterHomepageItems(section?.items || [], {
        ...homepageSettings,
        limit: normalized.viewMoreMode === "load-more" ? loadedCount : Number(normalized.limit ?? normalized.itemsLimit ?? 6),
      })
    : allItems;
  const showMore = isHomepage && shouldShowViewMore(allItems, homepageItems, homepageSettings);
  debugHomepageDisplay("companies", (section?.items || []).length, homepageItems.length, homepageSettings);
  return (
    <section id="companies" className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8 sm:py-20">
      <div className="rounded-[28px] border border-[rgb(var(--border))] bg-[linear-gradient(180deg,rgba(255,255,255,1),rgba(248,250,252,1))] p-5 shadow-[0_22px_55px_rgba(15,23,42,0.07)] sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">{String(section.data?.eyebrow || "Experience")}</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-text-main">{String(section.data?.title || "Companies Worked With")}</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {homepageItems.map((item: any, index: number) => (
            <article key={item.companyName || item.title || index} className="overflow-hidden rounded-[24px] border border-[rgb(var(--border))] bg-[rgb(var(--card-bg))] shadow-[0_18px_42px_rgba(15,23,42,0.06)]">
              <div className="flex min-h-[7.5rem] items-center justify-center border-b border-[rgb(var(--border))] bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.08),transparent_35%),linear-gradient(135deg,rgba(248,250,252,1),rgba(255,255,255,1))] px-4 py-4">
                {isTruthy(item.confidential) ? (
                  <div className="text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white text-sm font-semibold text-slate-500">
                      CF
                    </div>
                    <p className="mt-3 text-sm font-medium text-slate-500">Confidential Client</p>
                  </div>
                ) : resolveCompanyLogo(item) ? (
                  <img
                    src={resolveCompanyLogo(item)}
                    alt={cleanText(item.companyName || item.title || "Company")}
                    className="max-h-16 w-auto max-w-[68%] object-contain"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-base font-semibold text-white">
                    {(cleanText(item.companyName || item.title) || "Company").slice(0, 2).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="space-y-3 p-4">
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">{cleanText(item.relationshipType) || "Collaboration"}</div>
                  <h3 className="mt-2 text-lg font-semibold text-text-main">{cleanText(item.companyName || item.title) || "Company"}</h3>
                  {cleanText(item.industry) ? <p className="mt-1 text-sm text-text-muted">{cleanText(item.industry)}</p> : null}
                </div>
                {cleanText(item.description) ? <p className="text-sm leading-6 text-text-muted">{cleanText(item.description)}</p> : null}
                {(formatCompanyDate(item.startDate) || formatCompanyDate(item.endDate)) ? (
                  <p className="text-sm text-text-muted">
                    <span className="font-medium text-text-main">Duration:</span>{" "}
                    {formatCompanyDate(item.startDate) || "Unknown"}{" — "}{formatCompanyDate(item.endDate) || "Current"}
                  </p>
                ) : null}
                {!isTruthy(item.confidential) && cleanText(item.websiteUrl) ? (
                  <a
                    href={cleanText(item.websiteUrl)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
                  >
                    Visit
                  </a>
                ) : null}
                {isTruthy(item.confidential) ? (
                  <div className="inline-flex rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                    Confidential Client
                  </div>
                ) : null}
              </div>
            </article>
          ))}
        </div>
        {isHomepage && showMore ? (
          <div className="mt-8 flex justify-center">
            {normalized.viewMoreMode === "load-more" ? (
              <button
                type="button"
                onClick={() => setLoadedCount((count) => count + Number(normalized.loadCount || 3))}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white"
              >
                {homepageItems.length >= allItems.length ? "No More Items" : getHomepageButtonLabel(homepageSettings)}
              </button>
            ) : (
              <Link href={homepageSettings.fullPageUrl || "/companies"} className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white">{getHomepageButtonLabel(homepageSettings)}</Link>
            )}
          </div>
        ) : null}
      </div>
    </section>
  );
}
