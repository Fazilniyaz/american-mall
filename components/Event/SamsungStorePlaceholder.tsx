"use client";

import { useEffect, useRef, useState, useCallback } from "react";

// ─── Event metadata ────────────────────────────────────────────────────────────
const EVENT = {
  eyebrow: "Mall of America · Tech Events",
  title: ["Samsung Galaxy", "Grand Store", "Opening"],
  date: "March 15, 2024",
  time: "10:00 AM – 8:00 PM",
  location: "Level 1, North Garden · Mall of America",
  tagline: "Your Playground of AI Experiences",
  description:
    "Samsung's most immersive Galaxy flagship store arrives at Mall of America — a 5,000 sq ft playground of foldables, wearables, and AI-powered living, brought to life with a day of live demos, exclusive drops, and unforgettable experiences.",
};

const HIGHLIGHTS = [
  { num: "5,000", unit: "sq ft", label: "Flagship Space" },
  { num: "12+", unit: "hrs", label: "Live Experience" },
  { num: "500+", unit: "guests", label: "Attended" },
  { num: "30+", unit: "devices", label: "On Display" },
];

const MOMENTS = [
  { time: "10:00 AM", title: "Grand Ribbon Cut", desc: "Official opening ceremony with Samsung executives & MoA leadership" },
  { time: "11:00 AM", title: "Galaxy AI Live Demo", desc: "Hands-on sessions with Galaxy S24 Ultra AI features & Circle to Search" },
  { time: "01:00 PM", title: "Foldables Showcase", desc: "Exclusive first look at the full Galaxy Z Fold & Flip lineup" },
  { time: "03:00 PM", title: "SmartThings Home Tour", desc: "Connected living demo — Galaxy ecosystem from phone to home" },
  { time: "06:00 PM", title: "Exclusive Drop Event", desc: "Limited edition accessories & early access for registered attendees" },
];

