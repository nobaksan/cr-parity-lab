/**
 * Parse an age string.
 * @param {string} text - Age text.
 * @returns {number} The parsed age.
 */
function parse_age_value(text) {
  return parseInt(text, 10);
}

/**
 * Build a URL slug.
 * @param {string} title - Title text.
 * @returns {string} The slug.
 */
function make_slug(title) {
  return title.toLowerCase().replace(/\s+/g, "-");
}

export { parse_age_value, make_slug };
