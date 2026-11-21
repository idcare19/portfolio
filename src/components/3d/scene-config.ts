
export type SceneSection =
  | "hero"
  | "about"
  | "skills"
  | "projects"
  | "experience"
  | "education"
  | "contact";

export interface SceneTransform {
  rotateX: number;
  rotateY: number;
  rotateZ: number;
  scale: number;
  translateY: number;
}

export const SCENE_CONFIG: Record<SceneSection, SceneTransform> = {
  hero: {
    rotateX: -12,
    rotateY: 0,
    rotateZ: -8,
    scale: 1,
    translateY: 0,
  },
  about: {
    rotateX: 8,
    rotateY: 65,
    rotateZ: 12,
    scale: 0.88,
    translateY: -12,
  },
  skills: {
    rotateX: -18,
    rotateY: 135,
    rotateZ: 25,
    scale: 0.82,
    translateY: 18,
  },
  projects: {
    rotateX: 15,
    rotateY: 220,
    rotateZ: -12,
    scale: 0.92,
    translateY: -8,
  },
  experience: {
    rotateX: -10,
    rotateY: 285,
    rotateZ: 18,
    scale: 0.85,
    translateY: 12,
  },
  education: {
    rotateX: 12,
    rotateY: 340,
    rotateZ: -18,
    scale: 0.82,
    translateY: -10,
  },
  contact: {
    rotateX: 0,
    rotateY: 420,
    rotateZ: 0,
    scale: 0.95,
    translateY: 0,
  },
};

export const SCENE_SETTINGS = {
  perspective: 1200,
  transitionDuration: 1.2,
  mouseSensitivity: 0.035,
  maxMouseRotation: 12,
  enableMouseTracking: true,
  enableScrollAnimation: true,
  enableAutoRotation: true,
  mobileScale: 0.72,
} as const;
