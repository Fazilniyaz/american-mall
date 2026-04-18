"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ─── Thumbnail data ───────────────────────────────────────────────────────────
const THUMBS = [
  {
    src:   "/photos/nickelodeon-arcade.jpg",
    label: "Arcade Zone",
    desc:  "Neon-lit gaming world",
  },
  {
    src:   "/photos/nickelodeon-ride.jpg",
    label: "Ride World",
    desc:  "30+ rides & attractions",
  },
];

// ─── Stat pills ───────────────────────────────────────────────────────────────
const STATS = [
  { value: "7",    label: "Roller Coasters" },
  { value: "30+",  label: "Rides & Attractions" },
  { value: "12M+", label: "Rides taken yearly" },
  { value: "#1",   label: "Largest indoor park" },
];

export default function NickelodeonPanel() {
  const panelRef  = useRef<HTMLDivElement>(null);
  const triggered = useRef(false);

  useEffect(() => {
    if (!panelRef.current) return;

    ScrollTrigger.create({
      trigger: panelRef.current,
      start:   "top 72%",
      once:    true,
      onEnter: () => {
        if (triggered.current) return;
        triggered.current = true;

        const tl = gsap.timeline();

        tl.to(".nick-cat",      { opacity: 1, y: 0, duration: 0.55, ease: "power2.out" })
          .to(".nick-headline",  { opacity: 1, y: 0, duration: 0.65, ease: "power2.out" }, "-=0.25")
          .to(".nick-sub",       { opacity: 1, y: 0, duration: 0.6,  ease: "power2.out" }, "-=0.35")
          .to(".nick-body",      { opacity: 1, y: 0, duration: 0.6,  ease: "power2.out" }, "-=0.25")
          .to(".nick-stat",      {
            opacity: 1, y: 0, duration: 0.5, ease: "power2.out",
            stagger: 0.09,
          }, "-=0.2")
          .to(".nick-thumb",     {
            opacity: 1, x: 0, duration: 0.6, ease: "power2.out",
            stagger: 0.14,
          }, "-=0.4");
      },
    });

    return () => {
      ScrollTrigger.getAll()
        .filter(st => st.vars.trigger === panelRef.current)
        .forEach(st => st.kill());
    };
  }, []);

  return (
    <div
      ref={panelRef}
      className="nick-panel"
      style={{
        position:       "relative",
        width:          "100%",
        minHeight:      "100vh",
        display:        "flex",
        alignItems:     "center",
        overflow:       "hidden",
        background:     "#050402",
      }}
    >
      {/* ── Hero background image — pirate ship / atrium ── */}
      <div style={{
        position: "absolute",
        inset: 0,
        zIndex: 1,
      }}>
        <picture>
          <source
            media="(max-width: 767px)"
            srcSet="/photos/nickelodeon-park-mobile.jpg"
          />
          <img
            src="/photos/nickelodeon-park.jpg"
            alt="Nickelodeon Universe — pirate ship atrium at Mall of America"
            loading="eager"
            decoding="async"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center 30%",
            }}
          />
        </picture>

        {/* Multi-layer overlay — left dark for text, right reveals image */}
        <div style={{
          position:   "absolute",
          inset:      0,
          background: "linear-gradient(105deg, rgba(5,4,2,0.92) 0%, rgba(5,4,2,0.75) 42%, rgba(5,4,2,0.25) 70%, rgba(5,4,2,0.1) 100%)",
          zIndex:     2,
        }} />

        {/* Bottom fade to match next section */}
        <div style={{
          position:   "absolute",
          bottom:     0, left: 0, right: 0,
          height:     "180px",
          background: "linear-gradient(to bottom, transparent, #050402)",
          zIndex:     3,
        }} />

        {/* Top fade */}
        <div style={{
          position:   "absolute",
          top:        0, left: 0, right: 0,
          height:     "80px",
          background: "linear-gradient(to top, transparent, #050402)",
          zIndex:     3,
        }} />
      </div>

      {/* ── Content ── */}
      <div style={{
        position: "relative",
        zIndex:   4,
        width:    "100%",
        padding:  "6rem clamp(1.5rem, 6vw, 6rem)",
        display:  "grid",
        gap:      "3rem",
      }}
        className="nick-content-grid"
      >
        {/* Left — text block */}
        <div style={{
          display:        "flex",
          flexDirection:  "column",
          gap:            "1.2rem",
          maxWidth:       "520px",
        }}>
          {/* Category label */}
          <p
            className="nick-cat"
            style={{
              color:         "#C9A84C",
              fontSize:      "0.68rem",
              letterSpacing: "0.42em",
              textTransform: "uppercase",
              fontFamily:    "var(--font-montserrat)",
              fontWeight:    700,
              margin:        0,
              opacity:       0,
              transform:     "translateY(16px)",
            }}
          >
            Theme Park · Nickelodeon Universe
          </p>

          {/* Headline */}
          <h2
            className="nick-headline"
            style={{
              color:      "#ffffff",
              fontSize:   "clamp(2.4rem, 5.5vw, 5rem)",
              fontWeight: 800,
              fontFamily: "var(--font-montserrat)",
              margin:     0,
              lineHeight: 0.95,
              opacity:    0,
              transform:  "translateY(24px)",
            }}
          >
            7 roller<br />coasters.
          </h2>

          {/* Sub */}
          <h3
            className="nick-sub"
            style={{
              color:      "rgba(255,255,255,0.42)",
              fontSize:   "clamp(1.2rem, 2.8vw, 2.2rem)",
              fontWeight: 800,
              fontFamily: "var(--font-montserrat)",
              margin:     0,
              lineHeight: 1.1,
              opacity:    0,
              transform:  "translateY(20px)",
            }}
          >
            Inside a mall.
          </h3>

          {/* Gold divider */}
          <div style={{
            width:      "48px",
            height:     "2px",
            background: "linear-gradient(to right, #C9A84C, rgba(201,168,76,0.2))",
          }} />

          {/* Body */}
          <p
            className="nick-body"
            style={{
              color:      "rgba(255,255,255,0.55)",
              fontSize:   "clamp(0.82rem, 1.3vw, 0.96rem)",
              fontFamily: "var(--font-montserrat)",
              fontWeight: 400,
              lineHeight: 1.8,
              margin:     0,
              opacity:    0,
              transform:  "translateY(16px)",
              maxWidth:   "420px",
            }}
          >
            Nickelodeon Universe is the largest indoor theme park in North
            America — and it lives inside Mall of America. Your brand sits
            steps away from the most visited attraction in Minnesota, drawing
            families from across the continent every single day.
          </p>

          {/* Stat pills */}
          <div style={{
            display:   "grid",
            gridTemplateColumns: "1fr 1fr",
            gap:       "0.6rem",
            marginTop: "0.4rem",
          }}>
            {STATS.map(s => (
              <div
                key={s.value}
                className="nick-stat"
                style={{
                  background:    "rgba(201,168,76,0.06)",
                  border:        "1px solid rgba(201,168,76,0.18)",
                  padding:       "0.75rem 1rem",
                  opacity:       0,
                  transform:     "translateY(12px)",
                }}
              >
                <div style={{
                  color:              "#C9A84C",
                  fontSize:           "clamp(1.1rem, 2vw, 1.5rem)",
                  fontWeight:         800,
                  fontFamily:         "var(--font-montserrat)",
                  lineHeight:         1,
                  fontVariantNumeric: "tabular-nums",
                }}>
                  {s.value}
                </div>
                <div style={{
                  color:         "rgba(255,255,255,0.38)",
                  fontSize:      "0.58rem",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  fontFamily:    "var(--font-montserrat)",
                  fontWeight:    600,
                  marginTop:     "0.25rem",
                }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — thumbnail stack */}
        <div
          className="nick-thumbs-col"
          style={{
            display:        "flex",
            flexDirection:  "column",
            gap:            "1px",
            alignSelf:      "center",
          }}
        >
          {THUMBS.map((t) => (
            <div
              key={t.src}
              className="nick-thumb"
              style={{
                position:  "relative",
                width:     "100%",
                height:    "clamp(140px, 18vw, 220px)",
                overflow:  "hidden",
                opacity:   0,
                transform: "translateX(40px)",
              }}
            >
              <Image
                src={t.src}
                alt={t.label}
                fill
                sizes="(max-width: 768px) 100vw, 35vw"
                style={{
                  objectFit:  "cover",
                  transition: "transform 0.6s ease",
                }}
                onMouseEnter={e => {
                  (e.target as HTMLImageElement).style.transform = "scale(1.06)";
                }}
                onMouseLeave={e => {
                  (e.target as HTMLImageElement).style.transform = "scale(1)";
                }}
              />

              {/* Overlay */}
              <div style={{
                position:   "absolute",
                inset:      0,
                background: "linear-gradient(to top, rgba(5,4,2,0.75) 0%, rgba(5,4,2,0.1) 60%)",
              }} />

              {/* Label */}
              <div style={{
                position:      "absolute",
                bottom:        "0.8rem",
                left:          "0.8rem",
                zIndex:        2,
              }}>
                <div style={{
                  color:         "#C9A84C",
                  fontSize:      "0.62rem",
                  fontWeight:    700,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  fontFamily:    "var(--font-montserrat)",
                  lineHeight:    1,
                }}>
                  {t.label}
                </div>
                <div style={{
                  color:      "rgba(255,255,255,0.45)",
                  fontSize:   "0.58rem",
                  fontFamily: "var(--font-montserrat)",
                  fontWeight: 400,
                  marginTop:  "0.2rem",
                }}>
                  {t.desc}
                </div>
              </div>

              {/* Corner bracket — top right */}
              <div style={{
                position:     "absolute",
                top:          "8px",
                right:        "8px",
                width:        "14px",
                height:       "14px",
                borderTop:    "1px solid rgba(201,168,76,0.5)",
                borderRight:  "1px solid rgba(201,168,76,0.5)",
              }} />
            </div>
          ))}

          {/* "Explore" CTA below thumbnails */}
          <div style={{
            borderTop:  "1px solid rgba(201,168,76,0.12)",
            paddingTop: "0.8rem",
            display:    "flex",
            alignItems: "center",
            justifyContent:"space-between",
          }}>
            <span style={{
              color:         "rgba(255,255,255,0.28)",
              fontSize:      "0.6rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              fontFamily:    "var(--font-montserrat)",
              fontWeight:    600,
            }}>
              North America&apos;s largest indoor park
            </span>
            <span style={{
              color:      "#C9A84C",
              fontSize:   "0.75rem",
              opacity:    0.7,
            }}>
              →
            </span>
          </div>
        </div>
      </div>

      {/* ── Large panel number watermark ── */}
      <div style={{
        position:      "absolute",
        right:         "clamp(1.5rem, 5vw, 4rem)",
        bottom:        "3rem",
        color:         "rgba(201,168,76,0.07)",
        fontSize:      "clamp(5rem, 12vw, 10rem)",
        fontWeight:    800,
        fontFamily:    "var(--font-montserrat)",
        lineHeight:    1,
        userSelect:    "none",
        pointerEvents: "none",
        zIndex:        4,
      }}>
        01
      </div>

      {/* ── Responsive styles ── */}
      <style>{`
        /* Mobile: single column, image is bg only */
        .nick-content-grid {
          grid-template-columns: 1fr;
        }
        .nick-thumbs-col {
          display: none;
        }

        /* Tablet: show thumbnails */
        @media (min-width: 768px) {
          .nick-content-grid {
            grid-template-columns: 1fr 1fr;
            align-items: center;
          }
          .nick-thumbs-col {
            display: flex;
          }
        }

        /* Desktop: text gets more space */
        @media (min-width: 1100px) {
          .nick-content-grid {
            grid-template-columns: 55fr 45fr;
          }
        }
      `}</style>
    </div>
  );
}