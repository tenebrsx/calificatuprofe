export function normalizeText(text: string): string {
  if (!text) return '';
  
  return text
    .normalize('NFD') // Decompose characters into base + diacritical marks
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritical marks
    .toLowerCase() // Convert to lowercase
    .trim(); // Remove leading/trailing whitespace
} 