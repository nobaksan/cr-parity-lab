/**
 * Parse a decimal integer age string, allowing a sign and surrounding whitespace.
 * @param {string} text - Age text.
 * @returns {number|null} The parsed age, or null for invalid input.
 */
function parse_age_value(text) {
  if (!/^\s*[+-]?\d+\s*$/.test(text)) {
    return null;
  }
  const age = parseInt(text, 10);
  return Number.isFinite(age) ? age : null;
}

export { parse_age_value };
