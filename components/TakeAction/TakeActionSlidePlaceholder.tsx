"use client";

import { useEffect, useState } from "react";

interface Props {
  eyebrow: string;
  title: string;
  accent: string;
  subtitle: string;
  icon: string;
  slideNumber: string;
  totalSlides: string;
}

export default function TakeActionSlidePlaceholder({
  eyebrow, title, accent, subtitle, icon, slideNumber, totalSlides,
}: Props) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { requestAnimationFrame(() => setVisible(true)); }, []);
  const tr = (d: number) => `opacity 0.7s ease ${d}s, transform 0.7s ease ${d}s`;

  return (
    <div style={{
      width: "100%", height: "100vh", overflow: "hidden",
      background: "#050402", position: "relative",
      display: "flex", flexDirection: "column",
      fontFamily: "var(--font-montserrat)",
    }}>
      {/* ── TOP BAR ── */}
      <div style={{
        height: "48px", flexShrink: 0, display: "flex", alignItems: "center",
        justifyContent: "space-between", padding: "0 clamp(1.2rem,3.5vw,2.5rem)",
        borderBottom: "1px solid rgba(201,168,76,0.1)",
        opacity: visible ? 1 : 0, transition: tr(0),
      }}>
        <div style={{ width: "70px" }} />
        <div style={{ textAlign: "center" }}>
          <p style={{ color: "#C9A84C", fontSize: "0.47rem", letterSpacing: "0.42em", textTransform: "uppercase", fontWeight: 700, margin: 0 }}>
            Take Action
          </p>
          <h1 style={{ color: "#fff", fontSize: "0.82rem", fontWeight: 800, margin: 0, lineHeight: 1, letterSpacing: "0.09em", textTransform: "uppercase" }}>
            {title}
          </h1>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
          <span style={{ color: "#C9A84C", fontSize: "0.68rem", fontWeight: 700 }}>{slideNumber}</span>
          <span style={{ color: "rgba(255,255,255,0.18)", fontSize: "0.62rem" }}>/ {totalSlides}</span>
        </div>
      </div>

      {/* ── BACKGROUND GRID ── */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `
          linear-gradient(rgba(201,168,76,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(201,168,76,0.03) 1px, transparent 1px)
        `,
        backgroundSize: "80px 80px", pointerEvents: "none", zIndex: 0,
      }} />

      {/* ── RADIAL GLOW ── */}
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        width: "600px", height: "600px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 70%)",
        pointerEvents: "none", zIndex: 1,
      }} />

      {/* ── CENTER CONTENT ── */}
      <div style={{
        flex: 1, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        position: "relative", zIndex: 2,
        padding: "2rem clamp(1.5rem,4vw,3rem)",
        textAlign: "center", gap: "1.5rem",
      }}>
        {/* Icon */}
        <div style={{
          width: "72px", height: "72px", borderRadius: "50%",
          border: "1.5px solid rgba(201,168,76,0.3)",
          background: "rgba(201,168,76,0.04)",
          display: "flex", alignItems: "center", justifyContent: "center",
          opacity: visible ? 1 : 0, transform: visible ? "scale(1)" : "scale(0.8)",
          transition: `opacity 0.6s ease 0.1s, transform 0.6s ease 0.1s`,
        }}>
          <span style={{ fontSize: "1.6rem", color: "#C9A84C", lineHeight: 1 }}>{icon}</span>
        </div>

        {/* Eyebrow */}
        <p style={{
          color: "#C9A84C", fontSize: "0.62rem", letterSpacing: "0.4em",
          textTransform: "uppercase", fontWeight: 700, margin: 0,
          opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(12px)",
          transition: tr(0.15),
        }}>
          {eyebrow}
        </p>

        {/* Title */}
        <h2 style={{
          color: "#fff", fontSize: "clamp(1.8rem,4vw,3.2rem)", fontWeight: 800,
          margin: 0, lineHeight: 1.1, letterSpacing: "0.04em",
          opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(18px)",
          transition: tr(0.22),
        }}>
          {title}
          <br />
          <span style={{ color: "#C9A84C" }}>{accent}</span>
        </h2>

        {/* Subtitle */}
        <p style={{
          color: "rgba(255,255,255,0.38)", fontSize: "clamp(0.78rem,1.2vw,0.92rem)",
          fontWeight: 400, margin: 0, maxWidth: "460px", lineHeight: 1.7,
          opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(14px)",
          transition: tr(0.3),
        }}>
          {subtitle}
        </p>

        {/* Placeholder badge */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "0.6rem",
          background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.18)",
          padding: "0.5rem 1.2rem", marginTop: "0.5rem",
          opacity: visible ? 1 : 0, transition: tr(0.4),
        }}>
          <div style={{ width: "5px", height: "5px", background: "#C9A84C", transform: "rotate(45deg)" }} />
          <span style={{
            color: "rgba(201,168,76,0.7)", fontSize: "0.58rem", fontWeight: 700,
            letterSpacing: "0.2em", textTransform: "uppercase",
          }}>
            Coming Soon — AI-Generated Content
          </span>
        </div>

        {/* Decorative line */}
        <div style={{
          width: "1px", height: "48px",
          background: "linear-gradient(to bottom, rgba(201,168,76,0.4), transparent)",
          marginTop: "1rem",
          opacity: visible ? 1 : 0, transition: tr(0.45),
        }} />
      </div>

      {/* ── BOTTOM BAR ── */}
      <div style={{
        height: "36px", flexShrink: 0, display: "flex", alignItems: "center",
        justifyContent: "center", borderTop: "1px solid rgba(201,168,76,0.08)",
        opacity: visible ? 0.6 : 0, transition: tr(0.5),
      }}>
        <p style={{
          color: "rgba(201,168,76,0.4)", fontSize: "0.5rem", fontWeight: 600,
          letterSpacing: "0.25em", textTransform: "uppercase", margin: 0,
        }}>
          Mall of America · Interactive Deck
        </p>
      </div>
    </div>
  );
}
