"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function MallLogo() {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Logo mark — entrance animation (kept)
      gsap.fromTo(
        ".logo-mark",
        { opacity: 0, scale: 0.7, rotate: -15 },
        { opacity: 1, scale: 1, rotate: 0, duration: 1.1, ease: "expo.out", delay: 0.4 }
      );

      // Wordmark — animate ONLY translate, NOT opacity
      // The wordmark contains the LCP text ("Bloomington · Minnesota"),
      // so it MUST be visible from the first paint. We keep a subtle
      // slide-in for polish.
      gsap.fromTo(
        ".logo-wordmark-group",
        { x: -12 },
        { x: 0, duration: 0.9, ease: "power3.out", delay: 0.85 }
      );

      gsap.fromTo(
        ".logo-divider",
        { scaleY: 0 },
        { scaleY: 1, duration: 0.5, ease: "power2.out", delay: 0.75, transformOrigin: "top" }
      );

      // Only 1 infinite tween — cheap GPU rotation
      gsap.to(".logo-diamond-spin", {
        rotation: 360,
        duration: 18,
        ease: "none",
        repeat: -1,
        transformOrigin: "22px 22px",
      });
    }, wrapRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={wrapRef}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "14px",
        marginBottom: "1.6rem",
        filter: "drop-shadow(0 2px 24px rgba(201,168,76,0.18))",
      }}
    >
      {/* ── Mark ── */}
      <svg
        viewBox="0 0 44 44"
        width="44"
        height="44"
        aria-hidden="true"
        style={{ display: "block", flexShrink: 0 }}
      >
        <defs>
          <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F0D988" />
            <stop offset="50%" stopColor="#C9A84C" />
            <stop offset="100%" stopColor="#8A6820" />
          </linearGradient>
          <linearGradient id="g2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#F5E8A0" />
            <stop offset="100%" stopColor="#B8922E" />
          </linearGradient>
        </defs>

        <g className="logo-mark">
          {/* Outer square rotated 45° frame */}
          <rect
            x="4" y="4" width="36" height="36" rx="2"
            fill="none" stroke="url(#g1)" strokeWidth="0.8" opacity="0.35"
            transform="rotate(45 22 22)"
          />

          {/* Spinning dashed ring — only 1 infinite tween */}
          <circle
            className="logo-diamond-spin"
            cx="22" cy="22" r="17"
            fill="none" stroke="#C9A84C" strokeWidth="0.7"
            strokeDasharray="2.5 5" opacity="0.5"
          />

          {/* Static solid ring */}
          <circle cx="22" cy="22" r="14" fill="none" stroke="url(#g1)" strokeWidth="1" opacity="0.6" />

          {/* Cardinal arms */}
          <line x1="22" y1="8" x2="22" y2="14" stroke="url(#g1)" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="22" y1="30" x2="22" y2="36" stroke="url(#g1)" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="8" y1="22" x2="14" y2="22" stroke="url(#g1)" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="30" y1="22" x2="36" y2="22" stroke="url(#g1)" strokeWidth="1.2" strokeLinecap="round" />

          {/* Outer diamond outline */}
          <polygon
            points="22,14 30,22 22,30 14,22"
            fill="url(#g1)" opacity="0.1"
          />
          <polygon
            points="22,14 30,22 22,30 14,22"
            fill="none" stroke="url(#g1)" strokeWidth="1.3" opacity="0.9"
          />

          {/* Inner diamond filled */}
          <polygon points="22,17 27,22 22,27 17,22" fill="url(#g2)" />

          {/* Center dot */}
          <circle cx="22" cy="22" r="1.8" fill="#0a0a0a" opacity="0.55" />

          {/* Corner dots on ring */}
          <circle cx="22" cy="8" r="1.2" fill="#C9A84C" opacity="0.8" />
          <circle cx="36" cy="22" r="1.2" fill="#C9A84C" opacity="0.8" />
          <circle cx="22" cy="36" r="1.2" fill="#C9A84C" opacity="0.8" />
          <circle cx="8" cy="22" r="1.2" fill="#C9A84C" opacity="0.8" />
        </g>
      </svg>

      {/* ── Vertical divider ── */}
      <div
        className="logo-divider"
        style={{
          width: "1px",
          height: "40px",
          background: "linear-gradient(to bottom, transparent, #C9A84C 30%, #C9A84C 70%, transparent)",
          opacity: 0.5,
          flexShrink: 0,
        }}
      />

      {/* ── Wordmark — MUST be visible from first paint (LCP element) ── */}
      <div
        className="logo-wordmark-group"
        style={{ display: "flex", flexDirection: "column", gap: "1px" }}
      >
        <span style={{
          color: "#ffffff",
          fontSize: "1.22rem",
          fontWeight: 800,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          fontFamily: "var(--font-montserrat)",
          lineHeight: 1,
        }}>
          Mall of
        </span>
        <span style={{
          color: "#C9A84C",
          fontSize: "1.22rem",
          fontWeight: 800,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          fontFamily: "var(--font-montserrat)",
          lineHeight: 1,
        }}>
          America
        </span>
        <span style={{
          color: "rgba(255,255,255,0.32)",
          fontSize: "0.44rem",
          letterSpacing: "0.45em",
          textTransform: "uppercase",
          fontFamily: "var(--font-montserrat)",
          fontWeight: 500,
          marginTop: "5px",
        }}>
          Bloomington · Minnesota
        </span>
      </div>
    </div>
  );
}