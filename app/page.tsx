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
  const coreSectionIds = ["hero", "about", "skills", "projects", "working", "completed", "reviews", "journey", "education", "services", "contact", "github", "blogs", "footer"];
  const sections = Object.values(portfolioData.sections || {})
    .filter((section) => section.enabled !== false && section.showOnHomepage !== false)
    .sort((a, b) => a.order - b.order);
  const footerSection = portfolioData.sections?.footer;
  const showFooter = footerSection?.enabled !== false && footerSection?.showOnHomepage !== false;
  const visibleSections =
    sections.length > 0
      ? sections
      : coreSectionIds
          .map((id) => portfolioData.sections?.[id])
          .filter((section): section is NonNullable<typeof section> => Boolean(section))
          .filter((section) => section.enabled !== false)
          .sort((a, b) => a.order - b.order);

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
