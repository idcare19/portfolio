import Link from "next/link";
import { getPublishedBlogs } from "@/lib/portfolio/repository";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function BlogsPage() {
  const blogs = await getPublishedBlogs();

  return (
    <main className="min-h-screen bg-page-bg py-24">
      <div className="section-wrap space-y-10">
        <div className="max-w-3xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-primary">Blogs</p>
          <h1 className="text-4xl font-bold tracking-tight text-text-main sm:text-5xl">Writing, notes, and build lessons</h1>
          <p className="mt-4 text-base text-text-muted">This page stays structurally fixed while blog entries come from MongoDB.</p>
        </div>

        <div className="grid gap-6">
          {blogs.map((blog: any) => (
            <article key={blog.slug} className="glass rounded-3xl p-6">
              <div className="grid gap-6 md:grid-cols-[240px_1fr]">
                {blog.thumbnail ? <img src={blog.thumbnail} alt={blog.title} className="h-48 w-full rounded-2xl object-cover" /> : null}
                <div>
                  <div className="flex flex-wrap gap-2">
                    {(blog.tags || []).map((tag: string) => <span key={tag} className="rounded-full border border-[rgb(var(--border))] bg-white px-3 py-1 text-xs text-text-main">{tag}</span>)}
                  </div>
                  <h2 className="mt-4 text-2xl font-semibold text-text-main">{blog.title}</h2>
                  <p className="mt-3 text-sm leading-7 text-text-muted">{blog.excerpt || String(blog.content).slice(0, 180)}</p>
                  <div className="mt-3 flex flex-wrap gap-3 text-xs font-medium text-primary">
                    {blog.readingTimeMinutes ? <span>{blog.readingTimeMinutes} min read</span> : null}
                    {blog.featured ? <span>Featured</span> : null}
                    {blog.scheduledFor ? <span>Scheduled: {blog.scheduledFor}</span> : null}
                  </div>
                  <Link href={`/blogs/${blog.slug}`} className="mt-5 inline-flex rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white">
                    Read Article
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
