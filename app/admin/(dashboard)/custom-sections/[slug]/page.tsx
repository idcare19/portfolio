import { notFound } from "next/navigation";
import { PageHeader } from "@/components/admin/PageHeader";
import { CustomSectionEditor } from "@/components/admin/CustomSectionEditor";
import { getPortfolioSiteData } from "@/lib/portfolio/repository";

export default async function CustomSectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getPortfolioSiteData();
  const section = data.sections?.[slug];

  if (!section) notFound();

  return (
    <div className="space-y-6">
      <PageHeader title={section.label || slug} description={`Edit custom section: ${slug}`} />
      <CustomSectionEditor slug={slug} />
    </div>
  );
}
