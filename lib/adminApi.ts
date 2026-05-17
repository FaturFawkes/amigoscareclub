import { clearToken, getToken } from "./adminAuth";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://api.amigoscare.club/v1";

export type RegistrationStatus =
  | "pending_verification"
  | "verified"
  | "rejected"
  | "ticket_sent";

export interface Registration {
  id: string;
  ticket_number: string;
  event_slug: string;
  name: string;
  email: string;
  phone: string;
  age: number;
  coffee_choice: string;
  status: RegistrationStatus;
  payment_proof_url: string | null;
  registered_at: string;
  verified_at: string | null;
  ticket_sent_at: string | null;
}

export interface AdminProfile {
  id: string;
  name: string;
  email: string;
}

export interface LoginResponse {
  data: {
    token: string;
    expires_at: string;
    admin: AdminProfile;
  };
}

export interface ListRegistrationsParams {
  status?: RegistrationStatus | "all";
  page?: number;
  per_page?: number;
}

export interface ListRegistrationsResponse {
  data: Registration[];
  meta: {
    total: number;
    page: number;
    per_page: number;
    total_pages: number;
  };
}

interface ApiError {
  code: string;
  message: string;
}

class AdminApiError extends Error {
  code: string;
  status: number;
  constructor(status: number, error: ApiError) {
    super(error.message);
    this.code = error.code;
    this.status = status;
  }
}

async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  requiresAuth = true
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (requiresAuth) {
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (res.status === 401) {
    clearToken();
    if (typeof window !== "undefined") {
      window.location.replace("/admin-acr-2026");
    }
    throw new AdminApiError(401, { code: "UNAUTHORIZED", message: "Sesi habis, silakan login kembali." });
  }

  const json = await res.json().catch(() => null);

  if (!res.ok) {
    const err = json?.error ?? { code: "UNKNOWN_ERROR", message: "Terjadi kesalahan." };
    throw new AdminApiError(res.status, err);
  }

  return json as T;
}

export async function adminLogin(
  email: string,
  password: string
): Promise<LoginResponse> {
  return apiFetch<LoginResponse>(
    "/admin/auth/login",
    { method: "POST", body: JSON.stringify({ email, password }) },
    false
  );
}

export async function getAdminMe(): Promise<{ data: AdminProfile }> {
  return apiFetch<{ data: AdminProfile }>("/admin/auth/me");
}

export async function adminLogout(): Promise<void> {
  await apiFetch<void>("/admin/auth/logout", { method: "POST" }).catch(() => {});
}

export async function listRegistrations(
  eventSlug: string,
  params: ListRegistrationsParams = {}
): Promise<ListRegistrationsResponse> {
  const query = new URLSearchParams();
  if (params.status && params.status !== "all") query.set("status", params.status);
  if (params.page) query.set("page", String(params.page));
  if (params.per_page) query.set("per_page", String(params.per_page));
  const qs = query.toString();
  return apiFetch<ListRegistrationsResponse>(
    `/admin/events/${eventSlug}/registrations${qs ? `?${qs}` : ""}`
  );
}

export async function verifyRegistration(
  eventSlug: string,
  registrationId: string,
  status: "verified" | "rejected",
  note?: string
): Promise<{ data: Registration }> {
  return apiFetch<{ data: Registration }>(
    `/admin/events/${eventSlug}/registrations/${registrationId}/verify`,
    { method: "PATCH", body: JSON.stringify({ status, note }) }
  );
}

export { AdminApiError };
