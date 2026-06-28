import { getChangelogEntries } from "@/lib/v2-content";

export const dynamic = "force-dynamic";

export default async function ChangelogPage() {
  const entries = await getChangelogEntries();
  return (
    <main className="min-h-screen bg-page-bg py-24">
      <div className="section-wrap max-w-4xl space-y-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Changelog</p>
          <h1 className="mt-3 text-4xl font-bold text-text-main sm:text-5xl">Product updates and releases</h1>
        </div>
        {entries.map((entry: any) => (
          <section key={entry.key} className="glass rounded-3xl p-6">
            <p className="text-sm font-semibold text-primary">{entry.version}</p>
            <h2 className="mt-2 text-2xl font-semibold text-text-main">{entry.title}</h2>
            <p className="mt-3 text-sm text-text-muted">{entry.summary}</p>
            <ul className="mt-4 space-y-2 text-sm text-text-main">
              {(entry.bullets || []).map((bullet: string) => <li key={bullet}>{bullet}</li>)}
            </ul>
          </section>
        ))}
      </div>
    </main>
  );
}
