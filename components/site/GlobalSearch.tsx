"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { trackClientEvent } from "@/components/site/AnalyticsTracker";
import { useSiteDataContext } from "@/components/site/SiteDataProvider";

type SearchResult = {
  type: string;
  title: string;
  description: string;
  href: string;
};

export function GlobalSearch() {
  const siteData = useSiteDataContext();
  const shell = siteData.shell.search;
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  useEffect(() => {
    setOpen(false);
    document.body.style.overflow = "";
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key.toLowerCase() === "k") {
        if (isAdminRoute) return;
        event.preventDefault();
        setOpen((value) => !value);
      }
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isAdminRoute]);

  useEffect(() => {
    if (!open || !query.trim()) {
      setResults([]);
      return;
    }
    const controller = new AbortController();
    const timeout = window.setTimeout(async () => {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`, { signal: controller.signal });
      const payload = await response.json();
      setResults(payload.results || []);
      trackClientEvent("search-query", {
        targetType: "search",
        metadata: {
          query,
          results: Array.isArray(payload.results) ? payload.results.length : 0,
        },
      });
    }, 150);
    return () => {
      controller.abort();
      window.clearTimeout(timeout);
    };
  }, [open, query]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] left-4 z-[90] inline-flex items-center gap-2 rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--card-bg))] px-4 py-2 text-sm font-medium text-text-main shadow-lg sm:left-5"
      >
        <Search className="h-4 w-4" />
        {shell.buttonLabel}
        <span className="rounded-md bg-[rgb(var(--page-bg))] px-2 py-0.5 text-xs text-text-muted">{shell.shortcutLabel}</span>
      </button>

      {open ? (
        <div className="fixed inset-0 z-[120] bg-slate-950/45 p-4 backdrop-blur-sm" onClick={() => setOpen(false)}>
          <div className="mx-auto mt-16 max-w-2xl rounded-[28px] border border-[rgb(var(--border))] bg-[rgb(var(--card-bg))] p-4 shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <input
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={shell.inputPlaceholder}
              className="w-full rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--page-bg))] px-4 py-3 text-text-main outline-none"
            />
            <div className="mt-4 max-h-[60vh] space-y-2 overflow-auto">
              {!query.trim() ? <p className="px-2 py-5 text-sm text-text-muted">{shell.emptyPrompt}</p> : null}
              {results.map((result) => (
                <Link
                  key={`${result.type}-${result.href}`}
                  href={result.href}
                  onClick={() => {
                    trackClientEvent("search-result-click", {
                      targetType: "search",
                      targetSlug: result.href,
                      metadata: { title: result.title, type: result.type },
                    });
                    setOpen(false);
                  }}
                  className="block rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--page-bg))] p-4 transition hover:border-primary/40 hover:bg-white"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">{result.type}</p>
                  <p className="mt-1 text-base font-semibold text-text-main">{result.title}</p>
                  <p className="mt-1 text-sm text-text-muted">{result.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
