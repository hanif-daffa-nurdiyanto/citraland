import districtsData from "@/data/districts.json";
import articlesData from "@/data/articles.json";
import { getEntry, getPage, listCollection } from "@/lib/cms/repository";

export type District = (typeof districtsData)[number];
export type Article = (typeof articlesData)[number];

export const districts: District[] = districtsData;
export const articles: Article[] = articlesData;

export const getDistricts = () => listCollection("districts");
export const getArticles = () => listCollection("articles");
export const getHomeContent = () => getPage("home");
export const getContactContent = () => getPage("contact");

export async function getDistrict(slug: string) {
  return getEntry("districts", slug) as Promise<District | undefined>;
}

export async function getArticle(slug: string) {
  return getEntry("articles", slug) as Promise<Article | undefined>;
}

export function headingId(value: string) {
  return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
