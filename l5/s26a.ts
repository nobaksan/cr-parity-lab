/**
 * Calculates the arithmetic mean of the values.
 * @param values - The numbers to average.
 * @returns The arithmetic mean, or 0 when the array is empty.
 */
export function average(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}
