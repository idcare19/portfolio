"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Copy, Download, FileJson, Upload, RotateCcw } from "lucide-react";

type JsonEditorPanelProps<T> = {
  value: T;
  onApply: (next: T) => void;
  getItemId?: (item: any, index: number) => string;
  requiredPaths?: string[];
  title?: string;
  description?: string;
};

function safeStringify(value: unknown) {
  return JSON.stringify(value, null, 2);
}

function asMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

function positionToLineColumn(source: string, position: number) {
  const before = source.slice(0, position);
  const line = before.split("\n").length;
  const column = before.length - before.lastIndexOf("\n");
  return { line, column };
}

function extractJsonError(error: unknown, source: string) {
  const message = asMessage(error);
  const match = /position\s+(\d+)/i.exec(message);
  if (!match) return message;
  const { line, column } = positionToLineColumn(source, Number(match[1]));
  return `${message} (line ${line}, column ${column})`;
}

function hasRequiredPath(item: any, path: string) {
  const value = path.split(".").reduce<any>((acc, key) => (acc == null ? acc : acc[key]), item);
  if (Array.isArray(value)) return value.length > 0;
  return String(value ?? "").trim().length > 0;
}

export function JsonEditorPanel<T>({ value, onApply, requiredPaths = ["title", "slug"], title = "JSON Editor", description = "Edit the raw JSON safely." }: JsonEditorPanelProps<T>) {
  const [draft, setDraft] = useState(() => safeStringify(value));
  const [error, setError] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setDraft(safeStringify(value));
    setError("");
  }, [value]);

  function validate(nextDraft: string) {
    try {
      const parsed = JSON.parse(nextDraft);
      if (Array.isArray(parsed)) {
        const invalid = parsed.find((item) => requiredPaths.some((path) => !hasRequiredPath(item, path)));
        if (invalid) {
          setError(`Required fields missing: ${requiredPaths.join(", ")}`);
          return false;
        }
      }
      setError("");
      return true;
    } catch (err) {
      setError(extractJsonError(err, nextDraft));
      return false;
    }
  }

  function setAndValidate(next: string) {
    setDraft(next);
    validate(next);
  }

  function applyDraft() {
    if (!validate(draft)) return;
    onApply(JSON.parse(draft));
    setShowConfirm(false);
  }

  function copyJson() {
    void navigator.clipboard.writeText(draft);
  }

  function exportJson() {
    const blob = new Blob([draft], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "section-data.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  async function importJson(file: File | null) {
    if (!file) return;
    setAndValidate(await file.text());
  }

  return (
    <div className="space-y-4">
      <div className="rounded-3xl border border-admin-border bg-admin-bg p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-admin-text">{title}</h3>
            <p className="mt-1 text-xs text-admin-text-muted">{description}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => setAndValidate(safeStringify(value))} className="inline-flex items-center gap-2 rounded-full border border-admin-border bg-white px-3 py-2 text-xs font-semibold text-admin-text">
              <RotateCcw className="h-3.5 w-3.5" /> Format JSON
            </button>
            <button type="button" onClick={copyJson} className="inline-flex items-center gap-2 rounded-full border border-admin-border bg-white px-3 py-2 text-xs font-semibold text-admin-text">
              <Copy className="h-3.5 w-3.5" /> Copy JSON
            </button>
            <button type="button" onClick={() => fileInputRef.current?.click()} className="inline-flex items-center gap-2 rounded-full border border-admin-border bg-white px-3 py-2 text-xs font-semibold text-admin-text">
              <Upload className="h-3.5 w-3.5" /> Import JSON
            </button>
            <button type="button" onClick={exportJson} className="inline-flex items-center gap-2 rounded-full border border-admin-border bg-white px-3 py-2 text-xs font-semibold text-admin-text">
              <Download className="h-3.5 w-3.5" /> Export JSON
            </button>
            <button type="button" onClick={() => setDraft(safeStringify(value))} className="inline-flex items-center gap-2 rounded-full border border-admin-border bg-white px-3 py-2 text-xs font-semibold text-admin-text">
              <FileJson className="h-3.5 w-3.5" /> Reset Changes
            </button>
          </div>
        </div>
        <input ref={fileInputRef} type="file" accept="application/json" className="hidden" onChange={(e) => void importJson(e.target.files?.[0] || null)} />
      </div>
      <div className="overflow-hidden rounded-[22px] border border-admin-border bg-admin-input">
        <div className="grid grid-cols-[auto,1fr]">
          <pre className="select-none overflow-hidden border-r border-admin-border bg-admin-bg px-3 py-4 text-right text-xs leading-6 text-admin-text-muted">
            {draft.split("\n").map((_, index) => <div key={index}>{index + 1}</div>)}
          </pre>
          <textarea
            value={draft}
            onChange={(e) => setAndValidate(e.target.value)}
            rows={24}
            className="min-h-[420px] w-full bg-transparent px-4 py-4 font-mono text-sm leading-6 text-admin-text outline-none"
            spellCheck={false}
          />
        </div>
      </div>
      {error ? <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p> : null}
      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={() => setShowConfirm(true)} disabled={Boolean(error)} className="rounded-xl bg-admin-primary px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
          Save JSON Changes
        </button>
        <button type="button" onClick={() => setDraft(safeStringify(value))} className="rounded-xl border border-admin-border bg-admin-bg px-4 py-2 text-sm font-semibold text-admin-text">
          Reset Changes
        </button>
      </div>
      {showConfirm ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm font-semibold text-amber-900">Confirm JSON save</p>
          <p className="mt-1 text-sm text-amber-800">This replaces the current editor data. Invalid JSON and missing required fields are blocked.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" onClick={applyDraft} disabled={Boolean(error)} className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">Confirm Save</button>
            <button type="button" onClick={() => setShowConfirm(false)} className="rounded-lg border border-amber-300 bg-white px-4 py-2 text-sm font-semibold text-amber-900">Cancel</button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
