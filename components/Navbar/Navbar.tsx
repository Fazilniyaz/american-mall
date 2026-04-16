"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const NAV_LINKS = [
  { label: "About",         href: "#numbers" },
  { label: "Who's Here",    href: "#whos-here" },
  { label: "Explore Mall",  href: "#mall-map" },
  { label: "Entertainment", href: "#entertainment" },
  { label: "Events",        href: "#events" },
  { label: "Sponsorship",   href: "#sponsorship" },
];

export default function Navbar() {
  const navRef    = useRef<HTMLElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);

  // ── Entrance animation ─────────────────────────────────────────────
  useEffect(() => {
    gsap.fromTo(
      navRef.current,
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.9, ease: "power2.out", delay: 0.3 }
    );
  }, []);

  // ── Scroll-aware background ────────────────────────────────────────
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ── Drawer open/close animation ───────────────────────────────────
  useEffect(() => {
    if (!drawerRef.current) return;
    if (menuOpen) {
      gsap.fromTo(
        drawerRef.current,
        { opacity: 0, y: -12 },
        { opacity: 1, y: 0, duration: 0.28, ease: "power2.out" }
      );
    }
  }, [menuOpen]);

  // ── Close drawer on resize to desktop ─────────────────────────────
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false);
    };
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // ── Lock body scroll when drawer open ─────────────────────────────
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const handleClick = (href: string) => {
    setMenuOpen(false);
    setTimeout(() => {
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    }, 60);
  };

  const scrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ── Hamburger bar style helper ────────────────────────────────────
  const barStyle = (rotate: string, translateY: string, opacity = 1): React.CSSProperties => ({
    display:    "block",
    width:      "22px",
    height:     "1.5px",
    background: "#C9A84C",
    transition: "transform 0.28s ease, opacity 0.2s ease",
    transform:  menuOpen ? `${rotate} ${translateY}` : "none",
    opacity:    menuOpen && opacity === 0 ? 0 : 1,
  });

  return (
    <>
      {/* ── Main nav bar ─────────────────────────────────────────── */}
      <nav
        ref={navRef}
        style={{
          position:       "fixed",
          top: 0, left: 0, right: 0,
          zIndex:         100,
          height:         "60px",
          display:        "flex",
          alignItems:     "center",
          justifyContent: "space-between",
          padding:        "0 1.5rem",
          transition:     "background 0.4s ease, backdrop-filter 0.4s ease, border-color 0.4s ease",
          background:     scrolled
            ? "rgba(5, 4, 2, 0.88)"
            : "linear-gradient(to bottom, rgba(0,0,0,0.6), transparent)",
          backdropFilter: scrolled ? "blur(14px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(14px)" : "none",
          borderBottom:   scrolled ? "1px solid rgba(201,168,76,0.14)" : "none",
        }}
      >
        {/* Logo wordmark — always visible */}
        <a
          href="#"
          onClick={scrollToTop}
          style={{
            color:          "#C9A84C",
            fontSize:       "0.82rem",
            fontWeight:     800,
            letterSpacing:  "0.26em",
            textTransform:  "uppercase",
            fontFamily:     "var(--font-montserrat)",
            textDecoration: "none",
            flexShrink:     0,
            lineHeight:     1,
          }}
        >
          Mall of America
        </a>

        {/* ── Desktop nav links (hidden on mobile via CSS) ── */}
        <ul
          style={{
            display:    "flex",
            gap:        "2rem",
            listStyle:  "none",
            margin:     0,
            padding:    0,
          }}
          className="nav-desktop-links"
        >
          {NAV_LINKS.map(link => (
            <li key={link.href}>
              <button
                onClick={() => handleClick(link.href)}
                style={{
                  background:    "none",
                  border:        "none",
                  color:         "rgba(255,255,255,0.72)",
                  fontSize:      "0.7rem",
                  fontWeight:    600,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  fontFamily:    "var(--font-montserrat)",
                  cursor:        "pointer",
                  padding:       "4px 0",
                  borderBottom:  "1px solid transparent",
                  transition:    "color 0.2s, border-color 0.2s",
                  whiteSpace:    "nowrap",
                }}
                onMouseEnter={e => {
                  (e.currentTarget).style.color = "#C9A84C";
                  (e.currentTarget).style.borderBottomColor = "#C9A84C";
                }}
                onMouseLeave={e => {
                  (e.currentTarget).style.color = "rgba(255,255,255,0.72)";
                  (e.currentTarget).style.borderBottomColor = "transparent";
                }}
              >
                {link.label}
              </button>
            </li>
          ))}
        </ul>

        {/* ── Desktop CTA (hidden on mobile via CSS) ── */}
        <button
          onClick={() => handleClick("#cta")}
          style={{
            background:    "transparent",
            border:        "1px solid #C9A84C",
            color:         "#C9A84C",
            fontSize:      "0.66rem",
            fontWeight:    700,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            fontFamily:    "var(--font-montserrat)",
            padding:       "7px 18px",
            cursor:        "pointer",
            transition:    "background 0.22s, color 0.22s",
            flexShrink:    0,
            whiteSpace:    "nowrap",
          }}
          onMouseEnter={e => {
            (e.currentTarget).style.background = "#C9A84C";
            (e.currentTarget).style.color = "#000";
          }}
          onMouseLeave={e => {
            (e.currentTarget).style.background = "transparent";
            (e.currentTarget).style.color = "#C9A84C";
          }}
          className="nav-desktop-cta"
        >
          Get in Touch
        </button>

        {/* ── Mobile hamburger (hidden on desktop via CSS) ── */}
        <button
          onClick={() => setMenuOpen(p => !p)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          style={{
            background: "none",
            border:     "none",
            cursor:     "pointer",
            padding:    "6px",
            display:    "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap:        "5px",
          }}
          className="nav-mobile-btn"
        >
          {/* Animated hamburger → X */}
          <span style={{
            ...barStyle("rotate(45deg)", "translateY(6.5px)"),
          }} />
          <span style={{
            display:    "block",
            width:      "22px",
            height:     "1.5px",
            background: "#C9A84C",
            transition: "opacity 0.18s ease",
            opacity:    menuOpen ? 0 : 1,
          }} />
          <span style={{
            ...barStyle("rotate(-45deg)", "translateY(-6.5px)"),
          }} />
        </button>
      </nav>

      {/* ── Mobile full-screen drawer overlay ─────────────────────── */}
      {menuOpen && (
        <div
          ref={drawerRef}
          style={{
            position:   "fixed",
            top:        "60px",   // sits right below navbar
            left:       0,
            right:      0,
            bottom:     0,        // fills remaining screen — no push
            zIndex:     99,
            background: "rgba(4, 3, 1, 0.97)",
            backdropFilter:       "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            borderTop:  "1px solid rgba(201,168,76,0.12)",
            display:    "flex",
            flexDirection: "column",
            padding:    "2.5rem 2rem",
            gap:        0,
            overflowY:  "auto",
          }}
        >
          {/* Nav links */}
          {NAV_LINKS.map((link, i) => (
            <button
              key={link.href}
              onClick={() => handleClick(link.href)}
              style={{
                background:    "none",
                border:        "none",
                borderBottom:  "1px solid rgba(201,168,76,0.08)",
                color:         "rgba(255,255,255,0.82)",
                fontSize:      "0.9rem",
                fontWeight:    600,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                fontFamily:    "var(--font-montserrat)",
                cursor:        "pointer",
                textAlign:     "left",
                padding:       "1.1rem 0",
                width:         "100%",
                transition:    "color 0.2s",
              }}
              onMouseEnter={e => (e.currentTarget).style.color = "#C9A84C"}
              onMouseLeave={e => (e.currentTarget).style.color = "rgba(255,255,255,0.82)"}
            >
              <span style={{
                color:        "rgba(201,168,76,0.4)",
                fontSize:     "0.6rem",
                marginRight:  "0.8rem",
                fontWeight:   700,
                letterSpacing: "0",
              }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              {link.label}
            </button>
          ))}

          {/* CTA inside drawer */}
          <button
            onClick={() => handleClick("#cta")}
            style={{
              marginTop:     "2rem",
              background:    "transparent",
              border:        "1px solid #C9A84C",
              color:         "#C9A84C",
              fontSize:      "0.75rem",
              fontWeight:    700,
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              fontFamily:    "var(--font-montserrat)",
              padding:       "14px 0",
              cursor:        "pointer",
              width:         "100%",
              transition:    "background 0.22s, color 0.22s",
            }}
            onMouseEnter={e => {
              (e.currentTarget).style.background = "#C9A84C";
              (e.currentTarget).style.color = "#000";
            }}
            onMouseLeave={e => {
              (e.currentTarget).style.background = "transparent";
              (e.currentTarget).style.color = "#C9A84C";
            }}
          >
            Get in Touch
          </button>
        </div>
      )}

      {/* ── Responsive CSS via style tag ─────────────────────────── */}
      <style>{`
        /* Desktop: show links + CTA, hide hamburger */
        @media (min-width: 768px) {
          .nav-mobile-btn        { display: none !important; }
          .nav-desktop-links     { display: flex !important; }
          .nav-desktop-cta       { display: block !important; }
        }

        /* Mobile: hide links + CTA, show hamburger */
        @media (max-width: 767px) {
          .nav-mobile-btn        { display: flex !important; }
          .nav-desktop-links     { display: none !important; }
          .nav-desktop-cta       { display: none !important; }
        }
      `}</style>
    </>
  );
}