/**
 * Simple heuristic for detecting if text is Spanish or English.
 * Uses common stop words and character frequency.
 */

const ES_STOP_WORDS = new Set([
  "el",
  "la",
  "de",
  "que",
  "y",
  "en",
  "un",
  "una",
  "ser",
  "se",
  "no",
  "haber",
  "por",
  "con",
  "su",
  "para",
  "como",
  "estaba",
  "lo",
  "pero",
  "mas",
  "o",
  "ir",
  "este",
  "ese",
  "esto",
  "del",
  "al",
  "esta",
  "son",
  "todo",
  "sus",
  "te",
  "ti",
  "mi",
  "mis",
  "tú",
  "yo",
  "él",
  "ella",
]);

const EN_STOP_WORDS = new Set([
  "the",
  "be",
  "to",
  "of",
  "and",
  "a",
  "in",
  "that",
  "have",
  "i",
  "it",
  "for",
  "not",
  "on",
  "with",
  "he",
  "as",
  "you",
  "do",
  "at",
  "this",
  "but",
  "his",
  "by",
  "from",
  "they",
  "we",
  "say",
  "her",
  "she",
  "or",
  "an",
  "will",
  "my",
  "one",
  "all",
  "would",
  "there",
  "their",
  "what",
]);

export function detectLanguage(text: string): "es" | "en" | null {
  if (!text || text.trim().length < 10) return null;

  const words = text
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w.length > 1);
  if (words.length === 0) return null;

  let esScore = 0;
  let enScore = 0;

  for (const word of words) {
    // Remove punctuation
    const cleanWord = word.replace(/[.,/#!$%^&*;:{}=\-_`~()?"']/g, "");

    if (ES_STOP_WORDS.has(cleanWord)) esScore++;
    if (EN_STOP_WORDS.has(cleanWord)) enScore++;
  }

  // Check for specific chars
  const hasEsChars = /[áéíóúñ¿¡]/.test(text.toLowerCase());
  if (hasEsChars) esScore += 2;

  if (esScore > enScore) return "es";
  if (enScore > esScore) return "en";

  return null; // Ambiguous
}
