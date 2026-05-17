"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const TOKEN_KEY = "acr_admin_token";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  sessionStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  sessionStorage.removeItem(TOKEN_KEY);
}

export function useAdminGuard(): void {
  const router = useRouter();
  useEffect(() => {
    if (!getToken()) {
      router.replace("/admin-acr-2026");
    }
  }, [router]);
}
