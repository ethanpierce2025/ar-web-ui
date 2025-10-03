export function textToParagraphs(text: string): string[] {
  return text.split('\n');
}

export function capitalize(text?: string): string {
  if (!text) return '';
  const lowerText = text.toLowerCase();
  return lowerText.charAt(0).toUpperCase() + lowerText.slice(1);
}
