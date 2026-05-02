"use client";

import { useEffect, useRef, useState, useCallback } from "react";

// ─── Event metadata ────────────────────────────────────────────────────────────
const EVENT = {
  eyebrow: "Mall of America · Entertainment & Gaming",
  date: "February 08, 2025",
  time: "10:00 AM – 9:00 PM",
  location: "Level 1, South Atrium · Mall of America",
  tagline: "Feel The Game. Wear The Moment.",
  description:
    "Adidas brought its boldest fan engagement experience to Mall of America — a full-day cultural immersion blending sport, streetwear, and community. From turf challenges to personalized drops, every touchpoint was built for the fan.",
};

const HIGHLIGHTS = [
  { num: "4,500+", unit: "fans", label: "Engaged" },
  { num: "08", unit: "zones", label: "Experience Zones" },
  { num: "60+", unit: "styles", label: "On Display" },
  { num: "11", unit: "hrs", label: "Live Activation" },
];

const MOMENTS = [
  {
    time: "10:00 AM",
    title: "Activation Opens",
    desc: "Fans flooded the South Atrium as the three-stripe floor decal revealed a 4,000 sq ft brand world.",
  },
  {
    time: "11:30 AM",
    title: "Turf Challenge Arena",
    desc: "Speed, agility, and strike challenges on artificial turf — top scorers won exclusive Adidas drops.",
  },
  {
    time: "01:00 PM",
    title: "Creator Studio Live",
    desc: "On-site customization of Adidas Originals with local artists — 300+ one-of-a-kind pairs created.",
  },
  {
    time: "03:30 PM",
    title: "Community Spotlight",
    desc: "Local youth sports teams walked the activation zone alongside Adidas ambassadors and coaches.",
  },
  {
    time: "06:00 PM",
    title: "Limited Drop — Trefoil x MoA",
    desc: "Mall-exclusive Trefoil collab released. Sold out in 22 minutes. 150 pairs. Zero restocks.",
  },
];

const TAGS = [
  "Adidas Originals", "Three Stripes", "Fan Activation",
  "Trefoil x MoA", "Creator Studio", "Streetwear", "Community",
];

