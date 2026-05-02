"use client";

import { useEffect, useRef, useState, useCallback } from "react";

// ─── Constants ────────────────────────────────────────────────────────────────
const EVENT = {
  eyebrow: "Mall of America · Entertainment",
  titleWhite: "Entertainment &",
  titleGold: "Gaming",
  subtitle: "Galaxy Gaming & Arcade",
  date: "May 11, 2024",
  time: "10:00 AM – 11:00 PM",
  location: "Level 2, East Wing · Mall of America",
  tagline: "Where every visitor becomes a player.",
  description:
    "MOA Gaming & Arcade opened its doors to record crowds — Mario Kart DX, live esports stations, prize arcades and Galaxy Gaming rigs all lit up under one neon-soaked roof. The most immersive gaming floor in the Midwest, right inside Mall of America.",
};

const STATS = [
  { num: "80+", accent: "gold", label: "Arcade Machines" },
  { num: "24", accent: "ora", label: "Esports Stations" },
  { num: "3K+", accent: "gold", label: "Daily Players" },
  { num: "∞", accent: "ora", label: "Prize Tickets" },
];

const HIGHLIGHTS = [
  {
    tag: "ARCADE",
    color: "ora",
    title: "Classic & Modern Arcade",
    desc: "80+ machines from retro fighters to Mario Kart DX and prize redemption.",
  },
  {
    tag: "ESPORTS",
    color: "gold",
    title: "Galaxy Esports Stations",
    desc: "24 high-spec PC rigs with weekly tournaments and live leaderboards.",
  },
  {
    tag: "MOBILE",
    color: "ora",
    title: "Samsung Galaxy Play Zone",
    desc: "Exclusive Galaxy S-series mobile gaming demos and trade-in activations.",
  },
  {
    tag: "LIVE",
    color: "gold",
    title: "Live Competitions",
    desc: "Daily head-to-head brackets with prize pools and crowd spectator zones.",
  },
];

const TICKER_TAGS = [
  "Mario Kart DX", "Galaxy Gaming", "Esports Arena",
  "Prize Redemption", "MOA Arcade", "Live Tournaments",
  "Nickelodeon Universe", "Samsung Play Zone",
];

// ─── Color map ────────────────────────────────────────────────────────────────
const ACCENT = {
  gold: { full: "#C9A84C", dim: "rgba(201,168,76,0.18)", faint: "rgba(201,168,76,0.07)" },
  ora: { full: "#F97316", dim: "rgba(249,115,22,0.2)", faint: "rgba(249,115,22,0.06)" },
} as const;
type AccentKey = keyof typeof ACCENT;

// ─── Corner bracket ───────────────────────────────────────────────────────────
function Bracket({ pos, color = "rgba(201,168,76,0.3)", size = 11 }: {
  pos: "tl" | "tr" | "bl" | "br"; color?: string; size?: number;
}) {
  return (
    <div style={{
      position: "absolute", width: size, height: size,
      pointerEvents: "none", zIndex: 30,
      ...(pos.includes("t") ? { top: 4 } : { bottom: 4 }),
      ...(pos.includes("l") ? { left: 4 } : { right: 4 }),
      borderTop: pos.includes("t") ? `1px solid ${color}` : "none",
      borderBottom: pos.includes("b") ? `1px solid ${color}` : "none",
      borderLeft: pos.includes("l") ? `1px solid ${color}` : "none",
      borderRight: pos.includes("r") ? `1px solid ${color}` : "none",
    }} />
  );
}

// ─── Scrolling ticker ─────────────────────────────────────────────────────────
function Ticker({ items }: { items: string[] }) {
  return (
    <div style={{ overflow: "hidden", height: "1.35rem", display: "flex", alignItems: "center" }}>
      <div style={{ animation: "eg-ticker 20s linear infinite", display: "flex", whiteSpace: "nowrap" }}>
        {[...items, ...items].map((t, i) => (
          <span key={i} style={{
            color: i % 4 === 1 ? "rgba(249,115,22,0.28)" : "rgba(201,168,76,0.22)",
            fontSize: "clamp(0.33rem,0.5vw,0.41rem)",
            letterSpacing: "0.28em", textTransform: "uppercase", fontWeight: 700,
            padding: "0 clamp(0.55rem,1.3vw,1rem)",
            borderRight: "1px solid rgba(201,168,76,0.07)",
          }}>{t}</span>
        ))}
      </div>
    </div>
  );
}

