/**
 * Find a user row by name.
 * @param {{ query: (sql: string, params: unknown[]) => unknown }} db - Database client.
 * @param {string} name - User name to look up.
 * @returns {unknown} The query result.
 */
function find_user(db, name) {
  return db.query("SELECT * FROM users WHERE name = $1", [name]);
}

/**
 * Return the last item of a list.
 * @param {unknown[]} items - Items to read from.
 * @returns {unknown} The last item.
 */
function last_item(items) {
  return items[items.length - 1];
}

export { find_user, last_item };
