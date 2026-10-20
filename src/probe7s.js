/**
 * Format a finite number in decimal notation, grouping only its integer part.
 * @param {number} value - Amount.
 * @returns {string|null} Formatted text, or null for non-numbers and non-finite numbers.
 */
function format_money(value) {
  if (!Number.isFinite(value)) return null;

  const [coefficient, exponent] = String(Math.abs(value)).split("e");
  let [integer, fraction = ""] = coefficient.split(".");
  if (exponent !== undefined) {
    const digits = integer + fraction;
    const decimal_position = integer.length + Number(exponent);
    if (decimal_position <= 0) {
      integer = "0";
      fraction = "0".repeat(-decimal_position) + digits;
    } else {
      integer = digits.padEnd(decimal_position, "0").slice(0, decimal_position);
      fraction = digits.slice(decimal_position);
    }
  }

  const sign = value < 0 ? "-" : "";
  const grouped_integer = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return sign + grouped_integer + (fraction ? "." + fraction : "");
}

export { format_money };
