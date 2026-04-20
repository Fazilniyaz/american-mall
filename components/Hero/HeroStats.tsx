"use client";

import { useEffect, useRef, useCallback } from "react";
import MallLogo from "./MallLogo";

// ── Lazy GSAP loader ────────────────────────────────────────────────────
// GSAP is NOT imported at top level to keep it out of the critical bundle.
// It's only used here for deferred animations (800ms delay) and hover effects,
// so we load it on first use and cache the reference.
let _gsap: typeof import("gsap")["default"] | null = null;
const loadGsap = () =>
  _gsap
    ? Promise.resolve(_gsap)
    : import("gsap").then((m) => {
      _gsap = m.default;
      return _gsap;
    });

const stats = [
  { value: "40M+", label: "Annual Visitors" },
  { value: "520+", label: "Stores & Restaurants" },
  { value: "5.6M", label: "Square Feet" },
  { value: "#1", label: "Most Visited Mall in America" },
];

const SHUFFLE_CHARS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ#@$%&+";

function useShuffleText(originalText: string) {
  const rafRef = useRef<number | null>(null);
  const iterRef = useRef(0);
  const runRef = useRef(false);

  const shuffle = useCallback((el: HTMLElement, onComplete?: () => void) => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    iterRef.current = 0;
    runRef.current = true;
    const total = originalText.length * 5;

    const step = () => {
      if (!runRef.current) return;
      const resolved = Math.floor((iterRef.current / total) * originalText.length);
      el.textContent = originalText
        .split("")
        .map((ch, i) => {
          if (ch === " ") return " ";
          if (i < resolved) return ch;
          return SHUFFLE_CHARS[Math.floor(Math.random() * SHUFFLE_CHARS.length)];
        })
        .join("");
      iterRef.current++;
      if (iterRef.current <= total) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        el.textContent = originalText;
        runRef.current = false;
        onComplete?.();
      }
    };
    rafRef.current = requestAnimationFrame(step);
  }, [originalText]);

  const cancel = useCallback((el: HTMLElement) => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    runRef.current = false;
    el.textContent = originalText;
  }, [originalText]);

  useEffect(() => () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); }, []);

  return { shuffle, cancel };
}

