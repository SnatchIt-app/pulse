import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

// Generates /favicon.ico + <link rel="icon"> automatically via Next.js App Router.
export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        background: "#0a0a0a",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          color: "#f6f2ec",
          fontSize: 20,
          fontFamily: "Georgia, serif",
          fontWeight: 400,
          letterSpacing: "-0.04em",
          lineHeight: 1,
        }}
      >
        P
      </div>
    </div>,
    { ...size },
  );
}
