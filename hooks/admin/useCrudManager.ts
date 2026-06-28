"use client";

import { useMemo, useState } from "react";

export function useCrudManager<T extends { id?: string }>(initialItems: T[]) {
  const [items, setItems] = useState<T[]>(initialItems);
  const [dirty, setDirty] = useState(false);

  const actions = useMemo(
    () => ({
      setAll(next: T[]) {
        setItems(next);
        setDirty(true);
      },
      add(item: T) {
        setItems((prev) => [...prev, item]);
        setDirty(true);
      },
      updateAt(index: number, patch: Partial<T>) {
        setItems((prev) => prev.map((item, i) => (i === index ? { ...item, ...patch } : item)));
        setDirty(true);
      },
      removeAt(index: number) {
        setItems((prev) => prev.filter((_, i) => i !== index));
        setDirty(true);
      },
      reorder(from: number, to: number) {
        setItems((prev) => {
          const next = [...prev];
          const [moved] = next.splice(from, 1);
          next.splice(to, 0, moved);
          return next;
        });
        setDirty(true);
      },
      reset(next: T[]) {
        setItems(next);
        setDirty(false);
      },
    }),
    []
  );

  return { items, setItems, dirty, setDirty, ...actions };
}
