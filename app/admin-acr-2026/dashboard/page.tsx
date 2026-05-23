"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AdminApiError,
  listRegistrations,
  verifyRegistration,
  resendTicket,
  resendAllTickets,
  adminLogout,
  type Registration,
  type RegistrationStatus,
  type ListRegistrationsParams,
} from "@/lib/adminApi";
import { clearToken, useAdminGuard } from "@/lib/adminAuth";

const EVENT_SLUG = "steady-and-slow";
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

interface ProofModalState {
  open: boolean;
  url: string;
  registrantName: string;
}

function toProofProxyUrl(sourceUrl: string) {
  return `/api/admin/proof?url=${encodeURIComponent(sourceUrl)}`;
}

const MONTHS = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"];

function fmtDateTime(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(d.getDate())} ${MONTHS[d.getMonth()]} ${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
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
  const [resendAllLoading, setResendAllLoading] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [rejectModal, setRejectModal] = useState<RejectModalState>({
    open: false,
    registrationId: "",
    note: "",
  });
  const [proofModal, setProofModal] = useState<ProofModalState>({
    open: false,
    url: "",
    registrantName: "",
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
      const res = await verifyRegistration(EVENT_SLUG, id, "verified");
      await fetchData();
      setSuccessToast(`Email konfirmasi telah dikirim ke ${res.data.email}`);
      setTimeout(() => setSuccessToast(null), 4000);
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

  async function handleResendTicket(id: string, email: string) {
    setActionLoading(id);
    try {
      await resendTicket(EVENT_SLUG, id);
      setSuccessToast(`Tiket berhasil dikirim ulang ke ${email}`);
      setTimeout(() => setSuccessToast(null), 4000);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Gagal mengirim ulang tiket.");
    } finally {
      setActionLoading(null);
    }
  }

  async function handleResendAll() {
    if (!confirm("Kirim ulang tiket ke semua peserta yang sudah terverifikasi?")) return;
    setResendAllLoading(true);
    try {
      const res = await resendAllTickets(EVENT_SLUG);
      setSuccessToast(`Tiket berhasil dikirim ulang ke ${res.data.sent} peserta.`);
      setTimeout(() => setSuccessToast(null), 4000);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Gagal mengirim ulang semua tiket.");
    } finally {
      setResendAllLoading(false);
    }
  }

  function handleExportCSV() {
    const headers = ["No", "No. Tiket", "Nama", "Email", "No. HP", "Usia", "Kopi", "Status", "Note", "Waktu Daftar", "Waktu Verifikasi"];
    const rows = registrations.map((r, i) => [
      (page - 1) * PER_PAGE + i + 1,
      r.ticket_number,
      r.name,
      r.email,
      r.phone,
      r.age,
      r.coffee_choice,
      STATUS_LABELS[r.status],
      r.note ?? "",
      fmtDateTime(r.registered_at),
      fmtDateTime(r.verified_at),
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `registrasi-40ohhr-${statusFilter}-halaman${page}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleLogout() {
    await adminLogout();
    clearToken();
    router.replace("/admin-acr-2026");
  }

  return (
    <main className="h-screen overflow-hidden flex flex-col bg-sand/40">
      {/* Header */}
      <div className="bg-ink text-cream px-5 md:px-8 py-4 flex items-center justify-between shrink-0">
        <div>
          <span className="mono text-xs text-lime">Admin Panel</span>
          <h1 className="display text-2xl mt-0.5">Event Registrations</h1>
          <p className="mono text-[11px] text-cream/50 mt-0.5">
            Steady and Slow (Soft Opening Run by Melkkops x Amigos)
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

      <div className="flex-1 overflow-hidden flex flex-col px-5 md:px-8 py-5">
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
          <button
            type="button"
            onClick={handleExportCSV}
            disabled={registrations.length === 0}
            className="mono text-[11px] font-bold border-2 border-ink/20 px-3 py-1.5 rounded-full hover:bg-ink hover:text-cream transition disabled:opacity-40"
          >
            Export CSV
          </button>
          <button
            type="button"
            onClick={handleResendAll}
            disabled={resendAllLoading}
            className="mono text-[11px] font-bold border-2 border-orange/40 text-orange px-3 py-1.5 rounded-full hover:bg-orange hover:text-cream transition disabled:opacity-40"
          >
            {resendAllLoading ? "Mengirim..." : "Resend All Tiket"}
          </button>
        </div>

        {/* Success Toast */}
        {successToast && (
          <div className="rounded-3xl bg-lime border border-lime/60 text-ink px-6 py-4 mb-6 text-sm font-semibold flex items-center gap-2">
            <span>✓</span>
            <span>{successToast}</span>
          </div>
        )}

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
        <div className="flex-1 overflow-hidden rounded-3xl border-2 border-ink/10 bg-cream">
        <div className="overflow-x-auto overflow-y-auto h-full">
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
                    "No",
                    "No. Tiket",
                    "Nama",
                    "Email",
                    "No. HP",
                    "Usia",
                    "Kopi",
                    "Bukti",
                    "Status",
                    "Note",
                    "Daftar",
                    "Verifikasi",
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
                {registrations.map((r, i) => (
                  <tr
                    key={r.id}
                    className="border-b border-ink/5 hover:bg-sand/40 transition-colors"
                  >
                    <td className="px-4 py-3 mono text-[10px] text-ink/40 text-center whitespace-nowrap">
                      {(page - 1) * PER_PAGE + i + 1}
                    </td>
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
                         <button
                           type="button"
                           onClick={() =>
                             setProofModal({
                               open: true,
                               url: toProofProxyUrl(r.payment_proof_url!),
                               registrantName: r.name,
                             })
                           }
                           className="mono text-[10px] text-orange underline"
                         >
                           Lihat
                         </button>
                       ) : (
                         <span className="mono text-[10px] text-ink/30">—</span>
                       )}
                     </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <StatusBadge status={r.status} />
                    </td>
                    <td className="px-4 py-3 max-w-[180px]">
                      {r.status === "rejected" && r.note ? (
                        <span className="mono text-[10px] text-ember/80 break-words">{r.note}</span>
                      ) : (
                        <span className="mono text-[10px] text-ink/30">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 mono text-[10px] text-ink/50 whitespace-nowrap">
                      {fmtDateTime(r.registered_at)}
                    </td>
                    <td className="px-4 py-3 mono text-[10px] text-ink/50 whitespace-nowrap">
                      {r.verified_at
                        ? fmtDateTime(r.verified_at)
                        : <span className="text-ink/30">—</span>}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex gap-2">
                        {r.status === "pending_verification" && (
                          <>
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
                          </>
                        )}
                        {(r.status === "verified" || r.status === "ticket_sent") && (
                          <button
                            type="button"
                            disabled={actionLoading === r.id}
                            onClick={() => handleResendTicket(r.id, r.email)}
                            className="mono text-[10px] font-bold border-2 border-orange/40 text-orange px-3 py-1.5 rounded-full hover:bg-orange hover:text-cream transition disabled:opacity-50"
                          >
                            {actionLoading === r.id ? "..." : "Kirim Ulang"}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        </div>

        {/* Pagination */}
        {meta.total_pages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-4 shrink-0">
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

      {/* Proof Preview Modal */}
      {proofModal.open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/70 px-5"
          onClick={() => setProofModal((s) => ({ ...s, open: false }))}
        >
          <div
            className="w-full max-w-3xl bg-cream rounded-3xl p-4 md:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h2 className="display text-2xl">Bukti Pembayaran</h2>
                <p className="text-sm text-ink/60 mt-1">{proofModal.registrantName}</p>
              </div>
              <button
                type="button"
                className="mono text-xs text-ink/50 hover:text-ink"
                onClick={() => setProofModal((s) => ({ ...s, open: false }))}
              >
                Tutup
              </button>
            </div>
            <div className="rounded-2xl border-2 border-ink/10 bg-white overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={proofModal.url}
                alt={`Bukti pembayaran ${proofModal.registrantName}`}
                className="block w-full h-auto max-h-[70vh] object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
