import { ImageResponse } from "next/og";
import { site } from "@/data/site";

export const alt = `${site.name} — Trouve ta voie, apprends ce qui compte`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, background: "radial-gradient(circle at 15% 10%, #1b2a6b 0%, #05060b 55%), #05060b", color: "#eef0f7" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 34, fontWeight: 600 }}>
          <div style={{ width: 44, height: 44, borderRadius: 999, border: "2px solid #6b8cff", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 12, height: 12, borderRadius: 999, background: "#fff" }} />
          </div>
          {site.name}
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 72, fontWeight: 700, lineHeight: 1.02, letterSpacing: -3, maxWidth: 980 }}>Tu ne sais pas encore quoi faire de ta vie ?</div>
          <div style={{ fontSize: 72, fontWeight: 700, lineHeight: 1.02, letterSpacing: -3, color: "#8fa8ff" }}>C&apos;est pour ça qu&apos;on existe.</div>
        </div>
        <div style={{ fontSize: 26, color: "#9aa1b8" }}>Orientation gratuite · Formations e-commerce, IA, contenu, finance, business digital</div>
      </div>
    ),
    size,
  );
}
