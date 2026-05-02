"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

let _gsap: typeof import("gsap")["default"] | null = null;
const loadGsap = () =>
  _gsap
    ? Promise.resolve(_gsap)
    : import("gsap").then((m) => { _gsap = m.default; return _gsap!; });

const PERKS = [
  { icon: "◈", stat: "40M+", label: "Annual Footfall", sub: "Built-in audience, day one" },
  { icon: "◈", stat: "520+", label: "Brand Neighbours", sub: "Premium company on every floor" },
  { icon: "◈", stat: "5.6M", label: "sq ft of Presence", sub: "Scale no standalone store can match" },
  { icon: "◈", stat: "#1", label: "Mall in America", sub: "The only address that needs no map" },
];

const STEPS = [
  { n: "01", title: "Submit Inquiry", body: "Tell us your brand, target category, and preferred space size. Takes under three minutes." },
  { n: "02", title: "Space Consultation", body: "Our leasing team walks you through available units, traffic data, and neighbour brand mix." },
  { n: "03", title: "Terms & Agreement", body: "Flexible lease structures — short-term activations to long-term flagship commitments." },
  { n: "04", title: "Open Your Doors", body: "White-glove fit-out support. 40 million shoppers waiting on the other side." },
];

export default function LeaseASpacePage() {
  const router = useRouter();
  const rootRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [formOpen, setFormOpen] = useState(false);
  const [sent, setSent] = useState(false);

  // ── Entrance ────────────────────────────────────────────────────────────────
  useEffect(() => {
    const t = setTimeout(() => {
      loadGsap().then((gsap) => {
        gsap.fromTo(".las-eyebrow", { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.55, ease: "power2.out" });
        gsap.fromTo(".las-headline", { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 0.7, ease: "power2.out", delay: 0.12 });
        gsap.fromTo(".las-sub", { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.55, ease: "power2.out", delay: 0.24 });
        gsap.fromTo(".las-divider", { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: "power2.out", delay: 0.34, transformOrigin: "left" });
        gsap.fromTo(".las-perks", { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.55, ease: "power2.out", delay: 0.44 });
        gsap.fromTo(".las-cta", { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", delay: 0.56 });
        gsap.fromTo(".las-steps", { opacity: 0, x: 20 }, { opacity: 1, x: 0, duration: 0.65, ease: "power2.out", delay: 0.3 });
        gsap.fromTo(".las-img", { opacity: 0, scale: 1.04 }, { opacity: 1, scale: 1, duration: 1.1, ease: "power2.out" });
      });
    }, 200);
    return () => clearTimeout(t);
  }, []);

  // step progress line
  useEffect(() => {
    if (lineRef.current)
      lineRef.current.style.height = `${(active / (STEPS.length - 1)) * 100}%`;
  }, [active]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  }, []);

  return (
    <>
      <style>{`
        /* ── Root ── */
        .las-root {
          position: fixed; inset: 0;
          background: #050402;
          display: grid;
          grid-template-columns: 1fr 1fr;
          grid-template-rows: 1fr;
          overflow: hidden;
          font-family: var(--font-montserrat);
        }

        /* ══════════════════════════════════════
           LEFT COLUMN
        ══════════════════════════════════════ */
        .las-left {
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: clamp(1.8rem,5vh,3.5rem) clamp(1.6rem,4vw,3.5rem) clamp(4rem,8vh,5rem);
          overflow: hidden;
          z-index: 10;
          border-right: 1px solid rgba(201,168,76,0.1);
          gap: clamp(0.9rem,2vh,1.5rem);
        }
        /* gold left bar */
        .las-left::before {
          content:'';
          position:absolute; left:0; top:12%; bottom:12%; width:3px;
          background: linear-gradient(to bottom, transparent, #C9A84C, transparent);
        }

        .las-eyebrow {
          color: #C9A84C;
          font-size: clamp(0.52rem,0.8vw,0.66rem);
          letter-spacing: 0.44em;
          text-transform: uppercase;
          font-weight: 700;
          margin: 0; opacity:0;
        }

        .las-headline {
          color: #fff;
          font-size: clamp(1.7rem,3.2vw,3rem);
          font-weight: 800;
          line-height: 1.05;
          margin: 0; opacity:0;
        }
        .las-headline em { color:#C9A84C; font-style:normal; }

        .las-sub {
          color: rgba(255,255,255,0.46);
          font-size: clamp(0.72rem,1.1vw,0.86rem);
          font-weight: 400;
          line-height: 1.75;
          margin: 0; max-width: 400px; opacity:0;
        }

        .las-divider {
          width:52px; height:2px;
          background: linear-gradient(to right,#C9A84C,rgba(201,168,76,0.15));
        }

        /* ── Perks grid ── */
        .las-perks {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: clamp(0.55rem,1.2vh,1rem) clamp(0.6rem,1.5vw,1.2rem);
          opacity:0;
        }
        .las-perk {
          background: rgba(201,168,76,0.045);
          border: 1px solid rgba(201,168,76,0.14);
          padding: clamp(0.6rem,1.2vh,1rem) clamp(0.7rem,1.2vw,1rem);
          position: relative;
          transition: border-color 0.25s, background 0.25s;
          cursor: default;
        }
        .las-perk:hover {
          border-color: rgba(201,168,76,0.38);
          background: rgba(201,168,76,0.08);
        }
        .las-perk-icon {
          color: #C9A84C;
          font-size: 0.7rem;
          letter-spacing: 0.05em;
          margin-bottom: 0.35rem;
        }
        .las-perk-stat {
          color: #C9A84C;
          font-size: clamp(1rem,1.8vw,1.5rem);
          font-weight: 800;
          line-height: 1;
          margin-bottom: 0.2rem;
          font-variant-numeric: tabular-nums;
        }
        .las-perk-label {
          color: #fff;
          font-size: clamp(0.5rem,0.75vw,0.62rem);
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }
        .las-perk-sub {
          color: rgba(255,255,255,0.32);
          font-size: clamp(0.42rem,0.62vw,0.54rem);
          line-height: 1.4;
          margin-top: 0.15rem;
        }

        /* ── CTA buttons ── */
        .las-cta {
          display: flex;
          gap: 0.75rem;
          align-items: center;
          flex-wrap: wrap;
          opacity:0;
        }
        .las-btn-primary {
          background: #C9A84C;
          color: #050402;
          border: none;
          padding: clamp(0.6rem,1.2vh,0.85rem) clamp(1.2rem,2.5vw,2rem);
          font-size: clamp(0.6rem,0.9vw,0.72rem);
          font-weight: 800;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          font-family: var(--font-montserrat);
          cursor: pointer;
          transition: all 0.22s ease;
        }
        .las-btn-primary:hover {
          background: #e0bc5c;
          transform: translateY(-1px);
          box-shadow: 0 6px 24px rgba(201,168,76,0.35);
        }
        .las-btn-secondary {
          background: transparent;
          color: rgba(255,255,255,0.55);
          border: 1px solid rgba(255,255,255,0.14);
          padding: clamp(0.6rem,1.2vh,0.85rem) clamp(1rem,2vw,1.5rem);
          font-size: clamp(0.58rem,0.85vw,0.68rem);
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          font-family: var(--font-montserrat);
          cursor: pointer;
          transition: all 0.22s ease;
        }
        .las-btn-secondary:hover {
          border-color: rgba(201,168,76,0.4);
          color: #C9A84C;
        }

        /* ══════════════════════════════════════
           RIGHT COLUMN  (photo + steps overlay)
        ══════════════════════════════════════ */
        .las-right {
          position: relative;
          overflow: hidden;
        }

        /* Photo */
        .las-img {
          position: absolute; inset:0;
          width:100%; height:100%;
          object-fit: cover;
          object-position: center 30%;
          opacity:0;
          filter: brightness(0.38) saturate(0.7);
        }

        /* Gradient overlays on photo */
        .las-right-fade-l {
          position:absolute; top:0; left:0; bottom:0; width:30%;
          background: linear-gradient(to right, #050402, transparent);
          z-index:2; pointer-events:none;
        }
        .las-right-fade-b {
          position:absolute; left:0; right:0; bottom:0; height:35%;
          background: linear-gradient(to top, #050402, transparent);
          z-index:2; pointer-events:none;
        }

        /* Steps panel overlaid on photo */
        .las-steps {
          position:absolute;
          bottom: clamp(4rem,9vh,6rem);
          left: clamp(1.2rem,3vw,2.5rem);
          right: clamp(1.2rem,3vw,2.5rem);
          z-index:10;
          opacity:0;
        }

        .las-steps-title {
          color: rgba(255,255,255,0.28);
          font-size: clamp(0.48rem,0.7vw,0.6rem);
          letter-spacing: 0.38em;
          text-transform: uppercase;
          font-weight: 700;
          margin-bottom: clamp(0.8rem,1.8vh,1.4rem);
        }

        .las-steps-list {
          display: flex;
          flex-direction: column;
          gap: 0;
          position: relative;
        }

        /* Animated progress line */
        .las-steps-track {
          position: absolute;
          left: calc(clamp(1.4rem,2.2vw,1.8rem) - 0.5px);
          top: clamp(0.7rem,1.3vh,1rem);
          bottom: clamp(0.7rem,1.3vh,1rem);
          width: 1px;
          background: rgba(201,168,76,0.12);
          overflow: hidden;
        }
        .las-steps-line {
          position: absolute;
          top: 0; left: 0; right: 0;
          background: #C9A84C;
          transition: height 0.5s cubic-bezier(0.4,0,0.2,1);
          height: 0%;
        }

        .las-step {
          display: flex;
          gap: clamp(0.8rem,1.5vw,1.2rem);
          align-items: flex-start;
          padding: clamp(0.55rem,1.1vh,0.9rem) 0;
          cursor: pointer;
          transition: opacity 0.25s;
          position: relative;
          z-index:1;
        }
        .las-step:not(.active) { opacity: 0.42; }
        .las-step:hover { opacity: 0.75; }
        .las-step.active { opacity: 1; }

        .las-step-num-wrap {
          flex-shrink:0;
          width: clamp(1.2rem,2.2vw,1.6rem);
          height: clamp(1.2rem,2.2vw,1.6rem);
          border: 1px solid rgba(201,168,76,0.35);
          background: rgba(5,4,2,0.85);
          display: flex; align-items:center; justify-content:center;
          transition: border-color 0.25s, background 0.25s;
        }
        .las-step.active .las-step-num-wrap {
          border-color: #C9A84C;
          background: rgba(201,168,76,0.14);
        }
        .las-step-num {
          color: #C9A84C;
          font-size: clamp(0.42rem,0.65vw,0.56rem);
          font-weight: 800;
          letter-spacing: 0.05em;
        }
        .las-step-body { flex:1; }
        .las-step-title {
          color: #fff;
          font-size: clamp(0.6rem,0.92vw,0.76rem);
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 0.18rem;
        }
        .las-step-desc {
          color: rgba(255,255,255,0.4);
          font-size: clamp(0.5rem,0.72vw,0.62rem);
          line-height: 1.55;
          max-width: 340px;
        }

        /* ══════════════════════════════════════
           BOTTOM NAV
        ══════════════════════════════════════ */
        .las-nav {
          position: fixed;
          bottom:0; left:0; right:0; z-index:30;
          display: flex; align-items:center; justify-content:space-between;
          padding: clamp(0.7rem,1.8vh,1.1rem) clamp(1rem,3vw,2rem);
          background: linear-gradient(to top, rgba(5,4,2,0.9) 0%, transparent 100%);
        }
        .las-nav-back {
          background: transparent;
          border: 1px solid rgba(201,168,76,0.25);
          color: #C9A84C;
          width: clamp(34px,4vw,42px); height: clamp(34px,4vw,42px);
          display:flex; align-items:center; justify-content:center;
          font-size:1rem; cursor:pointer; backdrop-filter:blur(8px);
          transition: all 0.2s;
          font-family: var(--font-montserrat);
        }
        .las-nav-back:hover { background: rgba(201,168,76,0.1); border-color:#C9A84C; }
        .las-nav-label {
          color: rgba(255,255,255,0.18);
          font-size: clamp(0.48rem,0.72vw,0.58rem);
          letter-spacing: 0.22em;
          text-transform: uppercase;
          font-weight: 600;
        }

        /* ══════════════════════════════════════
           FORM MODAL
        ══════════════════════════════════════ */
        .las-modal-bg {
          position:fixed; inset:0; z-index:50;
          background: rgba(5,4,2,0.88);
          backdrop-filter: blur(12px);
          display:flex; align-items:center; justify-content:center;
          padding: 1.5rem;
          animation: fadeIn 0.25s ease;
        }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }

        .las-modal {
          background: #0b0905;
          border: 1px solid rgba(201,168,76,0.22);
          width: 100%; max-width: 520px;
          padding: clamp(1.8rem,4vw,3rem);
          position: relative;
          animation: slideUp 0.3s cubic-bezier(0.34,1.56,0.64,1);
        }
        @keyframes slideUp {
          from{ opacity:0; transform:translateY(20px) }
          to  { opacity:1; transform:translateY(0)    }
        }

        .las-modal-close {
          position:absolute; top:1rem; right:1rem;
          background:transparent; border:none;
          color:rgba(255,255,255,0.3); font-size:1.2rem;
          cursor:pointer; line-height:1;
          transition: color 0.2s;
          font-family: var(--font-montserrat);
        }
        .las-modal-close:hover { color:#C9A84C; }

        .las-modal h3 {
          color:#fff; font-size:clamp(1rem,1.8vw,1.4rem);
          font-weight:800; margin:0 0 0.25rem;
          font-family: var(--font-montserrat);
        }
        .las-modal-sub {
          color:rgba(255,255,255,0.38);
          font-size:clamp(0.62rem,0.9vw,0.74rem);
          margin:0 0 1.6rem;
          font-family: var(--font-montserrat);
        }

        .las-field {
          display:flex; flex-direction:column; gap:0.35rem;
          margin-bottom: 1rem;
        }
        .las-field label {
          color: rgba(255,255,255,0.45);
          font-size:clamp(0.5rem,0.72vw,0.6rem);
          letter-spacing:0.22em; text-transform:uppercase;
          font-weight:700; font-family: var(--font-montserrat);
        }
        .las-field input,
        .las-field select,
        .las-field textarea {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(201,168,76,0.18);
          color: #fff;
          padding: 0.65rem 0.85rem;
          font-size:clamp(0.65rem,0.95vw,0.78rem);
          font-family: var(--font-montserrat);
          outline:none; resize:none;
          transition: border-color 0.2s;
          width:100%; box-sizing:border-box;
        }
        .las-field input::placeholder,
        .las-field textarea::placeholder { color:rgba(255,255,255,0.2); }
        .las-field select option { background:#0b0905; }
        .las-field input:focus,
        .las-field select:focus,
        .las-field textarea:focus { border-color: rgba(201,168,76,0.5); }

        .las-field-row { display:grid; grid-template-columns:1fr 1fr; gap:0.8rem; }

        .las-submit {
          width:100%; background:#C9A84C; border:none;
          color:#050402; font-weight:800;
          font-size:clamp(0.62rem,0.9vw,0.72rem);
          letter-spacing:0.18em; text-transform:uppercase;
          padding:0.85rem; cursor:pointer;
          font-family: var(--font-montserrat);
          margin-top:0.4rem;
          transition: background 0.2s, transform 0.2s;
        }
        .las-submit:hover { background:#e0bc5c; transform:translateY(-1px); }

        .las-sent {
          text-align:center; padding:2rem 0;
        }
        .las-sent-icon { color:#C9A84C; font-size:2.2rem; margin-bottom:1rem; }
        .las-sent h4 {
          color:#fff; font-size:1.1rem; font-weight:800; margin:0 0 0.5rem;
          font-family: var(--font-montserrat);
        }
        .las-sent p {
          color:rgba(255,255,255,0.38); font-size:0.72rem;
          font-family: var(--font-montserrat); line-height:1.6; margin:0;
        }

        /* ══════════════════════════════════════
           RESPONSIVE — mobile stacks vertically
        ══════════════════════════════════════ */
        @media (max-width: 700px) {
          .las-root {
            grid-template-columns: 1fr;
            grid-template-rows: 52vh 1fr;
          }
          /* On mobile: photo on top, content below */
          .las-right { grid-row:1; }
          .las-left  {
            grid-row:2;
            border-right:none;
            border-top:1px solid rgba(201,168,76,0.1);
            padding: 1.2rem 1.2rem 4.5rem;
            gap: 0.7rem;
            overflow-y: auto;
            justify-content: flex-start;
          }
          .las-left::before { display:none; }

          .las-steps {
            bottom: clamp(1rem,2vh,1.5rem);
            left: 1rem; right: 1rem;
          }
          .las-perks {
            grid-template-columns: 1fr 1fr;
          }
        }

        /* Tablet */
        @media (min-width:701px) and (max-width:1024px) {
          .las-root {
            grid-template-columns: 45% 55%;
          }
        }
      `}</style>

      <div className="las-root" ref={rootRef}>

        {/* ══ LEFT ══ */}
        <div className="las-left">

          <p className="las-eyebrow">Mall of America · Leasing</p>

          <h1 className="las-headline">
            Your brand.<br />
            America's biggest<br />
            <em>stage.</em>
          </h1>

          <p className="las-sub">
            40 million visitors walk through our doors every year.
            Secure your space among 520+ world-class brands and
            turn footfall into a flagship story.
          </p>

          <div className="las-divider" />

          {/* Perks */}
          <div className="las-perks">
            {PERKS.map((p) => (
              <div key={p.label} className="las-perk">
                <div className="las-perk-icon">{p.icon}</div>
                <div className="las-perk-stat">{p.stat}</div>
                <div className="las-perk-label">{p.label}</div>
                <div className="las-perk-sub">{p.sub}</div>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="las-cta">
            <button className="las-btn-primary" onClick={() => setFormOpen(true)}>
              Request a Space
            </button>
            <button className="las-btn-secondary" onClick={() => router.push("/takeAction/ScheduleTour")}>
              Schedule a Tour →
            </button>
          </div>

        </div>

        {/* ══ RIGHT ══ */}
        <div className="las-right">

          {/* Photo */}
          <img
            className="las-img"
            src="/photos/lease.webp"
            alt="Lease signing at Mall of America"
          />

          {/* Fades */}
          <div className="las-right-fade-l" />
          <div className="las-right-fade-b" />

          {/* Steps */}
          <div className="las-steps">
            <p className="las-steps-title">How it works</p>

            <div className="las-steps-list">
              {/* Progress track */}
              <div className="las-steps-track">
                <div className="las-steps-line" ref={lineRef} />
              </div>

              {STEPS.map((s, i) => (
                <div
                  key={s.n}
                  className={`las-step ${active === i ? "active" : ""}`}
                  onClick={() => setActive(i)}
                >
                  <div className="las-step-num-wrap">
                    <span className="las-step-num">{s.n}</span>
                  </div>
                  <div className="las-step-body">
                    <p className="las-step-title">{s.title}</p>
                    {active === i && (
                      <p className="las-step-desc">{s.body}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* ══ BOTTOM NAV ══ */}
      <div className="las-nav">
        <button className="las-nav-back" onClick={() => router.back()} aria-label="Back">‹</button>
        <span className="las-nav-label">Lease a Space</span>
        <div style={{ width: "clamp(34px,4vw,42px)" }} />
      </div>

      {/* ══ FORM MODAL ══ */}
      {formOpen && (
        <div className="las-modal-bg" onClick={(e) => { if (e.target === e.currentTarget) { setFormOpen(false); setSent(false); } }}>
          <div className="las-modal">
            <button className="las-modal-close" onClick={() => { setFormOpen(false); setSent(false); }}>✕</button>

            {sent ? (
              <div className="las-sent">
                <div className="las-sent-icon">◈</div>
                <h4>Inquiry Received</h4>
                <p>Our leasing team will reach out within 1 business day.<br />Welcome to Mall of America.</p>
              </div>
            ) : (
              <>
                <h3>Request a Space</h3>
                <p className="las-modal-sub">Fill in the details — we'll handle the rest.</p>

                <form onSubmit={handleSubmit}>
                  <div className="las-field-row">
                    <div className="las-field">
                      <label>First Name</label>
                      <input type="text" placeholder="Alex" required />
                    </div>
                    <div className="las-field">
                      <label>Last Name</label>
                      <input type="text" placeholder="Morgan" required />
                    </div>
                  </div>

                  <div className="las-field">
                    <label>Brand / Company</label>
                    <input type="text" placeholder="Your brand name" required />
                  </div>

                  <div className="las-field">
                    <label>Email</label>
                    <input type="email" placeholder="you@brand.com" required />
                  </div>

                  <div className="las-field-row">
                    <div className="las-field">
                      <label>Category</label>
                      <select required>
                        <option value="">Select…</option>
                        <option>Fashion & Apparel</option>
                        <option>Electronics & Tech</option>
                        <option>Food & Beverage</option>
                        <option>Beauty & Wellness</option>
                        <option>Entertainment</option>
                        <option>Lifestyle & Home</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div className="las-field">
                      <label>Space Size</label>
                      <select required>
                        <option value="">Select…</option>
                        <option>Under 500 sqft</option>
                        <option>500 – 2,000 sqft</option>
                        <option>2,000 – 5,000 sqft</option>
                        <option>5,000+ sqft (Flagship)</option>
                      </select>
                    </div>
                  </div>

                  <div className="las-field">
                    <label>Tell us about your brand</label>
                    <textarea rows={3} placeholder="What you sell, target audience, vision for the space…" />
                  </div>

                  <button className="las-submit" type="submit">
                    Submit Inquiry →
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