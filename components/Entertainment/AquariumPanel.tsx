"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

// ── Lazy GSAP loader ─────────────────────────────────────────────────────────
type GsapType = typeof import("gsap")["default"];

let _gsap: GsapType | null = null;

const loadGsap = async () => {
  if (_gsap) return _gsap;
  const gsapMod = await import("gsap");
  _gsap = gsapMod.default;
  return _gsap;
};

// ─── Aquarium stats ───────────────────────────────────────────────────────────
const AQUA_STATS = [
  { value: "10K+", label: "Sea Creatures" },
  { value: "1.2M", label: "Annual Visitors" },
  { value: "300+", label: "Species" },
  { value: "Top 5", label: "US Aquariums" },
];

export default function AquariumPanel() {
  const panelRef = useRef<HTMLDivElement>(null);
  const animated = useRef(false);

  useEffect(() => {
    if (!panelRef.current || animated.current) return;
    let cancelled = false;

    loadGsap().then((gsap) => {
      if (cancelled || !panelRef.current || animated.current) return;
      animated.current = true;

      const tl = gsap.timeline({ delay: 0.15 });
      tl.to(".aqua-cat", { opacity: 1, y: 0, duration: 0.55, ease: "power2.out" })
        .to(".aqua-headline", { opacity: 1, y: 0, duration: 0.65, ease: "power2.out" }, "-=0.25")
        .to(".aqua-sub", { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, "-=0.35")
        .to(".aqua-divider", { scaleX: 1, duration: 0.4, ease: "power2.out" }, "-=0.2")
        .to(".aqua-body", { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, "-=0.2")
        .to(".aqua-stat", { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", stagger: 0.09 }, "-=0.2")
        .to(".aqua-thumb", { opacity: 1, x: 0, duration: 0.65, ease: "power2.out" }, "-=0.3");
    });

    return () => { cancelled = true; };
  }, []);

  return (
    <div ref={panelRef} style={{
      position: "relative", width: "100%", height: "100vh",
      display: "flex", alignItems: "center", overflow: "hidden",
      background: "#000d0f",
    }}>
      {/* ── Hero background — wide tunnel with god rays ── */}
      <div style={{ position: "absolute", inset: 0, zIndex: 1 }}>
        <Image
          src="/photos/aquarium-tunnel.jpg"
          alt="Sea Life aquarium tunnel — Mall of America"
          fill
          priority={false}
          sizes="100vw"
          style={{ objectFit: "cover", objectPosition: "center 40%" }}
        />
        {/* Teal-blue tinted overlay — dark right for text, open left shows image */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(255deg, rgba(0,13,15,0.95) 0%, rgba(0,18,22,0.85) 35%, rgba(0,26,31,0.45) 62%, rgba(0,13,15,0.12) 100%)",
          zIndex: 2,
        }} />
        {/* Blue colour wash to deepen the teal vibe */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to bottom, rgba(0,20,40,0.3), rgba(0,10,20,0.5))",
          zIndex: 2,
          mixBlendMode: "multiply" as React.CSSProperties["mixBlendMode"],
        }} />
        {/* Bottom fade */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: "160px",
          background: "linear-gradient(to bottom,transparent,#050402)", zIndex: 3,
        }} />
        {/* Top fade */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: "80px",
          background: "linear-gradient(to bottom,rgba(5,4,2,0.6),transparent)", zIndex: 3,
        }} />
      </div>

      {/* ── CSS light ray animation — no Three.js, pure CSS ── */}
      <div className="aqua-rays-wrap" style={{
        position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none", overflow: "hidden",
      }}>
        {[0, 1, 2, 3].map(i => (
          <div key={i} className={`aqua-ray aqua-ray-${i}`} style={{
            position: "absolute",
            top: 0,
            left: `${15 + i * 20}%`,
            width: "1px",
            height: "65%",
            background: `linear-gradient(to bottom, rgba(0,180,220,${0.08 + i * 0.02}), transparent)`,
            transformOrigin: "top center",
            transform: `rotate(${-8 + i * 5}deg)`,
          }} />
        ))}
      </div>

      {/* ── Content — text RIGHT, image thumbnail LEFT ── */}
      <div className="aqua-grid" style={{
        position: "relative", zIndex: 4, width: "100%",
        padding: "6rem clamp(1.5rem,6vw,6rem)",
        display: "grid", gap: "2.5rem",
      }}>

        {/* Left — thumbnail (hidden mobile) */}
        <div className="aqua-thumb-col" style={{
          display: "flex", flexDirection: "column", gap: "0", alignSelf: "center",
        }}>
          <div className="aqua-thumb" style={{
            position: "relative", width: "100%",
            height: "clamp(260px,36vw,420px)", overflow: "hidden",
            opacity: 0, transform: "translateX(-40px)",
          }}>
            <Image
              src="/photos/aquarium-shark.jpg"
              alt="Visitor points at shark — Sea Life aquarium tunnel"
              fill
              sizes="(max-width:768px) 100vw, 38vw"
              style={{ objectFit: "cover", objectPosition: "center 20%", transition: "transform 0.55s ease" }}
              onMouseEnter={e => { (e.target as HTMLImageElement).style.transform = "scale(1.04)"; }}
              onMouseLeave={e => { (e.target as HTMLImageElement).style.transform = "scale(1)"; }}
            />
            {/* Overlay */}
            <div style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(to bottom, rgba(0,13,15,0.15) 0%, rgba(0,13,15,0.65) 100%)",
            }} />
            {/* Caption */}
            <div style={{ position: "absolute", bottom: "1rem", left: "1rem", zIndex: 2 }}>
              <div style={{
                color: "#C9A84C", fontSize: "0.62rem", fontWeight: 700,
                letterSpacing: "0.2em", textTransform: "uppercase",
                fontFamily: "var(--font-montserrat)", lineHeight: 1,
              }}>Shark Tunnel</div>
              <div style={{
                color: "rgba(255,255,255,0.45)", fontSize: "0.58rem",
                fontFamily: "var(--font-montserrat)", marginTop: "0.2rem",
              }}>Walk beneath the ocean</div>
            </div>
            {/* Corner bracket — bottom left */}
            <div style={{
              position: "absolute", bottom: "8px", left: "8px",
              width: "14px", height: "14px",
              borderBottom: "1px solid rgba(201,168,76,0.5)",
              borderLeft: "1px solid rgba(201,168,76,0.5)",
            }} />
          </div>

          {/* Thin strip below image */}
          <div style={{
            borderTop: "1px solid rgba(0,180,220,0.15)",
            paddingTop: "0.7rem",
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <span style={{
              color: "rgba(0,180,220,0.45)", fontSize: "0.58rem",
              letterSpacing: "0.18em", textTransform: "uppercase",
              fontFamily: "var(--font-montserrat)", fontWeight: 600,
            }}>Sea Life Minnesota</span>
            <span style={{ color: "rgba(0,180,220,0.45)", fontSize: "0.75rem" }}>→</span>
          </div>
        </div>

        {/* Right — text block */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.1rem", maxWidth: "520px" }}>
          <p className="aqua-cat" style={{
            color: "rgba(0,200,240,0.85)", fontSize: "0.68rem", letterSpacing: "0.42em",
            textTransform: "uppercase", fontFamily: "var(--font-montserrat)",
            fontWeight: 700, margin: 0, opacity: 0, transform: "translateY(16px)",
          }}>
            Aquarium · Sea Life Minnesota
          </p>

          <h2 className="aqua-headline" style={{
            color: "#ffffff", fontSize: "clamp(2.4rem,5.5vw,5.2rem)",
            fontWeight: 800, fontFamily: "var(--font-montserrat)",
            margin: 0, lineHeight: 0.95, opacity: 0, transform: "translateY(24px)",
          }}>
            Sharks swim<br />overhead.
          </h2>

          <h3 className="aqua-sub" style={{
            color: "rgba(255,255,255,0.38)", fontSize: "clamp(1.2rem,2.8vw,2rem)",
            fontWeight: 800, fontFamily: "var(--font-montserrat)",
            margin: 0, lineHeight: 1.1, opacity: 0, transform: "translateY(20px)",
          }}>
            1.2 million visitors come to watch.
          </h3>

          {/* Teal divider */}
          <div className="aqua-divider" style={{
            width: "48px", height: "2px",
            background: "linear-gradient(to right, rgba(0,200,240,0.8), rgba(0,200,240,0.1))",
            transform: "scaleX(0)", transformOrigin: "left",
          }} />

          <p className="aqua-body" style={{
            color: "rgba(255,255,255,0.52)", fontSize: "clamp(0.82rem,1.3vw,0.95rem)",
            fontFamily: "var(--font-montserrat)", fontWeight: 400,
            lineHeight: 1.8, margin: 0, maxWidth: "420px",
            opacity: 0, transform: "translateY(16px)",
          }}>
            Sea Life Minnesota Aquarium sits inside Mall of America, drawing
            families year-round. A captive, emotionally engaged audience that
            lingers for hours — and walks directly into your store.
          </p>

          {/* Stat pills — teal accent */}
          <div style={{
            display: "grid", gridTemplateColumns: "1fr 1fr",
            gap: "0.6rem", marginTop: "0.4rem",
          }}>
            {AQUA_STATS.map(s => (
              <div key={s.value} className="aqua-stat" style={{
                background: "rgba(0,180,220,0.05)",
                border: "1px solid rgba(0,180,220,0.18)",
                padding: "0.75rem 1rem",
                opacity: 0, transform: "translateY(12px)",
              }}>
                <div style={{
                  color: "rgba(0,200,240,0.9)",
                  fontSize: "clamp(1.1rem,2vw,1.5rem)",
                  fontWeight: 800, fontFamily: "var(--font-montserrat)",
                  lineHeight: 1, fontVariantNumeric: "tabular-nums",
                }}>{s.value}</div>
                <div style={{
                  color: "rgba(255,255,255,0.35)", fontSize: "0.58rem",
                  letterSpacing: "0.14em", textTransform: "uppercase",
                  fontFamily: "var(--font-montserrat)", fontWeight: 600,
                  marginTop: "0.25rem",
                }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Panel number watermark */}
      <div style={{
        position: "absolute", left: "clamp(1.5rem,5vw,4rem)", bottom: "3rem",
        color: "rgba(0,180,220,0.06)", fontSize: "clamp(5rem,12vw,10rem)",
        fontWeight: 800, fontFamily: "var(--font-montserrat)",
        lineHeight: 1, userSelect: "none", pointerEvents: "none", zIndex: 4,
      }}>02</div>

      {/* Light ray CSS animation + responsive */}
      <style>{`
        @keyframes aquaRayPulse {
          0%, 100% { opacity: 0.4; transform: scaleY(1) rotate(var(--r)); }
          50%       { opacity: 0.9; transform: scaleY(1.08) rotate(var(--r)); }
        }
        .aqua-ray-0 { --r: -8deg;  animation: aquaRayPulse 4.2s ease-in-out infinite; }
        .aqua-ray-1 { --r: -3deg;  animation: aquaRayPulse 5.1s ease-in-out infinite 0.8s; }
        .aqua-ray-2 { --r:  2deg;  animation: aquaRayPulse 3.8s ease-in-out infinite 1.5s; }
        .aqua-ray-3 { --r:  7deg;  animation: aquaRayPulse 4.6s ease-in-out infinite 0.4s; }
        @media (max-width:767px) {
          .aqua-thumb-col { display:none !important; }
          .aqua-grid      { grid-template-columns:1fr !important; }
          .aqua-rays-wrap { display:none; }
        }
        @media (min-width:768px) {
          .aqua-grid {
            grid-template-columns: 1fr 1fr !important;
            align-items: center;
          }
          .aqua-thumb-col { display:flex !important; }
        }
        @media (min-width:1100px) {
          .aqua-grid { grid-template-columns: 42fr 58fr !important; }
        }
      `}</style>
    </div>
  );
}
