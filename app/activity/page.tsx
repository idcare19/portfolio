import { getActivityEntries } from "@/lib/v2-content";

export const dynamic = "force-dynamic";

export default async function ActivityPage() {
  const items = await getActivityEntries();
  return (
    <main className="min-h-screen bg-page-bg py-24">
      <div className="section-wrap max-w-4xl space-y-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Activity</p>
          <h1 className="mt-3 text-4xl font-bold text-text-main sm:text-5xl">Recent portfolio activity</h1>
        </div>
        <div className="space-y-4">
          {items.map((item: any) => (
            <article key={item.key} className="glass rounded-3xl p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">{new Date(item.occurredAt).toLocaleDateString()}</p>
              <h2 className="mt-2 text-xl font-semibold text-text-main">{item.title}</h2>
              <p className="mt-2 text-sm text-text-muted">{item.details}</p>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
