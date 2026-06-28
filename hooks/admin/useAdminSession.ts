"use client";

import { useEffect, useState } from "react";

type AdminSessionState = {
  loading: boolean;
  authenticated: boolean;
  session: { email: string; exp: number } | null;
};

export function useAdminSession() {
  const [state, setState] = useState<AdminSessionState>({
    loading: true,
    authenticated: false,
    session: null,
  });

  useEffect(() => {
    let mounted = true;

    async function run() {
      try {
        const res = await fetch("/api/admin/session", { cache: "no-store" });
        const payload = await res.json();
        if (!mounted) return;

        if (res.ok && payload?.ok) {
          setState({ loading: false, authenticated: true, session: payload.session ?? null });
          return;
        }

        setState({ loading: false, authenticated: false, session: null });
      } catch {
        if (!mounted) return;
        setState({ loading: false, authenticated: false, session: null });
      }
    }

    void run();
    return () => {
      mounted = false;
    };
  }, []);

  return state;
}
