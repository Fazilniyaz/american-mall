/**
 * /Entertainment/Aquarium — Server-rendered loading skeleton
 * Streamed instantly before any JS, eliminates blank-screen FCP on mobile.
 */
export default function AquariumLoading() {
  return (
    <div style={{
      width: "100%", height: "100vh",
      background: "#000d0f", overflow: "hidden",
      display: "flex", alignItems: "center",
      position: "relative",
      fontFamily: "'Montserrat', sans-serif",
    }}>
      {/* Deep ocean gradient — matches real component background */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(255deg, rgba(0,13,15,0.98) 0%, rgba(0,18,22,0.9) 40%, rgba(0,26,31,0.6) 70%, rgba(0,13,15,0.3) 100%)",
        zIndex: 2,
      }} />
      <div style={{
        position: "absolute", inset: 0, zIndex: 1,
        background: "linear-gradient(135deg, #000d0f 0%, #001420 50%, #000d0f 100%)",
      }} />

      {/* Content skeleton — right-side text layout */}
      <div style={{
        position: "relative", zIndex: 4, width: "100%",
        padding: "6rem clamp(1.5rem, 6vw, 6rem)",
        display: "flex", flexDirection: "column", gap: "1.2rem",
        maxWidth: "520px", marginLeft: "auto",
      }}>
        {/* Eyebrow */}
        <div style={{ height: "0.68rem", width: "58%", background: "rgba(0,200,240,0.12)", borderRadius: 2 }} />

        {/* Headline */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}>
          <div style={{ height: "clamp(2.2rem, 5vw, 4.8rem)", width: "72%", background: "rgba(255,255,255,0.06)", borderRadius: 2 }} />
          <div style={{ height: "clamp(1.1rem, 2.5vw, 1.9rem)", width: "88%", background: "rgba(255,255,255,0.03)", borderRadius: 2 }} />
        </div>

        {/* Teal divider */}
        <div style={{ width: "48px", height: "2px", background: "linear-gradient(to right, rgba(0,200,240,0.35), rgba(0,200,240,0.05))" }} />

        {/* Body text */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}>
          {[95, 100, 70].map((w, i) => (
            <div key={i} style={{ height: "0.82rem", width: `${w}%`, background: "rgba(255,255,255,0.04)", borderRadius: 2 }} />
          ))}
        </div>

        {/* Stat cards */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem", marginTop: "0.4rem" }}>
          {["10K+", "1.2M", "300+", "Top 5"].map(v => (
            <div key={v} style={{
              background: "rgba(0,180,220,0.04)",
              border: "1px solid rgba(0,180,220,0.1)",
              padding: "0.75rem 1rem",
            }}>
              <div style={{ color: "rgba(0,200,240,0.4)", fontSize: "clamp(1.1rem, 2vw, 1.5rem)", fontWeight: 800, lineHeight: 1 }}>{v}</div>
              <div style={{ height: "0.5rem", width: "55%", background: "rgba(255,255,255,0.04)", borderRadius: 2, marginTop: "0.35rem" }} />
            </div>
          ))}
        </div>
      </div>

      {/* Watermark */}
      <div style={{
        position: "absolute", left: "clamp(1.5rem, 5vw, 4rem)", bottom: "3rem",
        color: "rgba(0,180,220,0.04)", fontSize: "clamp(5rem, 12vw, 10rem)",
        fontWeight: 800, lineHeight: 1, userSelect: "none",
      }}>02</div>
    </div>
  );
}
