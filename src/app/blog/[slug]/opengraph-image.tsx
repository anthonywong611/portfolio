import { ImageResponse } from "next/og";
import { getPostBySlug } from "@/lib/mdx";

export const alt = "Blog post";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  const title = post?.title ?? "Blog Post";

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
          padding: 60,
        }}
      >
        <div
          style={{
            fontSize: 24,
            color: "#10b981",
            marginBottom: 16,
          }}
        >
          Blog
        </div>
        <div
          style={{
            fontSize: 48,
            fontWeight: 700,
            color: "#f1f5f9",
            textAlign: "center",
            lineHeight: 1.3,
          }}
        >
          {title}
        </div>
        <div style={{ fontSize: 22, color: "#94a3b8", marginTop: 24 }}>
          Anthony Wong
        </div>
      </div>
    ),
    { ...size }
  );
}
