export type HomeContent = {
  hero: { eyebrow: string; title: string; description: string; images: string[] };
  about: { title: string; description: string };
  cta: { title: string; description: string; label: string };
  seo: { title: string; description: string };
};

export type ContactContent = {
  whatsapp: string;
  whatsappMessage: string;
  email: string;
  address: string;
};

export const defaultHome: HomeContent = {
  hero: {
    eyebrow: "Citraland Makassar",
    title: "Temukan Hunian Impian Anda di Citraland Makassar",
    description: "3 Kawasan Premium, 1 Pilihan Terbaik Untuk Masa Depan Anda",
    images: [
      "/images/2026/04/Frame-292.png",
      "/images/2026/04/Frame-294.webp",
      "/images/2026/04/image_web_optimized.jpg",
    ],
  },
  about: {
    title: "Tentang Kami",
    description: "Citraland Makassar menghadirkan tiga kawasan premium dengan konsep hunian modern, fasilitas lengkap dan lokasi strategis untuk mewujudkan kehidupan yang lebih baik bagi Anda dan keluarga.",
  },
  cta: {
    title: "Wujudkan Gaya Hidup Premium Anda Hari Ini",
    description: "Pilih hunian terbaik di CitraLand Makassar dan rasakan kualitas hidup yang lebih tinggi dalam lingkungan eksklusif.",
    label: "Hubungi Kami",
  },
  seo: {
    title: "CitraLand Makassar",
    description: "Temukan hunian impian di tiga kawasan premium CitraLand Makassar.",
  },
};

export const defaultContact: ContactContent = {
  whatsapp: "6281239909090",
  whatsappMessage: "Halo saya tertarik dengan Citraland Makassar",
  email: "citralandmakassar@gmail.com",
  address: "Makassar, Sulawesi Selatan",
};

export type PageName = "home" | "contact";
export type PageDataMap = { home: HomeContent; contact: ContactContent };
export const defaultPages: PageDataMap = { home: defaultHome, contact: defaultContact };

function sameShape(sample: unknown, value: unknown): boolean {
  if (Array.isArray(sample)) return Array.isArray(value) && (!sample.length || value.every((item) => sameShape(sample[0], item)));
  if (sample && typeof sample === "object") {
    if (!value || typeof value !== "object" || Array.isArray(value)) return false;
    return Object.keys(sample).every((key) => sameShape((sample as Record<string, unknown>)[key], (value as Record<string, unknown>)[key]));
  }
  return typeof value === typeof sample;
}

export function validatePage<T extends PageName>(slug: T, value: unknown): value is PageDataMap[T] {
  return sameShape(defaultPages[slug], value);
}
