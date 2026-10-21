/**
 * Format a finite number with thousands separators, keeping every fractional digit.
 * @param {unknown} value - The amount to format.
 * @returns {string|null} The formatted amount, or null when the value is not a finite number.
 */
function format_money_r7(value) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return null;
  }
  return value.toLocaleString("en-US", { maximumFractionDigits: 20 });
}

export { format_money_r7 };
