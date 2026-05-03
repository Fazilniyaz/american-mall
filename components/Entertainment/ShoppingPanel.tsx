"use client";

import Image from "next/image";
import { useState } from "react";

const STATS = [
  { value: "520+", label: "Stores", sub: "Every tier, every category" },
  { value: "$2B+", label: "Annual Revenue", sub: "Generated on-property" },
  { value: "40M", label: "Shoppers / yr", sub: "The largest retail audience" },
  { value: "#1", label: "US Retail Destination", sub: "No other address compares" },
];

const CATEGORIES = [
  {
    id: "luxury",
    name: "Luxury & Premium",
    tag: "Flagship",
    icon: "◈",
    desc: "Louis Vuitton, Coach, Sephora — premium flagships that define the brand mix and elevate every neighbour.",
    brands: ["Louis Vuitton", "Coach", "Sephora", "Michael Kors"],
  },
  {
    id: "fashion",
    name: "Fashion & Apparel",
    tag: "High Volume",
    icon: "◈",
    desc: "Nike, H&M, Zara, Levi's — the household names that drive footfall and anchor entire wings.",
    brands: ["Nike", "H&M", "Zara", "Levi's"],
  },
  {
    id: "tech",
    name: "Electronics & Tech",
    tag: "Destination",
    icon: "◈",
    desc: "Apple, Samsung, Microsoft — tech destinations that draw repeat visits and high-intent shoppers.",
    brands: ["Apple", "Samsung", "Microsoft", "Best Buy"],
  },
] as const;

type CatId = typeof CATEGORIES[number]["id"];

