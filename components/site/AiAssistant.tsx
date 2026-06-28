"use client";

import { Bot } from "lucide-react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { trackClientEvent } from "@/components/site/AnalyticsTracker";
import { useSiteDataContext } from "@/components/site/SiteDataProvider";

type AssistantTurn = {
  question: string;
  answer: string;
  confidence?: number;
  usedGemini?: boolean;
  sources: Array<{ source: string; href: string; excerpt?: string }>;
};

export function AiAssistant() {
  const siteData = useSiteDataContext();
  const shell = siteData.shell.assistant;
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [history, setHistory] = useState<AssistantTurn[]>([]);  const [loading, setLoading] = useState(false);
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  // Close overlay when route changes
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Only render on public routes
  if (isAdminRoute || siteData.aiConfig?.enabled === false) return null;
  async function ask() {
    if (!question.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/assistant/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question,
          history: history.map((item) => ({ question: item.question, answer: item.answer })),
        }),
      });
      const payload = await res.json();
      const nextTurn = {
        question,
        answer: String(payload.answer || ""),
        confidence: typeof payload.confidence === "number" ? payload.confidence : undefined,
        usedGemini: Boolean(payload.usedGemini),
        sources: Array.isArray(payload.sources) ? payload.sources : [],
      };
      setHistory((current) => [...current, nextTurn]);
      setQuestion("");
      trackClientEvent("portfolio-ai-ask", {
        targetType: "assistant",
        metadata: {
          questionLength: question.length,
          sourceCount: nextTurn.sources.length,
        },
      });    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button 
        type="button" 
        onClick={() => setOpen((value) => !value)} 
        className="fixed bottom-5 right-5 z-[90] inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-lg"
      >
        <Bot className="h-4 w-4" />
        {shell.buttonLabel}
      </button>
      {open ? (
        <div className="fixed bottom-20 right-5 z-[90] w-[360px] max-w-[calc(100vw-40px)] rounded-[28px] border border-[rgb(var(--border))] bg-[rgb(var(--card-bg))] p-4 shadow-2xl">
          <p className="text-sm font-semibold text-text-main">{shell.panelTitle}</p>
          <p className="mt-1 text-xs text-text-muted">{shell.panelDescription}</p>          <textarea 
            value={question} 
            onChange={(event) => setQuestion(event.target.value)} 
            rows={4} 
            className="mt-3 w-full rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--page-bg))] px-3 py-2 text-sm text-text-main outline-none" 
            placeholder={shell.inputPlaceholder}          />
          <button 
            type="button" 
            onClick={ask} 
            disabled={loading} 
            className="mt-3 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white"
          >
            {loading ? shell.loadingLabel : shell.submitLabel}
          </button>
          <div className="mt-3 max-h-[320px] space-y-3 overflow-auto">
            {history.map((item, index) => (
              <div key={`${item.question}-${index}`} className="rounded-2xl bg-[rgb(var(--page-bg))] p-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-text-muted">You</p>
                <p className="mt-1 text-sm text-text-main">{item.question}</p>
                <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-text-muted">Portfolio AI</p>
                <pre className="mt-1 whitespace-pre-wrap text-xs text-text-main">{item.answer}</pre>
                <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-text-muted">
                  {typeof item.confidence === "number" ? <span>Confidence {Math.round(item.confidence * 100)}%</span> : null}
                  {item.usedGemini ? <span>Gemini-assisted</span> : <span>Retrieval fallback</span>}
                </div>
                {item.sources.length ? (
                  <div className="mt-3 space-y-1">
                    {item.sources.map((source) => (
                      <a key={`${source.source}-${source.href}`} href={source.href} className="block text-xs text-primary">
                        {source.source}
                      </a>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
          </div>        </div>
      ) : null}
    </>
  );
}