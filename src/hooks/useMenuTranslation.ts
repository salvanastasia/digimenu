"use client";

import { useCallback, useState } from "react";
import {
  buildIncrementalTranslationSource,
  buildTranslationChunks,
  getOutdatedKeys,
  getTotalOutdatedFieldCount,
  mergeIncrementalTranslation,
} from "@/lib/client-translation-payload";
import { LOCALE_NAMES } from "@/lib/languages";
import type { ClientConfig } from "@/types/client";
import type { Locale } from "@/types/translation";

export type TranslationProgress = {
  locale: Exclude<Locale, "it">;
  label: string;
  current: number;
  total: number;
};

type TranslateOptions = {
  client: ClientConfig;
  email: string;
  onSuccess: (client: ClientConfig) => void;
};

export function useMenuTranslation() {
  const [status, setStatus] = useState<
    "idle" | "running" | "error" | "success"
  >("idle");
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<TranslationProgress | null>(null);

  const translate = useCallback(
    async ({ client, email, onSuccess }: TranslateOptions) => {
      const targets = client.header.languages.filter(
        (locale): locale is Exclude<Locale, "it"> => locale !== "it",
      );

      if (targets.length === 0) {
        setError("Seleziona almeno una lingua oltre all'italiano.");
        setStatus("error");
        return;
      }

      const jobs = targets
        .map((locale) => ({
          locale,
          keys: getOutdatedKeys(client, locale),
        }))
        .filter((job) => job.keys.length > 0);

      if (jobs.length === 0) {
        setError("Nessuna traduzione da aggiornare.");
        setStatus("error");
        return;
      }

      const totalSteps = jobs.reduce(
        (sum, job) =>
          sum + buildTranslationChunks(buildIncrementalTranslationSource(client, job.keys)).length,
        0,
      );
      let step = 0;

      setStatus("running");
      setError(null);
      setProgress(null);

      let nextClient: ClientConfig = { ...client, translations: { ...client.translations } };

      try {
        for (const { locale, keys } of jobs) {
          const source = buildIncrementalTranslationSource(client, keys);
          const chunks = buildTranslationChunks(source);
          const parts: Array<Record<string, unknown>> = [];

          for (const chunk of chunks) {
            step += 1;
            setProgress({
              locale,
              label: `${LOCALE_NAMES[locale]} — ${chunk.label}`,
              current: step,
              total: totalSteps,
            });

            const response = await fetch("/api/translate-menu", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email,
                locale,
                chunk: { data: chunk.data },
              }),
            });

            const payload = (await response.json()) as {
              part?: Record<string, unknown>;
              error?: string;
            };

            if (!response.ok) {
              throw new Error(payload.error ?? "Traduzione non riuscita.");
            }

            if (payload.part) {
              parts.push(payload.part);
            }
          }

          const existing = nextClient.translations?.[locale];
          const merged = mergeIncrementalTranslation(
            nextClient,
            locale,
            existing,
            parts,
            keys,
          );

          nextClient = {
            ...nextClient,
            translations: {
              ...nextClient.translations,
              [locale]: merged,
            },
          };
        }

        onSuccess(nextClient);
        setStatus("success");
        setProgress(null);
      } catch (translateError) {
        setStatus("error");
        setProgress(null);
        setError(
          translateError instanceof Error
            ? translateError.message
            : "Traduzione non riuscita.",
        );
      }
    },
    [],
  );

  const resetFeedback = useCallback(() => {
    setError(null);
    if (status !== "running") {
      setStatus("idle");
    }
  }, [status]);

  return {
    translate,
    status,
    error,
    progress,
    isTranslating: status === "running",
    isTranslationSuccess: status === "success",
    resetFeedback,
    getOutdatedCount: getTotalOutdatedFieldCount,
  };
}
