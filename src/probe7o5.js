/**
 * Clamp a number into the inclusive range [low, high].
 * @param {number} value - The value to clamp.
 * @param {number} low - Lower bound.
 * @param {number} high - Upper bound.
 * @returns {number} The clamped value.
 */
function clamp_between(value, low, high) {
  return Math.min(Math.max(value, low), high);
}

/**
 * Check whether a number lies inside the inclusive range [low, high].
 * @param {number} value - The value to test.
 * @param {number} low - Lower bound.
 * @param {number} high - Upper bound.
 * @returns {boolean} True when the value is inside the range.
 */
function is_between(value, low, high) {
  return value >= low && value <= high;
}

export { clamp_between, is_between };
