/**
 * /events/entertainmentAndGaming/xboxGamingEvents — Server-rendered loading skeleton
 */
export default function XboxGamingLoading() {
  return (
    <main style={{
      width: "100%", height: "100vh", background: "#050402",
      overflow: "hidden", display: "flex", flexDirection: "column",
      position: "relative", fontFamily: "'Montserrat', sans-serif",
    }}>
      {/* Header skeleton */}
      <header style={{
        flexShrink: 0, padding: "clamp(0.65rem,1.5vh,1.1rem) clamp(1.4rem,4vw,3.5rem)",
        borderBottom: "1px solid rgba(201,168,76,0.08)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.22rem" }}>
          <div style={{ height: "0.47rem", width: "160px", background: "rgba(201,168,76,0.12)", borderRadius: 2 }} />
          <div style={{ display: "flex", gap: "0.4rem" }}>
            <div style={{ height: "clamp(1.05rem,2.5vw,2rem)", width: "80px", background: "rgba(255,255,255,0.08)", borderRadius: 2 }} />
            <div style={{ height: "clamp(1.05rem,2.5vw,2rem)", width: "200px", background: "rgba(82,176,67,0.12)", borderRadius: 2 }} />
            <div style={{ height: "clamp(1.05rem,2.5vw,2rem)", width: "160px", background: "rgba(201,168,76,0.12)", borderRadius: 2 }} />
          </div>
        </div>
        <div style={{ display: "flex", gap: "0.36rem", alignItems: "center" }}>
          <div style={{ height: "1.4rem", width: "110px", background: "rgba(82,176,67,0.07)", border: "1px solid rgba(82,176,67,0.28)", borderRadius: 2 }} />
        </div>
      </header>

      {/* Body */}
      <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "row" }}>
        
        {/* Left info panel */}
        <div style={{
          flexShrink: 0, width: "clamp(255px,33vw,435px)",
          padding: "clamp(0.8rem,1.9vh,1.55rem) clamp(1.4rem,3.5vw,3rem)",
          borderRight: "1px solid rgba(201,168,76,0.08)",
          display: "flex", flexDirection: "column", justifyContent: "space-between",
        }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            <div style={{ height: "0.64rem", width: "90%", background: "rgba(201,168,76,0.08)", borderRadius: 2 }} />
            {[100, 85, 70].map((w, i) => (
              <div key={i} style={{ height: "0.62rem", width: `${w}%`, background: "rgba(255,255,255,0.04)", borderRadius: 2 }} />
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem" }}>
            {["6,200+", "14", "Series X", "09"].map(v => (
              <div key={v} style={{ padding: "0.6rem", border: "1px solid rgba(82,176,67,0.12)", background: "rgba(82,176,67,0.025)" }}>
                <div style={{ color: "rgba(82,176,67,0.4)", fontSize: "clamp(0.85rem,1.75vw,1.35rem)", fontWeight: 800 }}>{v}</div>
                <div style={{ height: "0.46rem", width: "60%", background: "rgba(255,255,255,0.04)", borderRadius: 2, marginTop: "0.3rem" }} />
              </div>
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.48rem" }}>
            <div style={{ height: "clamp(2.9rem,6.8vh,4.8rem)", width: "100%", background: "rgba(82,176,67,0.025)", border: "1px solid rgba(82,176,67,0.12)" }} />
          </div>
        </div>

        {/* Right image placeholder */}
        <div style={{ flex: 1, background: "linear-gradient(135deg, #060504 0%, #081008 50%, #060504 100%)" }} />
      </div>

      {/* Footer tags */}
      <footer style={{ flexShrink: 0, height: "1.4rem", borderTop: "1px solid rgba(201,168,76,0.07)", background: "transparent" }} />

      <style>{`
        @media (max-width: 680px) {
          main > div:nth-child(2) { flex-direction: column !important; }
          main > div:nth-child(2) > div:first-child { width: 100% !important; border-right: none !important; border-bottom: 1px solid rgba(201,168,76,0.08) !important; }
          main > div:nth-child(2) > div:first-child > div:nth-child(2) { grid-template-columns: repeat(4, 1fr) !important; }
          main > div:nth-child(2) > div:last-child { flex: 1 1 0 !important; width: 100% !important; }
        }
      `}</style>
    </main>
  );
}
