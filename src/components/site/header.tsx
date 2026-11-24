"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { site } from "@/lib/site";

export function Header({ districts }: { districts: { slug: string; title: string }[] }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const navItems = [
    { label: "Home", href: "/" },
    ...districts.map((district) => ({ label: district.title, href: `/${district.slug}` })),
    { label: "Blog", href: "/blog" },
    { label: "Kontak", href: "/#kontak" },
  ];

  return (
    <header className="site-header">
      <div className="site-container header-inner">
        <Link
          href="/"
          className="brand"
          aria-label="CitraLand Makassar - Home"
          onClick={() => setOpen(false)}
        >
          <Image
            src={site.logo}
            alt="CitraLand Makassar"
            width={112}
            height={80}
            priority
          />
        </Link>
        <nav
          className={`primary-nav ${open ? "is-open" : ""}`}
          aria-label="Navigasi utama"
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={pathname === item.href ? "is-active" : ""}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <button
          className="menu-toggle"
          type="button"
          aria-label={open ? "Tutup menu" : "Buka menu"}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={25} /> : <Menu size={25} />}
        </button>
      </div>
    </header>
  );
}
