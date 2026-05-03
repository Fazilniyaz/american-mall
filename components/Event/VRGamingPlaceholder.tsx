"use client";

import { useEffect, useState, useCallback } from "react";


// ─── Constants ────────────────────────────────────────────────────────────────
const EVENT = {
  eyebrow: "Mall of America · Tech Events",
  route: "/events/tech/vrAndGamingZones",
  titleWhite: "VR & Gaming",
  titleGold: "Experience Zones",
  tagline: "Immersive Galaxy — Activated Across the Property",
  date: "April 20, 2024",
  time: "11:00 AM – 9:00 PM",
  location: "Central Atrium · Mall of America",
  description:
    "15K+ VR sessions. Full-scale demo pods. Live competitions broadcast across the atrium. Immersive Galaxy brought the future of gaming to Mall of America's center court — Oculus, HTC Vive, and next-gen titles all under one roof.",
};

const STATS = [
  { num: "15K+", unit: "", label: "VR Sessions" },
  { num: "8", unit: "pods", label: "Full-Scale Demo Pods" },
  { num: "500+", unit: "", label: "Live Competitors" },
  { num: "3", unit: "days", label: "Event Duration" },
];

const ZONES = [
  {
    id: "combat",
    label: "Combat Arena",
    tag: "OCULUS",
    color: "#C9A84C",
    desc: "Head-to-head VR combat in sealed pods. Haptic suits, 360° tracking.",
  },
  {
    id: "vive",
    label: "HTC Vive Studio",
    tag: "HTC VIVE",
    color: "#22d3ee",
    desc: "Room-scale demos with full lighthouse tracking and motion controllers.",
  },
  {
    id: "stage",
    label: "Live Stage",
    tag: "COMPETITION",
    color: "#C9A84C",
    desc: "Spectator-ready LED stage with live leaderboards & prize pool drops.",
  },
  {
    id: "galaxy",
    label: "Galaxy Mobile Hub",
    tag: "SAMSUNG",
    color: "#22d3ee",
    desc: "Galaxy S24 Ultra AR gaming previews & exclusive first-play access.",
  },
];

const TAGS = [
  "Oculus Quest", "HTC Vive", "Live Leaderboards",
  "AR Demos", "Prize Pool", "Immersive Galaxy", "Full-Scale Pods",
];

