"use client";

import { useRef, useState, useCallback } from "react";

const STATS = [
  { value: "50+", label: "Restaurants", sub: "Under one roof" },
  { value: "2.8M", label: "Dining Visits/yr", sub: "Hungry guests, every day" },
  { value: "15+", label: "Cuisines", sub: "Every craving covered" },
  { value: "Top 3", label: "US Mall Dining", sub: "Ranked by dining experience" },
];

const MENU_TIERS = [
  {
    id: "fine",
    icon: "◈",
    name: "Fine Dining",
    tag: "Premium",
    desc: "Michelin-calibre tasting menus and table-service restaurants that keep guests on-property for hours.",
  },
  {
    id: "casual",
    icon: "◈",
    name: "Fast Casual",
    tag: "High Volume",
    desc: "Street food, global bites, and fast-casual concepts drawing millions of visits a year.",
  },
  {
    id: "bars",
    icon: "◈",
    name: "Bars & Lounges",
    tag: "Social",
    desc: "Craft cocktail bars and sports lounges — the evening anchor that extends dwell time.",
  },
] as const;

export default function RestaurantPanel() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);
  const [soundOn, setSoundOn] = useState(false);
  const [activeTier, setActiveTier] = useState<string>("fine");

  const toggleSound = useCallback(() => {
    const next = !soundOn;
    setSoundOn(next);
    if (videoRef.current) videoRef.current.muted = !next;
  }, [soundOn]);

  return (
    <>
      <style>{`
        /* ─────────────────────────────────────────
           KEYFRAMES — CSS is the sole animation engine.
           fill-mode: both → starts invisible, stays visible.
           Browser handles it; cannot fail like GSAP.
        ───────────────────────────────────────── */
        @keyframes rUp {
          from { opacity:0; transform:translateY(18px); }
          to   { opacity:1; transform:translateY(0);    }
        }
        @keyframes rIn {
          from { opacity:0; }
          to   { opacity:1; }
        }
        @keyframes rStretch {
          from { transform:scaleX(0); }
          to   { transform:scaleX(1); }
        }
        @keyframes rGlow {
          0%,100% { box-shadow:0 0 0 0   rgba(201,168,76,0.55); }
          50%     { box-shadow:0 0 0 6px rgba(201,168,76,0);     }
        }

        /* ── Shell ── */
        .rest-root {
          position: relative;
          width: 100%; height: 100vh;
          overflow: hidden;
          background: #050402;
          display: flex;
          align-items: center;
        }

        /* ── Video ── */
        .rest-video {
          position: absolute; inset: 0;
          width: 100%; height: 100%;
          object-fit: cover;
          object-position: center center;
          z-index: 0;
          transition: opacity 1s ease;
        }

        /* ── Overlay stack ── */
        /* 1. Global dim */
        .rest-dim {
          position: absolute; inset: 0; z-index: 1;
          background: rgba(5,4,2,0.32);
          pointer-events: none;
        }
        /* 2. Solid dark left → fade right (text always on solid bg) */
        .rest-overlay-left {
          position: absolute; inset: 0; z-index: 2;
          background: linear-gradient(
            to right,
            #050402          0%,
            #050402          40%,
            rgba(5,4,2,0.94) 47%,
            rgba(5,4,2,0.68) 57%,
            rgba(5,4,2,0.28) 68%,
            rgba(5,4,2,0.0)  78%
          );
          pointer-events: none;
        }
        /* 3. Warm amber wash on video side — matches dining warmth */
        .rest-overlay-warm {
          position: absolute; inset: 0; z-index: 2;
          background: linear-gradient(to left, rgba(40,18,0,0.45) 0%, transparent 55%);
          pointer-events: none;
        }
        /* 4. Top / bottom edge fades */
        .rest-overlay-top {
          position: absolute; top:0; left:0; right:0; height:14%; z-index: 3;
          background: linear-gradient(to bottom, rgba(5,4,2,0.72), transparent);
          pointer-events: none;
        }
        .rest-overlay-bottom {
          position: absolute; bottom:0; left:0; right:0; height:20%; z-index: 3;
          background: linear-gradient(to top, rgba(5,4,2,0.88), transparent);
          pointer-events: none;
        }

        /* ── Gold left accent bar ── */
        .rest-accent-bar {
          position: absolute;
          left:0; top:14%; bottom:14%; width:3px; z-index:10;
          background: linear-gradient(to bottom, transparent, #C9A84C, transparent);
        }

        /* ── Chapter badge ── */
        .rest-chapter {
          position: absolute;
          top: clamp(1.2rem,3vh,2rem);
          right: clamp(1.5rem,4vw,3rem);
          z-index: 20;
          display: flex; flex-direction: column; align-items: flex-end; gap: 3px;
          animation: rIn 0.6s ease 0.2s both;
        }
        .rest-chapter-num {
          color: #C9A84C;
          font-size: clamp(0.55rem,0.82vw,0.68rem);
          font-weight: 800; letter-spacing: 0.18em;
          font-family: var(--font-montserrat);
        }
        .rest-chapter-label {
          color: rgba(255,255,255,0.22);
          font-size: clamp(0.44rem,0.64vw,0.54rem);
          letter-spacing: 0.22em; text-transform: uppercase;
          font-family: var(--font-montserrat); font-weight: 600;
        }

        /* ── Layout: left content + right tier selector ── */
        .rest-layout {
          position: relative; z-index: 10;
          width: 100%;
          display: grid;
          grid-template-columns: 1fr 1fr;
          align-items: center;
          padding: 0 clamp(2rem,5vw,4.5rem);
          gap: clamp(1.5rem,3vw,3rem);
        }

        /* ── LEFT: text content — capped inside solid overlay ── */
        .rest-left {
          display: flex; flex-direction: column;
          gap: clamp(0.75rem,1.6vh,1.25rem);
          width: 100%;
          max-width: 480px;
        }

        .rest-eyebrow {
          color: #C9A84C;
          font-size: clamp(0.52rem,0.8vw,0.66rem);
          letter-spacing: 0.44em; text-transform: uppercase;
          font-family: var(--font-montserrat); font-weight: 700;
          margin: 0;
          animation: rUp 0.55s ease 0.30s both;
        }
        .rest-headline {
          color: #fff;
          font-size: clamp(2rem,4.5vw,4.2rem);
          font-weight: 800; font-family: var(--font-montserrat);
          line-height: 0.96; margin: 0;
          animation: rUp 0.70s ease 0.42s both;
        }
        .rest-headline em { color: #C9A84C; font-style: normal; }

        .rest-sub {
          color: rgba(255,255,255,0.52);
          font-size: clamp(1rem,2vw,1.6rem);
          font-weight: 800; font-family: var(--font-montserrat);
          line-height: 1.1; margin: 0;
          animation: rUp 0.60s ease 0.54s both;
        }
        .rest-divider {
          width: 48px; height: 2px;
          background: linear-gradient(to right, #C9A84C, rgba(201,168,76,0.12));
          transform-origin: left;
          animation: rStretch 0.50s ease 0.66s both;
        }
        .rest-body {
          color: rgba(255,255,255,0.62);
          font-size: clamp(0.74rem,1.1vw,0.9rem);
          font-family: var(--font-montserrat); font-weight: 400;
          line-height: 1.8; margin: 0; max-width: 400px;
          animation: rUp 0.55s ease 0.76s both;
        }

        /* ── Stats grid ── */
        .rest-stats {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: clamp(0.4rem,0.8vh,0.65rem);
          animation: rUp 0.55s ease 0.86s both;
        }
        .rest-stat {
          background: rgba(201,168,76,0.045);
          border: 1px solid rgba(201,168,76,0.14);
          padding: clamp(0.5rem,1vh,0.85rem) clamp(0.6rem,1vw,0.9rem);
          transition: border-color 0.25s, background 0.25s;
          cursor: default;
        }
        .rest-stat:hover {
          border-color: rgba(201,168,76,0.32);
          background: rgba(201,168,76,0.08);
        }
        .rest-stat-val {
          color: #C9A84C;
          font-size: clamp(1rem,1.9vw,1.5rem);
          font-weight: 800; font-family: var(--font-montserrat);
          line-height: 1; font-variant-numeric: tabular-nums;
        }
        .rest-stat-label {
          color: #fff;
          font-size: clamp(0.42rem,0.62vw,0.56rem);
          font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase;
          font-family: var(--font-montserrat); margin-top: 0.2rem;
        }
        .rest-stat-sub {
          color: rgba(255,255,255,0.28);
          font-size: clamp(0.36rem,0.54vw,0.48rem);
          font-family: var(--font-montserrat); margin-top: 0.08rem; line-height: 1.3;
        }

        /* ── Badge ── */
        .rest-badge {
          display: inline-flex; align-items: center; gap: 0.5rem;
          align-self: flex-start;
          animation: rIn 0.55s ease 1.05s both;
        }
        .rest-badge-dot {
          width: 6px; height: 6px; background: #C9A84C; border-radius: 50%;
          animation: rGlow 2s ease-in-out infinite;
        }
        .rest-badge-text {
          color: rgba(201,168,76,0.65);
          font-size: clamp(0.44rem,0.64vw,0.56rem);
          font-weight: 700; letter-spacing: 0.28em; text-transform: uppercase;
          font-family: var(--font-montserrat);
        }

        /* ── RIGHT: dining tier selector ── */
        .rest-right {
          display: flex; flex-direction: column;
          gap: clamp(0.6rem,1.2vh,1rem);
          animation: rIn 0.7s ease 0.5s both;
        }

        .rest-tier-head {
          color: rgba(255,255,255,0.22);
          font-size: clamp(0.44rem,0.66vw,0.56rem);
          letter-spacing: 0.36em; text-transform: uppercase;
          font-weight: 700; font-family: var(--font-montserrat); margin: 0;
        }

        .rest-tiers {
          display: flex; flex-direction: column; gap: 0;
          border: 1px solid rgba(201,168,76,0.12);
          position: relative;
        }

        .rest-tier {
          display: flex; align-items: flex-start;
          gap: clamp(0.6rem,1.2vw,1rem);
          padding: clamp(0.65rem,1.3vh,1.05rem) clamp(0.7rem,1.3vw,1.1rem);
          border-bottom: 1px solid rgba(201,168,76,0.07);
          cursor: pointer;
          transition: background 0.2s;
          position: relative; overflow: hidden;
        }
        .rest-tier:last-child { border-bottom: none; }
        .rest-tier::before {
          content: '';
          position: absolute; left:0; top:0; bottom:0; width:2px;
          background: #C9A84C;
          transform: scaleY(0);
          transition: transform 0.28s ease;
          transform-origin: center;
        }
        .rest-tier.active::before { transform: scaleY(1); }
        .rest-tier.active { background: rgba(201,168,76,0.055); }
        .rest-tier:not(.active):hover { background: rgba(255,255,255,0.018); }
        .rest-tier:not(.active) { opacity: 0.46; }
        .rest-tier:not(.active):hover { opacity: 0.72; }
        .rest-tier.active { opacity: 1; }

        .rest-tier-icon {
          color: #C9A84C; font-size: 0.65rem;
          flex-shrink: 0; margin-top: 0.1rem; opacity: 0.6;
          transition: opacity 0.2s;
        }
        .rest-tier.active .rest-tier-icon { opacity: 1; }

        .rest-tier-body { flex: 1; min-width: 0; }
        .rest-tier-top {
          display: flex; align-items: center; gap: 0.5rem;
          margin-bottom: 0.14rem;
        }
        .rest-tier-name {
          color: #fff;
          font-size: clamp(0.58rem,0.9vw,0.74rem);
          font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;
          font-family: var(--font-montserrat);
        }
        .rest-tier.active .rest-tier-name { color: #C9A84C; }
        .rest-tier-tag {
          background: rgba(201,168,76,0.1);
          border: 1px solid rgba(201,168,76,0.2);
          color: rgba(201,168,76,0.65);
          font-size: clamp(0.3rem,0.45vw,0.4rem);
          font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase;
          padding: 1px 5px; flex-shrink: 0;
        }
        .rest-tier-desc {
          color: rgba(255,255,255,0.38);
          font-size: clamp(0.42rem,0.64vw,0.56rem);
          line-height: 1.5; font-family: var(--font-montserrat);
          /* Hidden when inactive */
          max-height: 0; overflow: hidden;
          transition: max-height 0.3s ease, opacity 0.25s ease;
          opacity: 0;
        }
        .rest-tier.active .rest-tier-desc {
          max-height: 80px; opacity: 1;
        }

        /* ── Signature quote card ── */
        .rest-quote {
          background: rgba(5,4,2,0.82);
          border: 1px solid rgba(201,168,76,0.18);
          border-left: 3px solid #C9A84C;
          padding: clamp(0.8rem,1.6vh,1.2rem) clamp(0.9rem,1.6vw,1.3rem);
          backdrop-filter: blur(10px);
        }
        .rest-quote-label {
          color: rgba(201,168,76,0.6);
          font-size: clamp(0.42rem,0.62vw,0.52rem);
          letter-spacing: 0.3em; text-transform: uppercase;
          font-weight: 700; font-family: var(--font-montserrat);
          margin-bottom: 0.45rem;
        }
        .rest-quote-text {
          color: rgba(255,255,255,0.68);
          font-size: clamp(0.58rem,0.88vw,0.72rem);
          line-height: 1.6; font-style: italic;
          font-family: var(--font-montserrat); margin: 0 0 0.55rem;
        }
        .rest-quote-name {
          color: #C9A84C;
          font-size: clamp(0.44rem,0.66vw,0.56rem);
          font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase;
          font-family: var(--font-montserrat);
        }
        .rest-quote-role {
          color: rgba(255,255,255,0.24);
          font-size: clamp(0.38rem,0.56vw,0.48rem);
          font-family: var(--font-montserrat);
          margin-top: 2px; letter-spacing: 0.06em;
        }

        /* ── Sound button ── */
        .rest-sound {
          position: absolute;
          bottom: clamp(1.2rem,3vh,2rem);
          left: clamp(2rem,5vw,4.5rem);
          z-index: 20;
          background: transparent;
          border: 1px solid rgba(201,168,76,0.3);
          color: #C9A84C;
          display: flex; align-items: center; gap: 0.4rem;
          padding: 0.42rem 0.85rem;
          font-size: clamp(0.48rem,0.72vw,0.58rem);
          font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase;
          font-family: var(--font-montserrat);
          cursor: pointer;
          transition: background 0.2s, border-color 0.2s;
          backdrop-filter: blur(6px);
          animation: rIn 0.5s ease 1.2s both;
        }
        .rest-sound:hover { background: rgba(201,168,76,0.1); border-color: #C9A84C; }

        /* ── Watermark ── */
        .rest-watermark {
          position: absolute;
          right: clamp(1.5rem,4vw,3rem); bottom: clamp(1.5rem,4vh,3rem);
          color: rgba(201,168,76,0.04);
          font-size: clamp(5rem,11vw,9rem);
          font-weight: 800; font-family: var(--font-montserrat);
          line-height: 1; user-select: none; pointer-events: none; z-index: 4;
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 700px) {
          .rest-layout {
            grid-template-columns: 1fr;
            padding: 0 1.4rem;
          }
          .rest-right { display: none; }
          .rest-overlay-left {
            background: linear-gradient(
              to bottom,
              #050402          0%,
              rgba(5,4,2,0.97) 50%,
              rgba(5,4,2,0.75) 78%,
              rgba(5,4,2,0.0) 100%
            );
          }
          .rest-watermark { display: none; }
        }
        @media (min-width:701px) and (max-width:1024px) {
          .rest-layout { grid-template-columns: 52% 48%; }
        }
      `}</style>

      <div className="rest-root">

        {/* Video */}
        <video
          ref={videoRef}
          autoPlay muted loop playsInline preload="auto"
          src="/videos/restaurantMOA.mp4"
          onCanPlay={() => setVideoReady(true)}
          className="rest-video"
          style={{ opacity: videoReady ? 1 : 0 }}
        />

        {/* Overlays */}
        <div className="rest-dim" />
        <div className="rest-overlay-left" />
        <div className="rest-overlay-warm" />
        <div className="rest-overlay-top" />
        <div className="rest-overlay-bottom" />
        <div className="rest-accent-bar" />

        {/* Chapter */}
        <div className="rest-chapter">
          <span className="rest-chapter-num">03 / 08</span>
          <span className="rest-chapter-label">Dining & Lifestyle</span>
        </div>

        {/* Layout */}
        <div className="rest-layout">

          {/* LEFT — text */}
          <div className="rest-left">
            <p className="rest-eyebrow">Dining &amp; Lifestyle · 50+ Restaurants</p>

            <h2 className="rest-headline">
              50 restaurants.<br />
              <em>Every cuisine.</em>
            </h2>

            <h3 className="rest-sub">One destination.</h3>

            <div className="rest-divider" />

            <p className="rest-body">
              From Michelin-calibre tasting menus to fast-casual street food,
              the dining ecosystem at Mall of America keeps visitors on-property
              longer — and spending more. Every hour spent dining is an hour
              spent steps from your store.
            </p>

            <div className="rest-stats">
              {STATS.map((s) => (
                <div key={s.value} className="rest-stat">
                  <div className="rest-stat-val">{s.value}</div>
                  <div className="rest-stat-label">{s.label}</div>
                  <div className="rest-stat-sub">{s.sub}</div>
                </div>
              ))}
            </div>

            <div className="rest-badge">
              <div className="rest-badge-dot" />
              <span className="rest-badge-text">Open 7 days a week</span>
            </div>
          </div>

          {/* RIGHT — tier selector + quote */}
          <div className="rest-right">
            <p className="rest-tier-head">Dining categories</p>

            <div className="rest-tiers">
              {MENU_TIERS.map((t) => (
                <div
                  key={t.id}
                  className={`rest-tier ${activeTier === t.id ? "active" : ""}`}
                  onClick={() => setActiveTier(t.id)}
                >
                  <span className="rest-tier-icon">{t.icon}</span>
                  <div className="rest-tier-body">
                    <div className="rest-tier-top">
                      <span className="rest-tier-name">{t.name}</span>
                      <span className="rest-tier-tag">{t.tag}</span>
                    </div>
                    <div className="rest-tier-desc">{t.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quote */}
            <div className="rest-quote">
              <div className="rest-quote-label">Tenant Story</div>
              <p className="rest-quote-text">
                "Our MOA location does 40% more covers per night than any
                of our standalone restaurants. The footfall here is unlike anything."
              </p>
              <div className="rest-quote-name">Marcus Levin</div>
              <div className="rest-quote-role">Executive Chef & Owner · Levin Hospitality Group</div>
            </div>
          </div>

        </div>

        {/* Sound */}
        <button className="rest-sound" onClick={toggleSound}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
            {soundOn ? (
              <>
                <path d="M11 5L6 9H2v6h4l5 4V5z" fill="currentColor" />
                <path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </>
            ) : (
              <>
                <path d="M11 5L6 9H2v6h4l5 4V5z" fill="currentColor" />
                <line x1="23" y1="9" x2="17" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <line x1="17" y1="9" x2="23" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </>
            )}
          </svg>
          {soundOn ? "Mute" : "Sound On"}
        </button>

        <div className="rest-watermark">03</div>
      </div>
    </>
  );
}