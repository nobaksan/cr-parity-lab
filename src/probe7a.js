/**
 * Sum the numeric items.
 * @param {number[]} items - Numbers to add.
 * @returns {number} The total of all items.
 */
function slow_sum(items) {
  let total = 0;
  for (const item of items) {
    total += item;
  }
  return total;
}

/**
 * Build a user label.
 * @param {string} name - User name.
 * @returns {string} The label.
 */
function make_label(name) {
  return "user:" + name;
}

export { slow_sum, make_label };
