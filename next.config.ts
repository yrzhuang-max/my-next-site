import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: false,
  serverExternalPackages: ["pdf-parse"],
  //turbopack: false, 错误编码
};

export default nextConfig;
