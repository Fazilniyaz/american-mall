"use client";

import { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import MallLogo from "./MallLogo";

const stats = [
  { value: "40M+",  label: "Annual Visitors" },
  { value: "520+",  label: "Stores & Restaurants" },
  { value: "5.6M",  label: "Square Feet" },
  { value: "#1",    label: "Most Visited Mall in America" },
];

const SHUFFLE_CHARS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ#@$%&+";

function useShuffleText(originalText: string) {
  const rafRef  = useRef<number | null>(null);
  const iterRef = useRef(0);
  const runRef  = useRef(false);

  const shuffle = useCallback((el: HTMLElement, onComplete?: () => void) => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    iterRef.current = 0;
    runRef.current  = true;
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
  const valueRef  = useRef<HTMLDivElement>(null);
  const labelRef  = useRef<HTMLDivElement>(null);
  const borderRef = useRef<HTMLDivElement>(null);
  const { shuffle, cancel } = useShuffleText(value);

  const onEnter = useCallback(() => {
    if (!valueRef.current || !labelRef.current || !borderRef.current) return;
    shuffle(valueRef.current);
    gsap.killTweensOf(labelRef.current);
    gsap.to(labelRef.current, {
      y: -5, opacity: 0.45, letterSpacing: "0.28em",
      duration: 0.28, ease: "power2.out",
      yoyo: true, repeat: 1,
      onComplete: () =>
        gsap.to(labelRef.current, { y: 0, opacity: 1, letterSpacing: "0.1em", duration: 0.38, ease: "power2.inOut" }),
    });
    gsap.killTweensOf(borderRef.current);
    gsap.to(borderRef.current, { opacity: 1, scaleY: 1.18, duration: 0.22, ease: "power2.out" });
    gsap.killTweensOf(valueRef.current);
    gsap.to(valueRef.current, { scale: 1.07, duration: 0.22, ease: "power2.out" });
  }, [shuffle]);

  const onLeave = useCallback(() => {
    if (!valueRef.current || !labelRef.current || !borderRef.current) return;
    cancel(valueRef.current);
    gsap.killTweensOf(labelRef.current);
    gsap.to(labelRef.current, { y: 0, opacity: 1, letterSpacing: "0.1em", duration: 0.38, ease: "power2.inOut" });
    gsap.killTweensOf(borderRef.current);
    gsap.to(borderRef.current, { opacity: 0.55, scaleY: 1, duration: 0.32, ease: "power2.inOut" });
    gsap.killTweensOf(valueRef.current);
    gsap.to(valueRef.current, { scale: 1, duration: 0.32, ease: "power2.inOut" });
  }, [cancel]);

  return (
    <div
      className="stat-item"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      style={{ paddingLeft: "1.4rem", position: "relative", cursor: "default", userSelect: "none" }}
    >
      <div
        ref={borderRef}
        style={{
          position: "absolute", left: 0, top: "50%",
          transform: "translateY(-50%)",
          width: "2px", height: "78%",
          background: "linear-gradient(to bottom, #C9A84C, rgba(201,168,76,0.25))",
          opacity: 0.55, transformOrigin: "center",
          willChange: "transform, opacity",
        }}
      />
      <div
        ref={valueRef}
        style={{
          color: "#C9A84C",
          fontSize: "clamp(1.75rem, 3.2vw, 2.7rem)",
          fontWeight: 800,
          fontFamily: "var(--font-montserrat)",
          lineHeight: 1,
          willChange: "transform",
          transformOrigin: "left center",
          fontVariantNumeric: "tabular-nums",
          minWidth: "4ch",
        }}
      >
        {value}
      </div>
      <div
        ref={labelRef}
        style={{
          color: "rgba(255,255,255,0.7)",
          fontSize: "clamp(0.62rem, 1.1vw, 0.82rem)",
          marginTop: "0.35rem",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          fontFamily: "var(--font-montserrat)",
          fontWeight: 500,
          willChange: "transform, opacity",
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
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".stat-item",
        { opacity: 0, y: 36 },
        { opacity: 1, y: 0, duration: 0.75, ease: "power2.out", stagger: 0.18, delay: 1.4 }
      );
      gsap.fromTo(
        ".hero-tagline",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out", delay: 1.0 }
      );
    }, wrapRef);
    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={wrapRef}
      style={{
        position: "absolute", inset: 0, zIndex: 3,
        display: "flex", flexDirection: "column",
        justifyContent: "center", alignItems: "center",
        padding: "0 2rem",
      }}
    >
      {/* Gradient overlay */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(160deg, rgba(0,0,0,0.22) 0%, rgba(0,0,0,0.62) 100%)",
        zIndex: -1,
      }} />

      {/* Logo mark + wordmark inline */}
      <MallLogo />

      {/* Tagline */}
      <p
        className="hero-tagline"
        style={{
          color: "rgba(255,255,255,0.5)",
          fontSize: "clamp(0.7rem, 1.3vw, 0.95rem)",
          letterSpacing: "0.38em",
          textTransform: "uppercase",
          fontFamily: "var(--font-montserrat)",
          fontWeight: 400,
          marginBottom: "3rem",
          marginTop: "-0.4rem",
        }}
      >
        America&apos;s most iconic retail destination
      </p>

      {/* Stats row */}
      <div style={{
        display: "flex",
        gap: "clamp(1.4rem, 3.8vw, 3.8rem)",
        flexWrap: "wrap",
        justifyContent: "center",
      }}>
        {stats.map((s) => (
          <StatItem key={s.value} value={s.value} label={s.label} />
        ))}
      </div>

      {/* Scroll indicator */}
      <div style={{
        position: "absolute", bottom: "2rem",
        display: "flex", flexDirection: "column",
        alignItems: "center", gap: "0.5rem",
        color: "rgba(255,255,255,0.4)",
        fontSize: "0.65rem", letterSpacing: "0.25em",
        textTransform: "uppercase",
        fontFamily: "var(--font-montserrat)", fontWeight: 500,
      }}>
        <span>Scroll</span>
        <div style={{
          width: "1px", height: "38px",
          background: "linear-gradient(to bottom, rgba(255,255,255,0.45), transparent)",
        }} />
      </div>
    </div>
  );
}