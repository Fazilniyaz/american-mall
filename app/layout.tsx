import type { Metadata } from "next";
import { Playfair_Display, Montserrat } from "next/font/google";

// ────────────────────────────────────────────────────────────────────────────
// NO CSS IMPORT — the old `import "./globals.css"` created a render-blocking
// CSS chunk (chunks/05rivr4ku8wlb.css, 1.8 KiB, 300ms blocking time).
// All reset styles are now inlined via <style> in <head> below.
// ────────────────────────────────────────────────────────────────────────────

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["700", "800"],
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

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
    <html
      lang="en"
      className={`${playfairDisplay.variable} ${montserrat.variable}`}
      style={{ height: "100%", WebkitTextSizeAdjust: "100%" }}
    >
      <head>
        {/*
          Inline critical reset CSS — this is NOT render-blocking because it's
          inside the HTML document itself (no external CSS fetch required).
          Previously this was in globals.css → compiled to a separate CSS chunk
          that blocked FCP/LCP by 300ms.
        */}
        <style dangerouslySetInnerHTML={{
          __html: `
          *{margin:0;padding:0;box-sizing:border-box}
          html,body{width:100%;height:100%;background:#000;overflow-x:hidden}
        `}} />

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
          REMOVED: preconnect to fonts.googleapis.com & fonts.gstatic.com
          next/font/google downloads fonts at BUILD TIME and self-hosts them.
          At runtime, these origins are NEVER fetched → Lighthouse flags them
          as "Unused preconnect" and they waste DNS+TCP connection time.
        */}
      </head>
      <body style={{ minHeight: "100%", display: "flex", flexDirection: "column" }}>
        {children}
      </body>
    </html>
  );
}
