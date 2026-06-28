import { getRoadmapItems } from "@/lib/v2-content";

export const dynamic = "force-dynamic";

const COLUMNS = [
  { key: "completed", title: "Completed" },
  { key: "in-progress", title: "In Progress" },
  { key: "planned", title: "Planned" },
] as const;

export default async function RoadmapPage() {
  const items = await getRoadmapItems();
  return (
    <main className="min-h-screen bg-page-bg py-24">
      <div className="section-wrap space-y-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Roadmap</p>
          <h1 className="mt-3 text-4xl font-bold text-text-main sm:text-5xl">What is shipping next</h1>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {COLUMNS.map((column) => (
            <section key={column.key} className="glass rounded-3xl p-5">
              <h2 className="text-xl font-semibold text-text-main">{column.title}</h2>
              <div className="mt-4 space-y-3">
                {items.filter((item: any) => item.status === column.key).map((item: any) => (
                  <article key={item.key} className="rounded-2xl border border-[rgb(var(--border))] bg-white p-4">
                    <h3 className="font-semibold text-text-main">{item.title}</h3>
                    <p className="mt-2 text-sm text-text-muted">{item.description}</p>
                    {item.eta ? <p className="mt-2 text-xs font-medium text-primary">ETA: {item.eta}</p> : null}
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
