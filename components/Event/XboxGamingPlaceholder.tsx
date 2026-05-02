"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

// ─── Event metadata ────────────────────────────────────────────────────────────
const EVENT = {
  eyebrow: "Mall of America · Entertainment & Gaming",
  date: "March 2026",
  time: "11:00 AM – 10:00 PM",
  location: "Level 3, Game Zone · Mall of America",
  tagline: "Next Generation. Right Here.",
  description:
    "Xbox brought its partner preview showcase to Mall of America — the first time the gaming giant's exclusive title reveals landed in a live retail setting. Fans got hands-on time with unreleased titles, Series X hardware drops, and direct access to Xbox developers.",
};

const HIGHLIGHTS = [
  { num: "6,200+", unit: "gamers", label: "Attended" },
  { num: "14", unit: "titles", label: "Previewed Live" },
  { num: "Series X", unit: "", label: "Hardware Drop" },
  { num: "09", unit: "hrs", label: "Live Activation" },
];

const MOMENTS = [
  {
    time: "11:00 AM",
    title: "Partner Preview Doors Open",
    desc: "Lines wrapped the atrium as badge-holders and fans streamed in for the first public Xbox Partner Preview in retail history.",
  },
  {
    time: "12:30 PM",
    title: "Title Reveal — Fable Reboot",
    desc: "The crowd erupted as the Fable reboot received its first playable demo outside of a controlled press event.",
  },
  {
    time: "02:00 PM",
    title: "Series X Drop Ceremony",
    desc: "Limited-run MoA-exclusive Series X consoles released to raffle winners — custom green faceplates, never sold elsewhere.",
  },
  {
    time: "04:30 PM",
    title: "Developer Roundtable",
    desc: "Three Xbox Game Studios leads joined a live Q&A, answering questions from fans seated on the floor of the activation zone.",
  },
  {
    time: "08:00 PM",
    title: "Night Gaming Tournament",
    desc: "128-player Halo Infinite bracket live on the mall floor — winner walked away with a signed Series X and Game Pass Ultimate for life.",
  },
];

const TAGS = [
  "Xbox Series X", "Game Pass", "Partner Preview",
  "Halo Infinite", "Fable", "Xbox Game Studios", "MoA Exclusive",
];

// ─── Xbox brand green tokens (accent-only, within gold system) ─────────────────
const XG = {
  primary: "rgba(82,176,67,0.85)",   // #52B043
  dim: "rgba(82,176,67,0.22)",
  glow: "rgba(16,124,16,0.12)",
  border: "rgba(82,176,67,0.28)",
  borderDim: "rgba(82,176,67,0.12)",
};

