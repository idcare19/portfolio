import { getPortfolioData } from "@/data/portfolio";
import { CertificatesSection } from "@/components/sections/CertificatesSection";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function CertificatesPage() {
  const data = await getPortfolioData();
  const section = data.sections?.certificates;
  if (!section) return null;
  return <CertificatesSection section={section} />;
}
