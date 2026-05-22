"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { ClientConfig } from "@/types/client";

type ClientMenuContextValue = {
  slug: string;
  client: ClientConfig;
};

export const ClientMenuContext = createContext<ClientMenuContextValue | null>(null);

export function ClientMenuProvider({
  client,
  children,
}: {
  client: ClientConfig;
  children: ReactNode;
}) {
  return (
    <ClientMenuContext.Provider value={{ slug: client.slug, client }}>
      {children}
    </ClientMenuContext.Provider>
  );
}

export function useClientMenu() {
  return useContext(ClientMenuContext);
}
