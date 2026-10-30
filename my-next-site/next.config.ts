import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: false, // 关闭尾斜杠，避免 /legal/xxx 和 /legal/xxx/ 重复收录
  serverExternalPackages: ["pdf-parse"],
  api: {
    bodyParser: {
      sizeLimit: "10mb", // 匹配PDF转换接口10MB上限
    },
  },
};

export default nextConfig;
