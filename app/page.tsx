import nextDynamic from "next/dynamic";
import { DeferredSection } from "@/components/layout/DeferredSection";
import { Navbar } from "@/components/layout/Navbar";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { DynamicSectionRenderer } from "@/components/sections/DynamicSectionRenderer";
import { getPortfolioData } from "@/data/portfolio";
import type { SectionId } from "@/src/types/site-data";
const DeferredFooterSection = nextDynamic(() =>
  import("@/components/layout/FooterSection").then((module) => module.FooterSection)
);

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HomePage() {
  const portfolioData = await getPortfolioData();
  const controlOrder = new Map((portfolioData.sectionControls || []).map((control, index) => [control.id, control.order ?? index + 1] as const));
  const sections = Object.values(portfolioData.sections || {})
    .filter((section) => section.enabled !== false && section.showOnHomepage !== false)
    .sort((a, b) => (controlOrder.get(a.id as SectionId) ?? a.order) - (controlOrder.get(b.id as SectionId) ?? b.order) || a.order - b.order);
  const footerSection = portfolioData.sections?.footer;
  const showFooter = footerSection?.enabled !== false && footerSection?.showOnHomepage !== false;
  const visibleSections = sections;

  return (
    <main className="min-h-screen bg-page-bg">
      <ScrollProgress />
      <Navbar />
      <div>
        {visibleSections.map((section) => {
          return (
            <DeferredSection
              key={section.id}
              id={section.id === "hero" ? "home" : section.id === "journey" ? "experience" : section.id}
              className="min-h-[420px]"
            >
              <DynamicSectionRenderer section={section} />
            </DeferredSection>
          );
        })}

        {showFooter ? (
          <DeferredSection className="min-h-[240px]">
            <DeferredFooterSection />
          </DeferredSection>
        ) : null}
      </div>
    </main>
  );
}