function StatItem({ value, label }: { value: string; label: string }) {
  const valueRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const borderRef = useRef<HTMLDivElement>(null);
  const { shuffle, cancel } = useShuffleText(value);

  const onEnter = useCallback(() => {
    if (!valueRef.current || !labelRef.current || !borderRef.current) return;
    shuffle(valueRef.current);
    loadGsap().then((gsap) => {
      if (!labelRef.current || !borderRef.current || !valueRef.current) return;
      gsap.killTweensOf(labelRef.current);
      gsap.to(labelRef.current, {
        y: -4, opacity: 0.45, letterSpacing: "0.24em",
        duration: 0.25, ease: "power2.out",
        yoyo: true, repeat: 1,
        onComplete: () =>
          gsap.to(labelRef.current, {
            y: 0, opacity: 1, letterSpacing: "0.08em",
            duration: 0.35, ease: "power2.inOut",
          }),
      });
      gsap.killTweensOf(borderRef.current);
      gsap.to(borderRef.current, { opacity: 1, scaleY: 1.18, duration: 0.2, ease: "power2.out" });
      gsap.killTweensOf(valueRef.current);
      gsap.to(valueRef.current, { scale: 1.06, duration: 0.2, ease: "power2.out" });
    });
  }, [shuffle]);

  const onLeave = useCallback(() => {
    if (!valueRef.current || !labelRef.current || !borderRef.current) return;
    cancel(valueRef.current);
    loadGsap().then((gsap) => {
      if (!labelRef.current || !borderRef.current || !valueRef.current) return;
      gsap.killTweensOf(labelRef.current);
      gsap.to(labelRef.current, {
        y: 0, opacity: 1, letterSpacing: "0.08em",
        duration: 0.35, ease: "power2.inOut",
      });
      gsap.killTweensOf(borderRef.current);
      gsap.to(borderRef.current, { opacity: 0.5, scaleY: 1, duration: 0.3, ease: "power2.inOut" });
      gsap.killTweensOf(valueRef.current);
      gsap.to(valueRef.current, { scale: 1, duration: 0.3, ease: "power2.inOut" });
    });
  }, [cancel]);

  return (
    <div
      className="stat-item"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      style={{
        paddingLeft: "1rem",
        position: "relative",
        cursor: "default",
        userSelect: "none",
        // Let CSS grid control sizing — no fixed widths here
      }}
    >
      {/* Left gold border */}
      <div
        ref={borderRef}
        style={{
          position: "absolute",
          left: 0,
          top: "50%",
          transform: "translateY(-50%)",
          width: "2px",
          height: "75%",
          background: "linear-gradient(to bottom, #C9A84C, rgba(201,168,76,0.2))",
          opacity: 0.5,
          transformOrigin: "center",
        }}
      />

      {/* Value */}
      <div
        ref={valueRef}
        className="stat-value"
        style={{
          color: "#C9A84C",
          fontWeight: 800,
          fontFamily: "var(--font-montserrat)",
          lineHeight: 1,
          transformOrigin: "left center",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {value}
      </div>

      {/* Label */}
      <div
        ref={labelRef}
        className="stat-label"
        style={{
          color: "rgba(255,255,255,0.68)",
          marginTop: "0.3rem",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          fontFamily: "var(--font-montserrat)",
          fontWeight: 500,
        }}
      >
        {label}
      </div>
    </div>
  );
}

export default function HeroStats() {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // CRITICAL: Defer animation MUCH later to not block initial paint
    // Stats items should be visible (opacity: 1) before animation starts
    const animationTimer = setTimeout(() => {
      loadGsap().then((gsap) => {
        if (!wrapRef.current) return;
        const ctx = gsap.context(() => {
          // Animate stats IN (they're already visible)
          gsap.to(
            ".stat-item",
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              ease: "power2.out",
              stagger: 0.15,
              delay: 0,
            }
          );
          // Tagline: subtle animation only
          gsap.to(
            ".hero-tagline",
            { y: -6, duration: 0.5, ease: "power2.out", delay: 0.05, yoyo: true, repeat: 1 }
          );
        }, wrapRef);
      });
    }, 800); // Reduced from 2000ms — clears LCP (which fires ~0-500ms) with room to spare

    return () => clearTimeout(animationTimer);
  }, []);

  return (
    <>
      <div
        ref={wrapRef}
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 3,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          // Padding: top accounts for 60px navbar, bottom for scroll indicator
          padding: "80px 1.5rem 70px",
          boxSizing: "border-box",
          // Prevent any overflow on tiny phones
          overflow: "hidden",
        }}
      >
        {/* Dark gradient overlay */}
        <div style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(160deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.65) 100%)",
          zIndex: -1,
        }} />

        {/* Logo */}
        <div className="hero-logo-wrap">
          <MallLogo />
        </div>

        {/* Tagline */}
        <p
          className="hero-tagline"
          style={{
            color: "rgba(255,255,255,0.48)",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            fontFamily: "var(--font-montserrat)",
            fontWeight: 400,
            marginBottom: "clamp(1.5rem, 4vw, 3rem)",
            marginTop: "-0.3rem",
            textAlign: "center",
            opacity: 1,  // ← Ensure always visible (critical for LCP)
          }}
        >
          America&apos;s most iconic retail destination
        </p>

        {/* Stats grid — responsive via CSS */}
        <div className="stats-grid">
          {stats.map((s) => (
            <StatItem key={s.value} value={s.value} label={s.label} />
          ))}
        </div>

      </div>

      {/* ── All responsive CSS in one place ──────────────────────── */}
      <style>{`

        /* ── Stats grid layout ─────────────────────────────────── */

        /* Stat items must be VISIBLE by default for LCP */
        .stat-item {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }

        /* Mobile default: 2×2 grid, fills width evenly */
        .stats-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.4rem 1.6rem;
          width: 100%;
          max-width: 480px;
        }

        /* Tablet and up: single row of 4 */
        @media (min-width: 640px) {
          .stats-grid {
            grid-template-columns: repeat(4, auto);
            max-width: none;
            gap: clamp(1.5rem, 4vw, 4rem);
            width: auto;
          }
        }

        /* ── Stat value font size ──────────────────────────────── */

        /* Small phones (< 390px) */
        .stat-value {
          font-size: clamp(1.5rem, 7vw, 2rem);
        }

        /* Normal phones (390px – 639px) */
        @media (min-width: 390px) {
          .stat-value {
            font-size: clamp(1.7rem, 7vw, 2.2rem);
          }
        }

        /* Tablet and up */
        @media (min-width: 640px) {
          .stat-value {
            font-size: clamp(1.9rem, 3vw, 2.7rem);
          }
        }

        /* ── Stat label font size ──────────────────────────────── */
        .stat-label {
          font-size: clamp(0.55rem, 2.2vw, 0.72rem);
        }

        @media (min-width: 640px) {
          .stat-label {
            font-size: clamp(0.62rem, 1vw, 0.82rem);
          }
        }

        /* ── Tagline font size ─────────────────────────────────── */
        .hero-tagline {
          font-size: clamp(0.55rem, 2.8vw, 0.92rem);
        }

        /* ── Logo scale down on very small phones ──────────────── */
        @media (max-width: 360px) {
          .hero-logo-wrap svg {
            width: 34px !important;
            height: 34px !important;
          }
          .hero-logo-wrap [style*="font-size: 1.22rem"] {
            font-size: 1rem !important;
          }
        }

        /* ── Scroll label hide on tiny screens to save space ───── */
        @media (max-height: 680px) {
          .scroll-text { display: none; }
        }

      `}</style>
    </>
  );
}