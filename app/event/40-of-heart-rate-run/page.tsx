"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  createRegistration,
  EventApiError,
  type EventData,
  getEvent,
  type RegistrationResponse,
} from "@/lib/eventApi";

const EVENT_SLUG = "40-of-heart-rate-run";
const PHONE_REGEX = /^(\+62|0)8[0-9]{8,11}$/;
const MAX_PROOF_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

interface FormState {
  name: string;
  email: string;
  phone: string;
  age: string;
  coffee_choice: string;
  payment_proof: File | null;
}

type Errors = Partial<Record<keyof FormState, string>>;

const emptyForm: FormState = {
  name: "",
  email: "",
  phone: "",
  age: "",
  coffee_choice: "",
  payment_proof: null,
};

const fallbackEvent: EventData = {
  slug: EVENT_SLUG,
  title: "40% OF HEART RATE RUN - VOL.2",
  date: "2026-05-24",
  time: "06:00",
  timezone: "Asia/Jakarta",
  location: "Melkkops Coffee & Eatry",
  distance_km: 5,
  pace: "Every pace welcome",
  registration_open: true,
  coffee_options: ["Melkkops Signature (Coffee)", "Lychee Tea (Non-Coffee)"],
  payment: {
    bank: "BCA",
    account_number: "4061207427",
    account_name: "Nur Fatchurohman",
  },
};

