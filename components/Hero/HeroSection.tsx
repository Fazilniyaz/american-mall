"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import HeroStats from "./HeroStats";

// Three.js — never on mobile, lazy on desktop!
const ParticleCanvas = dynamic(() => import("./ParticleCanvas"), { ssr: false });

export default function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const [videoReady, setVideoReady] = useState(false);

  // Detect desktop AFTER hydration - only affects video/particles, not the LCP poster
  useEffect(() => {
    setIsDesktop(window.matchMedia("(min-width: 769px)").matches);
  }, []);

  // Load video AFTER the <video> element mounts, only on desktop, only on idle
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
      id="hero"
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        overflow: "hidden",
        background: "#000",
      }}
    >
      {/* ── DESKTOP: gradient fallback while video loads ── */}
      <div
        className="hero-desktop-bg"
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          background: "radial-gradient(ellipse at 60% 40%, #1a1408 0%, #000 70%)",
        }}
      />

      {/*
        ── MOBILE: poster image — ALWAYS RENDERED (SSR + hydration) ──────────
        Uses Next.js <Image> for automatic WebP/AVIF conversion + responsive sizing.
        CSS class hides on desktop. The fill + priority props ensure it's the LCP element.
      */}
      <div className="hero-poster-mobile" style={{ position: "absolute", inset: 0, zIndex: 1 }}>
        <Image
          src="/photos/hero-poster.jpg"
          alt="Mall of America interior"
          fill
          priority
          sizes="100vw"
          quality={75}
          style={{
            objectFit: "cover",
          }}
        />
      </div>

      {/* ── DESKTOP: lazy-loaded video ── */}
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

      {/* ── Responsive: hide poster on desktop, hide gradient on mobile ── */}
      <style>{`
        /* Mobile: poster visible, desktop gradient hidden */
        .hero-poster-mobile { display: block; }
        .hero-desktop-bg { display: none; }

        /* Desktop: poster hidden (not downloaded thanks to <picture>),
           gradient visible as fallback behind video */
        @media (min-width: 769px) {
          .hero-poster-mobile { display: none; }
          .hero-desktop-bg { display: block; }
        }
      `}</style>
    </section>
  );
}