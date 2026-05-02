import type { Metadata } from "next";

// ────────────────────────────────────────────────────────────────────────────
// NO next/font/google — it generates a render-blocking CSS chunk for
// @font-face declarations (~1.6 KiB, 300ms blocking time on mobile).
//
// Instead, we:
// 1. Define CSS custom properties with system font fallbacks (inline, instant)
// 2. Load Google Fonts CSS asynchronously via a tiny inline <script>
// 3. fonts.googleapis.com serves @font-face with font-display:swap,
//    so text is visible immediately with system fonts, then swaps
// ────────────────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "Mall of America | America's Most Iconic Retail Destination",
  description: "Explore Mall of America — 520+ stores, 40M+ annual visitors, and world-class entertainment in Bloomington, Minnesota.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" style={{ height: "100%" }}>
      <head>
        {/*
          Inline critical CSS — this is NOT render-blocking because it's
          part of the HTML document itself (no external fetch needed).
        */}
        <style suppressHydrationWarning dangerouslySetInnerHTML={{
          __html: [
            "*{margin:0;padding:0;box-sizing:border-box}",
            "html,body{width:100%;height:100%;background:#000;overflow-x:hidden}",
            ":root{",
            "--font-playfair:'Playfair Display',Georgia,serif;",
            "--font-montserrat:'Montserrat',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",
            "}",
          ].join("")
        }} />

        {/* Preload LCP image — ensures fastest possible paint */}
        <link rel="preload" href="/photos/splash-7.webp" as="image" type="image/webp" fetchPriority="high" />

        {/* Preconnect to Google Fonts CDN — NOW actually used */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/*
          Non-blocking font loader — uses a deferred inline script.
          The `defer` attribute makes this non-parser-blocking (unlike the
          original which had no defer and blocked HTML parsing).
          The script creates a <link> with media="print" + onload swap,
          the standard Google-recommended non-blocking font pattern.
        */}
        <script
          defer
          dangerouslySetInnerHTML={{
            __html:
              "var l=document.createElement('link');" +
              "l.rel='stylesheet';" +
              "l.href='https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap';" +
              "l.media='print';" +
              "l.onload=function(){this.media='all'};" +
              "document.head.appendChild(l)"
          }}
        />
        <noscript>
          <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap" />
        </noscript>
      </head>
      <body style={{ minHeight: "100%", display: "flex", flexDirection: "column" }}>
        {children}
      </body>
    </html>
  );
}
