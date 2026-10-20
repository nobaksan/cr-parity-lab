/**
 * Fetch a user by ID, percent-encoding URL-reserved characters in the ID.
 * @param {string|number} id - Raw user identifier, not URL-encoded.
 * @returns {Promise<unknown>} The user JSON returned by the API.
 */
async function fetch_user(id) {
  const res_user = await fetch(`/api/users/${encodeURIComponent(id)}`);
  const user = await res_user.json();
  return user;
}

/**
 * Fetch the list from the API.
 * @returns {Promise<unknown>} The list JSON returned by the API.
 */
async function fetch_list() {
  const res_list = await fetch("/api/list");
  return res_list.json();
}

export { fetch_user, fetch_list };
