"use client";

import { useEffect, useRef, useState } from "react";

const ATTRACTIONS = [
  { id: "nick", label: "Nickelodeon Universe", tag: "Theme Park" },
  { id: "sea", label: "Sea Life Aquarium", tag: "Aquatic" },
  { id: "mini", label: "Mini Golf", tag: "Recreation" },
  { id: "bowl", label: "Theatres & Bowling", tag: "Leisure" },
];

const FEATURES = [
  { name: "Nickelodeon Universe", detail: "America's largest indoor theme park" },
  { name: "Sea Life Aquarium", detail: "10,000+ sea creatures across 35 exhibits" },
  { name: "FlyOver America", detail: "Cinematic flight simulation experience" },
  { name: "Crayola Experience", detail: "Interactive art & creativity zones" },
  { name: "Theatres & Dining", detail: "Premium screens & curated dining" },
];

const STATS = [
  { num: "30+", desc: "Rides & Attractions" },
  { num: "7", desc: "Acres of Fun" },
  { num: "500+", desc: "Events Per Year" },
];

const TAGS = [
  "Indoor Roller Coasters", "Drop Tower", "Log Chute",
  "Slime Zone", "Mini Golf", "Laser Tag", "Bowling", "Escape Rooms",
];

interface Props {
  onExplore?: () => void;
}

