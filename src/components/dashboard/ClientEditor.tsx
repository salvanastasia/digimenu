"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ALLERGENS } from "@/data/allergens";
import {
  BrandLinkedColorField,
  LogoUploadField,
} from "@/components/dashboard/BrandLinkedColorField";
import { AiDescriptionButton } from "@/components/dashboard/AiDescriptionButton";
import { AiSparklesIcon } from "@/components/dashboard/AiSparklesIcon";
import { ConfirmDialog } from "@/components/dashboard/ConfirmDialog";
import { ClientVersionBar } from "@/components/dashboard/ClientVersionBar";
import { SettingsToggle } from "@/components/dashboard/SettingsToggle";
import {
  ColorField,
  Section,
  SelectField,
  TextField,
} from "@/components/dashboard/DashboardFields";
import { FONT_OPTIONS, SUBTITLE_MAX_LENGTH } from "@/lib/client-defaults";
import { ClientLogo } from "@/components/ClientLogo";
import {
  getBrandLabelForHeaderColor,
  getEffectiveHeader,
  getLogoColorMode,
  getLogoColorStatusLabel,
} from "@/lib/client-header";
import { createPrefixedId } from "@/lib/create-id";
import { ensureUniqueSlug, slugify } from "@/lib/client-slug";
import {
  getCategoryName,
  getCategoryNamePlaceholder,
  getDishField,
  getDishFieldPlaceholder,
  getSubtitle,
  getSubtitlePlaceholder,
  setCategoryName,
  setDishField,
  setSubtitle,
} from "@/lib/client-translation-edit";
import {
  formatStaleFieldsLabel,
  getOutdatedKeys,
  getStaleTranslationSummary,
} from "@/lib/client-translation-payload";
import { LANGUAGES } from "@/lib/languages";
import { EditingLocaleFlagPicker } from "@/components/dashboard/EditingLocaleFlagPicker";
import { TranslationProgressBar } from "@/components/dashboard/TranslationProgressBar";
import { useMenuTranslation } from "@/hooks/useMenuTranslation";
import type { ClientAssetKind } from "@/lib/instant-file-storage";
import type {
  ClientConfig,
  ClientDish,
  FavoritesViewMode,
  HeaderBackgroundMode,
  HeaderColorKey,
  MenuTheme,
} from "@/types/client";
import type { Locale } from "@/types/translation";

type ClientEditorProps = {
  client: ClientConfig;
  adminEmail?: string;
  otherSlugs: string[];
  onChange: (client: ClientConfig) => void;
  onBack: () => void;
  onDelete: () => void;
  canDelete: boolean;
  canRemoveCategory: boolean;
  onAssetFileSelect: (kind: ClientAssetKind, file: File) => void;
  onAssetRemove: (kind: ClientAssetKind) => void;
  onAssetUrlChange: (kind: ClientAssetKind, url: string) => void;
  versionIndex: number;
  versionCount: number;
  versionSavedAt?: string;
  onPreviousVersion: () => void;
  onNextVersion: () => void;
  onRestoreVersion: () => void;
  isDirty: boolean;
  saveStatus: "idle" | "saved";
  saveError: string | null;
  isSaving: boolean;
  onSave: () => void;
};

type ConfirmState = {
  title: string;
  message: string;
  confirmLabel: string;
  confirmationPhrase?: string;
  onConfirm: () => void;
};

const MOVE_HIGHLIGHT_MS = 1200;

function getScrollHighlightDelay(element: HTMLElement) {
  const rect = element.getBoundingClientRect();
  const elementCenter = rect.top + rect.height / 2;
  const viewportCenter = window.innerHeight / 2;
  const distance = Math.abs(elementCenter - viewportCenter);
  return Math.min(Math.max(Math.round(distance * 0.6), 200), 1000);
}

function createDishId() {
  return createPrefixedId("dish");
}

function createCategoryId() {
  return createPrefixedId("cat");
}

