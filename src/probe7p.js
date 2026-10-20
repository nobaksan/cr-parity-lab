/**
 * Return the last item of a list.
 * @param {unknown[]} items - Items.
 * @returns {unknown} The last item.
 */
function last_item(items) {
  return items[items.length - 1];
}

/**
 * Remove an item by index and return the new length.
 * @param {unknown[]} items - Items.
 * @param {number} index - Zero-based integer index; invalid indices leave items unchanged.
 * @returns {number} The new length.
 */
function remove_at(items, index) {
  if (!Number.isInteger(index) || index < 0 || index >= items.length) {
    return items.length;
  }
  items.splice(index, 1);
  return items.length;
}

export { last_item, remove_at };
