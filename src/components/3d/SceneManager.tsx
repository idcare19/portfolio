
"use client";

import { useSceneManager } from "./SceneManagerProvider";
import { ReactorObject } from "./ReactorObject";

interface SceneManagerProps {
  className?: string;
  interactive?: boolean;
}

export function SceneManager({
  className = "",
  interactive = true,
}: SceneManagerProps) {
  const {
    sceneTransform,
    mouseX,
    mouseY,
    enabled,
  } = useSceneManager();

  if (!enabled) return null;

  return (
    <div
      className={`pointer-events-none ${className}`}
      aria-hidden="true"
    >
      <ReactorObject
        rotateX={sceneTransform.rotateX}
        rotateY={sceneTransform.rotateY}
        rotateZ={sceneTransform.rotateZ}
        scale={sceneTransform.scale}
        translateY={sceneTransform.translateY}
        mouseX={interactive ? mouseX : 0}
        mouseY={interactive ? mouseY : 0}
        interactive={interactive}
      />
    </div>
  );
}

export default SceneManager;