export function ClientEditor({
  client,
  adminEmail = "",
  otherSlugs,
  onChange,
  onBack,
  onDelete,
  canDelete,
  canRemoveCategory,
  onAssetFileSelect,
  onAssetRemove,
  onAssetUrlChange,
  versionIndex,
  versionCount,
  versionSavedAt,
  onPreviousVersion,
  onNextVersion,
  onRestoreVersion,
  isDirty,
  saveStatus,
  saveError,
  isSaving,
  onSave,
}: ClientEditorProps) {
  const [confirm, setConfirm] = useState<ConfirmState | null>(null);
  const [editingLocale, setEditingLocale] = useState<Locale>("it");
  const [generatingDescriptionFor, setGeneratingDescriptionFor] = useState<
    string | null
  >(null);
  const [generatingAllDescriptions, setGeneratingAllDescriptions] =
    useState(false);
  const [generatingAllergensFor, setGeneratingAllergensFor] = useState<
    string | null
  >(null);
  const [generatingAllAllergens, setGeneratingAllAllergens] = useState(false);
  const [descriptionAiError, setDescriptionAiError] = useState<string | null>(
    null,
  );
  const [allergenAiError, setAllergenAiError] = useState<string | null>(null);
  const [expandedCategoryIds, setExpandedCategoryIds] = useState<Set<string>>(
    () => new Set(),
  );
  const [orderingCategoryIds, setOrderingCategoryIds] = useState<Set<string>>(
    () => new Set(),
  );
  const [movedCategoryHighlightId, setMovedCategoryHighlightId] = useState<
    string | null
  >(null);
  const [highlightedDishId, setHighlightedDishId] = useState<string | null>(
    null,
  );
  const [openCategoryMenuId, setOpenCategoryMenuId] = useState<string | null>(
    null,
  );
  const prevCategoryIdsRef = useRef<Set<string>>(new Set());
  const movedCategoryHighlightTimeoutRef = useRef<ReturnType<
    typeof setTimeout
  > | null>(null);
  const dishHighlightTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const pendingNewDishIdRef = useRef<string | null>(null);
  const {
    translate,
    isTranslating,
    isTranslationSuccess,
    error: translationError,
    progress,
    resetFeedback,
  } = useMenuTranslation();
  const effectiveHeader = getEffectiveHeader(client);

  useEffect(() => {
    const currentIds = new Set(client.categories.map((category) => category.id));
    const previousIds = prevCategoryIdsRef.current;

    setExpandedCategoryIds((current) => {
      const next = new Set(current);
      for (const id of next) {
        if (!currentIds.has(id)) {
          next.delete(id);
        }
      }
      if (previousIds.size > 0) {
        for (const category of client.categories) {
          if (!previousIds.has(category.id)) {
            next.add(category.id);
          }
        }
      }
      return next;
    });

    setOrderingCategoryIds((current) => {
      const next = new Set(current);
      for (const id of next) {
        if (!currentIds.has(id)) {
          next.delete(id);
        }
      }
      return next;
    });

    prevCategoryIdsRef.current = currentIds;
  }, [client.categories]);

  useEffect(() => {
    return () => {
      if (movedCategoryHighlightTimeoutRef.current) {
        clearTimeout(movedCategoryHighlightTimeoutRef.current);
      }
      if (dishHighlightTimeoutRef.current) {
        clearTimeout(dishHighlightTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const dishId = pendingNewDishIdRef.current;
    if (!dishId) return;
    if (!client.dishes.some((dish) => dish.id === dishId)) return;

    pendingNewDishIdRef.current = null;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const element = document.getElementById(`dish-${dishId}`);
        if (!element) return;

        const scrollDelay = getScrollHighlightDelay(element);
        element.scrollIntoView({ behavior: "smooth", block: "center" });

        if (dishHighlightTimeoutRef.current) {
          clearTimeout(dishHighlightTimeoutRef.current);
        }

        dishHighlightTimeoutRef.current = setTimeout(() => {
          setHighlightedDishId(null);
          requestAnimationFrame(() => {
            setHighlightedDishId(dishId);
            dishHighlightTimeoutRef.current = setTimeout(() => {
              setHighlightedDishId(null);
              dishHighlightTimeoutRef.current = null;
            }, MOVE_HIGHLIGHT_MS);
          });
        }, scrollDelay);
      });
    });
  }, [client.dishes]);

  const triggerCategoryMoveHighlight = (categoryId: string) => {
    if (movedCategoryHighlightTimeoutRef.current) {
      clearTimeout(movedCategoryHighlightTimeoutRef.current);
    }

    setMovedCategoryHighlightId(null);
    requestAnimationFrame(() => {
      setMovedCategoryHighlightId(categoryId);
      movedCategoryHighlightTimeoutRef.current = setTimeout(() => {
        setMovedCategoryHighlightId(null);
        movedCategoryHighlightTimeoutRef.current = null;
      }, MOVE_HIGHLIGHT_MS);
    });
  };

  const toggleCategoryExpanded = (categoryId: string) => {
    if (expandedCategoryIds.has(categoryId)) {
      setOpenCategoryMenuId((current) =>
        current === categoryId ? null : current,
      );
    }
    setExpandedCategoryIds((current) => {
      const next = new Set(current);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
    setOrderingCategoryIds((current) => {
      if (!current.has(categoryId)) {
        return current;
      }
      const next = new Set(current);
      next.delete(categoryId);
      return next;
    });
  };

  const toggleCategoryOrdering = (categoryId: string) => {
    setOrderingCategoryIds((current) => {
      const next = new Set(current);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
    setExpandedCategoryIds((current) => {
      const next = new Set(current);
      next.add(categoryId);
      return next;
    });
  };

  const translationTargets = useMemo(
    () =>
      client.header.languages.filter(
        (locale): locale is Exclude<Locale, "it"> => locale !== "it",
      ),
    [client.header.languages],
  );

  const editingLocales = useMemo<Locale[]>(
    () => ["it", ...translationTargets],
    [translationTargets],
  );

  const staleSummary = useMemo(
    () => getStaleTranslationSummary(client),
    [client],
  );

  const staleFieldLocales = useMemo(
    () => staleSummary.locales.map((entry) => entry.locale),
    [staleSummary],
  );

  const outdatedFieldCount = staleSummary.totalFields;

  const isDishAiBusy =
    generatingDescriptionFor !== null ||
    generatingAllDescriptions ||
    generatingAllergensFor !== null ||
    generatingAllAllergens;

  const dishStats = useMemo(() => {
    const dishCount = client.dishes.length;
    let missingDescriptions = 0;
    const translatableDishIds: string[] = [];

    for (const dish of client.dishes) {
      const name = getDishField(client, "it", dish.id, "name").trim();
      const description = getDishField(
        client,
        "it",
        dish.id,
        "description",
      ).trim();

      if (name.length === 0) continue;

      translatableDishIds.push(dish.id);
      if (description.length === 0) {
        missingDescriptions += 1;
      }
    }

    const totalTranslationSlots =
      translatableDishIds.length * translationTargets.length;
    let translatedSlots = 0;

    for (const locale of translationTargets) {
      const outdatedItemIds = new Set(
        getOutdatedKeys(client, locale)
          .filter((key) => key.kind === "item")
          .map((key) => key.id),
      );

      for (const dishId of translatableDishIds) {
        if (!outdatedItemIds.has(dishId)) {
          translatedSlots += 1;
        }
      }
    }

    const translationPercent =
      totalTranslationSlots === 0
        ? null
        : Math.round((translatedSlots / totalTranslationSlots) * 100);

    return {
      dishCount,
      missingDescriptions,
      translationPercent,
    };
  }, [client, translationTargets]);

  const canTranslate =
    Boolean(adminEmail) &&
    translationTargets.length > 0 &&
    outdatedFieldCount > 0;

  useEffect(() => {
    if (
      editingLocale !== "it" &&
      !translationTargets.includes(editingLocale as Exclude<Locale, "it">)
    ) {
      setEditingLocale("it");
    }
  }, [editingLocale, translationTargets]);

  const update = (patch: Partial<ClientConfig>) => {
    onChange({ ...client, ...patch });
  };

  const updateName = (name: string) => {
    const slug = ensureUniqueSlug(slugify(name), otherSlugs, client.slug);
    update({ name, slug });
  };

  const updateBrand = (patch: Partial<ClientConfig["brand"]>) => {
    onChange({
      ...client,
      brand: { ...client.brand, ...patch },
    });
  };

  const updateHeader = (patch: Partial<ClientConfig["header"]>) => {
    onChange({
      ...client,
      header: { ...client.header, ...patch },
    });
  };

  const updateCustomizations = (
    patch: Partial<ClientConfig["customizations"]>,
  ) => {
    onChange({
      ...client,
      customizations: { ...client.customizations, ...patch },
    });
  };

  const setHeaderOverride = (key: HeaderColorKey, value: string) => {
    updateHeader({
      colorOverrides: {
        ...client.header.colorOverrides,
        [key]: value,
      },
    });
  };

  const resetHeaderOverride = (key: HeaderColorKey) => {
    const nextOverrides = { ...client.header.colorOverrides };
    delete nextOverrides[key];
    updateHeader({ colorOverrides: nextOverrides });
  };

  const toggleLanguage = (locale: Locale) => {
    const languages = client.header.languages.includes(locale)
      ? client.header.languages.filter((value) => value !== locale)
      : [...client.header.languages, locale];
    updateHeader({ languages });
  };

  const updateDish = (dishId: string, patch: Partial<ClientDish>) => {
    update({
      dishes: client.dishes.map((dish) =>
        dish.id === dishId ? { ...dish, ...patch } : dish,
      ),
    });
  };

  const addDish = (categoryId: string) => {
    const dishId = createDishId();
    pendingNewDishIdRef.current = dishId;
    if (dishHighlightTimeoutRef.current) {
      clearTimeout(dishHighlightTimeoutRef.current);
      dishHighlightTimeoutRef.current = null;
    }
    setHighlightedDishId(null);
    setExpandedCategoryIds((current) => {
      const next = new Set(current);
      next.add(categoryId);
      return next;
    });
    setOrderingCategoryIds((current) => {
      if (!current.has(categoryId)) {
        return current;
      }
      const next = new Set(current);
      next.delete(categoryId);
      return next;
    });
    update({
      dishes: [
        ...client.dishes,
        {
          id: dishId,
          categoryId,
          name: "",
          description: "",
          price: null,
          allergenIds: [],
        },
      ],
    });
  };

  const removeDish = (dishId: string) => {
    update({
      dishes: client.dishes.filter((dish) => dish.id !== dishId),
    });
  };

  const addCategory = () => {
    const categoryId = createCategoryId();
    update({
      categories: [...client.categories, { id: categoryId, name: "Nuova categoria" }],
      dishes: [
        ...client.dishes,
        {
          id: createDishId(),
          categoryId,
          name: "",
          description: "",
          price: null,
          allergenIds: [],
        },
      ],
    });
  };

  const removeCategory = (categoryId: string) => {
    if (!canRemoveCategory) return;
    update({
      categories: client.categories.filter(
        (category) => category.id !== categoryId,
      ),
      dishes: client.dishes.filter((dish) => dish.categoryId !== categoryId),
    });
  };

  const moveCategory = (categoryId: string, direction: -1 | 1) => {
    const index = client.categories.findIndex(
      (category) => category.id === categoryId,
    );
    if (index === -1) return;

    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= client.categories.length) return;

    const categories = [...client.categories];
    const [moved] = categories.splice(index, 1);
    categories.splice(targetIndex, 0, moved);
    update({ categories });
    triggerCategoryMoveHighlight(categoryId);
  };

  const moveDish = (
    categoryId: string,
    dishId: string,
    direction: -1 | 1,
  ) => {
    const categoryDishes = client.dishes.filter(
      (dish) => dish.categoryId === categoryId,
    );
    const index = categoryDishes.findIndex((dish) => dish.id === dishId);
    if (index === -1) return;

    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= categoryDishes.length) return;

    const reorderedCategoryDishes = [...categoryDishes];
    const [moved] = reorderedCategoryDishes.splice(index, 1);
    reorderedCategoryDishes.splice(targetIndex, 0, moved);

    const dishes = client.categories.flatMap((category) =>
      category.id === categoryId
        ? reorderedCategoryDishes
        : client.dishes.filter((dish) => dish.categoryId === category.id),
    );

    update({ dishes });
  };

  const removeAllDishes = () => {
    update({ dishes: [] });
  };

  const fetchDishDescription = async (
    dishName: string,
    categoryName: string,
  ) => {
    const response = await fetch("/api/generate-dish-description", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: adminEmail,
        dishName: dishName.trim(),
        categoryName,
        restaurantName: client.name,
      }),
    });

    const payload = (await response.json()) as {
      description?: string;
      error?: string;
    };

    if (!response.ok || !payload.description) {
      throw new Error(payload.error ?? "Generazione descrizione non riuscita.");
    }

    return payload.description;
  };

  const generateDishDescription = async (
    dishId: string,
    dishName: string,
    categoryName: string,
  ) => {
    if (!adminEmail || !dishName.trim()) return;

    setGeneratingDescriptionFor(dishId);
    setDescriptionAiError(null);

    try {
      const description = await fetchDishDescription(dishName, categoryName);
      onChange(
        setDishField(client, "it", dishId, "description", description),
      );
    } catch (error) {
      setDescriptionAiError(
        error instanceof Error
          ? error.message
          : "Generazione descrizione non riuscita.",
      );
    } finally {
      setGeneratingDescriptionFor(null);
    }
  };

  const generateAllDescriptions = async () => {
    if (!adminEmail || editingLocale !== "it") return;

    const categoryNames = new Map(
      client.categories.map((category) => [category.id, category.name]),
    );

    const targets = client.dishes.filter((dish) => {
      const name = getDishField(client, "it", dish.id, "name").trim();
      const description = getDishField(
        client,
        "it",
        dish.id,
        "description",
      ).trim();
      return name.length > 0 && description.length === 0;
    });

    if (targets.length === 0) {
      setDescriptionAiError("Nessun piatto con nome e senza descrizione.");
      return;
    }

    setGeneratingAllDescriptions(true);
    setDescriptionAiError(null);

    let nextClient = client;

    try {
      for (const dish of targets) {
        const dishName = getDishField(nextClient, "it", dish.id, "name");
        const categoryName = categoryNames.get(dish.categoryId) ?? "";
        const description = await fetchDishDescription(dishName, categoryName);
        nextClient = setDishField(
          nextClient,
          "it",
          dish.id,
          "description",
          description,
        );
        onChange(nextClient);
      }
    } catch (error) {
      setDescriptionAiError(
        error instanceof Error
          ? error.message
          : "Generazione descrizioni non riuscita.",
      );
    } finally {
      setGeneratingAllDescriptions(false);
    }
  };

  const fetchDishAllergens = async (
    dishName: string,
    dishDescription: string,
    categoryName: string,
  ) => {
    const response = await fetch("/api/generate-dish-allergens", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: adminEmail,
        dishName: dishName.trim(),
        dishDescription,
        categoryName,
      }),
    });

    const payload = (await response.json()) as {
      allergenIds?: number[];
      error?: string;
    };

    if (!response.ok || !payload.allergenIds) {
      throw new Error(payload.error ?? "Generazione allergeni non riuscita.");
    }

    return payload.allergenIds;
  };

  const generateDishAllergens = async (
    dishId: string,
    dishName: string,
    dishDescription: string,
    categoryName: string,
  ) => {
    if (!adminEmail || !dishName.trim()) return;

    setGeneratingAllergensFor(dishId);
    setAllergenAiError(null);

    try {
      const allergenIds = await fetchDishAllergens(
        dishName,
        dishDescription,
        categoryName,
      );
      updateDish(dishId, { allergenIds });
    } catch (error) {
      setAllergenAiError(
        error instanceof Error
          ? error.message
          : "Generazione allergeni non riuscita.",
      );
    } finally {
      setGeneratingAllergensFor(null);
    }
  };

  const generateAllAllergens = async () => {
    if (!adminEmail || editingLocale !== "it") return;

    const categoryNames = new Map(
      client.categories.map((category) => [category.id, category.name]),
    );

    const targets = client.dishes.filter((dish) => {
      const name = getDishField(client, "it", dish.id, "name").trim();
      return name.length > 0 && dish.allergenIds.length === 0;
    });

    if (targets.length === 0) {
      setAllergenAiError("Nessun piatto con nome e senza allergeni impostati.");
      return;
    }

    setGeneratingAllAllergens(true);
    setAllergenAiError(null);

    let nextClient = client;

    try {
      for (const dish of targets) {
        const dishName = getDishField(nextClient, "it", dish.id, "name");
        const dishDescription = getDishField(
          nextClient,
          "it",
          dish.id,
          "description",
        );
        const categoryName = categoryNames.get(dish.categoryId) ?? "";
        const allergenIds = await fetchDishAllergens(
          dishName,
          dishDescription,
          categoryName,
        );
        nextClient = {
          ...nextClient,
          dishes: nextClient.dishes.map((entry) =>
            entry.id === dish.id ? { ...entry, allergenIds } : entry,
          ),
        };
        onChange(nextClient);
      }
    } catch (error) {
      setAllergenAiError(
        error instanceof Error
          ? error.message
          : "Generazione allergeni non riuscita.",
      );
    } finally {
      setGeneratingAllAllergens(false);
    }
  };

  const headerColorFields: Array<{
    key: HeaderColorKey;
    label: string;
  }> = [
    { key: "fabBackground", label: "FAB background" },
    { key: "fabIconColor", label: "FAB icon color" },
  ];

  const backgroundMode = client.header.backgroundMode ?? "color";
  const logoColorMode = getLogoColorMode(client);

  return (
    <div className="space-y-6">
      <ConfirmDialog
        open={confirm !== null}
        title={confirm?.title ?? ""}
        message={confirm?.message ?? ""}
        confirmLabel={confirm?.confirmLabel}
        confirmationPhrase={confirm?.confirmationPhrase}
        destructive
        onCancel={() => setConfirm(null)}
        onConfirm={() => {
          confirm?.onConfirm();
          setConfirm(null);
        }}
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center py-2 text-[0.88rem] font-semibold leading-none text-[#560200] transition-colors hover:text-[#6d0200]"
        >
          ← Dashboard
        </button>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => update({ hidden: !client.hidden })}
            className={`rounded-full border px-4 py-2 text-[0.88rem] font-semibold transition-colors ${
              client.hidden
                ? "border-[#560200] bg-[#560200]/8 text-[#560200]"
                : "border-[#d8dadc] bg-white text-[#141415] hover:bg-[#f5f5f5]"
            }`}
          >
            {client.hidden ? "Mostra cliente" : "Nascondi cliente"}
          </button>
          {canDelete ? (
            <button
              type="button"
              onClick={() =>
                setConfirm({
                  title: "Elimina cliente",
                  message: `Eliminare "${client.name}"? L'operazione non può essere annullata.`,
                  confirmLabel: "Elimina",
                  confirmationPhrase: client.name,
                  onConfirm: onDelete,
                })
              }
              className="rounded-full border border-[#d8dadc] bg-white px-4 py-2 text-[0.88rem] font-semibold text-[#8a1f1f] transition-colors hover:bg-[#fff1f1]"
            >
              Elimina cliente
            </button>
          ) : null}
        </div>
      </div>

      <ClientVersionBar
        versionIndex={versionIndex}
        versionCount={versionCount}
        versionSavedAt={versionSavedAt}
        onPrevious={onPreviousVersion}
        onNext={onNextVersion}
        onRestoreVersion={onRestoreVersion}
        isDirty={isDirty}
        saveStatus={saveStatus}
        saveError={saveError}
        isSaving={isSaving}
        onSave={onSave}
        menuSlug={client.slug}
        menuHidden={client.hidden}
        translationStaleFields={outdatedFieldCount}
      />

      <div className="rounded-[18px] border border-[#e4e4e4] bg-white p-5">
        <TextField
          label="Nome cliente"
          value={client.name}
          onChange={updateName}
          placeholder="Es. aribrì"
        />
        <div className="mt-4">
          <p className="text-[0.78rem] font-semibold text-[#606060]">URL menu</p>
          <p className="mt-1.5 text-[0.92rem] font-medium text-[#141415]">
            <code className="rounded bg-[#f5f5f5] px-1.5 py-0.5">
              /{client.slug || "slug"}
            </code>
          </p>
          <p className="mt-1.5 text-[0.78rem] text-[#606060]">
            Generato automaticamente dal nome cliente.
            {client.hidden
              ? " Il menu pubblico è disattivato finché il cliente resta nascosto."
              : " Il menu sarà disponibile su questo indirizzo dopo il salvataggio."}
          </p>
        </div>
      </div>

      <Section title="Brand">
        <div className="grid gap-4 sm:grid-cols-2">
          <ColorField
            label="Colore primario"
            value={client.brand.primaryColor}
            onChange={(primaryColor) => updateBrand({ primaryColor })}
          />
          <ColorField
            label="Colore secondario"
            value={client.brand.secondaryColor}
            onChange={(secondaryColor) => updateBrand({ secondaryColor })}
          />
        </div>
        <SelectField
          label="Font family"
          value={client.brand.fontFamily}
          onChange={(fontFamily) => updateBrand({ fontFamily })}
          options={FONT_OPTIONS}
        />
      </Section>

      <Section
        title="Header"
        headerRight={
          <EditingLocaleFlagPicker
            value={editingLocale}
            onChange={setEditingLocale}
            locales={editingLocales}
            staleLocales={staleFieldLocales}
          />
        }
      >
        <TextField
          label="Slogan"
          value={getSubtitle(client, editingLocale)}
          onChange={(subtitle) => onChange(setSubtitle(client, editingLocale, subtitle))}
          placeholder={
            editingLocale === "it"
              ? "Ristorante · Pizzeria · B&B"
              : getSubtitlePlaceholder(client)
          }
          maxLength={SUBTITLE_MAX_LENGTH}
          hint={
            editingLocale === "it"
              ? `Massimo ${SUBTITLE_MAX_LENGTH} caratteri per restare su una riga su mobile.`
              : `Italiano: ${getSubtitlePlaceholder(client) || "—"}`
          }
        />

        <LogoUploadField
          label="Logo"
          value={client.header.logoUrl}
          onFileSelect={(file) => onAssetFileSelect("logo", file)}
          onRemove={() => onAssetRemove("logo")}
          onUrlChange={(logoUrl) => onAssetUrlChange("logo", logoUrl)}
        />

        <div>
          <p className="mb-2 text-[0.78rem] font-semibold text-[#606060]">
            Sfondo header
          </p>
          <div className="flex flex-wrap gap-2">
            {(
              [
                { value: "color", label: "Colore" },
                { value: "image", label: "Foto" },
              ] as const
            ).map((option) => {
              const active = backgroundMode === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() =>
                    updateHeader({
                      backgroundMode: option.value as HeaderBackgroundMode,
                    })
                  }
                  className={`rounded-full border px-4 py-2 text-[0.82rem] font-semibold transition-colors ${
                    active
                      ? "border-[#560200] bg-[#560200]/8 text-[#560200]"
                      : "border-[#d8dadc] bg-white text-[#606060] hover:bg-[#f5f5f5]"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        {backgroundMode === "image" ? (
          <LogoUploadField
            label="Foto header"
            value={client.header.backgroundImageUrl}
            onFileSelect={(file) => onAssetFileSelect("header", file)}
            onRemove={() => onAssetRemove("header")}
            onUrlChange={(backgroundImageUrl) =>
              onAssetUrlChange("header", backgroundImageUrl)
            }
          />
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2">
          {backgroundMode === "color" ? (
            <BrandLinkedColorField
              label="Background header"
              brandLabel={getBrandLabelForHeaderColor("backgroundColor")}
              value={effectiveHeader.backgroundColor}
              isCustom={
                client.header.colorOverrides.backgroundColor !== undefined
              }
              onApplyCustom={(value) =>
                setHeaderOverride("backgroundColor", value)
              }
              onReset={() => resetHeaderOverride("backgroundColor")}
            />
          ) : null}
          <div className="flex flex-col gap-3 sm:col-span-2">
            <BrandLinkedColorField
              label="Colore logo (SVG)"
              brandLabel={getBrandLabelForHeaderColor("logoColor")}
              value={effectiveHeader.logoColor}
              isCustom={logoColorMode === "custom"}
              statusLabel={getLogoColorStatusLabel(logoColorMode)}
              onApplyCustom={(value) => setHeaderOverride("logoColor", value)}
              onReset={() =>
                setHeaderOverride("logoColor", client.brand.secondaryColor)
              }
              labelReset={{
                label: "Reset",
                onClick: () => resetHeaderOverride("logoColor"),
                visible: logoColorMode !== "original",
              }}
              hint={
                logoColorMode === "original"
                  ? "Nessun colore impostato — il logo usa i colori originali del file SVG."
                  : undefined
              }
            />
            <div
              className="flex items-center rounded-[10px] border border-[#d8dadc] px-4 py-3"
              style={{ backgroundColor: effectiveHeader.backgroundColor }}
            >
              <ClientLogo
                client={client}
                logoUrl={effectiveHeader.logoUrl}
                logoColor={effectiveHeader.logoColor}
                alt={`Anteprima logo ${client.name}`}
              />
            </div>
          </div>
          {headerColorFields.map(({ key, label }) => (
            <BrandLinkedColorField
              key={key}
              label={label}
              brandLabel={getBrandLabelForHeaderColor(key)}
              value={effectiveHeader[key]}
              isCustom={client.header.colorOverrides[key] !== undefined}
              onApplyCustom={(value) => setHeaderOverride(key, value)}
              onReset={() => resetHeaderOverride(key)}
            />
          ))}
        </div>

        <div>
          <p className="mb-2 text-[0.78rem] font-semibold text-[#606060]">Lingue</p>
          <div className="flex flex-wrap gap-2">
            {LANGUAGES.map((language) => {
              const active = client.header.languages.includes(language.locale);
              return (
                <label
                  key={language.locale}
                  className={`flex cursor-pointer items-center gap-2 rounded-full border px-3 py-2 text-[0.82rem] font-medium transition-colors ${
                    active
                      ? "border-[#560200] bg-[#560200]/8 text-[#560200]"
                      : "border-[#d8dadc] bg-white text-[#606060]"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={active}
                    onChange={() => toggleLanguage(language.locale)}
                    className="sr-only"
                  />
                  {language.label}
                </label>
              );
            })}
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              type="button"
              disabled={!canTranslate || isTranslating}
              onClick={() => {
                resetFeedback();
                void translate({
                  client,
                  email: adminEmail,
                  onSuccess: onChange,
                });
              }}
              className="rounded-full bg-[#560200] px-4 py-2 text-[0.82rem] font-semibold text-white transition-colors hover:bg-[#6d0200] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isTranslating
                ? "Traduzione…"
                : outdatedFieldCount > 0
                  ? `Traduci (${outdatedFieldCount} ${outdatedFieldCount === 1 ? "campo" : "campi"})`
                  : "Traduci"}
            </button>
            {isTranslationSuccess && !isTranslating ? (
              <span className="text-[0.78rem] font-medium text-[#1f6b3a]">
                ✅ Traduzioni aggiornate
              </span>
            ) : null}
            {!adminEmail ? (
              <span className="text-[0.72rem] text-[#606060]">
                Accedi per tradurre il menu.
              </span>
            ) : null}
          </div>
          {progress ? <TranslationProgressBar progress={progress} /> : null}
          {translationError ? (
            <p className="mt-2 text-[0.72rem] font-medium text-[#8a1f1f]">
              {translationError}
            </p>
          ) : null}
          {staleSummary.locales.length > 0 ? (
            <div className="mt-2 space-y-1 text-[0.72rem] leading-snug text-[#606060]">
              {staleSummary.locales.map((entry) => (
                <p key={entry.locale}>
                  <span className="font-semibold text-amber-800">
                    {LANGUAGES.find((lang) => lang.locale === entry.locale)
                      ?.label ?? entry.locale}
                    :
                  </span>{" "}
                  {formatStaleFieldsLabel(entry)}
                </p>
              ))}
              <p>Premi Traduci per aggiornare solo i campi modificati in italiano.</p>
            </div>
          ) : null}
        </div>
      </Section>

      <Section title="Informazioni">
        <TextField
          label="Indirizzo"
          value={client.address}
          onChange={(address) => update({ address })}
          placeholder="Via Taranto 38, San Pancrazio Salentino (BR)"
        />
        <TextField
          label="Telefono"
          value={client.phone}
          onChange={(phone) => update({ phone })}
          placeholder="+39 338 458 4834"
        />
        <label className="flex flex-col gap-1.5">
          <span className="text-[0.78rem] font-semibold text-[#606060]">
            Servizio al tavolo (€)
          </span>
          <input
            type="number"
            min="0"
            step="0.5"
            value={client.tableServiceFee ?? ""}
            onChange={(event) =>
              update({
                tableServiceFee:
                  event.target.value === ""
                    ? null
                    : Number(event.target.value),
              })
            }
            className="rounded-[10px] border border-[#d8dadc] bg-white px-3 py-2 text-[0.92rem] text-[#141415] outline-none focus:border-[#560200]"
          />
          <span className="text-[0.72rem] leading-snug text-[#606060]">
            Compare nel footer del menu come &quot;Servizio al tavolo: X€&quot;.
          </span>
        </label>
      </Section>

      <Section title="Personalizzazioni">
        <div>
          <p className="mb-2 text-[0.78rem] font-semibold text-[#606060]">
            Tema menu
          </p>
          <div className="flex flex-wrap gap-2">
            {(
              [
                { value: "classic", label: "Classico" },
                { value: "framed", label: "Framed" },
                { value: "framed-big", label: "Framed Big" },
              ] as const
            ).map((option) => {
              const active = client.customizations.menuTheme === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() =>
                    updateCustomizations({
                      menuTheme: option.value as MenuTheme,
                    })
                  }
                  className={`rounded-full border px-4 py-2 text-[0.82rem] font-semibold transition-colors ${
                    active
                      ? "border-[#560200] bg-[#560200]/8 text-[#560200]"
                      : "border-[#d8dadc] bg-white text-[#606060] hover:bg-[#f5f5f5]"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
          <p className="mt-2 text-[0.72rem] leading-snug text-[#606060]">
            Classico mantiene il layout attuale. Framed aggiunge una cornice a
            scacchiera con i colori brand, header urbano e voci menu più
            editoriali. Framed Big usa quadratini più grandi, più padding e le
            quadre con pallino al posto del +/−.
          </p>
        </div>

        <div className="mt-5">
          <p className="mb-2 text-[0.78rem] font-semibold text-[#606060]">
            Vista preferiti
          </p>
          <div className="flex flex-wrap gap-2">
            {(
              [
                { value: "panel", label: "Pannello" },
                { value: "receipt", label: "Scontrino" },
              ] as const
            ).map((option) => {
              const active =
                client.customizations.favoritesView === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() =>
                    updateCustomizations({
                      favoritesView: option.value as FavoritesViewMode,
                    })
                  }
                  className={`rounded-full border px-4 py-2 text-[0.82rem] font-semibold transition-colors ${
                    active
                      ? "border-[#560200] bg-[#560200]/8 text-[#560200]"
                      : "border-[#d8dadc] bg-white text-[#606060] hover:bg-[#f5f5f5]"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
          <p className="mt-2 text-[0.72rem] leading-snug text-[#606060]">
            Scegli se aprire la lista preferiti come pannello con quantità
            modificabili o come scontrino riepilogativo.
          </p>
        </div>

        <div className="mt-5">
          <SettingsToggle
            label="Voci menu (Zebra)"
            hint="Alterna lo sfondo delle voci di categoria all'interno del menu."
            checked={client.customizations.menuZebraRows}
            onChange={(checked) =>
              updateCustomizations({ menuZebraRows: checked })
            }
          />
        </div>

        <div className="mt-5 space-y-5">
          <SettingsToggle
            label="Traduzione nome piatto"
            hint="Disattivato: in altre lingue resta il nome italiano; descrizione e resto del menu restano tradotti."
            checked={client.customizations.translateDishNames}
            onChange={(checked) =>
              updateCustomizations({ translateDishNames: checked })
            }
          />
          <SettingsToggle
            label="Quantità"
            hint="Selettore quantità nel pannello preferiti."
            checked={client.customizations.showFavoritesQuantity}
            onChange={(checked) =>
              updateCustomizations({ showFavoritesQuantity: checked })
            }
          />
          <SettingsToggle
            label="Prezzi"
            hint="Prezzi nel pannello e nello scontrino preferiti."
            checked={client.customizations.showFavoritesPrices}
            onChange={(checked) =>
              updateCustomizations({ showFavoritesPrices: checked })
            }
          />
          <SettingsToggle
            label="Accesso Wi-Fi"
            hint="Mostra un banner nel menu per connettersi alla rete del locale."
            checked={client.customizations.wifiAccess.enabled}
            onChange={(enabled) =>
              updateCustomizations({
                wifiAccess: {
                  ...client.customizations.wifiAccess,
                  enabled,
                },
              })
            }
          />
          {client.customizations.wifiAccess.enabled ? (
            <div className="space-y-3 rounded-[14px] border border-[#ececec] bg-[#fafafa] p-4">
              <TextField
                label="SSID"
                value={client.customizations.wifiAccess.ssid}
                onChange={(ssid) =>
                  updateCustomizations({
                    wifiAccess: {
                      ...client.customizations.wifiAccess,
                      ssid,
                    },
                  })
                }
                placeholder="Nome rete Wi-Fi"
              />
              <TextField
                label="Password"
                type="password"
                value={client.customizations.wifiAccess.password}
                onChange={(password) =>
                  updateCustomizations({
                    wifiAccess: {
                      ...client.customizations.wifiAccess,
                      password,
                    },
                  })
                }
                placeholder="Password rete"
                hint="Lascia vuoto per reti aperte senza password."
              />
            </div>
          ) : null}
        </div>
      </Section>

      <Section
        title="Piatti"
        headerRight={
          <EditingLocaleFlagPicker
            value={editingLocale}
            onChange={setEditingLocale}
            locales={editingLocales}
            staleLocales={staleFieldLocales}
          />
        }
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-[12px] border border-[#ececec] bg-[#fafafa] px-4 py-3">
            <p className="text-[0.72rem] font-semibold text-[#606060]">
              Piatti
            </p>
            <p className="mt-1 text-[1.45rem] font-bold tabular-nums text-[#141415]">
              {dishStats.dishCount}
            </p>
          </div>
          <div className="rounded-[12px] border border-[#ececec] bg-[#fafafa] px-4 py-3">
            <p className="text-[0.72rem] font-semibold text-[#606060]">
              Descrizioni mancanti
            </p>
            <p
              className={`mt-1 text-[1.45rem] font-bold tabular-nums ${
                dishStats.missingDescriptions > 0
                  ? "text-amber-800"
                  : "text-[#141415]"
              }`}
            >
              {dishStats.missingDescriptions}
            </p>
          </div>
          <div className="rounded-[12px] border border-[#ececec] bg-[#fafafa] px-4 py-3">
            <p className="text-[0.72rem] font-semibold text-[#606060]">
              Traduzioni piatti
            </p>
            <p className="mt-1 text-[1.45rem] font-bold tabular-nums text-[#141415]">
              {dishStats.translationPercent === null
                ? "—"
                : `${dishStats.translationPercent}%`}
            </p>
            {dishStats.translationPercent === null ? (
              <p className="mt-1 text-[0.68rem] leading-snug text-[#606060]">
                Nessuna lingua extra attiva
              </p>
            ) : null}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={addCategory}
            disabled={editingLocale !== "it"}
            className="rounded-full border border-[#560200] px-4 py-2 text-[0.82rem] font-semibold text-[#560200] transition-colors hover:bg-[#560200]/5 disabled:cursor-not-allowed disabled:opacity-50"
          >
            + Categoria
          </button>
          {client.dishes.length > 0 ? (
            <>
              <button
                type="button"
                disabled={
                  editingLocale !== "it" ||
                  !adminEmail ||
                  isDishAiBusy
                }
                onClick={() => void generateAllDescriptions()}
                className="inline-flex items-center gap-2 rounded-full border border-[#5b6cff]/35 bg-[#eef0ff] px-4 py-2 text-[0.82rem] font-semibold text-[#5b6cff] transition-colors hover:border-[#5b6cff]/50 hover:bg-[#e3e7ff] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {generatingAllDescriptions ? (
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[#5b6cff]/25 border-t-[#5b6cff]" />
                ) : (
                  <AiSparklesIcon className="h-4 w-4" />
                )}
                Genera Descrizioni
              </button>
              <button
                type="button"
                disabled={
                  editingLocale !== "it" ||
                  !adminEmail ||
                  isDishAiBusy
                }
                onClick={() => void generateAllAllergens()}
                className="inline-flex items-center gap-2 rounded-full border border-[#5b6cff]/35 bg-[#eef0ff] px-4 py-2 text-[0.82rem] font-semibold text-[#5b6cff] transition-colors hover:border-[#5b6cff]/50 hover:bg-[#e3e7ff] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {generatingAllAllergens ? (
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[#5b6cff]/25 border-t-[#5b6cff]" />
                ) : (
                  <AiSparklesIcon className="h-4 w-4" />
                )}
                Genera Allergeni
              </button>
              <button
                type="button"
                disabled={editingLocale !== "it" || isDishAiBusy}
                onClick={() =>
                  setConfirm({
                    title: "Elimina tutti i piatti",
                    message: `Verranno rimossi tutti i ${client.dishes.length} piatti di "${client.name}". Le categorie resteranno invariate.`,
                    confirmLabel: "Elimina tutti i piatti",
                    confirmationPhrase: client.name,
                    onConfirm: removeAllDishes,
                  })
                }
                className="rounded-full border border-[#d8dadc] bg-white px-4 py-2 text-[0.82rem] font-semibold text-[#8a1f1f] transition-colors hover:bg-[#fff1f1] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Elimina tutti i piatti
              </button>
            </>
          ) : null}
        </div>

        {(descriptionAiError || allergenAiError) ? (
          <p className="rounded-[12px] bg-[#fff1f1] px-4 py-3 text-[0.84rem] text-[#8a1f1f]">
            {descriptionAiError ?? allergenAiError}
          </p>
        ) : null}

        <div className="space-y-4">
          {client.categories.map((category, categoryIndex) => {
            const categoryDishes = client.dishes.filter(
              (dish) => dish.categoryId === category.id,
            );
            const isCategoryExpanded = expandedCategoryIds.has(category.id);
            const isOrderingDishes = orderingCategoryIds.has(category.id);
            const categoryName = getCategoryName(
              client,
              editingLocale,
              category.id,
            );
            const canReorderDishes =
              editingLocale === "it" && categoryDishes.length > 1;

            return (
              <div
                key={category.id}
                className={`relative overflow-hidden rounded-[16px] border bg-white shadow-[0_1px_8px_rgba(0,0,0,0.04)] transition-colors ${
                  isCategoryExpanded
                    ? "border-[#560200]/35 ring-1 ring-[#560200]/10"
                    : "border-[#e4e4e4]"
                }`}
              >
                {movedCategoryHighlightId === category.id ? (
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 z-10 animate-category-move-highlight bg-[#560200]/8"
                  />
                ) : null}
                <div
                  className={`flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3 ${
                    isCategoryExpanded
                      ? "border-[#560200]/15 bg-[#560200]/5"
                      : "border-[#ececec] bg-[#fafafa]"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="inline-flex min-w-[2rem] items-center justify-center rounded-full bg-[#560200]/8 px-2.5 py-1 text-[0.78rem] font-bold tabular-nums text-[#560200]">
                      {categoryDishes.length}
                    </span>
                    <span className="text-[0.84rem] font-medium text-[#606060]">
                      {categoryDishes.length === 1 ? "piatto" : "piatti"}
                    </span>
                    {isCategoryExpanded ? (
                      <span className="rounded-full bg-[#560200]/12 px-2.5 py-0.5 text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-[#560200]">
                        In modifica
                      </span>
                    ) : null}
                    {isOrderingDishes ? (
                      <span className="rounded-full bg-[#560200] px-2.5 py-0.5 text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-white">
                        Ordine
                      </span>
                    ) : null}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      aria-expanded={isCategoryExpanded}
                      aria-controls={`category-dishes-${category.id}`}
                      onClick={() => toggleCategoryExpanded(category.id)}
                      className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[0.82rem] font-semibold transition-colors ${
                        isCategoryExpanded
                          ? "border-2 border-[#560200] bg-white text-[#560200] hover:bg-[#560200]/5"
                          : "bg-[#560200] text-white hover:bg-[#6d0200]"
                      }`}
                    >
                      {isCategoryExpanded ? (
                        <>
                          <ReorderChevronIcon direction="up" />
                          Chiudi categoria
                        </>
                      ) : (
                        "Modifica"
                      )}
                    </button>
                    {isCategoryExpanded && canRemoveCategory ? (
                      <CategoryMoreMenu
                        isOpen={openCategoryMenuId === category.id}
                        onToggle={() =>
                          setOpenCategoryMenuId((current) =>
                            current === category.id ? null : category.id,
                          )
                        }
                        onClose={() =>
                          setOpenCategoryMenuId((current) =>
                            current === category.id ? null : current,
                          )
                        }
                        onRemove={() => {
                          setOpenCategoryMenuId(null);
                          setConfirm({
                            title: "Rimuovi categoria",
                            message: `Rimuovere "${category.name}" e tutti i piatti collegati?`,
                            confirmLabel: "Rimuovi",
                            onConfirm: () => removeCategory(category.id),
                          });
                        }}
                      />
                    ) : null}
                  </div>
                </div>
                <div className="p-4">
                  <p className="mb-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-[#909090]">
                    Categoria
                  </p>
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      value={categoryName}
                      onChange={(event) =>
                        onChange(
                          setCategoryName(
                            client,
                            editingLocale,
                            category.id,
                            event.target.value,
                          ),
                        )
                      }
                      placeholder={getCategoryNamePlaceholder(
                        client,
                        category.id,
                      )}
                      className="min-w-0 flex-1 rounded-[10px] border border-[#d8dadc] bg-white px-3 py-2.5 text-[1rem] font-bold text-[#141415] outline-none transition-colors focus:border-[#560200]"
                    />
                    {editingLocale === "it" ? (
                      <ReorderButtonGroup
                        layout="horizontal"
                        upLabel={`Sposta "${category.name}" prima`}
                        downLabel={`Sposta "${category.name}" dopo`}
                        disableUp={categoryIndex === 0}
                        disableDown={
                          categoryIndex === client.categories.length - 1
                        }
                        onUp={() => moveCategory(category.id, -1)}
                        onDown={() => moveCategory(category.id, 1)}
                      />
                    ) : null}
                  </div>
                  {editingLocale !== "it" && !categoryName ? (
                    <p className="mt-1.5 text-[0.72rem] text-[#606060]">
                      IT: {getCategoryNamePlaceholder(client, category.id)}
                    </p>
                  ) : null}
                </div>

                {isCategoryExpanded ? (
                  <div
                    id={`category-dishes-${category.id}`}
                    className="space-y-4 border-t border-[#ececec] bg-[#fafafa] p-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className="text-[0.78rem] font-semibold text-[#606060]">
                        {isOrderingDishes
                          ? "Usa le frecce per riordinare i piatti"
                          : "Gestisci piatti e contenuti"}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {canReorderDishes ? (
                          <button
                            type="button"
                            onClick={() =>
                              toggleCategoryOrdering(category.id)
                            }
                            className={`rounded-full px-4 py-2 text-[0.82rem] font-semibold transition-colors ${
                              isOrderingDishes
                                ? "border border-[#560200] bg-white text-[#560200] hover:bg-[#560200]/5"
                                : "border border-[#d8dadc] bg-white text-[#141415] hover:bg-white/80"
                            }`}
                          >
                            {isOrderingDishes ? "Fine ordine" : "Ordina piatti"}
                          </button>
                        ) : null}
                        {!isOrderingDishes ? (
                          <button
                            type="button"
                            onClick={() => addDish(category.id)}
                            disabled={editingLocale !== "it"}
                            className="rounded-full bg-[#560200] px-4 py-2 text-[0.82rem] font-semibold text-white transition-colors hover:bg-[#6d0200] disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            + Piatto
                          </button>
                        ) : null}
                      </div>
                    </div>

                    {isOrderingDishes ? (
                      <CategoryDishOrderList
                        client={client}
                        dishes={categoryDishes}
                        onMove={(dishId, direction) =>
                          moveDish(category.id, dishId, direction)
                        }
                      />
                    ) : categoryDishes.length === 0 ? (
                      <div className="rounded-[12px] border border-dashed border-[#d8dadc] bg-white px-4 py-8 text-center">
                        <p className="text-[0.88rem] font-medium text-[#606060]">
                          Nessun piatto in questa categoria.
                        </p>
                        <button
                          type="button"
                          onClick={() => addDish(category.id)}
                          disabled={editingLocale !== "it"}
                          className="mt-3 rounded-full bg-[#560200] px-4 py-2 text-[0.82rem] font-semibold text-white transition-colors hover:bg-[#6d0200] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Aggiungi il primo piatto
                        </button>
                      </div>
                    ) : (
                      categoryDishes.map((dish) => (
                        <div
                          key={dish.id}
                          id={`dish-${dish.id}`}
                          className="relative rounded-[14px] border border-[#e4e4e4] bg-white p-4 shadow-[0_1px_4px_rgba(0,0,0,0.03)]"
                        >
                          {highlightedDishId === dish.id ? (
                            <div
                              aria-hidden
                              className="pointer-events-none absolute inset-0 z-10 animate-category-move-highlight rounded-[14px] bg-[#560200]/8"
                            />
                          ) : null}
                          <div className="mb-3 flex items-start justify-between gap-3">
                            <p className="text-[0.78rem] font-semibold uppercase tracking-[0.08em] text-[#909090]">
                              Piatto
                            </p>
                            <button
                              type="button"
                              onClick={() => removeDish(dish.id)}
                              className="rounded-full px-2 py-1 text-[0.78rem] font-semibold text-[#8a1f1f] transition-colors hover:bg-[#fff1f1]"
                            >
                              Rimuovi
                            </button>
                          </div>

                        <div className="grid gap-3">
                          <TextField
                            label="Nome"
                            value={getDishField(
                              client,
                              editingLocale,
                              dish.id,
                              "name",
                            )}
                            onChange={(name) =>
                              onChange(
                                setDishField(
                                  client,
                                  editingLocale,
                                  dish.id,
                                  "name",
                                  name,
                                ),
                              )
                            }
                            placeholder={getDishFieldPlaceholder(
                              client,
                              dish.id,
                              "name",
                            )}
                          />
                          {editingLocale !== "it" &&
                          !getDishField(client, editingLocale, dish.id, "name") ? (
                            <p className="-mt-2 text-[0.72rem] text-[#606060]">
                              IT:{" "}
                              {getDishFieldPlaceholder(client, dish.id, "name") ||
                                "—"}
                            </p>
                          ) : null}
                          <div className="flex flex-col gap-1.5">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[0.78rem] font-semibold text-[#606060]">
                                Descrizione
                              </span>
                              {editingLocale === "it" ? (
                                <AiDescriptionButton
                                  label="Genera descrizione con AI"
                                  loading={generatingDescriptionFor === dish.id}
                                  disabled={
                                    !adminEmail ||
                                    isDishAiBusy ||
                                    !getDishField(
                                      client,
                                      "it",
                                      dish.id,
                                      "name",
                                    ).trim()
                                  }
                                  onClick={() =>
                                    void generateDishDescription(
                                      dish.id,
                                      getDishField(
                                        client,
                                        "it",
                                        dish.id,
                                        "name",
                                      ),
                                      category.name,
                                    )
                                  }
                                />
                              ) : null}
                            </div>
                            <textarea
                              value={getDishField(
                                client,
                                editingLocale,
                                dish.id,
                                "description",
                              )}
                              onChange={(event) =>
                                onChange(
                                  setDishField(
                                    client,
                                    editingLocale,
                                    dish.id,
                                    "description",
                                    event.target.value,
                                  ),
                                )
                              }
                              placeholder={getDishFieldPlaceholder(
                                client,
                                dish.id,
                                "description",
                              )}
                              rows={2}
                              className="rounded-[10px] border border-[#d8dadc] bg-white px-3 py-2 text-[0.92rem] text-[#141415] outline-none focus:border-[#560200]"
                            />
                          </div>
                          {editingLocale !== "it" &&
                          !getDishField(
                            client,
                            editingLocale,
                            dish.id,
                            "description",
                          ) &&
                          getDishFieldPlaceholder(
                            client,
                            dish.id,
                            "description",
                          ) ? (
                            <p className="-mt-2 text-[0.72rem] text-[#606060]">
                              IT:{" "}
                              {getDishFieldPlaceholder(
                                client,
                                dish.id,
                                "description",
                              )}
                            </p>
                          ) : null}
                          <label className="flex flex-col gap-1.5">
                            <span className="text-[0.78rem] font-semibold text-[#606060]">
                              Prezzo (€)
                            </span>
                            <input
                              type="number"
                              min="0"
                              step="0.5"
                              value={dish.price ?? ""}
                              onChange={(event) =>
                                updateDish(dish.id, {
                                  price:
                                    event.target.value === ""
                                      ? null
                                      : Number(event.target.value),
                                })
                              }
                              className="rounded-[10px] border border-[#d8dadc] bg-white px-3 py-2 text-[0.92rem] text-[#141415] outline-none focus:border-[#560200]"
                            />
                          </label>

                          <div>
                            <div className="mb-2 flex items-center justify-between gap-2">
                              <p className="text-[0.78rem] font-semibold text-[#606060]">
                                Allergeni
                              </p>
                              {editingLocale === "it" ? (
                                <AiDescriptionButton
                                  label="Genera allergeni con AI"
                                  loading={generatingAllergensFor === dish.id}
                                  disabled={
                                    !adminEmail ||
                                    isDishAiBusy ||
                                    !getDishField(
                                      client,
                                      "it",
                                      dish.id,
                                      "name",
                                    ).trim()
                                  }
                                  onClick={() =>
                                    void generateDishAllergens(
                                      dish.id,
                                      getDishField(
                                        client,
                                        "it",
                                        dish.id,
                                        "name",
                                      ),
                                      getDishField(
                                        client,
                                        "it",
                                        dish.id,
                                        "description",
                                      ),
                                      category.name,
                                    )
                                  }
                                />
                              ) : null}
                            </div>
                            <div className="grid gap-2 sm:grid-cols-2">
                              {ALLERGENS.map((allergen) => {
                                const checked = dish.allergenIds.includes(
                                  allergen.id,
                                );
                                return (
                                  <label
                                    key={allergen.id}
                                    className={`flex cursor-pointer items-start gap-2.5 rounded-[10px] border px-3 py-2 text-[0.78rem] leading-snug transition-colors ${
                                      checked
                                        ? "border-[#560200] bg-[#560200]/10 text-[#141415]"
                                        : "border-[#e4e4e4] bg-white text-[#606060]"
                                    }`}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={checked}
                                      onChange={() => {
                                        const allergenIds = checked
                                          ? dish.allergenIds.filter(
                                              (id) => id !== allergen.id,
                                            )
                                          : [...dish.allergenIds, allergen.id];
                                        updateDish(dish.id, { allergenIds });
                                      }}
                                      className="allergen-checkbox mt-0.5 size-4 shrink-0 cursor-pointer rounded border-[#c9a8a8] accent-[#560200] text-[#560200] focus:ring-2 focus:ring-[#560200]/35 focus:ring-offset-0"
                                    />
                                    <span>{allergen.name}</span>
                                  </label>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                    <div className="flex justify-center border-t border-[#ececec] pt-4">
                      <button
                        type="button"
                        onClick={() => toggleCategoryExpanded(category.id)}
                        className="inline-flex items-center gap-1.5 rounded-full border-2 border-[#560200] bg-white px-5 py-2 text-[0.82rem] font-semibold text-[#560200] transition-colors hover:bg-[#560200]/5"
                      >
                        <ReorderChevronIcon direction="up" />
                        Chiudi categoria
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </Section>
    </div>
  );
}

function CategoryMoreMenu({
  isOpen,
  onToggle,
  onClose,
  onRemove,
}: {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  onRemove: () => void;
}) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [isOpen, onClose]);

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        aria-label="Altre azioni categoria"
        aria-expanded={isOpen}
        aria-haspopup="menu"
        onClick={onToggle}
        className={`inline-flex items-center justify-center p-1 transition-colors ${
          isOpen
            ? "text-[#606060]"
            : "text-[#909090] hover:text-[#606060]"
        }`}
      >
        <VerticalDotsIcon />
      </button>
      {isOpen ? (
        <div
          role="menu"
          className="absolute right-0 top-[calc(100%+6px)] z-30 min-w-[11rem] overflow-hidden rounded-[12px] border border-[#e4e4e4] bg-white py-1 shadow-[0_8px_24px_rgba(0,0,0,0.12)]"
        >
          <button
            type="button"
            role="menuitem"
            onClick={onRemove}
            className="w-full px-3.5 py-2.5 text-left text-[0.82rem] font-semibold text-[#8a1f1f] transition-colors hover:bg-[#fff1f1]"
          >
            Rimuovi categoria
          </button>
        </div>
      ) : null}
    </div>
  );
}

function VerticalDotsIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-[1.125rem] w-[1.125rem]"
      fill="currentColor"
    >
      <circle cx="12" cy="5" r="1.35" />
      <circle cx="12" cy="12" r="1.35" />
      <circle cx="12" cy="19" r="1.35" />
    </svg>
  );
}

function CategoryDishOrderList({
  client,
  dishes,
  onMove,
}: {
  client: ClientConfig;
  dishes: ClientDish[];
  onMove: (dishId: string, direction: -1 | 1) => void;
}) {
  return (
    <div className="space-y-2">
      {dishes.map((dish, index) => {
        const name =
          getDishField(client, "it", dish.id, "name").trim() || "Senza nome";
        const priceLabel =
          dish.price != null
            ? new Intl.NumberFormat("it-IT", {
                style: "currency",
                currency: "EUR",
                minimumFractionDigits: dish.price % 1 === 0 ? 0 : 2,
              }).format(dish.price)
            : null;

        return (
          <div
            key={dish.id}
            className="flex items-center gap-3 rounded-[12px] border border-[#e4e4e4] bg-white px-3 py-2.5 shadow-[0_1px_3px_rgba(0,0,0,0.03)]"
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#560200]/8 text-[0.72rem] font-bold tabular-nums text-[#560200]">
              {index + 1}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[0.9rem] font-semibold text-[#141415]">
                {name}
              </p>
              {priceLabel ? (
                <p className="text-[0.72rem] text-[#606060]">{priceLabel}</p>
              ) : (
                <p className="text-[0.72rem] text-[#909090]">Prezzo non impostato</p>
              )}
            </div>
            <ReorderButtonGroup
              upLabel={`Sposta "${name}" prima`}
              downLabel={`Sposta "${name}" dopo`}
              disableUp={index === 0}
              disableDown={index === dishes.length - 1}
              onUp={() => onMove(dish.id, -1)}
              onDown={() => onMove(dish.id, 1)}
            />
          </div>
        );
      })}
    </div>
  );
}

function ReorderButtonGroup({
  upLabel,
  downLabel,
  disableUp,
  disableDown,
  onUp,
  onDown,
  layout = "vertical",
}: {
  upLabel: string;
  downLabel: string;
  disableUp: boolean;
  disableDown: boolean;
  onUp: () => void;
  onDown: () => void;
  layout?: "vertical" | "horizontal";
}) {
  const dividerClass =
    layout === "horizontal" ? "border-l border-white/20" : "border-t border-white/20";

  return (
    <div
      className={`flex shrink-0 overflow-hidden rounded-[10px] ${
        layout === "horizontal" ? "flex-row" : "flex-col"
      }`}
    >
      <button
        type="button"
        aria-label={upLabel}
        disabled={disableUp}
        onClick={onUp}
        className="flex h-8 w-9 items-center justify-center bg-[#560200] text-white transition-colors hover:bg-[#6d0200] disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ReorderChevronIcon direction="up" />
      </button>
      <button
        type="button"
        aria-label={downLabel}
        disabled={disableDown}
        onClick={onDown}
        className={`flex h-8 w-9 items-center justify-center bg-[#560200] text-white transition-colors hover:bg-[#6d0200] disabled:cursor-not-allowed disabled:opacity-40 ${dividerClass}`}
      >
        <ReorderChevronIcon direction="down" />
      </button>
    </div>
  );
}

function ReorderChevronIcon({
  direction,
}: {
  direction: "up" | "down";
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
    >
      {direction === "up" ? (
        <path d="M6 15l6-6 6 6" strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
      )}
    </svg>
  );
}
