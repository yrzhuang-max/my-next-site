import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: false,
  serverExternalPackages: ["pdf-parse"],

  devIndicators: {
    appIsrStatus: false,
  },
  experimental: {},
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.paddle.com",
      },
    ],
  },
};

export default nextConfig;

