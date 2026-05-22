import { init } from "@instantdb/admin";
import schema from "../../instant.schema";
import {
  normalizeAdminEmail,
  parseDashboardAdminEmails,
} from "@/lib/dashboard-admin-emails";

export async function isAuthorizedTranslator(
  email: string | undefined,
): Promise<boolean> {
  if (!email?.trim()) return false;

  const normalized = normalizeAdminEmail(email);
  const envEmails = parseDashboardAdminEmails(
    process.env.DASHBOARD_ADMIN_EMAILS,
  );
  if (envEmails.includes(normalized)) return true;

  const appId = process.env.NEXT_PUBLIC_INSTANT_APP_ID?.trim();
  const adminToken = process.env.INSTANT_APP_ADMIN_TOKEN?.trim();
  if (!appId || !adminToken) return false;

  try {
    const db = init({ appId, adminToken, schema });
    const { dashboardAdmins } = await db.query({ dashboardAdmins: {} });
    const rows = dashboardAdmins as Array<{ email: string }>;
    return rows.some(
      (row) => normalizeAdminEmail(row.email) === normalized,
    );
  } catch {
    return false;
  }
}
