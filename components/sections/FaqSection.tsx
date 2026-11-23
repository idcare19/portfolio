
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ChevronDown,
  MessageCircleQuestion,
} from "lucide-react";

import type { SiteSectionBlock } from "@/src/types/site-data";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  filterHomepageItems,
  getHomepageDisplayConfig,
  shouldShowViewMore,
  debugHomepageDisplay,
} from "@/lib/homepage-display-controls";

import { useSiteDataContext } from "@/components/site/SiteDataProvider";
import { renderIcon } from "@/lib/skill-icons";

export function FaqSection({
  section,
}: {
  section: SiteSectionBlock;
}) {
  const [open, setOpen] = useState<number>(0);

  const siteData = useSiteDataContext();
  const pathname = usePathname();

  const homepageSettings = getHomepageDisplayConfig(siteData, "faq");
  const isHomepage = pathname === "/";

  const sourceItems = section?.items || [];

  const fullItems = useMemo(
    () =>
      filterHomepageItems(sourceItems, {
        ...homepageSettings,
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
        limit: homepageSettings.limit ?? homepageSettings.itemsLimit ?? 6,
      }),
    [
      sourceItems,
      homepageSettings.limit,
      homepageSettings.itemsLimit,
      homepageSettings.showOnlyFeatured,
      homepageSettings.manualItemOrder?.join("|"),
      homepageSettings.showViewMoreButton,
      homepageSettings.viewMoreButtonText,
      homepageSettings.fullPageUrl,
    ]
  );

  const items = isHomepage ? homepageItems : fullItems;

  const showMore =
    isHomepage && shouldShowViewMore(fullItems, items, homepageSettings);

  // Keep the open item valid when CMS filtering changes.
  useEffect(() => {
    setOpen(items.length > 0 ? 0 : -1);
  }, [items.length]);

  debugHomepageDisplay(
    "faq",
    sourceItems.length,
    items.length,
    homepageSettings
  );

  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
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
              {String(section.data?.eyebrow || "FAQ")}
            </p>
          </div>

          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h2
                id="faq-heading"
                className="text-3xl font-bold tracking-tight text-text-main sm:text-4xl"
              >
                {String(
                  section.data?.title || "Frequently Asked Questions"
                )}
                <span style={{ color: "rgb(var(--primary))" }}>.</span>
              </h2>

              {section.data?.description ? (
                <p className="mt-3 max-w-3xl text-sm leading-7 text-text-muted sm:text-base">
                  {String(section.data.description)}
                </p>
              ) : (
                <p className="mt-3 max-w-2xl text-sm leading-7 text-text-muted">
                  Find answers to common questions and learn more about
                  working together.
                </p>
              )}
            </div>

            <div className="inline-flex shrink-0 items-center gap-2 text-xs font-medium text-text-muted">
              <MessageCircleQuestion className="h-4 w-4" />
              {items.length} questions
            </div>
          </div>
        </div>

        {/* FAQ accordion */}
        <div className="relative mt-9 space-y-3">
          {items.map((item: any, index: number) => {
            const isOpen = open === index;
            const answerId = `faq-answer-${index}`;
            const triggerId = `faq-question-${index}`;

            return (
              <article
                key={item.id ?? item.question ?? index}
                className={`group overflow-hidden rounded-2xl border transition-all duration-300 ${
                  isOpen
                    ? "border-[rgb(var(--primary))] shadow-[0_12px_32px_rgba(15,23,42,0.07)]"
                    : "border-[rgb(var(--border))] bg-[rgb(var(--card-bg))] hover:border-[rgb(var(--primary))]"
                }`}
                style={
                  isOpen
                    ? {
                        background:
                          "color-mix(in srgb, rgb(var(--primary)) 5%, rgb(var(--card-bg)))",
                      }
                    : undefined
                }
              >
                <button
                  id={triggerId}
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={answerId}
                  onClick={() => setOpen(isOpen ? -1 : index)}
                  className="flex w-full items-center justify-between gap-4 px-4 py-5 text-left sm:px-6"
                >
                  <span className="flex min-w-0 items-center gap-3.5">
                    <span
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] transition-colors duration-300"
                      style={
                        isOpen
                          ? {
                              color: "rgb(var(--primary))",
                              borderColor: "rgb(var(--primary))",
                            }
                          : undefined
                      }
                    >
                      {item.icon ? (
                        renderIcon(
                          item.icon,
                          item.iconColor,
                          "h-4 w-4"
                        )
                      ) : (
                        <span className="text-xs font-bold">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      )}
                    </span>

                    <span
                      className={`text-sm font-semibold leading-6 transition-colors duration-200 sm:text-base ${
                        isOpen
                          ? "text-text-main"
                          : "text-text-main"
                      }`}
                    >
                      {item.question || "Question"}
                    </span>
                  </span>

                  <span
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--surface))] transition-all duration-300"
                    style={
                      isOpen
                        ? {
                            background: "rgb(var(--primary))",
                            color: "#fff",
                            borderColor: "rgb(var(--primary))",
                          }
                        : undefined
                    }
                  >
                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </span>
                </button>

                {/* Answer */}
                <div
                  id={answerId}
                  role="region"
                  aria-labelledby={triggerId}
                  aria-hidden={!isOpen}
                  className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="ml-[3.35rem] mr-4 border-t border-[rgb(var(--border))] pb-5 pt-4 sm:ml-[4.1rem] sm:mr-6">
                      <p className="whitespace-pre-line text-sm leading-7 text-text-muted">
                        {item.answer || "Answer coming soon."}
                      </p>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* View more */}
        {showMore && (
          <div className="relative mt-9 flex justify-center">
            <Link
              href={homepageSettings.fullPageUrl || "/faq"}
              className="inline-flex items-center gap-3 rounded-full px-7 py-3.5 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
              style={{ background: "rgb(var(--primary))" }}
            >
              {homepageSettings.viewMoreButtonText || "View More"}
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
