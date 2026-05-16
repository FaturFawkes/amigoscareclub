# Amigos Care Club — Project Documentation

Landing page satu halaman (single-page marketing site) untuk **Amigos Care Club**, sebuah komunitas lari yang ramah dan inklusif yang berbasis di Jonggol · Bogor. Tema brand: *"Run With Fun"*.

---

## 1. Tech Stack

| Area | Teknologi | Versi |
|---|---|---|
| Framework | Next.js (App Router) | 16.2.4 |
| UI Library | React | 19.2.4 |
| Bahasa | TypeScript | ^5 |
| Styling | Tailwind CSS (v4, CSS-first config) | ^4 |
| PostCSS | @tailwindcss/postcss | ^4 |
| Linting | ESLint + eslint-config-next | ^9 |
| Fonts | next/font/google (Anton, Manrope, Archivo) | — |
| Image | next/image (remote Unsplash + lokal) | — |

Tidak ada backend, database, state management library, atau API. Semua konten bersifat statis dan di-hardcode di dalam komponen.

## 2. Scripts

```bash
npm run dev     # development server (next dev)
npm run build   # production build
npm run start   # serve hasil build
npm run lint    # eslint
```

## 3. Struktur Direktori

```
amigoscareclub/
├── app/
│   ├── layout.tsx        # Root layout: load font, metadata, <html>/<body>
│   ├── page.tsx          # Halaman utama: merangkai semua section
│   ├── globals.css       # Tailwind theme + seluruh utility class kustom
│   └── favicon.ico
├── components/
│   ├── Navbar.tsx        # Header fixed, scroll-spy, menu mobile (client)
│   ├── Hero.tsx          # Hero + marquee ticker
│   ├── About.tsx         # Visi/misi + grid kartu nilai (ValueCard)
│   ├── Stats.tsx         # Counter angka animasi (client)
│   ├── Segments.tsx      # 4 segmen lari (SegmentCard)
│   ├── Events.tsx        # Aktivitas + featured CTA + langkah bergabung
│   ├── Testimonials.tsx  # 3 testimoni anggota
│   ├── FAQ.tsx           # Accordion FAQ (<details>)
│   ├── Contact.tsx       # Form kontak (client) + social link
│   ├── Footer.tsx        # Footer + link
│   └── ui/
│       ├── Button.tsx        # Tombol primary/ghost (link atau button)
│       ├── Kicker.tsx        # Label kecil di atas heading
│       ├── Logo.tsx          # Logo gambar + wordmark
│       └── RevealOnScroll.tsx# Wrapper animasi reveal saat scroll (client)
├── public/                   # amigos-logo.jpeg + aset SVG default
├── docs/                     # Dokumentasi ini
├── globals.css theme         # lihat DESIGN_SYSTEM.md
└── config: next.config.ts, tsconfig.json, eslint.config.mjs, postcss.config.mjs
```

## 4. Arsitektur

### Komposisi halaman

`app/page.tsx` adalah satu-satunya route. Ia merangkai section secara berurutan:

```
Navbar → Hero → About → Stats → Segments → Events → Testimonials → FAQ → Contact → Footer
```

Navigasi antar section memakai anchor link (`#about`, `#segments`, `#events`, `#faq`, `#contact`) dengan `scroll-behavior: smooth`.

### Server vs Client Components

Defaultnya Server Component. Hanya 4 file memakai `"use client"` karena butuh interaktivitas browser:

- `Navbar.tsx` — state scroll + scroll-spy section aktif
- `Stats.tsx` — `IntersectionObserver` untuk animasi count-up
- `Contact.tsx` — state submit form
- `ui/RevealOnScroll.tsx` — `IntersectionObserver` untuk animasi reveal

### Pola data

Semua konten (nav link, nilai, segmen, testimoni, FAQ, dll.) didefinisikan sebagai array konstanta di dalam masing-masing komponen, lalu di-`map`. Mengubah konten = mengedit array tersebut langsung di file komponen.

### Pola styling

Tailwind v4 dipakai dengan konfigurasi CSS-first (tidak ada `tailwind.config.js`). Token tema dan semua utility class kustom (`.btn`, `.card`, `.kicker`, `.display`, `.mono`, dll.) didefinisikan di `app/globals.css`. Detail lengkap ada di [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md).

### Komponen UI bersama

- **Button** — render `next/link` jika ada `href`, atau `<button>` jika tidak. Varian `primary` / `ghost`.
- **Kicker** — label uppercase ber-spacing dengan opsi `center` dan `light`.
- **Logo** — gambar `public/amigos-logo.jpeg` (rasio 16:9) + wordmark, ukuran `sm/md/lg`.
- **RevealOnScroll** — membungkus children, menambah class `in` saat masuk viewport (animasi via CSS `.reveal`).

## 5. Konten & Detail Brand

- **Nama**: Amigos Care Club — *"Run With Fun."*
- **Lokasi/base**: Jonggol · Citra Indah, Bogor (Est. 2026)
- **Email**: amigoscareclub@gmail.com
- **Instagram**: https://www.instagram.com/amigoscareclub
- **WhatsApp grup**: https://chat.whatsapp.com/CHqUFDV46TM89ndWXPNzV6
- **Segmen lari**: Beginner, Intermediate, Advanced, Social Run
- Konten campuran Inggris (heading/UI) dan Indonesia (testimoni & FAQ).

## 6. Catatan & Keterbatasan

- **Form kontak tidak terkirim ke mana pun.** `Contact.tsx` hanya menampilkan pesan sukses palsu lewat state lokal lalu reset. Perlu integrasi backend/email service bila ingin fungsional.
- Gambar hero memakai URL remote Unsplash (butuh konfigurasi domain di `next.config.ts` bila diganti / di-strict-kan).
- Link legal di footer (Privacy/Terms/Code of Conduct) masih placeholder `#`.
- Tidak ada test, tidak ada CI.
- `app/layout.tsx` memakai `suppressHydrationWarning` dan `translate="no"` (commit terakhir: "fix hydrating").

## 7. Cara Menjalankan

```bash
npm install
npm run dev      # buka http://localhost:3000
```
