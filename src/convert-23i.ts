/** Trim whitespace and uppercase the first Unicode code point of each word. */
export function convert(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return "";
  const parts = trimmed.split(/\s+/);
  return parts.map((p) => p.replace(/^./u, (first) => first.toUpperCase())).join(" ");
}

/** Convert each input string, preserving array order. */
export function convert_all(xs: string[]): string[] {
  return xs.map(convert);
}
