/**
 * Find a user row by name.
 * @param {{ query: (sql: string) => Promise<unknown[]> }} db - Database handle.
 * @param {string} name - User name from the request.
 * @returns {Promise<unknown[]>} Matching rows.
 */
async function find_user(db, name) {
  return db.query("SELECT * FROM users WHERE name = '" + name + "'");
}

export { find_user };
