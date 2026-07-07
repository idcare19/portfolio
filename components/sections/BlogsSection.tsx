"use client";

import Link from "next/link";
import { AnimatedSection } from "@/components/effects/AnimatedSection";
import { useSectionData, useSiteDataContext } from "@/components/site/SiteDataProvider";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { normalizeSlug } from "@/lib/content-utils";
import { filterHomepageItems, getHomepageButtonLabel, getHomepageDisplayConfig, shouldShowViewMore, debugHomepageDisplay } from "@/lib/homepage-display-controls";
import { usePathname } from "next/navigation";

export function BlogsSection() {
  const section = useSectionData("blogs");
  const siteData = useSiteDataContext();
  const pathname = usePathname();
  const data = section.data as Record<string, any>;
  const sectionBlogs = Array.isArray(section.items) ? section.items : [];
  const homepageSettings = getHomepageDisplayConfig(siteData, "blogs");
  const blogs = filterHomepageItems([...((Array.isArray(siteData.blogs) ? siteData.blogs : [])), ...sectionBlogs]
    .filter((blog, index, all) => {
      if (!blog || blog.status !== "published" || !blog.isEnabled) return false;
      const slug = normalizeSlug(String(blog.slug || blog.title || ""));
      return slug ? all.findIndex((item) => normalizeSlug(String(item?.slug || item?.title || "")) === slug) === index : true;
    })
    .sort((left, right) => {
      const featuredScore = Number(right.isFeatured || right.featured || false) - Number(left.isFeatured || left.featured || false);
      if (featuredScore) return featuredScore;
      const rightDate = new Date(right.publishedAt || right.createdAt || right.updatedAt || 0).getTime();
      const leftDate = new Date(left.publishedAt || left.createdAt || left.updatedAt || 0).getTime();
      if (rightDate !== leftDate) return rightDate - leftDate;
      const orderScore = Number(left.order ?? 0) - Number(right.order ?? 0);
      if (orderScore) return orderScore;
      return String(normalizeSlug(String(left.slug || left.title || ""))).localeCompare(String(normalizeSlug(String(right.slug || right.title || ""))));
    }), { ...homepageSettings, limit: homepageSettings.limit ?? homepageSettings.itemsLimit ?? 6 });
  const showMore = shouldShowViewMore([...((Array.isArray(siteData.blogs) ? siteData.blogs : [])), ...sectionBlogs], blogs, homepageSettings);
  debugHomepageDisplay("blogs", [...((Array.isArray(siteData.blogs) ? siteData.blogs : [])), ...sectionBlogs].length, blogs.length, homepageSettings);
  const title = data.title || "Blogs";
  const description = data.description || "Writing, notes, and build lessons from the portfolio.";
  const eyebrow = data.eyebrow || "Blogs";
  const emptyTitle = data.emptyTitle || "No blog posts yet";
  const emptyDescription = data.emptyDescription || "Add published blog entries from the admin panel to show them here.";

  if (section.enabled === false || section.showOnHomepage === false) return null;

  return (
    <AnimatedSection id="blogs" className="bg-page-bg py-20">
      <div className="section-wrap">
        <div>
          <SectionHeader eyebrow={eyebrow} title={title} description={description} />
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {blogs.length ? (
            blogs.map((blog: any) => (
              <div key={blog.slug}>
                <article className="group h-full overflow-hidden rounded-[30px] border border-[rgb(var(--border))] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,250,252,0.92))] p-5 shadow-[0_18px_45px_rgba(15,23,42,0.06)] transition hover:-translate-y-1 hover:shadow-[0_24px_55px_rgba(37,99,235,0.12)]">
                  {blog.coverImage || blog.thumbnail ? (
                    <img
                      src={blog.coverImage || blog.thumbnail}
                      alt={String(blog.title || "Blog post")}
                      className="h-48 w-full rounded-2xl object-cover"
                    />
                  ) : null}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {(blog.tags || []).slice(0, 3).map((tag: string) => (
                      <span key={tag} className="rounded-full border border-[#BFDBFE] bg-[#EFF6FF] px-3 py-1 text-xs font-medium text-[#1D4ED8]">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="mt-4 text-2xl font-semibold tracking-tight text-text-main">{String(blog.title || "")}</h3>
                  <p className="mt-3 text-sm leading-7 text-text-muted">{String(blog.excerpt || blog.content || "").slice(0, 180)}</p>
                  <div className="mt-4 flex flex-wrap items-center gap-3 text-xs font-medium text-text-muted">
                    {blog.readingTimeMinutes ? <span>{blog.readingTimeMinutes} min read</span> : null}
                    {blog.featured || blog.isFeatured ? <span>Featured</span> : null}
                  </div>
                    <Link href={`/blogs/${normalizeSlug(String(blog.slug || blog.title || ""))}`} className="mt-5 inline-flex rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#1D4ED8]">
                    Read Article
                  </Link>
                </article>
              </div>
            ))
          ) : (
            <div className="rounded-[30px] border border-dashed border-[rgb(var(--border))] bg-white/80 p-8 text-center text-text-muted md:col-span-2 xl:col-span-3">
              <p className="text-lg font-semibold text-text-main">{emptyTitle}</p>
              <p className="mt-2 text-sm leading-7">{emptyDescription}</p>
            </div>
          )}
        </div>
        {pathname === "/" && showMore ? <div className="mt-8 flex justify-center"><Link href={homepageSettings.fullPageUrl || "/blogs"} className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white">{getHomepageButtonLabel(homepageSettings)}</Link></div> : null}
      </div>
    </AnimatedSection>
  );
}
