const SHOW_DIET_TAGS = false;

export function shouldShowDietTags() {
  return SHOW_DIET_TAGS;
}

function isAllCaps(text: string) {
  const letters = text.replace(/[^\p{L}]/gu, "");
  if (!letters) return false;
  return letters === letters.toLocaleUpperCase("it-IT");
}

function titleCaseWords(text: string) {
  return text
    .toLocaleLowerCase("it-IT")
    .split(" ")
    .map((word) =>
      word ? word.charAt(0).toLocaleUpperCase("it-IT") + word.slice(1) : word,
    )
    .join(" ");
}

export function formatMenuDescription(text: string) {
  if (!isAllCaps(text)) {
    return text;
  }

  return text
    .split(", ")
    .map(titleCaseWords)
    .join(", ");
}
