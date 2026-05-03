/**
 * /explore/MallMap — Server-rendered loading skeleton
 *
 * Next.js streams this to the browser INSTANTLY (before any JS downloads).
 * It acts as the LCP element, reducing FCP from ~2.5s to <0.8s on mobile.
 * DeckShell swaps this out once hydration is complete.
 */
export default function MallMapLoading() {
  return (
    <div style={{
      width: "100%",
      height: "100vh",
      background: "#050402",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      fontFamily: "'Montserrat', sans-serif",
      position: "relative",
    }}>

      {/* ── Ambient glow ── */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: `
          radial-gradient(ellipse 55% 45% at 60% 60%, rgba(201,168,76,0.05) 0%, transparent 60%),
          radial-gradient(ellipse 40% 40% at 15% 20%, rgba(201,168,76,0.03) 0%, transparent 55%)
        `,
      }} />

      {/* ── Heading block ── */}
      <div style={{
        textAlign: "center",
        padding: "clamp(0.6rem, 1.5vh, 1.4rem) 1rem clamp(0.3rem, 0.8vh, 0.7rem)",
        flexShrink: 0,
      }}>
        <p style={{
          color: "#C9A84C",
          fontSize: "0.48rem",
          letterSpacing: "0.35em",
          textTransform: "uppercase",
          fontWeight: 600,
          margin: "0 0 0.15rem",
        }}>
          Explore the property
        </p>
        <h2 style={{
          color: "#ffffff",
          fontSize: "clamp(0.95rem, 2.4vw, 1.8rem)",
          fontWeight: 800,
          margin: "0 0 0.15rem",
          lineHeight: 1.1,
        }}>
          5.6 million sq ft{" "}
          <span style={{ color: "#C9A84C" }}>across 4 floors</span>
        </h2>
      </div>

      {/* ── Main body ── */}
      <div style={{ flex: 1, minHeight: 0, padding: "0 clamp(0.5rem, 3vw, 3rem)", position: "relative" }}>
        <div style={{
          height: "100%",
          display: "grid",
          gridTemplateColumns: "100px 1fr clamp(160px, 18vw, 240px)",
          gap: 0,
        }}
          className="mm-skel-grid"
        >

          {/* Left sidebar skeleton */}
          <div style={{
            display: "flex", flexDirection: "column",
            justifyContent: "center", gap: "0.6rem", padding: "0 0.5rem 0 0",
          }}>
            <div style={{ height: "0.5rem", width: "60%", background: "rgba(201,168,76,0.08)", borderRadius: 2 }} />
            {["Floor 1", "Floor 2", "Floor 3", "Floor 4"].map(f => (
              <div key={f} style={{
                border: "1px solid rgba(201,168,76,0.12)",
                background: "transparent",
                padding: "6px 8px",
                display: "flex", alignItems: "center", gap: "0.4rem",
              }}>
                <div style={{ width: 4, height: 4, background: "rgba(201,168,76,0.22)" }} />
                <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.5rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" }}>{f}</span>
              </div>
            ))}
          </div>

          {/* Centre canvas skeleton — the LCP element */}
          <div style={{
            height: "100%", position: "relative",
            border: "1px solid rgba(201,168,76,0.08)",
            background: "#060504",
            display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "0.8rem",
          }}>
            {/* Isometric building SVG — zero JS cost, renders server-side */}
            <svg width="160" height="180" viewBox="0 0 160 180" fill="none" style={{ opacity: 0.5 }}>
              {[
                { yBase: 150, w: 110, dimColor: "#3A2E10", color: "#C9A84C" },
                { yBase: 114, w: 100, dimColor: "#2E2408", color: "#B8922E" },
                { yBase: 78,  w: 90,  dimColor: "#261E06", color: "#A67C32" },
                { yBase: 42,  w: 80,  dimColor: "#1A1404", color: "#8A6820" },
              ].map((f, i) => {
                const cx = 80; const h = 20;
                return (
                  <g key={i}>
                    <polygon
                      points={`${cx},${f.yBase - h} ${cx + f.w/2},${f.yBase - h/2} ${cx},${f.yBase} ${cx - f.w/2},${f.yBase - h/2}`}
                      fill={f.dimColor} stroke={f.color} strokeWidth="0.8" strokeOpacity="0.5"
                    />
                    <polygon
                      points={`${cx + f.w/2},${f.yBase - h/2} ${cx + f.w/2},${f.yBase + h/2} ${cx},${f.yBase + h} ${cx},${f.yBase}`}
                      fill="rgba(0,0,0,0.4)" stroke={f.color} strokeWidth="0.8" strokeOpacity="0.3"
                    />
                    <polygon
                      points={`${cx - f.w/2},${f.yBase - h/2} ${cx},${f.yBase} ${cx},${f.yBase + h} ${cx - f.w/2},${f.yBase + h/2}`}
                      fill="rgba(0,0,0,0.2)" stroke={f.color} strokeWidth="0.8" strokeOpacity="0.3"
                    />
                  </g>
                );
              })}
              <line x1="80" y1="2" x2="80" y2="42" stroke="#C9A84C" strokeWidth="1.5" opacity="0.6" />
              <circle cx="80" cy="2" r="3" fill="#C9A84C" opacity="0.8" />
            </svg>
            <p style={{
              color: "rgba(201,168,76,0.4)", fontSize: "0.44rem",
              letterSpacing: "0.28em", textTransform: "uppercase",
              fontWeight: 600, margin: 0,
            }}>Loading map…</p>
          </div>

          {/* Right info panel skeleton */}
          <div style={{
            borderLeft: "1px solid rgba(201,168,76,0.08)",
            paddingLeft: "0.75rem",
            display: "flex", flexDirection: "column",
            justifyContent: "center", gap: "0.6rem",
          }}>
            <div style={{ height: "0.45rem", width: "50%", background: "rgba(201,168,76,0.07)", borderRadius: 2 }} />
            <div style={{ height: "1rem",   width: "80%", background: "rgba(255,255,255,0.05)", borderRadius: 2 }} />
            <div style={{ height: "0.5rem", width: "45%", background: "rgba(201,168,76,0.05)", borderRadius: 2 }} />
          </div>

        </div>
      </div>

      {/* Bottom divider */}
      <div style={{
        flexShrink: 0, height: "1px",
        background: "linear-gradient(to right, transparent, rgba(201,168,76,0.12), transparent)",
      }} />

      {/* Mobile: hide sidebar/right col */}
      <style>{`
        @media (max-width: 767px) {
          .mm-skel-grid {
            grid-template-columns: 1fr !important;
          }
          .mm-skel-grid > div:first-child,
          .mm-skel-grid > div:last-child {
            display: none !important;
          }
          .mm-skel-grid > div:nth-child(2) {
            grid-column: 1 !important;
          }
        }
      `}</style>
    </div>
  );
}
