"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AdminApiError,
  listRegistrations,
  verifyRegistration,
  adminLogout,
  type Registration,
  type RegistrationStatus,
  type ListRegistrationsParams,
} from "@/lib/adminApi";
import { clearToken, useAdminGuard } from "@/lib/adminAuth";

const EVENT_SLUG = "40-of-heart-rate-run";
const PER_PAGE = 20;

const STATUS_LABELS: Record<RegistrationStatus | "all", string> = {
  all: "Semua",
  pending_verification: "Menunggu Verifikasi",
  verified: "Terverifikasi",
  rejected: "Ditolak",
  ticket_sent: "Tiket Terkirim",
};

const STATUS_BADGE: Record<RegistrationStatus, string> = {
  pending_verification: "bg-sand text-ink border border-ink/20",
  verified: "bg-lime text-ink",
  rejected: "bg-ember/15 text-ember",
  ticket_sent: "bg-ink text-cream",
};

function StatusBadge({ status }: { status: RegistrationStatus }) {
  return (
    <span
      className={`mono text-[10px] px-2 py-1 rounded-full font-bold ${STATUS_BADGE[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}

interface RejectModalState {
  open: boolean;
  registrationId: string;
  note: string;
}

export default function AdminDashboardPage() {
  useAdminGuard();

  const router = useRouter();
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, per_page: PER_PAGE, total_pages: 1 });
  const [statusFilter, setStatusFilter] = useState<RegistrationStatus | "all">("all");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [rejectModal, setRejectModal] = useState<RejectModalState>({
    open: false,
    registrationId: "",
    note: "",
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params: ListRegistrationsParams = { page, per_page: PER_PAGE };
      if (statusFilter !== "all") params.status = statusFilter;
      const res = await listRegistrations(EVENT_SLUG, params);
      setRegistrations(res.data);
      setMeta(res.meta);
    } catch (err) {
      if (err instanceof AdminApiError && err.status === 401) return;
      setError(err instanceof Error ? err.message : "Gagal memuat data.");
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      setLoading(true);
      setError("");
      try {
        const params: ListRegistrationsParams = { page, per_page: PER_PAGE };
        if (statusFilter !== "all") params.status = statusFilter;
        const res = await listRegistrations(EVENT_SLUG, params);
        if (!cancelled) {
          setRegistrations(res.data);
          setMeta(res.meta);
        }
      } catch (err) {
        if (cancelled) return;
        if (err instanceof AdminApiError && err.status === 401) return;
        setError(err instanceof Error ? err.message : "Gagal memuat data.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    run();
    return () => { cancelled = true; };
  }, [page, statusFilter]);

  async function handleVerify(id: string) {
    setActionLoading(id);
    try {
      await verifyRegistration(EVENT_SLUG, id, "verified");
      await fetchData();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Gagal memverifikasi.");
    } finally {
      setActionLoading(null);
    }
  }

  async function handleRejectSubmit() {
    const { registrationId, note } = rejectModal;
    setActionLoading(registrationId);
    setRejectModal((s) => ({ ...s, open: false }));
    try {
      await verifyRegistration(EVENT_SLUG, registrationId, "rejected", note || undefined);
      await fetchData();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Gagal menolak pembayaran.");
    } finally {
      setActionLoading(null);
    }
  }

  async function handleLogout() {
    await adminLogout();
    clearToken();
    router.replace("/admin-acr-2026");
  }

  return (
    <main className="min-h-screen bg-sand/40">
      {/* Header */}
      <div className="bg-ink text-cream px-5 md:px-8 py-5 flex items-center justify-between">
        <div>
          <span className="mono text-xs text-lime">Admin Panel</span>
          <h1 className="display text-2xl mt-1">Event Registrations</h1>
          <p className="mono text-[11px] text-cream/50 mt-0.5">
            40% OF HEART RATE RUN – VOL.2
          </p>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="btn btn-ghost border-cream/30 text-cream hover:bg-cream hover:text-ink text-sm"
        >
          Logout
        </button>
      </div>

      <div className="mx-auto max-w-7xl px-5 md:px-8 py-8">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <label className="mono text-xs text-ink/60">Filter:</label>
          <select
            className="rounded-2xl border-2 border-ink/15 bg-cream px-3 py-2 text-sm text-ink outline-none focus:border-orange"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as RegistrationStatus | "all");
              setPage(1);
            }}
          >
            {(Object.keys(STATUS_LABELS) as Array<RegistrationStatus | "all">).map(
              (s) => (
                <option key={s} value={s}>
                  {STATUS_LABELS[s]}
                </option>
              )
            )}
          </select>
          <span className="mono text-xs text-ink/50 ml-auto">
            Total: {meta.total} peserta
          </span>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-3xl bg-ember/10 border border-ember/30 text-ember px-6 py-4 mb-6 text-sm">
            {error}{" "}
            <button
              type="button"
              onClick={fetchData}
              className="underline ml-2"
            >
              Coba lagi
            </button>
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto rounded-3xl border-2 border-ink/10 bg-cream">
          {loading ? (
            <div className="py-20 text-center text-ink/50 mono text-sm">
              Memuat data...
            </div>
          ) : registrations.length === 0 ? (
            <div className="py-20 text-center text-ink/50 mono text-sm">
              Tidak ada data.
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-ink/10 text-left">
                  {[
                    "No. Tiket",
                    "Nama",
                    "Email",
                    "No. HP",
                    "Usia",
                    "Kopi",
                    "Bukti",
                    "Status",
                    "Daftar",
                    "Aksi",
                  ].map((h) => (
                    <th
                      key={h}
                      className="mono text-[10px] text-ink/50 font-bold px-4 py-3 whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {registrations.map((r) => (
                  <tr
                    key={r.id}
                    className="border-b border-ink/5 hover:bg-sand/40 transition-colors"
                  >
                    <td className="px-4 py-3 mono text-xs text-ink/60 whitespace-nowrap">
                      {r.ticket_number}
                    </td>
                    <td className="px-4 py-3 font-semibold whitespace-nowrap">
                      {r.name}
                    </td>
                    <td className="px-4 py-3 text-ink/70 whitespace-nowrap">
                      {r.email}
                    </td>
                    <td className="px-4 py-3 text-ink/70 whitespace-nowrap">
                      {r.phone}
                    </td>
                    <td className="px-4 py-3 text-center">{r.age}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{r.coffee_choice}</td>
                    <td className="px-4 py-3">
                      {r.payment_proof_url ? (
                        <a
                          href={r.payment_proof_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mono text-[10px] text-orange underline"
                        >
                          Lihat
                        </a>
                      ) : (
                        <span className="mono text-[10px] text-ink/30">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <StatusBadge status={r.status} />
                    </td>
                    <td className="px-4 py-3 mono text-[10px] text-ink/50 whitespace-nowrap">
                      {new Date(r.registered_at).toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {r.status === "pending_verification" && (
                        <div className="flex gap-2">
                          <button
                            type="button"
                            disabled={actionLoading === r.id}
                            onClick={() => handleVerify(r.id)}
                            className="mono text-[10px] font-bold bg-lime text-ink px-3 py-1.5 rounded-full hover:bg-lime/80 transition disabled:opacity-50"
                          >
                            {actionLoading === r.id ? "..." : "Verifikasi"}
                          </button>
                          <button
                            type="button"
                            disabled={actionLoading === r.id}
                            onClick={() =>
                              setRejectModal({ open: true, registrationId: r.id, note: "" })
                            }
                            className="mono text-[10px] font-bold bg-ember/15 text-ember px-3 py-1.5 rounded-full hover:bg-ember/25 transition disabled:opacity-50"
                          >
                            Tolak
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {meta.total_pages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-6">
            <button
              type="button"
              className="btn btn-ghost text-sm px-4 py-2 disabled:opacity-40"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              ← Sebelumnya
            </button>
            <span className="mono text-xs text-ink/60">
              {page} / {meta.total_pages}
            </span>
            <button
              type="button"
              className="btn btn-ghost text-sm px-4 py-2 disabled:opacity-40"
              disabled={page >= meta.total_pages}
              onClick={() => setPage((p) => p + 1)}
            >
              Berikutnya →
            </button>
          </div>
        )}
      </div>

      {/* Reject Modal */}
      {rejectModal.open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 px-5"
          onClick={() => setRejectModal((s) => ({ ...s, open: false }))}
        >
          <div
            className="w-full max-w-md bg-cream rounded-3xl p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="display text-2xl">Tolak Pembayaran</h2>
            <p className="text-sm text-ink/60 mt-2">
              Opsional: tambahkan catatan alasan penolakan untuk dikirim ke peserta.
            </p>
            <textarea
              className="mt-4 w-full rounded-2xl border-2 border-ink/15 bg-white px-4 py-3 text-ink text-sm outline-none focus:border-orange resize-none"
              rows={3}
              placeholder="Contoh: Bukti transfer tidak terbaca / nominal kurang."
              value={rejectModal.note}
              onChange={(e) =>
                setRejectModal((s) => ({ ...s, note: e.target.value }))
              }
            />
            <div className="flex gap-3 mt-5">
              <button
                type="button"
                className="btn btn-ghost flex-1 justify-center text-sm"
                onClick={() => setRejectModal((s) => ({ ...s, open: false }))}
              >
                Batal
              </button>
              <button
                type="button"
                className="btn flex-1 justify-center text-sm font-bold bg-ember text-cream hover:bg-ember/90"
                onClick={handleRejectSubmit}
              >
                Konfirmasi Tolak
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
