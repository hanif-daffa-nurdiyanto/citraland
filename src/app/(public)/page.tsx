import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { Cta } from "@/components/site/cta";
import { DistrictList } from "@/components/site/district-list";
import { HeroSlideshow } from "@/components/site/hero-slideshow";
import { SectionHeading } from "@/components/site/section-heading";
import { getContactContent, getDistricts, getHomeContent } from "@/lib/content";
import { whatsappUrl } from "@/lib/site";

const advantages = [
  {
    title: "Pengembang Terpercaya",
    icon: "/images/2026/04/construction-worker-1.png",
    text: "Kawasan premium dikembangkan dengan pengalaman dan kualitas CitraLand.",
  },
  {
    title: "Kualitas Bangunan Terbaik",
    icon: "/images/2026/04/blueprint.png",
    text: "Hunian modern dengan rancangan yang nyaman untuk keluarga.",
  },
  {
    title: "Fasilitas Modern & Lengkap",
    icon: "/images/2026/04/building.png",
    text: "Fasilitas kawasan mendukung aktivitas dan gaya hidup sehari-hari.",
  },
  {
    title: "Lokasi Strategis",
    icon: "/images/2026/04/location.png",
    text: "Pilihan lokasi yang terhubung dengan pusat kota dan fasilitas penting.",
  },
];

export async function generateMetadata(): Promise<Metadata> {
  const home = await getHomeContent();
  return { title: home.seo.title, description: home.seo.description, alternates: { canonical: "/" } };
}

export default async function Home() {
  const [districts, home, contact] = await Promise.all([getDistricts(), getHomeContent(), getContactContent()]);
  const heroDistricts = [districts[0], districts[2], districts[1]].filter(Boolean);
  return (
    <>
      <section className="home-hero">
        <HeroSlideshow
          images={home.hero.images}
          alt="Kawasan CitraLand Makassar"
        />
        <div className="home-hero-shade" />
        <div className="site-container home-hero-content">
          <span className="eyebrow">{home.hero.eyebrow}</span>
          <h1>{home.hero.title}</h1>
          <p>{home.hero.description}</p>
          <ul className="hero-areas">
            {heroDistricts.map((district) => (
              <li key={district.slug}>
                <Link href={`/${district.slug}`}>{district.title}</Link>
              </li>
            ))}
          </ul>
          <div className="hero-actions">
            <a
              className="button button-green"
              href={whatsappUrl(contact.whatsappMessage, contact.whatsapp)}
              target="_blank"
              rel="noopener noreferrer"
            >
              Konsultasi Sekarang <ArrowUpRight size={18} />
            </a>
          </div>
        </div>
      </section>

      <section className="about-section" id="tentang">
        <div className="site-container about-layout">
          <div className="about-copy">
            <SectionHeading title={home.about.title} />
            <p>{home.about.description}</p>
          </div>
          <div className="advantage-grid">
            {advantages.map((item) => (
              <div className="advantage" key={item.title}>
                <Image src={item.icon} alt="" width={54} height={54} />
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div id="kawasan">
        <DistrictList />
      </div>

      <section className="showcase-section">
        {districts.map((district) => (
          <div className="home-district" key={district.slug}>
            <div className="site-container">
              <h2>{district.title}</h2>
              {district.products.map((product) => (
                <div className="home-product" key={product.title}>
                  <div className="home-product-heading">
                    <h3>{product.title}</h3>
                    <a
                      href={whatsappUrl(
                        `Halo saya tertarik dengan ${product.title}`,
                        contact.whatsapp,
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Konsultasi Sekarang <ArrowUpRight size={18} />
                    </a>
                  </div>
                  <div className="home-product-gallery">
                    <div className="home-product-main">
                      <Image
                        src={product.image}
                        alt={product.title}
                        fill
                        sizes="(max-width: 800px) 100vw, 50vw"
                      />
                    </div>
                    {product.gallery.map((image, index) => (
                      <div className="home-product-thumb" key={image}>
                        <Image
                          src={image}
                          alt={`${product.title} ${index + 1}`}
                          fill
                          sizes="(max-width: 800px) 50vw, 25vw"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>
      <Cta />
    </>
  );
}
