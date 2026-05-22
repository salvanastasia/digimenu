import { readFileSync } from "node:fs";
import { init, id, lookup, tx } from "@instantdb/admin";
import schema from "../instant.schema";
import { getDefaultSeedEntries } from "../src/lib/client-seeds";
import type { ClientStoreEntry } from "../src/types/client";

function loadEnvFile() {
  try {
    const content = readFileSync(".env", "utf8");
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const separatorIndex = trimmed.indexOf("=");
      if (separatorIndex === -1) continue;
      const key = trimmed.slice(0, separatorIndex).trim();
      const value = trimmed.slice(separatorIndex + 1).trim();
      if (key) process.env[key] = value;
    }
  } catch {
    // .env optional if vars are already exported
  }
}

function buildRowPayload(entry: ClientStoreEntry) {
  return {
    clientId: entry.config.id,
    slug: entry.config.slug,
    hidden: entry.config.hidden,
    config: entry.config,
    versions: entry.versions,
    updatedAt: entry.config.updatedAt,
  };
}

async function main() {
  loadEnvFile();

  const appId = process.env.NEXT_PUBLIC_INSTANT_APP_ID;
  const adminToken = process.env.INSTANT_APP_ADMIN_TOKEN;

  if (!appId || !adminToken) {
    console.error(
      "Servono NEXT_PUBLIC_INSTANT_APP_ID e INSTANT_APP_ADMIN_TOKEN in .env",
    );
    console.error(
      "Admin token: Instant dashboard → la tua app → Settings → Admin token",
    );
    process.exit(1);
  }

  const db = init({ appId, adminToken, schema });
  const snapshot = await db.query({ clientMenus: {} });
  const existingClientIds = new Set(
    (snapshot.clientMenus ?? []).map((row) => row.clientId),
  );
  const entries = getDefaultSeedEntries();

  await db.transact(
    entries.map((entry) => {
      const payload = buildRowPayload(entry);

      if (existingClientIds.has(entry.config.id)) {
        return tx.clientMenus[lookup("clientId", entry.config.id)].update(payload);
      }

      return tx.clientMenus[id()].update(payload);
    }),
  );

  console.log(
    "Clienti inseriti/aggiornati:",
    entries.map((entry) => `/${entry.config.slug}`).join(", "),
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
