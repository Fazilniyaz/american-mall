"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

// ─── Upcoming tech events data ────────────────────────────────────────────────
const TECH_EVENTS = [
  {
    brand: "Samsung",
    event: "Galaxy Unpacked",
    tag: "World Premiere",
    desc: "Galaxy Z Fold & Flip Series",
    accent: "#1428A0",
    dot: "#00c8f0",
  },
  {
    brand: "Apple",
    event: "Vision Pro Experience",
    tag: "AR / VR Demo",
    desc: "Spatial Computing Midwest",
    accent: "#f5f5f7",
    dot: "#C9A84C",
  },
  {
    brand: "Xbox",
    event: "Games Showcase",
    tag: "Gaming · Live",
    desc: "4K Zones · Early Access Titles",
    accent: "#107C10",
    dot: "#107C10",
  },
];

const STATS = [
  { val: "45K+", label: "Tech Event Attendees" },
  { val: "3", label: "Brand Partners" },
  { val: "22K+", label: "Opening Day Visitors" },
];

export default function EventTechPlaceholder() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [hovNext, setHovNext] = useState(false);
  const [hovBack, setHovBack] = useState(false);
  const [hovRow, setHovRow] = useState<number | null>(null);
  const particleRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  // ── Mount ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    const t = setTimeout(() => {
      setMounted(true);
      setTimeout(() => setVisible(true), 60);
    }, 80);
    return () => clearTimeout(t);
  }, []);

  // ── Particles ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = particleRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = (canvas.width = canvas.offsetWidth);
    let H = (canvas.height = canvas.offsetHeight);
    const onResize = () => {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", onResize);

    // Two particle types: gold dust + cyan tech sparks
    const dots = Array.from({ length: 55 }, (_, i) => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.3 + 0.2,
      vx: (Math.random() - 0.5) * 0.18,
      vy: (Math.random() - 0.5) * 0.18,
      a: Math.random() * 0.38 + 0.08,
      cyan: i % 7 === 0, // every 7th particle is cyan
    }));

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      dots.forEach((d) => {
        d.x += d.vx;
        d.y += d.vy;
        if (d.x < 0) d.x = W;
        if (d.x > W) d.x = 0;
        if (d.y < 0) d.y = H;
        if (d.y > H) d.y = 0;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = d.cyan
          ? `rgba(0,200,240,${d.a * 0.55})`
          : `rgba(201,168,76,${d.a})`;
        ctx.fill();
      });
      rafRef.current = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const tr = (delay = 0) =>
    `opacity 0.75s ease ${delay}s, transform 0.85s cubic-bezier(0.22,1,0.36,1) ${delay}s`;

  return (
    <section
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        minHeight: "580px",
        background: "#050402",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        fontFamily: "var(--font-montserrat, 'Montserrat', sans-serif)",
      }}
    >
      {/* ══ BACKGROUND IMAGE ══════════════════════════════════════════════════ */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          opacity: imgLoaded ? 1 : 0,
          transition: "opacity 1.4s ease",
        }}
      >
        {mounted && (
          <Image
            src="/photos/tech_event.webp"
            alt="Samsung Galaxy Unpacked at Mall of America"
            fill
            priority
            sizes="100vw"
            style={{ objectFit: "cover", objectPosition: "center 30%" }}
            onLoad={() => setImgLoaded(true)}
          />
        )}
      </div>

      {/* Layered overlays — deep left + bottom for text legibility */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          background:
            "linear-gradient(110deg, rgba(5,4,2,0.97) 0%, rgba(5,4,2,0.78) 38%, rgba(5,4,2,0.25) 65%, rgba(0,8,18,0.15) 100%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "45%",
          zIndex: 1,
          background:
            "linear-gradient(to top, rgba(5,4,2,0.98) 0%, rgba(5,4,2,0.6) 55%, transparent 100%)",
          pointerEvents: "none",
        }}
      />
      {/* Cyan tech glow — top right, echoes the laser lights in the image */}
      <div
        style={{
          position: "absolute",
          top: "-10%",
          right: "-5%",
          width: "45vw",
          height: "55vh",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(0,180,230,0.07) 0%, transparent 68%)",
          zIndex: 1,
          pointerEvents: "none",
        }}
      />

      {/* Particles */}
      <canvas
        ref={particleRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          zIndex: 2,
          pointerEvents: "none",
          opacity: 0.7,
        }}
      />

      {/* Vertical gold rule */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: "18%",
          bottom: "18%",
          width: "2px",
          zIndex: 3,
          background:
            "linear-gradient(to bottom, transparent, #C9A84C 30%, #C9A84C 70%, transparent)",
          opacity: visible ? 0.3 : 0,
          transition: "opacity 1s ease 0.6s",
          pointerEvents: "none",
        }}
      />

      {/* Corner brackets */}
      {(["tl", "tr", "bl", "br"] as const).map((pos) => (
        <div
          key={pos}
          style={{
            position: "absolute",
            width: "24px",
            height: "24px",
            zIndex: 4,
            pointerEvents: "none",
            ...(pos.includes("t") ? { top: "10px" } : { bottom: "10px" }),
            ...(pos.includes("l") ? { left: "10px" } : { right: "10px" }),
            borderTop: pos.includes("t")
              ? "1px solid rgba(201,168,76,0.25)"
              : "none",
            borderBottom: pos.includes("b")
              ? "1px solid rgba(201,168,76,0.25)"
              : "none",
            borderLeft: pos.includes("l")
              ? "1px solid rgba(201,168,76,0.25)"
              : "none",
            borderRight: pos.includes("r")
              ? "1px solid rgba(201,168,76,0.25)"
              : "none",
            opacity: visible ? 1 : 0,
            transition: "opacity 1s ease 0.3s",
          }}
        />
      ))}

      {/* ══ TOP BAR ════════════════════════════════════════════════════════════ */}
      <div
        style={{
          flexShrink: 0,
          height: "52px",
          zIndex: 5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 clamp(1.2rem,3.5vw,2.5rem)",
          borderBottom: "1px solid rgba(201,168,76,0.1)",
          opacity: visible ? 1 : 0,
          transition: tr(0),
        }}
      >
        {/* Left: Empty placeholder to maintain flex space-between */}
        <div style={{ width: "70px" }}></div>

        {/* Center title */}
        <div style={{ textAlign: "center" }}>
          <p
            style={{
              color: "#C9A84C",
              fontSize: "0.47rem",
              letterSpacing: "0.42em",
              textTransform: "uppercase",
              fontWeight: 700,
              margin: 0,
            }}
          >
            Section 05 · Events
          </p>
          <h1
            style={{
              color: "#fff",
              fontSize: "0.82rem",
              fontWeight: 800,
              margin: 0,
              lineHeight: 1,
              letterSpacing: "0.09em",
              textTransform: "uppercase",
            }}
          >
            Tech Events
          </h1>
        </div>

        {/* Slide counter */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
          <span style={{ color: "#C9A84C", fontSize: "0.68rem", fontWeight: 700 }}>05</span>
          <span style={{ color: "rgba(255,255,255,0.18)", fontSize: "0.62rem" }}>/ 08</span>
        </div>
      </div>

      {/* ══ MAIN BODY ═══════════════════════════════════════════════════════════ */}
      <div
        className="etp-body"
        style={{
          flex: 1,
          minHeight: 0,
          zIndex: 5,
          display: "grid",
          padding: "0 clamp(1.2rem,3.5vw,2.5rem)",
        }}
      >
        {/* ── LEFT: hero copy ──────────────────────────────────────────────── */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            paddingRight: "clamp(1rem,2vw,2rem)",
            borderRight: "1px solid rgba(201,168,76,0.08)",
            gap: 0,
          }}
        >
          {/* Eyebrow */}
          <p
            style={{
              color: "rgba(0,200,240,0.85)",
              fontSize: "0.55rem",
              letterSpacing: "0.42em",
              textTransform: "uppercase",
              fontWeight: 700,
              margin: "0 0 0.6rem",
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(14px)",
              transition: tr(0.15),
            }}
          >
            Tech Events · Mall of America
          </p>

          {/* Headline */}
          <h2
            style={{
              color: "#fff",
              fontWeight: 900,
              fontSize: "clamp(2rem,4.5vw,4rem)",
              lineHeight: 1.0,
              letterSpacing: "0.03em",
              textTransform: "uppercase",
              margin: "0 0 0.15rem",
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(20px)",
              transition: tr(0.22),
            }}
          >
            Where Brands
          </h2>
          <h2
            style={{
              color: "#C9A84C",
              fontWeight: 900,
              fontSize: "clamp(2rem,4.5vw,4rem)",
              lineHeight: 1.0,
              letterSpacing: "0.03em",
              textTransform: "uppercase",
              margin: "0 0 1rem",
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(20px)",
              transition: tr(0.3),
            }}
          >
            Launch Futures
          </h2>

          {/* Animated divider */}
          <div
            style={{
              width: visible ? "clamp(50px,8vw,80px)" : "0px",
              height: "2px",
              background: "linear-gradient(to right, #C9A84C, rgba(0,200,240,0.5), transparent)",
              marginBottom: "1rem",
              transition: "width 1s ease 0.5s",
            }}
          />

          {/* Description */}
          <p
            style={{
              color: "rgba(255,255,255,0.42)",
              fontSize: "clamp(0.68rem,1.1vw,0.8rem)",
              lineHeight: 1.75,
              fontWeight: 400,
              margin: "0 0 1.3rem",
              maxWidth: "360px",
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(12px)",
              transition: tr(0.4),
            }}
          >
            World-class product launches, immersive demos, and brand
            activations — right inside America's most visited mall.
            Samsung, Apple, Xbox and more choose our stage.
          </p>

          {/* Stats row */}
          <div
            style={{
              display: "flex",
              gap: "clamp(1rem,3vw,2rem)",
              flexWrap: "wrap",
            }}
          >
            {STATS.map((s, i) => (
              <div
                key={s.val}
                style={{
                  borderLeft: "2px solid #C9A84C",
                  paddingLeft: "0.75rem",
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0)" : "translateY(10px)",
                  transition: tr(0.48 + i * 0.1),
                }}
              >
                <div
                  style={{
                    color: "#C9A84C",
                    fontSize: "clamp(1rem,2vw,1.4rem)",
                    fontWeight: 800,
                    lineHeight: 1,
                  }}
                >
                  {s.val}
                </div>
                <div
                  style={{
                    color: "rgba(255,255,255,0.28)",
                    fontSize: "0.48rem",
                    fontWeight: 600,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    marginTop: "2px",
                  }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          {/* "Coming soon" note */}
          <div
            style={{
              marginTop: "1.4rem",
              display: "flex",
              alignItems: "center",
              gap: "0.55rem",
              opacity: visible ? 0.6 : 0,
              transition: "opacity 1s ease 0.9s",
            }}
          >
            <div
              style={{
                width: "5px",
                height: "5px",
                background: "rgba(0,200,240,0.85)",
                animation: "etpPulse 2s ease-in-out infinite",
              }}
            />
            <span
              style={{
                color: "rgba(255,255,255,0.35)",
                fontSize: "0.5rem",
                fontWeight: 600,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
              }}
            >
              Detailed case studies below
            </span>
          </div>
        </div>

        {/* ── RIGHT: upcoming events list ──────────────────────────────────── */}
        <div
          className="etp-right"
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            paddingLeft: "clamp(1rem,2vw,2rem)",
            gap: "0.5rem",
          }}
        >
          {/* Label */}
          <p
            style={{
              color: "rgba(255,255,255,0.18)",
              fontSize: "0.48rem",
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              fontWeight: 600,
              margin: "0 0 0.25rem",
            }}
          >
            Featured events
          </p>

          {/* Event rows */}
          {TECH_EVENTS.map((ev, i) => (
            <div
              key={ev.brand}
              onMouseEnter={() => setHovRow(i)}
              onMouseLeave={() => setHovRow(null)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.85rem",
                padding: "0.75rem 0.9rem",
                background:
                  hovRow === i
                    ? "rgba(201,168,76,0.07)"
                    : "rgba(255,255,255,0.02)",
                border: `1px solid ${hovRow === i ? "rgba(201,168,76,0.4)" : "rgba(201,168,76,0.09)"}`,
                cursor: "default",
                transition: "all 0.22s ease",
                opacity: visible ? 1 : 0,
                transform: visible ? "translateX(0)" : "translateX(20px)",
              }}
              // staggered entrance via inline style hack
              ref={(el) => {
                if (el) {
                  el.style.transitionDelay = visible
                    ? `${0.3 + i * 0.12}s`
                    : "0s";
                }
              }}
            >
              {/* Color dot */}
              <div
                style={{
                  width: "6px",
                  height: "6px",
                  flexShrink: 0,
                  background: ev.dot,
                  boxShadow: hovRow === i ? `0 0 8px ${ev.dot}` : "none",
                  transition: "box-shadow 0.22s ease",
                }}
              />

              {/* Text */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: "0.5rem",
                    marginBottom: "2px",
                  }}
                >
                  <span
                    style={{
                      color: hovRow === i ? "#F0D988" : "#fff",
                      fontSize: "0.68rem",
                      fontWeight: 700,
                      letterSpacing: "0.06em",
                      transition: "color 0.22s ease",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {ev.brand}
                  </span>
                  <span
                    style={{
                      color: "rgba(255,255,255,0.3)",
                      fontSize: "0.55rem",
                      fontWeight: 500,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {ev.event}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                  }}
                >
                  <span
                    style={{
                      color: "rgba(201,168,76,0.6)",
                      fontSize: "0.47rem",
                      fontWeight: 600,
                      letterSpacing: "0.16em",
                      textTransform: "uppercase",
                    }}
                  >
                    {ev.tag}
                  </span>
                  <span style={{ color: "rgba(255,255,255,0.1)", fontSize: "0.4rem" }}>·</span>
                  <span
                    style={{
                      color: "rgba(255,255,255,0.22)",
                      fontSize: "0.47rem",
                      fontWeight: 400,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {ev.desc}
                  </span>
                </div>
              </div>

              {/* Arrow */}
              <svg
                viewBox="0 0 12 12"
                width="9"
                height="9"
                fill="none"
                style={{
                  flexShrink: 0,
                  opacity: hovRow === i ? 1 : 0.3,
                  transform: hovRow === i ? "translateX(2px)" : "translateX(0)",
                  transition: "all 0.22s ease",
                }}
              >
                <path
                  d="M3 6h6M6 3l3 3-3 3"
                  stroke="#C9A84C"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          ))}

          {/* Divider */}
          <div
            style={{
              height: "1px",
              background:
                "linear-gradient(to right, rgba(201,168,76,0.2), transparent)",
              margin: "0.3rem 0",
            }}
          />

          {/* CTA */}
          <button
            onClick={() => router.push("/events/stats")}
            onMouseEnter={() => setHovNext(true)}
            onMouseLeave={() => setHovNext(false)}
            style={{
              background: hovNext ? "#C9A84C" : "transparent",
              border: "1px solid rgba(201,168,76,0.35)",
              padding: "0.72rem 1rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "0.8rem",
              transition: "all 0.28s ease",
              opacity: visible ? 1 : 0,
              transition2: "opacity 1s ease 0.85s",
            } as React.CSSProperties}
          >
            <div>
              <div
                style={{
                  color: hovNext ? "#050402" : "#C9A84C",
                  fontSize: "0.58rem",
                  fontWeight: 700,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  transition: "color 0.25s ease",
                }}
              >
                View Event Stats
              </div>
              <div
                style={{
                  color: hovNext
                    ? "rgba(5,4,2,0.5)"
                    : "rgba(255,255,255,0.22)",
                  fontSize: "0.47rem",
                  fontWeight: 500,
                  letterSpacing: "0.1em",
                  marginTop: "1px",
                  transition: "color 0.25s ease",
                }}
              >
                45K+ attendees · 3 major brands
              </div>
            </div>
            <svg
              viewBox="0 0 16 16"
              width="13"
              height="13"
              fill="none"
            >
              <path
                d="M4 8h8M9 5l3 3-3 3"
                stroke={hovNext ? "#050402" : "#C9A84C"}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ transition: "stroke 0.25s" }}
              />
            </svg>
          </button>
        </div>
      </div>

      {/* ══ BOTTOM STATUS BAR ═══════════════════════════════════════════════════ */}
      <div
        style={{
          flexShrink: 0,
          height: "38px",
          zIndex: 5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 clamp(1.2rem,3.5vw,2.5rem)",
          borderTop: "1px solid rgba(201,168,76,0.08)",
          opacity: visible ? 1 : 0,
          transition: "opacity 0.9s ease 0.3s",
        }}
      >
        {/* Live indicator */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div
            style={{
              width: "5px",
              height: "5px",
              background: "rgba(0,200,240,0.85)",
              animation: "etpPulse 2s ease-in-out infinite",
            }}
          />
          <span
            style={{
              color: "rgba(255,255,255,0.28)",
              fontSize: "0.48rem",
              fontWeight: 600,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
            }}
          >
            Tech Events Overview
          </span>
        </div>

        {/* Center: inline stats */}
        <div
          className="etp-bstats"
          style={{ display: "flex", alignItems: "center", gap: "2rem" }}
        >
          {STATS.map((s) => (
            <div
              key={s.val}
              style={{ display: "flex", alignItems: "baseline", gap: "0.3rem" }}
            >
              <span
                style={{
                  color: "#C9A84C",
                  fontSize: "clamp(0.68rem,1.1vw,0.8rem)",
                  fontWeight: 800,
                }}
              >
                {s.val}
              </span>
              <span
                style={{
                  color: "rgba(255,255,255,0.18)",
                  fontSize: "0.44rem",
                  fontWeight: 600,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                }}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* Right: brand names */}
        <span
          style={{
            color: "rgba(201,168,76,0.4)",
            fontSize: "0.48rem",
            fontWeight: 600,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
          }}
        >
          Samsung · Apple · Xbox
        </span>
      </div>

      {/* ══ STYLES ══════════════════════════════════════════════════════════════ */}
      <style>{`
        .etp-body {
          grid-template-columns: 1fr;
        }
        .etp-right   { display: none !important; }
        .etp-bstats  { display: none !important; }

        @media (min-width: 640px) {
          .etp-body  { grid-template-columns: 1fr 220px; }
          .etp-right { display: flex !important; }
        }

        @media (min-width: 900px) {
          .etp-body   { grid-template-columns: 1fr 260px; }
          .etp-bstats { display: flex !important; }
        }

        @media (min-width: 1200px) {
          .etp-body { grid-template-columns: 1fr 300px; }
        }

        @keyframes etpPulse {
          0%, 100% { opacity: 0.4; transform: scale(0.85); }
          50%       { opacity: 1;   transform: scale(1.2);  }
        }
      `}</style>
    </section>
  );
}