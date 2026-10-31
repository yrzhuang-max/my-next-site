import type { NextConfig } from "next";
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

const nextConfig: NextConfig = {
  trailingSlash: false,
  serverExternalPackages: ["pdf-parse"],
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
