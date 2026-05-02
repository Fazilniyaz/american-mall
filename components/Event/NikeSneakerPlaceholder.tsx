"use client";

import { useEffect, useRef, useState, useCallback } from "react";

// ─── Event metadata ────────────────────────────────────────────────────────────
const EVENT = {
  eyebrow: "Mall of America · Entertainment & Gaming",
  date: "November 22, 2024",
  time: "9:00 AM – 10:00 PM",
  location: "Level 2, East Broadway · Mall of America",
  tagline: "Where Culture Meets Court",
  description:
    "Nike's most anticipated sneaker drop of the year landed at Mall of America — an all-day cultural takeover featuring exclusive colorways, live customization studios, athlete appearances, and the energy of streetwear at its peak.",
};

const HIGHLIGHTS = [
  { num: "3,200+", unit: "guests", label: "Attended" },
  { num: "06", unit: "drops", label: "Exclusive Drops" },
  { num: "48", unit: "styles", label: "On Display" },
  { num: "13", unit: "hrs", label: "Live Experience" },
];

const MOMENTS = [
  {
    time: "09:00 AM",
    title: "Doors Open — Line Culture",
    desc: "Hundreds queued overnight for exclusive early-access wristbands and first looks at the drop wall.",
  },
  {
    time: "11:00 AM",
    title: "Air Max Reveal",
    desc: "Official unveiling of the limited-edition MoA exclusive colorway — a first in Nike's retail history.",
  },
  {
    time: "01:00 PM",
    title: "Custom ID Studio",
    desc: "Live Nike By You customization sessions with on-site designers. 200 pairs personalized on the day.",
  },
  {
    time: "03:30 PM",
    title: "Athlete Meet & Greet",
    desc: "Surprise appearance by Nike-sponsored athletes for signings, photo drops, and crowd challenges.",
  },
  {
    time: "07:00 PM",
    title: "Night Drop Ceremony",
    desc: "Raffle winners claimed their pairs in a lit ceremony — the final exclusive Jordan 1 collab revealed.",
  },
];

const TAGS = [
  "Air Max", "Jordan 1", "Nike By You", "Streetwear", "Sneaker Culture",
  "Limited Edition", "MoA Exclusive",
];

