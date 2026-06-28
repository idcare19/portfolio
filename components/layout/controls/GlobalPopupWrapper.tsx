"use client";

import dynamic from "next/dynamic";

const GlobalPopupAnnouncement = dynamic(
  () => import("@/components/layout/controls/GlobalPopupAnnouncement").then((module) => module.GlobalPopupAnnouncement),
  { ssr: false }
);

export function GlobalPopupWrapper() {
  return <GlobalPopupAnnouncement />;
}
