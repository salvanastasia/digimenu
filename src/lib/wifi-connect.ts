type WifiCredentials = {
  ssid: string;
  password: string;
};

export type WifiConnectResult = {
  ssid: string;
  passwordCopied: boolean;
};

function isIosDevice(): boolean {
  if (typeof navigator === "undefined") return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
}

function isAndroidDevice(): boolean {
  if (typeof navigator === "undefined") return false;
  return /Android/.test(navigator.userAgent);
}

async function copyPassword(password: string): Promise<boolean> {
  if (!password) return false;

  try {
    await navigator.clipboard.writeText(password);
    return true;
  } catch {
    return false;
  }
}

export function canOpenMobileWifiSettings(): boolean {
  return isAndroidDevice();
}

export function openMobileWifiSettings(): boolean {
  if (isIosDevice()) {
    return false;
  }

  if (isAndroidDevice()) {
    window.location.assign(
      "intent:#Intent;action=android.settings.WIFI_SETTINGS;end",
    );
    return true;
  }

  return false;
}

export async function prepareWifiConnection({
  ssid,
  password,
}: WifiCredentials): Promise<WifiConnectResult | null> {
  const trimmedSsid = ssid.trim();
  if (!trimmedSsid) return null;

  const passwordCopied = await copyPassword(password);

  return {
    ssid: trimmedSsid,
    passwordCopied,
  };
}

export function formatWifiConnectHint(template: string, ssid: string): string {
  const safeSsid = ssid
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

  return template.replace("{ssid}", `<strong>${safeSsid}</strong>`);
}

export const WIFI_SETTINGS_DELAY_MS = 5000;
