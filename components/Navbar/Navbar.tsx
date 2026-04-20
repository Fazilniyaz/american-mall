"use client";

import { useEffect, useRef, useState } from "react";

const NAV_LINKS = [
  { label: "Intro", href: "#hero" },
  { label: "Scale", href: "#numbers" },
  { label: "Who's Here", href: "#whos-here" },
  { label: "Mall", href: "#mall-map" },
  { label: "Entertainment", href: "#entertainment" },
  { label: "Events", href: "#events" },
  { label: "Sponsorship", href: "#sponsorship" },
  { label: "Close", href: "#cta" },
];

export default function Navbar() {
  const [activeId, setActiveId] = useState("hero");
  const ratiosRef = useRef<Record<string, number>>({});

  useEffect(() => {
    const targets = NAV_LINKS
      .map(link => document.querySelector(link.href))
      .filter((element): element is Element => Boolean(element));

    if (!targets.length) return;

    // Keep visibility ratios for every section so active state does not get stuck
    // when IntersectionObserver reports only a subset of entries.
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          ratiosRef.current[entry.target.id] = entry.isIntersecting ? entry.intersectionRatio : 0;
        });

        let nextId = "hero";
        let bestRatio = 0;

        for (const [id, ratio] of Object.entries(ratiosRef.current)) {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            nextId = id;
          }
        }

        setActiveId(prev => (prev === nextId ? prev : nextId));
      },
      {
        rootMargin: "-40% 0px -40% 0px",
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7],
      }
    );

    targets.forEach(target => observer.observe(target));
    return () => observer.disconnect();
  }, []);

  const handleClick = (href: string) => {
    const target = document.querySelector(href);
    if (!target) return;
    (target as HTMLElement).scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const railButtonStyle = (isActive: boolean): React.CSSProperties => ({
    width: "var(--deck-dot-size)",
    height: "var(--deck-dot-size)",
    borderRadius: "999px",
    border: `1px solid ${isActive ? "#C9A84C" : "rgba(201,168,76,0.26)"}`,
    background: isActive ? "#C9A84C" : "transparent",
    boxShadow: isActive ? "0 0 0 var(--deck-dot-ring) rgba(201,168,76,0.12)" : "none",
    cursor: "pointer",
    display: "block",
    padding: 0,
    transition: "transform 0.18s ease, background 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease",
  });

  return (
    <nav
      className="deck-nav-root"
      aria-label="Deck sections"
      style={{
        position: "fixed",
        right: "clamp(0.8rem, 2vw, 1.4rem)",
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 100,
        pointerEvents: "none",
      }}
    >
      <div
        className="deck-nav-desktop"
        style={{
          pointerEvents: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "var(--deck-dot-gap)",
          alignItems: "flex-end",
        }}
      >
        {NAV_LINKS.map(link => {
          const id = link.href.slice(1);
          const isActive = activeId === id;

          return (
            <button
              key={link.href}
              onClick={() => handleClick(link.href)}
              aria-label={link.label}
              title={link.label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.55rem",
                background: "none",
                border: "none",
                padding: 0,
                color: "#fff",
                cursor: "pointer",
              }}
            >
              <span
                className="deck-nav-label"
                style={{
                  color: isActive ? "#C9A84C" : "rgba(255,255,255,0.35)",
                  fontFamily: "var(--font-montserrat)",
                  fontSize: "var(--deck-label-size)",
                  fontWeight: 700,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  opacity: 0,
                  transform: "translateX(8px)",
                  transition: "opacity 0.18s ease, transform 0.18s ease",
                  pointerEvents: "none",
                }}
              >
                {link.label}
              </span>
              <span style={railButtonStyle(isActive)} className="deck-nav-dot" />
            </button>
          );
        })}
      </div>

      <div className="deck-nav-mobile" style={{ pointerEvents: "auto", display: "none" }}>
        {NAV_LINKS.map(link => {
          const id = link.href.slice(1);
          const isActive = activeId === id;

          return (
            <button
              key={link.href}
              onClick={() => handleClick(link.href)}
              aria-label={link.label}
              title={link.label}
              style={railButtonStyle(isActive)}
            />
          );
        })}
      </div>

      <style>{`
        .deck-nav-root {
          --deck-dot-size: 14px;
          --deck-dot-ring: 3px;
          --deck-dot-gap: 0.7rem;
          --deck-label-size: 0.56rem;
        }

        .deck-nav-desktop button:hover .deck-nav-label,
        .deck-nav-desktop button:focus-visible .deck-nav-label {
          opacity: 1;
          transform: translateX(0);
        }

        .deck-nav-desktop button:hover .deck-nav-dot,
        .deck-nav-desktop button:focus-visible .deck-nav-dot {
          transform: scale(1.12);
        }

        @media (max-width: 1200px) {
          .deck-nav-root {
            --deck-dot-size: 12px;
            --deck-dot-ring: 2px;
            --deck-dot-gap: 0.58rem;
            --deck-label-size: 0.52rem;
          }
        }

        @media (max-width: 980px), (max-height: 760px) {
          .deck-nav-root {
            --deck-dot-size: 11px;
            --deck-dot-ring: 2px;
            --deck-dot-gap: 0.5rem;
          }

          .deck-nav-label {
            display: none !important;
          }
        }

        @media (max-width: 767px) {
          .deck-nav-root {
            right: auto !important;
            left: 50% !important;
            top: auto !important;
            bottom: 1rem !important;
            transform: translateX(-50%) !important;
            --deck-dot-size: 10px;
            --deck-dot-gap: 0.55rem;
            --deck-dot-ring: 2px;
          }

          .deck-nav-desktop { display: none !important; }
          .deck-nav-mobile {
            display: flex !important;
            gap: var(--deck-dot-gap);
            align-items: center;
            justify-content: center;
            padding: 0.55rem 0.75rem;
            border: 1px solid rgba(201,168,76,0.14);
            border-radius: 999px;
            background: rgba(5,4,2,0.72);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
          }
        }
      `}</style>
    </nav>
  );
}
