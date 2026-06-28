"use client";

import { Share2 } from "lucide-react";
import { trackClientEvent } from "@/components/site/AnalyticsTracker";

export function ShareButtons({ title, path }: { title: string; path: string }) {
  const url = typeof window !== "undefined" ? `${window.location.origin}${path}` : path;

  async function copyLink() {
    await navigator.clipboard.writeText(url);
    trackClientEvent("external-link-click", { targetType: "share", targetSlug: path, channel: "copy" });
  }

  return (
    <div className="flex flex-wrap gap-2">
      <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`} target="_blank" rel="noreferrer" onClick={() => trackClientEvent("linkedin-click", { targetType: "share", targetSlug: path })} className="rounded-full border border-[rgb(var(--border))] px-4 py-2 text-sm font-semibold text-text-main">LinkedIn</a>
      <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`} target="_blank" rel="noreferrer" onClick={() => trackClientEvent("external-link-click", { targetType: "share", targetSlug: path, channel: "x" })} className="rounded-full border border-[rgb(var(--border))] px-4 py-2 text-sm font-semibold text-text-main">X</a>
      <a href={`https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`} target="_blank" rel="noreferrer" onClick={() => trackClientEvent("external-link-click", { targetType: "share", targetSlug: path, channel: "whatsapp" })} className="rounded-full border border-[rgb(var(--border))] px-4 py-2 text-sm font-semibold text-text-main">WhatsApp</a>
      <button type="button" onClick={copyLink} className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white"><Share2 className="h-4 w-4" />Copy Link</button>
    </div>
  );
}
