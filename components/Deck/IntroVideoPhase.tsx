"use client";

import { useRef, useState, useCallback } from "react";

interface Props {
  onSkip: () => void;
}

export default function IntroVideoPhase({ onSkip }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [soundOn, setSoundOn] = useState(false);

  const toggleSound = useCallback(() => {
    const next = !soundOn;
    setSoundOn(next);
    if (videoRef.current) videoRef.current.muted = !next;
  }, [soundOn]);

  // Button shared style
  const btnStyle: React.CSSProperties = {
    background: "transparent",
    border: "1px solid rgba(201,168,76,0.6)",
    color: "#C9A84C",
    padding: "0.55rem 1rem",
    fontSize: "clamp(0.5rem, 0.75vw, 0.62rem)",
    fontWeight: 700,
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    fontFamily: "var(--font-montserrat)",
    cursor: "pointer",
    whiteSpace: "nowrap",
    transition: "all 0.2s ease",
    width: "clamp(80px, 9vw, 115px)",
    textAlign: "center",
    display: "block",
  };

  return (
    <div style={{
      position: "fixed", inset: 0,
      background: "#000", zIndex: 1000,
      display: "flex", alignItems: "stretch",
    }}>

      {/* LEFT PANEL — Logo */}
      <div style={{
        width: "clamp(60px, 9vw, 130px)",
        flexShrink: 0, background: "#000",
        display: "flex", flexDirection: "column",
        alignItems: "center", paddingTop: "1.2rem",
        zIndex: 10,
      }}>
        <div style={{
          width: "clamp(36px, 4.5vw, 52px)",
          height: "clamp(36px, 4.5vw, 52px)",
          borderRadius: "50%",
          border: "1.5px solid rgba(201,168,76,0.6)",
          display: "flex", alignItems: "center",
          justifyContent: "center",
          background: "rgba(201,168,76,0.06)",
        }}>
          <svg viewBox="0 0 44 44"
            width="clamp(24px, 3vw, 36px)"
            height="clamp(24px, 3vw, 36px)"
          >
            <defs>
              <linearGradient id="iv-g" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F0D988" />
                <stop offset="100%" stopColor="#C9A84C" />
              </linearGradient>
            </defs>
            <circle cx="22" cy="22" r="14"
              fill="none" stroke="url(#iv-g)"
              strokeWidth="1.2" opacity="0.9"
            />
            <polygon points="22,14 30,22 22,30 14,22"
              fill="none" stroke="url(#iv-g)" strokeWidth="1.5"
            />
            <polygon points="22,17 27,22 22,27 17,22" fill="url(#iv-g)" />
            <circle cx="22" cy="22" r="1.8" fill="#000" opacity="0.6" />
          </svg>
        </div>
      </div>

      {/* CENTER — Video */}
      <div style={{
        flex: 1, position: "relative",
        overflow: "hidden", background: "#000",
      }}>
        <video
          ref={videoRef}
          autoPlay muted={!soundOn}
          loop={false} playsInline controls preload="none"
          src="/videos/videoplayback.mp4"
          onEnded={onSkip}
          style={{
            width: "100%", height: "100%",
            objectFit: "cover", display: "block",
          }}
        />
      </div>

      {/* RIGHT PANEL — Buttons at bottom */}
      <div style={{
        width: "clamp(60px, 9vw, 130px)",
        flexShrink: 0, background: "#000",
        display: "flex", flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-end",   /* ← bottom aligned — reference style */
        paddingBottom: "clamp(3rem, 8vh, 5rem)",
        gap: "0.5rem", zIndex: 10,
      }}>

        <button
          onClick={toggleSound}
          style={btnStyle}
          onMouseEnter={e => {
            (e.target as HTMLElement).style.background = "rgba(201,168,76,0.12)";
            (e.target as HTMLElement).style.borderColor = "#C9A84C";
          }}
          onMouseLeave={e => {
            (e.target as HTMLElement).style.background = "transparent";
            (e.target as HTMLElement).style.borderColor = "rgba(201,168,76,0.6)";
          }}
        >
          {soundOn ? "Sound Off" : "Sound On"}
        </button>

        <button
          onClick={onSkip}
          style={btnStyle}
          onMouseEnter={e => {
            (e.target as HTMLElement).style.background = "rgba(201,168,76,0.12)";
            (e.target as HTMLElement).style.borderColor = "#C9A84C";
          }}
          onMouseLeave={e => {
            (e.target as HTMLElement).style.background = "transparent";
            (e.target as HTMLElement).style.borderColor = "rgba(201,168,76,0.6)";
          }}
        >
          Skip Intro
        </button>
      </div>

      {/* Mobile adjustments */}
      <style>{`
        @media (max-width: 600px) {
          video { object-fit: contain !important; }
        }
      `}</style>
    </div>
  );
}