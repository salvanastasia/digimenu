"use client";

import { useEffect, useMemo, useState } from "react";
import { ALLERGENS } from "@/data/allergens";
import {
  BrandLinkedColorField,
  LogoUploadField,
} from "@/components/dashboard/BrandLinkedColorField";
import { ConfirmDialog } from "@/components/dashboard/ConfirmDialog";
import { ClientVersionBar } from "@/components/dashboard/ClientVersionBar";
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
  isDirty,
  saveStatus,
  saveError,
  isSaving,
  onSave,
}: ClientEditorProps) {
  const [confirm, setConfirm] = useState<ConfirmState | null>(null);
  const [editingLocale, setEditingLocale] = useState<Locale>("it");
  const {
    translate,
    isTranslating,
    isTranslationSuccess,
    error: translationError,
    progress,
    resetFeedback,
  } = useMenuTranslation();
  const effectiveHeader = getEffectiveHeader(client);

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
    update({
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
  };

  const removeAllDishes = () => {
    update({ dishes: [] });
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

        <div className="mt-5 space-y-4">
          {(
            [
              {
                key: "showFavoritesQuantity" as const,
                label: "Quantità",
                hint: "Selettore quantità nel pannello preferiti.",
              },
              {
                key: "showFavoritesPrices" as const,
                label: "Prezzi",
                hint: "Prezzi nel pannello e nello scontrino preferiti.",
              },
            ] as const
          ).map((option) => (
            <div key={option.key}>
              <p className="mb-2 text-[0.78rem] font-semibold text-[#606060]">
                {option.label}
              </p>
              <div className="flex flex-wrap gap-2">
                {(
                  [
                    { value: true, label: "Mostra" },
                    { value: false, label: "Nascondi" },
                  ] as const
                ).map((toggle) => {
                  const active = client.customizations[option.key] === toggle.value;
                  return (
                    <button
                      key={toggle.label}
                      type="button"
                      onClick={() =>
                        updateCustomizations({ [option.key]: toggle.value })
                      }
                      className={`rounded-full border px-4 py-2 text-[0.82rem] font-semibold transition-colors ${
                        active
                          ? "border-[#560200] bg-[#560200]/8 text-[#560200]"
                          : "border-[#d8dadc] bg-white text-[#606060] hover:bg-[#f5f5f5]"
                      }`}
                    >
                      {toggle.label}
                    </button>
                  );
                })}
              </div>
              <p className="mt-2 text-[0.72rem] leading-snug text-[#606060]">
                {option.hint}
              </p>
            </div>
          ))}
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
            <button
              type="button"
              disabled={editingLocale !== "it"}
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
          ) : null}
        </div>

        <div className="space-y-6">
          {client.categories.map((category, categoryIndex) => {
            const categoryDishes = client.dishes.filter(
              (dish) => dish.categoryId === category.id,
            );

            return (
              <div
                key={category.id}
                className="rounded-[14px] border border-[#ececec] bg-[#fafafa] p-4"
              >
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    {editingLocale === "it" ? (
                      <div className="flex shrink-0 flex-col gap-1">
                        <button
                          type="button"
                          aria-label={`Sposta "${category.name}" prima`}
                          disabled={categoryIndex === 0}
                          onClick={() => moveCategory(category.id, -1)}
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-[#d8dadc] bg-white text-[0.95rem] leading-none text-[#141415] transition-colors hover:bg-[#f5f5f5] disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          aria-label={`Sposta "${category.name}" dopo`}
                          disabled={
                            categoryIndex === client.categories.length - 1
                          }
                          onClick={() => moveCategory(category.id, 1)}
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-[#d8dadc] bg-white text-[0.95rem] leading-none text-[#141415] transition-colors hover:bg-[#f5f5f5] disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          ↓
                        </button>
                      </div>
                    ) : null}
                    <div className="min-w-[180px] flex-1">
                    <input
                      type="text"
                      value={getCategoryName(client, editingLocale, category.id)}
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
                      placeholder={getCategoryNamePlaceholder(client, category.id)}
                      className="w-full rounded-[10px] border border-[#d8dadc] bg-white px-3 py-2 text-[0.95rem] font-bold text-[#141415] outline-none focus:border-[#560200]"
                    />
                    {editingLocale !== "it" &&
                    !getCategoryName(client, editingLocale, category.id) ? (
                      <p className="mt-1 text-[0.72rem] text-[#606060]">
                        IT: {getCategoryNamePlaceholder(client, category.id)}
                      </p>
                    ) : null}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {canRemoveCategory ? (
                      <button
                        type="button"
                        onClick={() =>
                          setConfirm({
                            title: "Rimuovi categoria",
                            message: `Rimuovere "${category.name}" e tutti i piatti collegati?`,
                            confirmLabel: "Rimuovi",
                            onConfirm: () => removeCategory(category.id),
                          })
                        }
                        className="rounded-full border border-[#d8dadc] bg-white px-4 py-2 text-[0.82rem] font-semibold text-[#8a1f1f] transition-colors hover:bg-[#fff1f1]"
                      >
                        Rimuovi categoria
                      </button>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => addDish(category.id)}
                      disabled={editingLocale !== "it"}
                      className="rounded-full bg-[#560200] px-4 py-2 text-[0.82rem] font-semibold text-white transition-colors hover:bg-[#6d0200] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      + Piatto
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  {categoryDishes.length === 0 ? (
                    <p className="text-[0.84rem] text-[#606060]">
                      Nessun piatto in questa categoria.
                    </p>
                  ) : (
                    categoryDishes.map((dish) => (
                      <div
                        key={dish.id}
                        className="rounded-[12px] border border-[#e4e4e4] bg-white p-4"
                      >
                        <div className="mb-3 flex items-start justify-between gap-3">
                          <p className="text-[0.78rem] font-semibold uppercase tracking-[0.08em] text-[#606060]">
                            Piatto
                          </p>
                          <button
                            type="button"
                            onClick={() => removeDish(dish.id)}
                            className="text-[0.78rem] font-semibold text-[#8a1f1f] hover:underline"
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
                          <label className="flex flex-col gap-1.5">
                            <span className="text-[0.78rem] font-semibold text-[#606060]">
                              Descrizione
                            </span>
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
                          </label>
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
                            <p className="mb-2 text-[0.78rem] font-semibold text-[#606060]">
                              Allergeni
                            </p>
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
                </div>
              </div>
            );
          })}
        </div>
      </Section>
    </div>
  );
}
