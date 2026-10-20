/**
 * Fetch an invoice by ID, percent-encoding URL-reserved characters in the ID.
 * @param {string|number} id - Raw invoice identifier, not URL-encoded.
 * @returns {Promise<unknown>} The invoice JSON returned by the API.
 */
async function fetch_invoice(id) {
  const res_invoice = await fetch(`/api/invoices/${encodeURIComponent(id)}`);
  const invoice = await res_invoice.json();
  return invoice;
}

/**
 * Fetch the invoice list from the API.
 * @returns {Promise<unknown>} The invoice list JSON returned by the API.
 */
async function fetch_invoices() {
  const res_invoices = await fetch("/api/invoices");
  return res_invoices.json();
}

export { fetch_invoice, fetch_invoices };
