"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

const GOLD = "#C9A84C";
const GOLD_LIGHT = "#F0D988";
const GOLD_DIM = "rgba(201,168,76,0.15)";

export default function ExploreSection() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [hoverNext, setHoverNext] = useState(false);
  const particleRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  // Floating particles canvas
  useEffect(() => {
    const canvas = particleRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = canvas.width = canvas.offsetWidth;
    let H = canvas.height = canvas.offsetHeight;

    const resize = () => {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", resize);

    const DOTS = 55;
    const dots = Array.from({ length: DOTS }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.4 + 0.3,
      vx: (Math.random() - 0.5) * 0.18,
      vy: (Math.random() - 0.5) * 0.18,
      a: Math.random() * 0.5 + 0.15,
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
        ctx.fillStyle = `rgba(201,168,76,${d.a})`;
        ctx.fill();
      });
      animRef.current = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener("resize", resize);
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  const handleNext = () => router.push("/explore/MallMap");

  return (
    <section
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        minHeight: "600px",
        background: "#050402",
        overflow: "hidden",
        fontFamily: "var(--font-montserrat, 'Montserrat', sans-serif)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ── Background image ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          transition: "opacity 1.4s ease",
          opacity: imgLoaded ? 1 : 0,
        }}
      >
        <img
          src="/photos/explore_head.webp"
          alt="Mall of America interior"
          onLoad={() => setImgLoaded(true)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center top",
            display: "block",
          }}
        />
        {/* Multi-layer overlay for depth */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, rgba(5,4,2,0.55) 0%, rgba(5,4,2,0.15) 35%, rgba(5,4,2,0.45) 70%, rgba(5,4,2,0.92) 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to right, rgba(5,4,2,0.65) 0%, transparent 40%, transparent 60%, rgba(5,4,2,0.65) 100%)",
          }}
        />
      </div>

      {/* Skeleton while image loads */}
      {!imgLoaded && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 0,
            background: "linear-gradient(135deg, #0d0b07 0%, #060503 100%)",
          }}
        />
      )}

      {/* Particle canvas */}
      <canvas
        ref={particleRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          zIndex: 1,
          pointerEvents: "none",
        }}
      />

      {/* Grid lines */}
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={`gl-${i}`}
          style={{
            position: "absolute",
            left: `${(i + 1) * (100 / 7)}%`,
            top: 0,
            bottom: 0,
            width: "1px",
            background: "rgba(201,168,76,0.04)",
            zIndex: 1,
            pointerEvents: "none",
          }}
        />
      ))}

      {/* ── Corner brackets ── */}
      {(["tl", "tr", "bl", "br"] as const).map((pos) => (
        <div
          key={pos}
          style={{
            position: "absolute",
            zIndex: 4,
            width: "36px",
            height: "36px",
            ...(pos.includes("t") ? { top: "1.5rem" } : { bottom: "1.5rem" }),
            ...(pos.includes("l") ? { left: "1.5rem" } : { right: "1.5rem" }),
            borderTop: pos.includes("t") ? `1px solid rgba(201,168,76,0.3)` : "none",
            borderBottom: pos.includes("b") ? `1px solid rgba(201,168,76,0.3)` : "none",
            borderLeft: pos.includes("l") ? `1px solid rgba(201,168,76,0.3)` : "none",
            borderRight: pos.includes("r") ? `1px solid rgba(201,168,76,0.3)` : "none",
            pointerEvents: "none",
            opacity: mounted ? 1 : 0,
            transition: "opacity 1s ease 0.3s",
          }}
        />
      ))}

      {/* ── Slide counter top-right ── */}
      <div
        style={{
          position: "absolute",
          top: "1.5rem",
          right: "4rem",
          zIndex: 5,
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          opacity: mounted ? 1 : 0,
          transition: "opacity 1s ease 0.5s",
        }}
      >
        <span
          style={{
            color: GOLD,
            fontSize: "0.7rem",
            fontWeight: 700,
            letterSpacing: "0.15em",
          }}
        >
          04
        </span>
        <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "0.65rem" }}>
          / 08
        </span>
      </div>

      {/* ── Vertical label right ── */}
      <div
        style={{
          position: "absolute",
          right: "1.6rem",
          top: "50%",
          transform: "translateY(-50%) rotate(90deg)",
          zIndex: 5,
          color: GOLD,
          fontSize: "0.55rem",
          fontWeight: 700,
          letterSpacing: "0.4em",
          textTransform: "uppercase",
          opacity: mounted ? 0.7 : 0,
          transition: "opacity 1s ease 0.6s",
          whiteSpace: "nowrap",
        }}
      >
        Explore
      </div>

      {/* ── Main content ── */}
      <div
        style={{
          position: "relative",
          zIndex: 3,
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "clamp(2rem, 5vw, 4rem)",
          paddingBottom: "clamp(3rem, 6vw, 5rem)",
        }}
      >
        {/* Top label */}
        <p
          style={{
            color: GOLD,
            fontSize: "clamp(0.55rem, 1.2vw, 0.65rem)",
            letterSpacing: "0.45em",
            textTransform: "uppercase",
            fontWeight: 700,
            margin: "0 0 1rem",
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(20px)",
            transition: "all 0.9s cubic-bezier(0.22,1,0.36,1) 0.2s",
          }}
        >
          Section 04 · Explore
        </p>

        {/* Headline */}
        <h1
          style={{
            color: "#ffffff",
            fontSize: "clamp(2.2rem, 6vw, 5.5rem)",
            fontWeight: 900,
            margin: "0 0 0.25rem",
            lineHeight: 1,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(28px)",
            transition: "all 1s cubic-bezier(0.22,1,0.36,1) 0.35s",
          }}
        >
          Step Inside
        </h1>
        <h2
          style={{
            color: GOLD,
            fontSize: "clamp(2.2rem, 6vw, 5.5rem)",
            fontWeight: 900,
            margin: "0 0 2rem",
            lineHeight: 1,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(28px)",
            transition: "all 1s cubic-bezier(0.22,1,0.36,1) 0.45s",
          }}
        >
          The Experience
        </h2>

        {/* Divider */}
        <div
          style={{
            width: mounted ? "clamp(60px, 10vw, 100px)" : "0px",
            height: "2px",
            background: `linear-gradient(to right, ${GOLD}, transparent)`,
            marginBottom: "1.5rem",
            transition: "width 1s ease 0.7s",
          }}
        />

        {/* Description + CTA row */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "flex-end",
            gap: "2rem",
            justifyContent: "space-between",
          }}
        >
          <p
            style={{
              color: "rgba(255,255,255,0.55)",
              fontSize: "clamp(0.78rem, 1.5vw, 0.92rem)",
              maxWidth: "460px",
              lineHeight: 1.75,
              margin: 0,
              fontWeight: 400,
              opacity: mounted ? 1 : 0,
              transform: mounted ? "translateY(0)" : "translateY(20px)",
              transition: "all 1s cubic-bezier(0.22,1,0.36,1) 0.6s",
            }}
          >
            Navigate all four levels of America's most iconic retail
            destination. Discover flagship stores, hidden gems, dining, and
            world-class entertainment — all within 5.6 million square feet.
          </p>

          {/* Next CTA */}
          <button
            onClick={handleNext}
            onMouseEnter={() => setHoverNext(true)}
            onMouseLeave={() => setHoverNext(false)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
              opacity: mounted ? 1 : 0,
              transform: mounted ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 1s ease 0.75s, transform 1s ease 0.75s",
              flexShrink: 0,
            }}
            aria-label="Go to Mall Map"
          >
            <span
              style={{
                color: hoverNext ? "#ffffff" : GOLD,
                fontSize: "0.68rem",
                fontWeight: 700,
                letterSpacing: "0.35em",
                textTransform: "uppercase",
                transition: "color 0.3s ease",
              }}
            >
              View Mall Map
            </span>
            {/* Arrow box */}
            <div
              style={{
                width: "48px",
                height: "48px",
                border: `1px solid ${hoverNext ? GOLD_LIGHT : GOLD_DIM}`,
                background: hoverNext ? GOLD : "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.35s ease",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Fill sweep */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: GOLD,
                  transform: hoverNext ? "scaleX(1)" : "scaleX(0)",
                  transformOrigin: "left",
                  transition: "transform 0.35s cubic-bezier(0.22,1,0.36,1)",
                }}
              />
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                style={{ position: "relative", zIndex: 1 }}
              >
                <path
                  d="M3 8H13M9 4L13 8L9 12"
                  stroke={hoverNext ? "#050402" : GOLD}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ transition: "stroke 0.3s ease" }}
                />
              </svg>
            </div>
          </button>
        </div>
      </div>

      {/* ── Floating stat cards ── */}
      <div
        style={{
          position: "absolute",
          top: "clamp(4rem, 10vh, 8rem)",
          right: "clamp(2rem, 5vw, 5rem)",
          zIndex: 4,
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem",
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateX(0)" : "translateX(30px)",
          transition: "all 1.1s cubic-bezier(0.22,1,0.36,1) 0.8s",
        }}
      >
        {[
          { val: "4", label: "Levels" },
          { val: "520+", label: "Stores" },
          { val: "5.6M", label: "Sq Ft" },
        ].map((s) => (
          <div
            key={s.label}
            style={{
              background: "rgba(5,4,2,0.72)",
              border: `1px solid rgba(201,168,76,0.18)`,
              backdropFilter: "blur(12px)",
              padding: "0.65rem 1.1rem",
              minWidth: "100px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                color: GOLD_LIGHT,
                fontSize: "clamp(1rem, 2.5vw, 1.4rem)",
                fontWeight: 800,
                lineHeight: 1,
                letterSpacing: "0.04em",
              }}
            >
              {s.val}
            </div>
            <div
              style={{
                color: "rgba(255,255,255,0.35)",
                fontSize: "0.58rem",
                fontWeight: 600,
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                marginTop: "0.3rem",
              }}
            >
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* ── Compass icon (center-left decorative) ── */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "clamp(1.5rem, 3vw, 3rem)",
          transform: "translateY(-50%)",
          zIndex: 4,
          opacity: mounted ? 0.6 : 0,
          transition: "opacity 1s ease 1s",
        }}
      >
        <svg viewBox="0 0 60 60" width="44" height="44">
          <defs>
            <linearGradient id="cg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={GOLD_LIGHT} />
              <stop offset="100%" stopColor="#8A6820" />
            </linearGradient>
          </defs>
          <circle
            cx="30"
            cy="30"
            r="26"
            fill="none"
            stroke="url(#cg)"
            strokeWidth="0.8"
            opacity="0.5"
            strokeDasharray="3 5"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 30 30"
              to="360 30 30"
              dur="18s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="30" cy="30" r="20" fill="none" stroke="url(#cg)" strokeWidth="0.8" opacity="0.7" />
          <polygon points="30,22 34,30 30,38 26,30" fill="url(#cg)" opacity="0.8" />
          <circle cx="30" cy="30" r="2.5" fill={GOLD} opacity="0.9" />
        </svg>
      </div>

      {/* ── Bottom gold line ── */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "2px",
          background: `linear-gradient(to right, transparent 0%, ${GOLD} 30%, ${GOLD_LIGHT} 50%, ${GOLD} 70%, transparent 100%)`,
          opacity: mounted ? 0.5 : 0,
          transition: "opacity 1s ease 1.2s",
          zIndex: 4,
        }}
      />

      {/* ── Scroll hint ── */}
      <div
        style={{
          position: "absolute",
          bottom: "2.5rem",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 5,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.4rem",
          opacity: mounted ? 0.45 : 0,
          transition: "opacity 1s ease 1.3s",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            width: "1px",
            height: "30px",
            background: `linear-gradient(to bottom, transparent, ${GOLD})`,
            animation: "scrollPulse 2s ease-in-out infinite",
          }}
        />
        <span
          style={{
            color: GOLD,
            fontSize: "0.5rem",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            fontWeight: 600,
          }}
        >
          Scroll
        </span>
      </div>

      <style>{`
        @keyframes scrollPulse {
          0%, 100% { opacity: 0.3; transform: scaleY(0.8); }
          50% { opacity: 1; transform: scaleY(1); }
        }
        @media (max-width: 600px) {
          /* hide stat cards on tiny screens */
        }
      `}</style>
    </section>
  );
}