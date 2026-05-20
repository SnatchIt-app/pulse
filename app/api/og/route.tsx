import { ImageResponse } from "next/og";

export const runtime = "edge";

// Default brand OG image.
export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#F6F2EC",
          color: "#0A0A0A",
          fontSize: 140,
          letterSpacing: "0.08em",
        }}
      >
        PULSE
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
