/**
 * /events/tech/vrAndGamingZones — Server-rendered loading skeleton
 * Streams instantly before any JS — eliminates black-screen FCP on mobile.
 */
export default function VRGamingLoading() {
  return (
    <main style={{
      width: "100%", height: "100vh", background: "#050402",
      overflow: "hidden", display: "flex", flexDirection: "column",
      position: "relative", fontFamily: "'Montserrat', sans-serif",
    }}>
      {/* Atmosphere */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse 55% 60% at 82% 55%, rgba(34,211,238,0.04) 0%, transparent 60%)",
      }} />

      {/* Header skeleton */}
      <header style={{
        flexShrink: 0, padding: "clamp(0.75rem,1.7vh,1.3rem) clamp(1.4rem,4vw,3.5rem)",
        borderBottom: "1px solid rgba(201,168,76,0.08)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
          <div style={{ height: "0.47rem", width: "140px", background: "rgba(201,168,76,0.12)", borderRadius: 2 }} />
          <div style={{ display: "flex", gap: "0.4rem" }}>
            <div style={{ height: "clamp(1rem,2.4vw,1.9rem)", width: "80px", background: "rgba(255,255,255,0.08)", borderRadius: 2 }} />
            <div style={{ height: "clamp(1rem,2.4vw,1.9rem)", width: "130px", background: "rgba(201,168,76,0.12)", borderRadius: 2 }} />
          </div>
        </div>
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <div style={{ height: "1.4rem", width: "80px", background: "rgba(34,211,238,0.07)", border: "1px solid rgba(34,211,238,0.15)", borderRadius: 2 }} />
          <div style={{ height: "1.4rem", width: "100px", background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.12)", borderRadius: 2 }} />
        </div>
      </header>

      {/* Body */}
      <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "row" }}>
        {/* Left panel */}
        <div style={{
          flexShrink: 0, width: "clamp(260px,35vw,450px)",
          padding: "clamp(0.8rem,2vh,1.6rem) clamp(1.4rem,3.5vw,3rem)",
          borderRight: "1px solid rgba(201,168,76,0.08)",
          display: "flex", flexDirection: "column", justifyContent: "space-between",
        }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            <div style={{ height: "0.65rem", width: "90%", background: "rgba(201,168,76,0.08)", borderRadius: 2 }} />
            {[100, 85, 70].map((w, i) => (
              <div key={i} style={{ height: "0.6rem", width: `${w}%`, background: "rgba(255,255,255,0.04)", borderRadius: 2 }} />
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem" }}>
            {["15K+", "8", "500+", "3"].map(v => (
              <div key={v} style={{ padding: "0.6rem", border: "1px solid rgba(201,168,76,0.08)", background: "rgba(201,168,76,0.02)" }}>
                <div style={{ color: "rgba(201,168,76,0.4)", fontSize: "clamp(0.9rem,1.8vw,1.4rem)", fontWeight: 800 }}>{v}</div>
                <div style={{ height: "0.4rem", width: "60%", background: "rgba(255,255,255,0.04)", borderRadius: 2, marginTop: "0.3rem" }} />
              </div>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.4rem" }}>
            {[0, 1, 2, 3].map(i => (
              <div key={i} style={{ padding: "0.5rem", border: "1px solid rgba(201,168,76,0.07)", height: "2.5rem" }} />
            ))}
          </div>
        </div>

        {/* Right — dark image placeholder */}
        <div style={{ flex: 1, background: "linear-gradient(135deg, #060504 0%, #0a0d10 50%, #060504 100%)" }} />
      </div>

      {/* Footer ticker bar */}
      <footer style={{ flexShrink: 0, height: "1.4rem", borderTop: "1px solid rgba(201,168,76,0.07)", background: "transparent" }} />
    </main>
  );
}
