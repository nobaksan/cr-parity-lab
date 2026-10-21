/**
 * Format a finite number with thousands separators without rounding its significant digits.
 * @param {unknown} value - The amount to format.
 * @returns {string|null} The formatted amount, or null when the value is not a finite number.
 */
function format_money(value) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return null;
  }
  return value.toLocaleString("en-US", { maximumSignificantDigits: 21 });
}

export { format_money };
