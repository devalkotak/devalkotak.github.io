import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Deval Kotak, security engineering";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#030303",
          padding: "64px 72px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 24, color: "#6b6b6b" }}>
          deval kotak
          <span style={{ color: "#58a6ff", padding: "0 10px" }}>/</span>
          mumbai
          <span style={{ color: "#58a6ff", padding: "0 10px" }}>/</span>
          security engineering
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: 56,
            fontSize: 64,
            fontWeight: 700,
          }}
        >
          <div style={{ display: "flex", height: 78, color: "#ededed" }}>
            I break systems
          </div>
          <div style={{ display: "flex", height: 78, color: "#6b6b6b" }}>
            to understand them.
          </div>
          <div style={{ display: "flex", height: 78, color: "#ededed" }}>
            And build
            <span style={{ color: "#58a6ff", paddingLeft: 18 }}>
              stronger ones.
            </span>
          </div>
        </div>

        <div style={{ display: "flex", flexGrow: 1 }} />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            borderTop: "1px solid #1a1a1a",
            paddingTop: 28,
            fontSize: 22,
            color: "#6b6b6b",
          }}
        >
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: 999,
              background: "#3fb950",
              marginRight: 14,
            }}
          />
          open to security engineering roles
          <div style={{ display: "flex", flexGrow: 1 }} />
          <div style={{ display: "flex", color: "#58a6ff" }}>
            devalkotak.github.io
          </div>
        </div>
      </div>
    ),
    size
  );
}
