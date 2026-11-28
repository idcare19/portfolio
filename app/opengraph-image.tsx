import { ImageResponse } from "next/og";

export const alt = "Abhishek (idcare19) — Full-Stack Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <div style={{ background: "#0b1220", color: "#f8fafc", height: "100%", width: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: "80px", fontFamily: "Arial" }}>
      <div style={{ color: "#60a5fa", fontSize: 28, marginBottom: 28 }}>idcare19.me</div>
      <div style={{ fontSize: 72, fontWeight: 700 }}>Abhishek</div>
      <div style={{ fontSize: 40, marginTop: 20, color: "#cbd5e1" }}>Full-Stack Developer · India · Remote</div>
      <div style={{ fontSize: 26, marginTop: 38, color: "#94a3b8" }}>Next.js · React · TypeScript · Django</div>
    </div>,
    size
  );
}
