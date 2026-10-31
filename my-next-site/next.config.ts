import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: false, // 关闭尾斜杠，避免 /legal/xxx 和 /legal/xxx/ 重复收录
  serverExternalPackages: ["pdf-parse"],
    // 生产构建强制不用 turbopack，规避postcss/tailwind v4构建bug
  experimental: {
    turbopack: {
      build: false
    }
};

export default nextConfig;