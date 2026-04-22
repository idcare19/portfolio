"use client";

import { useCallback, useSyncExternalStore } from "react";

type MediaStore = {
  mql: MediaQueryList;
  subscribers: Set<() => void>;
  onChange: () => void;
};

const mediaStores = new Map<number, MediaStore>();

function getOrCreateStore(maxWidth: number): MediaStore | null {
  if (typeof window === "undefined") {
    return null;
  }

  const existing = mediaStores.get(maxWidth);
  if (existing) {
    return existing;
  }

  const mql = window.matchMedia(`(max-width: ${maxWidth}px)`);
  const subscribers = new Set<() => void>();
  const onChange = () => {
    subscribers.forEach((callback) => callback());
  };

  if (typeof mql.addEventListener === "function") {
    mql.addEventListener("change", onChange);
  } else {
    mql.addListener(onChange);
  }

  const store: MediaStore = { mql, subscribers, onChange };
  mediaStores.set(maxWidth, store);
  return store;
}

function disposeStore(maxWidth: number, store: MediaStore) {
  if (store.subscribers.size > 0) {
    return;
  }

  if (typeof store.mql.removeEventListener === "function") {
    store.mql.removeEventListener("change", store.onChange);
  } else {
    store.mql.removeListener(store.onChange);
  }

  mediaStores.delete(maxWidth);
}

export function useIsMobile(maxWidth = 767) {
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const store = getOrCreateStore(maxWidth);
      if (!store) {
        return () => {};
      }

      store.subscribers.add(onStoreChange);

      return () => {
        store.subscribers.delete(onStoreChange);
        disposeStore(maxWidth, store);
      };
    },
    [maxWidth]
  );

  const getSnapshot = useCallback(() => {
    const store = getOrCreateStore(maxWidth);
    return store ? store.mql.matches : false;
  }, [maxWidth]);

  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
