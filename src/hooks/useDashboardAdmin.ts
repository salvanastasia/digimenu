"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  type DashboardAdminRow,
  linkUserToAdminRow,
  normalizeAdminEmail,
} from "@/lib/dashboard-admin";
import { db, isInstantConfigured } from "@/lib/db";

export type DashboardAdminStatus =
  | "loading"
  | "not_allowed"
  | "linking"
  | "ready"
  | "error";

export function useDashboardAdmin() {
  const user = db.useUser();
  const email = user.email ? normalizeAdminEmail(user.email) : "";
  const linkStarted = useRef(false);
  const [linkError, setLinkError] = useState<string | null>(null);

  const { isLoading, error, data } = db.useQuery({
    dashboardAdmins: {
      $user: {},
    },
  });

  const adminRow = useMemo(() => {
    const rows = data?.dashboardAdmins as DashboardAdminRow[] | undefined;
    if (!rows?.length || !email) return null;
    return (
      rows.find((row) => normalizeAdminEmail(row.email) === email) ?? null
    );
  }, [data?.dashboardAdmins, email]);

  const isAllowed = Boolean(adminRow);
  const isLinked = Boolean(adminRow?.$user?.id && adminRow.$user.id === user.id);

  useEffect(() => {
    if (!isAllowed || isLinked || !adminRow || linkStarted.current) return;

    linkStarted.current = true;
    setLinkError(null);

    void linkUserToAdminRow(adminRow.id, user.id).catch((linkErr) => {
      linkStarted.current = false;
      setLinkError(
        linkErr instanceof Error
          ? linkErr.message
          : "Collegamento account amministratore non riuscito.",
      );
    });
  }, [adminRow, isAllowed, isLinked, user.id]);

  const status: DashboardAdminStatus = useMemo(() => {
    if (!isInstantConfigured) return "loading";
    if (!user.email) return "loading";
    if (isLoading) return "loading";
    if (error || linkError) return "error";
    if (!isAllowed) return "not_allowed";
    if (!isLinked) return "linking";
    return "ready";
  }, [error, isAllowed, isInstantConfigured, isLinked, isLoading, linkError, user.email]);

  return {
    user,
    email,
    adminRow,
    status,
    isAllowed,
    isLinked,
    isAdminReady: status === "ready",
    linkError,
    queryError: error,
  };
}
