import { notFound } from "next/navigation";
import { LikeButton } from "@/components/site/LikeButton";
import { ShareButtons } from "@/components/site/ShareButtons";
import { ViewCounter } from "@/components/site/ViewCounter";
import { extractToc, normalizeSlug } from "@/lib/content-utils";
import { getPublishedBlogs } from "@/lib/portfolio/repository";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type BlogDetail = {
  slug: string;
  title: string;
  thumbnail?: string;
  coverImage?: string;
  tags?: string[];
  excerpt?: string;
  content: string;
  readingTimeMinutes?: number;
};

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug: rawSlug } = await params;
  const slug = normalizeSlug(rawSlug);
  if (!slug) notFound();
  const blogs = (await getPublishedBlogs()) as BlogDetail[];
  const blog = blogs.find((item) => normalizeSlug(item.slug) === slug);

  if (!blog) notFound();

  const toc = extractToc(blog.content || "");
  const related = blogs
    .filter((item) => item.slug !== blog.slug && (item.tags || []).some((tag) => (blog.tags || []).includes(tag)))
    .slice(0, 3);

  return (
    <main className="min-h-screen bg-page-bg py-24">
      <article className="section-wrap max-w-4xl">
        <div className="glass rounded-[32px] p-7 sm:p-10">
          <div className="flex flex-wrap gap-2">
            {(blog.tags || []).map((tag) => <span key={tag} className="rounded-full border border-[rgb(var(--border))] bg-white px-3 py-1 text-xs text-text-main">{tag}</span>)}
          </div>
          <h1 className="mt-5 text-4xl font-bold tracking-tight text-text-main sm:text-5xl">{blog.title}</h1>
          <div className="mt-4 flex flex-wrap gap-3">
            <span className="text-sm text-text-muted">{blog.readingTimeMinutes || 1} min read</span>
            <ViewCounter targetType="blog" targetSlug={blog.slug} />
            <LikeButton targetType="blog" targetSlug={blog.slug} />
          </div>
          <div className="mt-4">
            <ShareButtons title={blog.title} path={`/blogs/${blog.slug}`} />
          </div>
          {blog.coverImage || blog.thumbnail ? <img src={blog.coverImage || blog.thumbnail} alt={blog.title} className="mt-8 w-full rounded-[24px] object-cover" /> : <div className="mt-8 h-64 rounded-[24px] border border-dashed border-[rgb(var(--border))] bg-[rgb(var(--page-bg))]" />}
          {toc.length ? (
            <div className="mt-8 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--page-bg))] p-4">
              <p className="text-sm font-semibold text-text-main">Table of Contents</p>
              <div className="mt-3 space-y-1">
                {toc.map((item) => <p key={item.slug} className="text-sm text-text-muted">{item.title}</p>)}
              </div>
            </div>
          ) : null}
          <div className="prose prose-slate mt-8 max-w-none whitespace-pre-wrap text-text-muted">
            {blog.content}
          </div>
          {related.length ? (
            <div className="mt-8 space-y-3">
              <p className="text-lg font-semibold text-text-main">Related Blogs</p>
              <div className="grid gap-3 md:grid-cols-3">
                {related.map((item) => (
                  <a key={item.slug} href={`/blogs/${item.slug}`} className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--page-bg))] p-4">
                    <p className="font-semibold text-text-main">{item.title}</p>
                    <p className="mt-2 text-sm text-text-muted">{String(item.excerpt || item.content || "").slice(0, 90)}</p>
                  </a>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </article>
    </main>
  );
}