const TAGS = ["Galaxy AI", "Foldables", "Wearables", "SmartThings", "Knox Security", "Galaxy Ecosystem"];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function Corner({ pos }: { pos: "tl" | "tr" | "bl" | "br" }) {
  return (
    <div style={{
      position: "absolute", width: "12px", height: "12px", pointerEvents: "none",
      zIndex: 30,
      ...(pos.includes("t") ? { top: "4px" } : { bottom: "4px" }),
      ...(pos.includes("l") ? { left: "4px" } : { right: "4px" }),
      borderTop: pos.includes("t") ? "1px solid rgba(201,168,76,0.35)" : "none",
      borderBottom: pos.includes("b") ? "1px solid rgba(201,168,76,0.35)" : "none",
      borderLeft: pos.includes("l") ? "1px solid rgba(201,168,76,0.35)" : "none",
      borderRight: pos.includes("r") ? "1px solid rgba(201,168,76,0.35)" : "none",
    }} />
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function SamsungGrandStoreOpeningPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const [mounted, setMounted] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [activeMoment, setActiveMoment] = useState(0);

  // Mount fade-in
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  // Video init
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;

    // Delay video fetch/decode to prioritize LCP rendering
    const t = setTimeout(() => {
      v.src = "/videos/samsung_event.mp4";
      v.play().catch(() => {});
    }, 400);

    const onReady = () => setVideoReady(true);
    v.addEventListener("canplay", onReady, { once: true });
    return () => {
      clearTimeout(t);
      v.removeEventListener("canplay", onReady);
    };
  }, []);

  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = isMuted;
  }, [isMuted]);

  // Auto-cycle moments
  useEffect(() => {
    const id = setInterval(() => setActiveMoment(i => (i + 1) % MOMENTS.length), 3500);
    return () => clearInterval(id);
  }, []);

  const toggleMute = useCallback(() => setIsMuted(m => !m), []);

  return (
    <main
      ref={sectionRef}
      style={{
        /* ── STRICT 100VH DECK ── */
        width: "100%",
        height: "100vh",
        minHeight: "540px",
        background: "#050402",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        fontFamily: "var(--font-montserrat, 'Montserrat', sans-serif)",
      }}
    >
      {/* ── Ambient glow ── */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none",
        background: `
          radial-gradient(ellipse 55% 45% at 75% 55%, rgba(0,114,206,0.06) 0%, transparent 60%),
          radial-gradient(ellipse 40% 50% at 10% 30%, rgba(201,168,76,0.05) 0%, transparent 55%)
        `,
      }} />

      {/* ── Grain ── */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", opacity: 0.018,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundSize: "200px 200px",
      }} />

      {/* ── Outer corner brackets ── */}
      {(["tl", "tr", "bl", "br"] as const).map(p => <Corner key={p} pos={p} />)}


      {/* ════════════════════════════════════════════
          ZONE 1 — HEADER STRIP  (flexShrink: 0)
      ════════════════════════════════════════════ */}
      <header style={{
        flexShrink: 0,
        position: "relative", zIndex: 10,
        padding: "clamp(0.8rem,1.8vh,1.4rem) clamp(1.4rem,4vw,3.5rem) clamp(0.4rem,1vh,0.8rem)",
        borderBottom: "1px solid rgba(201,168,76,0.08)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "1rem",
        opacity: mounted ? 1 : 0,
        transform: mounted ? "translateY(0)" : "translateY(-12px)",
        transition: "all 0.7s cubic-bezier(0.22,1,0.36,1)",
      }}>

        {/* Breadcrumb + title block */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
          {/* Eyebrow */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div style={{ width: "18px", height: "1px", background: "#C9A84C", opacity: 0.5 }} />
            <span style={{
              color: "#C9A84C", fontSize: "clamp(0.38rem,0.68vw,0.48rem)",
              letterSpacing: "0.44em", textTransform: "uppercase", fontWeight: 700,
            }}>{EVENT.eyebrow}</span>
          </div>

          {/* Headline — inline on one row */}
          <div style={{ display: "flex", alignItems: "baseline", gap: "0.4em", flexWrap: "wrap" }}>
            <h1 style={{
              color: "#ffffff",
              fontSize: "clamp(1.15rem,2.8vw,2.2rem)",
              fontWeight: 900, letterSpacing: "0.02em",
              textTransform: "uppercase", lineHeight: 1, margin: 0,
            }}>Samsung Galaxy</h1>
            <h1 style={{
              color: "#C9A84C",
              fontSize: "clamp(1.15rem,2.8vw,2.2rem)",
              fontWeight: 900, letterSpacing: "0.02em",
              textTransform: "uppercase", lineHeight: 1, margin: 0,
              textShadow: "0 0 40px rgba(201,168,76,0.2)",
            }}>Grand Store Opening</h1>
          </div>
        </div>

        {/* Date/location pill — right side */}
        <div style={{
          display: "flex", flexDirection: "column", alignItems: "flex-end",
          gap: "0.2rem", flexShrink: 0,
        }}>
          <div style={{
            display: "flex", alignItems: "center", gap: "0.4rem",
            background: "rgba(201,168,76,0.07)",
            border: "1px solid rgba(201,168,76,0.18)",
            padding: "0.22rem 0.7rem",
          }}>
            {/* Calendar dot */}
            <div style={{ width: "4px", height: "4px", borderRadius: "50%", background: "#C9A84C", animation: "sg-pulse 2s ease infinite" }} />
            <span style={{
              color: "#C9A84C", fontSize: "clamp(0.42rem,0.68vw,0.52rem)",
              letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 700,
            }}>{EVENT.date}</span>
          </div>
          <span style={{
            color: "rgba(255,255,255,0.22)", fontSize: "clamp(0.38rem,0.6vw,0.46rem)",
            letterSpacing: "0.12em", textTransform: "uppercase",
          }}>{EVENT.location}</span>
        </div>
      </header>


      {/* ════════════════════════════════════════════
          ZONE 2 — BODY  (flex:1, minHeight:0)
          Left info panel | Right video
      ════════════════════════════════════════════ */}
      <div style={{
        flex: 1,
        minHeight: 0,
        position: "relative", zIndex: 10,
        display: "flex",
        flexDirection: "row",
        opacity: mounted ? 1 : 0,
        transition: "opacity 0.8s ease 0.15s",
      }}
        className="sg-body"
      >

        {/* ── LEFT INFO PANEL ─────────────────────────────── */}
        <div
          className="sg-left"
          style={{
            flexShrink: 0,
            width: "clamp(260px,34vw,440px)",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "clamp(0.9rem,2.2vh,1.8rem) clamp(1.4rem,3.5vw,3rem)",
            borderRight: "1px solid rgba(201,168,76,0.08)",
            overflow: "hidden",
          }}
        >

          {/* ── TOP: tagline + description ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "clamp(0.5rem,1.2vh,0.9rem)" }}>
            <p style={{
              color: "rgba(201,168,76,0.55)",
              fontSize: "clamp(0.56rem,0.85vw,0.68rem)",
              fontStyle: "italic", fontWeight: 500,
              letterSpacing: "0.06em", margin: 0, lineHeight: 1.5,
            }}>"{EVENT.tagline}"</p>
            <p style={{
              color: "rgba(255,255,255,0.32)",
              fontSize: "clamp(0.56rem,0.82vw,0.66rem)",
              fontWeight: 400, margin: 0, lineHeight: 1.7,
            }}>{EVENT.description}</p>

            {/* Time + divider */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.55rem", paddingTop: "0.2rem" }}>
              <div style={{ width: "12px", height: "1px", background: "rgba(201,168,76,0.3)" }} />
              <span style={{
                color: "rgba(255,255,255,0.28)", fontSize: "clamp(0.42rem,0.66vw,0.52rem)",
                letterSpacing: "0.28em", textTransform: "uppercase", fontWeight: 600,
              }}>{EVENT.time}</span>
            </div>
          </div>

          {/* ── MIDDLE: Highlight stats ── */}
          <div className="sg-stats" style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "clamp(0.5rem,1.2vh,0.9rem) clamp(0.6rem,1.4vw,1.1rem)",
          }}>
            {HIGHLIGHTS.map((h, i) => (
              <div key={i} style={{
                padding: "clamp(0.5rem,1.1vh,0.8rem)",
                border: "1px solid rgba(201,168,76,0.1)",
                background: "rgba(201,168,76,0.03)",
                display: "flex", flexDirection: "column", gap: "0.15rem",
                transition: "border-color 0.2s ease",
              }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(201,168,76,0.3)")}
                onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(201,168,76,0.1)")}
              >
                <div style={{ display: "flex", alignItems: "baseline", gap: "0.22em" }}>
                  <span style={{
                    color: "#C9A84C", fontSize: "clamp(1rem,2vw,1.5rem)",
                    fontWeight: 800, letterSpacing: "0.02em", lineHeight: 1,
                  }}>{h.num}</span>
                  <span style={{
                    color: "rgba(201,168,76,0.5)", fontSize: "clamp(0.44rem,0.7vw,0.54rem)",
                    fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase",
                  }}>{h.unit}</span>
                </div>
                <span style={{
                  color: "rgba(255,255,255,0.28)", fontSize: "clamp(0.4rem,0.62vw,0.5rem)",
                  letterSpacing: "0.26em", textTransform: "uppercase", fontWeight: 600,
                }}>{h.label}</span>
              </div>
            ))}
          </div>

          {/* ── BOTTOM: Event moments ticker ── */}
          <div className="sg-moments" style={{ display: "flex", flexDirection: "column", gap: "clamp(0.35rem,0.8vh,0.6rem)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{
                color: "rgba(201,168,76,0.4)", fontSize: "clamp(0.38rem,0.6vw,0.46rem)",
                letterSpacing: "0.38em", textTransform: "uppercase", fontWeight: 700,
              }}>Event Moments</span>
              {/* Progress dots */}
              <div style={{ display: "flex", gap: "3px" }}>
                {MOMENTS.map((_, i) => (
                  <div key={i} onClick={() => setActiveMoment(i)} style={{
                    width: activeMoment === i ? "14px" : "4px", height: "2px",
                    borderRadius: "1px",
                    background: activeMoment === i ? "#C9A84C" : "rgba(201,168,76,0.18)",
                    transition: "all 0.35s ease", cursor: "pointer",
                  }} />
                ))}
              </div>
            </div>

            {/* Ticker card */}
            <div style={{
              position: "relative",
              height: "clamp(3.2rem,7.5vh,5.5rem)",
              overflow: "hidden",
            }}>
              {MOMENTS.map((m, i) => (
                <div key={i} style={{
                  position: "absolute", inset: 0,
                  display: "flex", flexDirection: "column", gap: "0.22rem",
                  padding: "clamp(0.45rem,1vh,0.7rem)",
                  border: "1px solid rgba(201,168,76,0.1)",
                  background: "rgba(201,168,76,0.03)",
                  opacity: activeMoment === i ? 1 : 0,
                  transform: activeMoment === i ? "translateY(0)" : "translateY(8px)",
                  transition: "all 0.45s cubic-bezier(0.22,1,0.36,1)",
                  pointerEvents: activeMoment === i ? "auto" : "none",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span style={{
                      color: "#C9A84C", fontSize: "clamp(0.4rem,0.62vw,0.48rem)",
                      letterSpacing: "0.22em", textTransform: "uppercase", fontWeight: 700,
                      border: "1px solid rgba(201,168,76,0.22)", padding: "0.05rem 0.28rem",
                      flexShrink: 0,
                    }}>{m.time}</span>
                    <span style={{
                      color: "rgba(255,255,255,0.75)", fontSize: "clamp(0.52rem,0.8vw,0.62rem)",
                      fontWeight: 600, letterSpacing: "0.04em",
                    }}>{m.title}</span>
                  </div>
                  <p style={{
                    color: "rgba(255,255,255,0.28)", fontSize: "clamp(0.42rem,0.64vw,0.5rem)",
                    margin: 0, lineHeight: 1.55, letterSpacing: "0.03em",
                  }}>{m.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>


        {/* ── RIGHT VIDEO PANEL ───────────────────────────── */}
        <div className="sg-video" style={{
          flex: 1,
          minWidth: 0,
          height: "100%",
          position: "relative",
          overflow: "hidden",
          background: "#060504",
        }}>

          {/* Shimmer while loading */}
          {!videoReady && (
            <div style={{
              position: "absolute", inset: 0, zIndex: 1,
              background: "linear-gradient(90deg,#0c0b08 25%,#141209 50%,#0c0b08 75%)",
              backgroundSize: "400% 100%",
              animation: "sg-shimmer 1.8s ease infinite",
            }} />
          )}

          {/* //Video */}
          <video
            ref={videoRef}
            playsInline
            loop
            preload="none"
            style={{
              width: "100%", height: "100%",
              objectFit: "cover",
              objectPosition: "center",
              display: "block",
              opacity: videoReady ? 1 : 0,
              transition: "opacity 1.1s ease",
            }}
          />

          {/* Left-side blend gradient into left panel */}
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none", zIndex: 2,
            background: `
              linear-gradient(to right,  rgba(5,4,2,0.65) 0%, transparent 14%, transparent 88%, rgba(5,4,2,0.25) 100%),
              linear-gradient(to bottom, rgba(5,4,2,0.12) 0%, transparent 8%,  transparent 92%, rgba(5,4,2,0.3)  100%)
            `,
          }} />

          {/* Samsung blue accent overlay — very subtle brand nod */}
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none", zIndex: 2,
            background: "radial-gradient(ellipse 60% 50% at 60% 50%, rgba(0,114,206,0.04) 0%, transparent 65%)",
          }} />

          {/* LIVE badge */}
          <div style={{
            position: "absolute", top: "0.9rem", left: "0.9rem", zIndex: 5,
            display: "flex", alignItems: "center", gap: "0.35rem",
            background: "rgba(5,4,2,0.75)",
            border: "1px solid rgba(201,168,76,0.2)",
            padding: "0.2rem 0.52rem",
            backdropFilter: "blur(8px)",
          }}>
            <div style={{
              width: "5px", height: "5px", borderRadius: "50%",
              background: "#C9A84C", animation: "sg-pulse 1.8s ease infinite",
            }} />
            <span style={{
              color: "rgba(201,168,76,0.8)", fontSize: "0.44rem",
              letterSpacing: "0.32em", textTransform: "uppercase", fontWeight: 700,
            }}>Event Recap</span>
          </div>

          {/* Mute toggle */}
          <button
            onClick={toggleMute}
            style={{
              position: "absolute", bottom: "0.9rem", right: "0.9rem", zIndex: 5,
              background: "rgba(5,4,2,0.75)",
              border: "1px solid rgba(201,168,76,0.28)",
              color: "rgba(201,168,76,0.85)",
              padding: "0.22rem 0.58rem",
              backdropFilter: "blur(8px)",
              fontSize: "0.44rem",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 0.18s ease",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(201,168,76,0.14)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(5,4,2,0.75)"; }}
          >
            {isMuted ? "▶ Sound On" : "⏸ Mute"}
          </button>

          {/* Samsung branding watermark — bottom left */}
          <div style={{
            position: "absolute", bottom: "0.9rem", left: "0.9rem", zIndex: 5,
            display: "flex", alignItems: "center", gap: "0.45rem",
            pointerEvents: "none",
          }}>
            {/* Samsung-style S wordmark placeholder */}
            <div style={{
              width: "22px", height: "22px",
              border: "1px solid rgba(201,168,76,0.25)",
              background: "rgba(5,4,2,0.6)",
              display: "flex", alignItems: "center", justifyContent: "center",
              backdropFilter: "blur(6px)",
            }}>
              <span style={{
                color: "#C9A84C", fontSize: "0.6rem", fontWeight: 800,
                letterSpacing: "-0.02em",
              }}>S</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.06rem" }}>
              <span style={{
                color: "rgba(255,255,255,0.55)", fontSize: "0.46rem",
                fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase",
              }}>Samsung</span>
              <span style={{
                color: "rgba(255,255,255,0.22)", fontSize: "0.38rem",
                letterSpacing: "0.1em", textTransform: "uppercase",
              }}>Mall of America</span>
            </div>
          </div>

          {/* Corner brackets on video */}
          {(["tl", "tr", "bl", "br"] as const).map(pos => (
            <div key={pos} style={{
              position: "absolute", width: "12px", height: "12px", zIndex: 4, pointerEvents: "none",
              ...(pos.includes("t") ? { top: "5px" } : { bottom: "5px" }),
              ...(pos.includes("l") ? { left: "5px" } : { right: "5px" }),
              borderTop: pos.includes("t") ? "1.5px solid rgba(201,168,76,0.3)" : "none",
              borderBottom: pos.includes("b") ? "1.5px solid rgba(201,168,76,0.3)" : "none",
              borderLeft: pos.includes("l") ? "1.5px solid rgba(201,168,76,0.3)" : "none",
              borderRight: pos.includes("r") ? "1.5px solid rgba(201,168,76,0.3)" : "none",
            }} />
          ))}
        </div>
      </div>


      {/* ════════════════════════════════════════════
          ZONE 3 — FOOTER STRIP  (flexShrink: 0)
      ════════════════════════════════════════════ */}
      <footer style={{
        flexShrink: 0,
        position: "relative", zIndex: 10,
        borderTop: "1px solid rgba(201,168,76,0.07)",
        padding: "clamp(0.32rem,0.75vh,0.55rem) clamp(1.4rem,4vw,3.5rem)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "1rem",
        overflow: "hidden",
        opacity: mounted ? 1 : 0,
        transition: "opacity 1s ease 0.5s",
      }}>

        {/* Tags scroll */}
        <div style={{ display: "flex", alignItems: "center", gap: "0", overflow: "hidden", flex: 1 }}>
          {TAGS.map((tag, i) => (
            <span key={i} style={{
              color: "rgba(201,168,76,0.22)",
              fontSize: "clamp(0.34rem,0.52vw,0.42rem)",
              letterSpacing: "0.26em", textTransform: "uppercase", fontWeight: 600,
              whiteSpace: "nowrap",
              padding: `0 clamp(0.5rem,1.2vw,1rem)`,
              borderRight: i < TAGS.length - 1 ? "1px solid rgba(201,168,76,0.08)" : "none",
            }}>{tag}</span>
          ))}
        </div>

        {/* Back link */}
        <a
          href="/events"
          style={{
            color: "rgba(201,168,76,0.45)", fontSize: "clamp(0.38rem,0.6vw,0.48rem)",
            letterSpacing: "0.28em", textTransform: "uppercase", fontWeight: 700,
            textDecoration: "none", flexShrink: 0,
            display: "flex", alignItems: "center", gap: "0.35rem",
            transition: "color 0.18s ease",
          }}
          onMouseEnter={e => (e.currentTarget.style.color = "#C9A84C")}
          onMouseLeave={e => (e.currentTarget.style.color = "rgba(201,168,76,0.45)")}
        >
          <span style={{ fontSize: "0.6rem" }}>←</span> All Events
        </a>
      </footer>


      {/* ── Global keyframes + responsive ── */}
      <style>{`
        @keyframes sg-pulse {
          0%,100% { opacity: 1; transform: scale(1); }
          50%      { opacity: 0.35; transform: scale(0.7); }
        }
        @keyframes sg-shimmer {
          0%   { background-position:  200% 0; }
          100% { background-position: -200% 0; }
        }

        @media (max-width: 680px) {
          /* Body becomes a column so info sits on top, video below */
          .sg-body { flex-direction: column !important; }

          /* Left info panel: auto height, compact, no right border */
          .sg-left {
            width: 100% !important;
            height: auto !important;
            flex: 0 0 auto !important;
            border-right: none !important;
            border-bottom: 1px solid rgba(201,168,76,0.08) !important;
            padding: 0.75rem 1rem !important;
          }

          /* Hide moments ticker on mobile — saves crucial vertical space */
          .sg-moments { display: none !important; }

          /* Stats row: all 4 in one horizontal row */
          .sg-stats {
            grid-template-columns: repeat(4,1fr) !important;
            gap: 0.35rem !important;
          }

          /* Video panel: takes all remaining flex space — always visible */
          .sg-video {
            flex: 1 1 0 !important;
            width: 100% !important;
            min-height: 0 !important;
            height: auto !important;
          }

          /* Ensure the video element itself fills the panel */
          .sg-video video {
            position: absolute !important;
            inset: 0 !important;
            width: 100% !important;
            height: 100% !important;
            object-fit: cover !important;
          }
        }
      `}</style>
    </main>
  );
}