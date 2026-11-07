import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#F6F4EE",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "flex-end",
          padding: "60px",
          position: "relative",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundImage: "repeating-linear-gradient(90deg, rgba(18,19,22,0.06) 0px, rgba(18,19,22,0.06) 1px, transparent 1px, transparent 100px)",
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "24px",
            background: "#D2FF28",
            border: "1.5px solid #121316",
            padding: "6px 16px",
            borderRadius: "999px",
          }}
        >
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#121316" }} />
          <span style={{ fontFamily: "monospace", fontSize: 14, fontWeight: 700, letterSpacing: "0.15em" }}>
            COHORT OPEN · 15 SPOTS
          </span>
        </div>

        <div
          style={{
            fontSize: 76,
            fontWeight: 900,
            lineHeight: 0.9,
            letterSpacing: "-0.03em",
            color: "#121316",
            marginBottom: "24px",
            maxWidth: 900,
          }}
        >
          Empower Your Kid To Build The Next App in 8 Weeks.
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
          <div style={{ fontFamily: "monospace", fontSize: 20, fontWeight: 700, color: "#121316", letterSpacing: "0.1em" }}>
            TACTYQAL LABS · tactyqal.com
          </div>
          <div
            style={{
              background: "#FF4F18",
              color: "white",
              fontFamily: "monospace",
              fontSize: 16,
              fontWeight: 700,
              padding: "10px 24px",
              border: "1.5px solid #121316",
              boxShadow: "4px 4px 0 #121316",
              letterSpacing: "0.1em",
            }}
          >
            ₹16,000 · BOOK NOW
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}

