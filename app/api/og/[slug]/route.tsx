import { ImageResponse } from "next/og";

export const runtime = "edge";

// Per-vehicle / per-residence OG. Phase 3 wires real data (image + rate);
// Phase 1 renders a branded card from the slug only.
export async function GET(_req: Request, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params;
  const label = slug.replace(/-/g, " ");
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 64,
        background: "#0A0A0A",
        color: "#F6F2EC",
      }}
    >
      <div
        style={{ fontSize: 28, letterSpacing: "0.2em", textTransform: "uppercase", opacity: 0.7 }}
      >
        PULSE
      </div>
      <div style={{ fontSize: 72, lineHeight: 1.05, textTransform: "capitalize" }}>{label}</div>
    </div>,
    { width: 1200, height: 630 },
  );
}
