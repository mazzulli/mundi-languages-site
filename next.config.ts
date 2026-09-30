import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep the exact WordPress URL shape (`/cursos-de-ingles/`) to preserve rankings.
  trailingSlash: true,
  output: "standalone",
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [60, 75, 90],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
};

export default nextConfig;
