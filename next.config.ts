import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: false,
  serverExternalPackages: ["pdf-parse"],
  // eslint: { ignoreDuringBuilds: true, },
};

export default nextConfig;
