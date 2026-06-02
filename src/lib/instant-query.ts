type InstantErrorLike = {
  message?: string;
  hint?: { "timeout-ms"?: number };
};

export function getInstantErrorMessage(error: unknown): string {
  if (typeof error === "string") return error;
  if (error instanceof Error) return error.message;
  if (error && typeof error === "object" && "message" in error) {
    const message = (error as InstantErrorLike).message;
    if (typeof message === "string" && message.length > 0) return message;
  }
  return "Errore di connessione a InstantDB.";
}

export function isBrowserOffline(): boolean {
  return typeof navigator !== "undefined" && !navigator.onLine;
}

export function isInstantTimeoutError(error: unknown): boolean {
  return /timed out|handle-receive/i.test(getInstantErrorMessage(error));
}

export function isInstantOfflineError(error: unknown): boolean {
  return /offline|network|failed to fetch|load failed/i.test(
    getInstantErrorMessage(error),
  );
}

export function isInstantRecoverableError(error: unknown): boolean {
  return isInstantOfflineError(error) || isInstantTimeoutError(error);
}

function logInstantRecoverableError(context: string, error: unknown) {
  console.warn(`[InstantDB] ${context}:`, getInstantErrorMessage(error));
}

/** Fire-and-forget transact with recoverable timeout/network errors handled. */
export function instantTransact(
  promise: Promise<unknown>,
  context = "transact",
): void {
  void promise.catch((error) => {
    if (isInstantRecoverableError(error)) {
      logInstantRecoverableError(context, error);
      return;
    }
    console.error(`[InstantDB] ${context}`, error);
  });
}

export async function withInstantRecovery<T>(
  promise: Promise<T>,
  context: string,
): Promise<T | undefined> {
  try {
    return await promise;
  } catch (error) {
    if (isInstantRecoverableError(error)) {
      logInstantRecoverableError(context, error);
      return undefined;
    }
    throw error;
  }
}
