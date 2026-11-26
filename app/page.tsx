
import nextDynamic from "next/dynamic";

import { DeferredSection } from "@/components/layout/DeferredSection";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { DynamicSectionRenderer } from "@/components/sections/DynamicSectionRenderer";

import {
  SceneManagerProvider,
  Section3DWrapper,
  type SceneSection,
} from "@/src/components/3d";

import { getPortfolioData } from "@/data/portfolio";
import type { SectionId } from "@/src/types/site-data";

const DeferredFooterSection = nextDynamic(() =>
  import("@/components/layout/FooterSection").then(
    (module) => module.FooterSection
  )
);

export const dynamic = "force-dynamic";
export const revalidate = 0;

function getSceneSection(id: string): SceneSection | null {
  const sectionMap: Record<string, SceneSection> = {
    hero: "hero",
    about: "about",
    skills: "skills",
    projects: "projects",
    journey: "experience",
    experience: "experience",
    education: "education",
    contact: "contact",
  };

  return sectionMap[id] ?? null;
}

export default async function HomePage() {
  const portfolioData = await getPortfolioData();

  const controlOrder = new Map(
    (portfolioData.sectionControls || []).map((control, index) => [
      control.id,
      control.order ?? index + 1,
    ] as const)
  );

  const sections = Object.values(portfolioData.sections || {})
    .filter(
      (section) =>
        section.enabled !== false &&
        section.showOnHomepage !== false
    )
    .sort(
      (a, b) =>
        (controlOrder.get(a.id as SectionId) ?? a.order) -
          (controlOrder.get(b.id as SectionId) ?? b.order) ||
        a.order - b.order
    );

  const footerSection = portfolioData.sections?.footer;

  const showFooter =
    footerSection?.enabled !== false &&
    footerSection?.showOnHomepage !== false;

  return (
    <SceneManagerProvider enabled>
      <main className="relative min-h-screen overflow-clip bg-page-bg">
        <ScrollProgress />

        <div className="relative z-10">
          {sections.map((section) => {
            const sectionId =
              section.id === "hero"
                ? "home"
                : section.id === "journey"
                  ? "experience"
                  : section.id;

            const sceneSection = getSceneSection(section.id);

            return (
              <DeferredSection
                key={section.id}
                id={sectionId}
                className="min-h-[420px]"
              >
                {sceneSection ? (
                  <Section3DWrapper section={sceneSection}>
                    <DynamicSectionRenderer section={section} />
                  </Section3DWrapper>
                ) : (
                  <DynamicSectionRenderer section={section} />
                )}
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
    </SceneManagerProvider>
  );
}
