"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  createRegistration,
  EventApiError,
  type EventData,
  getEvent,
  type RegistrationResponse,
} from "@/lib/eventApi";

const EVENT_SLUG = "steady-and-slow";
const PHONE_REGEX = /^(\+62|0)8[0-9]{8,11}$/;

interface FormState {
  name: string;
  email: string;
  phone: string;
  age: string;
}

type Errors = Partial<Record<keyof FormState, string>>;

const emptyForm: FormState = {
  name: "",
  email: "",
  phone: "",
  age: "",
};

const fallbackEvent: EventData = {
  slug: EVENT_SLUG,
  title: "Steady and Slow (Soft Opening Run by Melkkops x Amigos)",
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

  async function handleSubmit(e: { preventDefault: () => void }) {
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
          <div className="mono text-xs text-orange mb-3">Informasi Event</div>
          <p className="text-sm text-ink/70 mb-4">
            Event ini <span className="font-semibold text-ink">gratis</span>! Kamu akan mendapatkan benefit berikut:
          </p>
          <div className="space-y-2">
            <div className="flex items-start gap-3">
              <span className="text-orange font-bold mt-0.5">→</span>
              <div>
                <div className="font-semibold text-sm text-ink">Free Refreshment</div>
                <div className="text-xs text-ink/60">Air mineral &amp; buah</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-orange font-bold mt-0.5">→</span>
              <div>
                <div className="font-semibold text-sm text-ink">Doorprize</div>
                <div className="text-xs text-ink/60">Nomor tiket registrasimu adalah nomor doorprize — pastikan kamu tetap registrasi!</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-orange font-bold mt-0.5">→</span>
              <div>
                <div className="font-semibold text-sm text-ink">Promo Coffee</div>
                <div className="text-xs text-ink/60">Buy 1 Get 1 Free untuk pilihan menu tertentu di Melkkops khusus peserta event.</div>
              </div>
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
              Pastikan kamu mengisi <span className="font-semibold text-ink">alamat email yang valid</span> — nomor tiket akan dikirimkan ke email tersebut dan digunakan untuk pembagian doorprize.
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
            {successData.data.id && (
              <p className="mt-3 text-ink/80">
                No. Registrasi:{" "}
                <span className="font-bold tracking-wide mono">{successData.data.id}</span>
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
