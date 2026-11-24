import type { Metadata } from "next";
import { ArticleCard } from "@/components/site/cards";
import { Cta } from "@/components/site/cta";
import { getArticles } from "@/lib/content";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Artikel tentang hunian, kawasan, dan investasi properti di Makassar.",
  alternates: { canonical: "/blog" },
};

export default async function BlogPage() {
  const articles = await getArticles();
  return (
    <>
      <section className="page-banner blog-banner">
        <div className="site-container">
          <h1>Blog</h1>
        </div>
      </section>
      <section className="section blog-section">
        <div className="blog-filters" aria-label="Filter artikel">
          <span className="is-active">All</span>
          <span>Blog</span>
        </div>
        <div className="site-container article-grid">
          {articles.map((article) => (
            <ArticleCard
              key={article.slug}
              title={article.title}
              image={article.image}
              href={`/${article.slug}`}
              excerpt={article.description}
            />
          ))}
        </div>
      </section>
      <Cta />
    </>
  );
}
