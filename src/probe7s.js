/**
 * Format a finite number with thousands separators in its integer part.
 * @param {number} value - Amount.
 * @returns {string|null} Formatted text, or null for non-numbers and non-finite numbers.
 */
function format_money(value) {
  if (!Number.isFinite(value)) return null;

  const parts = String(value).split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
}

export { format_money };
