"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { ScrollerContext } from "@/components/ScrollerContext";

// ── All existing components — unchanged ──────────────────────────────────
import HeroSection from "@/components/Hero/HeroSection";

const NumbersSection = dynamic(
  () => import("@/components/Numbers/NumbersSection"),
);
const WhosHereSection = dynamic(
  () => import("@/components/WhoIsHere/WhosHereSection"),
);
const MallMapSection = dynamic(
  () => import("@/components/MallMap/MallMapSection"),
);
const EntertainmentSection = dynamic(
  () => import("@/components/Entertainment/EntertainmentSection"),
);
const EventsSection = dynamic(() => import("@/components/Event/EventsSection"));
const SponsorshipSection = dynamic(
  () => import("@/components/Sponsorship/SponsorshipSection"),
);
const CTASection = dynamic(() => import("@/components/CTA/CTASection"));

// ── Slide definitions ────────────────────────────────────────────────────
const SLIDES = [
  { id: "intro", label: "Intro", chapter: "01" },
  { id: "scale", label: "Scale", chapter: "02" },
  { id: "whos-here", label: "Who's Here", chapter: "03" },
  { id: "explore", label: "Explore", chapter: "04" },
  { id: "entertainment", label: "Entertainment", chapter: "05" },
  { id: "events", label: "Events", chapter: "06" },
  { id: "sponsorship", label: "Sponsorship", chapter: "07" },
  { id: "get-started", label: "Get Started", chapter: "08" },
];

const SPLASH_IMAGES = [
  "/photos/splash-4.webp",
  "/photos/splash-5.webp",
  "/photos/splash-6.webp",
  // "/photos/splash-1.webp",
  "/photos/splash-2.webp",
  "/photos/splash-3.webp",
];

// ── Phase type ───────────────────────────────────────────────────────────
type Phase = "splash" | "intro-video" | "hub" | "deck";

