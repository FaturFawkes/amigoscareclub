"use client";

import Link from "next/link";
import { useState, FormEvent } from "react";

// Mock list — daftar pilihan kopi gratis. List real akan menyusul.
const COFFEE_OPTIONS = [
  "Americano",
  "Cappuccino",
  "Latte",
  "Es Kopi Susu",
  "Espresso",
];

interface FormState {
  nama: string;
  email: string;
  hp: string;
  usia: string;
  coffee: string;
  bukti: File | null;
}

type Errors = Partial<Record<keyof FormState, string>>;

const emptyForm: FormState = {
  nama: "",
  email: "",
  hp: "",
  usia: "",
  coffee: "",
  bukti: null,
};

// Submit di-mock dulu. Nanti ganti dengan fetch ke API route.
async function submitRegistration(data: FormState): Promise<{ ok: boolean }> {
  // TODO: kirim `data` ke API route saat backend siap.
  void data;
  await new Promise((r) => setTimeout(r, 600));
  return { ok: true };
}

function validate(form: FormState): Errors {
  const errors: Errors = {};
  if (!form.nama.trim()) errors.nama = "Nama wajib diisi.";
  if (!form.email.trim()) {
    errors.email = "Email wajib diisi.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = "Format email tidak valid.";
  }
  if (!form.hp.trim()) errors.hp = "Nomor HP wajib diisi.";
  if (!form.usia.trim()) {
    errors.usia = "Usia wajib diisi.";
  } else if (Number(form.usia) < 1) {
    errors.usia = "Usia tidak valid.";
  }
  if (!form.coffee) errors.coffee = "Silakan pilih kopi.";
  if (!form.bukti) errors.bukti = "Bukti pembayaran wajib diunggah.";
  return errors;
}

