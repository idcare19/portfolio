"use client";

import { trackClientEvent } from "@/components/site/AnalyticsTracker";

export function ResumeButtons({ resumeUrl }: { resumeUrl: string }) {
  const track = () => trackClientEvent("resume-download", { targetType: "resume", targetSlug: "primary" });

  return (
    <>
      <a href={resumeUrl} target="_blank" rel="noreferrer" onClick={track} className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white">
        Open Resume
      </a>
      <a href={resumeUrl} download onClick={track} className="rounded-full border border-[rgb(var(--border))] px-5 py-2.5 text-sm font-semibold text-text-main">
        Download
      </a>
    </>
  );
}