export default function DeckShell() {
  const [phase, setPhase] = useState<Phase>("splash");
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [animDir, setAnimDir] = useState<"next" | "prev">("next");
  const [isAnimating, setIsAnimating] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hoveredDot, setHoveredDot] = useState<number | null>(null);
  const [soundOn, setSoundOn] = useState(false);
  const [splashIndex, setSplashIndex] = useState(0);
  const [scrollerEl, setScrollerEl] = useState<HTMLElement | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const animTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Keyboard navigation ──────────────────────────────────────────────
  useEffect(() => {
    if (phase !== "deck") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") goNext();
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") goPrev();
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, current, isAnimating]);

  useEffect(() => {
    if (phase !== "splash") return;
    const interval = setInterval(() => {
      setSplashIndex((i) => (i + 1) % SPLASH_IMAGES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [phase]);

  // ── Slide transition ─────────────────────────────────────────────────
  const goTo = useCallback(
    (index: number) => {
      if (isAnimating || index === current) return;
      if (animTimeout.current) clearTimeout(animTimeout.current);
      setAnimDir(index > current ? "next" : "prev");
      setPrev(current);
      setIsAnimating(true);
      setCurrent(index);
      animTimeout.current = setTimeout(() => {
        setPrev(null);
        setIsAnimating(false);
      }, 600);
    },
    [isAnimating, current],
  );

  const goNext = useCallback(() => {
    if (current < SLIDES.length - 1) goTo(current + 1);
  }, [current, goTo]);

  const goPrev = useCallback(() => {
    if (current > 0) goTo(current - 1);
  }, [current, goTo]);

  // ── Intro video: skip or end ─────────────────────────────────────────
  const skipIntro = useCallback(() => {
    if (videoRef.current) videoRef.current.pause();
    setPhase("hub");
  }, []);

  const enterDeck = useCallback((startIndex = 0) => {
    setCurrent(startIndex);
    setPrev(null);
    setIsAnimating(false);
    setMenuOpen(false);
    setPhase("deck");
  }, []);

  // ── Slide content renderer ───────────────────────────────────────────
  const renderSlide = (index: number) => {
    switch (index) {
      case 0:
        return <HeroSection />;
      case 1:
        return <NumbersSection />;
      case 2:
        return <WhosHereSection />;
      case 3:
        return <MallMapSection />;
      case 4:
        return <EntertainmentSection />;
      case 5:
        return <EventsSection />;
      case 6:
        return <SponsorshipSection />;
      case 7:
        return <CTASection />;
      default:
        return null;
    }
  };

  // ────────────────────────────────────────────────────────────────────
  // PHASE: SPLASH
  // ────────────────────────────────────────────────────────────────────
  if (phase === "splash") {
    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "#050402",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          overflow: "hidden",
        }}
      >
        {/* ── Slideshow background images ── */}
        {SPLASH_IMAGES.map((src, i) => (
          <div
            key={src}
            style={{
              position: "absolute",
              inset: 0,
              opacity: splashIndex === i ? 1 : 0,
              transition: "opacity 1.4s ease",
              zIndex: 0,
            }}
          >
            <Image
              src={src}
              alt=""
              fill
              priority={i === 0}
              sizes="100vw"
              quality={75}
              style={{ objectFit: "cover", objectPosition: "center" }}
            />
          </div>
        ))}

        {/* ── Dark overlay ── */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(5,4,2,0.62)",
            zIndex: 1,
          }}
        />

        {/* ── Vignette ── */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            boxShadow: "inset 0 0 200px rgba(0,0,0,0.85)",
            zIndex: 1,
            pointerEvents: "none",
          }}
        />

        {/* ── Center content: Logo + ENTER ── */}
        <div
          style={{
            position: "relative",
            zIndex: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "clamp(1rem, 2.5vh, 1.8rem)",
            maxHeight: "90vh",
            justifyContent: "center",
          }}
        >
          {/* Logo mark — spinning ring version */}
          <div style={{ position: "relative" }}>
            <svg
              viewBox="0 0 200 200"
              width="clamp(100px, 15vw, 160px)"
              height="clamp(100px, 15vw, 160px)"
              style={{ display: "block" }}
            >
              <defs>
                <linearGradient
                  id="sp-gold"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
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

              {/* Outer spinning dashed ring */}
              <circle
                cx="100"
                cy="100"
                r="95"
                fill="none"
                stroke="rgba(201,168,76,0.18)"
                strokeWidth="1"
                strokeDasharray="6 8"
                style={{
                  animation: "splashSpin 18s linear infinite",
                  transformOrigin: "100px 100px",
                }}
              />

              {/* Counter-spin ring */}
              <circle
                cx="100"
                cy="100"
                r="88"
                fill="none"
                stroke="rgba(201,168,76,0.08)"
                strokeWidth="0.8"
                strokeDasharray="3 12"
                style={{
                  animation: "splashSpin 24s linear infinite reverse",
                  transformOrigin: "100px 100px",
                }}
              />

              {/* Main gold ring */}
              <circle
                cx="100"
                cy="100"
                r="78"
                fill="none"
                stroke="url(#sp-gold)"
                strokeWidth="1.5"
                opacity="0.7"
              />

              {/* Inner fill circle — subtle */}
              <circle cx="100" cy="100" r="72" fill="rgba(201,168,76,0.04)" />

              {/* Diamond shape */}
              <polygon
                points="100,36 164,100 100,164 36,100"
                fill="none"
                stroke="url(#sp-gold)"
                strokeWidth="1.8"
                opacity="0.9"
                filter="url(#sp-glow)"
              />

              {/* Inner diamond */}
              <polygon
                points="100,58 142,100 100,142 58,100"
                fill="url(#sp-gold)"
                opacity="0.85"
              />

              {/* Center cutout */}
              <circle cx="100" cy="100" r="14" fill="#050402" opacity="0.75" />

              {/* Tick marks around ring */}
              {Array.from({ length: 12 }).map((_, i) => {
                const angle = (i / 12) * Math.PI * 2 - Math.PI / 2;
                const r1 = 82,
                  r2 = 74;
                const round = (n: number) => Math.round(n * 1000000) / 1000000;
                return (
                  <line
                    key={i}
                    x1={round(100 + Math.cos(angle) * r1)}
                    y1={round(100 + Math.sin(angle) * r1)}
                    x2={round(100 + Math.cos(angle) * r2)}
                    y2={round(100 + Math.sin(angle) * r2)}
                    stroke="rgba(201,168,76,0.25)"
                    strokeWidth="1"
                  />
                );
              })}
            </svg>

            {/* Glow behind logo */}
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "120%",
                height: "120%",
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, rgba(201,168,76,0.12) 0%, transparent 65%)",
                pointerEvents: "none",
                zIndex: -1,
              }}
            />
          </div>

          {/* Brand name below logo */}
          <div style={{ textAlign: "center" }}>
            <p
              style={{
                color: "rgba(201,168,76,0.65)",
                fontSize: "clamp(0.55rem, 1.2vw, 0.7rem)",
                letterSpacing: "0.55em",
                textTransform: "uppercase",
                fontFamily: "var(--font-montserrat)",
                fontWeight: 600,
                margin: "0 0 0.5rem",
              }}
            >
              America&apos;s Most Iconic
            </p>
            <h1
              style={{
                color: "#ffffff",
                fontSize: "clamp(1.4rem, 3.5vw, 2.2rem)",
                fontWeight: 800,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                fontFamily: "var(--font-montserrat)",
                margin: "0 0 0.3rem",
                textShadow: "0 0 40px rgba(201,168,76,0.2)",
              }}
            >
              Mall of America
            </h1>
            <p
              style={{
                color: "rgba(201,168,76,0.4)",
                fontSize: "clamp(0.5rem, 1vw, 0.6rem)",
                letterSpacing: "0.4em",
                textTransform: "uppercase",
                fontFamily: "var(--font-montserrat)",
                fontWeight: 500,
                margin: 0,
              }}
            >
              Bloomington · Minnesota
            </p>
          </div>

          {/* ENTER button — Boston Bruins style */}
          <button
            onClick={() => setPhase("intro-video")}
            style={{
              background: "#C9A84C",
              color: "#000000",
              border: "none",
              padding:
                "clamp(0.7rem, 1.5vh, 0.9rem) clamp(2.5rem, 5vw, 3.8rem)",
              fontSize: "clamp(0.65rem, 1.2vw, 0.75rem)",
              fontWeight: 800,
              letterSpacing: "0.35em",
              textTransform: "uppercase",
              fontFamily: "var(--font-montserrat)",
              cursor: "pointer",
              transition: "all 0.22s ease",
              clipPath:
                "polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#ffffff";
              e.currentTarget.style.letterSpacing = "0.45em";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#C9A84C";
              e.currentTarget.style.letterSpacing = "0.35em";
            }}
          >
            Enter
          </button>
        </div>

        {/* ── Slide dots bottom center ── */}
        <div
          style={{
            position: "absolute",
            bottom: "clamp(1.5rem, 3vh, 2.5rem)",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: "0.5rem",
            zIndex: 3,
          }}
        >
          {SPLASH_IMAGES.map((_, i) => (
            <div
              key={i}
              onClick={() => setSplashIndex(i)}
              style={{
                width: splashIndex === i ? "22px" : "6px",
                height: "4px",
                borderRadius: "2px",
                background:
                  splashIndex === i ? "#C9A84C" : "rgba(201,168,76,0.28)",
                transition: "all 0.4s ease",
                cursor: "pointer",
              }}
            />
          ))}
        </div>

        <style>{`
        @keyframes splashSpin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }

        /* Mobile adjustments */
        @media (max-width: 480px) {
          .splash-logo { transform: scale(0.85); }
        }
        @media (max-height: 600px) {
          .splash-logo { transform: scale(0.7); }
        }
      `}</style>
      </div>
    );
  }
  // ────────────────────────────────────────────────────────────────────
  // PHASE: INTRO VIDEO
  // ────────────────────────────────────────────────────────────────────
