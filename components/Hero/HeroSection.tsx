"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import HeroStats from "./HeroStats";

// Three.js — never on mobile, lazy on desktop
const ParticleCanvas = dynamic(() => import("./ParticleCanvas"), { ssr: false });

export default function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    // Detect mobile once on client
    const mobile = window.matchMedia("(max-width: 768px)").matches;
    setIsMobile(mobile);

    if (mobile || !videoRef.current) return;

    const video = videoRef.current;

    // Defer video load until after page is interactive
    // This prevents video from blocking LCP
    const loadVideo = () => {
      video.src = "/videos/videoplayback.mp4";
      video.load();
    };

    // Use requestIdleCallback if available, else 2s timeout
    if ("requestIdleCallback" in window) {
      (window as Window & typeof globalThis).requestIdleCallback(loadVideo, { timeout: 2000 });
    } else {
      const t = setTimeout(loadVideo, 1500);
      return () => clearTimeout(t);
    }
  }, []);

  const handleVideoReady = () => setVideoReady(true);

  return (
    <section
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        overflow: "hidden",
        background: "#000",
      }}
    >
      {/* ── MOBILE: static poster image (no video, no WebGL) ── */}
      {isMobile && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 1,
            backgroundImage: "url('/photos/hero-poster.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      )}

      {/* ── DESKTOP: lazy-loaded video ── */}
      {!isMobile && (
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          poster="/photos/hero-poster.jpg"
          playsInline
          preload="none"          // ← critical: don't block page load
          onCanPlay={handleVideoReady}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            zIndex: 1,
            opacity: videoReady ? 1 : 0,
            transition: "opacity 0.8s ease",
          }}
        />
      )}

      {/* Fallback black bg while video loads on desktop */}
      {!isMobile && !videoReady && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 1,
            background: "radial-gradient(ellipse at 60% 40%, #1a1408 0%, #000 70%)",
          }}
        />
      )}

      {/* ── Three.js particles — desktop only ── */}
      {!isMobile && <ParticleCanvas />}

      {/* ── Text + Stats — always rendered ── */}
      <HeroStats />
    </section>
  );

}