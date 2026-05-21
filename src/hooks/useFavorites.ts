"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "aribri-menu-favorites-v2";
const LEGACY_STORAGE_KEY = "aribri-menu-favorites";

export type FavoriteEntry = {
  id: string;
  quantity: number;
};

function normalizeEntries(raw: unknown): FavoriteEntry[] {
  if (!Array.isArray(raw)) return [];

  if (raw.every((entry) => typeof entry === "string")) {
    return (raw as string[]).map((id) => ({ id, quantity: 1 }));
  }

  return raw
    .filter(
      (entry): entry is FavoriteEntry =>
        typeof entry === "object" &&
        entry !== null &&
        typeof (entry as FavoriteEntry).id === "string" &&
        typeof (entry as FavoriteEntry).quantity === "number",
    )
    .map((entry) => ({
      id: entry.id,
      quantity: Math.max(1, Math.floor(entry.quantity)),
    }));
}

function loadStoredFavorites(): FavoriteEntry[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return normalizeEntries(JSON.parse(stored));
    }

    const legacy = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (legacy) {
      const migrated = normalizeEntries(JSON.parse(legacy));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
      localStorage.removeItem(LEGACY_STORAGE_KEY);
      return migrated;
    }
  } catch {
    return [];
  }

  return [];
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteEntry[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setFavorites(loadStoredFavorites());
    setReady(true);
  }, []);

  const persist = useCallback((next: FavoriteEntry[]) => {
    setFavorites(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  const toggleFavorite = useCallback(
    (id: string) => {
      persist(
        favorites.some((entry) => entry.id === id)
          ? favorites.filter((entry) => entry.id !== id)
          : [...favorites, { id, quantity: 1 }],
      );
    },
    [favorites, persist],
  );

  const setQuantity = useCallback(
    (id: string, quantity: number) => {
      if (quantity <= 0) {
        persist(favorites.filter((entry) => entry.id !== id));
        return;
      }

      persist(
        favorites.map((entry) =>
          entry.id === id
            ? { ...entry, quantity: Math.min(99, Math.floor(quantity)) }
            : entry,
        ),
      );
    },
    [favorites, persist],
  );

  const clearFavorites = useCallback(() => {
    persist([]);
  }, [persist]);

  const isFavorite = useCallback(
    (id: string) => favorites.some((entry) => entry.id === id),
    [favorites],
  );

  const getQuantity = useCallback(
    (id: string) =>
      favorites.find((entry) => entry.id === id)?.quantity ?? 0,
    [favorites],
  );

  const favoriteIds = useMemo(
    () => favorites.map((entry) => entry.id),
    [favorites],
  );

  const totalQuantity = useMemo(
    () => favorites.reduce((total, entry) => total + entry.quantity, 0),
    [favorites],
  );

  return {
    favorites,
    favoriteIds,
    totalQuantity,
    ready,
    toggleFavorite,
    setQuantity,
    clearFavorites,
    isFavorite,
    getQuantity,
  };
}
