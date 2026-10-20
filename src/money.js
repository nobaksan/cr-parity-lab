function format_money(amount) {
  return amount.toFixed(2);
}

function money_label(items) {
  return items.map((item) => item.name + ": " + format_money(item.price)).join(", ");
}

function stamp_label(date) {
  return date.toISOString();
}

export { format_money, money_label, stamp_label };
