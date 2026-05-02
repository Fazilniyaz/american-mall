"use client";

// ── Shared placeholder used by all upcoming event slides ──────────────────────
// Each slide passes its own identity; AI will replace each file later.

interface Props {
  chapter: string;
  category: string;
  title: string;
  subtitle: string;
  accent?: string;
  icon?: string;
  path: string;
}

export default function EventSlidePlaceholder({
  chapter,
  category,
  title,
  subtitle,
  accent = "#C9A84C",
  icon = "◈",
  path,
}: Props) {
  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        background: "#050402",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        fontFamily: "var(--font-montserrat, 'Montserrat', sans-serif)",
      }}
    >
      {/* Ambient glow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse 55% 55% at 50% 50%, ${accent}0d 0%, transparent 70%)`,
          pointerEvents: "none",
        }}
      />

      {/* Corner brackets */}
      {(["tl", "tr", "bl", "br"] as const).map((pos) => (
        <div
          key={pos}
          style={{
            position: "absolute",
            width: "20px",
            height: "20px",
            ...(pos.includes("t") ? { top: "1.5rem" } : { bottom: "1.5rem" }),
            ...(pos.includes("l") ? { left: "1.5rem" } : { right: "1.5rem" }),
            borderTop: pos.includes("t") ? `1px solid ${accent}44` : "none",
            borderBottom: pos.includes("b") ? `1px solid ${accent}44` : "none",
            borderLeft: pos.includes("l") ? `1px solid ${accent}44` : "none",
            borderRight: pos.includes("r") ? `1px solid ${accent}44` : "none",
          }}
        />
      ))}

      {/* Chapter badge */}
      <p
        style={{
          position: "absolute",
          top: "1.6rem",
          left: "50%",
          transform: "translateX(-50%)",
          color: `${accent}99`,
          fontSize: "0.52rem",
          letterSpacing: "0.4em",
          textTransform: "uppercase",
          fontWeight: 700,
          margin: 0,
        }}
      >
        {chapter}
      </p>

      {/* Route label — bottom left */}
      <p
        style={{
          position: "absolute",
          bottom: "1.6rem",
          left: "1.8rem",
          color: "rgba(255,255,255,0.18)",
          fontSize: "0.44rem",
          letterSpacing: "0.2em",
          fontWeight: 500,
          margin: 0,
        }}
      >
        {path}
      </p>

      {/* Center content */}
      <div style={{ textAlign: "center", maxWidth: "520px", padding: "0 2rem" }}>
        {/* Icon */}
        <div
          style={{
            fontSize: "2.8rem",
            color: accent,
            marginBottom: "1.6rem",
            opacity: 0.7,
          }}
        >
          {icon}
        </div>

        {/* Category eyebrow */}
        <p
          style={{
            color: accent,
            fontSize: "0.58rem",
            letterSpacing: "0.4em",
            textTransform: "uppercase",
            fontWeight: 700,
            margin: "0 0 0.7rem",
          }}
        >
          {category}
        </p>

        {/* Title */}
        <h1
          style={{
            color: "#ffffff",
            fontSize: "clamp(1.8rem, 4vw, 3.2rem)",
            fontWeight: 900,
            margin: "0 0 1rem",
            lineHeight: 1.1,
            letterSpacing: "0.02em",
          }}
        >
          {title}
        </h1>

        {/* Subtitle */}
        <p
          style={{
            color: "rgba(255,255,255,0.38)",
            fontSize: "clamp(0.75rem, 1.2vw, 0.9rem)",
            lineHeight: 1.7,
            margin: "0 0 2.5rem",
          }}
        >
          {subtitle}
        </p>

        {/* BUILD WITH AI badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.6rem",
            border: `1px solid ${accent}33`,
            padding: "0.55rem 1.2rem",
          }}
        >
          <span
            style={{
              width: "6px",
              height: "6px",
              background: accent,
              display: "inline-block",
              animation: "plc-pulse 2s ease-in-out infinite",
            }}
          />
          <span
            style={{
              color: `${accent}bb`,
              fontSize: "0.52rem",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              fontWeight: 700,
            }}
          >
            Build with AI
          </span>
        </div>
      </div>

      <style>{`
        @keyframes plc-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.35; transform: scale(0.65); }
        }
      `}</style>
    </div>
  );
}
