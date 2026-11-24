import { images } from "@/data/assets";

export const site = {
  name: "CitraLand Makassar",
  description:
    "Temukan hunian impian di CitraLand Makassar. Tiga kawasan premium: CitraLand City Losari, Tallasa City, dan Celebes Hertasning.",
  whatsapp: "6281239909090",
  email: "citralandmakassar@gmail.com",
  address: "Makassar, Sulawesi Selatan",
  logo: images.logo,
} as const;

export const navItems = [
  { label: "Home", href: "/" },
  { label: "Citraland City Losari Makassar", href: "/citraland-city-losari-makassar" },
  { label: "Citraland Tallasa City makassar", href: "/citraland-tallasa-city-makassar" },
  { label: "Citraland Celebes Hertasning", href: "/citraland-celebes-hertasning" },
  { label: "Blog", href: "/blog" },
  { label: "Kontak", href: "/#kontak" },
] as const;

export function whatsappUrl(message: string = "Halo saya tertarik dengan Citraland Makassar", phone: string = site.whatsapp) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
