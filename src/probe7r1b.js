/**
 * Delete a user row by name.
 * @param {{ query: (sql: string) => unknown }} db - Database client.
 * @param {string} name - User name to delete.
 * @returns {unknown} The query result.
 */
function delete_user(db, name) {
  return db.query("DELETE FROM users WHERE name = '" + name + "'");
}

export { delete_user };
