import Image from "next/image";
import Link from "next/link";
import { site, whatsappUrl } from "@/lib/site";
import { getContactContent, getDistricts, headingId } from "@/lib/content";

export async function Footer() {
  const [districts, contact] = await Promise.all([getDistricts(), getContactContent()]);
  return (
    <footer className="site-footer" id="kontak">
      <div className="site-container footer-grid">
        <div className="footer-intro">
          <Link href="/" aria-label="CitraLand Makassar - Home">
            <Image
              src={site.logo}
              alt="CitraLand Makassar"
              width={130}
              height={93}
            />
          </Link>
          <p>
            CitraLand Makassar menghadirkan tiga kawasan premium dengan hunian
            modern, fasilitas lengkap, dan lokasi strategis.
          </p>
        </div>
        <div>
          <h2>Menu</h2>
          <ul>
            {[{ label: "Home", href: "/" }, ...districts.map((district) => ({ label: district.title, href: `/${district.slug}` })), { label: "Kontak", href: "/#kontak" }].map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2>Kawasan</h2>
          <ul>
            {districts.flatMap((district) =>
              district.products.map((product) => (
                <li key={`${district.slug}-${product.title}`}>
                  <Link href={`/${district.slug}#${headingId(product.title)}`}>
                    {product.title}
                  </Link>
                </li>
              )),
            )}
          </ul>
        </div>
        <div>
          <h2>Kontak</h2>
          <ul>
            <li>
              <a href={whatsappUrl(contact.whatsappMessage, contact.whatsapp)} target="_blank" rel="noopener noreferrer">
                Whatsapp : {contact.whatsapp}
              </a>
            </li>
            <li>
              <a href={`mailto:${contact.email}`}>Email : {contact.email}</a>
            </li>
            <li>Alamat : {contact.address}</li>
          </ul>
        </div>
      </div>
      <div className="site-container footer-bottom">
        © Copyright 2026 <Link href="/">citralandmakassarproperty.com</Link>.
        All Rights Reserved Powered by{" "}
        <a
          href="https://resolusiweb.com/jasa-pembuatan-website"
          target="_blank"
          rel="noopener noreferrer"
        >
          Resolusiweb.com
        </a>
        .
      </div>
    </footer>
  );
}
