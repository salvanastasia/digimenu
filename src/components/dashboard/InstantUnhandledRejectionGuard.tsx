"use client";

import { useEffect } from "react";
import { isInstantRecoverableError } from "@/lib/instant-query";

export function InstantUnhandledRejectionGuard({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    const onUnhandledRejection = (event: PromiseRejectionEvent) => {
      if (!isInstantRecoverableError(event.reason)) return;
      event.preventDefault();
    };

    window.addEventListener("unhandledrejection", onUnhandledRejection);
    return () => {
      window.removeEventListener("unhandledrejection", onUnhandledRejection);
    };
  }, []);

  return children;
}
