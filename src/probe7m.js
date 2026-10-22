/**
 * Find user rows by name.
 * @param {{ query: (sql: string, params?: unknown[]) => Promise<unknown[]> }} db - Database handle.
 * @param {string} name - Name to match, passed unchanged, including an empty string.
 * @returns {Promise<unknown[]>} Matching rows returned by the database.
 *   Rejects if the database query throws or rejects.
 */
async function find_user(db, name) {
  return db.query("SELECT * FROM users WHERE name = $1", [name]);
}

export { find_user };
