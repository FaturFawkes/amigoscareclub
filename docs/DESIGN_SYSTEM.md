# Amigos Care Club — Design System

Gaya visual: **editorial / sporty bib-number aesthetic** — tipografi display besar, warna oranye energik di atas latar cream hangat, aksen lime neon, tekstur grain, dan section divider miring.

Sumber kebenaran: [`app/globals.css`](../app/globals.css). Semua token & utility didefinisikan di sana (Tailwind v4 CSS-first, tanpa `tailwind.config.js`).

---

## 1. Color Tokens

Didefinisikan di blok `@theme inline` → tersedia sebagai utility Tailwind (`bg-*`, `text-*`, `border-*`).

| Token | Hex | Utility | Penggunaan |
|---|---|---|---|
| `ink` | `#0B1F3A` | `bg-ink` `text-ink` | Warna teks utama, latar section gelap |
| `ink-soft` | `#14315A` | `text-ink-soft` | Variasi ink lebih terang (gradien, panel FAQ) |
| `cream` | `#FFF6EC` | `bg-cream` | Latar utama halaman, teks di atas ink/orange |
| `sand` | `#F3E7D3` | `bg-sand` | Latar blok lembut (highlight, info box) — sering `sand/40–60` |
| `orange` | `#FF5B1F` | `bg-orange` `text-orange` | Warna brand utama, CTA, aksen |
| `ember` | `#E8440D` | `bg-ember` | Oranye gelap untuk hover/gradien |
| `lime` | `#D6FF4B` | `text-lime` `bg-lime` | Aksen neon di atas latar gelap |
| `mist` | `#EAF1FF` | `bg-mist` | Biru sangat muda (didefinisikan, jarang dipakai) |

**Pola opasitas**: warna teks sekunder memakai alpha — `text-ink/70`, `text-cream/70`, dll.

**Pola variant kartu** (light / dark / orange) konsisten di About, Segments, Events:

| Variant | Wrapper | Aksen |
|---|---|---|
| `light` | `bg-cream border-2 border-ink/10 hover:border-orange` | aksen `orange` |
| `dark` | `bg-ink text-cream` | aksen `lime` |
| `orange` | `bg-orange text-cream` | aksen `cream` |

## 2. Typography

Tiga font di-load via `next/font/google` di `app/layout.tsx`, diekspos sebagai CSS variable:

| Peran | Font | Token | Utility/Class |
|---|---|---|---|
| Display | **Anton** (400) | `--font-display` / `--font-anton` | `.display`, `font-display` |
| Sans (body) | **Manrope** (300–800) | `--font-sans` / `--font-manrope` | default body |
| Mono/label | **Archivo** (400/600/800/900) | `--font-mono` / `--font-archivo` | `.mono`, `.kicker` |

### Class tipografi

- **`.display`** — heading besar. `letter-spacing: 0.005em`, `line-height: 0.9`. Ukuran via Tailwind (`text-5xl` … `text-7xl`); hero pakai `text-[clamp(3.5rem,11vw,9rem)]`.
- **`.display-hero`** — override mobile: `font-size: clamp(4rem,18vw,8rem)` di `max-width: 768px`.
- **`.mono`** — Archivo, uppercase, `letter-spacing: 0.14em`, weight 600. Untuk label kecil/metadata.
- **`.stroke-text`** — teks outline: `-webkit-text-stroke: 2px #0B1F3A`, fill transparan. Versi terang dipakai inline di FAQ (`#FFF6EC`).
- **`.kicker`** — label section: Archivo, uppercase, `0.18em` tracking, `0.78rem`, oranye, dengan garis `::before` 28×2px. Gunakan via komponen `<Kicker>`.

## 3. Utility & Component Class (globals.css)

| Class | Fungsi |
|---|---|
| `.btn` | Base tombol: inline-flex, pill (`border-radius: 999px`), padding `0.95rem 1.5rem`, weight 700 |
| `.btn-primary` | Oranye, teks cream, shadow oranye; hover → ember + naik 2px |
| `.btn-ghost` | Transparan, border ink 2px; hover → isi ink, teks cream |
| `.btn-arrow` | Panah dalam tombol; geser saat tombol di-hover |
| `.card` | Transisi hover; `.card:hover` naik 6px |
| `.nav-link` | Link nav dengan underline oranye animasi (`::after`), state `.active` |
| `.hero-img-wrap` / `.hero-img` | Bingkai gambar radius 2rem + overlay gradien; zoom halus saat hover |
| `.form-field` | Input garis-bawah saja; fokus → border oranye |
| `.bib` | Badge nomor bib (Anton, latar oranye, radius 6px) |
| `.ticker` / `.ticker-item` | Bar gelap untuk marquee |
| `.marquee` / `.marquee__inner` | Ticker scrolling, animasi `scroll` 32s linear infinite |
| `.reveal` / `.reveal.in` | Animasi reveal: dari `opacity:0 + translateY(28px)` → tampil (0.9s) |
| `.diagonal-top` / `.diagonal-bottom` | Section divider miring via `clip-path` (3vw) |
| `.dots` | Pola titik dekoratif (`radial-gradient`, grid 14px) |
| `.stat-num` | `font-variant-numeric: tabular-nums` untuk counter |
| FAQ accordion | `<details>` tanpa marker; `.faq-icon` rotate 45° saat open; `.faq-body` max-height transition |

