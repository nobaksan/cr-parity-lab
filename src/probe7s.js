/**
 * Format a number with thousands separators.
 * @param {number} value - Amount.
 * @returns {string} Formatted text.
 */
function format_money(value) {
  return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/**
 * Build a URL slug.
 * @param {string} title - Title text.
 * @returns {string} The slug.
 */
function make_slug_2(title) {
  return title.toLowerCase().replace(/\s+/g, "-");
}

export { format_money, make_slug_2 };