export default function EntertainmentEntrance({ onExplore }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [mounted, setMounted] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [activeAttr, setActiveAttr] = useState(0);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = isMuted;
    
    // Delay video fetching/decoding so it doesn't block initial UI rendering
    const t = setTimeout(() => {
      v.src = "/videos/entryentertainment.mp4";
      v.play().catch(() => {});
    }, 400);

    const onReady = () => setVideoReady(true);
    v.addEventListener("canplay", onReady);
    return () => {
      clearTimeout(t);
      v.removeEventListener("canplay", onReady);
    };
  }, []);

  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = isMuted;
  }, [isMuted]);

  useEffect(() => {
    const id = setInterval(
      () => setActiveAttr(i => (i + 1) % ATTRACTIONS.length),
      3200
    );
    return () => clearInterval(id);
  }, []);

  return (
    <section style={{
      width: "100%",
      height: "100vh",
      minHeight: "520px",
      background: "#050402",
      position: "relative",
      overflow: "hidden",
      display: "flex",
      flexDirection: "row",   /* ← KEY CHANGE: horizontal split */
      fontFamily: "var(--font-montserrat, 'Montserrat', sans-serif)",
    }}>

      {/* ── Ambient glow ── */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none",
        background: `
          radial-gradient(ellipse 55% 60% at 0% 60%, rgba(201,168,76,0.06) 0%, transparent 55%),
          radial-gradient(ellipse 40% 40% at 85% 15%, rgba(201,168,76,0.03) 0%, transparent 50%)
        `,
      }} />

      {/* ── Grain overlay ── */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", opacity: 0.016,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundSize: "200px 200px",
      }} />


      {/* ═══════════════════════════════════════════════════
          LEFT PANEL — all info, no scrolling
      ═══════════════════════════════════════════════════ */}
      <div
        className="ent-left-panel"
        style={{
          flexShrink: 0,
          width: "clamp(280px, 38vw, 520px)",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "clamp(1.4rem, 4vh, 3rem) clamp(1.4rem, 4vw, 3.5rem)",
          position: "relative",
          zIndex: 10,
          borderRight: "1px solid rgba(201,168,76,0.09)",
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateX(0)" : "translateX(-20px)",
          transition: "all 0.9s cubic-bezier(0.22,1,0.36,1)",
        }}
      >

        {/* ── TOP: Eyebrow + Headline + Sub-copy ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "clamp(0.5rem, 1.2vh, 0.9rem)" }}>

          {/* Eyebrow */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.55rem" }}>
            <div style={{ width: "20px", height: "1px", background: "#C9A84C", opacity: 0.55, flexShrink: 0 }} />
            <p style={{
              color: "#C9A84C",
              fontSize: "clamp(0.42rem, 0.75vw, 0.54rem)",
              letterSpacing: "0.46em", textTransform: "uppercase",
              fontWeight: 700, margin: 0,
            }}>Entertainment & Attractions</p>
          </div>

          {/* Headline */}
          <div>
            <h2 style={{
              color: "#ffffff",
              fontSize: "clamp(1.8rem, 4.5vw, 3.6rem)",
              fontWeight: 900, letterSpacing: "0.02em",
              textTransform: "uppercase", lineHeight: 1.05, margin: 0,
            }}>
              Thrills<br />
              <span style={{
                color: "#C9A84C",
                textShadow: "0 0 60px rgba(201,168,76,0.2)",
              }}>Without Limits</span>
            </h2>
          </div>

          {/* Sub-copy */}
          <p style={{
            color: "rgba(255,255,255,0.35)",
            fontSize: "clamp(0.6rem, 0.9vw, 0.72rem)",
            fontWeight: 400, margin: 0,
            lineHeight: 1.65,
            maxWidth: "340px",
          }}>
            7 acres of indoor adventure — America&apos;s largest
            entertainment complex under one iconic roof.
          </p>

          {/* Stats row */}
          <div style={{
            display: "flex",
            gap: "clamp(1rem, 2.5vw, 2rem)",
            paddingTop: "clamp(0.2rem, 0.5vh, 0.4rem)",
          }}>
            {STATS.map((s, i) => (
              <div key={i} style={{
                display: "flex", flexDirection: "column", gap: "0.1rem",
                paddingLeft: i > 0 ? "clamp(0.6rem, 1.2vw, 1rem)" : 0,
                borderLeft: i > 0 ? "1px solid rgba(201,168,76,0.18)" : "none",
              }}>
                <span style={{
                  color: "#C9A84C",
                  fontSize: "clamp(1rem, 2vw, 1.6rem)",
                  fontWeight: 800, letterSpacing: "0.04em", lineHeight: 1,
                }}>{s.num}</span>
                <span style={{
                  color: "rgba(255,255,255,0.25)",
                  fontSize: "clamp(0.38rem, 0.58vw, 0.46rem)",
                  letterSpacing: "0.28em", textTransform: "uppercase", fontWeight: 600,
                }}>{s.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── MIDDLE: Featured Experiences ── */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "clamp(1rem, 2.5vh, 2rem) 0" }}>
          <p style={{
            color: "rgba(201,168,76,0.45)",
            fontSize: "clamp(0.4rem, 0.62vw, 0.48rem)",
            letterSpacing: "0.42em", textTransform: "uppercase",
            fontWeight: 700, margin: "0 0 clamp(0.5rem, 1.2vh, 0.9rem)",
          }}>Featured Experiences</p>

          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {FEATURES.map((item, i) => (
              <div
                key={i}
                style={{
                  padding: "clamp(0.5rem, 1.1vh, 0.8rem) 0",
                  borderBottom: i < FEATURES.length - 1
                    ? "1px solid rgba(201,168,76,0.07)"
                    : "none",
                  display: "flex", flexDirection: "column", gap: "0.12rem",
                  cursor: "default",
                  transition: "padding-left 0.2s ease",
                }}
                onMouseEnter={e => (e.currentTarget.style.paddingLeft = "0.35rem")}
                onMouseLeave={e => (e.currentTarget.style.paddingLeft = "0")}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <div style={{
                    width: "3px", height: "3px", borderRadius: "50%",
                    background: "rgba(201,168,76,0.4)", flexShrink: 0,
                  }} />
                  <span style={{
                    color: "rgba(255,255,255,0.82)",
                    fontSize: "clamp(0.58rem, 0.9vw, 0.7rem)",
                    fontWeight: 600, letterSpacing: "0.03em",
                  }}>{item.name}</span>
                </div>
                <span style={{
                  color: "rgba(255,255,255,0.22)",
                  fontSize: "clamp(0.42rem, 0.66vw, 0.52rem)",
                  fontWeight: 400, letterSpacing: "0.05em",
                  paddingLeft: "0.72rem",
                }}>{item.detail}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── BOTTOM: CTA + Tag strip ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "clamp(0.6rem, 1.4vh, 1rem)" }}>

          {/* Divider */}
          <div style={{ height: "1px", background: "linear-gradient(to right,rgba(201,168,76,0.28),transparent)" }} />

          <p style={{
            color: "rgba(255,255,255,0.18)",
            fontSize: "clamp(0.42rem, 0.66vw, 0.52rem)",
            fontWeight: 400, letterSpacing: "0.07em", lineHeight: 1.55, margin: 0,
          }}>Open year-round · All ages welcome</p>

          <button
            onClick={onExplore}
            style={{
              background: "transparent",
              border: "1px solid rgba(201,168,76,0.48)",
              color: "#C9A84C",
              padding: "clamp(0.42rem, 0.9vh, 0.62rem) clamp(1rem, 1.8vw, 1.4rem)",
              fontSize: "clamp(0.46rem, 0.72vw, 0.56rem)",
              fontWeight: 700, letterSpacing: "0.34em",
              textTransform: "uppercase",
              cursor: "pointer", alignSelf: "flex-start",
              transition: "all 0.2s ease",
              clipPath: "polygon(6px 0%,100% 0%,calc(100% - 6px) 100%,0% 100%)",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = "#C9A84C";
              e.currentTarget.style.color = "#000";
              e.currentTarget.style.borderColor = "#C9A84C";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "#C9A84C";
              e.currentTarget.style.borderColor = "rgba(201,168,76,0.48)";
            }}
          >
            Explore Entertainment
          </button>

          {/* Tag strip — scrollable on small screens */}
          <div style={{
            display: "flex", flexWrap: "wrap",
            gap: "0.3rem",
            paddingTop: "clamp(0.2rem, 0.5vh, 0.4rem)",
          }}>
            {TAGS.map((tag, i) => (
              <span key={i} style={{
                color: "rgba(201,168,76,0.28)",
                fontSize: "clamp(0.36rem, 0.55vw, 0.44rem)",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                fontWeight: 600,
                border: "1px solid rgba(201,168,76,0.1)",
                padding: "0.12rem 0.3rem",
                whiteSpace: "nowrap",
              }}>{tag}</span>
            ))}
          </div>
        </div>
      </div>


      {/* ═══════════════════════════════════════════════════
          RIGHT PANEL — full-height video
      ═══════════════════════════════════════════════════ */}
      <div style={{
        flex: 1,
        minWidth: 0,
        height: "100%",
        position: "relative",
        overflow: "hidden",
        opacity: mounted ? 1 : 0,
        transition: "opacity 1s ease 0.2s",
      }}>

        {/* Shimmer placeholder */}
        {!videoReady && (
          <div style={{
            position: "absolute", inset: 0, zIndex: 1,
            background: "linear-gradient(90deg,#0c0b08 25%,#151209 50%,#0c0b08 75%)",
            backgroundSize: "400% 100%",
            animation: "ent-shimmer 1.8s ease infinite",
          }} />
        )}

        <video
          ref={videoRef}
          playsInline loop preload="none"
          style={{
            width: "100%", height: "100%",
            objectFit: "cover",
            objectPosition: "center",
            display: "block",
            opacity: videoReady ? 1 : 0,
            transition: "opacity 1s ease",
          }}
        />

        {/* Left gradient blend into left panel */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none", zIndex: 2,
          background: `
            linear-gradient(to right, rgba(5,4,2,0.55) 0%, transparent 18%, transparent 88%, rgba(5,4,2,0.3) 100%),
            linear-gradient(to bottom, rgba(5,4,2,0.15) 0%, transparent 10%, transparent 90%, rgba(5,4,2,0.25) 100%)
          `,
        }} />

        {/* Preview badge */}
        <div style={{
          position: "absolute", top: "1rem", left: "1rem", zIndex: 4,
          display: "flex", alignItems: "center", gap: "0.32rem",
          background: "rgba(5,4,2,0.72)",
          border: "1px solid rgba(201,168,76,0.17)",
          padding: "0.2rem 0.5rem",
          backdropFilter: "blur(6px)",
        }}>
          <div style={{
            width: "5px", height: "5px", borderRadius: "50%",
            background: "#C9A84C", animation: "ent-pulse 2s ease infinite",
          }} />
          <span style={{
            color: "rgba(201,168,76,0.75)", fontSize: "0.44rem",
            letterSpacing: "0.34em", textTransform: "uppercase", fontWeight: 700,
          }}>Preview</span>
        </div>

        {/* Mute toggle */}
        <button
          onClick={() => setIsMuted(m => !m)}
          aria-label={isMuted ? "Unmute video" : "Mute video"}
          style={{
            position: "absolute", bottom: "1rem", right: "1rem", zIndex: 5,
            width: "38px", height: "38px", borderRadius: "50%",
            border: "1.5px solid rgba(201,168,76,0.35)",
            background: "rgba(5,4,2,0.55)",
            backdropFilter: "blur(10px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", transition: "all 0.25s ease",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = "#C9A84C";
            e.currentTarget.style.background = "rgba(201,168,76,0.15)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = "rgba(201,168,76,0.35)";
            e.currentTarget.style.background = "rgba(5,4,2,0.55)";
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke="#C9A84C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"
              fill="rgba(201,168,76,0.15)" />
            {isMuted ? (
              <>
                <line x1="23" y1="9" x2="17" y2="15" />
                <line x1="17" y1="9" x2="23" y2="15" />
              </>
            ) : (
              <>
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
              </>
            )}
          </svg>
        </button>

        {/* Attraction ticker — bottom of video */}
        <div style={{
          position: "absolute", bottom: "1rem", left: "1rem", zIndex: 5,
          display: "flex", alignItems: "center", gap: "0.5rem",
        }}>
          <div style={{ width: "12px", height: "1px", background: "rgba(201,168,76,0.3)", flexShrink: 0 }} />
          <div style={{ width: "200px", position: "relative", height: "1.1rem", overflow: "hidden" }}>
            {ATTRACTIONS.map((a, i) => (
              <div key={a.id} style={{
                position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
                display: "flex", alignItems: "center", gap: "0.4rem",
                opacity: activeAttr === i ? 1 : 0,
                transform: activeAttr === i ? "translateY(0)" : "translateY(6px)",
                transition: "all 0.5s cubic-bezier(0.22,1,0.36,1)",
                pointerEvents: activeAttr === i ? "auto" : "none",
              }}>
                <span style={{
                  color: "rgba(201,168,76,0.45)", fontSize: "0.42rem",
                  letterSpacing: "0.26em", textTransform: "uppercase", fontWeight: 700,
                  flexShrink: 0, border: "1px solid rgba(201,168,76,0.18)",
                  padding: "0.06rem 0.24rem",
                }}>{a.tag}</span>
                <span style={{
                  color: "rgba(255,255,255,0.5)", fontSize: "0.56rem",
                  letterSpacing: "0.06em", fontWeight: 500,
                  whiteSpace: "nowrap",
                }}>{a.label}</span>
              </div>
            ))}
          </div>
          {/* Ticker dots */}
          <div style={{ display: "flex", gap: "3px" }}>
            {ATTRACTIONS.map((_, i) => (
              <div key={i} onClick={() => setActiveAttr(i)} style={{
                width: activeAttr === i ? "11px" : "3px", height: "2px",
                borderRadius: "1px",
                background: activeAttr === i ? "#C9A84C" : "rgba(201,168,76,0.18)",
                transition: "all 0.4s ease", cursor: "pointer",
              }} />
            ))}
          </div>
        </div>

        {/* Corner brackets on video panel */}
        {(["tl", "tr", "bl", "br"] as const).map(pos => (
          <div key={pos} style={{
            position: "absolute", width: "14px", height: "14px",
            zIndex: 6, pointerEvents: "none",
            ...(pos.includes("t") ? { top: "4px" } : { bottom: "4px" }),
            ...(pos.includes("l") ? { left: "4px" } : { right: "4px" }),
            borderTop: pos.includes("t") ? "1.5px solid rgba(201,168,76,0.35)" : "none",
            borderBottom: pos.includes("b") ? "1.5px solid rgba(201,168,76,0.35)" : "none",
            borderLeft: pos.includes("l") ? "1.5px solid rgba(201,168,76,0.35)" : "none",
            borderRight: pos.includes("r") ? "1.5px solid rgba(201,168,76,0.35)" : "none",
          }} />
        ))}
      </div>


      {/* ── Global outer corner brackets ── */}
      {(["tl", "tr", "bl", "br"] as const).map(pos => (
        <div key={pos} style={{
          position: "absolute", width: "16px", height: "16px",
          zIndex: 20, pointerEvents: "none",
          ...(pos.includes("t") ? { top: "3px" } : { bottom: "3px" }),
          ...(pos.includes("l") ? { left: "3px" } : { right: "3px" }),
          borderTop: pos.includes("t") ? "1px solid rgba(201,168,76,0.14)" : "none",
          borderBottom: pos.includes("b") ? "1px solid rgba(201,168,76,0.14)" : "none",
          borderLeft: pos.includes("l") ? "1px solid rgba(201,168,76,0.14)" : "none",
          borderRight: pos.includes("r") ? "1px solid rgba(201,168,76,0.14)" : "none",
          opacity: mounted ? 1 : 0,
          transition: "opacity 1s ease 0.4s",
        }} />
      ))}


      {/* ── Mobile layout: stack vertically ── */}
      <style>{`
        @keyframes ent-shimmer {
          0%   { background-position:  200% 0; }
          100% { background-position: -200% 0; }
        }
        @keyframes ent-pulse {
          0%, 100% { opacity: 1;   transform: scale(1);    }
          50%       { opacity: 0.4; transform: scale(0.75); }
        }

        /* ── Responsive: stack on mobile ── */
        @media (max-width: 700px) {
          /* Switch to column layout */
          section {
            flex-direction: column !important;
          }
          .ent-left-panel {
            width: 100% !important;
            height: auto !important;
            flex-shrink: 0 !important;
            border-right: none !important;
            border-bottom: 1px solid rgba(201,168,76,0.09) !important;
            padding: 1.4rem 1.2rem 1rem !important;
          }
        }
      `}</style>
    </section>
  );
}