export default function EventRegisterPage() {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setSubmitting(true);
    const res = await submitRegistration(form);
    setSubmitting(false);
    if (res.ok) setShowModal(true);
  }

  const fieldClass =
    "w-full rounded-2xl border-2 border-ink/15 bg-cream px-4 py-3 text-ink outline-none transition focus:border-orange";
  const labelClass = "block text-sm font-bold text-ink mb-2";
  const errClass = "mt-1 text-xs text-ember";

  return (
    <main className="min-h-screen bg-sand/40">
      <div className="mx-auto max-w-2xl px-5 md:px-8 py-16 md:py-24">
        <Link
          href="/#events"
          className="mono text-xs text-ink/60 hover:text-orange"
        >
          ← Kembali
        </Link>

        {/* Header event */}
        <header className="mt-6">
          <span className="mono text-xs text-orange">
            Pendaftaran Peserta
          </span>
          <h1 className="display text-4xl md:text-6xl mt-3">
            40% OF HEART RATE RUN - VOL.2
          </h1>
        </header>

        {/* Detail acara */}
        <div className="mt-6 grid grid-cols-2 gap-4 rounded-3xl bg-ink text-cream p-6">
          <div>
            <div className="mono text-[10px] text-cream/50">Hari &amp; Tanggal</div>
            <div className="font-semibold">Minggu, 24 Mei 2026</div>
          </div>
          <div>
            <div className="mono text-[10px] text-cream/50">Waktu</div>
            <div className="font-semibold">06.00 WIB</div>
          </div>
          <div>
            <div className="mono text-[10px] text-cream/50">Lokasi</div>
            <div className="font-semibold">Melkkops Coffee &amp; Eatry</div>
          </div>
          <div>
            <div className="mono text-[10px] text-cream/50">Distance</div>
            <div className="font-semibold">5 km · Every pace welcome</div>
          </div>
        </div>

        {/* Info pembayaran */}
        <div className="mt-6 rounded-3xl border-2 border-orange/40 bg-orange/10 p-6">
          <div className="mono text-xs text-orange mb-3">
            Instruksi Pembayaran
          </div>
          <p className="text-sm text-ink/70 mb-4">
            Silakan transfer biaya pendaftaran ke rekening berikut, lalu unggah
            bukti pembayaran pada form di bawah.
          </p>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-ink/60 text-sm">Bank</span>
              <span className="font-bold">BCA</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink/60 text-sm">No. Rekening</span>
              <span className="font-bold tracking-wider">4061207427</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink/60 text-sm">Atas Nama</span>
              <span className="font-bold">Nur Fatchurohman</span>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
          <div>
            <label className={labelClass} htmlFor="nama">
              Nama
            </label>
            <input
              id="nama"
              type="text"
              className={fieldClass}
              value={form.nama}
              onChange={(e) => update("nama", e.target.value)}
            />
            {errors.nama && <p className={errClass}>{errors.nama}</p>}
          </div>

          <div>
            <label className={labelClass} htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              className={fieldClass}
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
            />
            {errors.email && <p className={errClass}>{errors.email}</p>}
          </div>

          <div>
            <label className={labelClass} htmlFor="hp">
              Nomor HP
            </label>
            <input
              id="hp"
              type="tel"
              className={fieldClass}
              value={form.hp}
              onChange={(e) => update("hp", e.target.value)}
            />
            {errors.hp && <p className={errClass}>{errors.hp}</p>}
          </div>

          <div>
            <label className={labelClass} htmlFor="usia">
              Usia
            </label>
            <input
              id="usia"
              type="number"
              min={1}
              className={fieldClass}
              value={form.usia}
              onChange={(e) => update("usia", e.target.value)}
            />
            {errors.usia && <p className={errClass}>{errors.usia}</p>}
          </div>

          <div>
            <label className={labelClass} htmlFor="coffee">
              Pilihan Coffee (Gratis)
            </label>
            <select
              id="coffee"
              className={fieldClass}
              value={form.coffee}
              onChange={(e) => update("coffee", e.target.value)}
            >
              <option value="">— Pilih kopi —</option>
              {COFFEE_OPTIONS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            {errors.coffee && <p className={errClass}>{errors.coffee}</p>}
          </div>

          <div>
            <label className={labelClass} htmlFor="bukti">
              Bukti Pembayaran
            </label>
            <input
              id="bukti"
              type="file"
              accept="image/*"
              className={`${fieldClass} file:mr-4 file:rounded-full file:border-0 file:bg-ink file:px-4 file:py-2 file:text-cream file:font-bold`}
              onChange={(e) => update("bukti", e.target.files?.[0] ?? null)}
            />
            {form.bukti && (
              <p className="mt-1 text-xs text-ink/60">{form.bukti.name}</p>
            )}
            {errors.bukti && <p className={errClass}>{errors.bukti}</p>}
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full justify-center"
            disabled={submitting}
          >
            {submitting ? "Memproses..." : "Daftar Sekarang"}
            {!submitting && <span className="btn-arrow">→</span>}
          </button>
        </form>
      </div>

      {/* Popup notifikasi */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 px-5"
          onClick={() => setShowModal(false)}
        >
          <div
            className="relative w-full max-w-md rounded-3xl bg-cream p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Tutup"
              className="absolute right-5 top-5 text-2xl leading-none text-ink/50 hover:text-ink"
              onClick={() => setShowModal(false)}
            >
              ×
            </button>
            <div className="text-4xl">🎉</div>
            <h2 className="display text-3xl mt-4">Pendaftaran Berhasil!</h2>
            <p className="mt-4 text-ink/75 leading-relaxed">
              Terima kasih sudah mendaftar. Tiket kamu akan{" "}
              <strong>dikirimkan H-1 sebelum acara</strong>.
            </p>
            <p className="mt-3 text-ink/75 leading-relaxed">
              Simpan baik-baik nomor tiketmu — nomor tersebut akan{" "}
              <strong>digunakan untuk undian doorprize</strong> saat acara
              berlangsung.
            </p>
            <button
              type="button"
              className="btn btn-primary w-full justify-center mt-6"
              onClick={() => setShowModal(false)}
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
