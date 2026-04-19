"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

export function AdminBreadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  const crumbs = segments.map((seg, idx) => ({
    label: seg.replace(/-/g, " "),
    href: `/${segments.slice(0, idx + 1).join("/")}`,
  }));

  return (
    <nav className="mb-4 flex flex-wrap items-center gap-2 text-xs text-slate-500">
      <Link href="/admin" className="font-medium text-slate-600 hover:text-blue-600">admin</Link>
      {crumbs.slice(1).map((crumb) => (
        <span key={crumb.href} className="flex items-center gap-2">
          <span>/</span>
          <Link href={crumb.href} className="font-medium capitalize text-slate-600 hover:text-blue-600">
            {crumb.label}
          </Link>
        </span>
      ))}
    </nav>
  );
}
