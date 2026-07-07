export const ANIMATION_SECTIONS = [
  "hero","about","achievements","skills","certificates","services","projects","working","completed","companies","experience","reviews","faq","open-source","blogs","github","contact","footer"
] as const;

export const ANIMATION_PRESETS = [
  "Fade In","Fade Up","Fade Down","Fade Left","Fade Right","Scale","Zoom In","Zoom Out","Slide Up","Slide Down","Slide Left","Slide Right","Rotate","Flip X","Flip Y","Blur In","Bounce","Elastic","Float","Pop","Reveal","Stagger Cards","Parallax","Morph","3D Rotate","Skew","Typewriter","Counter Animation","Progress Bar Fill",
] as const;

export const ANIMATION_TRIGGERS = ["On Load","While In View","On Hover","On Click","Continuous"] as const;

export const ANIMATION_TEMPLATE_NAMES = ["Minimal","Modern","Apple Style","Linear","Premium SaaS","Creative","Glass","Corporate","Playful"] as const;

export function defaultAnimationConfig(sectionId: string) {
  return {
    enabled: true,
    preset: sectionId === "hero" ? "Fade Up" : sectionId === "projects" ? "Stagger Cards" : "Fade In",
    direction: "up",
    duration: 0.6,
    delay: 0,
    stagger: 0.08,
    trigger: "While In View",
    once: true,
    mobile: true,
    tablet: true,
    desktop: true,
    intensity: 0.7,
  };
}
