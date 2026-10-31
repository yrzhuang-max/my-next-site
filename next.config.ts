import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: false,
  serverExternalPackages: ["pdf-parse"],
  turbopack: false,
};

export default nextConfig;
