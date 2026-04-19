import { portfolioData } from "@/data/portfolio";

export default function MaintenancePage() {
  const m = portfolioData.websiteControl.maintenanceMode;

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 p-6 text-white">
      <div className="w-full max-w-2xl rounded-3xl border border-slate-800 bg-slate-900/80 p-8 text-center shadow-2xl">
        <div className="mx-auto mb-5 h-16 w-16 animate-pulse rounded-full bg-gradient-to-r from-blue-500 to-cyan-400" />
        <h1 className="text-3xl font-bold">{m.title || "We’ll be back soon"}</h1>
        <p className="mt-3 text-slate-300">{m.subtitle}</p>
        {m.estimatedReturn ? <p className="mt-2 text-sm text-cyan-300">{m.estimatedReturn}</p> : null}

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {m.contactButtonText && m.contactButtonLink ? (
            <a href={m.contactButtonLink} className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white">
              {m.contactButtonText}
            </a>
          ) : null}
          {m.whatsappLink ? (
            <a href={m.whatsappLink} className="rounded-xl border border-emerald-300 px-4 py-2 text-sm font-semibold text-emerald-300">
              WhatsApp
            </a>
          ) : null}
        </div>

        {m.socialLinks?.length ? (
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3 text-sm">
            {m.socialLinks.map((link) => (
              <a key={link.label} href={link.href} className="text-slate-300 underline">
                {link.label}
              </a>
            ))}
          </div>
        ) : null}
      </div>
    </main>
  );
}