// ─── Highlight card ───────────────────────────────────────────────────────────
function HighlightCard({ item, active, onClick }: {
  item: typeof HIGHLIGHTS[0]; active: boolean; onClick: () => void;
}) {
  const a = ACCENT[item.color as AccentKey];
  return (
    <button onClick={onClick} style={{
      background: active ? a.faint : "transparent",
      border: `1px solid ${active ? a.dim : "rgba(201,168,76,0.09)"}`,
      padding: "clamp(0.45rem,1vh,0.72rem) clamp(0.55rem,1.1vw,0.85rem)",
      cursor: "pointer", textAlign: "left",
      display: "flex", flexDirection: "column", gap: "0.2rem",
      position: "relative", overflow: "hidden",
      transition: "all 0.22s ease",
    }}
      onMouseEnter={e => { if (!active) e.currentTarget.style.borderColor = "rgba(201,168,76,0.25)"; }}
      onMouseLeave={e => { if (!active) e.currentTarget.style.borderColor = "rgba(201,168,76,0.09)"; }}
    >
      {/* Active — glowing top bar */}
      {active && (
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: "1.5px",
          background: `linear-gradient(to right, transparent, ${a.full}, transparent)`,
        }} />
      )}
      {/* Tag + title */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.38rem" }}>
        <span style={{
          color: active ? a.full : "rgba(201,168,76,0.3)",
          fontSize: "clamp(0.33rem,0.52vw,0.41rem)",
          letterSpacing: "0.32em", textTransform: "uppercase", fontWeight: 700,
          border: `1px solid ${active ? a.dim : "rgba(201,168,76,0.13)"}`,
          padding: "0.03rem 0.2rem", flexShrink: 0,
          transition: "all 0.22s ease",
        }}>{item.tag}</span>
        <span style={{
          color: active ? "#fff" : "rgba(255,255,255,0.45)",
          fontSize: "clamp(0.48rem,0.74vw,0.58rem)",
          fontWeight: 700, letterSpacing: "0.03em",
          fontFamily: "var(--font-montserrat,'Montserrat',sans-serif)",
          transition: "color 0.22s ease",
        }}>{item.title}</span>
      </div>
      {/* Description expands when active */}
      <p style={{
        color: "rgba(255,255,255,0.26)",
        fontSize: "clamp(0.38rem,0.6vw,0.48rem)",
        margin: 0, lineHeight: 1.6, letterSpacing: "0.03em",
        fontFamily: "var(--font-montserrat,'Montserrat',sans-serif)",
        maxHeight: active ? "2.8rem" : "0",
        opacity: active ? 1 : 0,
        overflow: "hidden",
        transition: "all 0.3s ease",
      }}>{item.desc}</p>
    </button>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function EntertainmentAndGamingPage() {
  const [mounted, setMounted] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [active, setActive] = useState(0);

  // Neon flicker state — simulates arcade sign flicker
  const [flicker, setFlicker] = useState(1);

  useEffect(() => { const t = setTimeout(() => setMounted(true), 60); return () => clearTimeout(t); }, []);

  // Auto-cycle highlights
  useEffect(() => {
    const id = setInterval(() => setActive(i => (i + 1) % HIGHLIGHTS.length), 3600);
    return () => clearInterval(id);
  }, []);

  // Neon flicker — subtle random opacity dip every few seconds
  useEffect(() => {
    const flick = () => {
      setFlicker(0.7);
      setTimeout(() => setFlicker(1), 80);
      setTimeout(() => setFlicker(0.85), 140);
      setTimeout(() => setFlicker(1), 200);
    };
    const id = setInterval(flick, 3200 + Math.random() * 2000);
    return () => clearInterval(id);
  }, []);

  const handleActive = useCallback((i: number) => setActive(i), []);

  return (
    <main style={{
      width: "100%",
      height: "100vh",
      minHeight: "540px",
      background: "#050402",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      position: "relative",
      fontFamily: "var(--font-montserrat,'Montserrat',sans-serif)",
    }}>

      {/* ── Atmosphere ── */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none",
        background: `
          radial-gradient(ellipse 50% 55% at 25% 55%, rgba(139,92,246,0.05) 0%, transparent 58%),
          radial-gradient(ellipse 40% 45% at 75% 30%, rgba(249,115,22,0.04) 0%, transparent 55%),
          radial-gradient(ellipse 30% 35% at 90% 80%, rgba(201,168,76,0.04) 0%, transparent 50%)
        `,
      }} />
      {/* Grain */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", opacity: 0.018,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundSize: "200px 200px",
      }} />
      {/* Outer brackets */}
      {(["tl", "tr", "bl", "br"] as const).map(p => <Bracket key={p} pos={p} />)}


      {/* ════════════════════════════════════════
          ZONE 1 — HEADER  (flexShrink: 0)
      ════════════════════════════════════════ */}
      <header style={{
        flexShrink: 0,
        position: "relative", zIndex: 10,
        padding: "clamp(0.75rem,1.7vh,1.3rem) clamp(1.4rem,4vw,3.5rem) clamp(0.4rem,0.9vh,0.7rem)",
        borderBottom: "1px solid rgba(201,168,76,0.08)",
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem",
        opacity: mounted ? 1 : 0,
        transform: mounted ? "translateY(0)" : "translateY(-14px)",
        transition: "all 0.75s cubic-bezier(0.22,1,0.36,1)",
      }}>

        {/* Left: breadcrumb + headline */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.26rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div style={{ width: "18px", height: "1px", background: "#C9A84C", opacity: 0.5 }} />
            <span style={{
              color: "#C9A84C", fontSize: "clamp(0.37rem,0.65vw,0.47rem)",
              letterSpacing: "0.44em", textTransform: "uppercase", fontWeight: 700,
            }}>{EVENT.eyebrow}</span>
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: "0.4em", flexWrap: "wrap" }}>
            <h1 style={{
              color: "#fff", fontSize: "clamp(1.1rem,2.6vw,2.1rem)",
              fontWeight: 900, letterSpacing: "0.02em",
              textTransform: "uppercase", lineHeight: 1, margin: 0,
            }}>{EVENT.titleWhite}</h1>
            <h1 style={{
              color: "#C9A84C", fontSize: "clamp(1.1rem,2.6vw,2.1rem)",
              fontWeight: 900, letterSpacing: "0.02em",
              textTransform: "uppercase", lineHeight: 1, margin: 0,
              textShadow: "0 0 40px rgba(201,168,76,0.25)",
              opacity: flicker,
              transition: "opacity 0.06s ease",
            }}>{EVENT.titleGold}</h1>
          </div>
        </div>

        {/* Right: badges */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.22rem", flexShrink: 0 }}>
          <div style={{ display: "flex", gap: "0.45rem", alignItems: "center" }}>
            {/* Orange arcade badge */}
            <div style={{
              display: "flex", alignItems: "center", gap: "0.28rem",
              background: "rgba(249,115,22,0.08)",
              border: "1px solid rgba(249,115,22,0.25)",
              padding: "0.18rem 0.5rem",
            }}>
              <div style={{
                width: "4px", height: "4px", borderRadius: "50%",
                background: "#F97316", animation: "eg-pulse 1.5s ease infinite",
              }} />
              <span style={{
                color: "#F97316", fontSize: "clamp(0.36rem,0.58vw,0.45rem)",
                letterSpacing: "0.3em", textTransform: "uppercase", fontWeight: 700,
              }}>Arcade Open</span>
            </div>
            {/* Gold date badge */}
            <div style={{
              display: "flex", alignItems: "center", gap: "0.28rem",
              background: "rgba(201,168,76,0.07)",
              border: "1px solid rgba(201,168,76,0.2)",
              padding: "0.18rem 0.55rem",
            }}>
              <div style={{
                width: "4px", height: "4px", borderRadius: "50%",
                background: "#C9A84C", animation: "eg-pulse 2s ease infinite",
              }} />
              <span style={{
                color: "#C9A84C", fontSize: "clamp(0.36rem,0.58vw,0.45rem)",
                letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 700,
              }}>{EVENT.date}</span>
            </div>
          </div>
          <span style={{
            color: "rgba(255,255,255,0.2)", fontSize: "clamp(0.34rem,0.54vw,0.42rem)",
            letterSpacing: "0.12em", textTransform: "uppercase",
          }}>{EVENT.location}</span>
        </div>
      </header>


      {/* ════════════════════════════════════════
          ZONE 2 — BODY  (flex:1, minHeight:0)
          Image LEFT · Info RIGHT  ← flipped from VR page
      ════════════════════════════════════════ */}
      <div className="eg-body" style={{
        flex: 1, minHeight: 0,
        position: "relative", zIndex: 10,
        display: "flex", flexDirection: "row",
        opacity: mounted ? 1 : 0,
        transition: "opacity 0.9s ease 0.12s",
      }}>

        {/* ── LEFT: Full-height image ────────────────────── */}
        <div className="eg-img" style={{
          flex: 1, minWidth: 0,
          height: "100%",
          position: "relative",
          overflow: "hidden",
          background: "#060504",
        }}>
          <img
            src="/photos/events/entgam.webp"
            alt="Galaxy Gaming & Arcade at Mall of America"
            onLoad={() => setImgLoaded(true)}
            style={{
              width: "100%", height: "100%",
              objectFit: "cover",
              objectPosition: "center 25%",
              display: "block",
              opacity: imgLoaded ? 1 : 0,
              transition: "opacity 1.1s ease",
              userSelect: "none",
            }}
          />

          {/* Shimmer */}
          {!imgLoaded && (
            <div style={{
              position: "absolute", inset: 0, zIndex: 1,
              background: "linear-gradient(90deg,#0c0b08 25%,#141209 50%,#0c0b08 75%)",
              backgroundSize: "400% 100%",
              animation: "eg-shimmer 1.8s ease infinite",
            }} />
          )}

          {/* Right-edge blend into info panel */}
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none", zIndex: 2,
            background: `
              linear-gradient(to left,  rgba(5,4,2,0.72) 0%, transparent 18%, transparent 85%, rgba(5,4,2,0.18) 100%),
              linear-gradient(to bottom, rgba(5,4,2,0.15) 0%, transparent 8%, transparent 88%, rgba(5,4,2,0.5) 100%)
            `,
          }} />

          {/* Purple arcade neon ambient tint */}
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none", zIndex: 2,
            background: "radial-gradient(ellipse 60% 50% at 35% 60%, rgba(139,92,246,0.05) 0%, transparent 65%)",
          }} />

          {/* "GALAXY GAMING · ARCADE" neon badge — top */}
          <div style={{
            position: "absolute", top: "0.9rem", left: "0.9rem", zIndex: 5,
            display: "flex", alignItems: "center", gap: "0.45rem",
            background: "rgba(5,4,2,0.78)",
            border: "1px solid rgba(249,115,22,0.22)",
            padding: "0.2rem 0.6rem",
            backdropFilter: "blur(8px)",
          }}>
            <div style={{
              width: "5px", height: "5px", borderRadius: "50%",
              background: "#F97316", animation: "eg-pulse 1.5s ease infinite",
            }} />
            <span style={{
              color: "rgba(249,115,22,0.88)", fontSize: "0.44rem",
              letterSpacing: "0.3em", textTransform: "uppercase", fontWeight: 700,
            }}>Galaxy Gaming · Arcade</span>
          </div>

          {/* Crowd stat — bottom-left */}
          <div style={{
            position: "absolute", bottom: "0.9rem", left: "0.9rem", zIndex: 5,
            display: "flex", alignItems: "center", gap: "0.48rem",
            background: "rgba(5,4,2,0.78)",
            border: "1px solid rgba(201,168,76,0.2)",
            padding: "0.22rem 0.6rem",
            backdropFilter: "blur(8px)",
          }}>
            <div style={{
              width: "4px", height: "4px", borderRadius: "50%",
              background: "#C9A84C", animation: "eg-pulse 2s ease infinite",
            }} />
            <div style={{ display: "flex", flexDirection: "column", gap: "0.05rem" }}>
              <span style={{
                color: "#C9A84C", fontSize: "0.54rem", fontWeight: 800,
                letterSpacing: "0.05em", lineHeight: 1,
              }}>3K+ Daily Players</span>
              <span style={{
                color: "rgba(255,255,255,0.22)", fontSize: "0.37rem",
                letterSpacing: "0.12em", textTransform: "uppercase",
              }}>MOA Gaming Floor</span>
            </div>
          </div>

          {/* Back link — bottom right of image */}
          <a href="/events" style={{
            position: "absolute", bottom: "0.9rem", right: "0.9rem", zIndex: 5,
            display: "flex", alignItems: "center", gap: "0.3rem",
            color: "rgba(201,168,76,0.38)",
            fontSize: "clamp(0.35rem,0.54vw,0.44rem)",
            letterSpacing: "0.26em", textTransform: "uppercase", fontWeight: 700,
            textDecoration: "none",
            background: "rgba(5,4,2,0.6)",
            border: "1px solid rgba(201,168,76,0.13)",
            padding: "0.18rem 0.44rem",
            backdropFilter: "blur(6px)",
            transition: "color 0.18s ease, border-color 0.18s ease",
          }}
            onMouseEnter={e => { e.currentTarget.style.color = "#C9A84C"; e.currentTarget.style.borderColor = "rgba(201,168,76,0.35)"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "rgba(201,168,76,0.38)"; e.currentTarget.style.borderColor = "rgba(201,168,76,0.13)"; }}
          >
            <span style={{ fontSize: "0.54rem" }}>←</span> All Events
          </a>

          {/* Corner brackets */}
          {(["tl", "tr", "bl", "br"] as const).map(p => (
            <Bracket key={p} pos={p} color="rgba(249,115,22,0.18)" size={10} />
          ))}
        </div>


        {/* ── RIGHT: Info panel ────────────────────────────── */}
        <div className="eg-right" style={{
          flexShrink: 0,
          width: "clamp(260px,36vw,460px)",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "clamp(0.9rem,2.2vh,1.8rem) clamp(1.4rem,3.5vw,3rem)",
          borderLeft: "1px solid rgba(201,168,76,0.08)",
          overflow: "hidden",
        }}>

          {/* ── TOP: tagline + description ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "clamp(0.45rem,1vh,0.75rem)" }}>

            {/* Subtitle pill */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
              <div style={{ width: "10px", height: "1px", background: "rgba(249,115,22,0.4)" }} />
              <span style={{
                color: "rgba(249,115,22,0.65)",
                fontSize: "clamp(0.38rem,0.62vw,0.48rem)",
                letterSpacing: "0.3em", textTransform: "uppercase", fontWeight: 700,
              }}>{EVENT.subtitle}</span>
            </div>

            <p style={{
              margin: 0,
              fontSize: "clamp(0.56rem,0.86vw,0.68rem)",
              fontStyle: "italic", fontWeight: 500,
              letterSpacing: "0.05em", lineHeight: 1.5,
              color: "rgba(201,168,76,0.6)",
            }}>"{EVENT.tagline}"</p>

            <p style={{
              color: "rgba(255,255,255,0.3)",
              fontSize: "clamp(0.54rem,0.8vw,0.64rem)",
              fontWeight: 400, margin: 0, lineHeight: 1.72,
            }}>{EVENT.description}</p>

            {/* Time strip */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <div style={{ width: "12px", height: "1px", background: "rgba(201,168,76,0.3)" }} />
              <span style={{
                color: "rgba(255,255,255,0.22)",
                fontSize: "clamp(0.4rem,0.62vw,0.5rem)",
                letterSpacing: "0.28em", textTransform: "uppercase", fontWeight: 600,
              }}>{EVENT.time}</span>
            </div>
          </div>

          {/* ── MIDDLE: Stats grid 2×2 ── */}
          <div className="eg-stats" style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "clamp(0.42rem,0.95vh,0.72rem)",
          }}>
            {STATS.map((s, i) => {
              const a = ACCENT[s.accent as AccentKey];
              return (
                <div key={i} style={{
                  padding: "clamp(0.44rem,0.95vh,0.68rem)",
                  border: "1px solid rgba(201,168,76,0.09)",
                  background: "rgba(201,168,76,0.02)",
                  display: "flex", flexDirection: "column", gap: "0.1rem",
                  position: "relative", overflow: "hidden",
                  transition: "border-color 0.2s ease",
                }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = a.dim)}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(201,168,76,0.09)")}
                >
                  {/* Corner accent */}
                  <div style={{
                    position: "absolute", top: 0, right: 0,
                    width: "28px", height: "1px",
                    background: `linear-gradient(to left, ${a.dim}, transparent)`,
                  }} />
                  <span style={{
                    color: a.full,
                    fontSize: "clamp(0.95rem,1.9vw,1.45rem)",
                    fontWeight: 800, letterSpacing: "0.02em", lineHeight: 1,
                  }}>{s.num}</span>
                  <span style={{
                    color: "rgba(255,255,255,0.24)",
                    fontSize: "clamp(0.37rem,0.56vw,0.44rem)",
                    letterSpacing: "0.24em", textTransform: "uppercase", fontWeight: 600,
                  }}>{s.label}</span>
                </div>
              );
            })}
          </div>

          {/* ── BOTTOM: Highlight cards 2×2 ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "clamp(0.28rem,0.65vh,0.48rem)" }}>
            {/* Header row */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{
                color: "rgba(201,168,76,0.36)",
                fontSize: "clamp(0.34rem,0.54vw,0.42rem)",
                letterSpacing: "0.4em", textTransform: "uppercase", fontWeight: 700,
              }}>Event Highlights</span>
              {/* Progress dots */}
              <div style={{ display: "flex", gap: "3px" }}>
                {HIGHLIGHTS.map((h, i) => (
                  <div key={i} onClick={() => handleActive(i)} style={{
                    width: active === i ? "12px" : "3px", height: "2px",
                    borderRadius: "1px",
                    background: active === i
                      ? (h.color === "ora" ? "#F97316" : "#C9A84C")
                      : "rgba(201,168,76,0.14)",
                    transition: "all 0.35s ease", cursor: "pointer",
                  }} />
                ))}
              </div>
            </div>

            {/* 2×2 highlight grid */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "clamp(0.28rem,0.6vh,0.45rem)",
            }}>
              {HIGHLIGHTS.map((h, i) => (
                <HighlightCard key={h.tag} item={h} active={active === i} onClick={() => handleActive(i)} />
              ))}
            </div>
          </div>
        </div>
      </div>


      {/* ════════════════════════════════════════
          ZONE 3 — FOOTER TICKER  (flexShrink: 0)
      ════════════════════════════════════════ */}
      <footer style={{
        flexShrink: 0,
        position: "relative", zIndex: 10,
        borderTop: "1px solid rgba(201,168,76,0.07)",
        opacity: mounted ? 1 : 0,
        transition: "opacity 1s ease 0.5s",
      }}>
        <Ticker items={TICKER_TAGS} />
      </footer>


      {/* ── Keyframes + responsive ── */}
      <style>{`
        @keyframes eg-pulse {
          0%,100% { opacity: 1; transform: scale(1); }
          50%      { opacity: 0.3; transform: scale(0.65); }
        }
        @keyframes eg-shimmer {
          0%   { background-position:  200% 0; }
          100% { background-position: -200% 0; }
        }
        @keyframes eg-ticker {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        /* ── Mobile: stack image top, info below ── */
        @media (max-width: 680px) {
          .eg-body { flex-direction: column !important; }

          /* Image gets fixed 42vh on mobile */
          .eg-img {
            flex: 0 0 42vh !important;
            width: 100% !important;
            height: 42vh !important;
          }
          .eg-img img {
            position: absolute !important;
            inset: 0 !important;
            width: 100% !important;
            height: 100% !important;
            object-fit: cover !important;
          }

          /* Info panel fills remaining space */
          .eg-right {
            width: 100% !important;
            flex: 1 1 0 !important;
            height: auto !important;
            border-left: none !important;
            border-top: 1px solid rgba(201,168,76,0.08) !important;
            padding: 0.75rem 1rem !important;
            overflow-y: auto !important;
          }

          /* Stats: 4-in-a-row on mobile */
          .eg-stats {
            grid-template-columns: repeat(4,1fr) !important;
            gap: 0.3rem !important;
          }
        }
      `}</style>
    </main>
  );
}