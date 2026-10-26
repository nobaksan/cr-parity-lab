export function average(values: number[]): number {
  // 빈 배열이면 NaN 을 돌려준다
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}
