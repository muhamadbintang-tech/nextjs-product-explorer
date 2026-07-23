# 🛍️ Abinshop - Next.js Product Explorer

**Abinshop** adalah aplikasi pencarian dan eksplorasi katalog produk modern yang responsif dan interaktif. Aplikasi ini dirancang untuk memberikan pengalaman eksplorasi produk yang bersih (*clean white UI*), cepat, dan intuitif bagi pengguna.

---

## 🚀 Fitur Utama

- **Katalog Produk Interaktif:** Menampilkan daftar produk pilihan dalam bentuk *grid card* yang rapi.
- **Pencarian Real-time:** Fitur pencarian produk berdasarkan nama, merek, atau kata kunci secara instan.
- **Filter Kategori:** Memudahkan pengguna menyaring produk berdasarkan kategori tertentu.
- **Halaman Detail Produk:** Menampilkan informasi produk secara rinci seperti harga, rating, jumlah stok, hingga deskripsi lengkap.
- **Indicator Loading & Skeleton UI:** Pengalaman pengguna yang mulus saat memuat data (*fetching*) tanpa efek *flicker*.
- **Desain Responsif:** Tampilan adaptif yang nyaman diakses dari perangkat *Desktop*, *Tablet*, maupun *Mobile/Smartphone*.

---

## 🛠️ Teknologi yang Digunakan

- **Framework:** Next.js 16 (App Router)
- **Library UI:** React 19
- **Styling:** Tailwind CSS v4
- **Bahasa Pemrograman:** TypeScript
- **API Source:** DummyJSON Product API
- **Code Quality:** ESLint

---

## 📁 Struktur Project

```text
nextjs-product-explorer/
├── public/                 # Asset statis (gambar, favicon, logo)
├── src/
│   ├── app/                # Next.js App Router (Halaman & Layout)
│   │   ├── globals.css     # Style global & konfigurasi Tailwind
│   │   ├── layout.tsx      # Root layout aplikasi
│   │   ├── page.tsx        # Halaman Utama (Katalog Produk)
│   │   └── product/
│   │       └── [id]/
│   │           └── page.tsx # Halaman Detail Produk
│   ├── components/         # Komponen UI Reusable
│   │   ├── common/         # Header, Footer, LoadingSkeleton
│   │   └── products/       # ProductCard, ProductFilter, dll.
│   ├── lib/                # Fungsi fetching API & helper
│   └── types/              # Definisi tipe/interface TypeScript
├── next.config.ts          # Konfigurasi Next.js
├── package.json            # Dependensi proyek
└── README.md               # Dokumentasi proyek