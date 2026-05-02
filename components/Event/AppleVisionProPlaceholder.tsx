"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

// ─── Photo slides ─────────────────────────────────────────────────────────────
const SLIDES = [
  {
    src: "/photos/events/Apple-Vision-Pro.jpg",
    alt: "Visitor experiencing Apple Vision Pro at Mall of America",
    caption: "First hands-on in the Midwest",
    pos: "center 25%",
  },
  {
    src: "/photos/events/Apple-Vision-Pro-3.jpg",
    alt: "Apple Vision Pro selfie event with attendees",
    caption: "8,000+ demo sessions in 2024",
    pos: "center 35%",
  },
  {
    src: "/photos/events/Apple-Vision-Pro-2.jpg",
    alt: "Apple Vision Pro launch celebration",
    caption: "Crowds queued for hours",
    pos: "center 40%",
  },
];

// ─── Event key facts ──────────────────────────────────────────────────────────
const FACTS = [
  { val: "8,000+", label: "Demo Sessions" },
  { val: "2024", label: "Year" },
  { val: "#1", label: "Midwest Demo" },
  { val: "Hours", label: "Queue Length" },
];

// ─── Timeline moments ─────────────────────────────────────────────────────────
const TIMELINE = [
  { time: "6:00 AM", moment: "Doors open — queues form around the block" },
  { time: "9:00 AM", moment: "First Vision Pro demo sessions begin" },
  { time: "12:00 PM", moment: "8,000th session milestone reached" },
  { time: "8:00 PM", moment: "Event closes — sold out across all slots" },
];

