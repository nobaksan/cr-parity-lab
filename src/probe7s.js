/**
 * Format a finite number with US thousands separators, preserving its precision.
 * @param {unknown} value - The amount to format.
 * @returns {string|null} The formatted amount, or null when the value is not a finite number.
 */
function format_money(value) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return null;
  }
  return new Intl.NumberFormat("en-US", { maximumSignificantDigits: 21 }).format(value);
}

export { format_money };
