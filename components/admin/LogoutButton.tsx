"use client";

import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="rounded-xl border border-admin-border bg-admin-card px-3 py-2 text-xs font-semibold text-admin-text hover:bg-admin-bg"
    >
      Logout
    </button>
  );
}
