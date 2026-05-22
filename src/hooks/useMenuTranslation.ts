"use client";

import { useCallback, useState } from "react";
import {
  buildTranslationChunks,
  buildVariableTranslationSource,
  computeClientTranslationVersion,
  isVariableSourceEmpty,
  mergeVariableTranslationParts,
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

      const source = buildVariableTranslationSource(client);
      if (isVariableSourceEmpty(source)) {
        setError("Aggiungi almeno una categoria o un piatto con nome.");
        setStatus("error");
        return;
      }

      const chunks = buildTranslationChunks(source);
      if (chunks.length === 0) {
        setError("Nessun contenuto da tradurre.");
        setStatus("error");
        return;
      }

      const version = computeClientTranslationVersion(client);
      const totalSteps = targets.length * chunks.length;
      let step = 0;

      setStatus("running");
      setError(null);
      setProgress(null);

      const nextTranslations = { ...client.translations };

      try {
        for (const locale of targets) {
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

          nextTranslations[locale] = mergeVariableTranslationParts(
            version,
            parts,
          );
        }

        onSuccess({
          ...client,
          translations: nextTranslations,
        });
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
  };
}
