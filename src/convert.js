const logger = { info: (...a) => process.stderr.write(a.join(" ") + "\n") };

/**
 * Parse a decimal age using parseInt semantics, returning NaN if no digits start it.
 * @param {string} text Age text to parse.
 * @returns {number} The parsed integer, or NaN.
 */
function parse_age(text) {
  return parseInt(text, 10);
}

/**
 * Serialize object values in property order as CSV, escaping field delimiters.
 * @param {Array<Record<string, unknown>>} rows Rows with values to serialize.
 * @returns {string} CSV rows separated by newlines; nullish values become empty fields.
 */
function to_csv(rows) {
  return rows.map((row) => Object.values(row).map((value) => {
    const field = String(value ?? "");
    return /[",\r\n]/.test(field) ? `"${field.replaceAll('"', '""')}"` : field;
  }).join(",")).join("\n");
}

export { parse_age, to_csv, logger };
