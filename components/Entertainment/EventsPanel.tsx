"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

// ─── Slide data ───────────────────────────────────────────────────────────────
const SLIDES = [
  {
    src: "/photos/event-hero-1.jpg",
    alt: "Live event production at Mall of America",
    overlay: "linear-gradient(120deg, rgba(5,4,2,0.92) 0%, rgba(5,4,2,0.55) 55%, rgba(5,4,2,0.18) 100%)",
  },
  {
    src: "/photos/event-hero-2.jpg",
    alt: "Samsung Galaxy Unpacked event arena",
    overlay: "linear-gradient(120deg, rgba(0,8,18,0.94) 0%, rgba(0,12,26,0.58) 55%, rgba(0,8,18,0.18) 100%)",
  },
  {
    src: "/photos/event-hero-3.jpg",
    alt: "Concert crowd energy at night event",
    overlay: "linear-gradient(120deg, rgba(12,4,0,0.93) 0%, rgba(8,2,0,0.58) 55%, rgba(5,4,2,0.18) 100%)",
  },
];

// ─── Event categories — sub-routes this slide links into ──────────────────────
const CATEGORIES = [
  {
    label: "Tech Events",
    sub: "Apple · Samsung · Xbox",
    href: "/events/tech",
    icon: (
      <svg viewBox="0 0 20 20" width="14" height="14" fill="none">
        <rect x="3" y="5" width="14" height="9" rx="1" stroke="#C9A84C" strokeWidth="1.2" />
        <path d="M7 14v2M13 14v2M5 16h10" stroke="#C9A84C" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: "Entertainment",
    sub: "Nike · Adidas · Gaming",
    href: "/events/entertainment",
    icon: (
      <svg viewBox="0 0 20 20" width="14" height="14" fill="none">
        <circle cx="10" cy="10" r="7" stroke="#C9A84C" strokeWidth="1.2" />
        <path d="M8 7.5l5 2.5-5 2.5V7.5z" fill="#C9A84C" />
      </svg>
    ),
  },
  {
    label: "Brand Activations",
    sub: "Pop-ups · Launches · PR",
    href: "/events/activations",
    icon: (
      <svg viewBox="0 0 20 20" width="14" height="14" fill="none">
        <path d="M10 3l2 4h4l-3 3 1 4-4-2-4 2 1-4-3-3h4l2-4z" stroke="#C9A84C" strokeWidth="1.2" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: "Event Stats",
    sub: "300+ events · 500K attendees",
    href: "/events/stats",
    icon: (
      <svg viewBox="0 0 20 20" width="14" height="14" fill="none">
        <path d="M3 15l4-5 4 3 3-6 3 4" stroke="#C9A84C" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

// ─── Key stats ────────────────────────────────────────────────────────────────
const STATS = [
  { val: "300+", label: "Annual Events" },
  { val: "500K+", label: "Attendees" },
  { val: "40M", label: "Witnesses" },
  { val: "20K", label: "Max Capacity" },
];

export default function EventsOverview() {
  const router = useRouter();
  const [slide, setSlide] = useState(0);
  const [prevSlide, setPrevSlide] = useState<number | null>(null);
  const [transitioning, setTransitioning] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [hovNext, setHovNext] = useState(false);
  const [hovBack, setHovBack] = useState(false);
  const [hovCat, setHovCat] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const particleRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  // ── Mount + entrance ────────────────────────────────────────────────────────
  useEffect(() => {
    const t = setTimeout(() => { setMounted(true); setTimeout(() => setVisible(true), 60); }, 80);
    return () => clearTimeout(t);
  }, []);

  // ── Auto-advance slides ─────────────────────────────────────────────────────
  useEffect(() => {
    timerRef.current = setInterval(() => advanceSlide(), 4800);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slide]);

  const advanceSlide = () => {
    if (transitioning) return;
    setTransitioning(true);
    setPrevSlide(slide);
    setSlide(p => (p + 1) % SLIDES.length);
    setTimeout(() => { setPrevSlide(null); setTransitioning(false); }, 900);
  };

  const goSlide = (i: number) => {
    if (i === slide || transitioning) return;
    if (timerRef.current) clearInterval(timerRef.current);
    setTransitioning(true);
    setPrevSlide(slide);
    setSlide(i);
    setTimeout(() => { setPrevSlide(null); setTransitioning(false); }, 900);
  };

  // ── Particle canvas ─────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = particleRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = canvas.width = canvas.offsetWidth;
    let H = canvas.height = canvas.offsetHeight;

    const onResize = () => { W = canvas.width = canvas.offsetWidth; H = canvas.height = canvas.offsetHeight; };
    window.addEventListener("resize", onResize);

    const dots = Array.from({ length: 45 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() * 1.2 + 0.2,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.15,
      a: Math.random() * 0.35 + 0.08,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      dots.forEach(d => {
        d.x += d.vx; d.y += d.vy;
        if (d.x < 0) d.x = W; if (d.x > W) d.x = 0;
        if (d.y < 0) d.y = H; if (d.y > H) d.y = 0;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201,168,76,${d.a})`;
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

  const ease = (s: boolean) => `opacity 0.6s ease${s ? "" : " 0.1s"}, transform 0.7s cubic-bezier(0.22,1,0.36,1)${s ? "" : " 0.1s"}`;

  return (
    <section style={{
      position: "relative",
      width: "100%",
      height: "100vh",
      minHeight: "580px",
      background: "#050402",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      fontFamily: "var(--font-montserrat, 'Montserrat', sans-serif)",
    }}>

      {/* ══ BACKGROUND SLIDESHOW ════════════════════════════════════════════════ */}
      {SLIDES.map((s, i) => (
        <div key={s.src} style={{
          position: "absolute", inset: 0, zIndex: 0,
          opacity: i === slide ? 1 : i === prevSlide ? 0 : 0,
          transition: "opacity 1s ease",
          pointerEvents: "none",
        }}>
          {mounted && (
            <Image
              src={s.src} alt={s.alt} fill
              priority={i === 0} loading={i === 0 ? "eager" : "lazy"}
              sizes="100vw"
              style={{ objectFit: "cover", objectPosition: "center 40%" }}
            />
          )}
          <div style={{ position: "absolute", inset: 0, background: s.overlay, zIndex: 1 }} />
        </div>
      ))}

      {/* Deep vignette bottom — ensures bottom UI always readable */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        height: "55%", zIndex: 1, pointerEvents: "none",
        background: "linear-gradient(to top, rgba(5,4,2,0.97) 0%, rgba(5,4,2,0.7) 50%, transparent 100%)",
      }} />

      {/* Particle layer */}
      <canvas ref={particleRef} style={{
        position: "absolute", inset: 0, width: "100%", height: "100%",
        zIndex: 2, pointerEvents: "none", opacity: 0.6,
      }} />

      {/* Vertical gold rule — left accent */}
      <div style={{
        position: "absolute", left: 0, top: "15%", bottom: "15%", width: "2px", zIndex: 3,
        background: "linear-gradient(to bottom, transparent, #C9A84C 30%, #C9A84C 70%, transparent)",
        opacity: visible ? 0.35 : 0, transition: "opacity 1s ease 0.5s",
        pointerEvents: "none",
      }} />

      {/* Corner brackets */}
      {(["tl", "tr", "bl", "br"] as const).map(pos => (
        <div key={pos} style={{
          position: "absolute", width: "24px", height: "24px", zIndex: 4, pointerEvents: "none",
          ...(pos.includes("t") ? { top: "10px" } : { bottom: "10px" }),
          ...(pos.includes("l") ? { left: "10px" } : { right: "10px" }),
          borderTop: pos.includes("t") ? "1px solid rgba(201,168,76,0.25)" : "none",
          borderBottom: pos.includes("b") ? "1px solid rgba(201,168,76,0.25)" : "none",
          borderLeft: pos.includes("l") ? "1px solid rgba(201,168,76,0.25)" : "none",
          borderRight: pos.includes("r") ? "1px solid rgba(201,168,76,0.25)" : "none",
          opacity: visible ? 1 : 0, transition: "opacity 1s ease 0.3s",
        }} />
      ))}

      {/* ══ TOP BAR ════════════════════════════════════════════════════════════ */}
      <div style={{
        flexShrink: 0, height: "52px", zIndex: 5,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 clamp(1.2rem,3.5vw,2.5rem)",
        borderBottom: "1px solid rgba(201,168,76,0.1)",
        opacity: visible ? 1 : 0, transition: ease(visible),
      }}>
        {/* Left: Empty placeholder to maintain flex space-between */}
        <div style={{ width: "70px" }}></div>

        {/* Center: section title */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.6rem", marginTop: "0.5rem" }}>
          <div style={{ color: "#C9A84C", fontSize: "0.9rem", lineHeight: 1 }}>◈</div>
          <h1 style={{ color: "#fff", fontSize: "0.75rem", fontWeight: 800, margin: 0, lineHeight: 1, letterSpacing: "0.15em", textTransform: "uppercase" }}>
            Events & Activations
          </h1>
        </div>

        {/* Right: slide counter */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
          <span style={{ color: "#C9A84C", fontSize: "0.68rem", fontWeight: 700 }}>05</span>
          <span style={{ color: "rgba(255,255,255,0.18)", fontSize: "0.62rem" }}>/ 08</span>
        </div>
      </div>

      {/* ══ MAIN BODY ═══════════════════════════════════════════════════════════ */}
      <div className="ev-body" style={{
        flex: 1, minHeight: 0, zIndex: 5,
        display: "grid",
        padding: "0 clamp(1.2rem,3.5vw,2.5rem)",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.9s ease 0.15s",
      }}>

        {/* ── LEFT COLUMN: hero copy ──────────────────────────────────────── */}
        <div style={{
          display: "flex", flexDirection: "column",
          justifyContent: "center", gap: "0",
          paddingRight: "clamp(1rem,2vw,2rem)",
          borderRight: "1px solid rgba(201,168,76,0.08)",
        }}>

          {/* Eyebrow */}
          <p style={{
            color: "#C9A84C", fontSize: "0.55rem", letterSpacing: "0.42em",
            textTransform: "uppercase", fontWeight: 700, margin: "0 0 0.7rem",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(16px)",
            transition: ease(visible),
          }}>
            Events & Activations
          </p>

          {/* Main headline */}
          <h2 style={{
            color: "#fff", fontWeight: 900, margin: "0 0 0.5rem",
            fontSize: "clamp(2rem,4.5vw,4rem)",
            lineHeight: 1.0, letterSpacing: "0.03em", textTransform: "uppercase",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(22px)",
            transition: `opacity 0.8s ease 0.2s, transform 0.9s cubic-bezier(0.22,1,0.36,1) 0.2s`,
          }}>
            America's
          </h2>
          <h2 style={{
            color: "#C9A84C", fontWeight: 900, margin: "0 0 1.2rem",
            fontSize: "clamp(2rem,4.5vw,4rem)",
            lineHeight: 1.0, letterSpacing: "0.03em", textTransform: "uppercase",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(22px)",
            transition: `opacity 0.8s ease 0.3s, transform 0.9s cubic-bezier(0.22,1,0.36,1) 0.3s`,
          }}>
            Biggest Stage
          </h2>

          {/* Divider */}
          <div style={{
            width: visible ? "clamp(50px,8vw,80px)" : "0px",
            height: "2px",
            background: "linear-gradient(to right, #C9A84C, transparent)",
            marginBottom: "1.1rem",
            transition: "width 0.9s ease 0.5s",
          }} />

          {/* Description */}
          <p style={{
            color: "rgba(255,255,255,0.45)", fontSize: "clamp(0.7rem,1.1vw,0.82rem)",
            lineHeight: 1.7, fontWeight: 400, margin: "0 0 1.4rem",
            maxWidth: "340px",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(14px)",
            transition: ease(visible),
          }}>
            300+ live events every year. World-class brand activations, tech launches,
            and entertainment spectacles — witnessed by 40 million visitors.
          </p>

          {/* Stats */}
          <div style={{
            display: "grid", gridTemplateColumns: "1fr 1fr",
            gap: "0.6rem 1.2rem",
          }}>
            {STATS.map((s, i) => (
              <div key={s.val} style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(12px)",
                transition: `opacity 0.7s ease ${0.45 + i * 0.08}s, transform 0.7s cubic-bezier(0.22,1,0.36,1) ${0.45 + i * 0.08}s`,
              }}>
                <div style={{
                  color: "#C9A84C", fontSize: "clamp(1rem,2vw,1.4rem)",
                  fontWeight: 800, lineHeight: 1, letterSpacing: "0.02em",
                }}>
                  {s.val}
                </div>
                <div style={{
                  color: "rgba(255,255,255,0.28)", fontSize: "0.5rem",
                  fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase",
                  marginTop: "2px",
                }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          {/* Slide dots */}
          <div style={{
            display: "flex", gap: "5px", marginTop: "1.4rem",
            opacity: visible ? 0.9 : 0, transition: "opacity 1s ease 0.8s",
          }}>
            {SLIDES.map((_, i) => (
              <button key={i} onClick={() => goSlide(i)} style={{
                width: i === slide ? "22px" : "5px", height: "5px",
                background: i === slide ? "#C9A84C" : "rgba(255,255,255,0.25)",
                border: "none", cursor: "pointer", padding: 0,
                transition: "all 0.35s ease",
              }} aria-label={`Slide ${i + 1}`} />
            ))}
          </div>
        </div>

        {/* ── RIGHT COLUMN: category navigation cards ──────────────────────── */}
        <div className="ev-right-col" style={{
          display: "flex", flexDirection: "column",
          justifyContent: "center", gap: "0.55rem",
          paddingLeft: "clamp(1rem,2vw,2rem)",
        }}>

          {/* Section micro-label */}
          <p style={{
            color: "rgba(255,255,255,0.18)", fontSize: "0.48rem", letterSpacing: "0.32em",
            textTransform: "uppercase", fontWeight: 600, margin: "0 0 0.3rem",
          }}>
            Explore events
          </p>

          {/* Category cards */}
          {CATEGORIES.map((cat, i) => (
            <button
              key={cat.label}
              onClick={() => router.push(cat.href)}
              onMouseEnter={() => setHovCat(i)}
              onMouseLeave={() => setHovCat(null)}
              style={{
                background: hovCat === i ? "rgba(201,168,76,0.08)" : "rgba(255,255,255,0.02)",
                border: `1px solid ${hovCat === i ? "rgba(201,168,76,0.45)" : "rgba(201,168,76,0.1)"}`,
                padding: "0.65rem 0.9rem",
                cursor: "pointer", textAlign: "left",
                display: "flex", alignItems: "center", gap: "0.7rem",
                transition: `opacity 0.7s ease ${0.3 + i * 0.1}s, transform 0.75s cubic-bezier(0.22,1,0.36,1) ${0.3 + i * 0.1}s, background 0.22s ease, border-color 0.22s ease`,
                opacity: visible ? 1 : 0,
                transform: visible ? "translateX(0)" : "translateX(18px)",
              }}
            >
              {/* Icon box */}
              <div style={{
                width: "30px", height: "30px", flexShrink: 0,
                background: hovCat === i ? "rgba(201,168,76,0.12)" : "rgba(201,168,76,0.06)",
                border: "1px solid rgba(201,168,76,0.18)",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "background 0.22s ease",
              }}>
                {cat.icon}
              </div>
              {/* Text */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  color: hovCat === i ? "#F0D988" : "#fff",
                  fontSize: "0.68rem", fontWeight: 700,
                  letterSpacing: "0.08em", textTransform: "uppercase",
                  transition: "color 0.22s ease",
                  whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                }}>
                  {cat.label}
                </div>
                <div style={{
                  color: "rgba(255,255,255,0.28)", fontSize: "0.5rem",
                  fontWeight: 500, letterSpacing: "0.06em", marginTop: "1px",
                  whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                }}>
                  {cat.sub}
                </div>
              </div>
              {/* Arrow */}
              <svg viewBox="0 0 12 12" width="10" height="10" fill="none" style={{
                flexShrink: 0,
                transform: hovCat === i ? "translateX(3px)" : "translateX(0)",
                transition: "transform 0.22s ease",
              }}>
                <path d="M3 6h6M6 3l3 3-3 3" stroke={hovCat === i ? "#C9A84C" : "rgba(201,168,76,0.35)"} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          ))}

          {/* CTA — proceed to next section */}
          <button
            onClick={() => router.push(window.innerWidth <= 767 ? "/events/tech" : "/events/stats")}
            onMouseEnter={() => setHovNext(true)}
            onMouseLeave={() => setHovNext(false)}
            style={{
              marginTop: "0.4rem",
              background: hovNext ? "#C9A84C" : "transparent",
              border: "1px solid rgba(201,168,76,0.35)",
              padding: "0.7rem 1rem",
              cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "space-between",
              gap: "0.8rem",
              transition: "all 0.28s ease",
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(10px)",
            }}
          >
            <div>
              <div style={{
                color: hovNext ? "#050402" : "#C9A84C",
                fontSize: "0.58rem", fontWeight: 700, letterSpacing: "0.22em",
                textTransform: "uppercase", transition: "color 0.25s ease",
              }}>
                View Event Stats
              </div>
              <div style={{
                color: hovNext ? "rgba(5,4,2,0.55)" : "rgba(255,255,255,0.25)",
                fontSize: "0.48rem", fontWeight: 500, letterSpacing: "0.1em",
                marginTop: "1px", transition: "color 0.25s ease",
              }}>
                300+ events · 500K attendees
              </div>
            </div>
            <svg viewBox="0 0 16 16" width="13" height="13" fill="none">
              <path d="M4 8h8M9 5l3 3-3 3" stroke={hovNext ? "#050402" : "#C9A84C"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ transition: "stroke 0.25s" }} />
            </svg>
          </button>

        </div>
      </div>

      {/* ══ BOTTOM STATUS BAR ═══════════════════════════════════════════════════ */}
      <div style={{
        flexShrink: 0, height: "38px", zIndex: 5,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 clamp(1.2rem,3.5vw,2.5rem)",
        borderTop: "1px solid rgba(201,168,76,0.08)",
        opacity: visible ? 1 : 0, transition: "opacity 0.9s ease 0.3s",
      }}>
        {/* Live indicator */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div style={{
            width: "5px", height: "5px",
            background: "#C9A84C",
            animation: "evPulse 2s ease-in-out infinite",
          }} />
          <span style={{
            color: "rgba(255,255,255,0.3)", fontSize: "0.48rem",
            fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase",
          }}>
            Events Overview
          </span>
        </div>

        {/* Center: quick stats inline */}
        <div className="ev-bottom-stats" style={{ display: "flex", alignItems: "center", gap: "1.8rem" }}>
          {STATS.map(s => (
            <div key={s.val} style={{ display: "flex", alignItems: "baseline", gap: "0.3rem" }}>
              <span style={{ color: "#C9A84C", fontSize: "clamp(0.68rem,1.1vw,0.8rem)", fontWeight: 800 }}>{s.val}</span>
              <span style={{ color: "rgba(255,255,255,0.18)", fontSize: "0.44rem", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase" }}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* Right: current slide label */}
        <span style={{
          color: "rgba(201,168,76,0.45)", fontSize: "0.48rem",
          fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase",
        }}>
          {["Live Events", "Tech Activations", "Entertainment"][slide]}
        </span>
      </div>

      <style>{`
        /* ── Body grid columns ── */
        .ev-body {
          grid-template-columns: 1fr;
        }
        .ev-right-col { display: none !important; }
        .ev-bottom-stats { display: none !important; }

        @media (min-width: 640px) {
          .ev-body { grid-template-columns: 1fr 220px; }
          .ev-right-col { display: flex !important; }
        }

        @media (min-width: 900px) {
          .ev-body { grid-template-columns: 1fr 260px; }
          .ev-bottom-stats { display: flex !important; }
        }

        @media (min-width: 1200px) {
          .ev-body { grid-template-columns: 1fr 300px; }
        }

        /* Pulse animation for live dot */
        @keyframes evPulse {
          0%, 100% { opacity: 0.4; transform: scale(0.85); }
          50%       { opacity: 1;   transform: scale(1.15); }
        }

        /* Fix the transition2 hack — use a real CSS class approach */
        .ev-cat-btn {
          transition: opacity 0.7s ease, transform 0.75s cubic-bezier(0.22,1,0.36,1),
                      background 0.22s ease, border-color 0.22s ease !important;
        }
      `}</style>
    </section>
  );
}