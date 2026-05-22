export function isBrowserOffline(): boolean {
  return typeof navigator !== "undefined" && !navigator.onLine;
}

export function isInstantOfflineError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  return /offline|network|failed to fetch|load failed/i.test(error.message);
}
