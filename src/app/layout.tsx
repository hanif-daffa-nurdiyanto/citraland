import type { Metadata } from "next";
import { site } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://citralandmakassarproperty.com"),
  title: { default: site.name, template: `%s | ${site.name}` },
  description: site.description,
  icons: {
    icon: "/images/2025/10/cropped-cropped-LOGO-UTAMA-WEBSITE-BARU-09-300x214.png-32x32.webp",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
