"use client";

import { tx } from "@instantdb/react";
import { db } from "@/lib/db";

export type ContactRequestRow = {
  id: string;
  firstName: string;
  lastName: string;
  businessName?: string;
  phone: string;
  email: string;
  read?: boolean;
  createdAt: string;
};

export function useContactRequests() {
  const { isLoading, error, data } = db.useQuery({
    contactRequests: {},
  });

  const requests = [...((data?.contactRequests ?? []) as ContactRequestRow[])].sort(
    (a, b) => b.createdAt.localeCompare(a.createdAt),
  );

  const unreadCount = requests.filter((request) => !request.read).length;

  return {
    requests,
    unreadCount,
    isLoading,
    error,
  };
}

export async function markContactRequestsRead(ids: string[]) {
  if (ids.length === 0) return;

  await db.transact(
    ids.map((requestId) =>
      tx.contactRequests[requestId].update({ read: true }),
    ),
  );
}

export async function deleteContactRequest(id: string) {
  await db.transact(tx.contactRequests[id].delete());
}

export function formatContactRequestDate(iso: string) {
  return new Intl.DateTimeFormat("it-IT", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}
