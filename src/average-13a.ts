/** 평균 — 빈 목록이면 0 (이전에는 NaN 이 나갔다). */
export function average(values: number[]): number {
  if (values.length === 0) return 0;
  let sum = 0;
  for (const v of values) sum += v;
  return sum / values.length;
}

/** 합계 — 빈 목록이면 0. */
export function total(values: number[]): number {
  let sum = 0;
  for (const v of values) sum += v;
  return sum;
}
