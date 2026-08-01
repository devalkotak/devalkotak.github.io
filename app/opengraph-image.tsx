import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Deval Kotak — application security";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#030303",
          padding: "72px 80px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 26, color: "#6b6b6b" }}>
            deval kotak
            <span style={{ color: "#58a6ff", padding: "0 12px" }}>/</span>
            mumbai
            <span style={{ color: "#58a6ff", padding: "0 12px" }}>/</span>
            application security
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: 64,
              fontSize: 82,
              fontWeight: 700,
              lineHeight: 1.12,
            }}
          >
            <div style={{ display: "flex", color: "#ededed" }}>
              I break systems
              <span style={{ color: "#6b6b6b", paddingLeft: 20 }}>
                to understand them.
              </span>
            </div>
            <div style={{ display: "flex", color: "#ededed" }}>
              And build
              <span style={{ color: "#58a6ff", paddingLeft: 20 }}>
                stronger ones.
              </span>
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            borderTop: "1px solid #1a1a1a",
            paddingTop: 32,
            fontSize: 24,
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
          <div style={{ flex: 1 }} />
          <div style={{ color: "#58a6ff" }}>devalkotak.github.io</div>
        </div>
      </div>
    ),
    size
  );
}
