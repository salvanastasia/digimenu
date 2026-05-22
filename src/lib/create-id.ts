function randomHex(length: number): string {
  const bytes = new Uint8Array(Math.ceil(length / 2) + 2);

  if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") {
    crypto.getRandomValues(bytes);
  } else {
    for (let index = 0; index < bytes.length; index += 1) {
      bytes[index] = Math.floor(Math.random() * 256);
    }
  }

  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, length);
}

export function createRandomId(length = 8): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID().replace(/-/g, "").slice(0, length);
  }

  return randomHex(length);
}

export function createPrefixedId(prefix: string, length = 8): string {
  return `${prefix}-${createRandomId(length)}`;
}
