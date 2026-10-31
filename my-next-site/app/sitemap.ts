import type { MetadataRoute } from 'next'
import { blogPosts } from '@/lib/post';

const baseUrl = 'https://www.filedocswift.com'
// 静态页面统一更新时间（法律页不用频繁变动）
const staticUpdateDate = new Date('2026-10-01')

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: staticUpdateDate,
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${baseUrl}/pdf-to-word`,
      lastModified: staticUpdateDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: staticUpdateDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: staticUpdateDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: staticUpdateDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    // 认证页面
    {
      url: `${baseUrl}/auth/register`,
      lastModified: staticUpdateDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/auth/login`,
      lastModified: staticUpdateDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    // 法律页面，低权重、年度更新
    {
      url: `${baseUrl}/legal/privacy-policy`,
      lastModified: staticUpdateDate,
      changeFrequency: 'yearly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/legal/terms-of-service`,
      lastModified: staticUpdateDate,
      changeFrequency: 'yearly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/legal/cookie-policy`,
      lastModified: staticUpdateDate,
      changeFrequency: 'yearly',
      priority: 0.4,
    },
  ]

  const blogPages: MetadataRoute.Sitemap = blogPosts.map(post => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.isoDate),
    changeFrequency: 'monthly',
    priority: 0.7
  }))

  return [...staticPages, ...blogPages]
}