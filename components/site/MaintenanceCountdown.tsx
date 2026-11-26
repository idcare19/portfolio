"use client";

import { useEffect, useMemo, useState } from "react";

function getTarget(value: string) {
  const absolute = Date.parse(value);
  if (!Number.isNaN(absolute) && /\d{4}/.test(value)) return absolute;

  const match = value.match(/(?:in\s+)?(\d+(?:\.\d+)?)\s*(hour|hr|minute|min|day|second|sec)s?/i);
  if (!match) return null;

  const amount = Number(match[1]);
  const unit = match[2].toLowerCase();
  const multiplier = unit.startsWith("day")
    ? 86_400_000
    : unit.startsWith("hour") || unit.startsWith("hr")
      ? 3_600_000
      : unit.startsWith("minute") || unit.startsWith("min")
        ? 60_000
        : 1_000;

  return Date.now() + amount * multiplier;
}

function formatRemaining(ms: number) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return days > 0
    ? `${days}d ${hours}h ${minutes}m ${seconds}s`
    : `${String(hours).padStart(2, "0")}h ${String(minutes).padStart(2, "0")}m ${String(seconds).padStart(2, "0")}s`;
}

export function MaintenanceCountdown({ value }: { value: string }) {
  const target = useMemo(() => getTarget(value), [value]);
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    if (!target) return;
    const update = () => setRemaining(Math.max(0, target - Date.now()));
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, [target]);

  return <p className="text-base font-semibold">{remaining === null ? value : remaining > 0 ? formatRemaining(remaining) : "Any moment now"}</p>;
}
