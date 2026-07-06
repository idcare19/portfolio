"use client";

import type { SiteSectionBlock } from "@/src/types/site-data";

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
  const items = (section?.items || []).filter((item: any) => item.isEnabled !== false).sort((a: any, b: any) => Number(a.order || 0) - Number(b.order || 0));
  return (
    <section id="companies" className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="rounded-[32px] border border-[rgb(var(--border))] bg-white p-6 shadow-[0_18px_55px_rgba(15,23,42,0.06)] sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">{String(section.data?.eyebrow || "Experience")}</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-text-main">{String(section.data?.title || "Companies Worked With")}</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((item: any, index: number) => (
            <article key={item.companyName || item.title || index} className="overflow-hidden rounded-3xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))]">
              <div className="flex min-h-[9rem] items-center justify-center border-b border-[rgb(var(--border))] bg-gradient-to-br from-slate-50 to-white px-6 py-6">
                {isTruthy(item.confidential) ? (
                  <div className="text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white text-sm font-semibold text-slate-500">
                      CF
                    </div>
                    <p className="mt-3 text-sm font-medium text-slate-500">Confidential Client</p>
                  </div>
                ) : resolveCompanyLogo(item) ? (
                  <img
                    src={resolveCompanyLogo(item)}
                    alt={cleanText(item.companyName || item.title || "Company")}
                    className="max-h-20 w-auto max-w-[70%] object-contain"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900 text-lg font-semibold text-white">
                    {(cleanText(item.companyName || item.title) || "Company").slice(0, 2).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="space-y-4 p-5">
                <div>
                  <div className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">{cleanText(item.relationshipType) || "Collaboration"}</div>
                  <h3 className="mt-2 text-xl font-semibold text-text-main">{cleanText(item.companyName || item.title) || "Company"}</h3>
                  {cleanText(item.industry) ? <p className="mt-1 text-sm text-text-muted">{cleanText(item.industry)}</p> : null}
                </div>
                {cleanText(item.description) ? <p className="text-sm leading-7 text-text-muted">{cleanText(item.description)}</p> : null}
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
                    Visit Website
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
      </div>
    </section>
  );
}
