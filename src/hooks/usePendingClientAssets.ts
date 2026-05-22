"use client";

import { useCallback, useRef } from "react";
import type { ClientConfig } from "@/types/client";
import {
  deleteClientAssets,
  uploadClientAsset,
  type ClientAssetKind,
} from "@/lib/instant-file-storage";

function headerFieldForKind(kind: ClientAssetKind): "logoUrl" | "backgroundImageUrl" {
  return kind === "logo" ? "logoUrl" : "backgroundImageUrl";
}

export function usePendingClientAssets() {
  const pendingRef = useRef<Map<ClientAssetKind, File>>(new Map());
  const previewRef = useRef<Map<ClientAssetKind, string>>(new Map());
  const removedRef = useRef<Set<ClientAssetKind>>(new Set());

  const clearPending = useCallback((kind: ClientAssetKind) => {
    const preview = previewRef.current.get(kind);
    if (preview) {
      URL.revokeObjectURL(preview);
      previewRef.current.delete(kind);
    }
    pendingRef.current.delete(kind);
  }, []);

  const reset = useCallback(() => {
    for (const preview of previewRef.current.values()) {
      URL.revokeObjectURL(preview);
    }
    pendingRef.current.clear();
    previewRef.current.clear();
    removedRef.current.clear();
  }, []);

  const stageFile = useCallback((kind: ClientAssetKind, file: File) => {
    clearPending(kind);
    removedRef.current.delete(kind);

    const preview = URL.createObjectURL(file);
    pendingRef.current.set(kind, file);
    previewRef.current.set(kind, preview);
    return preview;
  }, [clearPending]);

  const hasPending = useCallback(
    (kind: ClientAssetKind) => pendingRef.current.has(kind),
    [],
  );

  const stageRemove = useCallback(
    (kind: ClientAssetKind) => {
      clearPending(kind);
      removedRef.current.add(kind);
    },
    [clearPending],
  );

  const clearRemoved = useCallback((kind: ClientAssetKind) => {
    removedRef.current.delete(kind);
  }, []);

  const flush = useCallback(
    async (clientId: string, draft: ClientConfig): Promise<ClientConfig> => {
      const next: ClientConfig = {
        ...draft,
        header: { ...draft.header },
      };

      for (const kind of removedRef.current) {
        await deleteClientAssets(clientId, kind);
        next.header[headerFieldForKind(kind)] = "";
      }

      for (const [kind, file] of pendingRef.current) {
        const url = await uploadClientAsset(clientId, kind, file);
        next.header[headerFieldForKind(kind)] = url;
      }

      return next;
    },
    [],
  );

  return {
    stageFile,
    stageRemove,
    clearPending,
    clearRemoved,
    hasPending,
    reset,
    flush,
  };
}
