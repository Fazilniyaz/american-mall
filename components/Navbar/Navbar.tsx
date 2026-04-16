"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const NAV_LINKS = [
  { label: "About",        href: "#numbers" },
  { label: "Who's Here",   href: "#whos-here" },
  { label: "Explore Mall", href: "#mall-map" },
  { label: "Entertainment",href: "#entertainment" },
  { label: "Events",       href: "#events" },
  { label: "Sponsorship",  href: "#sponsorship" },
];

export default function Navbar() {
  const navRef    = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    // Entrance animation
    gsap.fromTo(
      navRef.current,
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.9, ease: "power2.out", delay: 0.3 }
    );

    // Scroll-aware background
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = (href: string) => {
    setMenuOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      ref={navRef}
      style={{
        position:   "fixed",
        top: 0, left: 0, right: 0,
        zIndex:     100,
        padding:    "0 2.5rem",
        height:     "64px",
        display:    "flex",
        alignItems: "center",
        justifyContent: "space-between",
        transition: "background 0.4s ease, backdrop-filter 0.4s ease",
        background: scrolled
          ? "rgba(5, 4, 2, 0.82)"
          : "linear-gradient(to bottom, rgba(0,0,0,0.55), transparent)",
        backdropFilter: scrolled ? "blur(14px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(201,168,76,0.12)" : "none",
      }}
    >
      {/* Logo text only — mark is in hero */}
      <a
        href="#"
        onClick={e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
        style={{
          color:          "#C9A84C",
          fontSize:       "0.85rem",
          fontWeight:     800,
          letterSpacing:  "0.28em",
          textTransform:  "uppercase",
          fontFamily:     "var(--font-montserrat)",
          textDecoration: "none",
          flexShrink: 0,
        }}
      >
        Mall of America
      </a>

      {/* Desktop links */}
      <ul style={{
        display:    "flex",
        gap:        "2.2rem",
        listStyle:  "none",
        margin: 0, padding: 0,
      }}
        className="nav-desktop"
      >
        {NAV_LINKS.map(link => (
          <li key={link.href}>
            <button
              onClick={() => handleClick(link.href)}
              style={{
                background:     "none",
                border:         "none",
                color:          "rgba(255,255,255,0.72)",
                fontSize:       "0.72rem",
                fontWeight:     600,
                letterSpacing:  "0.18em",
                textTransform:  "uppercase",
                fontFamily:     "var(--font-montserrat)",
                cursor:         "pointer",
                padding:        "4px 0",
                borderBottom:   "1px solid transparent",
                transition:     "color 0.2s, border-color 0.2s",
              }}
              onMouseEnter={e => {
                (e.target as HTMLElement).style.color = "#C9A84C";
                (e.target as HTMLElement).style.borderBottomColor = "#C9A84C";
              }}
              onMouseLeave={e => {
                (e.target as HTMLElement).style.color = "rgba(255,255,255,0.72)";
                (e.target as HTMLElement).style.borderBottomColor = "transparent";
              }}
            >
              {link.label}
            </button>
          </li>
        ))}
      </ul>

      {/* CTA button */}
      <button
        style={{
          background:    "transparent",
          border:        "1px solid #C9A84C",
          color:         "#C9A84C",
          fontSize:      "0.68rem",
          fontWeight:    700,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          fontFamily:    "var(--font-montserrat)",
          padding:       "8px 20px",
          cursor:        "pointer",
          transition:    "background 0.25s, color 0.25s",
          flexShrink:    0,
        }}
        onMouseEnter={e => {
          (e.target as HTMLElement).style.background = "#C9A84C";
          (e.target as HTMLElement).style.color = "#000";
        }}
        onMouseLeave={e => {
          (e.target as HTMLElement).style.background = "transparent";
          (e.target as HTMLElement).style.color = "#C9A84C";
        }}
        onClick={() => handleClick("#cta")}
      >
        Get in Touch
      </button>

      {/* Mobile hamburger */}
      <button
        className="nav-mobile-btn"
        onClick={() => setMenuOpen(p => !p)}
        style={{
          display:    "none",
          background: "none",
          border:     "none",
          cursor:     "pointer",
          padding:    "4px",
          flexDirection: "column",
          gap: "5px",
        }}
        aria-label="Toggle menu"
      >
        {[0,1,2].map(i => (
          <span key={i} style={{
            display: "block",
            width: "22px", height: "1.5px",
            background: "#C9A84C",
            transition: "transform 0.2s",
          }} />
        ))}
      </button>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div style={{
          position:   "absolute",
          top:        "64px",
          left: 0, right: 0,
          background: "rgba(5,4,2,0.96)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(201,168,76,0.15)",
          padding:    "1.5rem 2.5rem",
          display:    "flex",
          flexDirection: "column",
          gap:        "1.2rem",
        }}>
          {NAV_LINKS.map(link => (
            <button
              key={link.href}
              onClick={() => handleClick(link.href)}
              style={{
                background:    "none",
                border:        "none",
                color:         "rgba(255,255,255,0.8)",
                fontSize:      "0.8rem",
                fontWeight:    600,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                fontFamily:    "var(--font-montserrat)",
                cursor:        "pointer",
                textAlign:     "left",
                padding:       "4px 0",
              }}
            >
              {link.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}