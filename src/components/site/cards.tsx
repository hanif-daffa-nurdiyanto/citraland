import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function DistrictCard({
  title,
  image,
  href,
}: {
  title: string;
  image: string;
  href: string;
}) {
  return (
    <Link href={href} className="district-card">
      <div className="district-card-image">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 760px) 100vw, 33vw"
        />
      </div>
      <div className="district-card-body">
        <h3>{title}</h3>
        <span>
          Lihat Detail <ArrowUpRight size={18} />
        </span>
      </div>
    </Link>
  );
}

export function ArticleCard({
  title,
  image,
  href,
  excerpt,
}: {
  title: string;
  image: string;
  href: string;
  excerpt: string;
}) {
  return (
    <Link href={href} className="article-card">
      <h2 className="article-card-title">{title}</h2>
      <div className="article-card-image">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 760px) 100vw, 50vw"
        />
      </div>
      <div className="article-card-body">
        <span className="article-category">Blog</span>
        <p>{excerpt}</p>
        <span className="article-more">
          <ArrowUpRight size={15} /> Read Full Story...
        </span>
      </div>
    </Link>
  );
}
