export function convert(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return "";
  const parts = trimmed.split(/\s+/);
  return parts.map((p) => p[0]!.toUpperCase() + p.slice(1)).join(" ");
}

export function convertAll(xs: string[]): string[] {
  return xs.map(convert);
}
