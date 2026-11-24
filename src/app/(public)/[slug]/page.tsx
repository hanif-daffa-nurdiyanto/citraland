import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { ArticleBody } from "@/components/site/article-body";
import { Cta } from "@/components/site/cta";
import { DistrictList } from "@/components/site/district-list";
import { Faq } from "@/components/site/faq";
import { HeroSlideshow } from "@/components/site/hero-slideshow";
import { SectionHeading } from "@/components/site/section-heading";
import {
  articles,
  districts,
  getArticle,
  getContactContent,
  getDistrict,
  headingId,
} from "@/lib/content";
import { whatsappUrl } from "@/lib/site";
import type { ContactContent } from "@/lib/cms/schema";

export function generateStaticParams() {
  return [...districts, ...articles].map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const [district, article] = await Promise.all([getDistrict(slug), getArticle(slug)]);
  if (!district && !article) return {};
  return {
    title: district?.title ?? article?.title,
    description: district?.tagline ?? article?.description,
    alternates: { canonical: `/${slug}` },
    openGraph: {
      title: district?.title ?? article?.title,
      description: district?.tagline ?? article?.description,
      images: [district?.heroImage ?? article!.image],
    },
  };
}

export default async function DetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [district, article, contact] = await Promise.all([
    getDistrict(slug),
    getArticle(slug),
    getContactContent(),
  ]);
  if (district) return <DistrictPage district={district} contact={contact} />;
  if (article) return <ArticlePage article={article} />;
  notFound();
}

function DistrictPage({ district, contact }: { district: (typeof districts)[number]; contact: ContactContent }) {
  return (
    <>
      <section className="district-hero">
        <HeroSlideshow images={district.heroImages} alt={district.title} />
        <div className="district-hero-shade" />
        <div className="site-container district-hero-inner">
          <span className="eyebrow">{district.tagline}</span>
          <h1>{district.title}</h1>
          <p>{district.heroDescription}</p>
        </div>
      </section>
      <section className="section district-intro">
        <div className="site-container intro-grid">
          <div className="intro-copy">
            <SectionHeading eyebrow="Tentang lokasi" title={district.title} />
            <p>{district.intro}</p>
            <ul>
              {district.introHighlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <a
              className="button button-green"
              href={whatsappUrl(contact.whatsappMessage, contact.whatsapp)}
              target="_blank"
              rel="noopener noreferrer"
            >
              Konsultasi Sekarang <ArrowUpRight size={18} />
            </a>
          </div>
          <div className="intro-image">
            <Image
              src={district.cardImage}
              alt={district.title}
              fill
              sizes="(max-width: 800px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>
      <section className="section products-section">
        <div className="site-container">
          <SectionHeading
            eyebrow="Pilihan properti"
            title={`Jelajahi ${district.title}`}
          />
          <div className="products-grid">
            {district.products.map((product) => (
              <article
                id={headingId(product.title)}
                className="product-card"
                key={product.title}
              >
                <div className="product-image">
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    sizes="(max-width: 800px) 100vw, 50vw"
                  />
                </div>
                <div className="product-copy">
                  <h3>{product.title}</h3>
                  <a
                    href={whatsappUrl(
                      `Halo saya tertarik dengan ${product.title} di ${district.title}`,
                      contact.whatsapp,
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Tanya produk <ArrowUpRight size={17} />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section district-gallery">
        <div className="site-container">
          <SectionHeading eyebrow="Galeri" title="Lihat lebih dekat" />
          <div className="gallery-grid">
            {district.products.flatMap((product) =>
              product.gallery.slice(0, 2).map((image, index) => (
                <div
                  className="gallery-image"
                  key={`${product.title}-${index}`}
                >
                  <Image
                    src={image}
                    alt={`${product.title} ${index + 1}`}
                    fill
                    sizes="(max-width: 800px) 100vw, 33vw"
                  />
                </div>
              )),
            )}
          </div>
        </div>
      </section>
      <section className="section features-section">
        <div className="site-container">
          <SectionHeading
            eyebrow="Keunggulan kawasan"
            title={`Mengapa memilih ${district.title}?`}
          />
          <div className="feature-grid">
            {district.features.map((feature, index) => (
              <article key={feature.title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{feature.title}</h3>
                {feature.body.map((text, i) => (
                  <p key={i}>{text}</p>
                ))}
              </article>
            ))}
          </div>
        </div>
      </section>
      <DistrictList current={district.slug} />
      <Faq items={district.faq} />
      <Cta />
    </>
  );
}

function ArticlePage({ article }: { article: (typeof articles)[number] }) {
  const headings = article.body.filter((block) => block.type === "h2");
  const [opening, ...remaining] = article.body;
  return (
    <>
      <section className="page-banner article-banner">
        <div className="site-container">
          <h1>{article.title}</h1>
        </div>
      </section>
      <section className="section article-section">
        <div className="site-container article-layout">
          <article>
            <div className="article-cover">
              <Image
                src={article.image}
                alt={article.title}
                fill
                priority
                sizes="267px"
              />
            </div>
            <div className="article-rating" aria-label="Belum ada penilaian">
              <span>☆ ☆ ☆ ☆ ☆</span>
              <span>Rate this post</span>
            </div>
            <ArticleBody blocks={[opening]} />
            {headings.length > 0 && (
              <div className="article-inline-toc">
                <h2>Table of Contents</h2>
                <ol>
                  {headings.map((block) => (
                    <li key={block.text}>
                      <a href={`#${headingId(block.text)}`}>{block.text}</a>
                    </li>
                  ))}
                  {article.faq.length > 0 && (
                    <li>
                      FAQ (Pertanyaan yang Sering Diajukan)
                      <ol>
                        {article.faq.map((item) => (
                          <li key={item.question}>{item.question}</li>
                        ))}
                      </ol>
                    </li>
                  )}
                </ol>
              </div>
            )}
            <ArticleBody blocks={remaining} />
          </article>
        </div>
      </section>
      {article.faq.length > 0 && (
        <Faq items={article.faq} title="Pertanyaan yang Sering Diajukan" />
      )}
      <Cta />
    </>
  );
}
