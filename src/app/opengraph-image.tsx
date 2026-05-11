import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Anthony Wong — Software Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0f172a",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 64, fontWeight: 800, color: "#f1f5f9" }}>
          Anthony Wong
        </div>
        <div style={{ fontSize: 28, color: "#10b981", marginTop: 16 }}>
          Software Engineer
        </div>
      </div>
    ),
    { ...size }
  );
}
