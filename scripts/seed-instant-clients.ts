import { readFileSync } from "node:fs";
import { init, id, lookup, tx } from "@instantdb/admin";
import schema from "../instant.schema";
import {
  buildSeedAdminTransactions,
  normalizeAdminEmail,
  parseDashboardAdminEmails,
} from "../src/lib/dashboard-admin";
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
      let value = trimmed.slice(separatorIndex + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1).trim();
      }
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
    if (!appId) {
      console.error("Manca NEXT_PUBLIC_INSTANT_APP_ID in .env");
    }
    if (!adminToken) {
      console.error("Manca INSTANT_APP_ADMIN_TOKEN in .env");
      console.error(
        "Copia il token da: https://instantdb.com/dash → la tua app → Settings → Admin token",
      );
      console.error(
        "Non usare l'app id come token — rompe instant:push e il seed.",
      );
    }
    process.exit(1);
  }

  if (adminToken === appId) {
    console.error(
      "INSTANT_APP_ADMIN_TOKEN non può essere uguale a NEXT_PUBLIC_INSTANT_APP_ID.",
    );
    console.error("Usa il vero Admin token da Settings nella dashboard Instant.");
    process.exit(1);
  }

  const db = init({ appId, adminToken, schema });
  const snapshot = await db.query({ clientMenus: {}, dashboardAdmins: {} });
  const existingClientIds = new Set(
    (snapshot.clientMenus ?? []).map((row) => row.clientId),
  );
  const existingAdminEmails = new Set(
    (snapshot.dashboardAdmins ?? []).map((row) =>
      normalizeAdminEmail(String(row.email)),
    ),
  );
  const entries = getDefaultSeedEntries();
  const adminEmails = parseDashboardAdminEmails(
    process.env.DASHBOARD_ADMIN_EMAILS,
  );

  const adminFixTransactions = (snapshot.dashboardAdmins ?? [])
    .map((row) => {
      const current = String(row.email);
      const fixed = normalizeAdminEmail(current);
      if (fixed === current) return null;
      return tx.dashboardAdmins[row.id as string].update({ email: fixed });
    })
    .filter((txItem): txItem is NonNullable<typeof txItem> => txItem !== null);

  const transactions = [
    ...adminFixTransactions,
    ...entries.map((entry) => {
      const payload = buildRowPayload(entry);

      if (existingClientIds.has(entry.config.id)) {
        return tx.clientMenus[lookup("clientId", entry.config.id)].update(payload);
      }

      return tx.clientMenus[id()].update(payload);
    }),
    ...buildSeedAdminTransactions(adminEmails, existingAdminEmails),
  ];

  await db.transact(transactions);

  console.log(
    "Clienti inseriti/aggiornati:",
    entries.map((entry) => `/${entry.config.slug}`).join(", "),
  );

  if (adminEmails.length > 0) {
    console.log("Amministratori dashboard:", adminEmails.join(", "));
  } else {
    console.log(
      "Nessun amministratore: imposta DASHBOARD_ADMIN_EMAILS in .env e riesegui.",
    );
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
