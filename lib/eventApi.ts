const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://api.amigoscare.club/v1";

interface ApiErrorDetail {
  field: string;
  message: string;
}

interface ApiErrorPayload {
  code: string;
  message: string;
  details?: ApiErrorDetail[];
}

export class EventApiError extends Error {
  status: number;
  code: string;
  details?: ApiErrorDetail[];

  constructor(status: number, error: ApiErrorPayload) {
    super(error.message);
    this.status = status;
    this.code = error.code;
    this.details = error.details;
  }
}

export interface EventData {
  slug: string;
  title: string;
  date: string;
  time: string;
  timezone: string;
  location: string;
  distance_km: number;
  pace: string;
  registration_open: boolean;
  coffee_options: string[];
  payment: {
    bank: string;
    account_number: string;
    account_name: string;
  };
}

export interface EventResponse {
  data: EventData;
}

export interface RegistrationPayload {
  name: string;
  email: string;
  phone: string;
  age: number;
  coffee_choice: string;
  payment_proof: File;
}

export interface RegistrationResponse {
  data: {
    id: string;
    ticket_number: string;
    event_slug: string;
    name: string;
    email: string;
    phone: string;
    age: number;
    coffee_choice: string;
    status: string;
    registered_at: string;
  };
  meta?: {
    message?: string;
  };
}

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      Accept: "application/json",
      ...(options.headers ?? {}),
    },
  });

  const json = await res.json().catch(() => null);

  if (!res.ok) {
    const err = json?.error ?? {
      code: "UNKNOWN_ERROR",
      message: "Terjadi kesalahan saat menghubungi server.",
    };
    throw new EventApiError(res.status, err);
  }

  return json as T;
}

export async function getEvent(eventSlug: string): Promise<EventResponse> {
  return apiFetch<EventResponse>(`/events/${eventSlug}`);
}

export async function createRegistration(
  eventSlug: string,
  payload: RegistrationPayload
): Promise<RegistrationResponse> {
  const body = new FormData();
  body.append("name", payload.name);
  body.append("email", payload.email);
  body.append("phone", payload.phone);
  body.append("age", String(payload.age));
  body.append("coffee_choice", payload.coffee_choice);
  body.append("payment_proof", payload.payment_proof);

  return apiFetch<RegistrationResponse>(`/events/${eventSlug}/registrations`, {
    method: "POST",
    body,
  });
}
