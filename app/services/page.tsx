import { getPortfolioData } from "@/data/portfolio";
import { ServicesSection } from "@/components/sections/ServicesSection";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ServicesPage() {
  const data = await getPortfolioData();
  const section = data.sections?.services;
  if (!section) return null;
  return <ServicesSection />;
}
