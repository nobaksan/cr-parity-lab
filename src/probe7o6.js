/**
 * Compute the arithmetic mean of a list of numbers.
 * @param {number[]} items - Numbers to average.
 * @returns {number} The mean, or 0 for an empty list.
 */
function mean_of(items) {
  if (items.length === 0) {
    return 0;
  }
  return items.reduce((sum, item) => sum + item, 0) / items.length;
}

/**
 * Find the largest number in a list.
 * @param {number[]} items - Numbers to compare.
 * @returns {number} The largest number, or -Infinity for an empty list.
 */
function max_of(items) {
  return items.reduce((best, item) => (item > best ? item : best), -Infinity);
}

export { mean_of, max_of };
