import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { whatsappUrl } from "@/lib/site";
import { getContactContent, getHomeContent } from "@/lib/content";

export async function Cta({
  title,
  description,
  href,
  label,
}: {
  title?: string;
  description?: string;
  href?: string;
  label?: string;
}) {
  const [home, contact] = await Promise.all([getHomeContent(), getContactContent()]);
  title ??= home.cta.title;
  description ??= home.cta.description;
  label ??= home.cta.label;
  href ??= whatsappUrl(contact.whatsappMessage, contact.whatsapp);
  const content = (
    <>
      {label} <ArrowUpRight size={19} />
    </>
  );
  return (
    <section className="cta-section">
      <div className="site-container cta-inner">
        <div>
          <span className="eyebrow">CitraLand Makassar</span>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
        {href.startsWith("http") ? (
          <a
            className="button button-light"
            href={href}
            target="_blank"
            rel="noopener noreferrer"
          >
            {content}
          </a>
        ) : (
          <Link className="button button-light" href={href}>
            {content}
          </Link>
        )}
      </div>
    </section>
  );
}
