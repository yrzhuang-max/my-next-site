import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: false, // 关闭尾斜杠，避免 /legal/xxx 和 /legal/xxx/ 重复收录
  serverExternalPackages: ["pdf-parse"],
};

export default nextConfig;