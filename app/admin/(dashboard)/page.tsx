"use client";

import { PageHeader } from "@/components/admin/PageHeader";
import { StatCard } from "@/components/admin/StatCard";
import { useSiteDataEditor } from "@/components/admin/useSiteDataEditor";

export default function AdminDashboardPage() {
  const { data, loading, error } = useSiteDataEditor();

  return (
    <div>
      <PageHeader title="Dashboard" description="Git-based content management dashboard for your portfolio." />

      {loading ? <p className="text-sm text-slate-600">Loading dashboard...</p> : null}
      {error ? <p className="text-sm font-medium text-rose-600">{error}</p> : null}

      {data ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            <StatCard label="Projects" value={data.projectsDetailed.length} />
            <StatCard label="Skills" value={data.skillsDetailed.length} />
            <StatCard label="Services" value={data.services.length} />
            <StatCard label="Testimonials" value={data.testimonialsDetailed.length} />
            <StatCard label="Messages" value={data.contactMessages.length} />
          </div>

          <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Recent Updates</h2>
            <p className="mt-2 text-sm text-slate-600">Last content update: {new Date(data.updatedAt).toLocaleString()}</p>
            {data.websiteControl.versionInfo.showUpdateMessage ? (
              <p className="mt-2 text-sm text-blue-700">{data.websiteControl.versionInfo.updateMessage}</p>
            ) : null}
            <p className="mt-1 text-sm text-slate-600">{data.websiteControl.versionInfo.changelogShort}</p>
          </section>
        </>
      ) : null}
    </div>
  );
}
