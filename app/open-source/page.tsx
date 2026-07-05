import { getPortfolioData } from "@/data/portfolio";
import { OpenSourceSection } from "@/components/sections/OpenSourceSection";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function OpenSourcePage() {
  const data = await getPortfolioData();
  const section = data.sections?.["open-source"];
  if (!section) return null;
  return <OpenSourceSection section={section} />;
}
