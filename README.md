# CitraLand Makassar

Aplikasi Next.js App Router, TypeScript, dan Tailwind CSS dalam satu proyek di root. Referensi website publik berada di `ref-web/`; referensi desain admin berada di `ref-system/`.

## Menjalankan lokal

```bash
npm ci
npm run dev
```

Buka `http://localhost:3000`. Aset terpilih dari referensi disimpan di `public/images/2025` dan `public/images/2026`. Lihat `reference-inventory.md` untuk peta halaman dan gambar.

Halaman publik mencakup beranda, tiga kawasan, blog, dan empat artikel. Kontennya disimpan di `src/data/` dan dibaca oleh halaman Next.js. Admin mengikuti tahap berikutnya pada `plan.md`.

Tiga gambar slide yang dirujuk HTML sumber tidak tersedia dalam `ref-web`; rinciannya ada di `reference-inventory.md`. Pemeriksaan kesamaan visual 1:1 masih menunggu tangkapan layar referensi pada desktop dan mobile karena browser lokal lingkungan ini tidak berhasil merender salinan HTML.
