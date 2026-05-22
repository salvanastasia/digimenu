import { tx } from "@instantdb/react";
import { db, isInstantConfigured } from "@/lib/db";
import { isBrowserOffline, isInstantOfflineError } from "@/lib/instant-query";
import type { ClientConfig } from "@/types/client";

export const CLIENT_ASSET_PATH_PREFIX = "clients";

export type ClientAssetKind = "logo" | "header";

const MIME_EXTENSIONS: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/svg+xml": "svg",
  "video/webm": "webm",
};

function extensionFromFile(file: File): string {
  const fromName = file.name.split(".").pop()?.toLowerCase();
  if (
    fromName &&
    ["png", "jpg", "jpeg", "webp", "svg", "webm"].includes(fromName)
  ) {
    return fromName === "jpeg" ? "jpg" : fromName;
  }

  return MIME_EXTENSIONS[file.type] ?? "bin";
}

export function buildClientAssetPath(
  clientId: string,
  kind: ClientAssetKind,
  file: File,
): string {
  const extension = extensionFromFile(file);
  return `${CLIENT_ASSET_PATH_PREFIX}/${clientId}/${kind}.${extension}`;
}

export function clientAssetPathPrefix(
  clientId: string,
  kind: ClientAssetKind,
): string {
  return `${CLIENT_ASSET_PATH_PREFIX}/${clientId}/${kind}.`;
}

export function clientAssetsPathLike(clientId: string) {
  return `${CLIENT_ASSET_PATH_PREFIX}/${clientId}/%`;
}

type StoredClientAssets = {
  logoUrl?: string;
  backgroundImageUrl?: string;
};

type InstantFileRow = {
  path: string;
  url: string;
};

export function storedAssetsFromFileRows(
  files: InstantFileRow[] | undefined,
): StoredClientAssets {
  const assets: StoredClientAssets = {};

  for (const file of files ?? []) {
    if (!file.url) continue;
    if (file.path.includes("/logo.")) {
      assets.logoUrl = file.url;
    } else if (file.path.includes("/header.")) {
      assets.backgroundImageUrl = file.url;
    }
  }

  return assets;
}

const DEFAULT_LOGO_URL = "/logo.svg";

export function isPlaceholderLogoUrl(url: string) {
  return !url || url === DEFAULT_LOGO_URL;
}

/** Merge Instant Storage URLs into config when config still has placeholders. */
export function mergeConfigWithStoredAssets(
  config: ClientConfig,
  assets: StoredClientAssets,
): ClientConfig {
  const header = { ...config.header };
  let changed = false;

  if (assets.logoUrl && isPlaceholderLogoUrl(header.logoUrl)) {
    header.logoUrl = assets.logoUrl;
    changed = true;
  }

  if (assets.backgroundImageUrl && !header.backgroundImageUrl) {
    header.backgroundImageUrl = assets.backgroundImageUrl;
    header.backgroundMode = "image";
    changed = true;
  }

  if (!changed) return config;

  return {
    ...config,
    header,
    updatedAt: new Date().toISOString(),
  };
}

async function queryClientFiles(pathLike: string) {
  if (!isInstantConfigured || isBrowserOffline()) return null;

  try {
    return await db.queryOnce({
      $files: {
        $: {
          where: {
            path: { $like: pathLike },
          },
        },
      },
    });
  } catch (error) {
    if (isInstantOfflineError(error)) return null;
    throw error;
  }
}

export async function fetchClientAssetUrls(
  clientId: string,
): Promise<StoredClientAssets> {
  const snapshot = await queryClientFiles(clientAssetsPathLike(clientId));
  if (!snapshot) return {};

  return storedAssetsFromFileRows(
    snapshot.data.$files as InstantFileRow[] | undefined,
  );
}

export async function deleteClientAssets(
  clientId: string,
  kind: ClientAssetKind,
): Promise<void> {
  if (!isInstantConfigured) return;

  const prefix = clientAssetPathPrefix(clientId, kind);
  const snapshot = await queryClientFiles(`${prefix}%`);
  const files = snapshot?.data.$files ?? [];
  if (files.length === 0) return;

  await db.transact(
    files.map((file: { id: string }) => tx.$files[file.id].delete()),
  );
}

export async function uploadClientAsset(
  clientId: string,
  kind: ClientAssetKind,
  file: File,
): Promise<string> {
  if (!isInstantConfigured) {
    throw new Error("InstantDB non configurato.");
  }

  const path = buildClientAssetPath(clientId, kind, file);

  await deleteClientAssets(clientId, kind);

  await db.storage.uploadFile(path, file, {
    contentType: file.type || "application/octet-stream",
    contentDisposition: "inline",
  });

  const snapshot = await db.queryOnce({
    $files: {
      $: {
        where: {
          path,
        },
      },
    },
  }).catch((error: unknown) => {
    if (isInstantOfflineError(error)) return null;
    throw error;
  });

  if (!snapshot) {
    throw new Error(
      isBrowserOffline()
        ? "Connessione assente: impossibile recuperare l'URL del file caricato."
        : "Upload completato ma URL non disponibile.",
    );
  }

  const fileRecord = snapshot.data.$files?.[0];
  if (!fileRecord?.url) {
    throw new Error("Upload completato ma URL non disponibile.");
  }

  return fileRecord.url;
}
