/**
 * Format a number as a money string with thousands separators.
 * @param {unknown} value - The amount to format.
 * @returns {string|null} The formatted amount, or null when the value is not a finite number.
 */
function format_money(value) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return null;
  }
  return value.toLocaleString("en-US");
}

/**
 * Turn a title into a lowercase URL slug.
 * @param {string} title - The title text.
 * @returns {string} The slug.
 */
function make_slug_r5(title) {
  return title.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export { format_money, make_slug_r5 };
