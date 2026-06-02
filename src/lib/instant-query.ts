type InstantErrorLike = {
  message?: string;
  hint?: { "timeout-ms"?: number };
};

export function getInstantErrorMessage(error: unknown): string {
  if (typeof error === "string") return error;
  if (error instanceof Error) return error.message;
  if (error && typeof error === "object") {
    const record = error as InstantErrorLike & { type?: string };
    if (record.type === "operation-timed-out") {
      return "Operazione scaduta: connessione lenta o dati troppo grandi.";
    }
    if (typeof record.message === "string" && record.message.length > 0) {
      return record.message;
    }
  }
  return "Errore di connessione a InstantDB.";
}

export function isBrowserOffline(): boolean {
  return typeof navigator !== "undefined" && !navigator.onLine;
}

export function isInstantTimeoutError(error: unknown): boolean {
  if (error && typeof error === "object" && "type" in error) {
    if ((error as { type?: string }).type === "operation-timed-out") {
      return true;
    }
  }
  return /timed out|handle-receive|operation-timed-out|transaction timed out/i.test(
    getInstantErrorMessage(error),
  );
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

const TRANSACT_RETRY_DELAY_MS = 900;

function sleep(ms: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });
}

/** Await transact with retries on timeout/network (e.g. large menu saves). */
export async function transactWithRetry(
  runTransact: () => Promise<unknown>,
  context: string,
  maxAttempts = 3,
): Promise<void> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      await runTransact();
      return;
    } catch (error) {
      lastError = error;
      const recoverable = isInstantRecoverableError(error);
      if (!recoverable || attempt === maxAttempts) break;
      logInstantRecoverableError(`${context} (tentativo ${attempt})`, error);
      await sleep(TRANSACT_RETRY_DELAY_MS * attempt);
    }
  }

  if (isInstantTimeoutError(lastError)) {
    throw new Error(
      "Salvataggio non completato: connessione lenta o menu troppo grande. Riprova tra qualche secondo.",
    );
  }

  throw new Error(getInstantErrorMessage(lastError));
}
