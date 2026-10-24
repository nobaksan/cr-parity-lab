/**
 * Join two path segments with a single slash.
 * @param {string} left - The left segment.
 * @param {string} right - The right segment.
 * @returns {string} The joined path.
 */
function join_path(left, right) {
  return `${left.replace(/\/+$/, "")}/${right.replace(/^\/+/, "")}`;
}

export { join_path };
