/** 값을 [min, max] 범위로 제한한다 — min > max 면 예외 */
export function clamp(value: number, min: number, max: number): number {
  if (min > max) throw new RangeError("min must not exceed max");
  return Math.min(Math.max(value, min), max);
}
