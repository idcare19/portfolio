import { portfolioData } from "@/data/portfolio";
import { Clock3, Sparkles, Wrench } from "lucide-react";

export default function MaintenancePage() {
  const m = portfolioData.websiteControl.maintenanceMode;

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 p-6 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(56,189,248,0.24),transparent_30%),radial-gradient(circle_at_82%_16%,rgba(139,92,246,0.24),transparent_32%),radial-gradient(circle_at_50%_82%,rgba(14,165,233,0.12),transparent_35%)]" />

      <div className="relative w-full max-w-3xl overflow-hidden rounded-[2rem] border border-white/15 bg-white/10 p-8 shadow-[0_30px_90px_rgba(2,6,23,0.55)] backdrop-blur-xl sm:p-10">
        <div className="pointer-events-none absolute -top-20 right-0 h-48 w-48 rounded-full bg-cyan-400/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-8 h-56 w-56 rounded-full bg-violet-400/25 blur-3xl" />

        <div className="relative text-center">
          <span className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-cyan-100">
            <Sparkles className="h-3.5 w-3.5" />
            Scheduled maintenance
          </span>

          <div className="mx-auto mt-5 grid h-20 w-20 place-items-center rounded-3xl border border-white/20 bg-gradient-to-br from-cyan-400/35 to-blue-500/25 shadow-[0_12px_28px_rgba(14,165,233,0.3)]">
            <Wrench className="h-9 w-9 text-cyan-100" />
          </div>

          <h1 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">{m.title || "We’ll be back soon"}</h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-100/90 sm:text-base">{m.subtitle}</p>

          {m.estimatedReturn ? (
            <p className="mx-auto mt-4 inline-flex items-center gap-2 rounded-full border border-cyan-200/40 bg-cyan-300/10 px-3 py-1 text-sm font-medium text-cyan-100">
              <Clock3 className="h-4 w-4" />
              {m.estimatedReturn}
            </p>
          ) : null}

          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            {m.contactButtonText && m.contactButtonLink ? (
              <a
                href={m.contactButtonLink}
                className="rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(37,99,235,0.34)] transition-transform hover:-translate-y-0.5"
              >
                {m.contactButtonText}
              </a>
            ) : null}
            {m.whatsappLink ? (
              <a
                href={m.whatsappLink}
                className="rounded-xl border border-emerald-300/70 bg-emerald-500/10 px-4 py-2.5 text-sm font-semibold text-emerald-100 transition-colors hover:bg-emerald-500/20"
              >
                WhatsApp
              </a>
            ) : null}
          </div>

          {m.socialLinks?.length ? (
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-sm">
              {m.socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-slate-100/90 transition-colors hover:bg-white/20"
                >
                  {link.label}
                </a>
              ))}
            </div>
          ) : null}

          <p className="mt-7 text-xs tracking-wide text-slate-300/80">Thanks for your patience while we improve the experience.</p>
        </div>
      </div>
    </main>
  );
}
