"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const THUMBS = [
  { src: "/photos/nickelodeon-arcade.jpg", label: "Arcade Zone", desc: "Neon-lit gaming world" },
  { src: "/photos/nickelodeon-ride.jpg", label: "Ride World", desc: "30+ rides & attractions" },
];

const STATS = [
  { value: "7", label: "Roller Coasters" },
  { value: "30+", label: "Rides & Attractions" },
  { value: "12M+", label: "Rides taken yearly" },
  { value: "#1", label: "Largest indoor park" },
];

export default function NickelodeonPanel() {
  const [visible, setVisible] = useState(false);

  // Single rAF-deferred mount — gives browser one frame to paint background first
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      setVisible(true);
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      className="nick-panel"
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        background: "#050402",
      }}
    >
      {/* ── Hero background image ── */}
      <div style={{ position: "absolute", inset: 0, zIndex: 1 }}>
        <picture>
          <source media="(max-width: 767px)" srcSet="/photos/nickelodeon-park-mobile.jpg" />
          <img
            src="/photos/nickelodeon-park.jpg"
            alt="Nickelodeon Universe — pirate ship atrium at Mall of America"
            fetchPriority="high"
            decoding="async"
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 30%" }}
          />
        </picture>

        {/* Multi-layer overlay */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(105deg, rgba(5,4,2,0.92) 0%, rgba(5,4,2,0.75) 42%, rgba(5,4,2,0.25) 70%, rgba(5,4,2,0.1) 100%)",
          zIndex: 2,
        }} />
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: "180px",
          background: "linear-gradient(to bottom, transparent, #050402)", zIndex: 3,
        }} />
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: "80px",
          background: "linear-gradient(to top, transparent, #050402)", zIndex: 3,
        }} />
      </div>

      {/* ── Content ── */}
      <div
        style={{
          position: "relative", zIndex: 4, width: "100%",
          padding: "6rem clamp(1.5rem, 6vw, 6rem)",
          display: "grid", gap: "3rem",
        }}
        className="nick-content-grid"
      >
        {/* Left — text block */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem", maxWidth: "520px" }}>
          
          <p style={{
            color: "#C9A84C", fontSize: "0.68rem", letterSpacing: "0.42em",
            textTransform: "uppercase", fontFamily: "var(--font-montserrat)",
            fontWeight: 700, margin: 0,
            opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.55s ease, transform 0.55s cubic-bezier(0.22,1,0.36,1)",
          }}>Theme Park · Nickelodeon Universe</p>

          <h2 style={{
            color: "#ffffff", fontSize: "clamp(2.4rem, 5.5vw, 5rem)",
            fontWeight: 800, fontFamily: "var(--font-montserrat)",
            margin: 0, lineHeight: 0.95,
            opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.65s ease 0.1s, transform 0.65s cubic-bezier(0.22,1,0.36,1) 0.1s",
          }}>7 roller<br />coasters.</h2>

          <h3 style={{
            color: "rgba(255,255,255,0.42)", fontSize: "clamp(1.2rem, 2.8vw, 2.2rem)",
            fontWeight: 800, fontFamily: "var(--font-montserrat)",
            margin: 0, lineHeight: 1.1,
            opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.6s ease 0.2s, transform 0.6s cubic-bezier(0.22,1,0.36,1) 0.2s",
          }}>Inside a mall.</h3>

          <div style={{ width: "48px", height: "2px", background: "linear-gradient(to right, #C9A84C, rgba(201,168,76,0.2))" }} />

          <p style={{
            color: "rgba(255,255,255,0.55)", fontSize: "clamp(0.82rem, 1.3vw, 0.96rem)",
            fontFamily: "var(--font-montserrat)", fontWeight: 400,
            lineHeight: 1.8, margin: 0, maxWidth: "420px",
            opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.6s ease 0.3s, transform 0.6s cubic-bezier(0.22,1,0.36,1) 0.3s",
          }}>
            Nickelodeon Universe is the largest indoor theme park in North
            America — and it lives inside Mall of America. Your brand sits
            steps away from the most visited attraction in Minnesota, drawing
            families from across the continent every single day.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem", marginTop: "0.4rem" }}>
            {STATS.map((s, i) => (
              <div key={s.value} style={{
                background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.18)",
                padding: "0.75rem 1rem",
                opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(12px)",
                transition: `opacity 0.5s ease ${0.38 + i * 0.09}s, transform 0.5s cubic-bezier(0.22,1,0.36,1) ${0.38 + i * 0.09}s`,
              }}>
                <div style={{ color: "#C9A84C", fontSize: "clamp(1.1rem, 2vw, 1.5rem)", fontWeight: 800, fontFamily: "var(--font-montserrat)", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>{s.value}</div>
                <div style={{ color: "rgba(255,255,255,0.38)", fontSize: "0.58rem", letterSpacing: "0.14em", textTransform: "uppercase", fontFamily: "var(--font-montserrat)", fontWeight: 600, marginTop: "0.25rem" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — thumbnail stack */}
        <div className="nick-thumbs-col" style={{ display: "flex", flexDirection: "column", gap: "1px", alignSelf: "center" }}>
          {THUMBS.map((t, i) => (
            <div key={t.src} style={{
              position: "relative", width: "100%", height: "clamp(140px, 18vw, 220px)",
              overflow: "hidden",
              opacity: visible ? 1 : 0, transform: visible ? "translateX(0)" : "translateX(40px)",
              transition: `opacity 0.6s ease ${0.54 + i * 0.14}s, transform 0.6s cubic-bezier(0.22,1,0.36,1) ${0.54 + i * 0.14}s`,
            }}>
              <Image src={t.src} alt={t.label} fill sizes="(max-width: 768px) 100vw, 35vw"
                style={{ objectFit: "cover", transition: "transform 0.6s ease" }}
                onMouseEnter={e => { (e.target as HTMLImageElement).style.transform = "scale(1.06)"; }}
                onMouseLeave={e => { (e.target as HTMLImageElement).style.transform = "scale(1)"; }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(5,4,2,0.75) 0%, rgba(5,4,2,0.1) 60%)" }} />
              <div style={{ position: "absolute", bottom: "0.8rem", left: "0.8rem", zIndex: 2 }}>
                <div style={{ color: "#C9A84C", fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", fontFamily: "var(--font-montserrat)", lineHeight: 1 }}>{t.label}</div>
                <div style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.58rem", fontFamily: "var(--font-montserrat)", fontWeight: 400, marginTop: "0.2rem" }}>{t.desc}</div>
              </div>
              <div style={{ position: "absolute", top: "8px", right: "8px", width: "14px", height: "14px", borderTop: "1px solid rgba(201,168,76,0.5)", borderRight: "1px solid rgba(201,168,76,0.5)" }} />
            </div>
          ))}

          <div style={{ borderTop: "1px solid rgba(201,168,76,0.12)", paddingTop: "0.8rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ color: "rgba(255,255,255,0.28)", fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", fontFamily: "var(--font-montserrat)", fontWeight: 600 }}>North America&apos;s largest indoor park</span>
            <span style={{ color: "#C9A84C", fontSize: "0.75rem", opacity: 0.7 }}>→</span>
          </div>
        </div>
      </div>

      {/* Panel number watermark */}
      <div style={{
        position: "absolute", right: "clamp(1.5rem, 5vw, 4rem)", bottom: "3rem",
        color: "rgba(201,168,76,0.07)", fontSize: "clamp(5rem, 12vw, 10rem)",
        fontWeight: 800, fontFamily: "var(--font-montserrat)",
        lineHeight: 1, userSelect: "none", pointerEvents: "none", zIndex: 4,
      }}>01</div>

      <style>{`
        .nick-content-grid { grid-template-columns: 1fr; }
        .nick-thumbs-col { display: none; }
        @media (min-width: 768px) {
          .nick-content-grid { grid-template-columns: 1fr 1fr; align-items: center; }
          .nick-thumbs-col { display: flex; }
        }
        @media (min-width: 1100px) {
          .nick-content-grid { grid-template-columns: 55fr 45fr; }
        }
      `}</style>
    </div>
  );
}