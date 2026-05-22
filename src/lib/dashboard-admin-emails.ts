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
