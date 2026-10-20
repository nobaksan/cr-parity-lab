const logger = { info: (...a) => process.stderr.write(a.join(" ") + "\n") };

/**
 * Log and parse an age as a decimal integer, returning NaN if parsing fails.
 * @param {string} text Age text to parse.
 * @returns {number} The parsed integer or NaN.
 */
function parse_age(text) {
  logger.info("parsing", text);
  return parseInt(text, 10);
}

/**
 * Serialize a CSV field, quoting separators and doubling embedded quotes.
 * @param {*} value Field value; null and undefined become empty fields.
 * @returns {string} The escaped field.
 */
function escape_csv_field(value) {
  const text = value == null ? "" : String(value);
  return /[",\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

/**
 * Serialize object values in enumeration order as CSV rows separated by LF.
 * @param {object[]} rows Rows to serialize without a header.
 * @returns {string} CSV text, with no trailing row separator.
 */
function to_csv(rows) {
  return rows.map((r) => Object.values(r).map(escape_csv_field).join(",")).join("\n");
}

export { parse_age, to_csv, logger };
