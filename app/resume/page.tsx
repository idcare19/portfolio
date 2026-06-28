import { ResumeButtons } from "@/components/site/ResumeButtons";
import { getSiteData } from "@/src/lib/site-data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ResumePage() {
  const siteData = await getSiteData();
  const resumeUrl = siteData.owner.resumeUrl?.trim();

  return (
    <main className="min-h-screen bg-page-bg py-24">
      <div className="section-wrap">
        <section className="glass mx-auto max-w-3xl rounded-[32px] p-8 text-center sm:p-12">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Resume</p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-text-main sm:text-5xl">Download or open the latest resume</h1>
          <p className="mt-4 text-base leading-7 text-text-muted">This page is fixed, but the actual resume URL is controlled from MongoDB-backed portfolio settings.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {resumeUrl ? <ResumeButtons resumeUrl={resumeUrl} /> : null}
          </div>
          {!resumeUrl ? <p className="mt-6 text-sm text-rose-600">Resume URL has not been configured yet.</p> : null}
        </section>
      </div>
    </main>
  );
}
