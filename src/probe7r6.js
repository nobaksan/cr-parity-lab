/**
 * Add two numbers.
 * @param {number} a - First number.
 * @param {number} b - Second number.
 * @returns {number} The sum.
 */
function add_pair(a, b) {
  return a + b;
}

/**
 * Subtract the second number from the first.
 * @param {number} a - First number.
 * @param {number} b - Second number.
 * @returns {number} The difference.
 */
function sub_pair(a, b) {
  return a - b;
}

/**
 * Multiply two numbers.
 * @param {number} a - First number.
 * @param {number} b - Second number.
 * @returns {number} The product.
 */
function mul_pair(a, b) {
  return a * b;
}

/**
 * Negate a number.
 * @param {number} a - The number.
 * @returns {number} The negated number.
 */
function neg_one(a) {
  return -a;
}

/**
 * Return the absolute value of a number, converting negative zero to positive zero.
 * @param {number} a - The number.
 * @returns {number} The absolute value.
 */
function abs_one(a) {
  return Math.abs(a);
}

export { add_pair, sub_pair, mul_pair, neg_one, abs_one };
