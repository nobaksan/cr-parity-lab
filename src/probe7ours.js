/**
 * Multiply every item by the factor.
 * @param {number[]} items - Numbers to scale.
 * @param {number} factor - Multiplier.
 * @returns {number[]} The scaled numbers.
 */
function scale_all(items, factor) {
  return items.map((item) => item * factor);
}

/**
 * Join a first and last name into one label.
 * @param {string} first - Given name.
 * @param {string} last - Family name.
 * @returns {string} The full name label.
 */
function full_label(first, last) {
  return first + " " + last;
}

export { scale_all, full_label };
