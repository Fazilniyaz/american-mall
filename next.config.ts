import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Tree-shake heavy packages — only bundle the parts actually imported
  experimental: {
    optimizePackageImports: ["gsap", "d3-selection", "d3-shape", "three"],
  },

  // Remove console.log in production builds
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
};

export default nextConfig;