import Link from "next/link";

export default function NotFound() {
  return <main className="section-wrap flex min-h-[70vh] flex-col justify-center py-24"><p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">404 / Page not found</p><h1 className="mt-4 text-5xl font-bold text-text-main">That page is not here.</h1><p className="mt-5 max-w-xl text-lg leading-8 text-text-muted">Explore Abhishek&apos;s profile, services and selected projects instead.</p><nav aria-label="404 navigation" className="mt-8 flex flex-wrap gap-4"><Link className="rounded-full bg-primary px-5 py-3 font-semibold text-white" href="/">Homepage</Link><Link className="rounded-full border border-[rgb(var(--border))] px-5 py-3 font-semibold text-text-main" href="/about">About</Link><Link className="rounded-full border border-[rgb(var(--border))] px-5 py-3 font-semibold text-text-main" href="/projects">Projects</Link></nav></main>;
}
