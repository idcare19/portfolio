"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
<<<<<<< HEAD
import { trackClientEvent } from "@/components/site/AnalyticsTracker";
import { useSiteDataContext } from "@/components/site/SiteDataProvider";
=======
>>>>>>> c974e6d18f7e4d84cefd23b3ad822ac4cf9981fc

type SearchResult = {
  type: string;
  title: string;
  href: string;
  description: string;
};

export function GlobalSearch() {
<<<<<<< HEAD
  const siteData = useSiteDataContext();
  const shell = siteData.shell.search;
=======
>>>>>>> c974e6d18f7e4d84cefd23b3ad822ac4cf9981fc
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  // Close overlay when route changes and prevent body lock
  useEffect(() => {
    setOpen(false);
    // Re-enable body scroll if it was locked
    document.body.style.overflow = "";
  }, [pathname]);

  // Lock/unlock body scroll when search opens/closes
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key.toLowerCase() === "k") {
        // Only allow Ctrl+K on public routes
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
<<<<<<< HEAD
      trackClientEvent("search-query", {
        targetType: "search",
        metadata: {
          query,
          results: Array.isArray(payload.results) ? payload.results.length : 0,
        },
      });
=======
>>>>>>> c974e6d18f7e4d84cefd23b3ad822ac4cf9981fc
    }, 150);
    return () => {
      controller.abort();
      window.clearTimeout(timeout);
    };
  }, [open, query]);

  // Only render on public routes
  if (isAdminRoute) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-5 left-5 z-[90] inline-flex items-center gap-2 rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--card-bg))] px-4 py-2 text-sm font-medium text-text-main shadow-lg"
      >
        <Search className="h-4 w-4" />
<<<<<<< HEAD
        {shell.buttonLabel}
        <span className="rounded-md bg-[rgb(var(--page-bg))] px-2 py-0.5 text-xs text-text-muted">{shell.shortcutLabel}</span>
=======
        Search
        <span className="rounded-md bg-[rgb(var(--page-bg))] px-2 py-0.5 text-xs text-text-muted">Ctrl K</span>
>>>>>>> c974e6d18f7e4d84cefd23b3ad822ac4cf9981fc
      </button>

      {open ? (
        <div className="fixed inset-0 z-[120] bg-slate-950/45 p-4 backdrop-blur-sm" onClick={() => setOpen(false)}>
          <div className="mx-auto mt-16 max-w-2xl rounded-[28px] border border-[rgb(var(--border))] bg-[rgb(var(--card-bg))] p-4 shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <input
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
<<<<<<< HEAD
              placeholder={shell.inputPlaceholder}
              className="w-full rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--page-bg))] px-4 py-3 text-text-main outline-none"
            />
            <div className="mt-4 max-h-[60vh] space-y-2 overflow-auto">
              {!query.trim() ? <p className="px-2 py-5 text-sm text-text-muted">{shell.emptyPrompt}</p> : null}
=======
              placeholder="Search projects, blogs, skills, technologies..."
              className="w-full rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--page-bg))] px-4 py-3 text-text-main outline-none"
            />
            <div className="mt-4 max-h-[60vh] space-y-2 overflow-auto">
              {!query.trim() ? <p className="px-2 py-5 text-sm text-text-muted">Start typing to search across your portfolio.</p> : null}
>>>>>>> c974e6d18f7e4d84cefd23b3ad822ac4cf9981fc
              {results.map((result) => (
                <Link
                  key={`${result.type}-${result.href}`}
                  href={result.href}
<<<<<<< HEAD
                  onClick={() => {
                    trackClientEvent("search-result-click", {
                      targetType: "search",
                      targetSlug: result.href,
                      metadata: { title: result.title, type: result.type },
                    });
                    setOpen(false);
                  }}
=======
                  onClick={() => setOpen(false)}
>>>>>>> c974e6d18f7e4d84cefd23b3ad822ac4cf9981fc
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
<<<<<<< HEAD
}
=======
}
>>>>>>> c974e6d18f7e4d84cefd23b3ad822ac4cf9981fc
