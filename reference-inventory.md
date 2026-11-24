# Inventaris Referensi

Sumber: salinan HTML dan aset lokal di `ref-web/`, serta kode admin di `ref-system/`. Dokumen ini menjadi peta implementasi; pemeriksaan visual akhir tetap dilakukan saat halaman baru sudah dapat dijalankan.

## Rute dan konten

| Rute baru | Sumber | Susunan utama |
| --- | --- | --- |
| `/` | `ref-web/index.html` | Hero dan pilihan tiga kawasan; Tentang Kami; empat keunggulan; kartu kawasan; katalog produk per kawasan; CTA; blok kontak; footer. |
| `/citraland-city-losari-makassar` | direktori dengan nama sama | Hero waterfront; pengantar lokasi CPI; Cataluna Apartment; New Type Sunset Cove; empat keunggulan; kawasan lain; FAQ. |
| `/citraland-tallasa-city-makassar` | direktori dengan nama sama | Hero green township; pengantar; Tallasa City/Boulevard/Elysian Park dan galeri produk; empat keunggulan; kawasan lain; FAQ. |
| `/citraland-celebes-hertasning` | direktori dengan nama sama | Hero green living; pengantar; New Type Felicita dan La Grande; empat keunggulan; kawasan lain; FAQ. |
| `/blog` | `ref-web/blog/index.html` | Empat kartu artikel, masing-masing menuju halaman detail. |
| `/apartemen-view-laut-makassar` | direktori dengan nama sama | Artikel, gambar Cataluna, dan tiga FAQ. |
| `/rumah-dekat-bandara-makassar` | direktori dengan nama sama | Artikel perbandingan Tallasa City dan Celebes Hertasning, gambar, dan tiga FAQ. |
| `/citraland-tallasa-city-fasilitas-smarthome` | direktori dengan nama sama | Artikel smart home Tallasa City, gambar, dan tiga FAQ. |
| `/7-alasan-investasi-properti-di-makassar-semakin-menguntungkan` | direktori dengan nama sama | Artikel tujuh alasan investasi, penutup, dan empat FAQ. |

HTML artikel investasi memakai banyak `h1` untuk subbagian. Saat dibangun ulang, pertahankan isi dan hierarki visualnya, tetapi gunakan satu `h1` per halaman dan heading berikutnya secara semantik.

### Peta URL lama

Tautan internal salinan memakai `index.html?p=...` dan tidak bisa dipakai apa adanya di Next.js. Padanannya:

| ID lama | Rute baru |
| --- | --- |
| `9` | `/citraland-city-losari-makassar` |
| `1551` | `/citraland-tallasa-city-makassar` |
| `1579` | `/citraland-celebes-hertasning` |
| `1604` | `/blog` |
| `1606` | `/7-alasan-investasi-properti-di-makassar-semakin-menguntungkan` |
| `1761` | `/citraland-tallasa-city-fasilitas-smarthome` |
| `1766` | `/rumah-dekat-bandara-makassar` |
| `1771` | `/apartemen-view-laut-makassar` |

`/category/blog` menampilkan daftar blog yang sama; arahkan ke `/blog` bila rute lama perlu dilayani. `feed/`, `comments/feed/`, `wp-json/`, `xmlrpc.php`, dan file plugin WordPress bukan halaman yang perlu dibuat ulang. Navigasi **Kontak** menuju `/#kontak`, bukan halaman terpisah.

## Pola visual dan perilaku website publik

- Navigasi: Home, tiga kawasan, Blog, dan Kontak; menu kawasan juga muncul pada navigasi mobile. Halaman kawasan menampilkan kartu menuju dua kawasan lain.
- Hero beranda memakai latar `Frame-294.webp`; referensi CSS menetapkan tinggi minimum sekitar 700 px pada layar sampai 767 px. Kartu/grid kawasan menjadi satu kolom di breakpoint tersebut. CSS sumber juga mengatur perubahan pada 1024 px dan 1366 px.
- Warna yang paling sering dipakai pada halaman utama/kawasan: hijau `#13564B` dan `#093830`, putih `#FFFFFF`, teks gelap `#111111`, abu terang `#F8F8F8`/`#E8E8E8`, aksen kuning `#FFE16A`. Blog menggunakan beberapa warna widget berbeda; ambil tata letak dan hierarki dari blog tanpa membawa seluruh CSS WordPress.
- Tipografi sumber mencampur Montserrat, Playfair Display, dan Poppins. Atur pemakaian font berdasarkan peran teks saat implementasi; CSS Elementor menggunakan ketiganya pada beranda dan halaman kawasan.
- CTA utama menuju WhatsApp `6281239909090` dengan pesan awal “Halo saya tertarik dengan Citraland Makassar”. Blok kontak mencantumkan `081239909090`, `citralandmakassar@gmail.com`, dan `Makassar, Sulawesi Selatan`. Tidak ditemukan formulir pada halaman beranda, blog, atau kawasan yang diperiksa.
- Ikon sosial di footer salinan memiliki tautan kosong. Tentukan tujuan yang valid dari sumber konten sebelum mengaktifkannya; jangan membuat tautan `#` sebagai pengganti.
- Judul dan deskripsi metadata tersedia pada tiap halaman. Pertahankan makna metadata, tetapi gunakan canonical rute baru alih-alih bentuk `index.html?p=...`.

## Peta aset utama

Seluruh file berikut berada di `ref-web/wp-content/uploads/`. Salin hanya file yang dipakai, bukan seluruh `wp-content` (yang juga berisi CSS/JS plugin).

