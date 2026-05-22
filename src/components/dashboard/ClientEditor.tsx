"use client";

import { useState } from "react";
import { ALLERGENS } from "@/data/allergens";
import {
  BrandLinkedColorField,
  LogoUploadField,
} from "@/components/dashboard/BrandLinkedColorField";
import { ConfirmDialog } from "@/components/dashboard/ConfirmDialog";
import {
  ColorField,
  Section,
  SelectField,
  TextField,
} from "@/components/dashboard/DashboardFields";
import { FONT_OPTIONS, SUBTITLE_MAX_LENGTH } from "@/lib/client-defaults";
import {
  getBrandLabelForHeaderColor,
  getEffectiveHeader,
} from "@/lib/client-header";
import { createPrefixedId } from "@/lib/create-id";
import { ensureUniqueSlug, slugify } from "@/lib/client-slug";
import { LANGUAGES } from "@/lib/languages";
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
  otherSlugs: string[];
  onChange: (client: ClientConfig) => void;
  onBack: () => void;
  onDelete: () => void;
  canDelete: boolean;
  canRemoveCategory: boolean;
};

type ConfirmState = {
  title: string;
  message: string;
  confirmLabel: string;
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
  otherSlugs,
  onChange,
  onBack,
  onDelete,
  canDelete,
  canRemoveCategory,
}: ClientEditorProps) {
  const [confirm, setConfirm] = useState<ConfirmState | null>(null);
  const effectiveHeader = getEffectiveHeader(client);

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

  const updateCategoryName = (categoryId: string, name: string) => {
    update({
      categories: client.categories.map((category) =>
        category.id === categoryId ? { ...category, name } : category,
      ),
    });
  };

  const headerColorFields: Array<{
    key: HeaderColorKey;
    label: string;
  }> = [
    { key: "logoColor", label: "Colore logo (SVG)" },
    { key: "fabBackground", label: "FAB background" },
    { key: "fabIconColor", label: "FAB icon color" },
  ];

  const backgroundMode = client.header.backgroundMode ?? "color";

  return (
    <div className="space-y-6">
      <ConfirmDialog
        open={confirm !== null}
        title={confirm?.title ?? ""}
        message={confirm?.message ?? ""}
        confirmLabel={confirm?.confirmLabel}
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
          className="rounded-full border border-[#d8dadc] bg-white px-4 py-2 text-[0.88rem] font-semibold text-[#141415] transition-colors hover:bg-[#f5f5f5]"
        >
          ← Clienti
        </button>

        <div className="flex flex-wrap gap-2">
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

      <Section title="Header">
        <TextField
          label="Slogan"
          value={client.subtitle}
          onChange={(subtitle) =>
            update({ subtitle: subtitle.slice(0, SUBTITLE_MAX_LENGTH) })
          }
          placeholder="Ristorante · Pizzeria · B&B"
          maxLength={SUBTITLE_MAX_LENGTH}
          hint={`Massimo ${SUBTITLE_MAX_LENGTH} caratteri per restare su una riga su mobile.`}
        />

        <LogoUploadField
          label="Logo"
          value={client.header.logoUrl}
          onChange={(logoUrl) => updateHeader({ logoUrl })}
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
            onChange={(backgroundImageUrl) =>
              updateHeader({ backgroundImageUrl })
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
      </Section>

      <Section title="Piatti">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={addCategory}
            className="rounded-full border border-[#560200] px-4 py-2 text-[0.82rem] font-semibold text-[#560200] transition-colors hover:bg-[#560200]/5"
          >
            + Categoria
          </button>
        </div>

        <div className="space-y-6">
          {client.categories.map((category) => {
            const categoryDishes = client.dishes.filter(
              (dish) => dish.categoryId === category.id,
            );

            return (
              <div
                key={category.id}
                className="rounded-[14px] border border-[#ececec] bg-[#fafafa] p-4"
              >
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <input
                    type="text"
                    value={category.name}
                    onChange={(event) =>
                      updateCategoryName(category.id, event.target.value)
                    }
                    className="min-w-[180px] flex-1 rounded-[10px] border border-[#d8dadc] bg-white px-3 py-2 text-[0.95rem] font-bold text-[#141415] outline-none focus:border-[#560200]"
                  />
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
                      className="rounded-full bg-[#560200] px-4 py-2 text-[0.82rem] font-semibold text-white transition-colors hover:bg-[#6d0200]"
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
                            value={dish.name}
                            onChange={(name) => updateDish(dish.id, { name })}
                          />
                          <label className="flex flex-col gap-1.5">
                            <span className="text-[0.78rem] font-semibold text-[#606060]">
                              Descrizione
                            </span>
                            <textarea
                              value={dish.description}
                              onChange={(event) =>
                                updateDish(dish.id, {
                                  description: event.target.value,
                                })
                              }
                              rows={2}
                              className="rounded-[10px] border border-[#d8dadc] bg-white px-3 py-2 text-[0.92rem] text-[#141415] outline-none focus:border-[#560200]"
                            />
                          </label>
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
                                    className={`flex cursor-pointer items-start gap-2 rounded-[10px] border px-3 py-2 text-[0.78rem] leading-snug transition-colors ${
                                      checked
                                        ? "border-[#560200] bg-[#560200]/8 text-[#141415]"
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
                                      className="mt-0.5"
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
