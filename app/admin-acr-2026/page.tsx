"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { adminLogin } from "@/lib/adminApi";
import { setToken } from "@/lib/adminAuth";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (!email.trim() || !password.trim()) {
      setError("Email dan password wajib diisi.");
      return;
    }
    setLoading(true);
    try {
      const res = await adminLogin(email, password);
      setToken(res.data.token);
      router.replace("/admin-acr-2026/dashboard");
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Terjadi kesalahan. Coba lagi."
      );
    } finally {
      setLoading(false);
    }
  }

  const fieldClass =
    "w-full rounded-2xl border-2 border-ink/15 bg-white px-4 py-3 text-ink outline-none transition focus:border-orange";
  const labelClass = "block text-sm font-bold text-ink mb-2";

  return (
    <main className="min-h-screen bg-sand/40 flex items-center justify-center px-5">
      <div className="w-full max-w-md">
        <div className="bg-cream rounded-3xl p-8 md:p-10 border-2 border-ink/10">
          <span className="mono text-xs text-orange">Admin</span>
          <h1 className="display text-3xl mt-2">Amigos Care Club</h1>
          <p className="text-sm text-ink/60 mt-1">Event Registration Panel</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
            <div>
              <label className={labelClass} htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                className={fieldClass}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className={labelClass} htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                className={fieldClass}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && (
              <p className="text-sm text-ember bg-ember/10 rounded-2xl px-4 py-3">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="btn btn-primary w-full justify-center"
              disabled={loading}
            >
              {loading ? "Memproses..." : "Masuk"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
