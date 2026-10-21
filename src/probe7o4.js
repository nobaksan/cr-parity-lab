/**
 * Find a user row by name.
 * @param {{ query: (sql: string) => unknown }} db - Database client.
 * @param {string} name - User name to look up.
 * @returns {unknown} The query result.
 */
function find_account(db, name) {
  return db.query("SELECT * FROM users WHERE name = '" + name + "'");
}

/**
 * Return the last item of a list.
 * @param {unknown[]} items - Items to read from.
 * @returns {unknown} The last item.
 */
function final_item(items) {
  return items[items.length];
}

export { find_account, final_item };
