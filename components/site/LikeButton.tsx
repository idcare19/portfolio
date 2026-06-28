"use client";

import { Heart } from "lucide-react";
import { useEffect, useState } from "react";

export function LikeButton({ targetType, targetSlug }: { targetType: "project" | "blog"; targetSlug: string }) {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    void fetch(`/api/likes/summary?targetType=${targetType}&targetSlug=${encodeURIComponent(targetSlug)}`)
      .then((res) => res.json())
      .then((payload) => {
        setLiked(Boolean(payload.liked));
        setCount(Number(payload.count || 0));
      })
      .catch(() => undefined);
  }, [targetSlug, targetType]);

  async function toggle() {
    const res = await fetch("/api/likes/toggle", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ targetType, targetSlug }),
    });
    const payload = await res.json();
    if (payload?.ok) {
      setLiked(Boolean(payload.liked));
      setCount(Number(payload.count || 0));
    }
  }

  return (
    <button type="button" onClick={toggle} className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold ${liked ? "border-rose-200 bg-rose-50 text-rose-600" : "border-[rgb(var(--border))] text-text-main"}`}>
      <Heart className={`h-4 w-4 ${liked ? "fill-current" : ""}`} />
      {count}
    </button>
  );
}
