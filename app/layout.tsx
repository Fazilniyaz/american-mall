import type { Metadata } from "next";
import { Playfair_Display, Montserrat } from "next/font/google";
import "./globals.css";

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
      className={`${playfairDisplay.variable} ${montserrat.variable} h-full antialiased`}
    >
      <head>
        {/* Preconnect to Google Fonts origin — eliminates connection setup latency */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Preload critical LCP image for mobile — fetchpriority ensures highest browser priority */}
        <link
          rel="preload"
          as="image"
          href="/photos/hero-poster.jpg"
          type="image/jpeg"
          // fetchPriority is valid HTML but React types lag behind — cast via spread
          {...({ fetchpriority: "high" } as Record<string, string>)}
          media="(max-width: 768px)"
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