// ─── Corner bracket helper ─────────────────────────────────────────────────────
function Corner({ pos, opacity = 0.35 }: { pos: "tl" | "tr" | "bl" | "br"; opacity?: number }) {
  return (
    <div style={{
      position: "absolute", width: "11px", height: "11px",
      pointerEvents: "none", zIndex: 30,
      ...(pos.includes("t") ? { top: "4px" } : { bottom: "4px" }),
      ...(pos.includes("l") ? { left: "4px" } : { right: "4px" }),
      borderTop: pos.includes("t") ? `1px solid rgba(201,168,76,${opacity})` : "none",
      borderBottom: pos.includes("b") ? `1px solid rgba(201,168,76,${opacity})` : "none",
      borderLeft: pos.includes("l") ? `1px solid rgba(201,168,76,${opacity})` : "none",
      borderRight: pos.includes("r") ? `1px solid rgba(201,168,76,${opacity})` : "none",
    }} />
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function NikeSneakerLaunchEventPage() {
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

  /* ── video ── */
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

  /* ── moments auto-cycle ── */
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

      {/* ── Ambient glow — warm orange-red nod to Nike energy ── */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none",
        background: `
          radial-gradient(ellipse 60% 50% at 72% 58%, rgba(220,68,24,0.06) 0%, transparent 58%),
          radial-gradient(ellipse 45% 55% at 12% 28%, rgba(201,168,76,0.05) 0%, transparent 52%)
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


      {/* ════════════════════════════════════════════════
          HEADER  (flexShrink: 0)
      ════════════════════════════════════════════════ */}
      <header style={{
        flexShrink: 0,
        position: "relative", zIndex: 10,
        padding: "clamp(0.7rem,1.6vh,1.2rem) clamp(1.4rem,4vw,3.5rem) clamp(0.4rem,0.9vh,0.7rem)",
        borderBottom: "1px solid rgba(201,168,76,0.08)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "1rem",
        opacity: mounted ? 1 : 0,
        transform: mounted ? "translateY(0)" : "translateY(-14px)",
        transition: "all 0.75s cubic-bezier(0.22,1,0.36,1)",
      }}>

        {/* Left: eyebrow + headline */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div style={{ width: "18px", height: "1px", background: "#C9A84C", opacity: 0.5, flexShrink: 0 }} />
            <span style={{
              color: "#C9A84C",
              fontSize: "clamp(0.38rem,0.66vw,0.48rem)",
              letterSpacing: "0.44em",
              textTransform: "uppercase",
              fontWeight: 700,
            }}>{EVENT.eyebrow}</span>
          </div>

          <div style={{ display: "flex", alignItems: "baseline", gap: "0.42em", flexWrap: "wrap" }}>
            <h1 style={{
              color: "#ffffff",
              fontSize: "clamp(1.1rem,2.6vw,2.1rem)",
              fontWeight: 900,
              letterSpacing: "0.02em",
              textTransform: "uppercase",
              lineHeight: 1,
              margin: 0,
            }}>Nike</h1>
            {/* Swoosh-red accent on "Sneaker Launch" */}
            <h1 style={{
              color: "#C9A84C",
              fontSize: "clamp(1.1rem,2.6vw,2.1rem)",
              fontWeight: 900,
              letterSpacing: "0.02em",
              textTransform: "uppercase",
              lineHeight: 1,
              margin: 0,
              textShadow: "0 0 40px rgba(201,168,76,0.22)",
            }}>Sneaker Launch Event</h1>
          </div>
        </div>

        {/* Right: date + location pill */}
        <div style={{
          display: "flex", flexDirection: "column",
          alignItems: "flex-end", gap: "0.18rem", flexShrink: 0,
        }}>
          <div style={{
            display: "flex", alignItems: "center", gap: "0.38rem",
            background: "rgba(201,168,76,0.07)",
            border: "1px solid rgba(201,168,76,0.18)",
            padding: "0.2rem 0.65rem",
          }}>
            <div style={{
              width: "4px", height: "4px", borderRadius: "50%",
              background: "#C9A84C",
              animation: "nk-pulse 2s ease infinite",
            }} />
            <span style={{
              color: "#C9A84C",
              fontSize: "clamp(0.4rem,0.66vw,0.5rem)",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              fontWeight: 700,
            }}>{EVENT.date}</span>
          </div>
          <span style={{
            color: "rgba(255,255,255,0.2)",
            fontSize: "clamp(0.36rem,0.58vw,0.44rem)",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}>{EVENT.location}</span>
        </div>
      </header>


      {/* ════════════════════════════════════════════════
          BODY  (flex:1 + minHeight:0)
          Left info panel | Right video
      ════════════════════════════════════════════════ */}
      <div
        className="nk-body"
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

        {/* ── LEFT INFO PANEL ──────────────────────────────── */}
        <div
          className="nk-left"
          style={{
            flexShrink: 0,
            width: "clamp(255px,33vw,430px)",
            minHeight: 0,       /* CRITICAL */
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "clamp(0.85rem,2vh,1.6rem) clamp(1.4rem,3.5vw,3rem)",
            borderRight: "1px solid rgba(201,168,76,0.08)",
            overflow: "hidden",
          }}
        >

          {/* ── TOP: tagline + description + time ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "clamp(0.45rem,1vh,0.8rem)", flexShrink: 0 }}>
            {/* Tagline */}
            <p style={{
              color: "rgba(201,168,76,0.55)",
              fontSize: "clamp(0.54rem,0.82vw,0.66rem)",
              fontStyle: "italic",
              fontWeight: 500,
              letterSpacing: "0.06em",
              margin: 0,
              lineHeight: 1.5,
            }}>"{EVENT.tagline}"</p>

            {/* Description */}
            <p style={{
              color: "rgba(255,255,255,0.3)",
              fontSize: "clamp(0.54rem,0.8vw,0.64rem)",
              fontWeight: 400,
              margin: 0,
              lineHeight: 1.72,
            }}>{EVENT.description}</p>

            {/* Time row */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.52rem" }}>
              <div style={{ width: "12px", height: "1px", background: "rgba(201,168,76,0.3)", flexShrink: 0 }} />
              <span style={{
                color: "rgba(255,255,255,0.26)",
                fontSize: "clamp(0.4rem,0.62vw,0.5rem)",
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                fontWeight: 600,
              }}>{EVENT.time}</span>
            </div>
          </div>


          {/* ── MIDDLE: highlight stat grid ── */}
          <div
            className="nk-stats"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "clamp(0.45rem,1vh,0.8rem) clamp(0.55rem,1.3vw,1rem)",
              flexShrink: 0,
            }}
          >
            {HIGHLIGHTS.map((h, i) => (
              <div
                key={i}
                style={{
                  padding: "clamp(0.45rem,1vh,0.75rem)",
                  border: "1px solid rgba(201,168,76,0.1)",
                  background: "rgba(201,168,76,0.03)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.12rem",
                  transition: "border-color 0.2s ease",
                  cursor: "default",
                }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(201,168,76,0.3)")}
                onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(201,168,76,0.1)")}
              >
                <div style={{ display: "flex", alignItems: "baseline", gap: "0.2em" }}>
                  <span style={{
                    color: "#C9A84C",
                    fontSize: "clamp(0.9rem,1.85vw,1.4rem)",
                    fontWeight: 800,
                    letterSpacing: "0.02em",
                    lineHeight: 1,
                  }}>{h.num}</span>
                  <span style={{
                    color: "rgba(201,168,76,0.48)",
                    fontSize: "clamp(0.42rem,0.66vw,0.52rem)",
                    fontWeight: 600,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}>{h.unit}</span>
                </div>
                <span style={{
                  color: "rgba(255,255,255,0.26)",
                  fontSize: "clamp(0.38rem,0.6vw,0.48rem)",
                  letterSpacing: "0.24em",
                  textTransform: "uppercase",
                  fontWeight: 600,
                }}>{h.label}</span>
              </div>
            ))}
          </div>


          {/* ── BOTTOM: moments ticker ── */}
          <div
            className="nk-moments"
            style={{ display: "flex", flexDirection: "column", gap: "clamp(0.3rem,0.7vh,0.5rem)", flexShrink: 0 }}
          >
            {/* Row header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{
                color: "rgba(201,168,76,0.38)",
                fontSize: "clamp(0.36rem,0.58vw,0.44rem)",
                letterSpacing: "0.38em",
                textTransform: "uppercase",
                fontWeight: 700,
              }}>Event Moments</span>

              {/* Dots */}
              <div style={{ display: "flex", gap: "3px" }}>
                {MOMENTS.map((_, i) => (
                  <div
                    key={i}
                    onClick={() => setActiveMoment(i)}
                    style={{
                      width: activeMoment === i ? "14px" : "4px",
                      height: "2px",
                      borderRadius: "1px",
                      background: activeMoment === i ? "#C9A84C" : "rgba(201,168,76,0.18)",
                      transition: "all 0.35s ease",
                      cursor: "pointer",
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Ticker card */}
            <div style={{
              position: "relative",
              height: "clamp(3rem,7vh,5rem)",
              overflow: "hidden",
            }}>
              {MOMENTS.map((m, i) => (
                <div
                  key={i}
                  style={{
                    position: "absolute", inset: 0,
                    display: "flex", flexDirection: "column", gap: "0.2rem",
                    padding: "clamp(0.4rem,0.9vh,0.65rem)",
                    border: "1px solid rgba(201,168,76,0.1)",
                    background: "rgba(201,168,76,0.03)",
                    opacity: activeMoment === i ? 1 : 0,
                    transform: activeMoment === i ? "translateY(0)" : "translateY(8px)",
                    transition: "all 0.45s cubic-bezier(0.22,1,0.36,1)",
                    pointerEvents: activeMoment === i ? "auto" : "none",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.46rem" }}>
                    <span style={{
                      color: "#C9A84C",
                      fontSize: "clamp(0.38rem,0.6vw,0.46rem)",
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      fontWeight: 700,
                      border: "1px solid rgba(201,168,76,0.22)",
                      padding: "0.04rem 0.26rem",
                      flexShrink: 0,
                    }}>{m.time}</span>
                    <span style={{
                      color: "rgba(255,255,255,0.75)",
                      fontSize: "clamp(0.5rem,0.78vw,0.6rem)",
                      fontWeight: 600,
                      letterSpacing: "0.04em",
                    }}>{m.title}</span>
                  </div>
                  <p style={{
                    color: "rgba(255,255,255,0.26)",
                    fontSize: "clamp(0.4rem,0.62vw,0.48rem)",
                    margin: 0,
                    lineHeight: 1.55,
                    letterSpacing: "0.03em",
                  }}>{m.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>


        {/* ── RIGHT: VIDEO PANEL ───────────────────────────── */}
        <div
          className="nk-video"
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
          {/* Shimmer */}
          {!videoReady && (
            <div style={{
              position: "absolute", inset: 0, zIndex: 1,
              background: "linear-gradient(90deg,#0d0b08 25%,#171410 50%,#0d0b08 75%)",
              backgroundSize: "400% 100%",
              animation: "nk-shimmer 1.8s ease infinite",
            }} />
          )}

          {/* Video */}
          <video
            ref={videoRef}
            src="/videos/nikeEventVideo.mp4"
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

          {/* Blend gradient — left edge into info panel */}
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none", zIndex: 2,
            background: `
              linear-gradient(to right,  rgba(5,4,2,0.7) 0%, transparent 15%, transparent 86%, rgba(5,4,2,0.22) 100%),
              linear-gradient(to bottom, rgba(5,4,2,0.1) 0%, transparent 8%,  transparent 90%, rgba(5,4,2,0.28) 100%)
            `,
          }} />

          {/* Subtle Nike orange warmth */}
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none", zIndex: 2,
            background: "radial-gradient(ellipse 55% 50% at 58% 50%, rgba(220,68,24,0.05) 0%, transparent 62%)",
          }} />

          {/* ── RECAP badge — top left ── */}
          <div style={{
            position: "absolute",
            top: "clamp(0.6rem,1.2vw,0.9rem)",
            left: "clamp(0.6rem,1.2vw,0.9rem)",
            zIndex: 5,
            display: "flex", alignItems: "center", gap: "0.34rem",
            background: "rgba(5,4,2,0.76)",
            border: "1px solid rgba(201,168,76,0.2)",
            padding: "0.18rem 0.5rem",
            backdropFilter: "blur(8px)",
          }}>
            <div style={{
              width: "5px", height: "5px", borderRadius: "50%",
              background: "#C9A84C",
              animation: "nk-pulse 1.8s ease infinite",
            }} />
            <span style={{
              color: "rgba(201,168,76,0.8)",
              fontSize: "0.42rem",
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              fontWeight: 700,
            }}>Event Recap</span>
          </div>

          {/* ── Nike wordmark watermark — bottom left ── */}
          <div style={{
            position: "absolute",
            bottom: "clamp(0.6rem,1.2vw,0.9rem)",
            left: "clamp(0.6rem,1.2vw,0.9rem)",
            zIndex: 5,
            display: "flex", alignItems: "center", gap: "0.42rem",
            pointerEvents: "none",
          }}>
            {/* Swoosh circle */}
            <div style={{
              width: "22px", height: "22px",
              border: "1px solid rgba(201,168,76,0.25)",
              background: "rgba(5,4,2,0.62)",
              display: "flex", alignItems: "center", justifyContent: "center",
              backdropFilter: "blur(6px)",
              borderRadius: "50%",
            }}>
              {/* Swoosh SVG */}
              <svg viewBox="0 0 24 24" width="13" height="13" fill="none">
                <path
                  d="M2 16 C6 6, 18 3, 22 8 C19 9, 6 13, 2 16Z"
                  fill="rgba(201,168,76,0.85)"
                />
              </svg>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.04rem" }}>
              <span style={{
                color: "rgba(255,255,255,0.55)",
                fontSize: "0.46rem", fontWeight: 700,
                letterSpacing: "0.16em", textTransform: "uppercase",
              }}>Nike</span>
              <span style={{
                color: "rgba(255,255,255,0.2)",
                fontSize: "0.38rem",
                letterSpacing: "0.1em", textTransform: "uppercase",
              }}>Mall of America</span>
            </div>
          </div>

          {/* ── Mute toggle — bottom right ── */}
          <button
            onClick={toggleMute}
            style={{
              position: "absolute",
              bottom: "clamp(0.6rem,1.2vw,0.9rem)",
              right: "clamp(0.6rem,1.2vw,0.9rem)",
              zIndex: 5,
              background: "rgba(5,4,2,0.76)",
              border: "1px solid rgba(201,168,76,0.28)",
              color: "rgba(201,168,76,0.85)",
              padding: "0.2rem 0.55rem",
              backdropFilter: "blur(8px)",
              fontSize: "0.42rem",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 0.18s ease",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(201,168,76,0.14)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(5,4,2,0.76)"; }}
          >
            {isMuted ? "▶ Sound On" : "⏸ Mute"}
          </button>

          {/* Corner brackets on video */}
          {(["tl", "tr", "bl", "br"] as const).map(pos => (
            <div key={pos} style={{
              position: "absolute", width: "11px", height: "11px",
              zIndex: 4, pointerEvents: "none",
              ...(pos.includes("t") ? { top: "5px" } : { bottom: "5px" }),
              ...(pos.includes("l") ? { left: "5px" } : { right: "5px" }),
              borderTop: pos.includes("t") ? "1.5px solid rgba(201,168,76,0.28)" : "none",
              borderBottom: pos.includes("b") ? "1.5px solid rgba(201,168,76,0.28)" : "none",
              borderLeft: pos.includes("l") ? "1.5px solid rgba(201,168,76,0.28)" : "none",
              borderRight: pos.includes("r") ? "1.5px solid rgba(201,168,76,0.28)" : "none",
            }} />
          ))}
        </div>
      </div>{/* /nk-body */}


      {/* ════════════════════════════════════════════════
          FOOTER  (flexShrink: 0)
      ════════════════════════════════════════════════ */}
      <footer style={{
        flexShrink: 0,
        position: "relative", zIndex: 10,
        borderTop: "1px solid rgba(201,168,76,0.07)",
        padding: "clamp(0.28rem,0.65vh,0.5rem) clamp(1.4rem,4vw,3.5rem)",
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
          display: "flex", alignItems: "center", gap: 0,
          overflow: "hidden", flex: 1,
        }}>
          {TAGS.map((tag, i) => (
            <span key={i} style={{
              color: "rgba(201,168,76,0.22)",
              fontSize: "clamp(0.32rem,0.5vw,0.4rem)",
              letterSpacing: "0.26em",
              textTransform: "uppercase",
              fontWeight: 600,
              whiteSpace: "nowrap",
              padding: `0 clamp(0.45rem,1vw,0.9rem)`,
              borderRight: i < TAGS.length - 1 ? "1px solid rgba(201,168,76,0.08)" : "none",
            }}>{tag}</span>
          ))}
        </div>

        {/* Back link */}
        <a
          href="/events/entertainmentAndGaming"
          style={{
            color: "rgba(201,168,76,0.42)",
            fontSize: "clamp(0.36rem,0.58vw,0.46rem)",
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            fontWeight: 700,
            textDecoration: "none",
            flexShrink: 0,
            display: "flex", alignItems: "center", gap: "0.32rem",
            transition: "color 0.18s ease",
          }}
          onMouseEnter={e => (e.currentTarget.style.color = "#C9A84C")}
          onMouseLeave={e => (e.currentTarget.style.color = "rgba(201,168,76,0.42)")}
        >
          <span style={{ fontSize: "0.58rem" }}>←</span> All Events
        </a>
      </footer>


      {/* ══ Keyframes + responsive ══ */}
      <style>{`
        @keyframes nk-pulse {
          0%,100% { opacity: 1;   transform: scale(1);    }
          50%      { opacity: 0.3; transform: scale(0.68); }
        }
        @keyframes nk-shimmer {
          0%   { background-position:  200% 0; }
          100% { background-position: -200% 0; }
        }

        /* ── Mobile < 680px: stack vertically ── */
        @media (max-width: 680px) {
          .nk-body { flex-direction: column !important; }

          .nk-left {
            width: 100% !important;
            height: auto !important;
            flex: 0 0 auto !important;
            border-right: none !important;
            border-bottom: 1px solid rgba(201,168,76,0.08) !important;
            padding: 0.7rem 1rem !important;
            justify-content: flex-start !important;
            gap: 0.6rem !important;
          }

          /* Hide moments ticker — saves space */
          .nk-moments { display: none !important; }

          /* Stats: 4-col row */
          .nk-stats {
            grid-template-columns: repeat(4,1fr) !important;
            gap: 0.3rem !important;
          }

          /* Video: flex remainder */
          .nk-video {
            flex: 1 1 0 !important;
            width: 100% !important;
            min-height: 0 !important;
            height: auto !important;
            position: relative !important;
          }
        }

        /* ── Tablet 680–960px: narrow info panel ── */
        @media (min-width: 680px) and (max-width: 960px) {
          .nk-left {
            width: clamp(220px, 30vw, 310px) !important;
          }
        }
      `}</style>
    </main>
  );
}