// ─── Corner bracket ────────────────────────────────────────────────────────────
function Corner({
  pos, size = 11, color = "rgba(201,168,76,0.32)", thickness = "1.5px",
}: {
  pos: "tl" | "tr" | "bl" | "br";
  size?: number; color?: string; thickness?: string;
}) {
  return (
    <div style={{
      position: "absolute", pointerEvents: "none", zIndex: 30,
      width: `${size}px`, height: `${size}px`,
      ...(pos.includes("t") ? { top: "4px" } : { bottom: "4px" }),
      ...(pos.includes("l") ? { left: "4px" } : { right: "4px" }),
      borderTop: pos.includes("t") ? `${thickness} solid ${color}` : "none",
      borderBottom: pos.includes("b") ? `${thickness} solid ${color}` : "none",
      borderLeft: pos.includes("l") ? `${thickness} solid ${color}` : "none",
      borderRight: pos.includes("r") ? `${thickness} solid ${color}` : "none",
    }} />
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function XboxGamingEventsPage() {
  const [mounted, setMounted] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [activeMoment, setActiveMoment] = useState(0);
  const tickerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /* ── mount ── */
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  /* ── moment auto-cycle ── */
  useEffect(() => {
    tickerRef.current = setInterval(() =>
      setActiveMoment(i => (i + 1) % MOMENTS.length), 3800);
    return () => { if (tickerRef.current) clearInterval(tickerRef.current); };
  }, []);

  const goToMoment = (i: number) => {
    setActiveMoment(i);
    if (tickerRef.current) clearInterval(tickerRef.current);
    tickerRef.current = setInterval(() =>
      setActiveMoment(idx => (idx + 1) % MOMENTS.length), 3800);
  };

  return (
    <main style={{
      /* ══ STRICT 100VH VIEWPORT LOCK ══ */
      width: "100%",
      height: "100vh",
      minHeight: "540px",
      background: "#050402",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      position: "relative",
      fontFamily: "var(--font-montserrat, 'Montserrat', sans-serif)",
    }}>

      {/* ── Ambient: Xbox green glow + gold warm base ── */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none",
        background: `
          radial-gradient(ellipse 65% 55% at 72% 52%, ${XG.glow} 0%, transparent 58%),
          radial-gradient(ellipse 40% 45% at 12% 28%, rgba(201,168,76,0.05) 0%, transparent 52%),
          radial-gradient(ellipse 30% 35% at 50% 98%, rgba(82,176,67,0.04) 0%, transparent 50%)
        `,
      }} />

      {/* ── Grain texture ── */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", opacity: 0.018,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundSize: "200px 200px",
      }} />

      {/* ── Outer corner brackets ── */}
      {(["tl", "tr", "bl", "br"] as const).map(p => <Corner key={p} pos={p} />)}


      {/* ════════════════════════════════════════════════════
          HEADER  — flexShrink: 0
      ════════════════════════════════════════════════════ */}
      <header style={{
        flexShrink: 0,
        position: "relative", zIndex: 10,
        padding: "clamp(0.65rem,1.5vh,1.1rem) clamp(1.4rem,4vw,3.5rem) clamp(0.35rem,0.8vh,0.65rem)",
        borderBottom: "1px solid rgba(201,168,76,0.08)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "1rem",
        opacity: mounted ? 1 : 0,
        transform: mounted ? "translateY(0)" : "translateY(-14px)",
        transition: "all 0.75s cubic-bezier(0.22,1,0.36,1)",
      }}>

        {/* Left — eyebrow + headline */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.22rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div style={{ width: "18px", height: "1px", background: "#C9A84C", opacity: 0.5, flexShrink: 0 }} />
            <span style={{
              color: "#C9A84C",
              fontSize: "clamp(0.38rem,0.65vw,0.47rem)",
              letterSpacing: "0.44em", textTransform: "uppercase", fontWeight: 700,
            }}>{EVENT.eyebrow}</span>
          </div>

          <div style={{ display: "flex", alignItems: "baseline", gap: "0.44em", flexWrap: "wrap" }}>
            <h1 style={{
              color: "#ffffff",
              fontSize: "clamp(1.05rem,2.5vw,2rem)",
              fontWeight: 900, letterSpacing: "0.02em",
              textTransform: "uppercase", lineHeight: 1, margin: 0,
            }}>Xbox</h1>
            {/* Xbox green on the sub-title */}
            <h1 style={{
              color: XG.primary,
              fontSize: "clamp(1.05rem,2.5vw,2rem)",
              fontWeight: 900, letterSpacing: "0.02em",
              textTransform: "uppercase", lineHeight: 1, margin: 0,
              textShadow: `0 0 40px ${XG.glow}`,
            }}>Partner Preview</h1>
            <h1 style={{
              color: "#C9A84C",
              fontSize: "clamp(1.05rem,2.5vw,2rem)",
              fontWeight: 900, letterSpacing: "0.02em",
              textTransform: "uppercase", lineHeight: 1, margin: 0,
              textShadow: "0 0 40px rgba(201,168,76,0.2)",
            }}>Gaming Event</h1>
          </div>
        </div>

        {/* Right — date + location */}
        <div style={{
          display: "flex", flexDirection: "column",
          alignItems: "flex-end", gap: "0.16rem", flexShrink: 0,
        }}>
          <div style={{
            display: "flex", alignItems: "center", gap: "0.36rem",
            background: "rgba(82,176,67,0.07)",
            border: `1px solid ${XG.border}`,
            padding: "0.18rem 0.62rem",
          }}>
            <div style={{
              width: "4px", height: "4px", borderRadius: "50%",
              background: XG.primary,
              animation: "xb-pulse 2s ease infinite",
            }} />
            <span style={{
              color: XG.primary,
              fontSize: "clamp(0.38rem,0.64vw,0.48rem)",
              letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 700,
            }}>{EVENT.date}</span>
          </div>
          <span style={{
            color: "rgba(255,255,255,0.2)",
            fontSize: "clamp(0.34rem,0.56vw,0.42rem)",
            letterSpacing: "0.12em", textTransform: "uppercase",
          }}>{EVENT.location}</span>
        </div>
      </header>


      {/* ════════════════════════════════════════════════════
          BODY  — flex: 1 + minHeight: 0
          Left info panel | Right image asset
      ════════════════════════════════════════════════════ */}
      <div
        className="xb-body"
        style={{
          flex: 1,
          minHeight: 0,       /* CRITICAL */
          position: "relative", zIndex: 10,
          display: "flex",
          flexDirection: "row",
          opacity: mounted ? 1 : 0,
          transition: "opacity 0.85s ease 0.12s",
        }}
      >

        {/* ══ LEFT INFO PANEL ═══════════════════════════════ */}
        <div
          className="xb-left"
          style={{
            flexShrink: 0,
            width: "clamp(255px,33vw,435px)",
            minHeight: 0,       /* CRITICAL */
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "clamp(0.8rem,1.9vh,1.55rem) clamp(1.4rem,3.5vw,3rem)",
            borderRight: "1px solid rgba(201,168,76,0.08)",
            overflow: "hidden",
          }}
        >

          {/* ── TOP: tagline + description + time ── */}
          <div style={{
            display: "flex", flexDirection: "column",
            gap: "clamp(0.42rem,0.95vh,0.75rem)", flexShrink: 0,
          }}>
            <p style={{
              color: "rgba(201,168,76,0.55)",
              fontSize: "clamp(0.52rem,0.8vw,0.64rem)",
              fontStyle: "italic", fontWeight: 500,
              letterSpacing: "0.06em", margin: 0, lineHeight: 1.5,
            }}>"{EVENT.tagline}"</p>

            <p style={{
              color: "rgba(255,255,255,0.3)",
              fontSize: "clamp(0.52rem,0.78vw,0.62rem)",
              fontWeight: 400, margin: 0, lineHeight: 1.72,
            }}>{EVENT.description}</p>

            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <div style={{ width: "12px", height: "1px", background: "rgba(201,168,76,0.28)", flexShrink: 0 }} />
              <span style={{
                color: "rgba(255,255,255,0.24)",
                fontSize: "clamp(0.38rem,0.6vw,0.48rem)",
                letterSpacing: "0.28em", textTransform: "uppercase", fontWeight: 600,
              }}>{EVENT.time}</span>
            </div>
          </div>


          {/* ── MIDDLE: stats grid ── */}
          <div
            className="xb-stats"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "clamp(0.42rem,0.95vh,0.75rem) clamp(0.52rem,1.2vw,0.95rem)",
              flexShrink: 0,
            }}
          >
            {HIGHLIGHTS.map((h, i) => (
              <div
                key={i}
                style={{
                  padding: "clamp(0.42rem,0.95vh,0.7rem)",
                  border: `1px solid ${XG.borderDim}`,
                  background: "rgba(82,176,67,0.025)",
                  display: "flex", flexDirection: "column", gap: "0.1rem",
                  transition: "border-color 0.2s ease, background 0.2s ease",
                  cursor: "default",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = XG.border;
                  e.currentTarget.style.background = "rgba(82,176,67,0.055)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = XG.borderDim;
                  e.currentTarget.style.background = "rgba(82,176,67,0.025)";
                }}
              >
                <div style={{ display: "flex", alignItems: "baseline", gap: "0.2em" }}>
                  <span style={{
                    color: XG.primary,
                    fontSize: "clamp(0.85rem,1.75vw,1.35rem)",
                    fontWeight: 800, letterSpacing: "0.02em", lineHeight: 1,
                  }}>{h.num}</span>
                  {h.unit && (
                    <span style={{
                      color: XG.dim,
                      fontSize: "clamp(0.4rem,0.64vw,0.5rem)",
                      fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase",
                    }}>{h.unit}</span>
                  )}
                </div>
                <span style={{
                  color: "rgba(255,255,255,0.25)",
                  fontSize: "clamp(0.37rem,0.58vw,0.46rem)",
                  letterSpacing: "0.24em", textTransform: "uppercase", fontWeight: 600,
                }}>{h.label}</span>
              </div>
            ))}
          </div>


          {/* ── BOTTOM: moments ticker ── */}
          <div
            className="xb-moments"
            style={{
              display: "flex", flexDirection: "column",
              gap: "clamp(0.28rem,0.65vh,0.48rem)", flexShrink: 0,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{
                color: XG.dim,
                fontSize: "clamp(0.35rem,0.56vw,0.43rem)",
                letterSpacing: "0.38em", textTransform: "uppercase", fontWeight: 700,
              }}>Event Moments</span>

              <div style={{ display: "flex", gap: "3px" }}>
                {MOMENTS.map((_, i) => (
                  <div
                    key={i}
                    onClick={() => goToMoment(i)}
                    style={{
                      width: activeMoment === i ? "14px" : "4px",
                      height: "2px", borderRadius: "1px",
                      background: activeMoment === i ? XG.primary : "rgba(82,176,67,0.18)",
                      transition: "all 0.35s ease", cursor: "pointer",
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Ticker card */}
            <div style={{
              position: "relative",
              height: "clamp(2.9rem,6.8vh,4.8rem)",
              overflow: "hidden",
            }}>
              {MOMENTS.map((m, i) => (
                <div
                  key={i}
                  style={{
                    position: "absolute", inset: 0,
                    display: "flex", flexDirection: "column", gap: "0.18rem",
                    padding: "clamp(0.38rem,0.88vh,0.62rem)",
                    border: `1px solid ${XG.borderDim}`,
                    background: "rgba(82,176,67,0.025)",
                    opacity: activeMoment === i ? 1 : 0,
                    transform: activeMoment === i ? "translateY(0)" : "translateY(8px)",
                    transition: "all 0.45s cubic-bezier(0.22,1,0.36,1)",
                    pointerEvents: activeMoment === i ? "auto" : "none",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.44rem" }}>
                    <span style={{
                      color: XG.primary,
                      fontSize: "clamp(0.37rem,0.58vw,0.44rem)",
                      letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 700,
                      border: `1px solid ${XG.dim}`,
                      padding: "0.04rem 0.25rem", flexShrink: 0,
                    }}>{m.time}</span>
                    <span style={{
                      color: "rgba(255,255,255,0.75)",
                      fontSize: "clamp(0.48rem,0.75vw,0.58rem)",
                      fontWeight: 600, letterSpacing: "0.04em",
                    }}>{m.title}</span>
                  </div>
                  <p style={{
                    color: "rgba(255,255,255,0.25)",
                    fontSize: "clamp(0.38rem,0.6vw,0.46rem)",
                    margin: 0, lineHeight: 1.55, letterSpacing: "0.03em",
                  }}>{m.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>


        {/* ══ RIGHT: IMAGE PANEL ════════════════════════════ */}
        <div
          className="xb-image"
          style={{
            flex: 1,
            minWidth: 0,
            minHeight: 0,       /* CRITICAL */
            height: "100%",
            position: "relative",
            overflow: "hidden",
            background: "#060504",
          }}
        >
          {/* Shimmer while image loads */}
          {!imgLoaded && (
            <div style={{
              position: "absolute", inset: 0, zIndex: 1,
              background: "linear-gradient(90deg,#0d0b08 25%,#161310 50%,#0d0b08 75%)",
              backgroundSize: "400% 100%",
              animation: "xb-shimmer 1.8s ease infinite",
            }} />
          )}

          {/* Hero image */}
          <Image
            src="/photos/events/xbox_events.jpg"
            alt="Xbox Partner Preview Gaming Event at Mall of America"
            fill
            priority
            sizes="(max-width:680px) 100vw, 67vw"
            style={{
              objectFit: "cover",
              objectPosition: "center",
              opacity: imgLoaded ? 1 : 0,
              transition: "opacity 1.1s ease",
            }}
            onLoad={() => setImgLoaded(true)}
          />

          {/* Left blend into info panel */}
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none", zIndex: 2,
            background: `
              linear-gradient(to right,  rgba(5,4,2,0.75) 0%, transparent 18%, transparent 82%, rgba(5,4,2,0.2) 100%),
              linear-gradient(to bottom, rgba(5,4,2,0.12) 0%, transparent 10%, transparent 88%, rgba(5,4,2,0.35) 100%)
            `,
          }} />

          {/* Xbox green atmospheric overlay */}
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none", zIndex: 2,
            background: `radial-gradient(ellipse 55% 50% at 55% 52%, rgba(16,124,16,0.08) 0%, transparent 62%)`,
          }} />

          {/* ── Event Recap badge — top left ── */}
          <div style={{
            position: "absolute",
            top: "clamp(0.55rem,1.1vw,0.85rem)",
            left: "clamp(0.55rem,1.1vw,0.85rem)",
            zIndex: 5,
            display: "flex", alignItems: "center", gap: "0.32rem",
            background: "rgba(5,4,2,0.78)",
            border: `1px solid ${XG.border}`,
            padding: "0.17rem 0.48rem",
            backdropFilter: "blur(8px)",
          }}>
            <div style={{
              width: "5px", height: "5px", borderRadius: "50%",
              background: XG.primary,
              animation: "xb-pulse 1.8s ease infinite",
            }} />
            <span style={{
              color: XG.primary,
              fontSize: "0.41rem",
              letterSpacing: "0.32em", textTransform: "uppercase", fontWeight: 700,
            }}>March 2026 Recap</span>
          </div>

          {/* ── Xbox wordmark watermark — bottom left ── */}
          <div style={{
            position: "absolute",
            bottom: "clamp(0.55rem,1.1vw,0.85rem)",
            left: "clamp(0.55rem,1.1vw,0.85rem)",
            zIndex: 5,
            display: "flex", alignItems: "center", gap: "0.4rem",
            pointerEvents: "none",
          }}>
            {/* Xbox sphere mark */}
            <div style={{
              width: "22px", height: "22px",
              border: `1px solid ${XG.border}`,
              background: "rgba(5,4,2,0.65)",
              display: "flex", alignItems: "center", justifyContent: "center",
              backdropFilter: "blur(6px)",
              borderRadius: "50%",
              flexShrink: 0,
            }}>
              {/* Simplified Xbox X */}
              <svg viewBox="0 0 20 20" width="12" height="12" fill="none">
                <path d="M4 4 L16 16 M16 4 L4 16" stroke={XG.primary} strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.04rem" }}>
              <span style={{
                color: "rgba(255,255,255,0.55)",
                fontSize: "0.44rem", fontWeight: 700,
                letterSpacing: "0.16em", textTransform: "uppercase",
              }}>Xbox</span>
              <span style={{
                color: "rgba(255,255,255,0.2)",
                fontSize: "0.36rem",
                letterSpacing: "0.1em", textTransform: "uppercase",
              }}>Mall of America</span>
            </div>
          </div>

          {/* ── Photo credit / label — bottom right ── */}
          <div style={{
            position: "absolute",
            bottom: "clamp(0.55rem,1.1vw,0.85rem)",
            right: "clamp(0.55rem,1.1vw,0.85rem)",
            zIndex: 5,
            background: "rgba(5,4,2,0.76)",
            border: "1px solid rgba(201,168,76,0.22)",
            padding: "0.18rem 0.52rem",
            backdropFilter: "blur(8px)",
          }}>
            <span style={{
              color: "rgba(201,168,76,0.75)",
              fontSize: "0.41rem",
              letterSpacing: "0.22em", textTransform: "uppercase", fontWeight: 700,
            }}>Partner Preview · MoA</span>
          </div>

          {/* Corner brackets on image */}
          {(["tl", "tr", "bl", "br"] as const).map(pos => (
            <Corner
              key={pos} pos={pos} size={10}
              color={`rgba(82,176,67,0.28)`} thickness="1.5px"
            />
          ))}
        </div>
      </div>{/* /xb-body */}


      {/* ════════════════════════════════════════════════════
          FOOTER  — flexShrink: 0
      ════════════════════════════════════════════════════ */}
      <footer style={{
        flexShrink: 0,
        position: "relative", zIndex: 10,
        borderTop: "1px solid rgba(201,168,76,0.07)",
        padding: "clamp(0.26rem,0.6vh,0.46rem) clamp(1.4rem,4vw,3.5rem)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "1rem",
        overflow: "hidden",
        opacity: mounted ? 1 : 0,
        transition: "opacity 1s ease 0.5s",
      }}>

        {/* Tag strip */}
        <div style={{ display: "flex", alignItems: "center", overflow: "hidden", flex: 1, gap: 0 }}>
          {TAGS.map((tag, i) => (
            <span key={i} style={{
              color: XG.dim,
              fontSize: "clamp(0.3rem,0.48vw,0.38rem)",
              letterSpacing: "0.26em", textTransform: "uppercase",
              fontWeight: 600, whiteSpace: "nowrap",
              padding: `0 clamp(0.42rem,0.95vw,0.85rem)`,
              borderRight: i < TAGS.length - 1 ? `1px solid rgba(82,176,67,0.1)` : "none",
            }}>{tag}</span>
          ))}
        </div>

        {/* Back link */}
        <a
          href="/events/entertainmentAndGaming"
          style={{
            color: "rgba(201,168,76,0.42)",
            fontSize: "clamp(0.34rem,0.56vw,0.44rem)",
            letterSpacing: "0.28em", textTransform: "uppercase",
            fontWeight: 700, textDecoration: "none", flexShrink: 0,
            display: "flex", alignItems: "center", gap: "0.3rem",
            transition: "color 0.18s ease",
          }}
          onMouseEnter={e => (e.currentTarget.style.color = "#C9A84C")}
          onMouseLeave={e => (e.currentTarget.style.color = "rgba(201,168,76,0.42)")}
        >
          <span style={{ fontSize: "0.56rem" }}>←</span> All Events
        </a>
      </footer>


      {/* ══ Keyframes + responsive ══ */}
      <style>{`
        @keyframes xb-pulse {
          0%,100% { opacity: 1;   transform: scale(1);    }
          50%      { opacity: 0.3; transform: scale(0.68); }
        }
        @keyframes xb-shimmer {
          0%   { background-position:  200% 0; }
          100% { background-position: -200% 0; }
        }

        /* ── Mobile < 680px ── */
        @media (max-width: 680px) {
          .xb-body { flex-direction: column !important; }

          .xb-left {
            width: 100% !important;
            height: auto !important;
            flex: 0 0 auto !important;
            border-right: none !important;
            border-bottom: 1px solid rgba(201,168,76,0.08) !important;
            padding: 0.65rem 1rem !important;
            justify-content: flex-start !important;
            gap: 0.55rem !important;
          }

          .xb-moments { display: none !important; }

          .xb-stats {
            grid-template-columns: repeat(4,1fr) !important;
            gap: 0.28rem !important;
          }

          .xb-image {
            flex: 1 1 0 !important;
            width: 100% !important;
            min-height: 0 !important;
            height: auto !important;
            position: relative !important;
          }
        }

        /* ── Tablet 680–960px ── */
        @media (min-width: 680px) and (max-width: 960px) {
          .xb-left {
            width: clamp(215px,29vw,305px) !important;
          }
        }

        /* ── Wide 1400px+ ── */
        @media (min-width: 1400px) {
          .xb-left { width: 440px !important; }
        }
      `}</style>
    </main>
  );
}