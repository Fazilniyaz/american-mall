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
        <style dangerouslySetInnerHTML={{
          __html: [
            "*{margin:0;padding:0;box-sizing:border-box}",
            "html,body{width:100%;height:100%;background:#000;overflow-x:hidden}",
            ":root{",
            "--font-playfair:'Playfair Display',Georgia,serif;",
            "--font-montserrat:'Montserrat',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",
            "}",
          ].join("")
        }} />

        {/* Preconnect to Google Fonts CDN — NOW actually used */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Preload critical LCP image for mobile */}
        <link
          rel="preload"
          as="image"
          href="/photos/hero-poster.jpg"
          type="image/jpeg"
          {...({ fetchpriority: "high" } as Record<string, string>)}
          media="(max-width: 768px)"
        />

        {/*
          Async font loader — dynamically creates a <link rel="stylesheet">
          for Google Fonts. Dynamically-created stylesheets are NOT render-
          blocking. Text renders instantly with system font fallbacks,
          then font-display:swap swaps in Montserrat when loaded.

          This tiny inline script (~150 bytes) executes in <0.1ms —
          it does NOT cause TBT (no heavy computation, just DOM API call).
        */}
        <script dangerouslySetInnerHTML={{
          __html:
            "var l=document.createElement('link');" +
            "l.rel='stylesheet';" +
            "l.href='https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap';" +
            "document.head.appendChild(l);"
        }} />
      </head>
      <body style={{ minHeight: "100%", display: "flex", flexDirection: "column" }}>
        {children}
      </body>
    </html>
  );
}
