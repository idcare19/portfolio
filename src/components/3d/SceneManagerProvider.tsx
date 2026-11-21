
"use client";

import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from "react";

import { useSceneInteraction } from "./useSceneInteraction";
import {
  SCENE_CONFIG,
  type SceneSection,
  type SceneTransform,
} from "./scene-config";

interface SceneManagerContextValue {
  activeSection: SceneSection;
  setActiveSection: (section: SceneSection) => void;
  sceneTransform: SceneTransform;
  mouseX: number;
  mouseY: number;
  scrollProgress: number;
  enabled: boolean;
}

const SceneManagerContext =
  createContext<SceneManagerContextValue | null>(null);

interface SceneManagerProviderProps {
  children: ReactNode;
  enabled?: boolean;
}

export function SceneManagerProvider({
  children,
  enabled = true,
}: SceneManagerProviderProps) {
  const interaction = useSceneInteraction({ enabled });

  // The active section is controlled by the SceneManager component.
  const [activeSection, setActiveSection] =
    useSceneState("hero");

  const value = useMemo<SceneManagerContextValue>(
    () => ({
      activeSection,
      setActiveSection,
      sceneTransform: SCENE_CONFIG[activeSection],
      mouseX: interaction.mouseX,
      mouseY: interaction.mouseY,
      scrollProgress: interaction.scrollProgress,
      enabled,
    }),
    [activeSection, setActiveSection, interaction, enabled]
  );

  return (
    <SceneManagerContext.Provider value={value}>
      {children}
    </SceneManagerContext.Provider>
  );
}

import { useCallback, useState } from "react";

function useSceneState(initial: SceneSection) {
  const [section, setSection] = useState<SceneSection>(initial);

  const updateSection = useCallback((next: SceneSection) => {
    setSection(next);
  }, []);

  return [section, updateSection] as const;
}

export function useSceneManager() {
  const context = useContext(SceneManagerContext);

  if (!context) {
    throw new Error(
      "useSceneManager must be used inside SceneManagerProvider"
    );
  }

  return context;
}

export function useOptionalSceneManager() {
  return useContext(SceneManagerContext);
}
