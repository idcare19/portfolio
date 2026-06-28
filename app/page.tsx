import nextDynamic from "next/dynamic";
import { DeferredSection } from "@/components/layout/DeferredSection";
import { Navbar } from "@/components/layout/Navbar";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { DynamicSectionRenderer } from "@/components/sections/DynamicSectionRenderer";
import { getPortfolioData } from "@/data/portfolio";
const DeferredFooterSection = nextDynamic(() =>
  import("@/components/layout/FooterSection").then((module) => module.FooterSection)
);

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HomePage() {
  const portfolioData = await getPortfolioData();
  const sections = Object.values(portfolioData.sections || {})
    .filter((section) => section.enabled)
    .sort((a, b) => a.order - b.order);

  return (
    <main className="min-h-screen bg-page-bg">
      <ScrollProgress />
      <Navbar />
      <div>
        {sections.map((section) => (
          <DeferredSection key={section.id} id={section.id === "hero" ? undefined : section.id} className="min-h-[420px]">
            <DynamicSectionRenderer section={section} />
          </DeferredSection>
        ))}

        <DeferredSection className="min-h-[240px]">
          <DeferredFooterSection />
        </DeferredSection>
      </div>
    </main>
  );
}