export default function AppleVisionProEvent() {
  const router = useRouter();
  const [slide, setSlide] = useState(0);
  const [prevSlide, setPrevSlide] = useState<number | null>(null);
  const [transitioning, setTransitioning] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [hovNext, setHovNext] = useState(false);
  const [hovBack, setHovBack] = useState(false);
  const [hovThumb, setHovThumb] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
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

  // ── Auto-advance ───────────────────────────────────────────────────────────
  useEffect(() => {
    timerRef.current = setInterval(() => goNext(), 5000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slide, transitioning]);

  const goNext = useCallback(() => {
    if (transitioning) return;
    if (timerRef.current) clearInterval(timerRef.current);
    setTransitioning(true);
    setPrevSlide(slide);
    setSlide(p => (p + 1) % SLIDES.length);
    setTimeout(() => { setPrevSlide(null); setTransitioning(false); }, 950);
  }, [slide, transitioning]);

  const goSlide = useCallback((i: number) => {
    if (i === slide || transitioning) return;
    if (timerRef.current) clearInterval(timerRef.current);
    setTransitioning(true);
    setPrevSlide(slide);
    setSlide(i);
    setTimeout(() => { setPrevSlide(null); setTransitioning(false); }, 950);
  }, [slide, transitioning]);

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
    const dots = Array.from({ length: 40 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() * 1.1 + 0.15,
      vx: (Math.random() - 0.5) * 0.14,
      vy: (Math.random() - 0.5) * 0.14,
      a: Math.random() * 0.28 + 0.06,
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
    return () => { window.removeEventListener("resize", onResize); cancelAnimationFrame(rafRef.current); };
  }, []);

  // ── Transition helper ──────────────────────────────────────────────────────
  const tr = (d = 0) =>
    `opacity 0.75s ease ${d}s, transform 0.85s cubic-bezier(0.22,1,0.36,1) ${d}s`;

  return (
    <section style={{
      position: "relative", width: "100%", height: "100vh",
      minHeight: "580px", background: "#050402", overflow: "hidden",
      display: "flex", flexDirection: "column",
      fontFamily: "var(--font-montserrat, 'Montserrat', sans-serif)",
    }}>

      {/* ══ FULL-BLEED PHOTO CAROUSEL ════════════════════════════════════════ */}
      {SLIDES.map((s, i) => (
        <div key={s.src} style={{
          position: "absolute", inset: 0, zIndex: 0,
          opacity: i === slide ? 1 : i === prevSlide ? 0 : 0,
          transition: "opacity 1.1s ease",
          pointerEvents: "none",
        }}>
          {mounted && (
            <Image
              src={s.src} alt={s.alt} fill
              priority={i === 0} loading={i === 0 ? "eager" : "lazy"}
              sizes="100vw"
              style={{ objectFit: "cover", objectPosition: s.pos }}
            />
          )}
        </div>
      ))}

      {/* Overlays — left editorial block + bottom vignette */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none",
        background: "linear-gradient(105deg, rgba(5,4,2,0.96) 0%, rgba(5,4,2,0.82) 30%, rgba(5,4,2,0.38) 58%, rgba(5,4,2,0.1) 100%)",
      }} />
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        height: "42%", zIndex: 1, pointerEvents: "none",
        background: "linear-gradient(to top, rgba(5,4,2,0.98) 0%, rgba(5,4,2,0.55) 55%, transparent 100%)",
      }} />
      {/* Subtle silver-white top glow — Apple brand tone */}
      <div style={{
        position: "absolute", top: "-8%", right: "20%",
        width: "40vw", height: "40vh",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(245,245,247,0.04) 0%, transparent 65%)",
        zIndex: 1, pointerEvents: "none",
      }} />

      {/* Particles */}
      <canvas ref={particleRef} style={{
        position: "absolute", inset: 0, width: "100%", height: "100%",
        zIndex: 2, pointerEvents: "none", opacity: 0.55,
      }} />

      {/* Vertical gold rule */}
      <div style={{
        position: "absolute", left: 0, top: "16%", bottom: "16%",
        width: "2px", zIndex: 3, pointerEvents: "none",
        background: "linear-gradient(to bottom, transparent, #C9A84C 30%, #C9A84C 70%, transparent)",
        opacity: visible ? 0.32 : 0, transition: "opacity 1s ease 0.5s",
      }} />

      {/* Corner brackets */}
      {(["tl", "tr", "bl", "br"] as const).map(pos => (
        <div key={pos} style={{
          position: "absolute", width: "24px", height: "24px",
          zIndex: 4, pointerEvents: "none",
          ...(pos.includes("t") ? { top: "10px" } : { bottom: "10px" }),
          ...(pos.includes("l") ? { left: "10px" } : { right: "10px" }),
          borderTop: pos.includes("t") ? "1px solid rgba(201,168,76,0.22)" : "none",
          borderBottom: pos.includes("b") ? "1px solid rgba(201,168,76,0.22)" : "none",
          borderLeft: pos.includes("l") ? "1px solid rgba(201,168,76,0.22)" : "none",
          borderRight: pos.includes("r") ? "1px solid rgba(201,168,76,0.22)" : "none",
          opacity: visible ? 1 : 0, transition: "opacity 1s ease 0.3s",
        }} />
      ))}

      {/* ══ TOP BAR ════════════════════════════════════════════════════════════ */}
      <div style={{
        flexShrink: 0, height: "52px", zIndex: 5,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 clamp(1.2rem,3.5vw,2.5rem)",
        borderBottom: "1px solid rgba(201,168,76,0.1)",
        opacity: visible ? 1 : 0, transition: tr(0),
      }}>
        {/* Nav arrows */}
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          {/* ◀ Back → events/tech */}
          <button
            onClick={() => router.push("/events/tech")}
            onMouseEnter={() => setHovBack(true)}
            onMouseLeave={() => setHovBack(false)}
            aria-label="Back to Tech Events"
            style={{
              width: "34px", height: "34px", background: "none",
              border: `1px solid ${hovBack ? "#C9A84C" : "rgba(201,168,76,0.22)"}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", transition: "border-color 0.25s ease",
              position: "relative", overflow: "hidden",
            }}
          >
            <div style={{
              position: "absolute", inset: 0, background: "#C9A84C",
              transform: hovBack ? "scaleX(1)" : "scaleX(0)",
              transformOrigin: "right",
              transition: "transform 0.28s cubic-bezier(0.22,1,0.36,1)",
            }} />
            <svg viewBox="0 0 16 16" width="13" height="13" fill="none" style={{ position: "relative", zIndex: 1 }}>
              <path d="M10 4L6 8l4 4" stroke={hovBack ? "#050402" : "#C9A84C"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ transition: "stroke 0.25s" }} />
            </svg>
          </button>

          {/* ▶ Next → samsung */}
          <button
            onClick={() => router.push("/events/tech/samsungGrandStoreOpening")}
            onMouseEnter={() => setHovNext(true)}
            onMouseLeave={() => setHovNext(false)}
            aria-label="Next event"
            style={{
              width: "34px", height: "34px", background: "none",
              border: `1px solid ${hovNext ? "#C9A84C" : "rgba(201,168,76,0.22)"}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", transition: "border-color 0.25s ease",
              position: "relative", overflow: "hidden",
            }}
          >
            <div style={{
              position: "absolute", inset: 0, background: "#C9A84C",
              transform: hovNext ? "scaleX(1)" : "scaleX(0)",
              transformOrigin: "left",
              transition: "transform 0.28s cubic-bezier(0.22,1,0.36,1)",
            }} />
            <svg viewBox="0 0 16 16" width="13" height="13" fill="none" style={{ position: "relative", zIndex: 1 }}>
              <path d="M6 4l4 4-4 4" stroke={hovNext ? "#050402" : "#C9A84C"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ transition: "stroke 0.25s" }} />
            </svg>
          </button>
        </div>

        {/* Breadcrumb */}
        <div style={{ textAlign: "center" }}>
          <p style={{
            color: "#C9A84C", fontSize: "0.47rem", letterSpacing: "0.4em",
            textTransform: "uppercase", fontWeight: 700, margin: 0,
          }}>
            Events · Tech · Apple
          </p>
          <h1 style={{
            color: "#fff", fontSize: "0.8rem", fontWeight: 800,
            margin: 0, lineHeight: 1, letterSpacing: "0.08em", textTransform: "uppercase",
          }}>
            Vision Pro Experience
          </h1>
        </div>

        {/* Slide counter */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
          <span style={{ color: "#C9A84C", fontSize: "0.68rem", fontWeight: 700 }}>
            {String(slide + 1).padStart(2, "0")}
          </span>
          <span style={{ color: "rgba(255,255,255,0.18)", fontSize: "0.62rem" }}>
            / {String(SLIDES.length).padStart(2, "0")}
          </span>
        </div>
      </div>

      {/* ══ MAIN BODY ═══════════════════════════════════════════════════════════ */}
      <div className="avp-body" style={{
        flex: 1, minHeight: 0, zIndex: 5,
        display: "grid",
        padding: "0 clamp(1.2rem,3.5vw,2.5rem)",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.9s ease 0.1s",
      }}>

        {/* ── LEFT: editorial hero copy ─────────────────────────────────────── */}
        <div style={{
          display: "flex", flexDirection: "column", justifyContent: "center",
          paddingRight: "clamp(1rem,2.5vw,2.5rem)",
          borderRight: "1px solid rgba(201,168,76,0.07)",
          gap: 0,
        }}>

          {/* Event tag */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "0.5rem",
            marginBottom: "0.75rem",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(14px)",
            transition: tr(0.1),
          }}>
            {/* Apple logo mark */}
            <div style={{
              width: "18px", height: "18px",
              border: "1px solid rgba(245,245,247,0.25)",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              <svg viewBox="0 0 14 14" width="9" height="9" fill="none">
                <path d="M9.5 1.5c-.3.6-.8 1-1.5 1C7.5 2.5 7 2 7 1.5 7 1 7.5.5 8 .5c.6 0 1.1.4 1.5 1zM4.5 4C3.5 4 3 5 3 6c0 2 1.5 4.5 2.5 4.5.4 0 .8-.3 1.5-.3.7 0 1.1.3 1.5.3C9.5 10.5 11 8 11 6c0-1-1-2-2-2-.6 0-1 .3-1.5.3S5.1 4 4.5 4z" fill="rgba(245,245,247,0.55)" />
              </svg>
            </div>
            <span style={{
              color: "rgba(245,245,247,0.5)", fontSize: "0.52rem",
              fontWeight: 700, letterSpacing: "0.35em", textTransform: "uppercase",
            }}>
              Apple · Vision Pro
            </span>
            <div style={{
              height: "1px", width: "28px",
              background: "linear-gradient(to right, rgba(245,245,247,0.2), transparent)",
            }} />
            <span style={{
              color: "#C9A84C", fontSize: "0.48rem",
              fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase",
            }}>
              2024–Present
            </span>
          </div>

          {/* Main headline */}
          <h2 style={{
            color: "#ffffff", fontWeight: 900, margin: "0 0 0.1rem",
            fontSize: "clamp(1.9rem,4.2vw,3.8rem)",
            lineHeight: 1.0, letterSpacing: "0.03em", textTransform: "uppercase",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(22px)",
            transition: tr(0.18),
          }}>
            Spatial Computing
          </h2>
          <h2 style={{
            color: "#C9A84C", fontWeight: 900, margin: "0 0 0.9rem",
            fontSize: "clamp(1.9rem,4.2vw,3.8rem)",
            lineHeight: 1.0, letterSpacing: "0.03em", textTransform: "uppercase",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(22px)",
            transition: tr(0.26),
          }}>
            Comes to Life
          </h2>

          {/* Animated gold divider */}
          <div style={{
            width: visible ? "clamp(48px,7vw,72px)" : "0px",
            height: "2px", marginBottom: "0.9rem",
            background: "linear-gradient(to right, #C9A84C, rgba(245,245,247,0.3), transparent)",
            transition: "width 1s ease 0.5s",
          }} />

          {/* Description */}
          <p style={{
            color: "rgba(255,255,255,0.42)",
            fontSize: "clamp(0.68rem,1.05vw,0.8rem)",
            lineHeight: 1.78, fontWeight: 400, margin: "0 0 1.1rem",
            maxWidth: "370px",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(12px)",
            transition: tr(0.36),
          }}>
            The first hands-on Apple Vision Pro demo experience in the Midwest.
            Visitors queued for hours for a chance to step inside spatial computing
            — 8,000+ sessions delivered across Mall of America's atrium.
          </p>

          {/* Stat pills */}
          <div style={{
            display: "flex", flexWrap: "wrap",
            gap: "clamp(0.8rem,2vw,1.6rem)",
          }}>
            {FACTS.map((f, i) => (
              <div key={f.val} style={{
                borderLeft: "2px solid rgba(201,168,76,0.6)",
                paddingLeft: "0.7rem",
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(10px)",
                transition: tr(0.44 + i * 0.09),
              }}>
                <div style={{
                  color: "#C9A84C",
                  fontSize: "clamp(0.9rem,1.8vw,1.25rem)",
                  fontWeight: 800, lineHeight: 1,
                }}>
                  {f.val}
                </div>
                <div style={{
                  color: "rgba(255,255,255,0.25)", fontSize: "0.47rem",
                  fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase",
                  marginTop: "2px",
                }}>
                  {f.label}
                </div>
              </div>
            ))}
          </div>

          {/* Slide caption */}
          <div style={{
            marginTop: "1.2rem",
            display: "flex", alignItems: "center", gap: "0.55rem",
            opacity: visible ? 0.65 : 0, transition: "opacity 1s ease 0.9s",
          }}>
            <div style={{
              width: "5px", height: "5px",
              background: "#C9A84C",
              animation: "avpPulse 2.2s ease-in-out infinite",
            }} />
            <span style={{
              color: "rgba(255,255,255,0.32)", fontSize: "0.5rem",
              fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase",
              fontStyle: "italic",
            }}>
              {SLIDES[slide].caption}
            </span>
          </div>
        </div>

        {/* ── RIGHT: photo thumbnails + timeline ───────────────────────────── */}
        <div className="avp-right" style={{
          display: "flex", flexDirection: "column",
          justifyContent: "center",
          paddingLeft: "clamp(1rem,2vw,2rem)",
          gap: "0.6rem",
        }}>

          {/* Thumbnails */}
          <p style={{
            color: "rgba(255,255,255,0.16)", fontSize: "0.47rem",
            letterSpacing: "0.3em", textTransform: "uppercase",
            fontWeight: 600, margin: "0 0 0.2rem",
          }}>
            Event Gallery
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
            {SLIDES.map((s, i) => (
              <button
                key={s.src}
                onClick={() => goSlide(i)}
                onMouseEnter={() => setHovThumb(i)}
                onMouseLeave={() => setHovThumb(null)}
                style={{
                  display: "flex", alignItems: "center", gap: "0.7rem",
                  background: i === slide
                    ? "rgba(201,168,76,0.08)"
                    : hovThumb === i ? "rgba(255,255,255,0.03)" : "transparent",
                  border: `1px solid ${i === slide ? "rgba(201,168,76,0.45)" : "rgba(201,168,76,0.09)"}`,
                  padding: "0.45rem 0.6rem", cursor: "pointer",
                  transition: "all 0.22s ease",
                  textAlign: "left",
                }}
                aria-label={`View photo ${i + 1}`}
              >
                {/* Thumbnail image */}
                <div style={{
                  width: "52px", height: "36px", flexShrink: 0,
                  position: "relative", overflow: "hidden",
                  border: `1px solid ${i === slide ? "rgba(201,168,76,0.4)" : "rgba(255,255,255,0.08)"}`,
                  transition: "border-color 0.22s ease",
                }}>
                  <Image
                    src={s.src} alt={s.alt} fill
                    loading="lazy" sizes="52px"
                    style={{ objectFit: "cover", objectPosition: s.pos }}
                  />
                  {/* Active overlay */}
                  {i === slide && (
                    <div style={{
                      position: "absolute", inset: 0,
                      background: "rgba(201,168,76,0.12)",
                    }} />
                  )}
                </div>

                {/* Caption + number */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    color: i === slide ? "#F0D988" : "rgba(255,255,255,0.42)",
                    fontSize: "0.55rem", fontWeight: 600,
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                    transition: "color 0.22s ease",
                  }}>
                    {s.caption}
                  </div>
                  <div style={{
                    color: "rgba(201,168,76,0.35)", fontSize: "0.44rem",
                    fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase",
                    marginTop: "1px",
                  }}>
                    Photo {String(i + 1).padStart(2, "0")}
                  </div>
                </div>

                {/* Active dot */}
                {i === slide && (
                  <div style={{
                    width: "4px", height: "4px", flexShrink: 0,
                    background: "#C9A84C",
                  }} />
                )}
              </button>
            ))}
          </div>

          {/* Divider */}
          <div style={{
            height: "1px", margin: "0.2rem 0",
            background: "linear-gradient(to right, rgba(201,168,76,0.18), transparent)",
          }} />

          {/* Timeline */}
          <p style={{
            color: "rgba(255,255,255,0.16)", fontSize: "0.47rem",
            letterSpacing: "0.3em", textTransform: "uppercase",
            fontWeight: 600, margin: "0 0 0.2rem",
          }}>
            Event Day Timeline
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
            {TIMELINE.map((t, i) => (
              <div key={t.time} style={{
                display: "flex", alignItems: "flex-start", gap: "0.7rem",
                padding: "0.38rem 0",
                borderBottom: i < TIMELINE.length - 1 ? "1px solid rgba(201,168,76,0.06)" : "none",
                opacity: visible ? 1 : 0,
                transform: visible ? "translateX(0)" : "translateX(14px)",
                transition: `opacity 0.65s ease ${0.5 + i * 0.1}s, transform 0.7s cubic-bezier(0.22,1,0.36,1) ${0.5 + i * 0.1}s`,
              }}>
                {/* Time */}
                <span style={{
                  color: "#C9A84C", fontSize: "0.52rem", fontWeight: 700,
                  letterSpacing: "0.06em", flexShrink: 0, minWidth: "50px",
                  lineHeight: 1.5,
                }}>
                  {t.time}
                </span>
                {/* Vertical tick */}
                <div style={{
                  width: "1px", height: "100%", minHeight: "18px",
                  background: "rgba(201,168,76,0.25)", flexShrink: 0,
                  marginTop: "3px",
                }} />
                {/* Moment */}
                <span style={{
                  color: "rgba(255,255,255,0.38)", fontSize: "0.52rem",
                  fontWeight: 400, lineHeight: 1.55,
                }}>
                  {t.moment}
                </span>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div style={{
            height: "1px", margin: "0.2rem 0",
            background: "linear-gradient(to right, rgba(201,168,76,0.18), transparent)",
          }} />

          {/* CTA */}
          <button
            onClick={() => router.push("/events/tech/samsungGrandStoreOpening")}
            onMouseEnter={() => setHovNext(true)}
            onMouseLeave={() => setHovNext(false)}
            style={{
              background: hovNext ? "#C9A84C" : "transparent",
              border: "1px solid rgba(201,168,76,0.32)",
              padding: "0.65rem 0.9rem", cursor: "pointer",
              display: "flex", alignItems: "center",
              justifyContent: "space-between", gap: "0.8rem",
              transition: "all 0.28s ease",
              opacity: visible ? 1 : 0,
              transition2: "opacity 1s ease 0.95s",
            } as React.CSSProperties}
          >
            <div>
              <div style={{
                color: hovNext ? "#050402" : "#C9A84C",
                fontSize: "0.56rem", fontWeight: 700, letterSpacing: "0.2em",
                textTransform: "uppercase", transition: "color 0.25s ease",
              }}>
                Next: Samsung Store Opening
              </div>
              <div style={{
                color: hovNext ? "rgba(5,4,2,0.5)" : "rgba(255,255,255,0.2)",
                fontSize: "0.46rem", fontWeight: 500, letterSpacing: "0.1em",
                marginTop: "1px", transition: "color 0.25s ease",
              }}>
                22K+ Opening Day Visitors
              </div>
            </div>
            <svg viewBox="0 0 16 16" width="12" height="12" fill="none">
              <path d="M4 8h8M9 5l3 3-3 3"
                stroke={hovNext ? "#050402" : "#C9A84C"}
                strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                style={{ transition: "stroke 0.25s" }}
              />
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
        {/* Live dot + label */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div style={{
            width: "5px", height: "5px", background: "#C9A84C",
            animation: "avpPulse 2.2s ease-in-out infinite",
          }} />
          <span style={{
            color: "rgba(255,255,255,0.28)", fontSize: "0.47rem",
            fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase",
          }}>
            Apple Vision Pro · Mall of America
          </span>
        </div>

        {/* Center stats */}
        <div className="avp-bstats" style={{
          display: "flex", alignItems: "center", gap: "1.8rem",
        }}>
          {FACTS.map(f => (
            <div key={f.val} style={{ display: "flex", alignItems: "baseline", gap: "0.3rem" }}>
              <span style={{ color: "#C9A84C", fontSize: "clamp(0.66rem,1vw,0.78rem)", fontWeight: 800 }}>
                {f.val}
              </span>
              <span style={{
                color: "rgba(255,255,255,0.18)", fontSize: "0.43rem",
                fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase",
              }}>
                {f.label}
              </span>
            </div>
          ))}
        </div>

        {/* Right: photo progress dots */}
        <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
          {SLIDES.map((_, i) => (
            <button key={i} onClick={() => goSlide(i)} style={{
              width: i === slide ? "18px" : "4px", height: "4px",
              background: i === slide ? "#C9A84C" : "rgba(255,255,255,0.22)",
              border: "none", cursor: "pointer", padding: 0,
              transition: "all 0.32s ease",
            }} aria-label={`Photo ${i + 1}`} />
          ))}
        </div>
      </div>

      <style>{`
        .avp-body { grid-template-columns: 1fr; }
        .avp-right  { display: none !important; }
        .avp-bstats { display: none !important; }

        @media (min-width: 640px) {
          .avp-body  { grid-template-columns: 1fr 230px; }
          .avp-right { display: flex !important; }
        }
        @media (min-width: 900px) {
          .avp-body   { grid-template-columns: 1fr 260px; }
          .avp-bstats { display: flex !important; }
        }
        @media (min-width: 1200px) {
          .avp-body { grid-template-columns: 1fr 295px; }
        }

        @keyframes avpPulse {
          0%, 100% { opacity: 0.38; transform: scale(0.82); }
          50%       { opacity: 1;    transform: scale(1.18); }
        }
      `}</style>
    </section>
  );
}