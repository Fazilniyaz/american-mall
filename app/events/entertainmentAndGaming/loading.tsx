/**
 * /events/entertainmentAndGaming — Server-rendered loading skeleton
 * Streams instantly before any JS — eliminates black-screen FCP on mobile.
 */
export default function EntertainmentGamingLoading() {
  return (
    <main style={{
      width: "100%", height: "100vh", background: "#050402",
      overflow: "hidden", display: "flex", flexDirection: "column",
      position: "relative", fontFamily: "'Montserrat', sans-serif",
    }}>
      {/* Header skeleton */}
      <header style={{
        flexShrink: 0, padding: "clamp(0.75rem,1.7vh,1.3rem) clamp(1.4rem,4vw,3.5rem)",
        borderBottom: "1px solid rgba(201,168,76,0.08)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
          <div style={{ height: "0.47rem", width: "180px", background: "rgba(201,168,76,0.12)", borderRadius: 2 }} />
          <div style={{ display: "flex", gap: "0.4rem" }}>
            <div style={{ height: "clamp(1.1rem,2.6vw,2.1rem)", width: "220px", background: "rgba(255,255,255,0.08)", borderRadius: 2 }} />
            <div style={{ height: "clamp(1.1rem,2.6vw,2.1rem)", width: "120px", background: "rgba(201,168,76,0.12)", borderRadius: 2 }} />
          </div>
        </div>
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <div style={{ height: "1.4rem", width: "100px", background: "rgba(249,115,22,0.08)", border: "1px solid rgba(249,115,22,0.25)", borderRadius: 2 }} />
          <div style={{ height: "1.4rem", width: "100px", background: "rgba(201,168,76,0.07)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: 2 }} />
        </div>
      </header>

      {/* Body */}
      <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "row" }}>
        
        {/* Left image placeholder */}
        <div style={{ flex: 1, background: "linear-gradient(90deg, #060504 0%, #0a0806 50%, #060504 100%)" }} />

        {/* Right info panel */}
        <div style={{
          flexShrink: 0, width: "clamp(260px,36vw,460px)",
          padding: "clamp(0.9rem,2.2vh,1.8rem) clamp(1.4rem,3.5vw,3rem)",
          borderLeft: "1px solid rgba(201,168,76,0.08)",
          display: "flex", flexDirection: "column", justifyContent: "space-between",
        }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            <div style={{ height: "0.48rem", width: "40%", background: "rgba(249,115,22,0.15)", borderRadius: 2 }} />
            <div style={{ height: "0.68rem", width: "90%", background: "rgba(201,168,76,0.08)", borderRadius: 2 }} />
            {[100, 85, 70].map((w, i) => (
              <div key={i} style={{ height: "0.64rem", width: `${w}%`, background: "rgba(255,255,255,0.04)", borderRadius: 2 }} />
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem" }}>
            {["80+", "24", "3K+", "∞"].map(v => (
              <div key={v} style={{ padding: "0.6rem", border: "1px solid rgba(201,168,76,0.09)", background: "rgba(201,168,76,0.02)" }}>
                <div style={{ color: "rgba(201,168,76,0.4)", fontSize: "clamp(0.95rem,1.9vw,1.45rem)", fontWeight: 800 }}>{v}</div>
                <div style={{ height: "0.44rem", width: "60%", background: "rgba(255,255,255,0.04)", borderRadius: 2, marginTop: "0.3rem" }} />
              </div>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.4rem" }}>
            {[0, 1, 2, 3].map(i => (
              <div key={i} style={{ padding: "0.5rem", border: "1px solid rgba(201,168,76,0.09)", height: "2.8rem" }} />
            ))}
          </div>
        </div>
      </div>

      {/* Footer ticker bar */}
      <footer style={{ flexShrink: 0, height: "1.35rem", borderTop: "1px solid rgba(201,168,76,0.07)", background: "transparent" }} />

      <style>{`
        @media (max-width: 680px) {
          main > div:nth-child(2) { flex-direction: column !important; }
          main > div:nth-child(2) > div:first-child { flex: 0 0 42vh !important; }
          main > div:nth-child(2) > div:last-child {
            width: 100% !important; border-left: none !important;
            border-top: 1px solid rgba(201,168,76,0.08) !important;
          }
          main > div:nth-child(2) > div:last-child > div:nth-child(2) {
            grid-template-columns: repeat(4, 1fr) !important;
          }
        }
      `}</style>
    </main>
  );
}
