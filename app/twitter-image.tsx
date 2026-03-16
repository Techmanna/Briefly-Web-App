import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";
export const alt = "Briefly";

function formatDate(d: Date) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "2-digit",
    year: "numeric",
  }).format(d);
}

export default function Image() {
  const dateLabel = formatDate(new Date());

  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0a0a0b",
        padding: 64,
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 48,
          border: "1px solid rgba(255,255,255,0.12)",
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 40%, rgba(255,255,255,0.04) 100%)",
          boxShadow: "0 30px 80px rgba(0,0,0,0.45)",
        }}
      >
        <div
          style={{
            fontSize: 96,
            fontWeight: 800,
            letterSpacing: -2,
            color: "#ffffff",
            lineHeight: 1.05,
            marginBottom: 20,
          }}
        >
          Briefly.
        </div>
        <div
          style={{
            fontSize: 34,
            fontWeight: 500,
            color: "rgba(255,255,255,0.82)",
            letterSpacing: -0.2,
          }}
        >
          {dateLabel}
        </div>
      </div>
    </div>,
    {
      ...size,
    },
  );
}
