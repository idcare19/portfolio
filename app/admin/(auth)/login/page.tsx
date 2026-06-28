"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const payload = await res.json();
        throw new Error(payload.error || "Login failed");
      }

      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid credentials");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[rgb(var(--admin-bg))] p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-2xl border border-admin-border bg-white p-6 shadow-xl">
        <h1 className="text-2xl font-bold text-admin-text">Admin Login</h1>
        <p className="mt-1 text-sm text-admin-text-muted">Use your secure admin credentials to continue.</p>

        <label className="mt-5 block text-sm font-medium text-admin-text">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full rounded-xl border border-admin-border bg-white px-3 py-2 text-admin-text outline-none transition focus:border-admin-primary focus:ring-2 focus:ring-[#DBEAFE]"
          placeholder="admin@example.com"
        />

        <label className="mt-4 block text-sm font-medium text-admin-text">Password</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 w-full rounded-xl border border-admin-border bg-white px-3 py-2 text-admin-text outline-none transition focus:border-admin-primary focus:ring-2 focus:ring-[#DBEAFE]"
          placeholder="••••••••"
        />

        {error ? <p className="mt-3 text-sm font-medium text-rose-600">{error}</p> : null}

        <button
          type="submit"
          disabled={loading}
          className="mt-5 w-full rounded-xl bg-admin-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#1D4ED8] disabled:opacity-80"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </main>
  );
}
