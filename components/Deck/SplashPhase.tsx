"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";

// ── Pre-computed tick mark coordinates (module scope, no re-calc) ──────────
const TICK_MARKS = Array.from({ length: 12 }).map((_, i) => {
  const angle = (i / 12) * Math.PI * 2 - Math.PI / 2;
  return {
    x1: (100 + Math.cos(angle) * 82).toFixed(2),
    y1: (100 + Math.sin(angle) * 82).toFixed(2),
    x2: (100 + Math.cos(angle) * 74).toFixed(2),
    y2: (100 + Math.sin(angle) * 74).toFixed(2),
  };
});

const SPLASH_IMAGES = ["/photos/splash-7.webp"];
const REVEAL_DELAY_MS = 4000; // When to show logo/text/button over the video
const SAFETY_TIMEOUT_MS = 6000; // Fallback if video stalls

interface Props {
  onEnter: () => void;
}

export default function SplashPhase({ onEnter }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // ── UI state ────────────────────────────────────────────────────────
  const [splashIndex, setSplashIndex] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);
  const [isMuted, setIsMuted] = useState(true); // Always starts muted
  const [revealed, setRevealed] = useState(false);
  const [logoIn, setLogoIn] = useState(false);
  const [textIn, setTextIn] = useState(false);
  const [btnIn, setBtnIn] = useState(false);

  // Guard against double-calls from StrictMode / event overlap
  const revealedRef = useRef(false);

  // ── Staggered content reveal ────────────────────────────────────────
  const revealContent = useCallback(() => {
    if (revealedRef.current) return;
    revealedRef.current = true;
    setRevealed(true);
    setTimeout(() => setLogoIn(true), 0);
    setTimeout(() => setTextIn(true), 300);
    setTimeout(() => setBtnIn(true), 600);
  }, []);

  // ── 1. Detect desktop (runs once after hydration) ──────────────────
  useEffect(() => {
    setIsDesktop(window.matchMedia("(min-width: 769px)").matches);
  }, []);

  // ── 2. Mobile: image slideshow ─────────────────────────────────────
  useEffect(() => {
    if (isDesktop || SPLASH_IMAGES.length <= 1) return;
    const id = setInterval(() => {
      setSplashIndex(i => (i + 1) % SPLASH_IMAGES.length);
    }, 3000);
    return () => clearInterval(id);
  }, [isDesktop]);

  // ── 3. Mobile: reveal content immediately ──────────────────────────
  useEffect(() => {
    if (!isDesktop) revealContent();
  }, [isDesktop, revealContent]);

  // ── 4. Desktop: play video MUTED, reveal after delay ───────────────
  //
  //  KEY FIX:
  //  • The <video> element already has `muted autoPlay` attributes,
  //    so the browser starts playback as soon as it can.
  //  • We do NOT attempt to unmute programmatically — Chrome will
  //    pause the video if you set muted=false without a user gesture.
  //  • The user can click the sound button to unmute (that IS a gesture).
  //
  useEffect(() => {
    if (!isDesktop) return;
    const video = videoRef.current;
    if (!video) return;

    // Ensure video is muted (matches the HTML attribute)
    video.muted = true;

    // Kick-start play in case autoPlay didn't fire yet (e.g. cached page)
    video.play().catch(() => {
      // Autoplay truly blocked — show content immediately
      revealContent();
    });

    // Reveal content after REVEAL_DELAY_MS of playback
    const onTimeUpdate = () => {
      if (video.currentTime >= REVEAL_DELAY_MS / 1000) {
        revealContent();
      }
    };

    // If video ends before the reveal time, show content too
    const onEnded = () => revealContent();

    // Safety net: if video stalls or never fires timeupdate
    const safety = setTimeout(revealContent, SAFETY_TIMEOUT_MS);

    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("ended", onEnded);

    return () => {
      clearTimeout(safety);
      video.removeEventListener("timeupdate", onTimeUpdate);
      video.removeEventListener("ended", onEnded);
    };
  }, [isDesktop, revealContent]);

  // ── Sound toggle (user gesture → safe to unmute) ────────────────────
  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    const next = !video.muted;
    video.muted = next;
    setIsMuted(next);
  }, []);

  // ═══════════════════════════════════════════════════════════════════
  //  RENDER
  // ═══════════════════════════════════════════════════════════════════
  return (
    <div style={{
      position: "fixed", inset: 0, background: "#050402",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      zIndex: 1000, overflow: "hidden",
    }}>

      {/* ── DESKTOP: Video background ────────────────────────────────
           muted + autoPlay = always allowed by every browser.
           preload="auto" = start buffering immediately.
           loop = keeps playing while user reads the splash.        */}
      {isDesktop && (
        <video
          ref={videoRef}
          src="/videos/entrance_clip.mp4"
          muted={isMuted}
          // defaultMuted={true}
          autoPlay
          playsInline
          loop
          preload="auto"
          style={{
            position: "absolute", inset: 0,
            width: "100%", height: "100%",
            objectFit: "cover", objectPosition: "center",
            zIndex: 0,
          }}
        />
      )}

      {/* ── DESKTOP: Sound toggle (bottom-right) ─────────────────── */}
      {isDesktop && (
        <button
          onClick={toggleMute}
          aria-label={isMuted ? "Unmute video" : "Mute video"}
          style={{
            position: "absolute",
            bottom: "clamp(1.5rem, 4vh, 2.5rem)",
            right: "clamp(1.5rem, 4vw, 2.5rem)",
            zIndex: 10,
            width: "44px", height: "44px", borderRadius: "50%",
            border: "1.5px solid rgba(201,168,76,0.35)",
            background: "rgba(5,4,2,0.55)",
            backdropFilter: "blur(10px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", transition: "all 0.25s ease",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = "#C9A84C";
            e.currentTarget.style.background = "rgba(201,168,76,0.15)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = "rgba(201,168,76,0.35)";
            e.currentTarget.style.background = "rgba(5,4,2,0.55)";
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
            stroke="#C9A84C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"
              fill="rgba(201,168,76,0.15)" />
            {isMuted ? (
              <>
                <line x1="23" y1="9" x2="17" y2="15" />
                <line x1="17" y1="9" x2="23" y2="15" />
              </>
            ) : (
              <>
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
              </>
            )}
          </svg>
        </button>
      )}

      {/* ── MOBILE: Background slideshow ──────────────────────────── */}
      {!isDesktop && SPLASH_IMAGES.map((src, i) => (
        <div key={src} style={{
          position: "absolute", inset: 0,
          opacity: splashIndex === i ? 1 : 0,
          transition: "opacity 1.4s ease", zIndex: 0,
        }}>
          <Image
            src={src} alt="" fill priority={i === 0}
            sizes="100vw" quality={65}
            style={{ objectFit: "cover", objectPosition: "center" }}
          />
        </div>
      ))}

      {/* Dark overlay */}
      <div style={{
        position: "absolute", inset: 0,
        background: "rgba(5,4,2,0.62)", zIndex: 1,
      }} />

      {/* Vignette */}
      <div style={{
        position: "absolute", inset: 0,
        boxShadow: "inset 0 0 200px rgba(0,0,0,0.85)",
        zIndex: 1, pointerEvents: "none",
      }} />

      {/* ── Center content ───────────────────────────────────────── */}
      <div style={{
        position: "relative", zIndex: 2,
        display: "flex", flexDirection: "column",
        alignItems: "center",
        gap: "clamp(1rem, 2.5vh, 1.8rem)",
        padding: "0 1rem",
        pointerEvents: revealed ? "auto" : "none",
      }}>

        {/* SVG Logo */}
        <div style={{
          position: "relative",
          opacity: logoIn ? 1 : 0,
          transform: logoIn ? "translateY(0) scale(1)" : "translateY(-40px) scale(0.85)",
          transition: "opacity 1s cubic-bezier(0.22,1,0.36,1), transform 1s cubic-bezier(0.22,1,0.36,1)",
        }}>
          <svg viewBox="0 0 200 200"
            width="clamp(90px, 14vw, 150px)"
            height="clamp(90px, 14vw, 150px)"
            style={{ display: "block" }}>
            <defs>
              <linearGradient id="sp-gold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F0D988" />
                <stop offset="50%" stopColor="#C9A84C" />
                <stop offset="100%" stopColor="#8A6820" />
              </linearGradient>
              <filter id="sp-glow">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <circle cx="100" cy="100" r="95" fill="none"
              stroke="rgba(201,168,76,0.18)" strokeWidth="1" strokeDasharray="6 8"
              style={{ animation: "splashSpin 18s linear infinite", transformOrigin: "100px 100px" }}
            />
            <circle cx="100" cy="100" r="88" fill="none"
              stroke="rgba(201,168,76,0.08)" strokeWidth="0.8" strokeDasharray="3 12"
              style={{ animation: "splashSpin 24s linear infinite reverse", transformOrigin: "100px 100px" }}
            />
            <circle cx="100" cy="100" r="78" fill="none"
              stroke="url(#sp-gold)" strokeWidth="1.5" opacity="0.7" />
            <circle cx="100" cy="100" r="72" fill="rgba(201,168,76,0.04)" />
            <polygon points="100,36 164,100 100,164 36,100"
              fill="none" stroke="url(#sp-gold)" strokeWidth="1.8"
              opacity="0.9" filter="url(#sp-glow)" />
            <polygon points="100,58 142,100 100,142 58,100"
              fill="url(#sp-gold)" opacity="0.85" />
            <circle cx="100" cy="100" r="14" fill="#050402" opacity="0.75" />
            {TICK_MARKS.map((t, i) => (
              <line key={i}
                x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2}
                stroke="rgba(201,168,76,0.25)" strokeWidth="1" />
            ))}
          </svg>

          {/* Glow behind logo */}
          <div style={{
            position: "absolute", top: "50%", left: "50%",
            transform: "translate(-50%, -50%)",
            width: "130%", height: "130%", borderRadius: "50%",
            background: "radial-gradient(circle, rgba(201,168,76,0.1) 0%, transparent 65%)",
            pointerEvents: "none", zIndex: -1,
          }} />
        </div>

        {/* Brand text */}
        <div style={{
          textAlign: "center",
          opacity: textIn ? 1 : 0,
          transform: textIn ? "translateY(0)" : "translateY(16px)",
          transition: "opacity 0.85s cubic-bezier(0.22,1,0.36,1), transform 0.85s cubic-bezier(0.22,1,0.36,1)",
        }}>
          <p style={{
            color: "rgba(201,168,76,0.65)",
            fontSize: "clamp(0.5rem, 1.2vw, 0.65rem)",
            letterSpacing: "0.5em", textTransform: "uppercase",
            fontFamily: "var(--font-montserrat)",
            fontWeight: 600, margin: "0 0 0.4rem",
          }}>
            America&apos;s Most Iconic
          </p>
          <h1 style={{
            color: "#ffffff",
            fontSize: "clamp(1.2rem, 3.5vw, 2rem)",
            fontWeight: 800, letterSpacing: "0.18em",
            textTransform: "uppercase",
            fontFamily: "var(--font-montserrat)",
            margin: "0 0 0.25rem",
            textShadow: "0 0 40px rgba(201,168,76,0.2)",
          }}>
            Mall of America
          </h1>
          <p style={{
            color: "rgba(201,168,76,0.4)",
            fontSize: "clamp(0.45rem, 1vw, 0.58rem)",
            letterSpacing: "0.38em", textTransform: "uppercase",
            fontFamily: "var(--font-montserrat)",
            fontWeight: 700, margin: 0,
          }}>
            Bloomington · Minnesota
          </p>
        </div>

        {/* ENTER button */}
        <button
          onClick={onEnter}
          className="splash-enter-btn"
          style={{
            background: "#C9A84C", color: "#000", border: "none",
            padding: "clamp(0.6rem, 1.5vh, 0.85rem) clamp(2rem, 5vw, 3.5rem)",
            fontSize: "clamp(0.6rem, 1.2vw, 0.72rem)",
            fontWeight: 800, letterSpacing: "0.35em",
            textTransform: "uppercase",
            fontFamily: "var(--font-montserrat)",
            cursor: "pointer",
            clipPath: "polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%)",
            opacity: btnIn ? 1 : 0,
            transform: btnIn ? "translateY(0)" : "translateY(30px)",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = "#ffffff";
            e.currentTarget.style.letterSpacing = "0.45em";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = "#C9A84C";
            e.currentTarget.style.letterSpacing = "0.35em";
          }}
        >
          Enter
        </button>
      </div>

      {/* Slide dots — mobile only */}
      {!isDesktop && (
        <div style={{
          position: "absolute",
          bottom: "clamp(1.2rem, 3vh, 2rem)",
          left: "50%", transform: "translateX(-50%)",
          display: "flex", gap: "0.5rem", zIndex: 3,
        }}>
          {SPLASH_IMAGES.map((_, i) => (
            <div key={i} onClick={() => setSplashIndex(i)} style={{
              width: splashIndex === i ? "22px" : "6px",
              height: "4px", borderRadius: "2px",
              background: splashIndex === i ? "#C9A84C" : "rgba(201,168,76,0.28)",
              transition: "all 0.4s ease", cursor: "pointer",
            }} />
          ))}
        </div>
      )}

      <style>{`
        @keyframes splashSpin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        .splash-enter-btn {
          transition: background 0.22s ease, letter-spacing 0.22s ease,
                      opacity 0.8s cubic-bezier(0.22,1,0.36,1),
                      transform 0.8s cubic-bezier(0.22,1,0.36,1) !important;
        }
        @media (max-width: 480px) {
          .splash-enter-btn { min-width: 120px; }
        }
      `}</style>
    </div>
  );
}