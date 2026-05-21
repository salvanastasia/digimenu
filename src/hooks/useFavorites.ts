"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "aribri-menu-favorites";

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setFavorites(JSON.parse(stored) as string[]);
      }
    } catch {
      setFavorites([]);
    } finally {
      setReady(true);
    }
  }, []);

  const persist = useCallback((next: string[]) => {
    setFavorites(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  const toggleFavorite = useCallback(
    (id: string) => {
      persist(
        favorites.includes(id)
          ? favorites.filter((itemId) => itemId !== id)
          : [...favorites, id],
      );
    },
    [favorites, persist],
  );

  const isFavorite = useCallback(
    (id: string) => favorites.includes(id),
    [favorites],
  );

  return { favorites, ready, toggleFavorite, isFavorite };
}
