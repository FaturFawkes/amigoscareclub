# Plan 01: Event Registration Page — 40% OF HEART RATE RUN

**Status:** ✅ Implemented

## Context

Tombol **"Count me in"** pada event card di `components/Events.tsx:142` sebelumnya mengarah ke anchor `#contact` di landing page. Tujuan: membuka **halaman baru** berisi form registrasi peserta event, lengkap dengan instruksi pembayaran BCA dan popup konfirmasi setelah submit.

Route memakai **slug dari judul event** dengan folder statis per event:
`"40% OF HEART RATE RUN – VOL.2"` → slug `40-of-heart-rate-run` → route `/event/40-of-heart-rate-run`

**Stack:** Next.js 16 (App Router) · React 19 · Tailwind 4. Submit & file upload sudah terhubung ke backend real via `NEXT_PUBLIC_API_BASE_URL`.

## Decisions

| Keputusan | Pilihan |
|-----------|---------|
| Route structure | Static folder per event (bukan dynamic `[slug]`) |
| File upload | `multipart/form-data` ke endpoint backend |
| Submit target | `POST /events/{eventSlug}/registrations` (real API) |
| Route | `/event/40-of-heart-rate-run` |

## Implementation

### 1. Route baru `app/event/40-of-heart-rate-run/page.tsx`
- Client Component (`"use client"`) — ada form state, validasi, fetch detail event, submit API, popup interaktif.
- Pakai design tokens existing (`bg-cream`, `text-ink`, `bg-orange`, `bg-sand`, kelas `.btn`/`.btn-primary` dari `app/globals.css`).

### 2. Detail event di halaman
- Nama event: **40% OF HEART RATE RUN – VOL.2**
- Hari & Tanggal: **Minggu, 24 Mei 2026**
- Waktu: **06.00 WIB**
- Lokasi: **Melkkops Coffee & Eatry**
- Distance: **5 km** · Every pace welcome

### 3. Info pembayaran
Kotak highlight menampilkan:
- Bank: **BCA** · No. Rekening: **4061207427** · Atas Nama: **Nur Fatchurohman**

### 4. Form fields (validasi client-side)
1. Nama — text, required
2. Email — email, required, validasi format regex
3. Nomor HP — tel, required
4. Usia — number, required, min 10
5. Pilihan Coffee — `<select>` dari response `GET /events/{eventSlug}` (`coffee_options`)
6. Bukti Pembayaran — `<input type="file">`, required, validasi format (jpeg/png/webp) & ukuran (maks 5 MB), dikirim ke backend

### 5. Submit + Popup notifikasi
- Submit: validasi semua field → `POST /events/{eventSlug}/registrations` (`multipart/form-data`) → tampilkan modal sukses dari response API.
- Isi popup:
  - Konfirmasi pendaftaran berhasil
  - Tiket dikirimkan **H-1 sebelum acara**
  - Nomor tiket digunakan untuk **undian doorprize**
- Popup ditutup manual: tombol "Tutup" / icon X / klik backdrop. Tidak auto-dismiss.

### 6. Update tombol "Count me in"
`components/Events.tsx:142` — `href="#contact"` → `href="/event/40-of-heart-rate-run"`

## Files Modified

| File | Aksi |
|------|------|
| `app/event/40-of-heart-rate-run/page.tsx` | **Baru** — halaman + form + modal |
| `components/Events.tsx` | **Edit** baris 142: href ke route baru |

## Verification

1. Landing page → klik "Count me in" → navigasi ke `/event/40-of-heart-rate-run`.
2. Halaman menampilkan detail acara, info rekening BCA, 6 field form.
3. Submit form kosong → pesan validasi muncul, popup tidak muncul.
4. Isi semua field + pilih file → submit → popup muncul dengan pesan tiket H-1 & doorprize.
5. Tutup popup → popup hilang, halaman tetap.
6. `npm run lint` & `npm run build` lolos.
