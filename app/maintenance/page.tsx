import { Clock3, Sparkles, Wrench } from "lucide-react";
import { getPortfolioData } from "@/data/portfolio";

export default async function MaintenancePage() {
  const portfolioData = await getPortfolioData();
  const m = portfolioData.websiteControl.maintenanceMode;

  return (
    <main className="flex min-h-screen items-center justify-center bg-[rgb(var(--page-bg))] p-6 text-[rgb(var(--text-main))]">
      <div className="w-full max-w-3xl rounded-[2rem] border border-[rgb(var(--border))] bg-white p-8 shadow-[0_24px_60px_rgba(15,23,42,0.08)] sm:p-10">
        <div className="text-center">
          <span className="mx-auto inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            Scheduled maintenance
          </span>

          <div className="mx-auto mt-5 grid h-20 w-20 place-items-center rounded-3xl border border-primary/15 bg-primary/10 shadow-[0_12px_28px_rgba(37,99,235,0.12)]">
            <Wrench className="h-9 w-9 text-primary" />
          </div>

          <h1 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">{m.title || "We'll be back soon"}</h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-[rgb(var(--text-muted))] sm:text-base">{m.subtitle}</p>

          {m.estimatedReturn ? (
            <p className="mx-auto mt-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              <Clock3 className="h-4 w-4" />
              {m.estimatedReturn}
            </p>
          ) : null}

          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            {m.contactButtonText && m.contactButtonLink ? (
              <a
                href={m.contactButtonLink}
                className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(37,99,235,0.20)] transition-transform hover:-translate-y-0.5"
              >
                {m.contactButtonText}
              </a>
            ) : null}
            {m.whatsappLink ? (
              <a
                href={m.whatsappLink}
                className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-700 transition-colors hover:bg-emerald-100"
              >
                WhatsApp
              </a>
            ) : null}
          </div>

         

          <p className="mt-7 text-xs tracking-wide text-[rgb(var(--text-muted))]">
            Thanks for your patience while we improve the experience.
          </p>
        </div>
      </div>
    </main>
  );
}
