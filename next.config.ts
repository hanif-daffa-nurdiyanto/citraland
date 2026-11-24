import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: { root: process.cwd() },
  async redirects() {
    const legacyPages: Record<string, string> = {
      "9": "/citraland-city-losari-makassar",
      "1551": "/citraland-tallasa-city-makassar",
      "1579": "/citraland-celebes-hertasning",
      "1604": "/blog",
      "1606": "/7-alasan-investasi-properti-di-makassar-semakin-menguntungkan",
      "1761": "/citraland-tallasa-city-fasilitas-smarthome",
      "1766": "/rumah-dekat-bandara-makassar",
      "1771": "/apartemen-view-laut-makassar",
    };
    return [
      { source: "/category/blog", destination: "/blog", permanent: true },
      { source: "/index.html", destination: "/", permanent: true },
      ...Object.entries(legacyPages).flatMap(([id, destination]) => [
        { source: "/", has: [{ type: "query" as const, key: "p", value: id }], destination, permanent: true },
        { source: "/", has: [{ type: "query" as const, key: "p", value: `${id}.html` }], destination, permanent: true },
      ]),
    ];
  },
};

export default nextConfig;
