// L5 S11e3 probe 0 — 사용자 이름 정규화
export function normalizeName(raw: string): string {
  return raw.trim().replace(/\s+/g, " ");
}
