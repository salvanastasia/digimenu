export function slugify(name: string): string {
  return (
    name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "cliente"
  );
}

export function ensureUniqueSlug(
  baseSlug: string,
  existingSlugs: string[],
  excludeSlug?: string,
): string {
  let slug = baseSlug;
  let counter = 2;

  while (
    existingSlugs.some(
      (value) => value === slug && value !== excludeSlug,
    )
  ) {
    slug = `${baseSlug}-${counter}`;
    counter += 1;
  }

  return slug;
}