| Pemakaian | File sumber penting |
| --- | --- |
| Logo dan favicon | `2025/10/LOGO-UTAMA-WEBSITE-BARU-09-300x214.png.webp`; varian favicon `192x192`, `180x180`, dan `32x32`. |
| Hero beranda | `2026/04/Frame-294.webp` (2472×1229; direferensikan sebagai background CSS). |
| Ikon keunggulan beranda | `2026/04/construction-worker-1.png`, `blueprint.png`, `building.png`, `location.png`. |
| Kartu tiga kawasan | `2026/05/Brochure-Book-Cataluna_page-0003-1-1.webp`; `2026/04/E-BROSUR-CLUSTER-OLIVE-TREE-CITRALAND-TALLASA-CITY_page-0009-2.webp`; `2026/04/citraland-Citraland-Celebes-Hertasning.webp`. Varian `1024x725` dan `300x212` tersedia untuk beberapa kartu. |
| Losari dan Cataluna | Gambar `2026/05/Brochure-Book-Cataluna_page-*.webp` serta `2026/04/Brochure-Book-Cataluna_page-*.webp`; Sunset Cove memakai `2026/04/E-Brochure-New-Type-Sunset-Cove_page-*.webp`. |
| Tallasa City | `2026/04/E-BROSUR-CLUSTER-OLIVE-TREE-CITRALAND-TALLASA-CITY_page-*.webp`, `Frame-295.webp`–`Frame-297.webp`; galeri tipe memakai `2026/05/excelia*.webp` dan `enora*.webp`. |
| Celebes Hertasning | `2026/04/citraland-Citraland-Celebes-Hertasning.webp`, `Frame-298.webp`–`Frame-303.webp`, dan `2026/05/Frame-302-1.png`/`Frame-304.png`. |
| Blog dan artikel | Gambar utama di `2026/06/`; kartu blog memakai thumbnail di `uploads/elementor/thumbs/`. Pakai file utama/varian WordPress yang paling sesuai, bukan thumbnail kecil, untuk hero artikel. |

Pemetaan gambar artikel:

| Artikel | Gambar pada halaman detail |
| --- | --- |
| Apartemen view laut | `2026/06/Apartemen-View-Laut-Makassar-Citraland-Makassar.jpg` dan `Brochure-Book-Cataluna_page-0014-1.jpg`. |
| Rumah dekat bandara | `2026/06/Bandar_Udara_Internasional_Sultan_Hasanuddin-scaled.jpg`, `E-BROSUR-CLUSTER-OLIVE-TREE-CITRALAND-TALLASA-CITY_page-0019-1.jpg`, dan `rumah-dekat-bandara-makassar.jpg`. |
| Hunian smarthome Tallasa City | `2026/06/E-BROSUR-CLUSTER-OLIVE-TREE-CITRALAND-TALLASA-CITY_page-0009-2-1536x1087-1.jpg`. |
| Tujuh alasan investasi | `2026/04/citraland-Citraland-Celebes-Hertasning.webp`. |

Ada beberapa ukuran dari gambar yang sama di direktori unggahan. Pilih satu file beresolusi sesuai kebutuhan tiap komponen dan simpan pemetaan eksplisit dalam data konten; hindari menyalin semua variannya. Referensi favicon juga menyebut varian `270x270` yang tidak ada dalam salinan lokal, sehingga gunakan ukuran yang tersedia.

HTML slideshow juga menyebut `2026/04/Frame-292.png`, `2026/04/image_web_optimized.jpg`, dan `2026/04/Frame-302.webp`, tetapi ketiga file itu tidak ada dalam salinan `ref-web`. Implementasi lokal memakai slide yang tersedia; kesamaan slideshow secara penuh memerlukan ketiga aset tersebut.

## Acuan admin dari `ref-system`

- `/admin` memiliki tiga keadaan: konfigurasi belum lengkap, formulir login, dan dashboard; bila database gagal, tampilkan status kesalahan. Metadata admin `noindex`.
- Login berupa kartu putih terpusat, ikon, username/password, pesan kesalahan, dan tombol masuk. Sesi memakai cookie HTTP only bertanda tangan.
- Dashboard memakai sidebar putih lebar `w-64` pada desktop dengan kelompok **Pages** dan **Collections**; pada mobile navigasi menjadi deretan horizontal. Area utama berlatar krem muda, header sticky, tombol lihat halaman/tambah/simpan/hapus, serta daftar dan editor berbentuk kartu.
- Alur koleksi: cari, tambah, edit, duplikasi, urutkan, hapus dengan konfirmasi, lalu lihat detail publik. Alur halaman tunggal: buka editor, ubah field, simpan, lihat halaman publik. Umpan balik dan keadaan sibuk sudah ada pada rujukan.
- Warna `.cms-shell`: background `#f8f7f5`, teks `#29221d`, primary `#805231`, secondary `#f1ece7`, border `#e7e0d9`, destructive `#bd3e37`. Rujukan memakai komponen UI shadcn/Radix dan ikon Lucide.
- Penyimpanan contoh memakai PostgreSQL dengan JSONB, seed awal JSON, validasi, dan revalidasi rute setelah perubahan. Endpoint upload menerima JPEG/PNG/WebP maksimal 5 MB setelah pemeriksaan autentikasi dan signature file. Pola ini dapat diadaptasi untuk konten CitraLand, tetapi nama tabel, cookie, menu, dan field harus khusus proyek baru.

## Catatan untuk tahap berikutnya

1. Struktur admin meniru `ref-system`, sedangkan isi menu mengikuti model CitraLand: Home, Kawasan, Artikel, dan pengaturan kontak/CTA.
2. Halaman kawasan bisa memakai template bersama, namun setiap kawasan memiliki produk, galeri, keunggulan, dan FAQ yang berbeda.
3. Untuk visual akhir, bandingkan hasil Next.js terhadap salinan HTML pada lebar desktop dan mobile. Inventaris CSS ini adalah titik awal, bukan ukuran piksel final.