export default function ShoppingPanel() {
  const [activecat, setActivecat] = useState<CatId>("luxury");
  const cat = CATEGORIES.find(c => c.id === activecat)!;

  return (
    <>
      <style>{`
        /* ── Keyframes ── */
        @keyframes shUp {
          from { opacity:0; transform:translateY(18px); }
          to   { opacity:1; transform:translateY(0);    }
        }
        @keyframes shIn  { from{opacity:0} to{opacity:1} }
        @keyframes shSx  {
          from { transform:scaleX(0); }
          to   { transform:scaleX(1); }
        }
        @keyframes shGlow {
          0%,100% { box-shadow:0 0 0 0   rgba(201,168,76,0.55); }
          50%     { box-shadow:0 0 0 6px rgba(201,168,76,0);     }
        }

        /* ── Shell ── */
        .sh-root {
          position: relative;
          width: 100%; height: 100vh;
          overflow: hidden;
          background: #050402;
          display: flex;
          align-items: center;
        }

        /* ── Image layer ── */
        .sh-img-wrap {
          position: absolute; inset: 0; z-index: 0;
        }

        /* ── Overlays ── */
        /* Global brightness dim */
        .sh-dim {
          position: absolute; inset: 0; z-index: 1;
          background: rgba(5,4,2,0.30);
          pointer-events: none;
        }
        /*
          RIGHT-side content: image is on the right half.
          Solid dark zone on RIGHT → fade left into image.
          Text lives on the right, so we reverse the gradient direction.
        */
        .sh-overlay-right {
          position: absolute; inset: 0; z-index: 2;
          background: linear-gradient(
            to left,
            #050402          0%,
            #050402          40%,
            rgba(5,4,2,0.94) 47%,
            rgba(5,4,2,0.68) 57%,
            rgba(5,4,2,0.28) 68%,
            rgba(5,4,2,0.0)  78%
          );
          pointer-events: none;
        }
        /* Subtle cool wash on image side (left) */
        .sh-overlay-cool {
          position: absolute; inset: 0; z-index: 2;
          background: linear-gradient(to right, rgba(5,4,2,0.18) 0%, transparent 55%);
          pointer-events: none;
        }
        .sh-overlay-top {
          position: absolute; top:0; left:0; right:0; height:14%; z-index:3;
          background: linear-gradient(to bottom, rgba(5,4,2,0.72), transparent);
          pointer-events: none;
        }
        .sh-overlay-bottom {
          position: absolute; bottom:0; left:0; right:0; height:20%; z-index:3;
          background: linear-gradient(to top, rgba(5,4,2,0.88), transparent);
          pointer-events: none;
        }

        /* ── Gold RIGHT accent bar (content is on right) ── */
        .sh-accent-bar {
          position: absolute;
          right:0; top:14%; bottom:14%; width:3px; z-index:10;
          background: linear-gradient(to bottom, transparent, #C9A84C, transparent);
        }

        /* ── Chapter badge ── */
        .sh-chapter {
          position: absolute;
          top: clamp(1.2rem,3vh,2rem);
          left: clamp(1.5rem,4vw,3rem);
          z-index: 20;
          display: flex; flex-direction: column; gap: 3px;
          animation: shIn 0.6s ease 0.2s both;
        }
        .sh-chapter-num {
          color: #C9A84C;
          font-size: clamp(0.55rem,0.82vw,0.68rem);
          font-weight: 800; letter-spacing: 0.18em;
          font-family: var(--font-montserrat);
        }
        .sh-chapter-label {
          color: rgba(255,255,255,0.22);
          font-size: clamp(0.44rem,0.64vw,0.54rem);
          letter-spacing: 0.22em; text-transform: uppercase;
          font-family: var(--font-montserrat); font-weight: 600;
        }

        /* ── Layout: image left, content right ── */
        .sh-layout {
          position: relative; z-index: 10;
          width: 100%;
          display: grid;
          grid-template-columns: 1fr 1fr;
          align-items: center;
          padding: 0 clamp(2rem,5vw,4.5rem);
          gap: clamp(1.5rem,3vw,3rem);
        }

        /* ── LEFT: brand pills + category preview ── */
        .sh-left {
          display: flex; flex-direction: column;
          gap: clamp(0.8rem,1.5vh,1.2rem);
          animation: shIn 0.7s ease 0.35s both;
           background: rgba(5, 4, 2, 0.72);
  backdrop-filter: blur(4px);
  padding: clamp(1rem, 2vw, 1.5rem);
  border: 1px solid rgba(201, 168, 76, 0.1);
        }

        .sh-left-label {
          color: rgba(255,255,255,0.22);
          font-size: clamp(0.44rem,0.66vw,0.56rem);
          letter-spacing: 0.36em; text-transform: uppercase;
          font-weight: 700; font-family: var(--font-montserrat); margin: 0;
            color: rgba(255, 255, 255, 0.55); /* was 0.22 */

        }

        /* Category tabs */
        .sh-cats {
          border: 1px solid rgba(201,168,76,0.12);
          display: flex; flex-direction: column;
        }
        .sh-cat {
          display: flex; align-items: flex-start; gap: 0.7rem;
          padding: clamp(0.65rem,1.3vh,1rem) clamp(0.7rem,1.2vw,1.1rem);
          border-bottom: 1px solid rgba(201,168,76,0.07);
          cursor: pointer;
          transition: background 0.2s;
          position: relative; overflow: hidden;
        }
        .sh-cat:last-child { border-bottom: none; }
        .sh-cat::before {
          content: '';
          position: absolute; left:0; top:0; bottom:0; width:2px;
          background: #C9A84C;
          transform: scaleY(0);
          transition: transform 0.28s ease;
          transform-origin: center;
        }
        .sh-cat.active::before { transform: scaleY(1); }
        .sh-cat.active { background: rgba(201,168,76,0.055); }
        .sh-cat:not(.active) { opacity: 0.44; }
        .sh-cat:not(.active):hover { opacity: 0.72; background: rgba(255,255,255,0.018); }

        .sh-cat-icon {
          color: #C9A84C; font-size: 0.6rem; flex-shrink: 0;
          margin-top: 0.1rem; opacity: 0.6; transition: opacity 0.2s;
        }
        .sh-cat.active .sh-cat-icon { opacity: 1; }

        .sh-cat-body { flex: 1; min-width: 0; }
        .sh-cat-top  { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.12rem; }
        .sh-cat-name {
          color: #fff;
          font-size: clamp(0.56rem,0.88vw,0.72rem);
          font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;
          font-family: var(--font-montserrat);
        }
        .sh-cat.active .sh-cat-name { color: #C9A84C; }
        .sh-cat-tag {
          background: rgba(201,168,76,0.1);
          border: 1px solid rgba(201,168,76,0.2);
          color: rgba(201,168,76,0.65);
          font-size: clamp(0.3rem,0.44vw,0.4rem);
          font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase;
          padding: 1px 5px; flex-shrink: 0;
        }
        .sh-cat-desc {
          color: rgba(255,255,255,0.36);
          font-size: clamp(0.4rem,0.6vw,0.52rem);
          line-height: 1.5; font-family: var(--font-montserrat);
          max-height: 0; overflow: hidden;
          transition: max-height 0.32s ease, opacity 0.25s ease;
          opacity: 0;
        }
        .sh-cat.active .sh-cat-desc { max-height: 60px; opacity: 1; }

        /* Brand pills row — shows active category's brands */
        .sh-brands {
          display: flex; flex-wrap: wrap; gap: 0.38rem;
          min-height: 28px;
        }
        .sh-brand-label {
          color: rgba(255,255,255,0.2);
          font-size: clamp(0.4rem,0.58vw,0.5rem);
          letter-spacing: 0.3em; text-transform: uppercase;
          font-weight: 700; font-family: var(--font-montserrat);
          display: block; margin-bottom: 0.35rem; width: 100%;
        }
        .sh-pill {
          background: rgba(5,4,2,0.76);
          border: 1px solid rgba(201,168,76,0.16);
          color: rgba(255,255,255,0.4);
          font-size: clamp(0.38rem,0.56vw,0.5rem);
          font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;
          padding: 3px 9px; backdrop-filter: blur(6px);
          transition: border-color 0.2s, color 0.2s, background 0.2s;
          white-space: nowrap;
        }
        .sh-pill:hover {
          border-color: rgba(201,168,76,0.42); color: #C9A84C;
          background: rgba(201,168,76,0.07);
        }
        .sh-pill-more {
          color: rgba(201,168,76,0.4);
          border-color: rgba(201,168,76,0.1);
        }

        /* ── RIGHT: text content ── */
        .sh-right {
          display: flex; flex-direction: column;
          gap: clamp(0.75rem,1.6vh,1.25rem);
          max-width: 480px;
          justify-self: end;
        }

        .sh-eyebrow {
          color: #C9A84C;
          font-size: clamp(0.52rem,0.8vw,0.66rem);
          letter-spacing: 0.44em; text-transform: uppercase;
          font-family: var(--font-montserrat); font-weight: 700; margin: 0;
          animation: shUp 0.55s ease 0.30s both;
        }
        .sh-headline {
          color: #fff;
          font-size: clamp(2rem,4.5vw,4.2rem);
          font-weight: 800; font-family: var(--font-montserrat);
          line-height: 0.96; margin: 0;
          animation: shUp 0.70s ease 0.42s both;
        }
        .sh-headline em { color: #C9A84C; font-style: normal; }

        .sh-sub {
          color: rgba(255,255,255,0.52);
          font-size: clamp(1rem,2vw,1.6rem);
          font-weight: 800; font-family: var(--font-montserrat);
          line-height: 1.1; margin: 0;
          animation: shUp 0.60s ease 0.54s both;
        }
        .sh-divider {
          width: 48px; height: 2px;
          background: linear-gradient(to right, #C9A84C, rgba(201,168,76,0.12));
          transform-origin: left;
          animation: shSx 0.50s ease 0.66s both;
        }
        .sh-body {
          color: rgba(255,255,255,0.62);
          font-size: clamp(0.74rem,1.1vw,0.9rem);
          font-family: var(--font-montserrat); font-weight: 400;
          line-height: 1.8; margin: 0; max-width: 400px;
          animation: shUp 0.55s ease 0.76s both;
        }

        /* ── Stats ── */
        .sh-stats {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: clamp(0.4rem,0.8vh,0.65rem);
          animation: shUp 0.55s ease 0.86s both;
        }
        .sh-stat {
          background: rgba(201,168,76,0.045);
          border: 1px solid rgba(201,168,76,0.14);
          padding: clamp(0.5rem,1vh,0.85rem) clamp(0.6rem,1vw,0.9rem);
          transition: border-color 0.25s, background 0.25s; cursor: default;
        }
        .sh-stat:hover { border-color:rgba(201,168,76,0.32); background:rgba(201,168,76,0.08); }
        .sh-stat-val {
          color: #C9A84C;
          font-size: clamp(1rem,1.9vw,1.5rem);
          font-weight: 800; font-family: var(--font-montserrat);
          line-height: 1; font-variant-numeric: tabular-nums;
        }
        .sh-stat-label {
          color: #fff;
          font-size: clamp(0.42rem,0.62vw,0.56rem);
          font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase;
          font-family: var(--font-montserrat); margin-top: 0.2rem;
        }
        .sh-stat-sub {
          color: rgba(255,255,255,0.28);
          font-size: clamp(0.36rem,0.54vw,0.48rem);
          font-family: var(--font-montserrat); margin-top: 0.08rem; line-height: 1.3;
        }

        /* ── Badge ── */
        .sh-badge {
          display: inline-flex; align-items: center; gap: 0.5rem;
          align-self: flex-start;
          animation: shIn 0.55s ease 1.05s both;
        }
        .sh-badge-dot {
          width: 6px; height: 6px; background: #C9A84C; border-radius: 50%;
          animation: shGlow 2s ease-in-out infinite;
        }
        .sh-badge-text {
          color: rgba(201,168,76,0.65);
          font-size: clamp(0.44rem,0.64vw,0.56rem);
          font-weight: 700; letter-spacing: 0.28em; text-transform: uppercase;
          font-family: var(--font-montserrat);
        }

        /* ── Watermark ── */
        .sh-watermark {
          position: absolute;
          left: clamp(1.5rem,4vw,3rem); bottom: clamp(1.5rem,4vh,3rem);
          color: rgba(201,168,76,0.04);
          font-size: clamp(5rem,11vw,9rem);
          font-weight: 800; font-family: var(--font-montserrat);
          line-height: 1; user-select: none; pointer-events: none; z-index: 4;
        }

        /* ── Responsive ── */
        @media (max-width: 700px) {
          .sh-layout { grid-template-columns: 1fr; padding: 0 1.4rem; }
          .sh-left { display: none; }
          .sh-right { justify-self: start; max-width: 100%; }
          .sh-overlay-right {
            background: linear-gradient(
              to bottom,
              #050402          0%,
              rgba(5,4,2,0.97) 50%,
              rgba(5,4,2,0.75) 78%,
              rgba(5,4,2,0.0) 100%
            );
          }
          .sh-watermark { display: none; }
          .sh-accent-bar { right: auto; left: 0; }
        }
        @media (min-width:701px) and (max-width:1024px) {
          .sh-layout { grid-template-columns: 48% 52%; }
        }
      `}</style>

      <div className="sh-root">

        {/* ── Background image ── */}
        <div className="sh-img-wrap">
          <Image
            src="/photos/shoppingMoa.webp"
            alt="Mall of America retail floor"
            fill
            priority
            sizes="100vw"
            style={{ objectFit: "cover", objectPosition: "center 35%" }}
          />
        </div>

        {/* ── Overlays ── */}
        <div className="sh-dim" />
        <div className="sh-overlay-right" />
        <div className="sh-overlay-cool" />
        <div className="sh-overlay-top" />
        <div className="sh-overlay-bottom" />
        <div className="sh-accent-bar" />

        {/* ── Chapter ── */}
        <div className="sh-chapter">
          <span className="sh-chapter-num">04 / 08</span>
          <span className="sh-chapter-label">Retail & Fashion</span>
        </div>

        {/* ── Layout ── */}
        <div className="sh-layout">

          {/* LEFT — category selector */}
          <div className="sh-left">
            <p className="sh-left-label">Retail categories</p>

            <div className="sh-cats">
              {CATEGORIES.map((c) => (
                <div
                  key={c.id}
                  className={`sh-cat ${activecat === c.id ? "active" : ""}`}
                  onClick={() => setActivecat(c.id)}
                >
                  <span className="sh-cat-icon">{c.icon}</span>
                  <div className="sh-cat-body">
                    <div className="sh-cat-top">
                      <span className="sh-cat-name">{c.name}</span>
                      <span className="sh-cat-tag">{c.tag}</span>
                    </div>
                    <div className="sh-cat-desc">{c.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Brand pills for active category */}
            <div className="sh-brands">
              <span className="sh-brand-label">Brands in this tier</span>
              {cat.brands.map(b => (
                <span key={b} className="sh-pill">{b}</span>
              ))}
              <span className="sh-pill sh-pill-more">+500 more</span>
            </div>
          </div>

          {/* RIGHT — text */}
          <div className="sh-right">
            <p className="sh-eyebrow">Retail &amp; Fashion · 520+ Stores</p>

            <h2 className="sh-headline">
              520 stores.<br />
              <em>Every category.</em>
            </h2>

            <h3 className="sh-sub">From luxury to everyday.</h3>

            <div className="sh-divider" />

            <p className="sh-body">
              Nike. H&amp;M. Zara. Coach. Sephora. Louis Vuitton.
              Mall of America hosts flagship stores across every retail tier —
              luxury flagships to fast fashion, beauty to electronics.
              Your brand opens alongside the names that define global retail.
            </p>

            <div className="sh-stats">
              {STATS.map((s) => (
                <div key={s.value} className="sh-stat">
                  <div className="sh-stat-val">{s.value}</div>
                  <div className="sh-stat-label">{s.label}</div>
                  <div className="sh-stat-sub">{s.sub}</div>
                </div>
              ))}
            </div>

            <div className="sh-badge">
              <div className="sh-badge-dot" />
              <span className="sh-badge-text">Leasing options on final slide</span>
            </div>
          </div>

        </div>

        <div className="sh-watermark">04</div>
      </div>
    </>
  );
}