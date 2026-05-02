"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

let _gsap: typeof import("gsap")["default"] | null = null;
const loadGsap = () =>
  _gsap
    ? Promise.resolve(_gsap)
    : import("gsap").then(m => { _gsap = m.default; return _gsap!; });

export default function WhosHerePage() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [soundOn, setSoundOn] = useState(false);
  const [videoReady, setVideoReady] = useState(false);

  // ── Entrance animation ──────────────────────────────────────────────
  useEffect(() => {
    const t = setTimeout(() => {
      loadGsap().then(gsap => {
        gsap.fromTo(".wh-tag",
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
        );
        gsap.fromTo(".wh-heading",
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.7, ease: "power2.out", delay: 0.15 }
        );
        gsap.fromTo(".wh-sub",
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", delay: 0.28 }
        );
        gsap.fromTo(".wh-divider",
          { scaleX: 0 },
          { scaleX: 1, duration: 0.5, ease: "power2.out", delay: 0.4, transformOrigin: "left" }
        );
        gsap.fromTo(".wh-brands",
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", delay: 0.5 }
        );
        gsap.fromTo(".wh-stat",
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", delay: 0.65 }
        );
      });
    }, 300);
    return () => clearTimeout(t);
  }, []);

  // ── Sound toggle ────────────────────────────────────────────────────
  const toggleSound = useCallback(() => {
    const next = !soundOn;
    setSoundOn(next);
    if (videoRef.current) videoRef.current.muted = !next;
  }, [soundOn]);

  const goNext = useCallback(() => router.push("/WhosHereOne"), [router]);
  const goBack = useCallback(() => router.push("/introTwo"), [router]);

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .wh-root {
          position: fixed;
          inset: 0;
          background: #050402;
          display: flex;
          flex-direction: row;
          overflow: hidden;
        }

        /* ── LEFT PANEL ── */
        .wh-left {
          position: relative;
          flex: 0 0 clamp(280px, 35vw, 480px);
          width: clamp(280px, 35vw, 480px);
          height: 100%;
          background: #050402;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: clamp(2rem, 5vw, 4rem) clamp(1.5rem, 4vw, 3rem) clamp(5rem, 10vh, 7rem);
          gap: clamp(0.9rem, 2.2vh, 1.6rem);
          z-index: 10;
          border-right: 1px solid rgba(201,168,76,0.08);
          flex-shrink: 0;
        }

        /* Gold left accent bar */
        .wh-accent-bar {
          position: absolute;
          left: 0; top: 15%; bottom: 15%;
          width: 3px;
          background: linear-gradient(to bottom, transparent, #C9A84C, transparent);
        }

        /* Soft right glow bleed from left panel edge */
        .wh-left::after {
          content: '';
          position: absolute;
          top: 0; right: -1px; bottom: 0;
          width: 60px;
          background: linear-gradient(to right, rgba(201,168,76,0.04), transparent);
          pointer-events: none;
        }

        /* ── RIGHT PANEL — Video ── */
        .wh-right {
          position: relative;
          flex: 1 1 0;
          height: 100%;
          overflow: hidden;
          background: #080705;
        }

        .wh-right video {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: opacity 0.8s ease;
        }

        /* subtle vignette on video edges */
        .wh-vignette {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(to right,  rgba(5,4,2,0.35) 0%, transparent 18%),
            linear-gradient(to left,   rgba(5,4,2,0.35) 0%, transparent 18%),
            linear-gradient(to bottom, rgba(5,4,2,0.4)  0%, transparent 15%),
            linear-gradient(to top,    rgba(5,4,2,0.6)  0%, transparent 20%);
          pointer-events: none;
          z-index: 2;
        }

        /* ── BOTTOM CONTROLS BAR ── */
        .wh-controls {
          position: fixed;
          bottom: 0; left: 0; right: 0;
          z-index: 30;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: clamp(0.8rem, 2vh, 1.2rem) clamp(1rem, 3vw, 2rem);
          background: linear-gradient(to top, rgba(5,4,2,0.9) 0%, transparent 100%);
        }

        .wh-btn-sound {
          background: transparent;
          border: 1px solid rgba(201,168,76,0.4);
          color: #C9A84C;
          padding: 0.45rem 0.9rem;
          font-size: clamp(0.5rem, 0.85vw, 0.6rem);
          font-weight: 700;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          font-family: var(--font-montserrat);
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }
        .wh-btn-sound:hover {
          background: rgba(201,168,76,0.1);
          border-color: #C9A84C;
        }

        .wh-nav {
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .wh-nav-arrow {
          width: clamp(34px, 4vw, 42px);
          height: clamp(34px, 4vw, 42px);
          background: rgba(5,4,2,0.7);
          border: 1px solid rgba(201,168,76,0.25);
          color: #C9A84C;
          display: flex; align-items: center; justify-content: center;
          font-size: 1rem;
          cursor: pointer;
          backdrop-filter: blur(8px);
          transition: all 0.2s ease;
        }
        .wh-nav-arrow:hover {
          background: rgba(201,168,76,0.12);
          border-color: #C9A84C;
        }
        .wh-nav-arrow.next:hover {
          background: #C9A84C;
          color: #000;
        }
        .wh-nav-arrow.next {
          background: rgba(201,168,76,0.12);
          border-color: rgba(201,168,76,0.45);
        }

        .wh-chapter-indicator {
          padding: 0 0.9rem;
          height: clamp(34px, 4vw, 42px);
          display: flex; align-items: center; gap: 0.35rem;
          background: rgba(5,4,2,0.7);
          border: 1px solid rgba(201,168,76,0.12);
          backdrop-filter: blur(8px);
        }

        /* ── RESPONSIVE: MOBILE ── */
        @media (max-width: 640px) {
          .wh-root {
            flex-direction: column;
          }

          /* Video fills top 55% */
          .wh-right {
            flex: 0 0 55%;
            height: 55%;
            width: 100%;
          }

          /* Left panel fills remaining bottom */
          .wh-left {
            flex: 1 1 0;
            width: 100% !important;
            height: auto;
            border-right: none;
            border-top: 1px solid rgba(201,168,76,0.08);
            justify-content: flex-start;
            padding: 1.2rem 1.4rem 6rem;
            gap: 0.75rem;
            overflow-y: auto;
          }

          .wh-accent-bar {
            display: none;
          }

          .wh-left::after {
            display: none;
          }
        }

        /* ── RESPONSIVE: TABLET ── */
        @media (min-width: 641px) and (max-width: 1024px) {
          .wh-left {
            flex: 0 0 clamp(260px, 42vw, 360px);
            width: clamp(260px, 42vw, 360px);
          }
        }
      `}</style>

      <div className="wh-root">

        {/* ── LEFT PANEL ── */}
        <div className="wh-left">
          <div className="wh-accent-bar" />

          {/* Tag */}
          <p className="wh-tag" style={{
            color: "#C9A84C",
            fontSize: "clamp(0.55rem, 1vw, 0.68rem)",
            letterSpacing: "0.45em",
            textTransform: "uppercase",
            fontFamily: "var(--font-montserrat)",
            fontWeight: 700,
            margin: 0,
            opacity: 0,
          }}>
            The World&apos;s Most Iconic Brands
          </p>

          {/* Heading */}
          <h1 className="wh-heading" style={{
            color: "#ffffff",
            fontSize: "clamp(1.6rem, 3.2vw, 3rem)",
            fontWeight: 800,
            fontFamily: "var(--font-montserrat)",
            lineHeight: 1.05,
            margin: 0,
            opacity: 0,
          }}>
            They chose<br />
            <span style={{ color: "#C9A84C" }}>here.</span>
          </h1>

          {/* Sub */}
          <p className="wh-sub" style={{
            color: "rgba(255,255,255,0.5)",
            fontSize: "clamp(0.72rem, 1.1vw, 0.88rem)",
            fontFamily: "var(--font-montserrat)",
            fontWeight: 400,
            lineHeight: 1.75,
            margin: 0,
            maxWidth: "320px",
            opacity: 0,
          }}>
            520+ brands. Every tier. Every category.
            The most visited mall in America is where
            global brands come to be seen.
          </p>

          {/* Gold divider */}
          <div className="wh-divider" style={{
            width: "48px", height: "2px",
            background: "linear-gradient(to right, #C9A84C, rgba(201,168,76,0.2))",
            transformOrigin: "left",
          }} />

          {/* Brand pills */}
          <div className="wh-brands" style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.4rem",
            opacity: 0,
          }}>
            {["Samsung", "Apple", "Nike", "Lego", "H&M", "Zara"].map(brand => (
              <span key={brand} style={{
                background: "rgba(201,168,76,0.08)",
                border: "1px solid rgba(201,168,76,0.2)",
                color: "rgba(255,255,255,0.55)",
                fontSize: "clamp(0.52rem, 0.85vw, 0.62rem)",
                fontFamily: "var(--font-montserrat)",
                fontWeight: 600,
                letterSpacing: "0.1em",
                padding: "3px 10px",
              }}>
                {brand}
              </span>
            ))}
            <span style={{
              color: "rgba(201,168,76,0.5)",
              fontSize: "clamp(0.52rem, 0.85vw, 0.62rem)",
              fontFamily: "var(--font-montserrat)",
              fontWeight: 600,
              letterSpacing: "0.1em",
              padding: "3px 4px",
              alignSelf: "center",
            }}>
              +514 more
            </span>
          </div>

          {/* Stat */}
          <div className="wh-stat" style={{
            borderLeft: "2px solid rgba(201,168,76,0.4)",
            paddingLeft: "1rem",
            opacity: 0,
          }}>
            <div style={{
              color: "#C9A84C",
              fontSize: "clamp(1.1rem, 2vw, 1.8rem)",
              fontWeight: 800,
              fontFamily: "var(--font-montserrat)",
              lineHeight: 1,
              fontVariantNumeric: "tabular-nums",
            }}>
              Will you be next?
            </div>
            <div style={{
              color: "rgba(255,255,255,0.35)",
              fontSize: "clamp(0.58rem, 0.9vw, 0.68rem)",
              fontFamily: "var(--font-montserrat)",
              fontWeight: 500,
              marginTop: "0.3rem",
              letterSpacing: "0.06em",
            }}>
              Join 520+ brands at America&apos;s #1 destination
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL — Video ── */}
        <div className="wh-right">
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            src="/videos/WhosHere.mp4"
            onCanPlay={() => setVideoReady(true)}
            style={{ opacity: videoReady ? 1 : 0 }}
          />
          {/* Vignette overlay */}
          <div className="wh-vignette" />
        </div>

      </div>

      {/* ── BOTTOM CONTROLS BAR ── */}
      <div className="wh-controls">

        {/* Left — Sound button */}
        <button className="wh-btn-sound" onClick={toggleSound}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            {soundOn ? (
              <>
                <path d="M11 5L6 9H2v6h4l5 4V5z" fill="currentColor" />
                <path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </>
            ) : (
              <>
                <path d="M11 5L6 9H2v6h4l5 4V5z" fill="currentColor" />
                <line x1="23" y1="9" x2="17" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <line x1="17" y1="9" x2="23" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </>
            )}
          </svg>
          {soundOn ? "Sound Off" : "Sound On"}
        </button>

        {/* Center — Chapter + nav arrows */}
        <div className="wh-nav">
          <button className="wh-nav-arrow" onClick={goBack} aria-label="Previous">‹</button>

          <div className="wh-chapter-indicator">
            <span style={{
              color: "#C9A84C", fontSize: "0.6rem",
              fontWeight: 700, letterSpacing: "0.2em",
              fontFamily: "var(--font-montserrat)",
            }}>03</span>
            <span style={{
              color: "rgba(255,255,255,0.2)", fontSize: "0.55rem",
              fontFamily: "var(--font-montserrat)",
            }}>/08</span>
          </div>

          <button className="wh-nav-arrow next" onClick={goNext} aria-label="Next">›</button>
        </div>

        {/* Right — Chapter label */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: "2px",
        }}>
          <span style={{
            color: "rgba(255,255,255,0.2)",
            fontSize: "clamp(0.5rem, 0.8vw, 0.58rem)",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            fontFamily: "var(--font-montserrat)",
            fontWeight: 600,
          }}>
            Who&apos;s Here
          </span>
        </div>
      </div>
    </>
  );
}