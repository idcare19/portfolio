import { getPortfolioData } from "@/data/portfolio";
import { AchievementsSection } from "@/components/sections/AchievementsSection";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AchievementsPage() {
  const data = await getPortfolioData();
  const section = data.sections?.achievements;
  if (!section) return null;
  return <AchievementsSection section={section} />;
}
