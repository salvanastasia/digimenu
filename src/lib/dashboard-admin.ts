import { id, tx } from "@instantdb/react";
import { db } from "@/lib/db";

export type DashboardAdminRow = {
  id: string;
  email: string;
  $user?: { id: string } | null;
};

export function normalizeAdminEmail(email: string) {
  let value = email.trim();
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    value = value.slice(1, -1).trim();
  }
  return value.toLowerCase();
}

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
  await db.transact(buildLinkAdminTransaction(adminId, userId));
}

export function parseDashboardAdminEmails(raw: string | undefined) {
  if (!raw?.trim()) return [];
  return [
    ...new Set(
      raw
        .split(",")
        .map((email) => normalizeAdminEmail(email))
        .filter(Boolean),
    ),
  ];
}

export function buildSeedAdminTransactions(
  emails: string[],
  existingEmails: ReadonlySet<string>,
) {
  return emails
    .filter((email) => !existingEmails.has(email))
    .map((email) => tx.dashboardAdmins[id()].update({ email }));
}