function formatDateToIndonesian(dateIso: string): string {
  const date = new Date(dateIso);
  if (Number.isNaN(date.getTime())) return dateIso;
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

function validate(form: FormState): Errors {
  const errors: Errors = {};
  if (!form.name.trim()) errors.name = "Nama wajib diisi.";
  if (!form.email.trim()) {
    errors.email = "Email wajib diisi.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = "Format email tidak valid.";
  }
  if (!form.phone.trim()) {
    errors.phone = "Nomor HP wajib diisi.";
  } else if (!PHONE_REGEX.test(form.phone.trim())) {
    errors.phone = "Format nomor HP tidak valid.";
  }
  if (!form.age.trim()) {
    errors.age = "Usia wajib diisi.";
  } else if (!Number.isInteger(Number(form.age)) || Number(form.age) < 10) {
    errors.age = "Usia minimum 10 tahun.";
  }
  if (!form.coffee_choice) errors.coffee_choice = "Silakan pilih kopi.";

  if (!form.payment_proof) {
    errors.payment_proof = "Bukti pembayaran wajib diunggah.";
  } else {
    if (!ALLOWED_IMAGE_TYPES.includes(form.payment_proof.type)) {
      errors.payment_proof = "Format file harus jpeg/png/webp.";
    } else if (form.payment_proof.size > MAX_PROOF_SIZE) {
      errors.payment_proof = "Ukuran file maksimal 5 MB.";
    }
  }
  return errors;
}

export default function EventRegisterPage() {
  const router = useRouter();
  const [event, setEvent] = useState<EventData>(fallbackEvent);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [loadingEvent, setLoadingEvent] = useState(true);
  const [pageError, setPageError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [successData, setSuccessData] = useState<RegistrationResponse | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      setLoadingEvent(true);
      setPageError("");
      try {
        const res = await getEvent(EVENT_SLUG);
        if (!cancelled) setEvent(res.data);
      } catch (err) {
        if (cancelled) return;
        setPageError(
          err instanceof Error ? err.message : "Gagal memuat detail event."
        );
      } finally {
        if (!cancelled) setLoadingEvent(false);
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, []);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  const eventDateText = useMemo(() => formatDateToIndonesian(event.date), [event.date]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitError("");
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setSubmitting(true);
    try {
      const res = await createRegistration(EVENT_SLUG, {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        age: Number(form.age),
        coffee_choice: form.coffee_choice,
        payment_proof: form.payment_proof!,
      });
      setSuccessData(res);
      setForm(emptyForm);
      setErrors({});
    } catch (err) {
      if (err instanceof EventApiError) {
        if (err.code === "VALIDATION_ERROR" && err.details) {
          const apiErrors: Errors = {};
          for (const detail of err.details) {
            if (detail.field in emptyForm) {
              apiErrors[detail.field as keyof FormState] = detail.message;
            }
          }
          if (Object.keys(apiErrors).length > 0) setErrors(apiErrors);
        }
        setSubmitError(err.message);
      } else {
        setSubmitError("Gagal mengirim pendaftaran. Silakan coba lagi.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  const fieldClass =
    "w-full rounded-2xl border-2 border-ink/15 bg-cream px-4 py-3 text-ink outline-none transition focus:border-orange";
  const labelClass = "block text-sm font-bold text-ink mb-2";
  const errClass = "mt-1 text-xs text-ember";

  return (
    <main className="min-h-screen bg-sand/40">
      <div className="mx-auto max-w-2xl px-5 md:px-8 py-16 md:py-24">
        <Link href="/#events" className="mono text-xs text-ink/60 hover:text-orange">
          ← Kembali
        </Link>

        <header className="mt-6">
          <span className="mono text-xs text-orange">Pendaftaran Peserta</span>
          <h1 className="display text-4xl md:text-6xl mt-3">{event.title}</h1>
        </header>

        {pageError && (
          <div className="mt-6 rounded-3xl bg-ember/10 border border-ember/30 text-ember px-6 py-4 text-sm">
            {pageError}
          </div>
        )}

        <div className="mt-6 grid grid-cols-2 gap-4 rounded-3xl bg-ink text-cream p-6">
          <div>
            <div className="mono text-[10px] text-cream/50">Hari &amp; Tanggal</div>
            <div className="font-semibold">{loadingEvent ? "Memuat..." : eventDateText}</div>
          </div>
          <div>
            <div className="mono text-[10px] text-cream/50">Waktu</div>
            <div className="font-semibold">{event.time} WIB</div>
          </div>
          <div>
            <div className="mono text-[10px] text-cream/50">Lokasi</div>
            <div className="font-semibold">{event.location}</div>
          </div>
          <div>
            <div className="mono text-[10px] text-cream/50">Distance</div>
            <div className="font-semibold">
              {event.distance_km} km · {event.pace}
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-3xl border-2 border-orange/40 bg-orange/10 p-6">
          <div className="mono text-xs text-orange mb-3">Instruksi Pembayaran</div>
          <p className="text-sm text-ink/70 mb-4">
            Silakan transfer biaya pendaftaran ke rekening berikut, lalu unggah
            bukti pembayaran pada form di bawah. Email konfirmasi akan dikirim
            ke alamat emailmu setelah pembayaran diverifikasi oleh admin.
          </p>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-ink/60 text-sm">HTM</span>
              <span className="font-bold">Rp 20.000</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink/60 text-sm">Bank</span>
              <span className="font-bold">{event.payment.bank}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink/60 text-sm">No. Rekening</span>
              <span className="font-bold tracking-wider">{event.payment.account_number}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink/60 text-sm">Atas Nama</span>
              <span className="font-bold">{event.payment.account_name}</span>
            </div>
          </div>
        </div>

        {!event.registration_open ? (
          <div className="mt-8 rounded-3xl bg-ink text-cream px-6 py-5 text-sm">
            Pendaftaran event saat ini ditutup.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
            <div className="rounded-2xl border-2 border-ink/10 bg-sand/60 px-4 py-3 text-sm text-ink/70 leading-relaxed">
              Pastikan kamu mengisi <span className="font-semibold text-ink">alamat email yang valid</span> — tiket event akan dikirimkan ke email tersebut setelah pembayaran dikonfirmasi oleh admin.
            </div>

            {submitError && (
              <div className="rounded-2xl bg-ember/10 border border-ember/30 text-ember px-4 py-3 text-sm">
                {submitError}
              </div>
            )}

            <div>
              <label className={labelClass} htmlFor="name">
                Nama
              </label>
              <input
                id="name"
                type="text"
                className={fieldClass}
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
              />
              {errors.name && <p className={errClass}>{errors.name}</p>}
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
              <label className={labelClass} htmlFor="phone">
                Nomor HP
              </label>
              <input
                id="phone"
                type="tel"
                className={fieldClass}
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
              />
              {errors.phone && <p className={errClass}>{errors.phone}</p>}
            </div>

            <div>
              <label className={labelClass} htmlFor="age">
                Usia
              </label>
              <input
                id="age"
                type="number"
                min={10}
                className={fieldClass}
                value={form.age}
                onChange={(e) => update("age", e.target.value)}
              />
              {errors.age && <p className={errClass}>{errors.age}</p>}
            </div>

            <div>
              <label className={labelClass} htmlFor="coffee_choice">
                Pilihan Minuman (Gratis)
              </label>
              <select
                id="coffee_choice"
                className={fieldClass}
                value={form.coffee_choice}
                onChange={(e) => update("coffee_choice", e.target.value)}
              >
                <option value="">— Pilih kopi —</option>
                {event.coffee_options.map((coffee) => (
                  <option key={coffee} value={coffee}>
                    {coffee}
                  </option>
                ))}
              </select>
              {errors.coffee_choice && <p className={errClass}>{errors.coffee_choice}</p>}
            </div>

            <div>
              <label className={labelClass} htmlFor="payment_proof">
                Bukti Pembayaran
              </label>
              <input
                id="payment_proof"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className={`${fieldClass} file:mr-4 file:rounded-full file:border-0 file:bg-ink file:px-4 file:py-2 file:text-cream file:font-bold`}
                onChange={(e) => update("payment_proof", e.target.files?.[0] ?? null)}
              />
              {form.payment_proof && (
                <p className="mt-1 text-xs text-ink/60">{form.payment_proof.name}</p>
              )}
              {errors.payment_proof && <p className={errClass}>{errors.payment_proof}</p>}
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
        )}
      </div>

      {successData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 px-5">
          <div className="relative w-full max-w-md rounded-3xl bg-cream p-8">
            <div className="text-4xl">🎉</div>
            <h2 className="display text-3xl mt-4">Pendaftaran Berhasil!</h2>
            <p className="mt-4 text-ink/75 leading-relaxed">
              {successData.meta?.message ?? "Terima kasih sudah mendaftar!"}
            </p>
            {successData.data.ticket_number && (
              <p className="mt-3 text-ink/80">
                Nomor tiket kamu:{" "}
                <span className="font-bold tracking-wide">{successData.data.ticket_number}</span>
              </p>
            )}
            <button
              type="button"
              className="btn btn-primary w-full justify-center mt-6"
              onClick={() => router.push("/")}
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