// ─── Reusable corner bracket ───────────────────────────────────────────────────
function Corner({
  pos, size = 11, opacity = 0.32, thickness = "1.5px",
}: {
  pos: "tl" | "tr" | "bl" | "br";
  size?: number; opacity?: number; thickness?: string;
}) {
  return (
    <div style={{
      position: "absolute", pointerEvents: "none", zIndex: 30,
      width: `${size}px`, height: `${size}px`,
      ...(pos.includes("t") ? { top: "4px" } : { bottom: "4px" }),
      ...(pos.includes("l") ? { left: "4px" } : { right: "4px" }),
      borderTop: pos.includes("t") ? `${thickness} solid rgba(201,168,76,${opacity})` : "none",
      borderBottom: pos.includes("b") ? `${thickness} solid rgba(201,168,76,${opacity})` : "none",
      borderLeft: pos.includes("l") ? `${thickness} solid rgba(201,168,76,${opacity})` : "none",
      borderRight: pos.includes("r") ? `${thickness} solid rgba(201,168,76,${opacity})` : "none",
    }} />
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function AdidasFanEngagementEventPage() {
  const videoRef = useRef<HTMLVideoElement>(null);

  const [mounted, setMounted] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [activeMoment, setActiveMoment] = useState(0);

  /* ── mount ── */
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  /* ── video init ── */
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.play().catch(() => { });
    const onReady = () => setVideoReady(true);
    v.addEventListener("canplay", onReady, { once: true });
    return () => v.removeEventListener("canplay", onReady);
  }, []);

  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = isMuted;
  }, [isMuted]);

  /* ── moment auto-cycle ── */
  useEffect(() => {
    const id = setInterval(() =>
      setActiveMoment(i => (i + 1) % MOMENTS.length), 3800);
    return () => clearInterval(id);
  }, []);

  const toggleMute = useCallback(() => setIsMuted(m => !m), []);

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

      {/* ── Ambient glow — Adidas black/white brand energy stays within gold system ── */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none",
        background: `
          radial-gradient(ellipse 62% 48% at 70% 55%, rgba(255,255,255,0.025) 0%, transparent 58%),
          radial-gradient(ellipse 48% 55% at 14% 30%, rgba(201,168,76,0.055) 0%, transparent 52%),
          radial-gradient(ellipse 30% 40% at 50% 95%, rgba(201,168,76,0.03) 0%, transparent 55%)
        `,
      }} />

      {/* ── Grain texture ── */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", opacity: 0.018,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundSize: "200px 200px",
      }} />

      {/* ── Outer corner brackets ── */}
      {(["tl", "tr", "bl", "br"] as const).map(p => <Corner key={p} pos={p} opacity={0.3} />)}


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
          {/* Eyebrow */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div style={{ width: "18px", height: "1px", background: "#C9A84C", opacity: 0.5, flexShrink: 0 }} />
            <span style={{
              color: "#C9A84C",
              fontSize: "clamp(0.38rem,0.65vw,0.47rem)",
              letterSpacing: "0.44em",
              textTransform: "uppercase",
              fontWeight: 700,
            }}>{EVENT.eyebrow}</span>
          </div>

          {/* Headline */}
          <div style={{ display: "flex", alignItems: "baseline", gap: "0.42em", flexWrap: "wrap" }}>
            <h1 style={{
              color: "#ffffff",
              fontSize: "clamp(1.05rem,2.5vw,2rem)",
              fontWeight: 900,
              letterSpacing: "0.02em",
              textTransform: "uppercase",
              lineHeight: 1,
              margin: 0,
            }}>Adidas</h1>
            <h1 style={{
              color: "#C9A84C",
              fontSize: "clamp(1.05rem,2.5vw,2rem)",
              fontWeight: 900,
              letterSpacing: "0.02em",
              textTransform: "uppercase",
              lineHeight: 1,
              margin: 0,
              textShadow: "0 0 40px rgba(201,168,76,0.22)",
            }}>Fan Engagement Event</h1>
          </div>
        </div>

        {/* Right — date + location pill */}
        <div style={{
          display: "flex", flexDirection: "column",
          alignItems: "flex-end", gap: "0.16rem", flexShrink: 0,
        }}>
          <div style={{
            display: "flex", alignItems: "center", gap: "0.36rem",
            background: "rgba(201,168,76,0.07)",
            border: "1px solid rgba(201,168,76,0.18)",
            padding: "0.18rem 0.62rem",
          }}>
            <div style={{
              width: "4px", height: "4px", borderRadius: "50%",
              background: "#C9A84C",
              animation: "ad-pulse 2s ease infinite",
            }} />
            <span style={{
              color: "#C9A84C",
              fontSize: "clamp(0.38rem,0.64vw,0.48rem)",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              fontWeight: 700,
            }}>{EVENT.date}</span>
          </div>
          <span style={{
            color: "rgba(255,255,255,0.2)",
            fontSize: "clamp(0.34rem,0.56vw,0.42rem)",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}>{EVENT.location}</span>
        </div>
      </header>


      {/* ════════════════════════════════════════════════════
          BODY  — flex: 1 + minHeight: 0
          Grid: Left info panel | Right video
      ════════════════════════════════════════════════════ */}
      <div
        className="ad-body"
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
          className="ad-left"
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
            gap: "clamp(0.42rem,0.95vh,0.75rem)",
            flexShrink: 0,
          }}>
            {/* Tagline */}
            <p style={{
              color: "rgba(201,168,76,0.55)",
              fontSize: "clamp(0.52rem,0.8vw,0.64rem)",
              fontStyle: "italic", fontWeight: 500,
              letterSpacing: "0.06em", margin: 0, lineHeight: 1.5,
            }}>"{EVENT.tagline}"</p>

            {/* Description */}
            <p style={{
              color: "rgba(255,255,255,0.3)",
              fontSize: "clamp(0.52rem,0.78vw,0.62rem)",
              fontWeight: 400, margin: 0, lineHeight: 1.72,
            }}>{EVENT.description}</p>

            {/* Time row */}
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
            className="ad-stats"
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
                  border: "1px solid rgba(201,168,76,0.1)",
                  background: "rgba(201,168,76,0.03)",
                  display: "flex", flexDirection: "column", gap: "0.1rem",
                  transition: "border-color 0.2s ease, background 0.2s ease",
                  cursor: "default",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = "rgba(201,168,76,0.28)";
                  e.currentTarget.style.background = "rgba(201,168,76,0.055)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = "rgba(201,168,76,0.1)";
                  e.currentTarget.style.background = "rgba(201,168,76,0.03)";
                }}
              >
                <div style={{ display: "flex", alignItems: "baseline", gap: "0.2em" }}>
                  <span style={{
                    color: "#C9A84C",
                    fontSize: "clamp(0.88rem,1.8vw,1.38rem)",
                    fontWeight: 800, letterSpacing: "0.02em", lineHeight: 1,
                  }}>{h.num}</span>
                  <span style={{
                    color: "rgba(201,168,76,0.46)",
                    fontSize: "clamp(0.4rem,0.64vw,0.5rem)",
                    fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase",
                  }}>{h.unit}</span>
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
            className="ad-moments"
            style={{
              display: "flex", flexDirection: "column",
              gap: "clamp(0.28rem,0.65vh,0.48rem)",
              flexShrink: 0,
            }}
          >
            {/* Header row */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{
                color: "rgba(201,168,76,0.38)",
                fontSize: "clamp(0.35rem,0.56vw,0.43rem)",
                letterSpacing: "0.38em", textTransform: "uppercase", fontWeight: 700,
              }}>Event Moments</span>

              {/* Progress dots */}
              <div style={{ display: "flex", gap: "3px" }}>
                {MOMENTS.map((_, i) => (
                  <div
                    key={i}
                    onClick={() => setActiveMoment(i)}
                    style={{
                      width: activeMoment === i ? "14px" : "4px",
                      height: "2px", borderRadius: "1px",
                      background: activeMoment === i ? "#C9A84C" : "rgba(201,168,76,0.18)",
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
                    border: "1px solid rgba(201,168,76,0.1)",
                    background: "rgba(201,168,76,0.03)",
                    opacity: activeMoment === i ? 1 : 0,
                    transform: activeMoment === i ? "translateY(0)" : "translateY(8px)",
                    transition: "all 0.45s cubic-bezier(0.22,1,0.36,1)",
                    pointerEvents: activeMoment === i ? "auto" : "none",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.44rem" }}>
                    <span style={{
                      color: "#C9A84C",
                      fontSize: "clamp(0.37rem,0.58vw,0.44rem)",
                      letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 700,
                      border: "1px solid rgba(201,168,76,0.22)",
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


        {/* ══ RIGHT VIDEO PANEL ═════════════════════════════ */}
        <div
          className="ad-video"
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
          {/* Shimmer placeholder */}
          {!videoReady && (
            <div style={{
              position: "absolute", inset: 0, zIndex: 1,
              background: "linear-gradient(90deg,#0e0c09 25%,#181510 50%,#0e0c09 75%)",
              backgroundSize: "400% 100%",
              animation: "ad-shimmer 1.8s ease infinite",
            }} />
          )}

          {/* Video — 16:9 landscape, objectFit cover fills the panel */}
          <video
            ref={videoRef}
            src="/videos/adidasEvt.mp4"
            playsInline
            loop
            preload="metadata"
            style={{
              width: "100%", height: "100%",
              objectFit: "cover",
              objectPosition: "center",
              display: "block",
              opacity: videoReady ? 1 : 0,
              transition: "opacity 1.1s ease",
            }}
          />

          {/* Left blend — merges into info panel edge */}
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none", zIndex: 2,
            background: `
              linear-gradient(to right,  rgba(5,4,2,0.72) 0%, transparent 16%, transparent 85%, rgba(5,4,2,0.2) 100%),
              linear-gradient(to bottom, rgba(5,4,2,0.1)  0%, transparent 8%,  transparent 90%, rgba(5,4,2,0.3) 100%)
            `,
          }} />

          {/* Adidas three-stripe decorative lines — vertical on right edge */}
          <div style={{
            position: "absolute", right: "clamp(0.8rem,1.5vw,1.2rem)",
            top: "50%", transform: "translateY(-50%)",
            zIndex: 3, pointerEvents: "none",
            display: "flex", gap: "3px",
          }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{
                width: "2px",
                height: `clamp(40px,8vh,70px)`,
                background: `rgba(201,168,76,${0.12 - i * 0.03})`,
              }} />
            ))}
          </div>

          {/* Event Recap badge — top left */}
          <div style={{
            position: "absolute",
            top: "clamp(0.55rem,1.1vw,0.85rem)",
            left: "clamp(0.55rem,1.1vw,0.85rem)",
            zIndex: 5,
            display: "flex", alignItems: "center", gap: "0.32rem",
            background: "rgba(5,4,2,0.76)",
            border: "1px solid rgba(201,168,76,0.2)",
            padding: "0.17rem 0.48rem",
            backdropFilter: "blur(8px)",
          }}>
            <div style={{
              width: "5px", height: "5px", borderRadius: "50%",
              background: "#C9A84C",
              animation: "ad-pulse 1.8s ease infinite",
            }} />
            <span style={{
              color: "rgba(201,168,76,0.8)",
              fontSize: "0.41rem",
              letterSpacing: "0.32em",
              textTransform: "uppercase", fontWeight: 700,
            }}>Event Recap</span>
          </div>

          {/* Adidas wordmark — bottom left */}
          <div style={{
            position: "absolute",
            bottom: "clamp(0.55rem,1.1vw,0.85rem)",
            left: "clamp(0.55rem,1.1vw,0.85rem)",
            zIndex: 5,
            display: "flex", alignItems: "center", gap: "0.4rem",
            pointerEvents: "none",
          }}>
            {/* Three-stripe logo mark */}
            <div style={{
              width: "22px", height: "22px",
              border: "1px solid rgba(201,168,76,0.24)",
              background: "rgba(5,4,2,0.62)",
              display: "flex", alignItems: "center",
              justifyContent: "center", gap: "2px",
              backdropFilter: "blur(6px)",
              flexShrink: 0,
            }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{
                  width: "2px",
                  height: `${8 + i * 2}px`,
                  background: `rgba(201,168,76,${0.75 - i * 0.1})`,
                  borderRadius: "1px",
                }} />
              ))}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.04rem" }}>
              <span style={{
                color: "rgba(255,255,255,0.55)",
                fontSize: "0.44rem", fontWeight: 700,
                letterSpacing: "0.16em", textTransform: "uppercase",
              }}>Adidas</span>
              <span style={{
                color: "rgba(255,255,255,0.2)",
                fontSize: "0.36rem",
                letterSpacing: "0.1em", textTransform: "uppercase",
              }}>Mall of America</span>
            </div>
          </div>

          {/* Mute toggle — bottom right */}
          <button
            onClick={toggleMute}
            style={{
              position: "absolute",
              bottom: "clamp(0.55rem,1.1vw,0.85rem)",
              right: "clamp(0.55rem,1.1vw,0.85rem)",
              zIndex: 5,
              background: "rgba(5,4,2,0.76)",
              border: "1px solid rgba(201,168,76,0.28)",
              color: "rgba(201,168,76,0.85)",
              padding: "0.18rem 0.52rem",
              backdropFilter: "blur(8px)",
              fontSize: "0.41rem",
              letterSpacing: "0.22em", textTransform: "uppercase",
              fontWeight: 700, cursor: "pointer",
              transition: "background 0.18s ease",
              fontFamily: "var(--font-montserrat, 'Montserrat', sans-serif)",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(201,168,76,0.14)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(5,4,2,0.76)"; }}
          >
            {isMuted ? "▶ Sound On" : "⏸ Mute"}
          </button>

          {/* Video corner brackets */}
          {(["tl", "tr", "bl", "br"] as const).map(pos => (
            <Corner key={pos} pos={pos} size={10} opacity={0.26} thickness="1.5px" />
          ))}
        </div>
      </div>{/* /ad-body */}


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
        <div style={{
          display: "flex", alignItems: "center",
          overflow: "hidden", flex: 1, gap: 0,
        }}>
          {TAGS.map((tag, i) => (
            <span key={i} style={{
              color: "rgba(201,168,76,0.22)",
              fontSize: "clamp(0.3rem,0.48vw,0.38rem)",
              letterSpacing: "0.26em", textTransform: "uppercase",
              fontWeight: 600, whiteSpace: "nowrap",
              padding: `0 clamp(0.42rem,0.95vw,0.85rem)`,
              borderRight: i < TAGS.length - 1 ? "1px solid rgba(201,168,76,0.08)" : "none",
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


      {/* ══ Keyframes + responsive breakpoints ══ */}
      <style>{`
        @keyframes ad-pulse {
          0%,100% { opacity: 1;   transform: scale(1);    }
          50%      { opacity: 0.3; transform: scale(0.68); }
        }
        @keyframes ad-shimmer {
          0%   { background-position:  200% 0; }
          100% { background-position: -200% 0; }
        }

        /* ── Mobile < 680px: stack vertically ── */
        @media (max-width: 680px) {
          .ad-body  { flex-direction: column !important; }

          .ad-left {
            width: 100% !important;
            height: auto !important;
            flex: 0 0 auto !important;
            border-right: none !important;
            border-bottom: 1px solid rgba(201,168,76,0.08) !important;
            padding: 0.65rem 1rem !important;
            justify-content: flex-start !important;
            gap: 0.55rem !important;
          }

          /* Hide moments ticker on mobile */
          .ad-moments { display: none !important; }

          /* Stats: single horizontal row */
          .ad-stats {
            grid-template-columns: repeat(4,1fr) !important;
            gap: 0.28rem !important;
          }

          /* Video fills remaining viewport */
          .ad-video {
            flex: 1 1 0 !important;
            width: 100% !important;
            min-height: 0 !important;
            height: auto !important;
            position: relative !important;
          }
        }

        /* ── Tablet 680–960px: narrow info panel ── */
        @media (min-width: 680px) and (max-width: 960px) {
          .ad-left {
            width: clamp(215px,29vw,305px) !important;
          }
        }

        /* ── Wide screens 1400px+ ── */
        @media (min-width: 1400px) {
          .ad-left { width: 440px !important; }
        }
      `}</style>
    </main>
  );
}