import type { MetadataRoute } from "next";
import { getArticles, getDistricts } from "@/lib/content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articles, districts] = await Promise.all([getArticles(), getDistricts()]);
  const origin = "https://citralandmakassarproperty.com";
  return ["", "/blog", ...districts.map((item) => `/${item.slug}`), ...articles.map((item) => `/${item.slug}`)].map((path) => ({ url: `${origin}${path}`, changeFrequency: "monthly", priority: path === "" ? 1 : 0.7 }));
}
