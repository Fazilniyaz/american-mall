/**
 * /Entertainment/themePark — Server-rendered loading skeleton
 * Streams to the browser instantly before any JS downloads.
 * Eliminates the 2.5s+ black-screen FCP on mobile.
 */
export default function ThemeParkLoading() {
  return (
    <div style={{
      width: "100%",
      height: "100vh",
      background: "#050402",
      overflow: "hidden",
      display: "flex",
      alignItems: "center",
      position: "relative",
      fontFamily: "'Montserrat', sans-serif",
    }}>

      {/* Ambient gradient — matches real component */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "linear-gradient(105deg, rgba(5,4,2,0.92) 0%, rgba(5,4,2,0.65) 42%, rgba(5,4,2,0.15) 70%)",
        zIndex: 2,
      }} />

      {/* Background shimmer block — acts as image placeholder */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 1,
        background: "linear-gradient(135deg, #0c0a05 0%, #1a1508 50%, #0c0a05 100%)",
      }} />

      {/* Content */}
      <div style={{
        position: "relative", zIndex: 4, width: "100%",
        padding: "6rem clamp(1.5rem, 6vw, 6rem)",
        display: "flex", flexDirection: "column", gap: "1.4rem",
        maxWidth: "520px",
      }}>
        {/* Eyebrow */}
        <div style={{
          height: "0.68rem", width: "55%",
          background: "rgba(201,168,76,0.15)", borderRadius: 2,
        }} />

        {/* Headline */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <div style={{ height: "clamp(2.2rem, 5vw, 4.5rem)", width: "70%", background: "rgba(255,255,255,0.07)", borderRadius: 2 }} />
          <div style={{ height: "clamp(1.1rem, 2.5vw, 2rem)", width: "45%", background: "rgba(255,255,255,0.04)", borderRadius: 2 }} />
        </div>

        {/* Divider */}
        <div style={{ width: "48px", height: "2px", background: "linear-gradient(to right, rgba(201,168,76,0.4), rgba(201,168,76,0.05))" }} />

        {/* Body text lines */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {[90, 100, 75].map((w, i) => (
            <div key={i} style={{ height: "0.85rem", width: `${w}%`, background: "rgba(255,255,255,0.04)", borderRadius: 2 }} />
          ))}
        </div>

        {/* Stat cards */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem", marginTop: "0.4rem" }}>
          {["7", "30+", "12M+", "#1"].map(v => (
            <div key={v} style={{
              background: "rgba(201,168,76,0.04)",
              border: "1px solid rgba(201,168,76,0.1)",
              padding: "0.75rem 1rem",
            }}>
              <div style={{ color: "rgba(201,168,76,0.5)", fontSize: "clamp(1.1rem, 2vw, 1.5rem)", fontWeight: 800, lineHeight: 1 }}>{v}</div>
              <div style={{ height: "0.5rem", width: "60%", background: "rgba(255,255,255,0.05)", borderRadius: 2, marginTop: "0.35rem" }} />
            </div>
          ))}
        </div>
      </div>

      {/* Watermark */}
      <div style={{
        position: "absolute", right: "clamp(1.5rem, 5vw, 4rem)", bottom: "3rem",
        color: "rgba(201,168,76,0.04)", fontSize: "clamp(5rem, 12vw, 10rem)",
        fontWeight: 800, lineHeight: 1, userSelect: "none",
      }}>01</div>
    </div>
  );
}
