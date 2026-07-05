import { getPortfolioData } from "@/data/portfolio";
import { FaqSection } from "@/components/sections/FaqSection";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function FaqPage() {
  const data = await getPortfolioData();
  const section = data.sections?.faq;
  if (!section) return null;
  return <FaqSection section={section} />;
}
