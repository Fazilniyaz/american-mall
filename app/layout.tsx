import type { Metadata } from "next";

// ────────────────────────────────────────────────────────────────────────────
// Font strategy: system fonts render instantly, Google Fonts load in
// background with display=optional (zero render-blocking, zero CLS).
// ────────────────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "Mall of America | America's Most Iconic Retail Destination",
  description: "Explore Mall of America — 520+ stores, 40M+ annual visitors, and world-class entertainment in Bloomington, Minnesota.",
};

// Google Fonts URL — trimmed to only used weights, display=optional
// ensures browser NEVER blocks rendering waiting for the font.
const FONT_URL =
  "https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700;800&display=optional";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" style={{ height: "100%" }}>
      <head>
        {/*
          Inline critical CSS — part of the HTML document (no external
          fetch needed). System font stack renders text instantly.
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

        {/* Preload LCP image — responsive: mobile gets 30KB, desktop 82KB */}
        <link rel="preload" href="/photos/splash-mobile.webp" as="image" type="image/webp" media="(max-width: 767px)" fetchPriority="high" />
        <link rel="preload" href="/photos/splash-desktop.webp" as="image" type="image/webp" media="(min-width: 768px)" fetchPriority="high" />

        {/* DNS + TCP + TLS handshake ahead of time for font CDN */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/*
          Non-blocking font — tiny sync inline script appends a <link>
          with media=print then swaps to media=all on load.
          Sync (not defer) so it runs before first paint but does NOT
          block rendering (appending a link is async network I/O).
        */}
        <script dangerouslySetInnerHTML={{
          __html:
            `(function(){var l=document.createElement('link');` +
            `l.rel='stylesheet';l.media='print';` +
            `l.href='${FONT_URL}';` +
            `l.onload=function(){l.media='all'};` +
            `document.head.appendChild(l);})()`
        }} />
        <noscript>
          <link rel="stylesheet" href={FONT_URL} />
        </noscript>
      </head>
      <body style={{ minHeight: "100%", display: "flex", flexDirection: "column" }}>
        {children}
      </body>
    </html>
  );
}

