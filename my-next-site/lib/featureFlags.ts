// 功能开关：控制高级版真实功能是否启用
export const FEATURE_FLAGS = {
  // 本地 .env.local 设置 NEXT_PUBLIC_PREMIUM_CONVERT=true 开启；线上Vercel不配置则默认关闭
  premiumPdfConvert: process.env.NEXT_PUBLIC_PREMIUM_CONVERT === "true",
};
