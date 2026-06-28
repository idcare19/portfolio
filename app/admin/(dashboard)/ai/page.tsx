"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/admin/PageHeader";
import { SectionCard } from "@/components/admin/SectionCard";
import { useSiteDataEditor } from "@/components/admin/useSiteDataEditor";
import { useToast } from "@/components/admin/ToastProvider";

type AiStatusPayload = {
  config?: {
    enabled: boolean;
    model: string;
    temperature: number;
    maxTokens: number;
    maxContextChunks: number;
    confidenceThreshold: number;
  };
  geminiConfigured?: boolean;
  cacheEntries?: number;
  logs?: Array<{ question: string; timestamp: string; usedGemini: boolean; success: boolean; reason: string }>;
};

export default function AiAdminPage() {
  const { data, setData, loading, saving, error, save } = useSiteDataEditor();
  const { notify } = useToast();
  const [status, setStatus] = useState<AiStatusPayload | null>(null);
  const [testQuestion, setTestQuestion] = useState("What services does Abhishek offer?");
  const [testAnswer, setTestAnswer] = useState("");
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    fetch("/api/admin/ai/status", { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : null))
      .then((payload) => setStatus(payload?.data || null))
      .catch(() => setStatus(null));
  }, []);

  if (!data) {
    return (
      <div className="space-y-4">
        <PageHeader title="Portfolio AI" description="Configure Gemini-assisted hybrid retrieval for the public portfolio assistant." />
        {loading ? <p className="text-sm text-admin-text-muted">Loading AI settings...</p> : null}
        {error ? <p className="text-sm font-medium text-rose-600">{error}</p> : null}
      </div>
    );
  }

  const aiConfig = data.aiConfig || {
    enabled: true,
    model: "gemini-2.5-flash",
    temperature: 0.2,
    maxTokens: 700,
    maxContextChunks: 6,
    confidenceThreshold: 0.2,
  };

  async function handleSave() {
    const result = await save({ ...data, aiConfig } as any, "chore: update ai settings from admin panel");
    if (result.ok) notify("success", "AI settings saved");
    else notify("error", result.error || "Save failed");
  }

  async function handleTest() {
    if (!testQuestion.trim()) return;
    setTesting(true);
    try {
      const response = await fetch("/api/assistant/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: testQuestion, history: [] }),
      });
      const payload = await response.json();
      setTestAnswer(String(payload.answer || ""));
    } finally {
      setTesting(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Portfolio AI" description="Configure Gemini-assisted hybrid retrieval for the public portfolio assistant." />

      <SectionCard title="Basic" description="Core AI controls and a quick test surface.">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm">
            <span className="mb-1 block font-medium text-admin-text">Enable AI</span>
            <input
              type="checkbox"
              checked={aiConfig.enabled}
              onChange={(event) => setData({ ...data, aiConfig: { ...aiConfig, enabled: event.target.checked } } as any)}
            />
          </label>
          <div className="text-sm text-admin-text-muted">
            Gemini API status: <span className="font-medium text-admin-text">{status?.geminiConfigured ? "Configured" : "Missing GEMINI_API_KEY"}</span>
          </div>
          <label className="text-sm md:col-span-2">
            <span className="mb-1 block font-medium text-admin-text">Test question</span>
            <textarea
              rows={3}
              value={testQuestion}
              onChange={(event) => setTestQuestion(event.target.value)}
              className="w-full rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text"
            />
          </label>
          <div className="md:col-span-2 flex flex-wrap gap-3">
            <button onClick={handleTest} disabled={testing} className="rounded-xl bg-admin-secondary px-4 py-2 text-sm font-semibold text-white">
              {testing ? "Testing..." : "Test Question"}
            </button>
            <button onClick={handleSave} disabled={saving} className="rounded-xl bg-admin-primary px-4 py-2 text-sm font-semibold text-white">
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
          {testAnswer ? <pre className="md:col-span-2 rounded-xl border border-admin-border bg-admin-input p-4 text-xs text-admin-text whitespace-pre-wrap">{testAnswer}</pre> : null}
        </div>
      </SectionCard>

      <details className="rounded-[30px] border border-admin-border bg-admin-card p-5 shadow-lg">
        <summary className="cursor-pointer text-lg font-semibold text-admin-text">Advanced</summary>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <label className="text-sm">
            <span className="mb-1 block font-medium text-admin-text">Model</span>
            <input value={aiConfig.model} onChange={(event) => setData({ ...data, aiConfig: { ...aiConfig, model: event.target.value } } as any)} className="w-full rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text" />
          </label>
          <label className="text-sm">
            <span className="mb-1 block font-medium text-admin-text">Temperature</span>
            <input type="number" step="0.1" value={aiConfig.temperature} onChange={(event) => setData({ ...data, aiConfig: { ...aiConfig, temperature: Number(event.target.value) } } as any)} className="w-full rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text" />
          </label>
          <label className="text-sm">
            <span className="mb-1 block font-medium text-admin-text">Max tokens</span>
            <input type="number" value={aiConfig.maxTokens} onChange={(event) => setData({ ...data, aiConfig: { ...aiConfig, maxTokens: Number(event.target.value) } } as any)} className="w-full rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text" />
          </label>
          <label className="text-sm">
            <span className="mb-1 block font-medium text-admin-text">Max context chunks</span>
            <input type="number" value={aiConfig.maxContextChunks} onChange={(event) => setData({ ...data, aiConfig: { ...aiConfig, maxContextChunks: Number(event.target.value) } } as any)} className="w-full rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text" />
          </label>
          <label className="text-sm">
            <span className="mb-1 block font-medium text-admin-text">Confidence threshold</span>
            <input type="number" step="0.05" value={aiConfig.confidenceThreshold} onChange={(event) => setData({ ...data, aiConfig: { ...aiConfig, confidenceThreshold: Number(event.target.value) } } as any)} className="w-full rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-admin-text" />
          </label>
          <div className="text-sm text-admin-text-muted">
            Cache entries: {status?.cacheEntries || 0}
          </div>
          <div className="md:col-span-2 rounded-xl border border-admin-border bg-admin-input p-4 text-sm text-admin-text-muted">
            Rebuild index: public portfolio retrieval is rebuilt automatically from the current public corpus on each server refresh. No separate vector index exists in this architecture yet.
          </div>
          <div className="md:col-span-2">
            <p className="mb-2 font-medium text-admin-text">Logs</p>
            <div className="space-y-2">
              {(status?.logs || []).length ? (
                status?.logs?.map((entry, index) => (
                  <div key={`${entry.timestamp}-${index}`} className="rounded-xl border border-admin-border bg-admin-input px-3 py-2 text-xs text-admin-text">
                    <div>{entry.timestamp} - {entry.usedGemini ? "Gemini" : "Fallback"} - {entry.success ? "Success" : "Fallback"}</div>
                    <div className="text-admin-text-muted">{entry.question}</div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-admin-text-muted">No AI logs yet.</p>
              )}
            </div>
          </div>
        </div>
      </details>
    </div>
  );
}
