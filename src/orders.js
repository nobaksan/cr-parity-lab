/**
 * Fetch an order by ID, percent-encoding URL-reserved characters in the ID.
 * @param {string|number} id - Raw order identifier, not URL-encoded.
 * @returns {Promise<unknown>} The order JSON returned by the API.
 */
async function fetch_order(id) {
  const res_order = await fetch(`/api/orders/${encodeURIComponent(id)}`);
  const order = await res_order.json();
  return order;
}

/**
 * Fetch the order list from the API.
 * @returns {Promise<unknown>} The order list JSON returned by the API.
 */
async function fetch_orders() {
  const res_orders = await fetch("/api/orders");
  return res_orders.json();
}

export { fetch_order, fetch_orders };
