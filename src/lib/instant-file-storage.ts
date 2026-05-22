import { tx } from "@instantdb/react";
import { db, isInstantConfigured } from "@/lib/db";

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

export async function deleteClientAssets(
  clientId: string,
  kind: ClientAssetKind,
): Promise<void> {
  if (!isInstantConfigured) return;

  const prefix = clientAssetPathPrefix(clientId, kind);
  const snapshot = await db.queryOnce({
    $files: {
      $: {
        where: {
          path: { $like: `${prefix}%` },
        },
      },
    },
  });

  const files = snapshot.data.$files ?? [];
  if (files.length === 0) return;

  await db.transact(files.map((file) => tx.$files[file.id].delete()));
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
  });

  const fileRecord = snapshot.data.$files?.[0];
  if (!fileRecord?.url) {
    throw new Error("Upload completato ma URL non disponibile.");
  }

  return fileRecord.url;
}
