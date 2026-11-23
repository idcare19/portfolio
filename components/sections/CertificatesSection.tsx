
"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
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

function cleanText(value: unknown) {
  return String(value ?? "").trim();
}

function resolveCertificateImage(item: any) {
  return cleanText(
    item?.certificateImage || item?.image || item?.thumbnail
  );
}

function formatCertificateDate(value: unknown) {
  const raw = cleanText(value);

  if (!raw) return "";

  const parsed = new Date(raw);

  if (Number.isNaN(parsed.getTime())) return raw;

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(parsed);
}

function getSkills(value: unknown) {
  return cleanText(value)
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean);
}

export function CertificatesSection({
  section,
}: {
  section: SiteSectionBlock;
}) {
  const siteData = useSiteDataContext();
  const pathname = usePathname();

  const isHomepage = pathname === "/";
  const homepageSettings = getHomepageDisplayConfig(
    siteData,
    "certificates"
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
    "certificates",
    sourceItems.length,
    items.length,
    homepageSettings
  );

  return (
    <section
      id="certificates"
      aria-labelledby="certificates-heading"
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
              {String(section.data?.eyebrow || "Credentials")}
            </p>
          </div>

          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <h2
                id="certificates-heading"
                className="text-3xl font-bold tracking-tight text-text-main sm:text-4xl"
              >
                {String(section.data?.title || "Certificates")}
                <span style={{ color: "rgb(var(--primary))" }}>.</span>
              </h2>

              <p className="mt-2 max-w-xl text-sm leading-7 text-text-muted sm:text-base">
                Professional certifications, credentials and continuous
                learning milestones.
              </p>
            </div>

            <span className="text-xs font-medium text-text-muted">
              {items.length} of {allItems.length} certificates
            </span>
          </div>
        </div>

        {/* Certificate grid */}
        <div className="relative mt-9 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((item: any, index: number) => {
            const title = cleanText(
              item?.certificateTitle || item?.title || "Certificate"
            );

            const image = resolveCertificateImage(item);
            const issueDate = formatCertificateDate(item?.issueDate);
            const expiryDate = formatCertificateDate(item?.expiryDate);
            const skills = getSkills(item?.skills);
            const credentialUrl = cleanText(item?.credentialUrl);

            return (
              <article
                key={
                  item.id ??
                  item.slug ??
                  `${title}-${index}`
                }
                className="group relative flex flex-col overflow-hidden rounded-3xl border border-[rgb(var(--border))] bg-[rgb(var(--card-bg))] shadow-[0_8px_28px_rgba(15,23,42,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-[rgb(var(--primary))] hover:shadow-[0_20px_45px_rgba(15,23,42,0.10)]"
              >
                {/* Top accent */}
                <div
                  aria-hidden="true"
                  className="absolute left-0 top-0 z-10 h-[2px] w-0 transition-all duration-500 group-hover:w-full"
                  style={{ background: "rgb(var(--primary))" }}
                />

                {/* Certificate preview */}
                <div className="relative aspect-[16/10] overflow-hidden border-b border-[rgb(var(--border))] bg-[rgb(var(--surface))]">
                  {image ? (
                    <Image
                      src={image}
                      alt={`${title} certificate`}
                      fill
                      unoptimized
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                      sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center px-6 text-center">
                      <div
                        className="flex h-14 w-14 items-center justify-center rounded-2xl border border-dashed border-[rgb(var(--border))]"
                        style={{
                          background:
                            "color-mix(in srgb, rgb(var(--primary)) 8%, rgb(var(--card-bg)))",
                        }}
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          className="h-7 w-7 text-text-muted"
                          aria-hidden="true"
                        >
                          <path d="M7 3.75h7l4 4v12.5H7a2 2 0 0 1-2-2v-12.5a2 2 0 0 1 2-2Z" />
                          <path d="M14 3.75v4h4M8.5 13h7M8.5 16.5h5" />
                        </svg>
                      </div>

                      <p className="mt-3 text-xs font-medium text-text-muted">
                        Certificate preview unavailable
                      </p>
                    </div>
                  )}

                  {/* Preview label */}
                  <div className="absolute bottom-3 left-3">
                    <span className="rounded-full border border-white/20 bg-black/65 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-md">
                      Certificate
                    </span>
                  </div>
                </div>

                {/* Card content */}
                <div className="flex flex-1 flex-col p-5 sm:p-6">
                  <div>
                    <h3 className="text-lg font-bold leading-snug tracking-tight text-text-main">
                      {title}
                    </h3>

                    {cleanText(item?.issuer) && (
                      <p className="mt-1.5 text-sm text-text-muted">
                        {cleanText(item.issuer)}
                      </p>
                    )}
                  </div>

                  {/* Credential details */}
                  <div className="mt-5 space-y-3 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-4">
                    {cleanText(item?.credentialId) && (
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                          Credential ID
                        </p>
                        <p className="mt-1 break-all text-xs font-medium text-text-main">
                          {cleanText(item.credentialId)}
                        </p>
                      </div>
                    )}

                    {issueDate && (
                      <div className="flex items-start justify-between gap-3">
                        <span className="text-xs text-text-muted">
                          Issued
                        </span>
                        <span className="text-right text-xs font-medium text-text-main">
                          {issueDate}
                        </span>
                      </div>
                    )}

                    {(issueDate || expiryDate) && (
                      <div className="flex items-start justify-between gap-3">
                        <span className="text-xs text-text-muted">
                          Expires
                        </span>
                        <span className="text-right text-xs font-medium text-text-main">
                          {expiryDate || "No Expiry"}
                        </span>
                      </div>
                    )}

                    {cleanText(item?.category) && (
                      <div className="flex items-start justify-between gap-3">
                        <span className="text-xs text-text-muted">
                          Category
                        </span>
                        <span className="text-right text-xs font-medium text-text-main">
                          {cleanText(item.category)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Skills */}
                  {skills.length > 0 && (
                    <div className="mt-5 flex flex-wrap gap-2">
                      {skills.map((skill: string, skillIndex: number) => (
                        <span
                          key={`${skill}-${skillIndex}`}
                          className="rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--card-hover))] px-3 py-1.5 text-[11px] font-medium text-text-muted transition-colors duration-200 hover:text-text-main"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Credential action */}
                  <div className="mt-auto pt-6">
                    {credentialUrl ? (
                      <a
                        href={credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`View credential for ${title}`}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                        style={{ background: "rgb(var(--primary))" }}
                      >
                        View Credential
                      </a>
                    ) : (
                      <div className="flex items-center justify-center rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--surface))] px-5 py-3 text-xs font-medium text-text-muted">
                        Credential link unavailable
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
                  "All Certificates Loaded"
                )}
              </button>
            ) : (
              <Link
                href={homepageSettings.fullPageUrl || "/certificates"}
                className="inline-flex items-center gap-3 rounded-full px-7 py-3.5 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
                style={{ background: "rgb(var(--primary))" }}
              >
                {getHomepageButtonLabel(homepageSettings)}

              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
