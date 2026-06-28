import Link from "next/link";
import { PageHeader } from "@/components/admin/PageHeader";
import { runTextAudit } from "@/lib/admin/text-audit";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const FILTERS = ["all", "missing", "managed", "ignored", "buttons", "labels", "navigation", "footer", "errors", "success", "github", "portfolio-ai"] as const;

export default async function AuditTextPage({
  searchParams,
}: {
  searchParams?: Promise<{ filter?: string }>;
}) {
  const params = (await searchParams) || {};
  const filter = FILTERS.includes(params.filter as (typeof FILTERS)[number]) ? (params.filter as (typeof FILTERS)[number]) : "missing";
  const { items, summary } = await runTextAudit();
  const managedCount = items.filter((item) => item.status === "dynamic").length;
  const missingCount = items.filter((item) => item.status !== "dynamic").length;
  const ignoredCount = summary.ignoredStrings;
  const coverage = summary.coverage;

  const filtered = items.filter((item) => {
    if (filter === "all") return true;
    if (filter === "missing") return item.status !== "dynamic";
    if (filter === "managed") return item.status === "dynamic";
    if (filter === "ignored") return false;
    return item.category === filter;
  });

  const grouped = filtered.reduce<Record<string, typeof items>>((acc, item) => {
    const key = item.sectionId || "content";
    acc[key] = acc[key] || [];
    acc[key].push(item);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <PageHeader
        title="Text Audit"
        description="Whitelisted scanner for real user-facing text only. Code, CSS, Tailwind, and JSX noise are ignored. Scan public portfolio surfaces for user-facing literals that should be moved into MongoDB text blocks."
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <MetricCard label="Public Texts" value={summary.textsFound} />
        <MetricCard label="Already Managed" value={managedCount} />
        <MetricCard label="Missing" value={missingCount} />
        <MetricCard label="Ignored Code Strings" value={ignoredCount} />
        <MetricCard label="Coverage" value={`${coverage}%`} />
      </div>

      <div className="rounded-[28px] border border-admin-border bg-admin-card p-5">
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((item) => (
            <Link
              key={item}
              href={`/admin/audit-text?filter=${item}`}
              className={`rounded-full px-4 py-2 text-sm font-semibold ${
                filter === item ? "bg-admin-primary text-white" : "border border-admin-border bg-admin-bg text-admin-text"
              }`}
            >
              {item.replace(/-/g, " ").replace(/\b\w/g, (s) => s.toUpperCase())}
            </Link>
          ))}
        </div>
      </div>

      <div className="rounded-[28px] border border-admin-border bg-admin-card p-5">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-admin-text">Missing Text</h2>
            <p className="text-sm text-admin-text-muted">{filtered.length} items in this view.</p>
          </div>
          <Link href="/admin/text-blocks" className="rounded-full bg-admin-primary px-4 py-2 text-sm font-semibold text-white">
            Open Text Blocks
          </Link>
        </div>

        <div className="space-y-4">
          {Object.entries(grouped).map(([section, sectionItems]) => (
            <div key={section} className="rounded-2xl border border-admin-border bg-admin-bg p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <h3 className="text-sm font-semibold text-admin-text">{section}</h3>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-admin-text-muted">{sectionItems.length} items</span>
              </div>
              <div className="grid gap-3">
                {sectionItems.map((item) => (
                  <article key={`${item.filePath}-${item.literal}-${item.suggestedKey}`} className="rounded-2xl border border-admin-border bg-white p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-admin-text">{item.literal}</p>
                        <p className="mt-1 text-xs text-admin-text-muted">{item.componentName}</p>
                        <p className="mt-1 text-xs text-admin-text-muted">{item.category}</p>
                      </div>
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${item.status === "dynamic" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                        {item.status === "dynamic" ? "Already Managed" : "Needs Migration"}
                      </span>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Link href={`/admin/text-blocks?section=${item.sectionId}&key=${encodeURIComponent(item.suggestedKey)}`} className="rounded-full border border-admin-border px-3 py-1.5 text-xs font-semibold text-admin-text">
                        Move to CMS
                      </Link>
                      <button type="button" className="rounded-full border border-admin-border px-3 py-1.5 text-xs font-semibold text-admin-text">
                        Ignore Permanently
                      </button>
                      <button type="button" className="rounded-full border border-admin-border px-3 py-1.5 text-xs font-semibold text-admin-text">
                        Mark Managed
                      </button>
                      <button type="button" className="rounded-full border border-admin-border px-3 py-1.5 text-xs font-semibold text-admin-text">
                        Preview Usage
                      </button>
                      <button type="button" className="rounded-full border border-admin-border px-3 py-1.5 text-xs font-semibold text-admin-text">
                        Open Component
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ))}

          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-admin-border bg-admin-bg p-8 text-center text-sm text-admin-text-muted">
              No items match this filter.
            </div>
          ) : null}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Files Scanned" value={summary.filesScanned} />
        <MetricCard label="User-facing Strings" value={summary.textsFound} />
        <MetricCard label="Duplicates Removed" value={summary.duplicatesRemoved} />
        <MetricCard label="Components Fully CMS-driven" value={managedCount} />
      </div>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-admin-border bg-admin-card px-4 py-3">
      <p className="text-xs uppercase tracking-[0.16em] text-admin-text-muted">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-admin-text">{value}</p>
    </div>
  );
}