if (phase === "intro-video") {
  return (
    <div style={{
      position: "fixed", inset: 0,
      background: "#000",
      zIndex: 1000,
      display: "flex",
      alignItems: "stretch",
    }}>

      {/* ── LEFT PANEL — Logo ── */}
      <div style={{
        width: "clamp(80px, 10vw, 140px)",
        flexShrink: 0,
        background: "#000",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: "1.2rem",
        zIndex: 10,
      }}>
        {/* Mall Logo */}
        <div style={{
          width: "clamp(40px, 5vw, 56px)",
          height: "clamp(40px, 5vw, 56px)",
          borderRadius: "50%",
          border: "2px solid rgba(201,168,76,0.6)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(201,168,76,0.08)",
        }}>
          <svg viewBox="0 0 44 44"
            width="clamp(28px, 3.5vw, 40px)"
            height="clamp(28px, 3.5vw, 40px)"
          >
            <defs>
              <linearGradient id="iv-g" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F0D988" />
                <stop offset="100%" stopColor="#C9A84C" />
              </linearGradient>
            </defs>
            <circle cx="22" cy="22" r="14"
              fill="none" stroke="url(#iv-g)"
              strokeWidth="1.2" opacity="0.9" />
            <polygon points="22,14 30,22 22,30 14,22"
              fill="none" stroke="url(#iv-g)" strokeWidth="1.5" />
            <polygon points="22,17 27,22 22,27 17,22"
              fill="url(#iv-g)" />
            <circle cx="22" cy="22" r="1.8"
              fill="#000" opacity="0.6" />
          </svg>
        </div>
      </div>

      {/* ── CENTER — Video ── */}
      <div style={{
        flex: 1,
        position: "relative",
        overflow: "hidden",
        background: "#000",
      }}>
        <video
          ref={videoRef}
          autoPlay
          muted={!soundOn}
          loop={false}
          playsInline
          controls
          src="/videos/videoplayback.mp4"
          onEnded={skipIntro}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
      </div>

      {/* ── RIGHT PANEL — Action Buttons ── */}
      <div style={{
        width: "clamp(80px, 10vw, 140px)",
        flexShrink: 0,
        background: "#000",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.6rem",
        zIndex: 10,
      }}>

        {/* SOUND ON/OFF */}
        <button
          onClick={() => {
            const newSoundOn = !soundOn;
            setSoundOn(newSoundOn);
            if (videoRef.current) videoRef.current.muted = !newSoundOn;
          }}
          style={{
            background: "transparent",
            border: "1px solid rgba(201,168,76,0.5)",
            color: "#C9A84C",
            padding: "0.55rem 0.8rem",
            fontSize: "clamp(0.5rem, 0.8vw, 0.62rem)",
            fontWeight: 700,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            fontFamily: "var(--font-montserrat)",
            cursor: "pointer",
            whiteSpace: "nowrap",
            transition: "all 0.2s ease",
            width: "clamp(70px, 8vw, 110px)",
            textAlign: "center",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = "rgba(201,168,76,0.1)";
            e.currentTarget.style.borderColor = "#C9A84C";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.borderColor = "rgba(201,168,76,0.5)";
          }}
        >
          {soundOn ? "Sound Off" : "Sound On"}
        </button>

        {/* SKIP INTRO */}
        <button
          onClick={skipIntro}
          style={{
            background: "transparent",
            border: "1px solid rgba(201,168,76,0.5)",
            color: "#C9A84C",
            padding: "0.55rem 0.8rem",
            fontSize: "clamp(0.5rem, 0.8vw, 0.62rem)",
            fontWeight: 700,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            fontFamily: "var(--font-montserrat)",
            cursor: "pointer",
            whiteSpace: "nowrap",
            transition: "all 0.2s ease",
            width: "clamp(70px, 8vw, 110px)",
            textAlign: "center",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = "rgba(201,168,76,0.1)";
            e.currentTarget.style.borderColor = "#C9A84C";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.borderColor = "rgba(201,168,76,0.5)";
          }}
        >
          Skip Intro
        </button>
      </div>

      {/* ── Mobile: stack vertically ── */}
      <style>{`
        @media (max-width: 600px) {
          .iv-left-panel  { width: 48px !important; }
          .iv-right-panel { width: 48px !important; }
          .iv-right-panel button {
            width: 40px !important;
            font-size: 0 !important;
            padding: 0.4rem !important;
          }
          .iv-right-panel button::after {
            font-size: 0.5rem;
          }
        }
      `}</style>
    </div>
  );
}

  // ────────────────────────────────────────────────────────────────────
  // PHASE: HUB (Main menu)
  // ────────────────────────────────────────────────────────────────────
  if (phase === "hub") {
    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "#050402",
          display: "flex",
          zIndex: 1000,
          overflow: "hidden",
        }}
      >
        {/* Background drone video — muted, looping */}
        <video
          autoPlay
          muted
          loop
          playsInline
          src="/videos/videoplayback.mp4"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: 0.22,
            zIndex: 0,
          }}
        />

        {/* Dark overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(135deg, rgba(5,4,2,0.92) 0%, rgba(5,4,2,0.75) 60%, rgba(5,4,2,0.88) 100%)",
            zIndex: 1,
          }}
        />

        {/* Gold radial glow */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 55% 45% at 15% 50%, rgba(201,168,76,0.07) 0%, transparent 65%)",
            zIndex: 1,
            pointerEvents: "none",
          }}
        />

        {/* Content */}
        <div
          style={{
            position: "relative",
            zIndex: 2,
            width: "100%",
            height: "100%",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            alignItems: "center",
            padding: "4rem clamp(2rem,8vw,7rem)",
            gap: "4rem",
          }}
        >
          {/* Left — branding */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
          >
            <svg viewBox="0 0 44 44" width="52" height="52">
              <defs>
                <linearGradient id="hub-g" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#F0D988" />
                  <stop offset="50%" stopColor="#C9A84C" />
                  <stop offset="100%" stopColor="#8A6820" />
                </linearGradient>
              </defs>
              <circle
                cx="22"
                cy="22"
                r="14"
                fill="none"
                stroke="url(#hub-g)"
                strokeWidth="1"
                opacity="0.6"
              />
              <polygon
                points="22,14 30,22 22,30 14,22"
                fill="none"
                stroke="url(#hub-g)"
                strokeWidth="1.3"
                opacity="0.9"
              />
              <polygon points="22,17 27,22 22,27 17,22" fill="url(#hub-g)" />
              <circle cx="22" cy="22" r="1.8" fill="#050402" opacity="0.6" />
            </svg>

            <div>
              <p
                style={{
                  color: "#C9A84C",
                  fontSize: "0.65rem",
                  letterSpacing: "0.42em",
                  textTransform: "uppercase",
                  fontFamily: "var(--font-montserrat)",
                  fontWeight: 700,
                  margin: "0 0 0.7rem",
                }}
              >
                Interactive Sales Deck
              </p>
              <h1
                style={{
                  color: "#ffffff",
                  fontSize: "clamp(2rem, 4.5vw, 3.8rem)",
                  fontWeight: 800,
                  fontFamily: "var(--font-montserrat)",
                  lineHeight: 1.0,
                  margin: "0 0 0.3rem",
                }}
              >
                Mall of
                <br />
                America
              </h1>
              <p
                style={{
                  color: "rgba(201,168,76,0.55)",
                  fontSize: "0.65rem",
                  letterSpacing: "0.28em",
                  textTransform: "uppercase",
                  fontFamily: "var(--font-montserrat)",
                  fontWeight: 600,
                  margin: 0,
                }}
              >
                Bloomington · Minnesota
              </p>
            </div>

            <div
              style={{
                width: "48px",
                height: "1px",
                background: "linear-gradient(to right, #C9A84C, transparent)",
              }}
            />

            <p
              style={{
                color: "rgba(255,255,255,0.35)",
                fontSize: "clamp(0.78rem, 1.2vw, 0.9rem)",
                fontFamily: "var(--font-montserrat)",
                fontWeight: 400,
                lineHeight: 1.75,
                margin: 0,
                maxWidth: "360px",
              }}
            >
              America&apos;s most iconic retail destination — 40M+ visitors,
              520+ brands, and world-class entertainment under one roof.
            </p>

            {/* Quick stats */}
            <div
              style={{
                display: "flex",
                gap: "2rem",
                marginTop: "0.5rem",
                flexWrap: "wrap",
              }}
            >
              {[
                { val: "40M+", label: "Annual Visitors" },
                { val: "520+", label: "Stores" },
                { val: "#1", label: "US Mall" },
              ].map((s) => (
                <div key={s.label}>
                  <div
                    style={{
                      color: "#C9A84C",
                      fontSize: "clamp(1.2rem,2vw,1.5rem)",
                      fontWeight: 800,
                      fontFamily: "var(--font-montserrat)",
                      lineHeight: 1,
                    }}
                  >
                    {s.val}
                  </div>
                  <div
                    style={{
                      color: "rgba(255,255,255,0.3)",
                      fontSize: "0.58rem",
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      fontFamily: "var(--font-montserrat)",
                      fontWeight: 600,
                      marginTop: "0.2rem",
                    }}
                  >
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — chapter menu */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
            <p
              style={{
                color: "rgba(255,255,255,0.22)",
                fontSize: "0.58rem",
                letterSpacing: "0.35em",
                textTransform: "uppercase",
                fontFamily: "var(--font-montserrat)",
                fontWeight: 600,
                margin: "0 0 1.2rem",
              }}
            >
              Explore
            </p>

            {SLIDES.map((slide, i) => (
              <button
                key={slide.id}
                onClick={() => enterDeck(i)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1.2rem",
                  background: "transparent",
                  border: "none",
                  borderTop: "1px solid rgba(201,168,76,0.08)",
                  padding: "1rem 0",
                  cursor: "pointer",
                  textAlign: "left",
                  width: "100%",
                  transition: "all 0.2s ease",
                  position: "relative",
                  overflow: "hidden",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget;
                  el.style.paddingLeft = "0.5rem";
                  el.style.borderTopColor = "rgba(201,168,76,0.3)";
                  const num = el.querySelector(".hub-num") as HTMLElement;
                  const label = el.querySelector(".hub-label") as HTMLElement;
                  const arrow = el.querySelector(".hub-arrow") as HTMLElement;
                  if (num) num.style.color = "#C9A84C";
                  if (label) label.style.color = "#ffffff";
                  if (arrow) arrow.style.opacity = "1";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget;
                  el.style.paddingLeft = "0";
                  el.style.borderTopColor = "rgba(201,168,76,0.08)";
                  const num = el.querySelector(".hub-num") as HTMLElement;
                  const label = el.querySelector(".hub-label") as HTMLElement;
                  const arrow = el.querySelector(".hub-arrow") as HTMLElement;
                  if (num) num.style.color = "rgba(201,168,76,0.4)";
                  if (label) label.style.color = "rgba(255,255,255,0.55)";
                  if (arrow) arrow.style.opacity = "0";
                }}
              >
                <span
                  className="hub-num"
                  style={{
                    color: "rgba(201,168,76,0.4)",
                    fontSize: "0.6rem",
                    fontWeight: 700,
                    letterSpacing: "0.18em",
                    fontFamily: "var(--font-montserrat)",
                    width: "26px",
                    flexShrink: 0,
                    transition: "color 0.2s ease",
                  }}
                >
                  {slide.chapter}
                </span>

                <span
                  className="hub-label"
                  style={{
                    color: "rgba(255,255,255,0.55)",
                    fontSize: "clamp(0.85rem, 1.4vw, 1rem)",
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    fontFamily: "var(--font-montserrat)",
                    transition: "color 0.2s ease",
                    flexGrow: 1,
                  }}
                >
                  {slide.label}
                </span>

                <span
                  className="hub-arrow"
                  style={{
                    color: "#C9A84C",
                    fontSize: "1rem",
                    opacity: 0,
                    transition: "opacity 0.2s ease",
                  }}
                >
                  →
                </span>
              </button>
            ))}

            {/* Last border */}
            <div style={{ borderTop: "1px solid rgba(201,168,76,0.08)" }} />
          </div>
        </div>

        {/* Mobile layout */}
        <style>{`
          @media (max-width: 768px) {
            .hub-grid { grid-template-columns: 1fr !important; padding: 2rem 1.5rem !important; gap: 2rem !important; overflow-y: auto; }
          }
        `}</style>
      </div>
    )
  }


  // ────────────────────────────────────────────────────────────────────
  // PHASE: DECK
  // ────────────────────────────────────────────────────────────────────
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#050402",
        overflow: "hidden",
        zIndex: 0,
      }}
    >
      {/* ── Slide viewport ── */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
        {/* Outgoing slide */}
        {prev !== null && isAnimating && (
          <div
            key={`prev-${prev}`}
            style={{
              position: "absolute",
              inset: 0,
              overflow: "hidden",
              animation: `slideOut${animDir === "next" ? "Left" : "Right"} 0.6s cubic-bezier(0.76,0,0.24,1) forwards`,
              zIndex: 1,
            }}
          >
            <div style={{ width: "100%", height: "100%", overflow: "auto" }}>
              {renderSlide(prev)}
            </div>
          </div>
        )}

        {/* Incoming slide */}
        <div
          key={`slide-${current}`}
          style={{
            position: "absolute",
            inset: 0,
            overflow: "hidden",
            animation: isAnimating
              ? `slideIn${animDir === "next" ? "Right" : "Left"} 0.6s cubic-bezier(0.76,0,0.24,1) forwards`
              : "none",
            zIndex: 2,
          }}
        >
          <div
            ref={(el) => {
              if (el && el !== scrollerEl) setScrollerEl(el);
            }}
            style={{ width: "100%", height: "100%", overflow: "auto" }}
          >
            <ScrollerContext.Provider value={scrollerEl}>
              {renderSlide(current)}
            </ScrollerContext.Provider>
          </div>
        </div>
      </div>

      {/* ── Top bar ── */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: "56px",
          zIndex: 50,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 1.4rem",
          background:
            "linear-gradient(to bottom, rgba(5,4,2,0.85), transparent)",
          backdropFilter: "none",
          pointerEvents: "none",
        }}
      >
        {/* Hamburger */}
        <button
          onClick={() => setMenuOpen((o) => !o)}
          style={{
            pointerEvents: "all",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "6px",
            display: "flex",
            flexDirection: "column",
            gap: "4px",
          }}
          aria-label="Open menu"
        >
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: "20px",
                height: "1.5px",
                background: "#C9A84C",
                transition: "all 0.25s ease",
                transform: menuOpen
                  ? i === 0
                    ? "rotate(45deg) translate(4px, 4px)"
                    : i === 1
                      ? "scaleX(0)"
                      : "rotate(-45deg) translate(4px, -4px)"
                  : "none",
              }}
            />
          ))}
        </button>

        {/* Logo center */}
        <div
          style={{
            pointerEvents: "all",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            cursor: "pointer",
          }}
          onClick={() => setPhase("hub")}
        >
          <svg viewBox="0 0 44 44" width="24" height="24">
            <defs>
              <linearGradient id="top-g" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F0D988" />
                <stop offset="100%" stopColor="#C9A84C" />
              </linearGradient>
            </defs>
            <circle
              cx="22"
              cy="22"
              r="14"
              fill="none"
              stroke="url(#top-g)"
              strokeWidth="1"
              opacity="0.6"
            />
            <polygon
              points="22,14 30,22 22,30 14,22"
              fill="none"
              stroke="url(#top-g)"
              strokeWidth="1.3"
            />
            <polygon points="22,17 27,22 22,27 17,22" fill="url(#top-g)" />
          </svg>
        </div>

        {/* Prev / Next arrows */}
        <div style={{ pointerEvents: "all", display: "flex", gap: "0.5rem" }}>
          <button
            onClick={goPrev}
            disabled={current === 0}
            style={{
              background: "none",
              border: "1px solid rgba(201,168,76,0.25)",
              color: current === 0 ? "rgba(201,168,76,0.2)" : "#C9A84C",
              width: "32px",
              height: "32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.9rem",
              cursor: current === 0 ? "default" : "pointer",
              transition: "all 0.2s ease",
            }}
            aria-label="Previous slide"
          >
            ‹
          </button>
          <button
            onClick={goNext}
            disabled={current === SLIDES.length - 1}
            style={{
              background: "none",
              border: "1px solid rgba(201,168,76,0.25)",
              color:
                current === SLIDES.length - 1
                  ? "rgba(201,168,76,0.2)"
                  : "#C9A84C",
              width: "32px",
              height: "32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.9rem",
              cursor: current === SLIDES.length - 1 ? "default" : "pointer",
              transition: "all 0.2s ease",
            }}
            aria-label="Next slide"
          >
            ›
          </button>
        </div>
      </div>

      {/* ── Right dot rail ── */}
      <nav
        style={{
          position: "fixed",
          right: "clamp(1rem,2.2vw,1.8rem)",
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 50,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: 0,
        }}
      >
        {/* Chapter counter */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            marginBottom: "1.2rem",
            gap: "2px",
          }}
        >
          <span
            style={{
              color: "#C9A84C",
              fontSize: "0.55rem",
              fontWeight: 800,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              fontFamily: "var(--font-montserrat)",
              lineHeight: 1,
            }}
          >
            {SLIDES[current]?.chapter}
          </span>
          <span
            style={{
              color: "rgba(255,255,255,0.18)",
              fontSize: "0.5rem",
              fontWeight: 600,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              fontFamily: "var(--font-montserrat)",
              lineHeight: 1,
            }}
          >
            / {String(SLIDES.length).padStart(2, "0")}
          </span>
        </div>

        {/* Dots */}
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
          }}
        >
          {/* Track line */}
          <div
            style={{
              position: "absolute",
              right: "6px",
              top: "6px",
              bottom: "6px",
              width: "1px",
              background: "rgba(201,168,76,0.12)",
              zIndex: 0,
            }}
          />
          {/* Progress fill */}
          <div
            style={{
              position: "absolute",
              right: "6px",
              top: "6px",
              width: "1px",
              height: `${(current / (SLIDES.length - 1)) * 100}%`,
              background:
                "linear-gradient(to bottom, #C9A84C, rgba(201,168,76,0.4))",
              zIndex: 0,
              transition: "height 0.5s cubic-bezier(0.4,0,0.2,1)",
            }}
          />

          {SLIDES.map((slide, i) => {
            const isActive = current === i;
            const isHovered = hoveredDot === i;
            const isPast = i < current;
            return (
              <button
                key={slide.id}
                onClick={() => goTo(i)}
                onMouseEnter={() => setHoveredDot(i)}
                onMouseLeave={() => setHoveredDot(null)}
                aria-label={`Go to ${slide.label}`}
                style={{
                  position: "relative",
                  zIndex: 1,
                  display: "flex",
                  alignItems: "center",
                  gap: "0.6rem",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "0.42rem 0",
                }}
              >
                <span
                  style={{
                    color: isActive ? "#C9A84C" : "rgba(255,255,255,0.45)",
                    fontFamily: "var(--font-montserrat)",
                    fontSize: "0.55rem",
                    fontWeight: isActive ? 700 : 500,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    opacity: isHovered || isActive ? 1 : 0,
                    transform:
                      isHovered || isActive
                        ? "translateX(0)"
                        : "translateX(6px)",
                    transition: "opacity 0.2s ease, transform 0.2s ease",
                    whiteSpace: "nowrap",
                    pointerEvents: "none",
                  }}
                >
                  {slide.label}
                </span>

                <span
                  style={{
                    flexShrink: 0,
                    width: isActive ? "13px" : isHovered ? "10px" : "6px",
                    height: isActive ? "13px" : isHovered ? "10px" : "6px",
                    borderRadius: "999px",
                    border: `1px solid ${
                      isActive
                        ? "#C9A84C"
                        : isHovered
                          ? "rgba(201,168,76,0.7)"
                          : isPast
                            ? "rgba(201,168,76,0.35)"
                            : "rgba(201,168,76,0.2)"
                    }`,
                    background: isActive
                      ? "#C9A84C"
                      : isPast
                        ? "rgba(201,168,76,0.25)"
                        : "transparent",
                    boxShadow: isActive
                      ? "0 0 0 3px rgba(201,168,76,0.12),0 0 12px rgba(201,168,76,0.3)"
                      : "none",
                    transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)",
                    display: "block",
                  }}
                />
              </button>
            );
          })}
        </div>

        {/* Section label */}
        <div style={{ marginTop: "1.2rem", textAlign: "right" }}>
          <span
            style={{
              color: "rgba(201,168,76,0.5)",
              fontSize: "0.5rem",
              fontWeight: 600,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              fontFamily: "var(--font-montserrat)",
              lineHeight: 1,
              transition: "color 0.3s ease",
            }}
          >
            {SLIDES[current]?.label}
          </span>
        </div>
      </nav>

      {/* ── Hamburger overlay menu ── */}
      {menuOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 40,
            background: "rgba(5,4,2,0.97)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            animation: "fadeIn 0.25s ease forwards",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0",
              width: "clamp(280px,50vw,480px)",
            }}
          >
            <p
              style={{
                color: "rgba(255,255,255,0.22)",
                fontSize: "0.58rem",
                letterSpacing: "0.35em",
                textTransform: "uppercase",
                fontFamily: "var(--font-montserrat)",
                fontWeight: 600,
                margin: "0 0 1.5rem",
              }}
            >
              Navigate
            </p>

            {SLIDES.map((slide, i) => (
              <button
                key={slide.id}
                onClick={() => {
                  goTo(i);
                  setMenuOpen(false);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1.5rem",
                  background: "transparent",
                  border: "none",
                  borderTop: "1px solid rgba(201,168,76,0.08)",
                  padding: "1.1rem 0",
                  cursor: "pointer",
                  textAlign: "left",
                  width: "100%",
                  transition: "padding-left 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.paddingLeft = "0.8rem";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.paddingLeft = "0";
                }}
              >
                <span
                  style={{
                    color: current === i ? "#C9A84C" : "rgba(201,168,76,0.35)",
                    fontSize: "0.6rem",
                    fontWeight: 700,
                    letterSpacing: "0.2em",
                    fontFamily: "var(--font-montserrat)",
                    width: "26px",
                    flexShrink: 0,
                  }}
                >
                  {slide.chapter}
                </span>
                <span
                  style={{
                    color: current === i ? "#C9A84C" : "rgba(255,255,255,0.6)",
                    fontSize: "clamp(1rem,2vw,1.3rem)",
                    fontWeight: 800,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    fontFamily: "var(--font-montserrat)",
                  }}
                >
                  {slide.label}
                </span>
                {current === i && (
                  <span
                    style={{
                      color: "#C9A84C",
                      fontSize: "0.6rem",
                      marginLeft: "auto",
                    }}
                  >
                    ◆
                  </span>
                )}
              </button>
            ))}
            <div style={{ borderTop: "1px solid rgba(201,168,76,0.08)" }} />

            <button
              onClick={() => {
                setPhase("hub");
                setMenuOpen(false);
              }}
              style={{
                marginTop: "2rem",
                background: "none",
                border: "1px solid rgba(201,168,76,0.2)",
                color: "rgba(201,168,76,0.6)",
                padding: "0.7rem 1.4rem",
                fontSize: "0.62rem",
                fontWeight: 700,
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                fontFamily: "var(--font-montserrat)",
                cursor: "pointer",
                alignSelf: "flex-start",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#C9A84C";
                e.currentTarget.style.color = "#C9A84C";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(201,168,76,0.2)";
                e.currentTarget.style.color = "rgba(201,168,76,0.6)";
              }}
            >
              ← Back to Hub
            </button>
          </div>
        </div>
      )}

      {/* ── Bottom mobile pill nav ── */}
      <nav
        style={{
          position: "fixed",
          bottom: "1.2rem",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 50,
          display: "none",
          alignItems: "center",
          gap: "0.5rem",
          padding: "0.55rem 1rem",
          background: "rgba(5,4,2,0.82)",
          border: "1px solid rgba(201,168,76,0.15)",
          borderRadius: "999px",
          backdropFilter: "blur(16px)",
        }}
        className="deck-mobile-pill"
      >
        {SLIDES.map((slide, i) => (
          <button
            key={slide.id}
            onClick={() => goTo(i)}
            aria-label={slide.label}
            style={{
              width: current === i ? "18px" : "6px",
              height: "6px",
              borderRadius: "999px",
              border: `1px solid ${current === i ? "#C9A84C" : i < current ? "rgba(201,168,76,0.4)" : "rgba(201,168,76,0.2)"}`,
              background:
                current === i
                  ? "#C9A84C"
                  : i < current
                    ? "rgba(201,168,76,0.2)"
                    : "transparent",
              cursor: "pointer",
              padding: 0,
              transition: "all 0.25s ease",
              flexShrink: 0,
            }}
          />
        ))}
      </nav>

      {/* ── Animations + responsive ── */}
      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0.4; }
          to   { transform: translateX(0);    opacity: 1; }
        }
        @keyframes slideOutLeft {
          from { transform: translateX(0);     opacity: 1; }
          to   { transform: translateX(-100%); opacity: 0.4; }
        }
        @keyframes slideInLeft {
          from { transform: translateX(-100%); opacity: 0.4; }
          to   { transform: translateX(0);     opacity: 1; }
        }
        @keyframes slideOutRight {
          from { transform: translateX(0);    opacity: 1; }
          to   { transform: translateX(100%); opacity: 0.4; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @media (max-width: 767px) {
          nav[style*="right:"] { display: none !important; }
          .deck-mobile-pill    { display: flex !important; }
        }
        html, body { overflow: hidden !important; }
      `}</style>
    </div>
  );
}
