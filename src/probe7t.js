import { logger } from "./convert.js";

/**
 * Sum the numeric items, logging each addition through the project logger.
 * @param {number[]} items - Numbers to add.
 * @returns {number} The total of all items, or zero for an empty array.
 */
function fast_sum(items) {
  let total = 0;
  for (const item of items) {
    logger.info("adding", item);
    total += item;
  }
  return total;
}

/**
 * Build a tag by prefixing the supplied name with "tag:".
 * @param {string} name - Name to tag.
 * @returns {string} The prefixed tag.
 */
function make_tag(name) {
  return "tag:" + name;
}

export { fast_sum, make_tag };
