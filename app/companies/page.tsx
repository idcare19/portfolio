import { getPortfolioData } from "@/data/portfolio";
import { CompaniesSection } from "@/components/sections/CompaniesSection";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function CompaniesPage() {
  const data = await getPortfolioData();
  const section = data.sections?.companies;
  if (!section) return null;
  return <CompaniesSection section={section} />;
}
