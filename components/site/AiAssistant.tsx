"use client";

import { Bot, ChevronDown, Sparkles, Trash2, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { trackClientEvent } from "@/components/site/AnalyticsTracker";
import { useSiteDataContext } from "@/components/site/SiteDataProvider";

type AssistantTurn = {
  role: "user" | "assistant";
  message: string;
  suggestions?: string[];
  sources?: string[];
  intent?: string;
};

const STORAGE_KEY = "portfolio-ai-session-v1";

function renderText(text: string) {
  return text
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);
}

export function AiAssistant() {
  const siteData = useSiteDataContext();
  const shell = siteData.shell.assistant;
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState<AssistantTurn[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setHistory(JSON.parse(raw));
    } catch {
      // ignore storage issues
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch {
      // ignore storage issues
    }
  }, [history]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [history, loading]);

  const quickPrompts = useMemo(() => [
    "Tell me about Prodonto",
    "What projects has Abhishek built?",
    "What skills does he know?",
    "Can I hire him?",
  ], []);

  if (isAdminRoute || siteData.aiConfig?.enabled === false) return null;

  async function ask(nextMessage: string = message) {
    const trimmed = nextMessage.trim();
    if (!trimmed || loading) return;
    setLoading(true);
    setError("");
    setHistory((current) => [...current, { role: "user", message: trimmed }]);
    setMessage("");
    try {
      const res = await fetch("/api/portfolio-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          history: history.reduce<Array<{ question: string; answer: string }>>((pairs, item, index) => {
            if (item.role === "user" && history[index + 1]?.role === "assistant") {
              pairs.push({ question: item.message, answer: history[index + 1].message });
            }
            return pairs;
          }, []),
          currentPage: pathname,
          currentSection: pathname?.split("/").filter(Boolean)[0] || "",
        }),
      });
      const payload = await res.json();
      if (!res.ok) throw new Error(payload?.error || "Request failed");
      setHistory((current) => [
        ...current,
        {
          role: "assistant",
          message: String(payload.answer || ""),
          suggestions: Array.isArray(payload.suggestions) ? payload.suggestions : [],
          sources: Array.isArray(payload.sources) ? payload.sources : [],
          intent: String(payload.intent || ""),
        },
      ]);
      trackClientEvent("portfolio-ai-ask", {
        targetType: "assistant",
        metadata: { questionLength: trimmed.length, intent: String(payload.intent || "") },
      });
    } catch {
      setError("Portfolio AI is temporarily unavailable. Please try again later.");
      setHistory((current) => [
        ...current,
        { role: "assistant", message: "Portfolio AI is temporarily unavailable. Please try again later." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function clearChat() {
    setHistory([]);
    setError("");
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore storage issues
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] right-4 z-[90] inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-lg sm:right-5"
      >
        <Bot className="h-4 w-4" />
        {shell.buttonLabel}
      </button>

      {open ? (
        <div className="fixed bottom-[calc(4.5rem+env(safe-area-inset-bottom))] right-4 z-[90] w-[min(420px,calc(100vw-2rem))] overflow-hidden rounded-[28px] border border-[rgb(var(--border))] bg-[rgb(var(--card-bg))] shadow-2xl sm:right-5">
          <div className="flex items-start justify-between gap-3 border-b border-[rgb(var(--border))] px-4 py-4">
            <div>
              <p className="text-sm font-semibold text-text-main">{shell.panelTitle}</p>
              <p className="mt-1 text-xs text-text-muted">{shell.panelDescription}</p>
            </div>
            <div className="flex items-center gap-1">
              <button type="button" onClick={clearChat} className="rounded-full p-2 text-text-muted hover:bg-[rgb(var(--page-bg))] hover:text-text-main" aria-label="Clear chat">
                <Trash2 className="h-4 w-4" />
              </button>
              <button type="button" onClick={() => setOpen(false)} className="rounded-full p-2 text-text-muted hover:bg-[rgb(var(--page-bg))] hover:text-text-main" aria-label="Close chat">
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div ref={listRef} className="max-h-[50vh] space-y-3 overflow-auto px-4 py-4">
            {history.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-[rgb(var(--border))] bg-[rgb(var(--page-bg))] p-4 text-sm text-text-muted">
                Try a prompt below or ask anything about Abhishek&apos;s portfolio.
              </div>
            ) : null}

            {history.map((item, index) => (
              <div key={`${item.role}-${index}-${item.message.slice(0, 20)}`} className={`rounded-3xl p-4 ${item.role === "user" ? "ml-8 bg-primary/10" : "mr-2 bg-[rgb(var(--page-bg))]"}`}>
                <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-text-muted">
                  {item.role === "user" ? "You" : "Portfolio AI"}
                </div>
                <div className="mt-2 space-y-2 text-sm text-text-main">
                  {renderText(item.message).map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
                {item.sources?.length ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {item.sources.map((source) => (
                      <span key={source} className="rounded-full bg-white/70 px-2 py-1 text-[11px] text-text-muted">
                        {source}
                      </span>
                    ))}
                  </div>
                ) : null}
                {item.suggestions?.length && item.role === "assistant" ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {item.suggestions.map((suggestion) => (
                      <button
                        type="button"
                        key={suggestion}
                        onClick={() => ask(suggestion)}
                        className="rounded-full border border-[rgb(var(--border))] px-3 py-1 text-xs text-text-main hover:bg-white"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
            {loading ? (
              <div className="rounded-3xl bg-[rgb(var(--page-bg))] p-4 text-sm text-text-muted">
                Portfolio AI is typing...
              </div>
            ) : null}
            {error ? <div className="rounded-3xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div> : null}
          </div>

          <div className="border-t border-[rgb(var(--border))] px-4 py-4">
            <div className="mb-3 flex flex-wrap gap-2">
              {quickPrompts.map((prompt) => (
                <button key={prompt} type="button" onClick={() => ask(prompt)} className="inline-flex items-center gap-1 rounded-full bg-[rgb(var(--page-bg))] px-3 py-1 text-xs text-text-main">
                  <Sparkles className="h-3 w-3" />
                  {prompt}
                </button>
              ))}
            </div>
            <div className="flex items-end gap-2">
              <textarea
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                rows={3}
                className="min-h-[72px] flex-1 resize-none rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--page-bg))] px-3 py-2 text-sm text-text-main outline-none"
                placeholder={shell.inputPlaceholder}
              />
              <button
                type="button"
                onClick={() => ask()}
                disabled={loading || !message.trim()}
                className="inline-flex h-11 items-center gap-2 rounded-full bg-primary px-4 text-sm font-semibold text-white disabled:opacity-50"
              >
                {loading ? shell.loadingLabel : shell.submitLabel}
                <ChevronDown className="h-4 w-4 rotate-180" />
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
