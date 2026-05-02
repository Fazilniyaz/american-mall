"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

let _gsap: typeof import("gsap")["default"] | null = null;
const loadGsap = () =>
  _gsap
    ? Promise.resolve(_gsap)
    : import("gsap").then((m) => { _gsap = m.default; return _gsap!; });

const VENUES = [
  { id: "rotunda", name: "Rotunda", cap: "10,000+", sqft: "30,000 sqft", tag: "Flagship", desc: "The iconic heart of MOA. Soaring atrium, full 360° brand exposure across all 4 floors." },
  { id: "court", name: "Court Areas", cap: "2,000+", sqft: "8,000 sqft", tag: "Versatile", desc: "4 themed courts. Perfect for activations, pop-ups, product launches & immersive installs." },
  { id: "stage", name: "CAMP Stage", cap: "500+", sqft: "3,500 sqft", tag: "Intimate", desc: "Dedicated performance stage with built-in AV. Ideal for press events & media moments." },
  { id: "exterior", name: "Exterior Plazas", cap: "5,000+", sqft: "15,000 sqft", tag: "Open Air", desc: "High-traffic entry plazas. Maximum street-level visibility. Summer & festival activations." },
];

const STATS = [
  { val: "40M+", label: "Annual visitors", sub: "Your built-in audience" },
  { val: "110K", label: "Daily peak footfall", sub: "On major event weekends" },
  { val: "520+", label: "Brand neighbours", sub: "Premium co-marketing reach" },
  { val: "#1", label: "Visited mall in USA", sub: "The address brands covet" },
];

const EVENT_TYPES = [
  "Product Launch", "Brand Activation", "Corporate Summit",
  "Fashion Show", "Pop-Up Experience", "Press & Media Event",
  "Community Event", "Entertainment Show",
];

