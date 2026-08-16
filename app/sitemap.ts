// app/sitemap.ts — the pages this app wants indexed
//
// 2026-08-16: this app had no sitemap, so discovery depended on a crawler
// finding an internal link. Generated rather than static, so it cannot drift
// out of date as pages are added.
import type { MetadataRoute } from 'next'

const BASE = 'https://legal.craudiovizai.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  return [
    { url: `${BASE}`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE}/admin`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE}/admin/analytics`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE}/admin/archive`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE}/admin/organizations`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE}/admin/search`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE}/admin/teams`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE}/admin/workflows`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE}/dashboard`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE}/embedded`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE}/find-help`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE}/login`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE}/signup`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
  ]
}
