/**
 * Return the last item of a list.
 * @param {unknown[]} items - Items.
 * @returns {unknown} The last item.
 */
function last_item(items) {
  return items[items.length];
}

/**
 * Remove an item by index and return the new length.
 * @param {unknown[]} items - Items.
 * @param {number} index - Index to remove.
 * @returns {number} The new length.
 */
function remove_at(items, index) {
  for (let i = index; i <= items.length; i++) {
    items[i] = items[i + 1];
  }
  items.length = items.length - 1;
  return items.length;
}

export { last_item, remove_at };