export default function HostAnEventPage() {
  const router = useRouter();
  const [activeVenue, setActiveVenue] = useState(0);
  const [formOpen, setFormOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const indicatorRef = useRef<HTMLDivElement>(null);

  // ── Entrance ────────────────────────────────────────────────────────────────
  useEffect(() => {
    const t = setTimeout(() => {
      loadGsap().then((gsap) => {
        gsap.fromTo(".hae-eyebrow", { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.55, ease: "power2.out" });
        gsap.fromTo(".hae-headline", { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.7, ease: "power2.out", delay: 0.12 });
        gsap.fromTo(".hae-sub", { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.55, ease: "power2.out", delay: 0.22 });
        gsap.fromTo(".hae-divider", { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: "power2.out", delay: 0.32, transformOrigin: "left" });
        gsap.fromTo(".hae-stats", { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.55, ease: "power2.out", delay: 0.42 });
        gsap.fromTo(".hae-cta", { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", delay: 0.54 });
        gsap.fromTo(".hae-right", { opacity: 0, x: 24 }, { opacity: 1, x: 0, duration: 0.75, ease: "power2.out", delay: 0.2 });
        gsap.fromTo(".hae-img", { opacity: 0, scale: 1.05 }, { opacity: 1, scale: 1, duration: 1.2, ease: "power2.out" });
      });
    }, 200);
    return () => clearTimeout(t);
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  }, []);

  return (
    <>
      <style>{`
        /* ── Root: strict 100vh deck slide ── */
        .hae-root {
          position: fixed; inset: 0;
          background: #050402;
          display: grid;
          grid-template-columns: 1fr 1fr;
          overflow: hidden;
          font-family: var(--font-montserrat);
        }

        /* ════════════════════════════════
           LEFT
        ════════════════════════════════ */
        .hae-left {
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: clamp(1.8rem,5vh,3.5rem) clamp(1.6rem,4vw,3.5rem) clamp(4rem,8vh,5rem);
          gap: clamp(0.8rem,1.8vh,1.4rem);
          border-right: 1px solid rgba(201,168,76,0.1);
          overflow: hidden;
          z-index: 10;
        }
        /* gold left accent */
        .hae-left::before {
          content:'';
          position:absolute; left:0; top:12%; bottom:12%; width:3px;
          background: linear-gradient(to bottom, transparent, #C9A84C, transparent);
        }

        .hae-eyebrow {
          color: #C9A84C;
          font-size: clamp(0.52rem,0.8vw,0.66rem);
          letter-spacing: 0.44em;
          text-transform: uppercase;
          font-weight: 700;
          margin: 0; opacity:0;
        }
        .hae-headline {
          color: #fff;
          font-size: clamp(1.65rem,3vw,2.9rem);
          font-weight: 800;
          line-height: 1.05;
          margin: 0; opacity:0;
        }
        .hae-headline em { color:#C9A84C; font-style:normal; }

        .hae-sub {
          color: rgba(255,255,255,0.44);
          font-size: clamp(0.7rem,1.05vw,0.84rem);
          font-weight: 400;
          line-height: 1.75;
          margin: 0; max-width:390px; opacity:0;
        }

        .hae-divider {
          width:52px; height:2px;
          background: linear-gradient(to right,#C9A84C,rgba(201,168,76,0.15));
        }

        /* ── Stats row ── */
        .hae-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0;
          border: 1px solid rgba(201,168,76,0.12);
          opacity:0;
        }
        .hae-stat {
          padding: clamp(0.55rem,1.1vh,0.9rem) clamp(0.5rem,0.9vw,0.8rem);
          border-right: 1px solid rgba(201,168,76,0.12);
          transition: background 0.22s;
        }
        .hae-stat:last-child { border-right:none; }
        .hae-stat:hover { background: rgba(201,168,76,0.05); }
        .hae-stat-val {
          color: #C9A84C;
          font-size: clamp(0.95rem,1.7vw,1.5rem);
          font-weight: 800;
          line-height: 1;
          font-variant-numeric: tabular-nums;
        }
        .hae-stat-label {
          color: #fff;
          font-size: clamp(0.42rem,0.62vw,0.56rem);
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-top: 0.22rem;
          line-height: 1.2;
        }
        .hae-stat-sub {
          color: rgba(255,255,255,0.28);
          font-size: clamp(0.38rem,0.56vw,0.5rem);
          margin-top: 0.12rem;
          line-height: 1.35;
        }

        /* ── Venue selector ── */
        .hae-venue-label {
          color: rgba(255,255,255,0.28);
          font-size: clamp(0.46rem,0.68vw,0.58rem);
          letter-spacing: 0.36em;
          text-transform: uppercase;
          font-weight: 700;
          margin: 0;
        }
        .hae-venues {
          display: flex;
          flex-direction: column;
          gap: 0;
          border: 1px solid rgba(201,168,76,0.12);
          position: relative;
        }

        .hae-venue {
          display: flex;
          align-items: center;
          gap: clamp(0.6rem,1.2vw,1rem);
          padding: clamp(0.55rem,1.1vh,0.9rem) clamp(0.7rem,1.2vw,1rem);
          border-bottom: 1px solid rgba(201,168,76,0.07);
          cursor: pointer;
          transition: background 0.2s;
          position: relative;
          overflow: hidden;
        }
        .hae-venue:last-child { border-bottom:none; }
        .hae-venue::before {
          content:'';
          position:absolute; left:0; top:0; bottom:0; width:2px;
          background: #C9A84C;
          transform: scaleY(0);
          transition: transform 0.25s ease;
          transform-origin: center;
        }
        .hae-venue.active::before { transform: scaleY(1); }
        .hae-venue.active { background: rgba(201,168,76,0.06); }
        .hae-venue:not(.active):hover { background: rgba(255,255,255,0.02); }

        .hae-venue-dot {
          width: clamp(6px,0.8vw,9px);
          height: clamp(6px,0.8vw,9px);
          border: 1.5px solid rgba(201,168,76,0.35);
          flex-shrink:0;
          transition: background 0.2s, border-color 0.2s;
        }
        .hae-venue.active .hae-venue-dot {
          background: #C9A84C;
          border-color: #C9A84C;
        }

        .hae-venue-info { flex:1; min-width:0; }
        .hae-venue-name {
          color: #fff;
          font-size: clamp(0.58rem,0.88vw,0.72rem);
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }
        .hae-venue.active .hae-venue-name { color: #C9A84C; }
        .hae-venue-desc {
          color: rgba(255,255,255,0.35);
          font-size: clamp(0.42rem,0.62vw,0.54rem);
          line-height: 1.45;
          margin-top: 0.12rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 90%;
        }
        .hae-venue.active .hae-venue-desc {
          white-space: normal;
          color: rgba(255,255,255,0.5);
        }

        .hae-venue-meta {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          flex-shrink: 0;
          gap: 2px;
        }
        .hae-venue-cap {
          color: #C9A84C;
          font-size: clamp(0.55rem,0.82vw,0.68rem);
          font-weight: 800;
        }
        .hae-venue-sqft {
          color: rgba(255,255,255,0.25);
          font-size: clamp(0.38rem,0.56vw,0.5rem);
          white-space: nowrap;
        }
        .hae-venue-tag {
          background: rgba(201,168,76,0.1);
          border: 1px solid rgba(201,168,76,0.2);
          color: rgba(201,168,76,0.7);
          font-size: clamp(0.34rem,0.5vw,0.46rem);
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          padding: 1px 5px;
        }

        /* ── CTAs ── */
        .hae-cta {
          display: flex;
          gap: 0.75rem;
          align-items: center;
          flex-wrap: wrap;
          opacity:0;
        }
        .hae-btn-primary {
          background: #C9A84C;
          color: #050402;
          border: none;
          padding: clamp(0.6rem,1.2vh,0.85rem) clamp(1.2rem,2.5vw,2rem);
          font-size: clamp(0.58rem,0.88vw,0.7rem);
          font-weight: 800;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          font-family: var(--font-montserrat);
          cursor: pointer;
          transition: all 0.22s ease;
        }
        .hae-btn-primary:hover {
          background: #e0bc5c;
          transform: translateY(-1px);
          box-shadow: 0 6px 24px rgba(201,168,76,0.35);
        }
        .hae-btn-secondary {
          background: transparent;
          color: rgba(255,255,255,0.5);
          border: 1px solid rgba(255,255,255,0.14);
          padding: clamp(0.6rem,1.2vh,0.85rem) clamp(1rem,2vw,1.5rem);
          font-size: clamp(0.56rem,0.84vw,0.68rem);
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          font-family: var(--font-montserrat);
          cursor: pointer;
          transition: all 0.22s ease;
        }
        .hae-btn-secondary:hover {
          border-color: rgba(201,168,76,0.4);
          color: #C9A84C;
        }

        /* ════════════════════════════════
           RIGHT
        ════════════════════════════════ */
        .hae-right {
          position: relative;
          overflow: hidden;
          opacity:0;
        }
        .hae-img {
          position:absolute; inset:0;
          width:100%; height:100%;
          object-fit:cover;
          object-position: center 20%;
          opacity:0;
          filter: brightness(0.35) saturate(0.65);
          transition: opacity 0.8s ease;
        }
        /* Photo edge fades */
        .hae-fade-l {
          position:absolute; top:0; left:0; bottom:0; width:28%;
          background: linear-gradient(to right, #050402, transparent);
          z-index:2; pointer-events:none;
        }
        .hae-fade-b {
          position:absolute; left:0; right:0; bottom:0; height:32%;
          background: linear-gradient(to top, #050402, transparent);
          z-index:2; pointer-events:none;
        }
        .hae-fade-t {
          position:absolute; left:0; right:0; top:0; height:16%;
          background: linear-gradient(to bottom, rgba(5,4,2,0.5), transparent);
          z-index:2; pointer-events:none;
        }

        /* ── Quote card over photo ── */
        .hae-quote-wrap {
          position:absolute;
          top: clamp(1.5rem,4vh,3rem);
          right: clamp(1.2rem,3vw,2.5rem);
          z-index:10;
          max-width: 280px;
        }
        .hae-quote {
          background: rgba(5,4,2,0.82);
          border: 1px solid rgba(201,168,76,0.2);
          border-left: 3px solid #C9A84C;
          padding: clamp(0.9rem,1.8vh,1.4rem) clamp(1rem,1.8vw,1.4rem);
          backdrop-filter: blur(10px);
        }
        .hae-quote-text {
          color: rgba(255,255,255,0.75);
          font-size: clamp(0.62rem,0.95vw,0.78rem);
          line-height: 1.65;
          font-style: italic;
          margin: 0 0 0.7rem;
        }
        .hae-quote-author {
          color: #C9A84C;
          font-size: clamp(0.48rem,0.7vw,0.6rem);
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }
        .hae-quote-role {
          color: rgba(255,255,255,0.28);
          font-size: clamp(0.42rem,0.6vw,0.52rem);
          margin-top: 2px;
          letter-spacing: 0.08em;
        }

        /* ── Event type pills over photo ── */
        .hae-event-types {
          position:absolute;
          bottom: clamp(1rem,3vh,2.5rem);
          left: clamp(1.2rem,3vw,2rem);
          right: clamp(1.2rem,3vw,2rem);
          z-index:10;
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
          align-items: flex-end;
        }
        .hae-event-label {
          width:100%;
          color: rgba(255,255,255,0.22);
          font-size: clamp(0.44rem,0.64vw,0.56rem);
          letter-spacing: 0.34em;
          text-transform: uppercase;
          font-weight: 700;
          margin-bottom: 0.3rem;
        }
        .hae-pill {
          background: rgba(5,4,2,0.75);
          border: 1px solid rgba(201,168,76,0.18);
          color: rgba(255,255,255,0.5);
          font-size: clamp(0.42rem,0.62vw,0.56rem);
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 3px 10px;
          backdrop-filter: blur(6px);
          transition: border-color 0.2s, color 0.2s, background 0.2s;
          cursor: default;
          white-space: nowrap;
        }
        .hae-pill:hover {
          border-color: rgba(201,168,76,0.45);
          color: #C9A84C;
          background: rgba(201,168,76,0.08);
        }

        /* ════════════════════════════════
           BOTTOM NAV
        ════════════════════════════════ */
        .hae-nav {
          position:fixed;
          bottom:0; left:0; right:0; z-index:30;
          display:flex; align-items:center; justify-content:space-between;
          padding: clamp(0.7rem,1.8vh,1.1rem) clamp(1rem,3vw,2rem);
          background: linear-gradient(to top, rgba(5,4,2,0.9) 0%, transparent 100%);
        }
        .hae-nav-btn {
          background: transparent;
          border: 1px solid rgba(201,168,76,0.25);
          color: #C9A84C;
          width: clamp(34px,4vw,42px); height: clamp(34px,4vw,42px);
          display:flex; align-items:center; justify-content:center;
          font-size:1rem; cursor:pointer; backdrop-filter:blur(8px);
          transition: all 0.2s;
          font-family: var(--font-montserrat);
        }
        .hae-nav-btn:hover { background: rgba(201,168,76,0.1); border-color:#C9A84C; }
        .hae-nav-label {
          color: rgba(255,255,255,0.18);
          font-size: clamp(0.48rem,0.72vw,0.58rem);
          letter-spacing: 0.22em;
          text-transform: uppercase;
          font-weight: 600;
        }

        /* ════════════════════════════════
           FORM MODAL
        ════════════════════════════════ */
        .hae-modal-bg {
          position:fixed; inset:0; z-index:50;
          background: rgba(5,4,2,0.88);
          backdrop-filter: blur(14px);
          display:flex; align-items:center; justify-content:center;
          padding: 1.5rem;
          animation: hFadeIn 0.25s ease;
        }
        @keyframes hFadeIn { from{opacity:0} to{opacity:1} }

        .hae-modal {
          background: #0b0905;
          border: 1px solid rgba(201,168,76,0.22);
          width:100%; max-width:560px;
          padding: clamp(1.8rem,4vw,3rem);
          position:relative;
          animation: hSlideUp 0.32s cubic-bezier(0.34,1.56,0.64,1);
          max-height: 92vh;
          overflow-y: auto;
        }
        @keyframes hSlideUp {
          from{ opacity:0; transform:translateY(22px) }
          to  { opacity:1; transform:translateY(0)    }
        }
        .hae-modal-close {
          position:absolute; top:1rem; right:1rem;
          background:transparent; border:none;
          color:rgba(255,255,255,0.3); font-size:1.2rem;
          cursor:pointer; transition:color 0.2s;
          font-family: var(--font-montserrat);
        }
        .hae-modal-close:hover { color:#C9A84C; }

        .hae-modal h3 {
          color:#fff; font-size:clamp(1rem,1.8vw,1.4rem);
          font-weight:800; margin:0 0 0.2rem;
          font-family: var(--font-montserrat);
        }
        .hae-modal-sub {
          color:rgba(255,255,255,0.36);
          font-size:clamp(0.6rem,0.88vw,0.72rem);
          margin:0 0 1.6rem;
          font-family: var(--font-montserrat);
        }

        .hae-field {
          display:flex; flex-direction:column; gap:0.32rem;
          margin-bottom:0.9rem;
        }
        .hae-field label {
          color:rgba(255,255,255,0.4);
          font-size:clamp(0.48rem,0.7vw,0.58rem);
          letter-spacing:0.22em; text-transform:uppercase;
          font-weight:700; font-family:var(--font-montserrat);
        }
        .hae-field input,
        .hae-field select,
        .hae-field textarea {
          background: rgba(255,255,255,0.035);
          border: 1px solid rgba(201,168,76,0.18);
          color:#fff;
          padding:0.62rem 0.82rem;
          font-size:clamp(0.62rem,0.92vw,0.76rem);
          font-family:var(--font-montserrat);
          outline:none; resize:none; width:100%; box-sizing:border-box;
          transition:border-color 0.2s;
        }
        .hae-field input::placeholder,
        .hae-field textarea::placeholder { color:rgba(255,255,255,0.18); }
        .hae-field select option { background:#0b0905; }
        .hae-field input:focus,
        .hae-field select:focus,
        .hae-field textarea:focus { border-color:rgba(201,168,76,0.5); }

        .hae-field-row { display:grid; grid-template-columns:1fr 1fr; gap:0.8rem; }

        /* Event type chip selector */
        .hae-type-chips {
          display:flex; flex-wrap:wrap; gap:0.4rem;
          margin-bottom: 0.9rem;
        }
        .hae-chip {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(201,168,76,0.16);
          color: rgba(255,255,255,0.4);
          font-size:clamp(0.46rem,0.68vw,0.58rem);
          font-weight:600; letter-spacing:0.1em; text-transform:uppercase;
          padding: 4px 10px; cursor:pointer;
          transition: all 0.18s;
          font-family:var(--font-montserrat);
        }
        .hae-chip.selected {
          background: rgba(201,168,76,0.12);
          border-color: #C9A84C;
          color: #C9A84C;
        }
        .hae-chip-label {
          color:rgba(255,255,255,0.38);
          font-size:clamp(0.46rem,0.68vw,0.58rem);
          letter-spacing:0.22em; text-transform:uppercase;
          font-weight:700; font-family:var(--font-montserrat);
          display:block; margin-bottom:0.45rem;
        }

        .hae-submit {
          width:100%; background:#C9A84C; border:none;
          color:#050402; font-weight:800;
          font-size:clamp(0.6rem,0.88vw,0.7rem);
          letter-spacing:0.18em; text-transform:uppercase;
          padding:0.85rem; cursor:pointer;
          font-family:var(--font-montserrat); margin-top:0.4rem;
          transition:background 0.2s, transform 0.2s;
        }
        .hae-submit:hover { background:#e0bc5c; transform:translateY(-1px); }

        .hae-sent {
          text-align:center; padding:2.5rem 0;
        }
        .hae-sent-icon { color:#C9A84C; font-size:2rem; margin-bottom:1rem; }
        .hae-sent h4 {
          color:#fff; font-size:1.1rem; font-weight:800;
          margin:0 0 0.5rem; font-family:var(--font-montserrat);
        }
        .hae-sent p {
          color:rgba(255,255,255,0.36);
          font-size:0.7rem; font-family:var(--font-montserrat);
          line-height:1.65; margin:0;
        }

        /* ════════════════════════════════
           RESPONSIVE
        ════════════════════════════════ */
        @media (max-width:700px) {
          .hae-root {
            grid-template-columns: 1fr;
            grid-template-rows: 48vh 1fr;
          }
          .hae-right { grid-row:1; }
          .hae-left {
            grid-row:2;
            border-right:none;
            border-top:1px solid rgba(201,168,76,0.1);
            padding:1.1rem 1.2rem 4.5rem;
            gap:0.65rem;
            overflow-y:auto;
            justify-content:flex-start;
          }
          .hae-left::before { display:none; }
          .hae-stats { grid-template-columns: repeat(2,1fr); }
          .hae-stat:nth-child(2) { border-right:none; }
          .hae-stat:nth-child(3) { border-top:1px solid rgba(201,168,76,0.12); }
          .hae-stat:nth-child(4) { border-top:1px solid rgba(201,168,76,0.12); border-right:none; }
          .hae-quote-wrap { display:none; }
          .hae-event-types { display:none; }
        }

        @media (min-width:701px) and (max-width:1024px) {
          .hae-root { grid-template-columns: 46% 54%; }
          .hae-quote-wrap { max-width:220px; }
        }
      `}</style>

      <div className="hae-root">

        {/* ══ LEFT ══ */}
        <div className="hae-left">

          <p className="hae-eyebrow">Mall of America · Events</p>

          <h1 className="hae-headline">
            Make it happen<br />
            where <em>40 million</em><br />
            people show up.
          </h1>

          <p className="hae-sub">
            From intimate press moments to full-scale flagship activations —
            no venue in America delivers footfall, prestige, and brand impact
            the way Mall of America does.
          </p>

          <div className="hae-divider" />

          {/* Stats */}
          <div className="hae-stats">
            {STATS.map((s) => (
              <div key={s.label} className="hae-stat">
                <div className="hae-stat-val">{s.val}</div>
                <div className="hae-stat-label">{s.label}</div>
                <div className="hae-stat-sub">{s.sub}</div>
              </div>
            ))}
          </div>

          {/* Venue selector */}
          <p className="hae-venue-label">Choose your venue</p>
          <div className="hae-venues">
            {VENUES.map((v, i) => (
              <div
                key={v.id}
                className={`hae-venue ${activeVenue === i ? "active" : ""}`}
                onClick={() => setActiveVenue(i)}
              >
                <div className="hae-venue-dot" />
                <div className="hae-venue-info">
                  <div className="hae-venue-name">{v.name}</div>
                  <div className="hae-venue-desc">{v.desc}</div>
                </div>
                <div className="hae-venue-meta">
                  <span className="hae-venue-cap">{v.cap}</span>
                  <span className="hae-venue-sqft">{v.sqft}</span>
                  <span className="hae-venue-tag">{v.tag}</span>
                </div>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="hae-cta">
            <button className="hae-btn-primary" onClick={() => setFormOpen(true)}>
              Submit Event Brief
            </button>
            <button className="hae-btn-secondary" onClick={() => router.push("/takeAction/LeaseASpace")}>
              Lease a Space →
            </button>
          </div>

        </div>

        {/* ══ RIGHT ══ */}
        <div className="hae-right">

          <img
            className="hae-img"
            src="/photos/host.webp"
            alt="Brand activation planning at Mall of America"
            onLoad={(e) => { (e.target as HTMLImageElement).style.opacity = "1"; }}
          />

          <div className="hae-fade-l" />
          <div className="hae-fade-b" />
          <div className="hae-fade-t" />

          {/* Quote card */}
          <div className="hae-quote-wrap">
            <div className="hae-quote">
              <p className="hae-quote-text">
                "The Rotunda activation drove more qualified leads in 3 days
                than our last 6 months of digital spend combined."
              </p>
              <div className="hae-quote-author">Sarah Chen</div>
              <div className="hae-quote-role">VP Marketing · GlobalBrand Co.</div>
            </div>
          </div>

          {/* Event type pills */}
          <div className="hae-event-types">
            <div className="hae-event-label">We host</div>
            {EVENT_TYPES.map((et) => (
              <span key={et} className="hae-pill">{et}</span>
            ))}
          </div>

        </div>

      </div>

      {/* ══ BOTTOM NAV ══ */}
      <div className="hae-nav">
        <button className="hae-nav-btn" onClick={() => router.back()} aria-label="Back">‹</button>
        <span className="hae-nav-label">Host an Event</span>
        <div style={{ width: "clamp(34px,4vw,42px)" }} />
      </div>

      {/* ══ FORM MODAL ══ */}
      {formOpen && (
        <div
          className="hae-modal-bg"
          onClick={(e) => { if (e.target === e.currentTarget) { setFormOpen(false); setSent(false); } }}
        >
          <div className="hae-modal">
            <button className="hae-modal-close" onClick={() => { setFormOpen(false); setSent(false); }}>✕</button>

            {sent ? (
              <div className="hae-sent">
                <div className="hae-sent-icon">◈</div>
                <h4>Brief Received</h4>
                <p>
                  Our events team will review your brief and reach out<br />
                  within 1 business day. We can't wait to bring this to life.
                </p>
              </div>
            ) : (
              <>
                <h3>Submit Your Event Brief</h3>
                <p className="hae-modal-sub">Tell us your vision — we'll make it happen.</p>

                <form onSubmit={handleSubmit}>
                  <div className="hae-field-row">
                    <div className="hae-field">
                      <label>First Name</label>
                      <input type="text" placeholder="Alex" required />
                    </div>
                    <div className="hae-field">
                      <label>Last Name</label>
                      <input type="text" placeholder="Morgan" required />
                    </div>
                  </div>

                  <div className="hae-field-row">
                    <div className="hae-field">
                      <label>Brand / Company</label>
                      <input type="text" placeholder="Your brand" required />
                    </div>
                    <div className="hae-field">
                      <label>Email</label>
                      <input type="email" placeholder="you@brand.com" required />
                    </div>
                  </div>

                  <span className="hae-chip-label">Event Type</span>
                  <EventTypeChips />

                  <div className="hae-field-row">
                    <div className="hae-field">
                      <label>Preferred Venue</label>
                      <select>
                        <option value="">Any / Flexible</option>
                        {VENUES.map(v => (
                          <option key={v.id} value={v.id}>{v.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="hae-field">
                      <label>Expected Attendance</label>
                      <select>
                        <option value="">Select…</option>
                        <option>Under 200</option>
                        <option>200 – 1,000</option>
                        <option>1,000 – 5,000</option>
                        <option>5,000+</option>
                      </select>
                    </div>
                  </div>

                  <div className="hae-field-row">
                    <div className="hae-field">
                      <label>Preferred Date</label>
                      <input type="date" />
                    </div>
                    <div className="hae-field">
                      <label>Duration</label>
                      <select>
                        <option value="">Select…</option>
                        <option>1 day</option>
                        <option>2–3 days</option>
                        <option>4–7 days</option>
                        <option>1–4 weeks</option>
                        <option>Ongoing activation</option>
                      </select>
                    </div>
                  </div>

                  <div className="hae-field">
                    <label>Describe your event vision</label>
                    <textarea
                      rows={3}
                      placeholder="Goals, concept, brand experience you want to create…"
                    />
                  </div>

                  <button className="hae-submit" type="submit">
                    Submit Brief →
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

// ── Event type chip multi-select ────────────────────────────────────────────
function EventTypeChips() {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const toggle = (t: string) =>
    setSelected(prev => {
      const next = new Set(prev);
      next.has(t) ? next.delete(t) : next.add(t);
      return next;
    });
  return (
    <div className="hae-type-chips">
      {EVENT_TYPES.map(t => (
        <button
          key={t}
          type="button"
          className={`hae-chip ${selected.has(t) ? "selected" : ""}`}
          onClick={() => toggle(t)}
        >
          {t}
        </button>
      ))}
    </div>
  );
}