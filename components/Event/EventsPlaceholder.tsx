"use client";

import { useEffect, useRef, useState } from "react";

export default function EventsPlaceholder() {
  const sectionRef = useRef<HTMLElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="events-placeholder"
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        background: "#050402",
      }}
    >
      {/* Grain overlay */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none", opacity: 0.5,
        backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E\")",
        backgroundSize: "200px 200px",
      }} />

      {/* Ambient glow */}
      <div style={{
        position: "absolute",
        width: "clamp(300px, 50vw, 600px)",
        height: "clamp(300px, 50vw, 600px)",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 70%)",
        filter: "blur(80px)",
        zIndex: 1,
      }} />

      {/* Content */}
      <div style={{
        position: "relative",
        zIndex: 5,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "1.5rem",
        textAlign: "center",
        padding: "2rem",
        opacity: mounted ? 1 : 0,
        transform: mounted ? "translateY(0)" : "translateY(20px)",
        transition: "all 0.8s cubic-bezier(0.22, 1, 0.36, 1)",
      }}>
        {/* Chapter number */}
        <p style={{
          color: "rgba(201,168,76,0.4)",
          fontSize: "0.6rem",
          letterSpacing: "0.4em",
          textTransform: "uppercase",
          fontFamily: "var(--font-montserrat)",
          fontWeight: 700,
          margin: 0,
        }}>
          Chapter 05
        </p>

        {/* Diamond icon */}
        <svg viewBox="0 0 44 44" width="48" height="48" style={{ opacity: 0.5 }}>
          <defs>
            <linearGradient id="evt-g" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F0D988" />
              <stop offset="100%" stopColor="#C9A84C" />
            </linearGradient>
          </defs>
          <circle cx="22" cy="22" r="18" fill="none" stroke="url(#evt-g)" strokeWidth="0.5" opacity="0.4" />
          <polygon points="22,12 32,22 22,32 12,22" fill="none" stroke="url(#evt-g)" strokeWidth="1" />
          <polygon points="22,16 28,22 22,28 16,22" fill="url(#evt-g)" opacity="0.3" />
        </svg>

        {/* Title */}
        <h2 style={{
          color: "#ffffff",
          fontSize: "clamp(1.8rem, 4vw, 3.2rem)",
          fontWeight: 800,
          fontFamily: "var(--font-montserrat)",
          margin: 0,
          lineHeight: 1.1,
          letterSpacing: "0.04em",
          textTransform: "uppercase",
        }}>
          Events
        </h2>

        {/* Divider */}
        <div style={{
          width: "48px",
          height: "2px",
          background: "linear-gradient(to right, transparent, #C9A84C, transparent)",
        }} />

        {/* Subtitle */}
        <p style={{
          color: "rgba(255,255,255,0.35)",
          fontSize: "clamp(0.78rem, 1.2vw, 0.92rem)",
          fontFamily: "var(--font-montserrat)",
          fontWeight: 400,
          margin: 0,
          maxWidth: "380px",
          lineHeight: 1.7,
        }}>
          500+ events per year. From brand activations to tech conferences — 
          this section is coming soon.
        </p>

        {/* Coming soon pill */}
        <div style={{
          marginTop: "0.5rem",
          padding: "0.5rem 1.4rem",
          border: "1px solid rgba(201,168,76,0.2)",
          background: "rgba(201,168,76,0.04)",
        }}>
          <span style={{
            color: "#C9A84C",
            fontSize: "0.58rem",
            fontWeight: 700,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            fontFamily: "var(--font-montserrat)",
          }}>
            Coming Soon
          </span>
        </div>
      </div>

      {/* Corner brackets */}
      {(["tl", "tr", "bl", "br"] as const).map(pos => (
        <div key={pos} style={{
          position: "absolute",
          width: "20px",
          height: "20px",
          zIndex: 5,
          pointerEvents: "none",
          ...(pos.includes("t") ? { top: "clamp(1rem, 3vh, 2rem)" } : { bottom: "clamp(1rem, 3vh, 2rem)" }),
          ...(pos.includes("l") ? { left: "clamp(1rem, 3vw, 2rem)" } : { right: "clamp(1rem, 3vw, 2rem)" }),
          borderTop: pos.includes("t") ? "1px solid rgba(201,168,76,0.2)" : "none",
          borderBottom: pos.includes("b") ? "1px solid rgba(201,168,76,0.2)" : "none",
          borderLeft: pos.includes("l") ? "1px solid rgba(201,168,76,0.2)" : "none",
          borderRight: pos.includes("r") ? "1px solid rgba(201,168,76,0.2)" : "none",
          opacity: mounted ? 1 : 0,
          transition: "opacity 1.2s ease 0.3s",
        }} />
      ))}
    </section>
  );
}
