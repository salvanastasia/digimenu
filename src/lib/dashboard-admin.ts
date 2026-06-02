import { id, tx } from "@instantdb/react";
import { db } from "@/lib/db";
import { withInstantRecovery } from "@/lib/instant-query";
import {
  normalizeAdminEmail,
  parseDashboardAdminEmails,
} from "@/lib/dashboard-admin-emails";

export type DashboardAdminRow = {
  id: string;
  email: string;
  $user?: { id: string } | null;
};

export { normalizeAdminEmail, parseDashboardAdminEmails };

export function buildLinkAdminTransaction(adminId: string, userId: string) {
  return tx.dashboardAdmins[adminId].link({ $user: userId });
}

export function buildCreateAdminTransaction(email: string) {
  const normalized = normalizeAdminEmail(email);
  return tx.dashboardAdmins[id()].update({ email: normalized });
}

export function buildDeleteAdminTransaction(adminId: string) {
  return tx.dashboardAdmins[adminId].delete();
}

export async function linkUserToAdminRow(adminId: string, userId: string) {
  const result = await withInstantRecovery(
    db.transact(buildLinkAdminTransaction(adminId, userId)),
    "link-admin-user",
  );
  if (result === undefined) {
    throw new Error(
      "Connessione a InstantDB non disponibile. Riprova tra poco.",
    );
  }
}

export function buildSeedAdminTransactions(
  emails: string[],
  existingEmails: ReadonlySet<string>,
) {
  return emails
    .filter((email) => !existingEmails.has(email))
    .map((email) => tx.dashboardAdmins[id()].update({ email }));
}
