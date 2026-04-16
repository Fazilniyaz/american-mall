"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import HeroStats from "./HeroStats";

// Three.js — never on mobile, lazy on desktop
const ParticleCanvas = dynamic(() => import("./ParticleCanvas"), { ssr: false });

export default function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const [videoReady, setVideoReady] = useState(false);

  // Step 1: Detect desktop once on client
  useEffect(() => {
    setIsDesktop(window.matchMedia("(min-width: 769px)").matches);
  }, []);

  // Step 2: Load video AFTER the <video> element mounts (which happens
  // after the re-render triggered by setIsDesktop(true) above)
  useEffect(() => {
    if (!isDesktop || !videoRef.current) return;

    const video = videoRef.current;

    const loadVideo = () => {
      video.src = "/videos/videoplayback.mp4";
      video.load();
    };

    if ("requestIdleCallback" in window) {
      (window as Window & typeof globalThis).requestIdleCallback(loadVideo, { timeout: 2000 });
    } else {
      const t = setTimeout(loadVideo, 1500);
      return () => clearTimeout(t);
    }
  }, [isDesktop]);

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
      {/* ── POSTER IMAGE: Always rendered in SSR for instant LCP ── */}
      {/* On mobile this is the permanent background;
          on desktop it's the fallback while video loads */}
      <img
        src="/photos/hero-poster.jpg"
        alt=""
        width={1920}
        height={1080}
        fetchPriority="high"
        decoding="async"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: 1,
          // Hide poster once desktop video is playing
          opacity: isDesktop && videoReady ? 0 : 1,
          transition: "opacity 0.8s ease",
        }}
      />

      {/* ── DESKTOP: lazy-loaded video (only mounts after hydration) ── */}
      {isDesktop && (
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="none"
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

      {/* ── Three.js particles — desktop only ── */}
      {isDesktop && <ParticleCanvas />}

      {/* ── Text + Stats — always rendered ── */}
      <HeroStats />
    </section>
  );
}