import { Clock3, MessageCircle, Wrench } from "lucide-react";
import { getPortfolioData } from "@/data/portfolio";

export default async function MaintenancePage() {
  const portfolioData = await getPortfolioData();
  const m = portfolioData.websiteControl.maintenanceMode;

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[rgb(var(--page-bg))] px-5 py-12 text-[rgb(var(--text-main))]">
      {/* Quiet blueprint grid, fades out toward the edges */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.55] [background-image:linear-gradient(to_right,rgb(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,rgb(var(--border))_1px,transparent_1px)] [background-size:44px_44px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_45%,black,transparent)]"
      />

      <section
        aria-labelledby="maintenance-title"
        className="relative w-full max-w-2xl overflow-hidden rounded-[1.75rem] border border-[rgb(var(--border))] bg-white shadow-[0_30px_80px_-20px_rgba(15,23,42,0.18)]"
      >
        {/* Live status strip: the one memorable element */}
        <div className="flex items-center justify-between gap-3 border-b border-[rgb(var(--border))] bg-slate-50/80 px-6 py-3.5 sm:px-8">
          <div className="flex items-center gap-2.5 text-sm font-medium">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-60 motion-safe:animate-ping" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-amber-500" />
            </span>
            Maintenance in progress
          </div>
          <span className="text-xs text-[rgb(var(--text-muted))]">Site temporarily offline</span>
        </div>

        {/* Indeterminate progress bar */}
        <div className="h-1 w-full overflow-hidden bg-primary/10" role="progressbar" aria-label="Maintenance in progress">
          <div className="h-full w-1/3 rounded-full bg-primary motion-safe:animate-[maintenance-slide_1.8s_ease-in-out_infinite]" />
        </div>

        <div className="px-6 py-10 sm:px-12 sm:py-14">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-primary text-white shadow-[0_12px_28px_-8px_rgba(37,99,235,0.55)]">
            <Wrench className="h-6 w-6" />
          </div>

          <h1
            id="maintenance-title"
            className="mt-7 max-w-xl text-balance text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl"
          >
            {m.title || "We'll be back soon"}
          </h1>

          {m.subtitle ? (
            <p className="mt-4 max-w-lg text-base leading-relaxed text-[rgb(var(--text-muted))] sm:text-lg">
              {m.subtitle}
            </p>
          ) : null}

          {m.estimatedReturn ? (
            <div className="mt-8 flex items-center gap-4 rounded-2xl border border-[rgb(var(--border))] bg-slate-50 p-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white text-primary shadow-sm ring-1 ring-[rgb(var(--border))]">
                <Clock3 className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs text-[rgb(var(--text-muted))]">Expected back</p>
                <p className="text-base font-semibold">{m.estimatedReturn}</p>
              </div>
            </div>
          ) : null}

          {(m.contactButtonText && m.contactButtonLink) || m.whatsappLink ? (
            <div className="mt-8 flex flex-wrap items-center gap-3">
              {m.contactButtonText && m.contactButtonLink ? (
                <a
                  href={m.contactButtonLink}
                  className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_-6px_rgba(37,99,235,0.45)] transition hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  {m.contactButtonText}
                </a>
              ) : null}
              {m.whatsappLink ? (
                <a
                  href={m.whatsappLink}
                  className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-3 text-sm font-semibold text-emerald-700 transition-colors hover:bg-emerald-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
                >
                  <MessageCircle className="h-4 w-4" />
                  Chat on WhatsApp
                </a>
              ) : null}
            </div>
          ) : null}
        </div>

        <p className="border-t border-[rgb(var(--border))] px-6 py-4 text-xs text-[rgb(var(--text-muted))] sm:px-12">
          Thanks for your patience while we improve the experience.
        </p>
      </section>
    </main>
  );
}

/*
  Add this keyframe once (globals.css), or in tailwind.config under theme.extend.keyframes:

  @keyframes maintenance-slide {
    0%   { transform: translateX(-100%); }
    100% { transform: translateX(300%); }
  }
*/