### Efek global

- **Grain overlay**: `body::before` — noise SVG fixed, `opacity 0.35`, `mix-blend-mode: multiply`, `z-index 1`.
- **`scroll-behavior: smooth`** pada `html`; `overflow-x: hidden` pada `body`.
- Latar body default `#FFF6EC`, teks `#0B1F3A`, font-smoothing antialiased.

## 4. Komponen UI

### `<Button>` — `components/ui/Button.tsx`
Props: `variant` (`primary`|`ghost`, default primary), `href`, `type`, `className`, `onClick`.
Render `<Link>` bila `href` ada, selain itu `<button>`. Class = `btn btn-{variant}`. Override pakai `!` (mis. `!py-2.5`).

```tsx
<Button href="#contact" variant="primary">Join <span className="btn-arrow">→</span></Button>
<Button type="submit" variant="primary" className="w-full justify-center">Send</Button>
```

### `<Kicker>` — `components/ui/Kicker.tsx`
Props: `children` (string), `center` (bool), `light` (bool → warna lime `#D6FF4B`, untuk latar gelap).

```tsx
<Kicker>About the Club</Kicker>
<Kicker center light>FAQ</Kicker>
```

### `<Logo>` — `components/ui/Logo.tsx`
Gambar `/amigos-logo.jpeg` (1280×720, 16:9) + wordmark "AMIGOS CARE CLUB.". Props: `size` (`sm`/`md`/`lg` → tinggi 36/44/56px, width dihitung dari rasio), `href` (default `#top`).

### `<RevealOnScroll>` — `components/ui/RevealOnScroll.tsx`
Wrapper animasi scroll. Props: `children`, `className`, `as` (tag, default `div`). Menambahkan class `in` saat 12% elemen masuk viewport (one-shot, lalu unobserve). Bungkus blok yang ingin muncul beranimasi.

```tsx
<RevealOnScroll className="mt-6"><h1 className="display">…</h1></RevealOnScroll>
```

## 5. Layout & Spacing

- Kontainer: `mx-auto max-w-7xl px-5 md:px-8` (FAQ pakai `max-w-5xl`).
- Padding section vertikal: `py-24 md:py-32` (Stats lebih kecil: `py-16 md:py-20`).
- Grid: 12-kolom (`lg:grid-cols-12`) untuk layout asimetris; grid sederhana (`sm/md/lg:grid-cols-*`) untuk kartu.
- Radius: kartu `rounded-3xl`, badge/box kecil `rounded-2xl`/`rounded-xl`, tombol & pill `rounded-full`.
- Sudut "lepas" dekoratif: kartu floating dipakai dengan `rotate-[-6deg]` / `rotate-[4deg]`.

## 6. Motion

| Animasi | Pemicu | Detail |
|---|---|---|
| Reveal on scroll | `IntersectionObserver` (12%) | `.reveal` → `.in`, 0.9s `cubic-bezier(.2,.7,.2,1)` |
| Count-up statistik | `IntersectionObserver` (50%) | ease-out cubic, durasi 1800ms (`Stats.tsx`) |
| Marquee ticker | CSS infinite | `scroll` 32s linear, konten diduplikasi 2× |
| Hover tombol/kartu | CSS transition | naik 2–6px + perubahan warna/shadow |
| Nav underline | CSS | width 0→100% saat hover / `.active` |
| FAQ accordion | `<details[open]>` | ikon rotate 45°, body max-height transition |

## 7. Panduan Konsistensi

Saat menambah section/komponen baru, ikuti pola berikut:

1. Bungkus kontainer dengan `mx-auto max-w-7xl px-5 md:px-8`, beri section `py-24 md:py-32`.
2. Awali dengan `<Kicker>` lalu heading `.display`; gunakan `<RevealOnScroll>` untuk blok beranimasi.
3. Gunakan token warna terdaftar (`ink/cream/orange/lime/sand`) dan opasitas `/70`–`/10`, bukan hex acak.
4. Untuk kartu, pakai sistem variant `light/dark/orange` + class `.card rounded-3xl`.
5. Gunakan komponen `<Button>` untuk semua CTA — jangan tulis class `.btn` manual.
6. Label kecil/metadata pakai `.mono`; angka counter pakai `.stat-num`.
7. Latar gelap → aksen `lime`; latar terang → aksen `orange`.
