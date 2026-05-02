"use client";

import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

let _gsap: typeof import("gsap")["default"] | null = null;
const loadGsap = () =>
  _gsap
    ? Promise.resolve(_gsap)
    : import("gsap").then((m) => { _gsap = m.default; return _gsap!; });

const PATHS = [
  { number: "01", title: "Lease a Space", sub: "Find your flagship location", route: "/takeAction/LeaseASpace" },
  { number: "02", title: "Host an Event", sub: "Book your brand moment", route: "/takeAction/HostAnEvent" },
  { number: "03", title: "Become a Sponsor", sub: "Own your audience", route: "/takeAction/BecomeASponsor" },
];

const ACTIONS = [
  { label: "Schedule a Call", desc: "Direct line to the commercial team.", href: "mailto:medi@liat.ai?subject=Mall%20of%20America%20Deck%20-%20Schedule%20a%20Call", cta: "Open Email", icon: "✉" },
  { label: "Download Deck", desc: "Save a printable summary.", href: null as string | null, cta: "Print to PDF", icon: "↓" },
  { label: "Book a Meeting", desc: "Send a note to lock in next steps.", href: "mailto:medi@liat.ai?subject=Mall%20of%20America%20Deck%20-%20Book%20a%20Meeting", cta: "Open Email", icon: "◈" },
];

