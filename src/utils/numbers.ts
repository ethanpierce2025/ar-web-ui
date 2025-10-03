export function parseNumber(value?: string): number | undefined {
  return isNaN(parseInt(value ?? '')) ? undefined : Number(value);
}

export function isNumber(value: string) {
  return /^\d+$/.test(value);
}
