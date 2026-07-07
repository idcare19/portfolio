import { getPortfolioData } from "@/data/portfolio";
import { ReviewsSection } from "@/components/sections/ReviewsSection";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ReviewsPage() {
  const data = await getPortfolioData();
  const section = data.sections?.reviews;
  if (!section) return null;
  return <ReviewsSection />;
}