export default function FinalActionsSlide() {
  const router = useRouter();

  useEffect(() => {
    const t = setTimeout(() => {
      loadGsap().then((gsap) => {
        gsap.fromTo(".fa-eyebrow", { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" });
        gsap.fromTo(".fa-headline", { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", delay: 0.1 });
        gsap.fromTo(".fa-sub", { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", delay: 0.2 });
        gsap.fromTo(".fa-path-card", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", stagger: 0.08, delay: 0.3 });
        gsap.fromTo(".fa-action-card", { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.45, ease: "power2.out", stagger: 0.06, delay: 0.55 });
        gsap.fromTo(".fa-footer", { opacity: 0 }, { opacity: 1, duration: 0.8, ease: "power2.out", delay: 0.8 });
      });
    }, 200);
    return () => clearTimeout(t);
  }, []);

  const handleDownloadDeck = useCallback(() => {
    const summary = [
      "Mall of America Interactive Sales Deck",
      "", "Primary business goals:", "- Retail leasing", "- Sponsorship and partnerships", "- Event bookings",
      "", "Sections:", "- Intro", "- Who's Here", "- Explore", "- Entertainment", "- Events", "- Footfall → Revenue", "- Take Action",
      "", "Prepared for a live pitch or standalone review link.",
    ].join("\n");
    const blob = new Blob([summary], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "mall-of-america-interactive-sales-deck.txt"; a.click();
    URL.revokeObjectURL(url);
  }, []);

  return (
    <>
      <style>{`
        .fa-root {
          position: fixed; inset: 0;
          background: #050402;
          display: flex; flex-direction: column;
          overflow: hidden;
          font-family: var(--font-montserrat);
        }

        /* ── Background ── */
        .fa-glow {
          position: absolute; top: 15%; left: 50%;
          transform: translateX(-50%);
          width: 700px; height: 700px; border-radius: 50%;
          background: radial-gradient(circle, rgba(201,168,76,0.05) 0%, transparent 68%);
          pointer-events: none; z-index: 0;
        }
        .fa-grid-bg {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(201,168,76,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(201,168,76,0.02) 1px, transparent 1px);
          background-size: 80px 80px;
          pointer-events: none; z-index: 0;
        }

        /* ── Top bar ── */
        .fa-topbar {
          flex-shrink: 0; z-index: 10;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 clamp(1rem,3vw,2.5rem);
          height: clamp(38px,5vh,48px);
          border-bottom: 1px solid rgba(201,168,76,0.1);
        }
        .fa-topbar-back {
          background: transparent;
          border: 1px solid rgba(201,168,76,0.25);
          color: #C9A84C;
          width: clamp(26px,3.5vw,34px); height: clamp(26px,3.5vw,34px);
          display: flex; align-items: center; justify-content: center;
          font-size: 0.9rem; cursor: pointer;
          transition: all 0.2s;
          font-family: var(--font-montserrat);
        }
        .fa-topbar-back:hover { background: rgba(201,168,76,0.1); border-color: #C9A84C; }
        .fa-topbar-center { text-align: center; }
        .fa-topbar-ey {
          color: #C9A84C; font-size: clamp(0.38rem,0.6vw,0.48rem);
          letter-spacing: 0.4em; text-transform: uppercase; font-weight: 700; margin: 0;
        }
        .fa-topbar-title {
          color: #fff; font-size: clamp(0.62rem,0.9vw,0.8rem);
          font-weight: 800; margin: 0; line-height: 1;
          letter-spacing: 0.09em; text-transform: uppercase;
        }
        .fa-topbar-count { display: flex; align-items: center; gap: 0.25rem; }
        .fa-topbar-count b { color: #C9A84C; font-size: clamp(0.55rem,0.75vw,0.68rem); font-weight: 700; }
        .fa-topbar-count span { color: rgba(255,255,255,0.18); font-size: clamp(0.5rem,0.7vw,0.62rem); }

        /* ── Main content area ── */
        .fa-body {
          flex: 1; z-index: 1;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          padding: clamp(0.6rem,1.5vh,1.5rem) clamp(1rem,3vw,3rem);
          gap: clamp(0.5rem,1.2vh,1rem);
          overflow: hidden;
        }

        /* ── Hero ── */
        .fa-eyebrow {
          color: #C9A84C;
          font-size: clamp(0.48rem,0.72vw,0.6rem);
          letter-spacing: 0.38em; text-transform: uppercase;
          font-weight: 600; margin: 0; opacity: 0;
        }
        .fa-headline {
          color: #fff;
          font-size: clamp(1.3rem,2.8vw,2.6rem);
          font-weight: 800; margin: 0; line-height: 1.08;
          text-align: center; opacity: 0;
        }
        .fa-headline em { color: #C9A84C; font-style: normal; }
        .fa-sub {
          color: rgba(255,255,255,0.36);
          font-size: clamp(0.58rem,0.85vw,0.74rem);
          font-weight: 400; margin: 0; max-width: 420px;
          line-height: 1.6; text-align: center; opacity: 0;
        }

        /* ── Path cards row ── */
        .fa-paths {
          width: 100%; max-width: 1000px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1px;
          background: rgba(201,168,76,0.07);
          border: 1px solid rgba(201,168,76,0.07);
        }
        .fa-path-card {
          background: rgba(255,255,255,0.02);
          padding: clamp(0.6rem,1.3vh,1.4rem) clamp(0.7rem,1.5vw,1.4rem);
          display: flex; flex-direction: column;
          gap: clamp(0.2rem,0.5vh,0.5rem);
          cursor: pointer;
          transition: background 0.22s;
          position: relative; overflow: hidden;
          opacity: 0;
        }
        .fa-path-card:hover { background: rgba(201,168,76,0.04); }
        .fa-path-wm {
          position: absolute; right: 0.6rem; top: 0.3rem;
          color: rgba(201,168,76,0.04);
          font-size: clamp(2.2rem,4vw,4.5rem);
          font-weight: 800; line-height: 1;
          user-select: none; pointer-events: none;
        }
        .fa-path-num {
          color: #C9A84C; font-size: clamp(0.42rem,0.6vw,0.54rem);
          font-weight: 700; letter-spacing: 0.28em; opacity: 0.6;
        }
        .fa-path-title {
          color: #fff; font-size: clamp(0.72rem,1.2vw,1.05rem);
          font-weight: 800; margin: 0; line-height: 1.15;
        }
        .fa-path-sub {
          color: #C9A84C; font-size: clamp(0.44rem,0.65vw,0.56rem);
          font-weight: 600; letter-spacing: 0.06em; margin: 0; opacity: 0.7;
        }
        .fa-path-link {
          display: flex; align-items: center; gap: 0.4rem;
          margin-top: auto;
          padding-top: clamp(0.3rem,0.6vh,0.6rem);
          border-top: 1px solid rgba(255,255,255,0.05);
          color: #C9A84C; font-size: clamp(0.44rem,0.62vw,0.55rem);
          font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase;
        }
        .fa-path-arrow { transition: transform 0.2s; }
        .fa-path-card:hover .fa-path-arrow { transform: translateX(3px); }

        /* ── Actions row ── */
        .fa-actions {
          width: 100%; max-width: 1000px;
        }
        .fa-actions-label {
          color: rgba(255,255,255,0.2);
          font-size: clamp(0.4rem,0.58vw,0.52rem);
          letter-spacing: 0.28em; text-transform: uppercase;
          font-weight: 600; margin: 0 0 clamp(0.35rem,0.7vh,0.7rem);
        }
        .fa-actions-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: clamp(0.4rem,0.8vw,0.7rem);
        }
        .fa-action-card {
          display: flex; align-items: center;
          gap: clamp(0.5rem,1vw,0.8rem);
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(201,168,76,0.16);
          padding: clamp(0.45rem,1vh,0.8rem) clamp(0.6rem,1.2vw,1rem);
          text-decoration: none; cursor: pointer;
          transition: transform 0.18s, border-color 0.18s, background 0.18s;
          opacity: 0; color: inherit;
        }
        .fa-action-card:hover {
          background: rgba(201,168,76,0.05);
          border-color: rgba(201,168,76,0.4);
          transform: translateY(-1px);
        }
        .fa-action-icon {
          width: clamp(28px,3.5vw,38px); height: clamp(28px,3.5vw,38px);
          border: 1px solid rgba(201,168,76,0.22);
          display: flex; align-items: center; justify-content: center;
          color: #C9A84C; font-size: clamp(0.75rem,1.1vw,0.95rem); flex-shrink: 0;
        }
        .fa-action-info { flex: 1; display: flex; flex-direction: column; gap: 1px; }
        .fa-action-label {
          color: #C9A84C; font-size: clamp(0.44rem,0.65vw,0.56rem);
          font-weight: 700; letter-spacing: 0.22em; text-transform: uppercase;
        }
        .fa-action-desc {
          color: rgba(255,255,255,0.42);
          font-size: clamp(0.42rem,0.62vw,0.54rem); line-height: 1.4;
        }
        .fa-action-cta {
          color: rgba(201,168,76,0.65);
          font-size: clamp(0.38rem,0.56vw,0.5rem);
          font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase;
          flex-shrink: 0;
        }

        /* ── Footer ── */
        .fa-footer {
          flex-shrink: 0; z-index: 1;
          text-align: center;
          padding: clamp(0.4rem,1vh,0.8rem) 1rem;
          border-top: 1px solid rgba(201,168,76,0.06);
          display: flex; flex-direction: column;
          align-items: center; gap: clamp(0.25rem,0.5vh,0.5rem);
          position: relative; opacity: 0;
        }
        .fa-footer-bg {
          position: absolute; top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          color: rgba(201,168,76,0.025);
          font-size: clamp(3rem,10vw,7rem);
          font-weight: 800; letter-spacing: 0.05em;
          user-select: none; pointer-events: none;
          white-space: nowrap; line-height: 1;
        }
        .fa-footer-brand {
          color: #C9A84C; font-size: clamp(0.52rem,0.72vw,0.65rem);
          font-weight: 800; letter-spacing: 0.3em; text-transform: uppercase;
          margin: 0; line-height: 1;
        }
        .fa-footer-loc {
          color: rgba(255,255,255,0.15);
          font-size: clamp(0.36rem,0.5vw,0.46rem);
          letter-spacing: 0.35em; text-transform: uppercase;
          font-weight: 500; margin: 0;
        }
        .fa-footer-copy {
          color: rgba(255,255,255,0.1);
          font-size: clamp(0.36rem,0.5vw,0.46rem);
          font-weight: 400; margin: 0; letter-spacing: 0.04em;
        }

        /* ═══════ MOBILE ═══════ */
        @media (max-width: 700px) {
          .fa-paths { display: none; }

          .fa-body {
            justify-content: center;
            gap: clamp(0.8rem,2vh,1.2rem);
          }

          .fa-actions-grid {
            grid-template-columns: 1fr;
            gap: 0.5rem;
          }

          .fa-action-card {
            padding: 0.55rem 0.8rem;
          }
        }

        /* ═══════ TABLET ═══════ */
        @media (min-width: 701px) and (max-width: 1024px) {
          .fa-paths { grid-template-columns: repeat(3, 1fr); }
          .fa-actions-grid { grid-template-columns: repeat(3, 1fr); }
        }
      `}</style>

      <div className="fa-root">
        <div className="fa-glow" />
        <div className="fa-grid-bg" />

        {/* ── Top Bar ── */}
        <div className="fa-topbar">
          <button className="fa-topbar-back" onClick={() => router.back()} aria-label="Back">‹</button>
          <div className="fa-topbar-center">
            <p className="fa-topbar-ey">Take Action</p>
            <h1 className="fa-topbar-title">Final Actions</h1>
          </div>
          <div className="fa-topbar-count">
            <b>06</b><span>/ 06</span>
          </div>
        </div>

        {/* ── Main Content ── */}
        <div className="fa-body">

          {/* Hero */}
          <p className="fa-eyebrow">You&apos;ve seen it all</p>
          <h2 className="fa-headline">
            Now make <em>your move.</em>
          </h2>
          <p className="fa-sub">
            40 million visitors a year. 520+ brands. The most visited mall in America.
            Your place is waiting.
          </p>

          {/* Path cards — hidden on mobile */}
          <div className="fa-paths">
            {PATHS.map(p => (
              <div key={p.number} className="fa-path-card" onClick={() => router.push(p.route)}>
                <div className="fa-path-wm">{p.number}</div>
                <div className="fa-path-num">{p.number}</div>
                <h3 className="fa-path-title">{p.title}</h3>
                <p className="fa-path-sub">{p.sub}</p>
                <div className="fa-path-link">
                  Explore <span className="fa-path-arrow">→</span>
                </div>
              </div>
            ))}
          </div>

          {/* Final Actions */}
          <div className="fa-actions">
            <p className="fa-actions-label">Final actions</p>
            <div className="fa-actions-grid">
              {ACTIONS.map(a => {
                const inner = (
                  <div
                    key={a.label}
                    className="fa-action-card"
                    onClick={!a.href ? handleDownloadDeck : undefined}
                  >
                    <div className="fa-action-icon">{a.icon}</div>
                    <div className="fa-action-info">
                      <span className="fa-action-label">{a.label}</span>
                      <span className="fa-action-desc">{a.desc}</span>
                    </div>
                    <span className="fa-action-cta">{a.cta}</span>
                  </div>
                );
                return a.href
                  ? <a key={a.label} href={a.href} style={{ textDecoration: "none", color: "inherit" }}>{inner}</a>
                  : inner;
              })}
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="fa-footer">
          <div className="fa-footer-bg">MALL OF AMERICA</div>
          <svg viewBox="0 0 44 44" width="28" height="28" aria-hidden="true" style={{ opacity: 0.45 }}>
            <defs>
              <linearGradient id="fa-g1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F0D988" />
                <stop offset="50%" stopColor="#C9A84C" />
                <stop offset="100%" stopColor="#8A6820" />
              </linearGradient>
            </defs>
            <circle cx="22" cy="22" r="14" fill="none" stroke="url(#fa-g1)" strokeWidth="1" opacity="0.6" />
            <polygon points="22,14 30,22 22,30 14,22" fill="none" stroke="url(#fa-g1)" strokeWidth="1.3" opacity="0.9" />
            <polygon points="22,17 27,22 22,27 17,22" fill="url(#fa-g1)" />
            <circle cx="22" cy="22" r="1.8" fill="#050402" opacity="0.6" />
          </svg>
          <p className="fa-footer-brand">Mall of America</p>
          <p className="fa-footer-loc">Bloomington · Minnesota</p>
          <p className="fa-footer-copy">© {new Date().getFullYear()} Mall of America · All commercial enquiries treated in strict confidence</p>
        </div>
      </div>
    </>
  );
}