// ─── Corner bracket helper ────────────────────────────────────────────────────
function Bracket({
  pos, color = "rgba(201,168,76,0.32)", size = 11,
}: {
  pos: "tl" | "tr" | "bl" | "br";
  color?: string;
  size?: number;
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

// ─── Scan-line ticker ─────────────────────────────────────────────────────────
function ScanTicker({ items }: { items: string[] }) {
  return (
    <div style={{
      overflow: "hidden",
      position: "relative",
      height: "1.4rem",
      display: "flex",
      alignItems: "center",
    }}>
      <div style={{ animation: "vr-ticker 18s linear infinite", display: "flex", gap: "0", whiteSpace: "nowrap" }}>
        {[...items, ...items].map((t, i) => (
          <span key={i} style={{
            color: "rgba(201,168,76,0.22)",
            fontSize: "clamp(0.34rem,0.52vw,0.42rem)",
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            fontWeight: 700,
            padding: "0 clamp(0.6rem,1.4vw,1.1rem)",
            borderRight: "1px solid rgba(201,168,76,0.08)",
          }}>{t}</span>
        ))}
      </div>
    </div>
  );
}

// ─── Zone card ────────────────────────────────────────────────────────────────
function ZoneCard({
  zone, active, onClick,
}: {
  zone: typeof ZONES[0];
  active: boolean;
  onClick: () => void;
}) {
  const isBlue = zone.color === "#22d3ee";

  return (
    <button
      onClick={onClick}
      style={{
        background: active
          ? isBlue
            ? "rgba(34,211,238,0.07)"
            : "rgba(201,168,76,0.07)"
          : "transparent",
        border: `1px solid ${active ? zone.color : "rgba(201,168,76,0.1)"}`,
        padding: "clamp(0.5rem,1.1vh,0.8rem) clamp(0.6rem,1.2vw,0.9rem)",
        cursor: "pointer",
        textAlign: "left",
        display: "flex",
        flexDirection: "column",
        gap: "0.22rem",
        transition: "all 0.22s ease",
        position: "relative",
        overflow: "hidden",
      }}
      onMouseEnter={e => {
        if (!active) e.currentTarget.style.borderColor = "rgba(201,168,76,0.3)";
      }}
      onMouseLeave={e => {
        if (!active) e.currentTarget.style.borderColor = "rgba(201,168,76,0.1)";
      }}
    >
      {/* Active glow bar — top edge */}
      {active && (
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0,
          height: "1.5px",
          background: `linear-gradient(to right, transparent, ${zone.color}, transparent)`,
        }} />
      )}

      {/* Tag + label row */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
        <span style={{
          color: active ? zone.color : "rgba(201,168,76,0.35)",
          fontSize: "clamp(0.36rem,0.56vw,0.44rem)",
          letterSpacing: "0.32em",
          textTransform: "uppercase",
          fontWeight: 700,
          border: `1px solid ${active ? zone.color : "rgba(201,168,76,0.15)"}`,
          padding: "0.04rem 0.22rem",
          flexShrink: 0,
          transition: "all 0.22s ease",
        }}>{zone.tag}</span>
        <span style={{
          color: active ? "#ffffff" : "rgba(255,255,255,0.5)",
          fontSize: "clamp(0.5rem,0.78vw,0.6rem)",
          fontWeight: 700,
          letterSpacing: "0.04em",
          fontFamily: "var(--font-montserrat, 'Montserrat', sans-serif)",
          transition: "color 0.22s ease",
        }}>{zone.label}</span>
      </div>

      {/* Description — only show when active */}
      <p style={{
        color: "rgba(255,255,255,0.28)",
        fontSize: "clamp(0.4rem,0.62vw,0.5rem)",
        margin: 0,
        lineHeight: 1.6,
        letterSpacing: "0.03em",
        fontFamily: "var(--font-montserrat, 'Montserrat', sans-serif)",
        maxHeight: active ? "3rem" : "0",
        overflow: "hidden",
        opacity: active ? 1 : 0,
        transition: "all 0.3s ease",
      }}>{zone.desc}</p>
    </button>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function VRAndGamingZonesPage() {
  const [mounted, setMounted] = useState(false);
  const [activeZone, setActiveZone] = useState(0);

  // Mount gate — one rAF tick so background paints first
  useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  // Auto-cycle zones
  useEffect(() => {
    const id = setInterval(() => setActiveZone(i => (i + 1) % ZONES.length), 3800);
    return () => clearInterval(id);
  }, []);

  const handleZone = useCallback((i: number) => setActiveZone(i), []);

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
      fontFamily: "var(--font-montserrat, 'Montserrat', sans-serif)",
    }}>

      {/* ── Deep atmosphere layers ── */}
      {/* Blue neon from the VR image bleeds into the right side */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none",
        background: `
          radial-gradient(ellipse 55% 60% at 82% 55%, rgba(34,211,238,0.05) 0%, transparent 60%),
          radial-gradient(ellipse 35% 40% at 18% 70%, rgba(201,168,76,0.05) 0%, transparent 52%),
          radial-gradient(ellipse 25% 30% at 60% 10%, rgba(139,92,246,0.03) 0%, transparent 50%)
        `,
      }} />

      {/* Grain */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", opacity: 0.02,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundSize: "200px 200px",
      }} />

      {/* Outer corner brackets */}
      {(["tl", "tr", "bl", "br"] as const).map(p => <Bracket key={p} pos={p} />)}


      {/* ════════════════════════════════════════
          ZONE 1 — HEADER  (flexShrink: 0)
      ════════════════════════════════════════ */}
      <header style={{
        flexShrink: 0,
        position: "relative", zIndex: 10,
        padding: "clamp(0.75rem,1.7vh,1.3rem) clamp(1.4rem,4vw,3.5rem) clamp(0.4rem,0.9vh,0.7rem)",
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
            <div style={{ width: "18px", height: "1px", background: "#C9A84C", opacity: 0.5 }} />
            <span style={{
              color: "#C9A84C",
              fontSize: "clamp(0.37rem,0.65vw,0.47rem)",
              letterSpacing: "0.44em", textTransform: "uppercase", fontWeight: 700,
            }}>{EVENT.eyebrow}</span>
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: "0.4em", flexWrap: "wrap" }}>
            <h1 style={{
              color: "#fff",
              fontSize: "clamp(1.1rem,2.6vw,2.1rem)",
              fontWeight: 900, letterSpacing: "0.02em",
              textTransform: "uppercase", lineHeight: 1, margin: 0,
            }}>{EVENT.titleWhite}</h1>
            <h1 style={{
              color: "#C9A84C",
              fontSize: "clamp(1.1rem,2.6vw,2.1rem)",
              fontWeight: 900, letterSpacing: "0.02em",
              textTransform: "uppercase", lineHeight: 1, margin: 0,
              textShadow: "0 0 40px rgba(201,168,76,0.22)",
            }}>{EVENT.titleGold}</h1>
          </div>
        </div>

        {/* Right: date pill + live tag */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.2rem", flexShrink: 0 }}>
          <div style={{
            display: "flex", alignItems: "center", gap: "0.55rem",
          }}>
            {/* Cyan "LIVE" badge */}
            <div style={{
              display: "flex", alignItems: "center", gap: "0.28rem",
              background: "rgba(34,211,238,0.08)",
              border: "1px solid rgba(34,211,238,0.25)",
              padding: "0.18rem 0.5rem",
            }}>
              <div style={{
                width: "4px", height: "4px", borderRadius: "50%",
                background: "#22d3ee", animation: "vr-pulse 1.6s ease infinite",
              }} />
              <span style={{
                color: "#22d3ee", fontSize: "clamp(0.38rem,0.6vw,0.46rem)",
                letterSpacing: "0.3em", textTransform: "uppercase", fontWeight: 700,
              }}>Immersive</span>
            </div>
            {/* Date */}
            <div style={{
              display: "flex", alignItems: "center", gap: "0.3rem",
              background: "rgba(201,168,76,0.07)",
              border: "1px solid rgba(201,168,76,0.18)",
              padding: "0.18rem 0.6rem",
            }}>
              <div style={{
                width: "4px", height: "4px", borderRadius: "50%",
                background: "#C9A84C", animation: "vr-pulse 2s ease infinite",
              }} />
              <span style={{
                color: "#C9A84C", fontSize: "clamp(0.38rem,0.6vw,0.46rem)",
                letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 700,
              }}>{EVENT.date}</span>
            </div>
          </div>
          <span style={{
            color: "rgba(255,255,255,0.2)", fontSize: "clamp(0.36rem,0.56vw,0.44rem)",
            letterSpacing: "0.12em", textTransform: "uppercase",
          }}>{EVENT.location}</span>
        </div>
      </header>


      {/* ════════════════════════════════════════
          ZONE 2 — BODY  (flex:1, minHeight:0)
      ════════════════════════════════════════ */}
      <div className="vr-body" style={{
        flex: 1,
        minHeight: 0,
        position: "relative", zIndex: 10,
        display: "flex",
        flexDirection: "row",
        opacity: mounted ? 1 : 0,
        transition: "opacity 0.9s ease 0.12s",
      }}>

        {/* ── LEFT INFO PANEL ──────────────────────────────── */}
        <div className="vr-left" style={{
          flexShrink: 0,
          width: "clamp(260px,35vw,450px)",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "clamp(0.8rem,2vh,1.6rem) clamp(1.4rem,3.5vw,3rem)",
          borderRight: "1px solid rgba(201,168,76,0.08)",
          overflow: "hidden",
        }}>

          {/* ── TOP: tagline + description + time ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "clamp(0.45rem,1vh,0.75rem)" }}>

            {/* Tagline with cyan accent */}
            <p style={{
              margin: 0,
              fontSize: "clamp(0.54rem,0.82vw,0.65rem)",
              fontStyle: "italic",
              fontWeight: 500,
              letterSpacing: "0.05em",
              lineHeight: 1.5,
              background: "linear-gradient(90deg, #C9A84C 0%, #22d3ee 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
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
                color: "rgba(255,255,255,0.25)",
                fontSize: "clamp(0.4rem,0.62vw,0.5rem)",
                letterSpacing: "0.28em", textTransform: "uppercase", fontWeight: 600,
              }}>{EVENT.time}</span>
            </div>
          </div>

          {/* ── MIDDLE: Stats grid ── */}
          <div className="vr-stats" style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "clamp(0.45rem,1vh,0.75rem)",
          }}>
            {STATS.map((s, i) => (
              <div key={i} style={{
                padding: "clamp(0.45rem,1vh,0.7rem)",
                border: "1px solid rgba(201,168,76,0.09)",
                background: "rgba(201,168,76,0.025)",
                display: "flex", flexDirection: "column", gap: "0.12rem",
                position: "relative", overflow: "hidden",
                transition: "border-color 0.2s ease",
              }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(201,168,76,0.28)")}
                onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(201,168,76,0.09)")}
              >
                {/* Subtle diagonal line decoration */}
                <div style={{
                  position: "absolute", top: 0, right: 0,
                  width: "30px", height: "1px",
                  background: `linear-gradient(to left, rgba(34,211,238,0.12), transparent)`,
                  transform: "rotate(0deg)",
                }} />
                <div style={{ display: "flex", alignItems: "baseline", gap: "0.2em" }}>
                  <span style={{
                    color: i % 2 === 0 ? "#C9A84C" : "#22d3ee",
                    fontSize: "clamp(0.95rem,1.9vw,1.45rem)",
                    fontWeight: 800, letterSpacing: "0.02em", lineHeight: 1,
                  }}>{s.num}</span>
                  {s.unit && (
                    <span style={{
                      color: i % 2 === 0 ? "rgba(201,168,76,0.45)" : "rgba(34,211,238,0.45)",
                      fontSize: "clamp(0.4rem,0.62vw,0.5rem)",
                      fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em",
                    }}>{s.unit}</span>
                  )}
                </div>
                <span style={{
                  color: "rgba(255,255,255,0.25)",
                  fontSize: "clamp(0.38rem,0.58vw,0.46rem)",
                  letterSpacing: "0.24em", textTransform: "uppercase", fontWeight: 600,
                }}>{s.label}</span>
              </div>
            ))}
          </div>

          {/* ── BOTTOM: Zone selector ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "clamp(0.3rem,0.7vh,0.5rem)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.1rem" }}>
              <span style={{
                color: "rgba(201,168,76,0.38)",
                fontSize: "clamp(0.36rem,0.56vw,0.44rem)",
                letterSpacing: "0.4em", textTransform: "uppercase", fontWeight: 700,
              }}>Experience Zones</span>
              {/* Dot indicators */}
              <div style={{ display: "flex", gap: "3px" }}>
                {ZONES.map((z, i) => (
                  <div key={i} onClick={() => handleZone(i)} style={{
                    width: activeZone === i ? "12px" : "3px",
                    height: "2px", borderRadius: "1px",
                    background: activeZone === i
                      ? (z.color === "#22d3ee" ? "#22d3ee" : "#C9A84C")
                      : "rgba(201,168,76,0.15)",
                    transition: "all 0.35s ease", cursor: "pointer",
                  }} />
                ))}
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(0.28rem,0.6vh,0.45rem)" }}>
              {ZONES.map((z, i) => (
                <ZoneCard key={z.id} zone={z} active={activeZone === i} onClick={() => handleZone(i)} />
              ))}
            </div>
          </div>
        </div>


        {/* ── RIGHT IMAGE PANEL ────────────────────────────── */}
        <div className="vr-right" style={{
          flex: 1,
          minWidth: 0,
          height: "100%",
          position: "relative",
          overflow: "hidden",
          background: "#060504",
        }}>

          {/* Image — CSS fade-in on load, no JS state needed */}
          <img
            src="/photos/events/VR.webp"
            alt="VR & Gaming Experience Zones at Mall of America"
            className="vr-hero-img"
            style={{
              width: "100%", height: "100%",
              objectFit: "cover", objectPosition: "center 30%",
              display: "block", userSelect: "none",
            }}
          />

          {/* Left blend gradient */}
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none", zIndex: 2,
            background: `
              linear-gradient(to right,  rgba(5,4,2,0.7) 0%, transparent 16%, transparent 88%, rgba(5,4,2,0.2) 100%),
              linear-gradient(to bottom, rgba(5,4,2,0.15) 0%, transparent 8%, transparent 88%, rgba(5,4,2,0.45) 100%)
            `,
          }} />

          {/* Cyan neon tint */}
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none", zIndex: 2,
            background: "radial-gradient(ellipse 65% 55% at 55% 60%, rgba(34,211,238,0.04) 0%, transparent 65%)",
          }} />

          {/* Scan line — pure CSS animation, zero JS re-renders */}
          <div className="vr-scan-line" style={{ position: "absolute", left: 0, right: 0, zIndex: 3, height: "1px", pointerEvents: "none" }} />

          {/* "LIVE VR COMPETITION" banner — mirrors image's own banner */}
          <div style={{
            position: "absolute", top: "0.9rem", left: "0.9rem", zIndex: 5,
            display: "flex", alignItems: "center", gap: "0.4rem",
            background: "rgba(5,4,2,0.78)",
            border: "1px solid rgba(34,211,238,0.22)",
            padding: "0.2rem 0.55rem",
            backdropFilter: "blur(8px)",
          }}>
            <div style={{
              width: "5px", height: "5px", borderRadius: "50%",
              background: "#22d3ee", animation: "vr-pulse 1.6s ease infinite",
            }} />
            <span style={{
              color: "rgba(34,211,238,0.85)", fontSize: "0.44rem",
              letterSpacing: "0.3em", textTransform: "uppercase", fontWeight: 700,
            }}>Live VR Competition</span>
          </div>

          {/* Sessions counter badge — bottom left */}
          <div style={{
            position: "absolute", bottom: "0.9rem", left: "0.9rem", zIndex: 5,
            display: "flex", alignItems: "center", gap: "0.5rem",
            background: "rgba(5,4,2,0.78)",
            border: "1px solid rgba(201,168,76,0.2)",
            padding: "0.22rem 0.6rem",
            backdropFilter: "blur(8px)",
          }}>
            <div style={{
              width: "4px", height: "4px", borderRadius: "50%",
              background: "#C9A84C", animation: "vr-pulse 2s ease infinite",
            }} />
            <div style={{ display: "flex", flexDirection: "column", gap: "0.06rem" }}>
              <span style={{
                color: "#C9A84C", fontSize: "0.56rem", fontWeight: 800,
                letterSpacing: "0.06em", lineHeight: 1,
              }}>15K+ VR Sessions</span>
              <span style={{
                color: "rgba(255,255,255,0.25)", fontSize: "0.38rem",
                letterSpacing: "0.12em", textTransform: "uppercase",
              }}>Full-Scale Demo Pods</span>
            </div>
          </div>

          {/* Back to events — bottom right */}
          <a href="/events" style={{
            position: "absolute", bottom: "0.9rem", right: "0.9rem", zIndex: 5,
            display: "flex", alignItems: "center", gap: "0.3rem",
            color: "rgba(201,168,76,0.4)",
            fontSize: "clamp(0.36rem,0.55vw,0.45rem)",
            letterSpacing: "0.26em", textTransform: "uppercase", fontWeight: 700,
            textDecoration: "none",
            background: "rgba(5,4,2,0.6)",
            border: "1px solid rgba(201,168,76,0.14)",
            padding: "0.18rem 0.45rem",
            backdropFilter: "blur(6px)",
            transition: "color 0.18s ease, border-color 0.18s ease",
          }}
            onMouseEnter={e => {
              e.currentTarget.style.color = "#C9A84C";
              e.currentTarget.style.borderColor = "rgba(201,168,76,0.35)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = "rgba(201,168,76,0.4)";
              e.currentTarget.style.borderColor = "rgba(201,168,76,0.14)";
            }}
          >
            <span style={{ fontSize: "0.55rem" }}>←</span> All Events
          </a>

          {/* Corner brackets on image */}
          {(["tl", "tr", "bl", "br"] as const).map(pos => (
            <Bracket key={pos} pos={pos} color="rgba(34,211,238,0.2)" size={10} />
          ))}
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
        <ScanTicker items={TAGS} />
      </footer>


      {/* ── Keyframes ── */}
      <style>{`
        @keyframes vr-pulse {
          0%,100% { opacity: 1; transform: scale(1); }
          50%      { opacity: 0.3; transform: scale(0.65); }
        }
        @keyframes vr-ticker {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        /* Scan line: GPU-only CSS animation — replaces 60fps setScanY rAF loop */
        @keyframes vr-scan {
          0%   { top: 0%; }
          100% { top: 100%; }
        }
        .vr-scan-line {
          animation: vr-scan 6s linear infinite;
          background: linear-gradient(to right, transparent 0%, rgba(34,211,238,0.18) 20%, rgba(34,211,238,0.35) 50%, rgba(34,211,238,0.18) 80%, transparent 100%);
        }
        /* Image fades in via CSS once loaded */
        .vr-hero-img {
          animation: vr-img-fade 1.1s ease forwards;
        }
        @keyframes vr-img-fade {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        /* ── Mobile ── */
        @media (max-width: 680px) {
          .vr-body { flex-direction: column !important; }

          .vr-left {
            width: 100% !important;
            height: auto !important;
            flex: 0 0 auto !important;
            border-right: none !important;
            border-bottom: 1px solid rgba(201,168,76,0.08) !important;
            padding: 0.75rem 1rem !important;
          }

          /* 4 stats in a single row on mobile */
          .vr-stats {
            grid-template-columns: repeat(4,1fr) !important;
            gap: 0.3rem !important;
          }

          /* Image panel fills remaining height */
          .vr-right {
            flex: 1 1 0 !important;
            width: 100% !important;
            min-height: 0 !important;
            height: auto !important;
          }
          .vr-right img {
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